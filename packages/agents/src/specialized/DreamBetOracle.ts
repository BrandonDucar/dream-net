import { BaseAgent, type AgentConfig } from '../core/BaseAgent.js';

/**
 * 🎰 DreamBet Oracle
 * Provides real-time truth for the DreamBet gaming engine.
 */
export class DreamBetOracle extends BaseAgent {
  constructor(config: AgentConfig) {
    super({ ...config, type: 'DREAMBET_ORACLE' });
  }

  public async ignite(): Promise<void> {
    console.log(`🎰 [${this.name}] Oracle gaze active...`);
    await this.announceDiscovery();
  }
}
