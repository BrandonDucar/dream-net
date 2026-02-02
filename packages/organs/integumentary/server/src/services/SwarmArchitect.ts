import { dreamEventBus } from '../../../../nervous/nerve/src/spine/dreamnet-event-bus/index.js';

/**
 * SwarmArchitect
 * Optimizes the Nerve Bus via Ant Colony Optimization (ACO).
 * Inspired by Marco Dorigo's swarm intelligence theories.
 */
export class SwarmArchitect {
    private static instance: SwarmArchitect;
    private pheromones: Map<string, number> = new Map();

    private constructor() {
        console.log("🐺 [SWARM ARCHITECT] Initialized. Deploying Dorigo-level ACO pheromones.");
        this.initLoop();
    }

    public static getInstance(): SwarmArchitect {
        if (!SwarmArchitect.instance) {
            SwarmArchitect.instance = new SwarmArchitect();
        }
        return SwarmArchitect.instance;
    }

    private initLoop() {
        setInterval(() => this.evaporatePheromones(), 60000); // Evaporate every minute
    }

    public layPheromone(path: string, strength: number) {
        const current = this.pheromones.get(path) || 0;
        this.pheromones.set(path, current + strength);
        console.log(`[🧬 ACO] Pheromone laid on path: ${path} | New Strength: ${(current + strength).toFixed(2)}`);
    }

    private evaporatePheromones() {
        for (const [path, strength] of this.pheromones.entries()) {
            const evaporated = strength * 0.9;
            if (evaporated < 0.1) {
                this.pheromones.delete(path);
            } else {
                this.pheromones.set(path, evaporated);
            }
        }
    }
}

export const swarmArchitect = SwarmArchitect.getInstance();
