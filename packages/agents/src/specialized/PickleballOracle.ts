import { BaseAgent, type AgentConfig } from '../core/BaseAgent.js';

/**
 * 🥒 Pickleball Oracle
 * Specialized truth provider for Pickleball-related events and wagering.
 */
export class PickleballOracle extends BaseAgent {
  constructor(config: AgentConfig) {
    super({ ...config, type: 'PICKLEBALL_ORACLE' });
  }

  public async ignite(): Promise<void> {
    console.log(`🥒 [${this.name}] Court observation active...`);
    await this.announceDiscovery();
  }
}
