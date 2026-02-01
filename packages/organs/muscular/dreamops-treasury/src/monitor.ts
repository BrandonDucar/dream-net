import { dreamEventBus } from '@dreamnet/nerve';

/**
 * 🕵️ TreasuryMonitor
 * Role: Monitors treasury execution failures and refines sponsorship policies.
 * Directive: "Monitor TREASURY_EXECUTION_FAILURE events to refine gas sponsorship policies."
 */
export class TreasuryMonitor {
  private failureLog: any[] = [];

  constructor() {
    this.init();
  }

  private init() {
    console.log('🕵️ [TreasuryMonitor] Monitor active. Tracking execution integrity...');

    dreamEventBus.subscribe('TREASURY_EXECUTION_FAILURE', (event) => {
      const { settlementId, error, reason, settlement } = event.payload;
      console.error(`🚨 [TreasuryMonitor] Execution FAILURE for ${settlementId} | Reason: ${reason}`);

      this.failureLog.push({
        timestamp: Date.now(),
        settlementId,
        error,
        reason
      });

      // Refinement Logic (Simulated)
      if (reason === 'CONFIG_ERROR') {
        console.warn('🛠️ [TreasuryMonitor] Critical: CDP credentials missing. Blocking further intents.');
      } else if (this.failureLog.length > 5) {
        console.log('📈 [TreasuryMonitor] High failure rate detected. Escalating to Governance Gate.');
      }
    });
  }

  public getFailureReport() {
    return this.failureLog;
  }
}

export const treasuryMonitor = new TreasuryMonitor();
