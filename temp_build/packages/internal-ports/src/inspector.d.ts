/**
 * System Inspector
 *
 * Provides read-only snapshots of ports, routes, and wormholes
 * for monitoring and debugging purposes.
 */
/**
 * Port snapshot for inspection
 */
export interface PortSnapshot {
    id: string;
    label: string;
    direction: 'in' | 'out' | 'bidirectional';
    fiber: string;
    isDefault: boolean;
}
/**
 * Get a snapshot of all registered ports
 *
 * @returns Array of port snapshots
 */
export declare function getPortsSnapshot(): PortSnapshot[];
/**
 * Route snapshot for inspection
 */
export interface RouteSnapshot {
    fiber: string;
    type: string;
    targetPortId: string;
    description?: string;
}
/**
 * Get a snapshot of all registered routes
 *
 * @returns Array of route snapshots
 */
/**
 * Get a snapshot of all registered routes
 *
 * @returns Array of route snapshots
 */
export declare function getRoutesSnapshot(): Promise<RouteSnapshot[]>;
/**
 * Wormhole snapshot for inspection
 */
export interface WormholeSnapshot {
    id: string;
    label: string;
    direction: 'in' | 'out' | 'bidirectional';
    fiber: string;
    stats: {
        buffered: number;
        enqueued: number;
        dropped: number;
    };
}
/**
 * Get a snapshot of all registered wormholes
 *
 * @returns Array of wormhole snapshots
 */
export declare function getWormholesSnapshot(): Promise<WormholeSnapshot[]>;
