import { dreamEventBus } from '@dreamnet/nerve';
import { Genome } from '@dreamnet/shared/genetic/Genome.js';
import { nursery } from '@dreamnet/nerve';

export interface ArbitrageConfig {
    scoutFrequency: number; // ms
    minYieldThreshold: number; // Percentage
    protocols: string[];
    genome?: Genome;
}

/**
 * ArbitrageAgent
 * A predatory Mech Suit designed to scout for alpha.
 */
export class ArbitrageAgent {
    private name: string;
    private id: string;
    private config: ArbitrageConfig;
    private genome: Genome;

    constructor(name: string, config: ArbitrageConfig) {
        this.name = name;
        this.id = `ARBITRAGE-${Math.random().toString(36).slice(2, 9)}`;
        this.config = config;

        // Default 'Amnesia Haze' Genome if not provided
        this.genome = config.genome || {
            strain: "Amnesia Haze",
            generation: 1,
            genes: {
                scoutEfficiency: { name: "Scout Efficiency", value: 1.0, min: 0.5, max: 2.0, mutationRate: 0.1 },
                yieldThreshold: { name: "Yield Threshold", value: config.minYieldThreshold, min: 0.005, max: 0.1, mutationRate: 0.1 }
            }
        };

        nursery.register(this.id, this.genome);
    }

    /**
     * ignite
     * Starts the scouting loop.
     */
    public async ignite() {
        console.log(`[🦊 ArbitrageAgent:${this.name}] Starting genomic scout sequence (${this.genome.strain})...`);
        this.listenForEvolution();
        this.scout();
    }

    private scout() {
        // Genomic parameters
        const yieldThreshold = this.genome.genes.yieldThreshold.value;
        const efficiency = this.genome.genes.scoutEfficiency.value;

        // High-fidelity simulation of an arbitrage opportunity
        const opportunity = {
            opportunityId: `OPP-${Date.now()}`,
            protocol: this.config.protocols[Math.floor(Math.random() * this.config.protocols.length)],
            tokenPair: ['ETH', 'USDC'] as [string, string],
            expectedYield: (0.025 + Math.random() * 0.01) * efficiency,
            confidence: 0.85 + Math.random() * 0.1
        };

        if (opportunity.expectedYield >= yieldThreshold) {
            console.log(`[🦊 ArbitrageAgent:${this.name}] ALPHA DETECTED: ${opportunity.opportunityId} (Yield: ${(opportunity.expectedYield * 100).toFixed(2)}%) [Gen:${this.genome.generation}]`);

            // Broadcast to the FlashTrader via the DreamEventBus
            dreamEventBus.publish({
                type: 'Market.OpportunityDetected',
                payload: opportunity,
                source: this.id
            });
        }
    }

    private listenForEvolution() {
        dreamEventBus.subscribe('Agent.GeneticShift', (envelope: any) => {
            const { agentId, current: newGenome } = envelope.payload;
            if (agentId === this.id) {
                console.log(`[🦊 ArbitrageAgent:${this.name}] GENOMIC SHIFT: Upgrading to Generation ${newGenome.generation}...`);
                this.genome = newGenome;
            }
        });
    }
}
