/**
 * 🤱 Nursery: The Evolutionary Hub
 * 
 * Manages agent lineages, evolutionary cycles, and performance tracking.
 */

import { dreamEventBus } from './dreamnet-event-bus/index.js';
import { Genome, mutateGenome } from '@dreamnet/shared';

export class Nursery {
    private static instance: Nursery;
    private lineages: Map<string, Genome> = new Map(); // agentId -> Genome

    private constructor() {
        this.listenForPerformance();
    }

    public static getInstance(): Nursery {
        if (!Nursery.instance) {
            Nursery.instance = new Nursery();
        }
        return Nursery.instance;
    }

    /**
     * Register a new agent into the Nursery
     */
    public register(agentId: string, baseGenome: Genome) {
        console.log(`[🤱 Nursery] Registering ${agentId} (${baseGenome.strain}). Generation ${baseGenome.generation}.`);
        this.lineages.set(agentId, baseGenome);
    }

    /**
     * Trigger a mutation cycle for an agent
     */
    public evolve(agentId: string): Genome {
        const current = this.lineages.get(agentId);
        if (!current) throw new Error(`Agent ${agentId} not registered in Nursery.`);

        const next = mutateGenome(current);
        this.lineages.set(agentId, next);

        console.log(`[🤱 Nursery] Evolving ${agentId} to Generation ${next.generation}...`);

        // Broadcast the genetic shift
        dreamEventBus.publish({
            type: 'Agent.GeneticShift',
            payload: { agentId, previous: current, current: next },
            source: 'NURSERY'
        });

        return next;
    }

    /**
     * Listen for 'AlphaExtracted' or 'ImpactScore' to update fitness
     */
    private listenForPerformance() {
        dreamEventBus.subscribe('Market.AlphaExtracted', (envelope: any) => {
            const { agentId, yield: alpha } = envelope.payload;
            this.updateFitness(agentId, alpha);
        });

        dreamEventBus.subscribe('Agent.ImpactScore', (envelope: any) => {
            const { agentId, score } = envelope.payload;
            this.updateFitness(agentId, score);
        });
    }

    private updateFitness(agentId: string, score: number) {
        const genome = this.lineages.get(agentId);
        if (genome) {
            genome.fitness = (genome.fitness || 0) + score;
            console.log(`[🤱 Nursery] Performance update for ${agentId}: Fitness = ${genome.fitness.toFixed(4)}`);
        }
    }

    public getGenome(agentId: string): Genome | undefined {
        return this.lineages.get(agentId);
    }
}

export const nursery = Nursery.getInstance();
