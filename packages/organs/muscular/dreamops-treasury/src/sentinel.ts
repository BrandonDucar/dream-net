import { dreamEventBus } from '@dreamnet/nerve';
import { TreasuryExecutor } from './executor.js';
import { Settlement, P_O_W_K } from './types.js';

/**
 * 🛰️ TreasurySentinel
 * Role: Monitors the Nerve Bus for agentic performance and settlement intents.
 * Logic: Triggers the TreasuryExecutor when high-performance scores are detected.
 */
export class TreasurySentinel {
  private executor: TreasuryExecutor;
  private metrics = {
    totalSettlements: 0,
    successfulSettlements: 0,
    failedSettlements: 0,
    averageSuccessRate: 0,
    jouleEfficiency: 0
  };

  constructor(executor: TreasuryExecutor) {
    this.executor = executor;
    this.init();
  }

  private init() {
    console.log('🛰️ [TreasurySentinel] Sentinel online. Monitoring P.O.W.K. and Settlement intents...');

    // 1. Listen for P.O.W.K. Scorecards
    dreamEventBus.subscribe('POWK_SCORECARD_GENERATED', async (event: any) => {
      const powk = event.payload as P_O_W_K;
      console.log(`🛰️ [TreasurySentinel] Detected P.O.W.K. scorecard for Agent: ${powk.agentId} | Score: ${powk.metrics.success_rate * 100}%`);

      // Automated Reward Logic: Trigger reward if success rate > 90%
      if (powk.metrics.success_rate > 0.9) {
        console.log(`🛰️ [TreasurySentinel] Performance threshold met (>90%). Proposing automated reward...`);
        
        this.metrics.totalSettlements++;
        this.metrics.jouleEfficiency = (this.metrics.jouleEfficiency + powk.metrics.token_efficiency) / 2;

        const settlement: Settlement = {
          id: crypto.randomUUID(),
          bountyId: `AUTO-REWARD-${powk.id}`,
          amount: '0.05', // 0.05 ETH/USDC reward
          payee: '0x_agent_wallet_placeholder', // To be pulled from agent registry
          status: 'PENDING',
          timestamp: Date.now()
        };

        try {
          await this.executor.processSettlement(settlement, powk);
          this.metrics.successfulSettlements++;
          
          // 🏆 Achievement Broadcast (Lens/Social Alignment)
          this.broadcastAchievement(powk);
        } catch (error) {
          this.metrics.failedSettlements++;
          console.error('🛰️ [TreasurySentinel] Automated settlement proposal failed:', error);
          
          dreamEventBus.publish(dreamEventBus.createEnvelope(
            'TREASURY_EXECUTION_FAILURE',
            'TreasurySentinel',
            { settlementId: settlement.id, reason: (error as Error).message },
            { severity: 'high' }
          ));
        }
        
        this.broadcastMetrics();
      }
    });

    // 2. Listen for explicit settlement proposals
    dreamEventBus.subscribe('TREASURY_SETTLEMENT_PROPOSED', async (event: any) => {
      console.log('🛰️ [TreasurySentinel] Explicit settlement proposal detected. Handing over to Governance Gate...');
      // In this phase, the sentinel just logs/traces these for the auditor.
    });
  }

  private broadcastAchievement(powk: P_O_W_K) {
    dreamEventBus.publish(dreamEventBus.createEnvelope(
      'AGENT_ACHIEVEMENT_BROADCAST',
      'TreasurySentinel',
      {
        agentId: powk.agentId,
        achievement: 'HIGH_FITNESS_LEVEL',
        score: powk.metrics.success_rate,
        handle: `@${powk.agentId}.lens`, // Placeholder handle
        timestamp: Date.now()
      },
      { severity: 'medium' }
    ));
  }

  private broadcastMetrics() {
    dreamEventBus.publish(dreamEventBus.createEnvelope(
      'TREASURY_METRICS_UPDATE',
      'TreasurySentinel',
      this.metrics,
      { severity: 'low' }
    ));
  }
}
