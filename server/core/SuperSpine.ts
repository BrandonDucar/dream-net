/**
 * Super Spine - Agent Orchestration Backbone
 * 
 * The central nervous system that coordinates all agents:
 * - Agent discovery and registration
 * - Task routing and load balancing
 * - Agent health monitoring
 * - Inter-agent communication
 * - Agent marketplace and subscriptions
 */

import { randomUUID } from "node:crypto";
import type { Agent } from "../../shared/agents";

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

  constructor() {
    this.initializeCoreAgents();
    this.startHealthMonitoring();
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
    }

    // Register Wolf Pack
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

    // Add to agent's queue
    const agent = this.agents.get(agentKey);
    if (agent) {
      agent.taskQueue.push(task.id);
      if (agent.status === "idle") {
        agent.status = "active";
      }
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
        }

        // Check if agent should be marked offline (no activity for 5 minutes)
        const lastActive = new Date(agent.lastActiveAt);
        const now = new Date();
        if (now.getTime() - lastActive.getTime() > 5 * 60 * 1000) {
          if (agent.status !== "offline") {
            agent.status = "offline";
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
}

// Export singleton
export const superSpine = new SuperSpine();

