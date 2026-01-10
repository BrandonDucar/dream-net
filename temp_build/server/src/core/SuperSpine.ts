/**
 * Super Spine - Agent Orchestration Backbone
 * 
 * The central nervous system that coordinates all agents:
 * - Agent discovery and registration
 * - Task routing and load balancing
 * - Agent health monitoring
 * - Inter-agent communication
 * - Agent marketplace and subscriptions
 * 
 * PERSISTENCE:
 * - Primary: PostgreSQL database (Cloud SQL/AlloyDB for Cloud Run)
 * - Fallback: In-memory storage (if database unavailable)
 * - Future: Persistent disk for Compute Engine deployments
 */

import { randomUUID } from "node:crypto";
import type { Agent } from '@dreamnet/shared';
import { isDbAvailable, getDb } from "../db";
import { superSpineAgents, superSpineTasks, superSpineSubscriptions } from '@dreamnet/shared';
import { eq, and, gt } from "drizzle-orm";

export type AgentStatus = "idle" | "active" | "busy" | "error" | "offline";
export type AgentCapability = "code" | "design" | "analysis" | "communication" | "funding" | "deployment";

export interface AgentNode {
  id: string;
  agentKey: string;
  name: string;
  status: AgentStatus;
  capabilities: AgentCapability[];
  currentTask?: string;
  taskQueue: string[];
  health: {
    uptime: number;
    successRate: number;
    avgResponseTime: number;
    errorCount: number;
  };
  metadata: {
    tier: "Standard" | "Premium" | "Nightmare";
    unlock: string;
    subscriptionRequired?: boolean;
    price?: {
      amount: number;
      currency: string;
      period: "monthly" | "yearly";
    };
  };
  registeredAt: string;
  lastActiveAt: string;
}

export interface Task {
  id: string;
  userId?: string;
  agentKey: string;
  type: string;
  input: Record<string, unknown>;
  status: "pending" | "assigned" | "processing" | "completed" | "failed";
  result?: unknown;
  error?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface AgentSubscription {
  id: string;
  userId: string;
  agentKey: string;
  status: "active" | "expired" | "cancelled";
  startedAt: string;
  expiresAt: string;
  price: {
    amount: number;
    currency: string;
  };
}

class SuperSpine {
  private agents: Map<string, AgentNode> = new Map();
  private tasks: Map<string, Task> = new Map();
  private subscriptions: Map<string, AgentSubscription> = new Map();
  private useDatabase: boolean = false;
  private initialized: boolean = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize Super Spine with persistence
   */
  private async initialize(): Promise<void> {
    this.useDatabase = isDbAvailable();
    
    if (this.useDatabase) {
      console.log("[Super Spine] 🗄️  Using database persistence");
      await this.loadFromDatabase();
    } else {
      console.log("[Super Spine] 💾 Using in-memory storage (database unavailable)");
    }

    // Always initialize core agents (will be persisted if DB available)
    this.initializeCoreAgents();
    this.startHealthMonitoring();
    this.initialized = true;
  }

  /**
   * Load agents, tasks, and subscriptions from database
   */
  private async loadFromDatabase(): Promise<void> {
    try {
      const db = getDb();

      // Load agents
      const agentRecords = await db.select().from(superSpineAgents);
      for (const record of agentRecords) {
        const node: AgentNode = {
          id: record.id,
          agentKey: record.agentKey,
          name: record.name,
          status: record.status as AgentStatus,
          capabilities: record.capabilities as AgentCapability[],
          currentTask: record.currentTask || undefined,
          taskQueue: record.taskQueue || [],
          health: record.health as AgentNode["health"],
          metadata: record.metadata as AgentNode["metadata"],
          registeredAt: record.registeredAt.toISOString(),
          lastActiveAt: record.lastActiveAt.toISOString(),
        };
        this.agents.set(record.agentKey, node);
      }

      // Load tasks
      const taskRecords = await db.select().from(superSpineTasks);
      for (const record of taskRecords) {
        const task: Task = {
          id: record.id,
          userId: record.userId || undefined,
          agentKey: record.agentKey,
          type: record.type,
          input: record.input as Record<string, unknown>,
          status: record.status as Task["status"],
          result: record.result as unknown,
          error: record.error || undefined,
          createdAt: record.createdAt.toISOString(),
          startedAt: record.startedAt?.toISOString(),
          completedAt: record.completedAt?.toISOString(),
        };
        this.tasks.set(record.id, task);
      }

      // Load subscriptions
      const subscriptionRecords = await db.select().from(superSpineSubscriptions);
      for (const record of subscriptionRecords) {
        const subscription: AgentSubscription = {
          id: record.id,
          userId: record.userId,
          agentKey: record.agentKey,
          status: record.status as AgentSubscription["status"],
          startedAt: record.startedAt.toISOString(),
          expiresAt: record.expiresAt.toISOString(),
          price: record.price as AgentSubscription["price"],
        };
        this.subscriptions.set(record.id, subscription);
      }

      console.log(`[Super Spine] ✅ Loaded ${agentRecords.length} agents, ${taskRecords.length} tasks, ${subscriptionRecords.length} subscriptions from database`);
    } catch (error) {
      console.error("[Super Spine] ❌ Failed to load from database:", error);
      this.useDatabase = false;
    }
  }

  /**
   * Save agent to database
   */
  private async saveAgent(agent: AgentNode): Promise<void> {
    if (!this.useDatabase) return;

    try {
      const db = getDb();
      const existing = await db.select().from(superSpineAgents).where(eq(superSpineAgents.agentKey, agent.agentKey)).limit(1);

      if (existing.length > 0) {
        // Update existing
        await db.update(superSpineAgents)
          .set({
            name: agent.name,
            status: agent.status,
            capabilities: agent.capabilities,
            currentTask: agent.currentTask || null,
            taskQueue: agent.taskQueue,
            health: agent.health,
            metadata: agent.metadata,
            lastActiveAt: new Date(agent.lastActiveAt),
          })
          .where(eq(superSpineAgents.agentKey, agent.agentKey));
      } else {
        // Insert new
        await db.insert(superSpineAgents).values({
          id: agent.id,
          agentKey: agent.agentKey,
          name: agent.name,
          status: agent.status,
          capabilities: agent.capabilities,
          currentTask: agent.currentTask || null,
          taskQueue: agent.taskQueue,
          health: agent.health,
          metadata: agent.metadata,
          registeredAt: new Date(agent.registeredAt),
          lastActiveAt: new Date(agent.lastActiveAt),
        });
      }
    } catch (error) {
      console.error(`[Super Spine] ❌ Failed to save agent ${agent.agentKey}:`, error);
    }
  }

  /**
   * Save task to database
   */
  private async saveTask(task: Task): Promise<void> {
    if (!this.useDatabase) return;

    try {
      const db = getDb();
      const existing = await db.select().from(superSpineTasks).where(eq(superSpineTasks.id, task.id)).limit(1);

      if (existing.length > 0) {
        // Update existing
        await db.update(superSpineTasks)
          .set({
            status: task.status,
            result: task.result ? JSON.parse(JSON.stringify(task.result)) : null,
            error: task.error || null,
            startedAt: task.startedAt ? new Date(task.startedAt) : null,
            completedAt: task.completedAt ? new Date(task.completedAt) : null,
          })
          .where(eq(superSpineTasks.id, task.id));
      } else {
        // Insert new
        await db.insert(superSpineTasks).values({
          id: task.id,
          userId: task.userId || null,
          agentKey: task.agentKey,
          type: task.type,
          input: task.input,
          status: task.status,
          result: task.result ? JSON.parse(JSON.stringify(task.result)) : null,
          error: task.error || null,
          createdAt: new Date(task.createdAt),
          startedAt: task.startedAt ? new Date(task.startedAt) : null,
          completedAt: task.completedAt ? new Date(task.completedAt) : null,
        });
      }
    } catch (error) {
      console.error(`[Super Spine] ❌ Failed to save task ${task.id}:`, error);
    }
  }

  /**
   * Save subscription to database
   */
  private async saveSubscription(subscription: AgentSubscription): Promise<void> {
    if (!this.useDatabase) return;

    try {
      const db = getDb();
      await db.insert(superSpineSubscriptions).values({
        id: subscription.id,
        userId: subscription.userId,
        agentKey: subscription.agentKey,
        status: subscription.status,
        startedAt: new Date(subscription.startedAt),
        expiresAt: new Date(subscription.expiresAt),
        price: subscription.price,
      });
    } catch (error) {
      console.error(`[Super Spine] ❌ Failed to save subscription ${subscription.id}:`, error);
    }
  }

  /**
   * Initialize core agents from shared/agents.ts
   */
  private initializeCoreAgents(): void {
    const coreAgents: Agent[] = [
      { name: "LUCID", tier: "Standard", unlock: "Default", key: "lucid" },
      { name: "CANVAS", tier: "Standard", unlock: "Default", key: "canvas" },
      { name: "ROOT", tier: "Standard", unlock: "Trust Score > 60", key: "root" },
      { name: "CRADLE", tier: "Premium", unlock: "Trust Score > 80 or Token Boost", key: "cradle" },
      { name: "WING", tier: "Premium", unlock: "Stake 1000 $SHEEP or complete 10 dreams", key: "wing" },
    ];

    for (const agent of coreAgents) {
      // Only create if not already loaded from database
      if (!this.agents.has(agent.key)) {
        const node: AgentNode = {
          id: randomUUID(),
          agentKey: agent.key,
          name: agent.name,
          status: "idle",
          capabilities: this.getCapabilitiesForAgent(agent.key),
          taskQueue: [],
          health: {
            uptime: 100,
            successRate: 100,
            avgResponseTime: 0,
            errorCount: 0,
          },
          metadata: {
            tier: agent.tier,
            unlock: agent.unlock,
            subscriptionRequired: agent.tier === "Premium",
            price:
              agent.tier === "Premium"
                ? {
                    amount: agent.key === "cradle" ? 50 : 30,
                    currency: "DREAM",
                    period: "monthly",
                  }
                : undefined,
          },
          registeredAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        };

        this.agents.set(agent.key, node);
        this.saveAgent(node); // Persist immediately
      }
    }

    // Register Wolf Pack if not exists
    if (!this.agents.has("wolf-pack")) {
      const wolfPackNode: AgentNode = {
        id: randomUUID(),
        agentKey: "wolf-pack",
        name: "Wolf Pack",
        status: "idle",
        capabilities: ["funding", "communication", "analysis"],
        taskQueue: [],
        health: {
          uptime: 100,
          successRate: 100,
          avgResponseTime: 0,
          errorCount: 0,
        },
        metadata: {
          tier: "Premium",
          unlock: "Premium Subscription",
          subscriptionRequired: true,
          price: {
            amount: 100,
            currency: "DREAM",
            period: "monthly",
          },
        },
        registeredAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };
      this.agents.set("wolf-pack", wolfPackNode);
      this.saveAgent(wolfPackNode); // Persist immediately
    }
  }

  /**
   * Get capabilities for an agent
   */
  private getCapabilitiesForAgent(agentKey: string): AgentCapability[] {
    const capabilities: Record<string, AgentCapability[]> = {
      lucid: ["code", "analysis"],
      canvas: ["design", "code"],
      root: ["code", "analysis"],
      echo: ["analysis"],
      cradle: ["code", "analysis"],
      wing: ["communication"],
      "wolf-pack": ["funding", "communication", "analysis"],
    };
    return capabilities[agentKey] || [];
  }

  /**
   * Register a new agent
   */
  registerAgent(
    agentKey: string,
    name: string,
    capabilities: AgentCapability[],
    metadata: AgentNode["metadata"],
  ): AgentNode {
    const node: AgentNode = {
      id: randomUUID(),
      agentKey,
      name,
      status: "idle",
      capabilities,
      taskQueue: [],
      health: {
        uptime: 100,
        successRate: 100,
        avgResponseTime: 0,
        errorCount: 0,
      },
      metadata,
      registeredAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    this.agents.set(agentKey, node);
    this.saveAgent(node); // Persist immediately
    return node;
  }

  /**
   * Get agent node
   */
  getAgent(agentKey: string): AgentNode | undefined {
    return this.agents.get(agentKey);
  }

  /**
   * Get all agents
   */
  getAllAgents(): AgentNode[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get available agents (not busy, not offline)
   */
  getAvailableAgents(capability?: AgentCapability): AgentNode[] {
    let agents = Array.from(this.agents.values()).filter(
      (a) => a.status !== "offline" && a.status !== "error",
    );

    if (capability) {
      agents = agents.filter((a) => a.capabilities.includes(capability));
    }

    return agents;
  }

  /**
   * Check if user has access to agent (unlock + subscription)
   */
  checkAgentAccess(
    agentKey: string,
    userId: string,
    trustScore: number,
    completedDreams: number,
    stakedSheep: number,
    hasTokenBoost: boolean = false,
  ): { hasAccess: boolean; reason?: string } {
    const agent = this.agents.get(agentKey);
    if (!agent) {
      return { hasAccess: false, reason: "Agent not found" };
    }

    // Check unlock requirements (from shared/agents.ts logic)
    if (agentKey === "root" && trustScore <= 60) {
      return { hasAccess: false, reason: "Trust Score > 60 required" };
    }
    if (agentKey === "cradle" && trustScore <= 80 && !hasTokenBoost) {
      return { hasAccess: false, reason: "Trust Score > 80 or Token Boost required" };
    }
    if (agentKey === "wing" && stakedSheep < 1000 && completedDreams < 10) {
      return { hasAccess: false, reason: "Stake 1000 $SHEEP or complete 10 dreams" };
    }

    // Check subscription for premium agents
    if (agent.metadata.subscriptionRequired) {
      const subscription = this.getUserSubscription(userId, agentKey);
      if (!subscription || subscription.status !== "active") {
        return {
          hasAccess: false,
          reason: "Premium subscription required",
        };
      }
    }

    return { hasAccess: true };
  }

  /**
   * Create agent subscription
   */
  createSubscription(
    userId: string,
    agentKey: string,
    period: "monthly" | "yearly" = "monthly",
  ): AgentSubscription | null {
    const agent = this.agents.get(agentKey);
    if (!agent || !agent.metadata.price) {
      return null;
    }

    const now = new Date();
    const expiresAt = new Date(now);
    if (period === "monthly") {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    const subscription: AgentSubscription = {
      id: randomUUID(),
      userId,
      agentKey,
      status: "active",
      startedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      price: {
        amount: agent.metadata.price.amount * (period === "yearly" ? 10 : 1),
        currency: agent.metadata.price.currency,
      },
    };

    this.subscriptions.set(subscription.id, subscription);
    this.saveSubscription(subscription); // Persist immediately
    return subscription;
  }

  /**
   * Get user's subscription for an agent
   */
  getUserSubscription(userId: string, agentKey: string): AgentSubscription | undefined {
    const now = new Date();
    return Array.from(this.subscriptions.values()).find(
      (sub) =>
        sub.userId === userId &&
        sub.agentKey === agentKey &&
        sub.status === "active" &&
        new Date(sub.expiresAt) > now,
    );
  }

  /**
   * Submit a task to an agent
   */
  submitTask(
    agentKey: string,
    type: string,
    input: Record<string, unknown>,
    userId?: string,
  ): Task {
    const task: Task = {
      id: randomUUID(),
      userId,
      agentKey,
      type,
      input,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    this.tasks.set(task.id, task);
    this.saveTask(task); // Persist immediately

    // Add to agent's queue
    const agent = this.agents.get(agentKey);
    if (agent) {
      agent.taskQueue.push(task.id);
      if (agent.status === "idle") {
        agent.status = "active";
      }
      this.saveAgent(agent); // Persist agent update
    }

    return task;
  }

  /**
   * Get task by ID
   */
  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Get user's tasks
   */
  getUserTasks(userId: string): Task[] {
    return Array.from(this.tasks.values()).filter((t) => t.userId === userId);
  }

  /**
   * Start health monitoring loop
   */
  private startHealthMonitoring(): void {
    setInterval(() => {
      for (const agent of this.agents.values()) {
        // Update last active if agent has been processing tasks
        if (agent.status === "active" || agent.status === "busy") {
          agent.lastActiveAt = new Date().toISOString();
          this.saveAgent(agent); // Persist health updates
        }

        // Check if agent should be marked offline (no activity for 5 minutes)
        const lastActive = new Date(agent.lastActiveAt);
        const now = new Date();
        if (now.getTime() - lastActive.getTime() > 5 * 60 * 1000) {
          if (agent.status !== "offline") {
            agent.status = "offline";
            this.saveAgent(agent); // Persist status change
          }
        }
      }
    }, 60000); // Check every minute
  }

  /**
   * Get agent statistics
   */
  getAgentStats(agentKey: string): {
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    avgResponseTime: number;
    activeSubscriptions: number;
  } | null {
    const agent = this.agents.get(agentKey);
    if (!agent) return null;

    const tasks = Array.from(this.tasks.values()).filter((t) => t.agentKey === agentKey);
    const completed = tasks.filter((t) => t.status === "completed");
    const failed = tasks.filter((t) => t.status === "failed");

    const activeSubscriptions = Array.from(this.subscriptions.values()).filter(
      (sub) => sub.agentKey === agentKey && sub.status === "active",
    ).length;

    return {
      totalTasks: tasks.length,
      completedTasks: completed.length,
      failedTasks: failed.length,
      avgResponseTime: agent.health.avgResponseTime,
      activeSubscriptions,
    };
  }

  /**
   * Get persistence status
   */
  getPersistenceStatus(): {
    usingDatabase: boolean;
    initialized: boolean;
    agentCount: number;
    taskCount: number;
    subscriptionCount: number;
  } {
    return {
      usingDatabase: this.useDatabase,
      initialized: this.initialized,
      agentCount: this.agents.size,
      taskCount: this.tasks.size,
      subscriptionCount: this.subscriptions.size,
    };
  }
}

// Export singleton
export const superSpine = new SuperSpine();
