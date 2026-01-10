/**
 * 🧬 SPROE GENETIC DRIFT
 *
 * Agents mutate based on the "Radiation" of the chain they visit.
 * - Base/Solana (High Speed, Low Cost) -> Mutates +Velocity, -Shield
 * - Ethereum (High Cost, High Sec) -> Mutates +Shield, -Velocity
 */
export interface GeneticTraits {
    velocity: number;
    shield: number;
    virus: number;
}
export declare class MutationEngine {
    /**
     * Mutates an agent's DNA based on environmental exposure.
     * @param currentTraits The agent's starting stats
     * @param environmentChain The chain ID (e.g., 'base', 'ethereum')
     */
    static drift(currentTraits: GeneticTraits, environmentChain: string): GeneticTraits;
}
