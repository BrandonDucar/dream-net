import { BaseAgent, type AgentConfig } from '../core/BaseAgent.js';

/**
 * 🐺 WolfPack Funding Agent
 * Specialized in finding and securing funding opportunities.
 */
export class WolfPackFundingAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super({ ...config, type: 'WOLF_PACK_FUNDING' });
  }

  public async ignite(): Promise<void> {
    console.log(`🐺 [${this.name}] Hunting for funding leads...`);
    await this.announceDiscovery();
  }
}
