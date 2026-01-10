/**
 * Router Types
 *
 * Type definitions for the Laser Router routing system
 */
/**
 * Route key identifying a route by fiber channel and packet type
 */
export interface RouteKey {
    /**
     * Fiber channel name (e.g., 'alpha', 'beta', 'gamma', 'omega')
     */
    fiber: string;
    /**
     * Packet type (e.g., 'dreamnet.event', 'shield.event')
     */
    type: string;
}
/**
 * Route target specifying which port should handle the packet
 */
export interface RouteTarget {
    /**
     * Port ID from the port registry
     */
    portId: string;
}
/**
 * Route entry mapping a route key to a target port
 */
export interface RouteEntry {
    /**
     * Route key (fiber + packet type)
     */
    key: RouteKey;
    /**
     * Target port for this route
     */
    target: RouteTarget;
    /**
     * Optional description of what this route does
     */
    description?: string;
}
/**
 * Router configuration
 */
export interface RouterConfig {
    /**
     * Default fiber channel to use when fiber is not specified
     */
    defaultFiber?: string;
    /**
     * If true, attempt fallback routing using defaultFiber when direct route not found
     */
    allowFallback?: boolean;
    /**
     * If true, throw errors on missing routes/ports instead of soft-failing
     */
    strict?: boolean;
}
/**
 * Route packet result
 */
export interface RouteResult {
    ok: boolean;
    reason?: string;
    result?: any;
}
