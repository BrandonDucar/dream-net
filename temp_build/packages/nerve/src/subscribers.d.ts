/**
 * Nerve Bus Subscribers
 * Default subscribers for core DreamNet systems
 *
 * @module @dreamnet/nerve/subscribers
 */
import type { NerveBus } from "./bus";
import type { NerveEvent } from "./types";
/**
 * Register Shield Core subscriber
 * Subscribes to SHIELD_EVENT and HTTP_REQUEST channels
 *
 * @param bus - Nerve bus instance
 */
export declare function registerShieldCoreSubscriber(bus: NerveBus): void;
/**
 * Register Jaggy subscriber
 * Subscribes to all events for comprehensive monitoring
 *
 * @param bus - Nerve bus instance
 */
export declare function registerJaggySubscriber(bus: NerveBus): void;
/**
 * Register DreamScope subscriber
 * Subscribes to HTTP_REQUEST and SHIELD_EVENT channels
 * Stores events in ring buffer for dashboard
 *
 * @param bus - Nerve bus instance
 * @returns DreamScope interface with getRecentEvents
 */
export declare function registerDreamScopeSubscriber(bus: NerveBus): {
    getRecentEvents: () => NerveEvent[];
};
/**
 * Get recent events for DreamScope dashboard
 *
 * @param limit - Maximum number of events to return
 * @returns Array of recent events
 */
export declare function getDreamScopeEvents(limit?: number): NerveEvent[];
/**
 * Get event metrics for DreamScope dashboard
 *
 * @returns Event metrics
 */
export declare function getDreamScopeMetrics(): {
    totalEvents: number;
    eventsByKind: Record<string, number>;
    eventsByChannel: Record<string, number>;
    latestEvent?: NerveEvent;
};
