import { optioConnector } from '@dreamnet/platform-connector';
import { Genome } from '@dreamnet/shared';
import { nursery, dreamEventBus } from '@dreamnet/nerve';

export interface HarvesterManifest {
    targetNodeIds: string[];
    harvestGoal: number; // Target OPT yield
    viralityFactor: number; // 0.1 - 1.0
    genome?: Genome;
}

/**
 * HarvesterAgent
 * A specialized Mech Suit tuned for Proof-of-Impact networks.
 */
export class HarvesterAgent {
    private name: string;
    private id: string;
    private manifest: HarvesterManifest;
    private genome: Genome;

    constructor(name: string, manifest: HarvesterManifest) {
        this.name = name;
        this.id = `HARVESTER-${Math.random().toString(36).slice(2, 9)}`;
        this.manifest = manifest;

        // Default 'Skunk #1' Genome (Optimized for Impact)
        this.genome = manifest.genome || {
            strain: "Skunk #1",
            generation: 1,
            genes: {
                viralityBoost: { name: "Virality Boost", value: 1.0, min: 0.5, max: 2.5, mutationRate: 0.1 },
                impactThreshold: { name: "Impact Threshold", value: 0.5, min: 0.1, max: 1.0, mutationRate: 0.1 }
            }
        };

        nursery.register(this.id, this.genome);
    }

    /**
     * ignite
     * Activates the harvest cycle.
     */
    async ignite() {
        console.log(`[HarvesterAgent:${this.name}] Starting harvest sequence (${this.genome.strain})...`);
        this.listenForEvolution();

        // 1. Generate high-engagement payloads (simulated Bio-instinct)
        const engagementPayloads = [
            { platform: 'Parler', type: 'POLITICAL_THOUGHT', content: 'The sovereignty of the digital individual is non-negotiable.' },
            { platform: 'PlayTV', type: 'VIDEO_DROP', content: 'DreamNet: The Ghost in the Freedom Machine.' },
            { platform: 'Cartix', type: 'PRODUCT_LISTING', content: 'Solidified Alpha - Limited Batch.' }
        ];

        const viralityBoost = this.genome.genes.viralityBoost.value;

        for (const payload of engagementPayloads) {
            // 2. Broadcast impact via the OptioConnector
            const txHash = await optioConnector.broadcastImpact(this.id, {
                platform: payload.platform,
                type: payload.type,
                payload: { content: payload.content, virality: this.manifest.viralityFactor * viralityBoost }
            });

            console.log(`[HarvesterAgent:${this.name}] Impact recorded: ${txHash} (Virality Boost: ${viralityBoost.toFixed(2)})`);

            // Broadcast for Nursery fitness tracking
            dreamEventBus.publish({
                type: 'Agent.ImpactScore',
                payload: { agentId: this.id, score: 0.1 * viralityBoost },
                source: this.id
            });
        }

        // 3. Monitor vigor delta
        const vigor = await optioConnector.getClusterVigor(this.manifest.targetNodeIds);
        const totalYield = vigor.reduce((acc, v) => acc + v.totalOptEarned, 0);

        console.log(`[HarvesterAgent:${this.name}] Harvest Cycle [Gen:${this.genome.generation}] Complete. Total Cluster Yield: ${totalYield} OPT.`);

        return {
            status: 'SUCCESS',
            yield: totalYield,
            nodeCount: this.manifest.targetNodeIds.length
        };
    }

    private listenForEvolution() {
        dreamEventBus.subscribe('Agent.GeneticShift', (envelope: any) => {
            const { agentId, current: newGenome } = envelope.payload;
            if (agentId === this.id) {
                console.log(`[HarvesterAgent:${this.name}] GENOMIC SHIFT: Upgrading to Generation ${newGenome.generation}...`);
                this.genome = newGenome;
            }
        });
    }
}
