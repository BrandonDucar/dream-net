import { BaseAgent, type AgentConfig } from '../core/BaseAgent.js';

/**
 * 📊 Price Oracle
 * Fetches and validates cross-chain asset prices.
 */
export class PriceOracle extends BaseAgent {
  constructor(config: AgentConfig) {
    super({ ...config, type: 'PRICE_ORACLE' });
  }

  public async ignite(): Promise<void> {
    console.log(`📊 [${this.name}] Price feed active...`);
    await this.announceDiscovery();
  }
}
