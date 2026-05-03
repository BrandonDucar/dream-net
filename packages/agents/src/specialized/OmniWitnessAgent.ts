import { BaseAgent, type AgentConfig } from '../core/BaseAgent.js';

/**
 * 👁️ Omni Witness Agent
 * Observes all events across the mesh for anomaly detection.
 */
export class OmniWitnessAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super({ ...config, type: 'OMNI_WITNESS' });
  }

  public async ignite(): Promise<void> {
    console.log(`👁️ [${this.name}] Opening Omni Eye...`);
    await this.announceDiscovery();
  }
}
