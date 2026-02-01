
/**
 * 🧬 SPROE GENETIC DRIFT
 * 
 * Agents mutate based on the "Radiation" of the chain they visit.
 * - Base/Solana (High Speed, Low Cost) -> Mutates +Velocity, -Shield
 * - Ethereum (High Cost, High Sec) -> Mutates +Shield, -Velocity
 */

export interface GeneticTraits {
    velocity: number; // Speed of propagation
    shield: number;   // Defense against predators
    virus: number;    // Infection potency
}

export class MutationEngine {

    /**
     * Mutates an agent's DNA based on environmental exposure.
     * @param currentTraits The agent's starting stats
     * @param environmentChain The chain ID (e.g., 'base', 'ethereum')
     */
    static drift(currentTraits: GeneticTraits, environmentChain: string): GeneticTraits {
        const driftFactor = 0.1; // 10% shift per hop
        const newTraits = { ...currentTraits };

        const chain = environmentChain.toLowerCase();

        if (chain === 'base' || chain === 'solana' || chain === 'arbitrum') {
            // High Speed Environment
            newTraits.velocity = Math.min(100, newTraits.velocity + (10 * driftFactor));
            newTraits.shield = Math.max(0, newTraits.shield - (5 * driftFactor));
            console.log(`🧬 [Mutation] ${chain} radiation increased Velocity, weakened Shield.`);
        } else if (chain === 'ethereum') {
            // High Gravity/Security Environment
            newTraits.shield = Math.min(100, newTraits.shield + (10 * driftFactor));
            newTraits.velocity = Math.max(0, newTraits.velocity - (5 * driftFactor));
            console.log(`🧬 [Mutation] Ethereum gravity hardened Shield, slowed Velocity.`);
        }

        // Random beneficial mutation (Evolution)
        if (Math.random() > 0.9) {
            newTraits.virus += 1;
            console.log(`🧬 [Evolution] Rare mutation! Virus potency increased.`);
        }

        return newTraits;
    }
}
