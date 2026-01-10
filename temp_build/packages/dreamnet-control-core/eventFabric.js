"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventFabric = void 0;
exports.emitControlCoreEvent = emitControlCoreEvent;
exports.onControlCoreEvent = onControlCoreEvent;
class EventFabric {
    listeners = new Set();
    eventHistory = [];
    MAX_HISTORY = 1000; // Keep last 1000 events in memory
    /**
     * Emit a Control Core event
     *
     * @param event - Event to emit
     */
    emit(event) {
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
            }
            catch (error) {
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
    on(listener) {
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
    getHistory(limit = 100) {
        return this.eventHistory.slice(-limit);
    }
    /**
     * Get events filtered by decision type
     *
     * @param decision - Decision type to filter by
     * @param limit - Maximum number of events to return
     * @returns Array of filtered events
     */
    getEventsByDecision(decision, limit = 100) {
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
    getEventsByCluster(clusterId, limit = 100) {
        return this.eventHistory
            .filter((event) => event.clusterId === clusterId)
            .slice(-limit);
    }
    /**
     * Clear event history (for testing)
     */
    clear() {
        this.eventHistory = [];
    }
}
// Singleton instance
exports.eventFabric = new EventFabric();
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
function emitControlCoreEvent(event) {
    exports.eventFabric.emit(event);
}
/**
 * Subscribe to Control Core events
 *
 * @param listener - Event listener function
 * @returns Unsubscribe function
 */
function onControlCoreEvent(listener) {
    return exports.eventFabric.on(listener);
}
