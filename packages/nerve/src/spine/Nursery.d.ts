/**
 * 🤱 Nursery: The Evolutionary Hub
 *
 * Manages agent lineages, evolutionary cycles, and performance tracking.
 */
import { Genome } from '../../../shared/genetic/Genome.js';
export declare class Nursery {
    private static instance;
    private lineages;
    private constructor();
    static getInstance(): Nursery;
    /**
     * Register a new agent into the Nursery
     */
    register(agentId: string, baseGenome: Genome): void;
    /**
     * Trigger a mutation cycle for an agent
     */
    evolve(agentId: string): Genome;
    /**
     * Listen for 'AlphaExtracted' or 'ImpactScore' to update fitness
     */
    private listenForPerformance;
    private updateFitness;
    getGenome(agentId: string): Genome | undefined;
}
export declare const nursery: Nursery;
//# sourceMappingURL=Nursery.d.ts.map