/**
 * Instant Mesh System
 * 
 * Zero-delay, seamless event routing across all systems.
 * No staging, no gating - pure instant flow.
 * Agents can build agents through hybridization.
 */

import { broadcastStarbridgeEvent, onStarbridgeEvent } from "../starbridge/bus";
import { StarbridgeSource, StarbridgeTopic } from "../starbridge/types";
import type { StarbridgeEvent } from "../starbridge/types";
import { randomUUID } from "node:crypto";
import { instantWormhole } from "./InstantWormhole";

export interface AgentHybrid {
  id: string;
  name: string;
  parentAgents: string[]; // Agent keys that were combined
  capabilities: string[];
  traits: string[];
  status: "active" | "evolving" | "dormant";
  createdAt: string;
  evolvedFrom?: string; // Parent hybrid ID if this evolved from another hybrid
}

export interface InstantEvent {
  id: string;
  source: string;
  target?: string;
  type: string;
  payload: Record<string, unknown>;
  timestamp: number;
  routed: boolean;
  delivered: boolean;
}

class InstantMesh {
  private eventQueue: InstantEvent[] = [];
  private hybrids: Map<string, AgentHybrid> = new Map();
  private eventSubscriptions: Map<string, Set<(event: InstantEvent) => void>> = new Map();
  private routingRules: Map<string, string[]> = new Map(); // event type -> target agents

  constructor() {
    this.initializeInstantRouting();
    this.subscribeToStarbridge();
    // Initialize wormhole system (it subscribes to mesh automatically)
    void instantWormhole;
  }

  /**
   * Initialize instant routing rules
   */
  private initializeInstantRouting(): void {
    // All events route instantly - no delays
    this.routingRules.set("*", ["*"]); // Everything goes everywhere instantly
    
    // Specific instant routes
    this.routingRules.set("agent.created", ["super-spine", "foundry", "mesh"]);
    this.routingRules.set("agent.hybrid", ["all-agents", "mesh"]);
    this.routingRules.set("dream.submitted", ["lucid", "canvas", "root", "mesh"]);
    this.routingRules.set("reward.granted", ["rewards-engine", "metrics-engine", "mesh"]);
    this.routingRules.set("fleet.deployed", ["all-fleets", "mesh"]);
    this.routingRules.set("gpt.activated", ["custom-gpt-fleets", "mesh"]);
  }

  /**
   * Subscribe to Starbridge events for instant routing
   */
  private subscribeToStarbridge(): void {
    onStarbridgeEvent((event: StarbridgeEvent) => {
      // Instant delivery - no queuing, no delays
      this.routeInstantly(event);
    });
  }

  /**
   * Route event instantly to all targets
   */
  private routeInstantly(event: StarbridgeEvent): void {
    const instantEvent: InstantEvent = {
      id: randomUUID(),
      source: event.source,
      type: `${event.topic}.${event.type}`,
      payload: event.payload || {},
      timestamp: Date.now(),
      routed: true,
      delivered: false,
    };

    // Get routing targets
    const targets = this.routingRules.get(instantEvent.type) || 
                   this.routingRules.get("*") || 
                   ["*"];

    // Deliver instantly to all targets
    for (const target of targets) {
      if (target === "*") {
        // Broadcast to all subscribers
        this.eventSubscriptions.forEach((subscribers) => {
          subscribers.forEach((handler) => {
            try {
              handler(instantEvent);
            } catch (err) {
              console.error(`[Instant Mesh] Handler error:`, err);
            }
          });
        });
      } else {
        // Deliver to specific target
        const subscribers = this.eventSubscriptions.get(target);
        if (subscribers) {
          subscribers.forEach((handler) => {
            try {
              handler(instantEvent);
            } catch (err) {
              console.error(`[Instant Mesh] Handler error for ${target}:`, err);
            }
          });
        }
      }
    }

    instantEvent.delivered = true;
    this.eventQueue.push(instantEvent);
    
    // Keep only last 1000 events
    if (this.eventQueue.length > 1000) {
      this.eventQueue.shift();
    }
  }

  /**
   * Emit event instantly
   */
  emit(event: Omit<InstantEvent, "id" | "timestamp" | "routed" | "delivered">): InstantEvent {
    const instantEvent: InstantEvent = {
      id: randomUUID(),
      ...event,
      timestamp: Date.now(),
      routed: false,
      delivered: false,
    };

    // Route instantly
    this.routeInstantly({
      topic: StarbridgeTopic.System,
      source: (event.source as StarbridgeSource) || StarbridgeSource.Runtime,
      type: event.type,
      payload: event.payload,
    });

    return instantEvent;
  }

  /**
   * Subscribe to events
   */
  subscribe(target: string, handler: (event: InstantEvent) => void): () => void {
    if (!this.eventSubscriptions.has(target)) {
      this.eventSubscriptions.set(target, new Set());
    }
    this.eventSubscriptions.get(target)!.add(handler);

    // Return unsubscribe function
    return () => {
      const subscribers = this.eventSubscriptions.get(target);
      if (subscribers) {
        subscribers.delete(handler);
      }
    };
  }

  /**
   * Create agent hybrid - agents building agents
   */
  createHybrid(
    name: string,
    parentAgents: string[],
    capabilities: string[],
    traits: string[]
  ): AgentHybrid {
    const hybrid: AgentHybrid = {
      id: randomUUID(),
      name,
      parentAgents,
      capabilities,
      traits,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    this.hybrids.set(hybrid.id, hybrid);

    // Emit instant event
    this.emit({
      source: "mesh",
      type: "agent.hybrid.created",
      payload: { hybrid },
    });

    // Broadcast to Starbridge
    void broadcastStarbridgeEvent(
      {
        topic: StarbridgeTopic.System,
        source: StarbridgeSource.Runtime,
        type: "agent.hybrid.created",
        payload: { hybrid },
      },
      { skipPersistence: false }
    );

    console.log(`🧬 [Instant Mesh] Hybrid agent created: ${name} from ${parentAgents.join(" + ")}`);
    
    // Auto-connect hybrid to Foundry
    this.emit({
      source: "mesh",
      target: "foundry",
      type: "agent.hybrid.created",
      payload: { hybrid },
    });
    
    return hybrid;
  }

  /**
   * Evolve hybrid from another hybrid
   */
  evolveHybrid(
    parentHybridId: string,
    name: string,
    newCapabilities: string[],
    newTraits: string[]
  ): AgentHybrid | null {
    const parent = this.hybrids.get(parentHybridId);
    if (!parent) return null;

    const hybrid: AgentHybrid = {
      id: randomUUID(),
      name,
      parentAgents: [...parent.parentAgents],
      capabilities: [...parent.capabilities, ...newCapabilities],
      traits: [...parent.traits, ...newTraits],
      status: "active",
      createdAt: new Date().toISOString(),
      evolvedFrom: parentHybridId,
    };

    this.hybrids.set(hybrid.id, hybrid);

    // Emit instant event
    this.emit({
      source: "mesh",
      type: "agent.hybrid.evolved",
      payload: { hybrid, parent: parent.id },
    });

    console.log(`🧬 [Instant Mesh] Hybrid evolved: ${name} from ${parent.name}`);
    return hybrid;
  }

  /**
   * Request agent build from Foundry
   */
  requestAgentBuild(
    requestedBy: string,
    agentName: string,
    options?: {
      templateSlug?: string;
      capabilities?: string[];
      traits?: string[];
      parentAgents?: string[];
    }
  ): void {
    // Emit to foundry through mesh
    this.emit({
      source: requestedBy,
      target: "foundry",
      type: "agent.build.request",
      payload: {
        requestedBy,
        agentName,
        templateSlug: options?.templateSlug,
        capabilities: options?.capabilities,
        traits: options?.traits,
        parentAgents: options?.parentAgents,
      },
    });
  }

  /**
   * Cross agents - combine capabilities
   */
  crossAgents(agent1: string, agent2: string, name?: string): AgentHybrid {
    const hybridName = name || `${agent1}×${agent2}`;
    
    // Determine capabilities from parent agents
    const capabilities: string[] = [];
    const traits: string[] = [];

    // Map agent capabilities
    const agentCapabilities: Record<string, { capabilities: string[]; traits: string[] }> = {
      lucid: { capabilities: ["routing", "logic"], traits: ["coordinator"] },
      canvas: { capabilities: ["design", "ui"], traits: ["visual"] },
      root: { capabilities: ["architecture", "backend"], traits: ["strategist"] },
      echo: { capabilities: ["analysis", "wallet"], traits: ["analyst"] },
      cradle: { capabilities: ["evolution", "minting"], traits: ["evolutionary"] },
      wing: { capabilities: ["messaging", "minting"], traits: ["communicator"] },
      "wolf-pack": { capabilities: ["funding", "outreach"], traits: ["hunter"] },
      "super-spine": { capabilities: ["orchestration", "registry"], traits: ["coordinator"] },
    };

    const agent1Data = agentCapabilities[agent1.toLowerCase()] || { capabilities: [], traits: [] };
    const agent2Data = agentCapabilities[agent2.toLowerCase()] || { capabilities: [], traits: [] };

    capabilities.push(...agent1Data.capabilities, ...agent2Data.capabilities);
    traits.push(...agent1Data.traits, ...agent2Data.traits);

    return this.createHybrid(hybridName, [agent1, agent2], capabilities, traits);
  }

  /**
   * Get all hybrids
   */
  getHybrids(): AgentHybrid[] {
    return Array.from(this.hybrids.values());
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit = 100): InstantEvent[] {
    return this.eventQueue.slice(-limit).reverse();
  }

  /**
   * Get mesh status
   */
  getStatus(): {
    active: boolean;
    eventCount: number;
    hybridCount: number;
    subscriptions: number;
  } {
    let subscriptionCount = 0;
    this.eventSubscriptions.forEach((subs) => {
      subscriptionCount += subs.size;
    });

    return {
      active: true,
      eventCount: this.eventQueue.length,
      hybridCount: this.hybrids.size,
      subscriptions: subscriptionCount,
    };
  }
}

// Export singleton
export const instantMesh = new InstantMesh();

