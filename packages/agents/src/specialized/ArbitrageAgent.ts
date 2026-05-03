import { BaseAgent, type AgentConfig } from '../core/BaseAgent.js';

/**
 * ⚡ Arbitrage Agent
 * Identifies and executes cross-chain arbitrage opportunities.
 */
export class ArbitrageAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super({ ...config, type: 'ARBITRAGE' });
  }

  public async ignite(): Promise<void> {
    console.log(`⚡ [${this.name}] Scanning for price discrepancies...`);
    await this.announceDiscovery();
  }
}
