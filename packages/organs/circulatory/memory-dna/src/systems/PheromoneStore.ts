/**
 * Pheromone Store 🐝
 * Hijacked Wisdom: Swarm Intelligence (Stigmergy)
 * 
 * Philosophy: Don't talk. Leave a trail.
 * Mechanism: A spatial store where signals exist with intensity and decay.
 */

interface Pheromone {
    id: string;
    location: string; // The "Topic" or "Route"
    signal: any;
    intensity: number; // 0.0 to 1.0
    depositedAt: number;
}

export class PheromoneStore {
    private trails: Map<string, Pheromone> = new Map();
    private DECAY_RATE = 0.05; // 5% decay per tick

    constructor() {
        // Start the decay clock (Entropy)
        setInterval(() => this.decay(), 1000);
    }

    /**
     * Leave a trail (Deposit Pheromone)
     */
    public deposit(location: string, signal: any, strength: number = 1.0) {
        this.trails.set(location, {
            id: Math.random().toString(36).slice(2),
            location,
            signal,
            intensity: Math.min(strength, 1.0),
            depositedAt: Date.now()
        });
        // console.log(`[🐝 Pheromone] Trail marked at '${location}' (Strength: ${strength})`);
    }

    /**
     * Sniff the air (Read Pheromone)
     */
    public sniff(location: string): Pheromone | null {
        const trail = this.trails.get(location);
        if (!trail || trail.intensity < 0.1) return null; // Too faint to smell
        return trail;
    }

    /**
     * Find strongest trails (Gradient Ascent)
     */
    public findStrongest(): Pheromone[] {
        return Array.from(this.trails.values())
            .filter(p => p.intensity > 0.3)
            .sort((a, b) => b.intensity - a.intensity);
    }

    /**
     * Reinforce a trail (Add strength)
     */
    public reinforce(location: string, amount: number) {
        const trail = this.trails.get(location);
        if (trail) {
            trail.intensity = Math.min(trail.intensity + amount, 1.0);
        }
    }

    /**
     * The Entropy Loop (Decay)
     */
    private decay() {
        for (const [loc, trail] of this.trails) {
            trail.intensity -= this.DECAY_RATE;
            if (trail.intensity <= 0) {
                this.trails.delete(loc); // Evaporated
            }
        }
    }
}

export const pheromones = new PheromoneStore();
