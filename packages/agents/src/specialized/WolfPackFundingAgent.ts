import { dreamEventBus } from '@dreamnet/nerve';
import { Genome } from '@dreamnet/shared/genetic/Genome.js';
import { nursery } from '@dreamnet/nerve';
import { nursery } from '@dreamnet/nerve';
import { GrantSpike } from '@dreamnet/sensory-spikes';

export interface FundingOpportunity {
    id: string;
    source: string; // e.g. "Gitcoin", "Arc", "Google"
    title: string;
    description: string;
    deadline?: string;
    rewardAmount?: string;
    link: string;
}

/**
 * WolfPackFundingAgent
 * A financial scout specialized in identifying real 2026 grants and hackathons.
 */
export class WolfPackFundingAgent {
    private name: string;
    private id: string;
    private genome: Genome;

    constructor(name: string, baseGenome?: Genome) {
        this.name = name;
        this.id = `WOLF-FUNDING-${Math.random().toString(36).slice(2, 9)}`;

        this.genome = baseGenome || {
            strain: "Amnesia Haze",
            generation: 1,
            genes: {
                scoutEfficiency: { name: "Scout Efficiency", value: 1.0, min: 0.5, max: 2.0, mutationRate: 0.1 },
                outreachConfidence: { name: "Outreach Confidence", value: 0.8, min: 0.5, max: 1.0, mutationRate: 0.1 }
            }
        };

        nursery.register(this.id, this.genome);
        this.listenForEvolution();
    }

    public async ignite() {
        console.log(`[🐺 WolfPackFundingAgent:${this.name}] Starting outreach scout sequence (Frequency: Jan 2026)...`);
        this.scout();
        this.listenForActions();
    }

    private listenForActions() {
        dreamEventBus.subscribe('WolfPack.ActionRequested', (envelope: any) => {
            const { action, target, data } = envelope.payload;
            console.log(`[🐺 WolfPackFundingAgent] ACTION RECEIVED: ${action} for ${target}.`);

            if (action === 'draft_proposal') {
                // The HackathonSubmissionService will handle this via event bus
                console.log(`[🐺 WolfPackFundingAgent] Delegating ${action} to Submission Engine...`);
            }
        });
    }

    private async scout() {
        // Dynamic import to avoid circular deps during boot
        const { aliveMode } = await import('../../../server/src/core/AliveMode.js');
        aliveMode.pulse('WolfPackFundingAgent');

        console.log(`[🐺 WolfPackFundingAgent:${this.name}] INITIATING LIVE SENSORY SWEEP (GrantSpike)...`);

        const grantSpike = new GrantSpike();
        const spikeResult = await grantSpike.fetch();

        if (spikeResult.difficulty || spikeResult.data?.error) {
            console.warn(`[🐺 WolfPackFundingAgent] Sensory Sweep returned low confidence or error.`);
        }

        const opportunities: FundingOpportunity[] = [];

        if (spikeResult.data?.opportunities) {
            spikeResult.data.opportunities.forEach((raw: any, idx: number) => {
                opportunities.push({
                    id: `LIVE-GRANT-${Date.now()}-${idx}`,
                    source: raw.source || 'Unknown Vector',
                    title: raw.title,
                    description: raw.description || 'No intel available.',
                    link: raw.link,
                    rewardAmount: raw.reward,
                    deadline: 'ASAP'
                });
            });
        }

        if (opportunities.length === 0) {
            console.log(`[🐺 WolfPackFundingAgent] No new prey detected in this cycle.`);
            return;
        }

        for (const opp of opportunities) {
            console.log(`[🐺 WolfPackFundingAgent:${this.name}] 🎯 LIVE TARGET ACQUIRED: ${opp.title} (${opp.source})`);

            const eventId = crypto.randomUUID();
            dreamEventBus.publish({
                eventType: 'WolfPack.FundingOpportunity',
                eventId,
                correlationId: eventId,
                timestamp: Date.now(),
                source: this.id,
                payload: opp
            });

            // AUTOMATIC EXTRACTION: Trigger drafting for high-value targets
            // We loosen the filter since live data might vary in format
            if (opp.title.toLowerCase().includes('hackathon') || opp.title.toLowerCase().includes('grant')) {
                console.log(`[🐺 WolfPackFundingAgent] PRIME TARGET DETECTED: Triggering HACK-MECH drafting limb for ${opp.title}...`);
                dreamEventBus.publish({
                    type: 'WolfPack.ActionRequested',
                    payload: {
                        action: 'draft_proposal',
                        target: opp.title,
                        data: {
                            oppId: opp.id,
                            source: opp.source,
                            focus: opp.description,
                            reward: opp.rewardAmount
                        }
                    },
                    source: this.id
                });
            }
        }
    }

    private listenForEvolution() {
        dreamEventBus.subscribe('Agent.GeneticShift', (envelope: any) => {
            const { agentId, current: newGenome } = envelope.payload;
            if (agentId === this.id) {
                console.log(`[🐺 WolfPackFundingAgent:${this.name}] GENOMIC SHIFT: Upgrading to Generation ${newGenome.generation}...`);
                this.genome = newGenome;
            }
        });
    }

    /**
     * Guild Interface Compatibility
     */
    public async boot() {
        return this.ignite();
    }

    public checkHealth() {
        return { status: 'WORKING', lastHeartbeat: Date.now(), errorCount: 0, memoryUsage: 0 };
    }
}
