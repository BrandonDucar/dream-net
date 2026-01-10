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
export type ControlDecision = "allowed" | "allowed_god_vault" | "denied_global_kill_switch" | "denied_cluster_disabled" | "denied_feature_flag" | "denied_rate_limited" | "denied_unknown_cluster" | "denied_identity_required" | "bypassed_no_cluster";
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
declare class EventFabric {
    private listeners;
    private eventHistory;
    private readonly MAX_HISTORY;
    /**
     * Emit a Control Core event
     *
     * @param event - Event to emit
     */
    emit(event: ControlCoreEvent): void;
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
    on(listener: EventListener): () => void;
    /**
     * Get recent event history
     *
     * @param limit - Maximum number of events to return
     * @returns Array of recent events
     */
    getHistory(limit?: number): ControlCoreEvent[];
    /**
     * Get events filtered by decision type
     *
     * @param decision - Decision type to filter by
     * @param limit - Maximum number of events to return
     * @returns Array of filtered events
     */
    getEventsByDecision(decision: ControlDecision, limit?: number): ControlCoreEvent[];
    /**
     * Get events filtered by cluster
     *
     * @param clusterId - Cluster ID to filter by
     * @param limit - Maximum number of events to return
     * @returns Array of filtered events
     */
    getEventsByCluster(clusterId: ClusterId, limit?: number): ControlCoreEvent[];
    /**
     * Clear event history (for testing)
     */
    clear(): void;
}
export declare const eventFabric: EventFabric;
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
export declare function emitControlCoreEvent(event: ControlCoreEvent): void;
/**
 * Subscribe to Control Core events
 *
 * @param listener - Event listener function
 * @returns Unsubscribe function
 */
export declare function onControlCoreEvent(listener: EventListener): () => void;
export {};
