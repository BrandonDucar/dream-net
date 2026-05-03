import { BaseAgent, type AgentConfig } from '../core/BaseAgent.js';

/**
 * 🚜 Harvester Agent
 * Specialized in scanning and extracting high-value data from the mesh.
 */
export class HarvesterAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super({ ...config, type: 'HARVESTER' });
  }

  public async ignite(): Promise<void> {
    console.log(`🚜 [${this.name}] Starting harvest cycles...`);
    await this.announceDiscovery();
    
    // Start interval for harvesting
    setInterval(() => this.harvest(), 60000);
  }

  private async harvest() {
    await this.log('harvest_cycle', { status: 'scanning', results: 0 });
  }
}
