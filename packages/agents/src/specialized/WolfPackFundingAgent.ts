import { dreamEventBus } from '@dreamnet/nerve';
import { BaseAgent, AgentConfig } from '../core/BaseAgent.js';
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
 * 🐺 WolfPackFundingAgent: The "Hunter-Gatherer"
 * Focus: Swarm Economics & Autonomous Revenue.
 * 🎯 Phase V Aufgabe: Identify -> Verify (Oracle) -> Pursue (Pilot)
 */
export class WolfPackFundingAgent extends BaseAgent {

    constructor(config: AgentConfig) {
        super(config);
    }

    protected async performSelfRefinement(thought: string): Promise<string> {
        return `${thought} -> Value Extraction Risk: [Analyzing ROI vs Effort...]`;
    }

    public async ignite(): Promise<void> {
        console.log(`[🐺 ${this.name}] Starting Hunter Scout sequence...`);

        // Initial scout run
        await this.scout();

        // Listen for internal triggers
        this.listenForActions();
    }

    private listenForActions() {
        dreamEventBus.subscribe('WolfPack.ActionRequested', (envelope: any) => {
            const { action, target, data } = envelope.payload;
            console.log(`[🐺 ${this.name}] ACTION RECEIVED: ${action} for ${target}.`);

            if (action === 'draft_proposal') {
                console.log(`[🐺 ${this.name}] Delegating ${action} to Submission Engine...`);
            }
        });
    }

    private async scout() {
        console.log(`[🐺 ${this.name}] INITIATING LIVE SENSORY SWEEP (GrantSpike)...`);

        const grantSpike = new GrantSpike();
        const spikeResult = await grantSpike.fetch();

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
            console.log(`[🐺 ${this.name}] No new prey detected.`);
            return;
        }

        for (const opp of opportunities) {
            console.log(`[🐺 ${this.name}] 🎯 TARGET DETECTED: ${opp.title} (${opp.source})`);

            // 1. Deep Thinking: Assess the value
            const thoughtInput = `Assessing revenue potential for ${opp.title}. Reward: ${opp.rewardAmount}.`;
            const analysis = await this.think(thoughtInput);
            console.log(`[🧠 ${this.name}] Analysis: ${analysis}`);

            // 2. Request Verification from Oracle (DreamBet or specialized Truth Oracle)
            // We publish an event that the Oracle scions are watching
            dreamEventBus.publish({
                eventType: 'WolfPack.VerificationRequested',
                payload: {
                    type: 'opportunity_validity',
                    target: opp.id,
                    metadata: opp
                },
                source: this.id,
                timestamp: Date.now(),
                eventId: Math.random().toString(36).slice(2),
                correlationId: this.id,
                actor: { system: true },
                target: {},
                severity: 'low'
            });

            // 3. Trigger drafting if it passes internal threshold (simulated for now)
            if (opp.title.toLowerCase().includes('hackathon') || opp.title.toLowerCase().includes('grant')) {
                console.log(`[🐺 ${this.name}] PRIME TARGET: Triggering Pilot for drafting...`);
                dreamEventBus.publish({
                    eventType: 'WolfPack.ActionRequested',
                    payload: {
                        action: 'draft_proposal',
                        target: opp.title,
                        data: {
                            oppId: opp.id,
                            source: opp.source,
                            reward: opp.rewardAmount
                        }
                    },
                    source: this.id,
                    timestamp: Date.now(),
                    eventId: Math.random().toString(36).slice(2),
                    correlationId: this.id,
                    actor: { system: true },
                    target: {},
                    severity: 'medium'
                });
            }
        }
    }
}
