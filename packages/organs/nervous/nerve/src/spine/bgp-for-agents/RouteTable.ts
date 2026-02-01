import { DreamEventBus } from '../dreamnet-event-bus/DreamEventBus.js';
import { AgentPrefix, AgentRoute } from './AgentBGP.js';
import { RoutingStrategies } from './RoutingStrategies.js';

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

export class RouteTable {
    private routes: Map<AgentPrefix, RouteTableEntry> = new Map();
    private eventBus?: DreamEventBus;

    constructor(eventBus?: DreamEventBus) {
        this.eventBus = eventBus;
    }

    /**
     * Add a route to the table
     */
    public addRoute(route: AgentRoute, metrics?: Partial<RouteMetrics>): void {
        const entry: RouteTableEntry = {
            ...route,
            metrics: {
                hopCount: metrics?.hopCount ?? 1,
                latency: metrics?.latency,
                reliability: metrics?.reliability ?? 1.0,
                lastUpdated: Date.now(),
            },
            addedAt: Date.now(),
        };

        this.routes.set(route.prefix, entry);

        // Emit event
        if (this.eventBus) {
            this.eventBus.publish(
                this.eventBus.createEnvelope(
                    'RouteTable.RouteAdded',
                    'route-table',
                    { prefix: route.prefix, nextHop: route.nextHop, metrics: entry.metrics }
                )
            );
        }
    }

    /**
     * Remove a route from the table
     */
    public removeRoute(prefix: AgentPrefix): boolean {
        const existed = this.routes.has(prefix);
        this.routes.delete(prefix);

        // Emit event
        if (existed && this.eventBus) {
            this.eventBus.publish(
                this.eventBus.createEnvelope(
                    'RouteTable.RouteRemoved',
                    'route-table',
                    { prefix }
                )
            );
        }

        return existed;
    }

    /**
     * Get a specific route
     */
    public getRoute(prefix: AgentPrefix): RouteTableEntry | undefined {
        return this.routes.get(prefix);
    }

    /**
     * Get all routes
     */
    public getAllRoutes(): RouteTableEntry[] {
        return Array.from(this.routes.values());
    }

    /**
     * Find next hop for a given prefix using longest prefix match
     */
    public findNextHop(prefix: AgentPrefix): string | undefined {
        const allRoutes = this.getAllRoutes();
        const match = RoutingStrategies.selectLongestPrefixMatch(prefix, allRoutes);
        return match?.nextHop;
    }

    /**
     * Find best route using custom strategy
     */
    public findBestRoute(
        prefix: AgentPrefix,
        strategy: 'first' | 'longest-prefix' | 'lowest-latency' | 'highest-reliability' = 'longest-prefix'
    ): RouteTableEntry | undefined {
        const allRoutes = this.getAllRoutes();

        switch (strategy) {
            case 'first':
                return RoutingStrategies.selectFirstMatch(prefix, allRoutes);

            case 'longest-prefix':
                return RoutingStrategies.selectLongestPrefixMatch(prefix, allRoutes);

            case 'lowest-latency':
                return this.selectLowestLatency(prefix, allRoutes);

            case 'highest-reliability':
                return this.selectHighestReliability(prefix, allRoutes);

            default:
                return RoutingStrategies.selectLongestPrefixMatch(prefix, allRoutes);
        }
    }

    /**
     * Update route metrics
     */
    public updateMetrics(prefix: AgentPrefix, metrics: Partial<RouteMetrics>): boolean {
        const route = this.routes.get(prefix);
        if (!route) return false;

        route.metrics = {
            ...route.metrics,
            ...metrics,
            lastUpdated: Date.now(),
        };

        this.routes.set(prefix, route);

        // Emit event
        if (this.eventBus) {
            this.eventBus.publish(
                this.eventBus.createEnvelope(
                    'RouteTable.MetricsUpdated',
                    'route-table',
                    { prefix, metrics: route.metrics }
                )
            );
        }

        return true;
    }

    /**
     * Get route count
     */
    public getRouteCount(): number {
        return this.routes.size;
    }

    /**
     * Clear all routes
     */
    public clearAllRoutes(): void {
        const count = this.routes.size;
        this.routes.clear();

        // Emit event
        if (this.eventBus) {
            this.eventBus.publish(
                this.eventBus.createEnvelope(
                    'RouteTable.Cleared',
                    'route-table',
                    { routesCleared: count }
                )
            );
        }
    }

    /**
     * Get routes by next hop
     */
    public getRoutesByNextHop(nextHop: string): RouteTableEntry[] {
        return this.getAllRoutes().filter(route => route.nextHop === nextHop);
    }

    /**
     * Get stale routes (not updated in X milliseconds)
     */
    public getStaleRoutes(maxAge: number = 300000): RouteTableEntry[] {
        const now = Date.now();
        return this.getAllRoutes().filter(route =>
            now - route.metrics.lastUpdated > maxAge
        );
    }

    // Private helper methods

    private selectLowestLatency(prefix: AgentPrefix, routes: RouteTableEntry[]): RouteTableEntry | undefined {
        const matching = routes.filter(r => prefix.startsWith(r.prefix));
        if (matching.length === 0) return undefined;

        return matching.reduce((best, current) => {
            const bestLatency = best.metrics.latency ?? Infinity;
            const currentLatency = current.metrics.latency ?? Infinity;
            return currentLatency < bestLatency ? current : best;
        });
    }

    private selectHighestReliability(prefix: AgentPrefix, routes: RouteTableEntry[]): RouteTableEntry | undefined {
        const matching = routes.filter(r => prefix.startsWith(r.prefix));
        if (matching.length === 0) return undefined;

        return matching.reduce((best, current) => {
            const bestReliability = best.metrics.reliability ?? 0;
            const currentReliability = current.metrics.reliability ?? 0;
            return currentReliability > bestReliability ? current : best;
        });
    }
}
