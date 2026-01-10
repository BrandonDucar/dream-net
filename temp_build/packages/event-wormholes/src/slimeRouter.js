"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slimeMoldRouter = exports.SlimeMoldRouter = void 0;
const MIN_RELIABILITY = 0.95; // Don't optimize below this
const ITERATIONS = 10; // Slime-mold iterations
const GROWTH_RATE = 0.1;
const DECAY_RATE = 0.05;
/**
 * Slime-Mold Router: Optimize network topology using slime-mold algorithm
 * Grows efficient networks between "food sources" (services) while minimizing cost/latency
 */
class SlimeMoldRouter {
    topology;
    constructor() {
        this.topology = {
            nodes: new Map(),
            edges: new Map(),
        };
    }
    /**
     * Initialize topology from wormholes
     */
    initializeFromWormholes(wormholes) {
        // Extract nodes from wormholes
        for (const wormhole of wormholes) {
            const fromId = `${wormhole.from.sourceType}:${wormhole.from.eventType}`;
            const toId = `${wormhole.to.targetAgentRole}:${wormhole.to.actionType}`;
            // Add nodes
            if (!this.topology.nodes.has(fromId)) {
                this.topology.nodes.set(fromId, {
                    id: fromId,
                    type: "service",
                    latency: 50, // Default
                    costPerGB: 0.01, // Default
                    reliability: 0.99,
                    capacity: 1000,
                });
            }
            if (!this.topology.nodes.has(toId)) {
                this.topology.nodes.set(toId, {
                    id: toId,
                    type: "agent",
                    latency: 30,
                    costPerGB: 0.005,
                    reliability: 0.98,
                    capacity: 500,
                });
            }
            // Add edge
            const edgeKey = `${fromId}->${toId}`;
            if (!this.topology.edges.has(edgeKey)) {
                this.topology.edges.set(edgeKey, {
                    from: fromId,
                    to: toId,
                    traffic: 0,
                    latency: 80, // Default
                    cost: 0.001,
                    strength: 0.5, // Initial strength
                });
            }
        }
    }
    /**
     * Run slime-mold optimization
     */
    optimize(events) {
        // Calculate traffic (nutrients) from events
        const trafficMap = new Map();
        for (const event of events) {
            const fromId = `${event.sourceType}:${event.eventType}`;
            trafficMap.set(fromId, (trafficMap.get(fromId) || 0) + 1);
        }
        // Update edge traffic
        for (const [edgeKey, edge] of this.topology.edges.entries()) {
            const fromTraffic = trafficMap.get(edge.from) || 0;
            edge.traffic = fromTraffic;
        }
        // Run iterations
        for (let i = 0; i < ITERATIONS; i++) {
            this.iterate();
        }
        // Prune weak edges
        this.prune();
    }
    /**
     * Single iteration of slime-mold growth
     */
    iterate() {
        for (const [edgeKey, edge] of this.topology.edges.entries()) {
            const fromNode = this.topology.nodes.get(edge.from);
            const toNode = this.topology.nodes.get(edge.to);
            if (!fromNode || !toNode)
                continue;
            // Calculate efficiency: lower latency + cost = higher efficiency
            const efficiency = 1 / (edge.latency + edge.cost * 1000);
            // Growth: stronger edges grow more
            if (edge.traffic > 0 && toNode.reliability >= MIN_RELIABILITY) {
                edge.strength = Math.min(1.0, edge.strength + GROWTH_RATE * efficiency * (edge.traffic / 100));
            }
            // Decay: unused edges decay
            if (edge.traffic === 0) {
                edge.strength = Math.max(0, edge.strength - DECAY_RATE);
            }
        }
    }
    /**
     * Prune edges below threshold
     */
    prune() {
        const toRemove = [];
        for (const [edgeKey, edge] of this.topology.edges.entries()) {
            if (edge.strength < 0.1) {
                toRemove.push(edgeKey);
            }
        }
        for (const key of toRemove) {
            this.topology.edges.delete(key);
        }
    }
    /**
     * Get optimal route for an event
     */
    getOptimalRoute(event) {
        const fromId = `${event.sourceType}:${event.eventType}`;
        const routes = [];
        // Find all edges from source
        for (const [edgeKey, edge] of this.topology.edges.entries()) {
            if (edge.from === fromId) {
                const toNode = this.topology.nodes.get(edge.to);
                const score = edge.strength * (1 / edge.latency) * (toNode?.reliability || 0.5);
                routes.push({
                    path: [edge.from, edge.to],
                    score,
                });
            }
        }
        // Sort by score and return best
        routes.sort((a, b) => b.score - a.score);
        return routes[0]?.path || [];
    }
    /**
     * Get topology statistics
     */
    getStats() {
        const nodes = Array.from(this.topology.nodes.values());
        const edges = Array.from(this.topology.edges.values());
        return {
            nodeCount: nodes.length,
            edgeCount: edges.length,
            avgLatency: edges.reduce((sum, e) => sum + e.latency, 0) / edges.length || 0,
            avgCost: edges.reduce((sum, e) => sum + e.cost, 0) / edges.length || 0,
            avgReliability: nodes.reduce((sum, n) => sum + n.reliability, 0) / nodes.length || 0,
        };
    }
}
exports.SlimeMoldRouter = SlimeMoldRouter;
exports.slimeMoldRouter = new SlimeMoldRouter();
