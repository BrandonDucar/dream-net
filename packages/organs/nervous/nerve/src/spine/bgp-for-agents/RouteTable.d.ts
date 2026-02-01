import { DreamEventBus } from '../dreamnet-event-bus/DreamEventBus.js';
import { AgentPrefix, AgentRoute } from './AgentBGP.js';
export interface RouteMetrics {
    hopCount: number;
    latency?: number;
    reliability?: number;
    lastUpdated: number;
}
export interface RouteTableEntry extends AgentRoute {
    metrics: RouteMetrics;
    addedAt: number;
}
export declare class RouteTable {
    private routes;
    private eventBus?;
    constructor(eventBus?: DreamEventBus);
    /**
     * Add a route to the table
     */
    addRoute(route: AgentRoute, metrics?: Partial<RouteMetrics>): void;
    /**
     * Remove a route from the table
     */
    removeRoute(prefix: AgentPrefix): boolean;
    /**
     * Get a specific route
     */
    getRoute(prefix: AgentPrefix): RouteTableEntry | undefined;
    /**
     * Get all routes
     */
    getAllRoutes(): RouteTableEntry[];
    /**
     * Find next hop for a given prefix using longest prefix match
     */
    findNextHop(prefix: AgentPrefix): string | undefined;
    /**
     * Find best route using custom strategy
     */
    findBestRoute(prefix: AgentPrefix, strategy?: 'first' | 'longest-prefix' | 'lowest-latency' | 'highest-reliability'): RouteTableEntry | undefined;
    /**
     * Update route metrics
     */
    updateMetrics(prefix: AgentPrefix, metrics: Partial<RouteMetrics>): boolean;
    /**
     * Get route count
     */
    getRouteCount(): number;
    /**
     * Clear all routes
     */
    clearAllRoutes(): void;
    /**
     * Get routes by next hop
     */
    getRoutesByNextHop(nextHop: string): RouteTableEntry[];
    /**
     * Get stale routes (not updated in X milliseconds)
     */
    getStaleRoutes(maxAge?: number): RouteTableEntry[];
    private selectLowestLatency;
    private selectHighestReliability;
}
//# sourceMappingURL=RouteTable.d.ts.map