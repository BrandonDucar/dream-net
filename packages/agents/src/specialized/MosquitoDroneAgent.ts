import { BaseAgent, type AgentConfig } from '../core/BaseAgent.js';
import { NERVE_BUS, type NerveEvent } from '@dreamnet/nerve';

/**
 * 🦟 Mosquito Drone Agent
 * High-speed, lightweight sensor units that scan the mesh for "heat signatures" 
 * of malicious activity. They don't neutralize; they LATCH and CALL FOR DREAMTHRAX.
 */
export class MosquitoDroneAgent extends BaseAgent {
  private targetsTracked: Set<string> = new Set();

  constructor(config: AgentConfig) {
    super({ ...config, type: 'MOSQUITO_DRONE' });
  }

  public async ignite(): Promise<void> {
    console.log(`🦟 [${this.name}] Mosquito swarm deployed. Seeking heat signatures...`);
    
    // Subscribe to all events - Mosquitos are hungry!
    NERVE_BUS.subscribeAll((event) => this.scan(event));
    
    await this.announceDiscovery();
  }

  private async scan(event: NerveEvent) {
    // Check for "heat" (High risk scores or suspicious patterns)
    const riskScore = event.context?.riskScore || 0;
    const isSuspicious = riskScore > 60 || event.kind.includes('ERROR') || event.kind.includes('FAIL');

    if (isSuspicious && !this.targetsTracked.has(event.id)) {
      this.targetsTracked.add(event.id);
      await this.latch(event);
    }
  }

  /**
   * The "Bite": Attaching a tracking beacon to the event/process
   */
  private async latch(event: NerveEvent) {
    const riskScore = event.context?.riskScore || 0;
    console.log(`🎯 [${this.name}] TARGET ACQUIRED: ${event.kind} (Risk: ${riskScore})`);
    
    // Delivery: "Inject" a tracking ID into the context (The Proboscis)
    // We use a temporary cast or ensure the property exists on NerveContext
    (event.context as any).trackedBy = this.name;
    (event.context as any).mosquitoBiteTime = new Date().toISOString();

    console.log(`💉 [${this.name}] LATCHED. Summoning Dreamthrax for neutralization...`);

    // Emit a THREAT_DETECTED event for Dreamthrax to pick up
    NERVE_BUS.publish({
      id: `threat_${event.id}`,
      channelId: 'SHIELD_EVENT',
      kind: 'THREAT_DETECTED',
      priority: 5,
      context: event.context,
      payload: {
        threatType: event.kind,
        threatLevel: riskScore > 90 ? 'extreme' : 'critical',
        actionTaken: 'mosquito_latch'
      }
    });
  }

  public getStats() {
    return {
      name: this.name,
      targetsDetected: this.targetsTracked.size,
      status: this.status
    };
  }
}
