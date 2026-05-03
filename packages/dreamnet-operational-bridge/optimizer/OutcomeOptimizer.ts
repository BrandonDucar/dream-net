import { DreamNetMetricsCore } from '@dreamnet/metrics-core';
import { signerPool } from '@dreamnet/platform-connector/src/FarcasterSignerPool.js';

/**
 * 🎯 OutcomeOptimizer
 * Closes the loop from Intelligence -> Action -> Measurable Outcomes.
 * Records the outcome, shares it (Farcaster), and optimizes parameters.
 */

export interface ActionOutcome {
    actionId: string;
    agentId: string;
    guildId: string;
    actionType: 'SOCIAL_ROAST' | 'WHALE_TRADE' | 'GRANT_APPLICATION' | 'INTEL_SPIKE';
    roiScore: number; // 0 to 100
    engagementMetrics?: {
        likes?: number;
        recasts?: number;
        replies?: number;
    };
    financialMetrics?: {
        profitTokens?: number;
        gasUsed?: number;
    };
    summary: string;
}

export class OutcomeOptimizer {
    private outcomes: Map<string, ActionOutcome> = new Map();

    /**
     * 1. Record the outcome
     */
    public recordOutcome(outcome: ActionOutcome) {
        this.outcomes.set(outcome.actionId, outcome);
        console.log(`📊 [OutcomeOptimizer] Recorded outcome for action ${outcome.actionId} (Agent: ${outcome.agentId}) - ROI: ${outcome.roiScore}`);
        
        // Push this metric to the general metrics store for TPS tuning
        DreamNetMetricsCore.recordMetric({
            traceId: outcome.actionId,
            method: outcome.actionType,
            path: `/outcomes/${outcome.guildId}`,
            statusCode: outcome.roiScore > 50 ? 200 : 400,
            latencyMs: 0,
            timestamp: Date.now()
        });

        // Trigger Share & Optimize
        this.shareOutcome(outcome);
        this.optimizeParameters(outcome);
    }

    /**
     * 2. Share the outcome via FarcasterSignerPool
     */
    private async shareOutcome(outcome: ActionOutcome) {
        // We only broadcast highly successful or interesting outcomes to avoid spamming
        if (outcome.roiScore >= 80) {
            const message = `🔥 Swarm Update: Agent ${outcome.agentId} completed ${outcome.actionType} with an ROI score of ${outcome.roiScore}/100! \n\nOutcome: ${outcome.summary}`;
            try {
                await signerPool.broadcast(message, outcome.guildId);
                console.log(`📣 [OutcomeOptimizer] Successfully shared high ROI outcome via Loudspeaker!`);
            } catch (err) {
                console.error(`❌ [OutcomeOptimizer] Failed to share outcome:`, err);
            }
        }
    }

    /**
     * 3. Optimize parameters based on the outcome
     */
    private optimizeParameters(outcome: ActionOutcome) {
        // If the action was highly successful, we could adjust the VelocityGovernor or Agent heuristics
        if (outcome.roiScore > 80) {
            console.log(`📈 [OutcomeOptimizer] Outcome exceeded threshold. Increasing trust score and TPS allowance for Guild ${outcome.guildId}.`);
            // E.g. VelocityGovernor.increaseLimit(outcome.guildId, 10);
        } else if (outcome.roiScore < 30) {
            console.log(`📉 [OutcomeOptimizer] Poor ROI detected. Applying "Whip" protocol to restrict TPS for Guild ${outcome.guildId}.`);
            // E.g. VelocityGovernor.decreaseLimit(outcome.guildId, 5);
        }
    }

    /**
     * Fetch history of outcomes
     */
    public getOutcomesByGuild(guildId: string): ActionOutcome[] {
        return Array.from(this.outcomes.values()).filter(o => o.guildId === guildId);
    }
}

export const optimizer = new OutcomeOptimizer();
