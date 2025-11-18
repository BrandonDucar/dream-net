/**
 * Event Fabric - Control Core Event Bus
 * 
 * Captures and emits Control Core events for observability and policy evaluation.
 * Events are emitted to an in-memory bus and logged.
 * 
 * In production, this can be replaced with Redis pub/sub, Kafka, or similar.
 * 
 * @module @dreamnet/dreamnet-control-core/eventFabric
 */

import type { ClusterId } from "./clusters";
import type { TierId } from "./tierConfig";
import type { CallerIdentity } from "./identityResolver";

export type ControlDecision = 
  | "allowed"
  | "allowed_god_vault"
  | "denied_global_kill_switch"
  | "denied_cluster_disabled"
  | "denied_feature_flag"
  | "denied_rate_limited"
  | "denied_unknown_cluster"
  | "denied_identity_required"
  | "bypassed_no_cluster";

export interface ControlCoreEvent {
  /** Trace ID for request tracking */
  traceId: string;
  
  /** Caller identity (tier, source, isGodVault) */
  callerIdentity?: CallerIdentity;
  
  /** Cluster ID (if route is clustered) */
  clusterId?: ClusterId;
  
  /** Route identifier (method + path) */
  routeId: string;
  
  /** Decision made by Control Core */
  decision: ControlDecision;
  
  /** Reason for decision (if denied) */
  reason?: string;
  
  /** Additional metadata */
  metadata?: {
    tierId?: TierId;
    isGodVault?: boolean;
    effectiveRateLimit?: number;
    remainingRateLimit?: number;
    requiredFeatureFlag?: string;
    clusterEnabled?: boolean;
    globalKillSwitchEnabled?: boolean;
    [key: string]: any;
  };
  
  /** Timestamp */
  timestamp: number;
}

type EventListener = (event: ControlCoreEvent) => void;

class EventFabric {
  private listeners: Set<EventListener> = new Set();
  private eventHistory: ControlCoreEvent[] = [];
  private readonly MAX_HISTORY = 1000; // Keep last 1000 events in memory

  /**
   * Emit a Control Core event
   * 
   * @param event - Event to emit
   */
  emit(event: ControlCoreEvent): void {
    // Add to history
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.MAX_HISTORY) {
      this.eventHistory.shift(); // Remove oldest
    }

    // Log event
    const logLevel = event.decision.startsWith("denied") ? "warn" : "info";
    const logPrefix = event.decision.startsWith("denied") ? "🚫" : event.decision.includes("god_vault") ? "⚠️" : "✅";
    
    console[logLevel](`${logPrefix} [EventFabric] ${event.decision} - Trace: ${event.traceId}, Cluster: ${event.clusterId || "none"}, Tier: ${event.metadata?.tierId || "unknown"}`);

    // Emit to all listeners
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error("[EventFabric] Listener error:", error);
      }
    });
  }

  /**
   * Subscribe to Control Core events
   * 
   * @param listener - Event listener function
   * @returns Unsubscribe function
   * 
   * @example
   * ```typescript
   * const unsubscribe = eventFabric.on((event) => {
   *   if (event.decision === "denied_rate_limited") {
   *     // Handle rate limit denial
   *   }
   * });
   * ```
   */
  on(listener: EventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Get recent event history
   * 
   * @param limit - Maximum number of events to return
   * @returns Array of recent events
   */
  getHistory(limit: number = 100): ControlCoreEvent[] {
    return this.eventHistory.slice(-limit);
  }

  /**
   * Get events filtered by decision type
   * 
   * @param decision - Decision type to filter by
   * @param limit - Maximum number of events to return
   * @returns Array of filtered events
   */
  getEventsByDecision(decision: ControlDecision, limit: number = 100): ControlCoreEvent[] {
    return this.eventHistory
      .filter((event) => event.decision === decision)
      .slice(-limit);
  }

  /**
   * Get events filtered by cluster
   * 
   * @param clusterId - Cluster ID to filter by
   * @param limit - Maximum number of events to return
   * @returns Array of filtered events
   */
  getEventsByCluster(clusterId: ClusterId, limit: number = 100): ControlCoreEvent[] {
    return this.eventHistory
      .filter((event) => event.clusterId === clusterId)
      .slice(-limit);
  }

  /**
   * Clear event history (for testing)
   */
  clear(): void {
    this.eventHistory = [];
  }
}

// Singleton instance
export const eventFabric = new EventFabric();

/**
 * Emit a Control Core event
 * 
 * @param event - Event to emit
 * 
 * @example
 * ```typescript
 * emitControlCoreEvent({
 *   traceId: "abc123",
 *   callerIdentity: identity,
 *   clusterId: "WOLF_PACK",
 *   routeId: "POST /api/wolf-pack/run-job",
 *   decision: "allowed",
 *   metadata: { tierId: "BUILDER" },
 *   timestamp: Date.now(),
 * });
 * ```
 */
export function emitControlCoreEvent(event: ControlCoreEvent): void {
  eventFabric.emit(event);
}

/**
 * Subscribe to Control Core events
 * 
 * @param listener - Event listener function
 * @returns Unsubscribe function
 */
export function onControlCoreEvent(listener: EventListener): () => void {
  return eventFabric.on(listener);
}

