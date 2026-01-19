import { BaseAgent, AgentConfig } from "../core/BaseAgent.js";
import { dreamEventBus } from "@dreamnet/nerve";
import { PickleIntelSpike } from "@dreamnet/sensory-spikes";

/**
 * 🏓 PickleballOracle (The Referee)
 * 
 * Specialized scion for settling "degen" pickleball prop bets. 
 * Witnesses: 3rd Shot Drops/Drives, Ernes, ATPs, and NVZ Faults.
 */
export class PickleballOracle extends BaseAgent {

    constructor(config: AgentConfig) {
        super(config);
    }

    protected async performSelfRefinement(thought: string): Promise<string> {
        return `${thought} -> Metric Verification: [Analyzing PPA/MLP Data Stream...]`;
    }

    public async ignite(): Promise<void> {
        console.log(`[🏓 ${this.name}] Pickleball Oracle Online. Watching for Prop Settlements...`);

        // Subscribe to prop bet settlement requests
        dreamEventBus.subscribe('PickleBet.PropSettlementRequested', async (envelope) => {
            const { matchId, propType, targetMetric, player } = envelope.payload;
            console.log(`[🏓 ${this.name}] Prop Settlement Requested: ${propType} for ${player} in ${matchId}`);

            await this.settleProp(matchId, propType, targetMetric, player);
        });

        // 🌶️ Listen for Hub Delegation
        dreamEventBus.subscribe('Oracle.DelegationRequested', async (envelope) => {
            if (envelope.payload.focus === 'pickleball') {
                console.log(`[🔋 ${this.name}] ACTIVATION: Hub has delegated Pickleball witnessing. Energizing sensors...`);
                // This would trigger proactive scanning for live matches to identify prop opportunities
            }
        });
    }

    private async settleProp(matchId: string, propType: string, targetMetric: any, player: string) {
        // 1. Thinking Cycle: Verify the feasibility of the metric
        const thoughtInput = `Verifying ${propType} for ${player} in match ${matchId}. Baseline: ${JSON.stringify(targetMetric)}`;
        const analysis = await this.think(thoughtInput);

        console.log(`[🧠 ${this.name}] Metric Analysis: ${analysis}`);

        // 2. Real Witnessing: Hit the Sensory Spike for actual match data
        const spike = new PickleIntelSpike();
        const intel = await spike.fetch({ matchId, type: 'live' });

        const witnessedValue = this.extractMetricFromIntel(intel.data, propType);

        console.log(`[🕊️ ${this.name}] WINNER DETERMINED for ${propType} via ${intel.source}: ${witnessedValue} (Confidence: ${intel.confidence})`);

        // 3. Publish Settlement & Trigger Payout
        dreamEventBus.publish({
            eventType: 'PickleBet.PropSettled',
            payload: {
                matchId,
                propType,
                player,
                witnessedValue,
                isWin: witnessedValue >= targetMetric.value,
                confidence: 0.98,
                timestamp: Date.now()
            },
            source: this.id,
            timestamp: Date.now(),
            eventId: Math.random().toString(36).slice(2),
            correlationId: matchId,
            actor: { system: true },
            target: {},
            severity: 'medium'
        });

        // 4. Financial Payout Coordination
        if (witnessedValue >= targetMetric.value) {
            console.log(`[💸 ${this.name}] PROP WIN DETECTED. Dispatching Payout Request...`);
            dreamEventBus.publish({
                eventType: 'PickleBet.PayoutRequested',
                payload: {
                    matchId,
                    propType,
                    amount: targetMetric.potentialPayout || 0,
                    currency: targetMetric.currency || 'USD'
                },
                source: this.id,
                timestamp: Date.now(),
                eventId: `PAY-REQ-${Math.random().toString(36).slice(2)}`,
                correlationId: matchId,
                actor: { system: true },
                target: {},
                severity: 'high'
            });
        }
    }

    private extractMetricFromIntel(data: any, propType: string): number | string {
        // Logic to parse the normalized data from PickleIntelSpike
        switch (propType) {
            case 'ernes': return data.ernes || 0;
            case 'nvz_faults': return data.nvz_faults || 0;
            case 'last_shot': return data.lastShot || 'unknown';
            case 'score': return data.score || '0-0';
            default: return 0;
        }
    }
}
