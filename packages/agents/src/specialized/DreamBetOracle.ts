import { BaseAgent, AgentConfig } from "../core/BaseAgent";
import { dreamEventBus } from "@dreamnet/nerve";
import { OracleEngine } from "@dreamnet/dreambet-core/logic/oracle";

/**
 * 🎲 DreamBetOracle (The Witness)
 * 
 * Specifically designed to witness and authorize the settlement of betting rounds.
 * Bridges the simulative OracleEngine with authoritative Truth Stamps.
 */
export class DreamBetOracle extends BaseAgent {

    constructor(config: AgentConfig) {
        super(config);
    }

    /**
     * Simulation of self-refinement for settlement logic.
     */
    protected async performSelfRefinement(thought: string): Promise<string> {
        return `${thought} -> Settlement Check: [Aggregating Consensus...]`;
    }

    /**
     * Main lifecycle: Listen for Pending Settlements -> Verify -> Authorize
     */
    public async ignite(): Promise<void> {
        console.log(`[🎲 ${this.name}] Settlement Gaze Active. Watching the DreamBet pulse...`);

        // Subscribe to settle requests
        dreamEventBus.subscribe('DreamBet.SettlementRequested', async (envelope) => {
            const { gameId, roundId, participants, gameType } = envelope.payload;
            console.log(`[🎲 ${this.name}] Settlement Request Detected: ${gameId}/${roundId}`);

            await this.handleSettlement(gameId, roundId, participants, gameType);
        });
    }

    private async handleSettlement(gameId: string, roundId: string, participants: string[], gameType: string) {
        // 1. Thinking Cycle: Verify the integrity of the request
        const thoughtInput = `Verifying settlement for ${gameType} round ${roundId}. Participants: ${participants.join(", ")}.`;
        const finalTruth = await this.think(thoughtInput);

        console.log(`[🧠 ${this.name}] Settlement Determination: ${finalTruth}`);

        // 2. Consult OracleEngine for Prediction/Verification data
        const prediction = await OracleEngine.predict({
            gameType,
            participants,
            context: { roundId, gameId }
        });

        // 3. Authoritative Decision
        // In a production scenario, we'd check an external API (sports, market, etc.)
        // For now, we use the prediction as our 'Witnessed Truth' with high confidence.
        const witnessedOutcome = prediction.outcome;

        console.log(`[🕊️ ${this.name}] FINAL ruling for ${gameId}/${roundId}: Winner is ${witnessedOutcome}`);

        // 4. Publish Settlement Event
        dreamEventBus.publish({
            type: 'DreamBet.RoundSettled',
            payload: {
                gameId,
                roundId,
                winner: witnessedOutcome,
                confidence: prediction.confidence,
                signedBy: this.id,
                timestamp: Date.now()
            },
            source: 'DreamBetOracle'
        });
    }
}
