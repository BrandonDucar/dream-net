import { BaseAgent, type AgentConfig } from '../core/BaseAgent.js';
import { NERVE_BUS, type NerveEvent, type ShieldEventPayload } from '@dreamnet/nerve';
import { DREAMKEEPER_CORE } from '../../../../lib/dreamkeeperCore.js';
import { PathogenResearchEngine } from './PathogenResearchEngine.js';

/**
 * 🦠 Dreamthrax Agent
 * An offensive-defensive unit that latches onto malicious programs, 
 * drills through their layers, and injects beneficial code or negation payloads.
 */
export class DreamthraxAgent extends BaseAgent {
  private neutralizedCount: number = 0;
  private activeLatches: Set<string> = new Set();
  private researchEngine: PathogenResearchEngine;

  constructor(config: AgentConfig) {
    super({ ...config, type: 'DREAMTHRAX' });
    this.researchEngine = new PathogenResearchEngine();
  }

  public async ignite(): Promise<void> {
    console.log(`🦠 [${this.name}] Dreamthrax spores dispersed. Listening for pathogens...`);
    
    // Subscribe to Shield Events (Security)
    NERVE_BUS.subscribe('SHIELD_EVENT', (event) => this.handleShieldEvent(event));
    
    await this.announceDiscovery();
  }

  private async handleShieldEvent(event: NerveEvent) {
    if (event.kind === 'THREAT_DETECTED') {
      const payload = event.payload as ShieldEventPayload;
      await this.latchAndNeutralize(payload, event.id);
    }
  }

  /**
   * Reverse-engineered biological mechanism: Latch -> Drill -> Inject -> Isolate
   */
  private async latchAndNeutralize(threat: ShieldEventPayload, threatId: string) {
    const targetId = threat.threatType || 'unknown_pathogen';
    
    if (this.activeLatches.has(threatId)) return;
    this.activeLatches.add(threatId);

    console.log(`🧲 [${this.name}] LATCHING onto ${targetId} (ID: ${threatId})`);
    
    // Step 1: Latch (Targeting)
    await this.delay(500);
    
    // Step 2: Drill (Penetrating layers)
    console.log(`🌀 [${this.name}] DRILLING through defensive obfuscation of ${targetId}...`);
    await this.delay(800);
    
    // Step 3: Inject (Beneficial Hacking)
    const isHighRisk = threat.threatLevel === 'extreme' || threat.threatLevel === 'critical';
    const payloadType = isHighRisk ? 'NEGATION_BOMB' : 'FLOWER_BOMB';
    
    console.log(`💉 [${this.name}] INJECTING ${payloadType} into ${targetId}`);
    
    if (payloadType === 'NEGATION_BOMB') {
      // Restrictive payload: Renders program useless by looping it or stripping logic
      await this.log('injection', { type: 'NEGATION', target: threatId, result: 'Logic neutralized' });
    } else {
      // Beneficial payload: Replaces malicious code with healing/stabilizing logic
      await this.log('injection', { type: 'FLOWER', target: threatId, result: 'Beneficial code seeded' });
    }
    
    // Step 4: Isolate (Containerization with CDC BSL Protocols)
    const bsl: 'BSL-3' | 'BSL-4' = isHighRisk ? 'BSL-4' : 'BSL-3';
    console.log(`📦 [${this.name}] ISOLATING ${targetId} in ${bsl} containment...`);
    
    // Consult with Virtual Staff (Model attribution)
    const leadScientist = isHighRisk ? 'Dr. Doudna' : 'Agent Mitnick';
    console.log(`🧬 [${this.name}] Consulted ${leadScientist} for optimal ${payloadType} configuration.`);

    await this.delay(500);
    
    this.neutralizedCount++;
    this.activeLatches.delete(threatId);
    
    // Notify the Core / Research Lab
    const strain = await this.researchEngine.dissectThreat(targetId, {
      type: threat.threatType,
      severity: threat.threatLevel,
      source: 'live_interception'
    });

    // If the strain is already known, evolve it
    if (strain.evolutionLevel < 5) {
      await this.researchEngine.mutateStrain(strain.id);
    }

    DREAMKEEPER_CORE.learnAndAdapt({
      source: this.name,
      type: 'security_flag',
      details: {
        threatId,
        neutralization: payloadType,
        bslLevel: bsl,
        staffConsulted: leadScientist,
        activeStrain: strain.name,
        evolution: strain.evolutionLevel,
        timestamp: new Date().toISOString()
      }
    });

    console.log(`✅ [${this.name}] Threat ${threatId} neutralized. Total carcasses: ${this.neutralizedCount}`);
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public getStats() {
    return {
      name: this.name,
      type: this.type,
      neutralizedCount: this.neutralizedCount,
      status: this.status
    };
  }
}
