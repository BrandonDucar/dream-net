import { NERVE_BUS } from '../../../nerve/src/bus.js';
import { DREAMKEEPER_CORE } from '../../../lib/dreamkeeperCore.js';

/**
 * 👔 General Manager
 * Purpose: High-level orchestration of the swarm's proactive immune system.
 * Connects the "Shadow Lab" (threats) to the "CDC Research" (cures).
 */
export class GeneralManager {
  constructor() {
    this.initOrchestration();
  }

  private initOrchestration() {
    // Listen for Shadow Lab threat synthesis
    NERVE_BUS.subscribe('shadow-lab', (event) => {
      if (event.kind === 'synthesis') {
        this.coordinateDefense(event.payload.pathogen);
      }
    });

    // Listen for CDC vaccine publication
    NERVE_BUS.subscribe('cdc-guild', (event) => {
      if (event.kind === 'evolution' && event.payload.strain.evolutionLevel >= 3) {
        this.acknowledgeSuccess(event.payload.strain);
      }
    });
  }

  private coordinateDefense(pathogen: any) {
    DREAMKEEPER_CORE.logs.push(`👔 [General Manager] Coordinating defense for ${pathogen.name}`);
    
    // Command the CDC to prioritize this specific threat vector
    NERVE_BUS.publish({
      id: `gm-directive-${Date.now()}`,
      channelId: 'cdc-guild',
      kind: 'directive:prioritize',
      priority: 2,
      payload: { pathogenId: pathogen.id, vector: pathogen.vector },
      context: { origin: 'GeneralManager', timestamp: Date.now() }
    });
  }

  private acknowledgeSuccess(strain: any) {
    DREAMKEEPER_CORE.logs.push(`👔 [General Manager] Vaccine ${strain.name} verified and ready for global distribution.`);
    
    // Notify the Reward Guild (if exists) or log to the ledger
    NERVE_BUS.publish({
      id: `gm-success-${Date.now()}`,
      channelId: 'reward-guild',
      kind: 'achievement:defense_solidified',
      priority: 3,
      payload: { strainId: strain.id, evolution: strain.evolutionLevel },
      context: { origin: 'GeneralManager', timestamp: Date.now() }
    });
  }
}
