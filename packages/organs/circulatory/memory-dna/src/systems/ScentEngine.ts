/**
 * 🐝 ScentEngine
 * Role: Computes time-decayed reputation scores (Pheromones).
 * Math: intensity = base_strength * e^(-decay_lambda * delta_t)
 */
export class ScentEngine {
    private static readonly DEFAULT_HALF_LIFE_MS = 30 * 24 * 60 * 60 * 1000; // 30 Days

    /**
     * Calculates the decayed intensity of a signal.
     */
    public static calculateDecay(initialStrength: number, depositedAt: number, halfLifeMs: number = this.DEFAULT_HALF_LIFE_MS): number {
        const now = Date.now();
        const deltaT = now - depositedAt;
        if (deltaT < 0) return initialStrength;

        // λ = ln(2) / half_life
        const lambda = Math.LN2 / halfLifeMs;
        const decayed = initialStrength * Math.exp(-lambda * deltaT);

        return Math.max(0, decayed);
    }

    /**
     * Aggregates multiple pheromone signals into a single score.
     */
    public static computeAggregateScore(signals: { strength: number, timestamp: number }[], halfLifeMs?: number): number {
        return signals.reduce((acc, sig) => acc + this.calculateDecay(sig.strength, sig.timestamp, halfLifeMs), 0);
    }

    /**
     * Returns the Tier based on the Pheromone Score.
     * Calibrated as per Master Spec: 10 -> 50 -> 200 -> 800
     */
    public static getTier(score: number): "LARVA" | "ANT" | "SWARM" | "COLONY" | "QUEEN" {
        if (score >= 800) return "QUEEN";
        if (score >= 200) return "COLONY";
        if (score >= 50) return "SWARM";
        if (score >= 10) return "ANT";
        return "LARVA";
    }
}
