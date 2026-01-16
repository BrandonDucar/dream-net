import type { EventModel, WormholeModel } from './types.js';
export interface NetworkNode {
    id: string;
    type: "service" | "endpoint" | "agent" | "external";
    latency: number;
    costPerGB: number;
    reliability: number;
    capacity: number;
}
export interface NetworkEdge {
    from: string;
    to: string;
    traffic: number;
    latency: number;
    cost: number;
    strength: number;
}
export interface NetworkTopology {
    nodes: Map<string, NetworkNode>;
    edges: Map<string, NetworkEdge>;
}
/**
 * Slime-Mold Router: Optimize network topology using slime-mold algorithm
 * Grows efficient networks between "food sources" (services) while minimizing cost/latency
 */
export declare class SlimeMoldRouter {
    private topology;
    constructor();
    /**
     * Initialize topology from wormholes
     */
    initializeFromWormholes(wormholes: WormholeModel[]): void;
    /**
     * Run slime-mold optimization
     */
    optimize(events: EventModel[]): void;
    /**
     * Single iteration of slime-mold growth
     */
    private iterate;
    /**
     * Prune edges below threshold
     */
    private prune;
    /**
     * Get optimal route for an event
     */
    getOptimalRoute(event: EventModel): string[];
    /**
     * Get topology statistics
     */
    getStats(): {
        nodeCount: number;
        edgeCount: number;
        avgLatency: number;
        avgCost: number;
        avgReliability: number;
    };
}
export declare const slimeMoldRouter: SlimeMoldRouter;
//# sourceMappingURL=slimeRouter.d.ts.map