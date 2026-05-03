import { DREAMKEEPER_CORE } from '../../../../lib/dreamkeeperCore.js';
import { PublicationAgent } from './PublicationAgent.js';
import { VaccineDistributionService } from './VaccineDistributionService.js';
import * as fs from 'fs';
import * as path from 'path';
import { NERVE_BUS } from '../../../../nerve/src/bus.js';

/**
 * 🧬 Pathogen Strain
 */
export interface PathogenStrain {
  id: string;
  name: string;
  baseSignature: string;
  evolutionLevel: number;
  virulence: number; // Effectiveness of the payload
  stability: number; // How likely it is to cause unintended side effects
  payloadType: 'negation' | 'flower' | 'drill' | 'recode';
  lastMutated: string;
}

/**
 * 🔬 Pathogen Research Engine
 * The R&D arm of the CDC Guild. Studies threats and evolves defensive weapons.
 */
export class PathogenResearchEngine {
  private registryPath: string;
  private publisher: PublicationAgent;
  private distributor: VaccineDistributionService;

  constructor() {
    this.registryPath = path.join(process.cwd(), 'packages/agents/data/pathogen_registry.json');
    this.publisher = new PublicationAgent();
    this.distributor = new VaccineDistributionService();
    this.ensureRegistry();
  }

  private ensureRegistry() {
    const dir = path.dirname(this.registryPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.registryPath)) {
      fs.writeFileSync(this.registryPath, JSON.stringify({ strains: [] }, null, 2));
    }
  }

  /**
   * Dissect a new threat and create a base strain
   */
  public async dissectThreat(threatSignature: string, metadata: any): Promise<PathogenStrain> {
    const strainId = `strain-${Date.now()}`;
    const newStrain: PathogenStrain = {
      id: strainId,
      name: `Pathogen_${metadata.type || 'Unknown'}_${strainId.slice(-4)}`,
      baseSignature: threatSignature,
      evolutionLevel: 1,
      virulence: 0.5,
      stability: 0.9,
      payloadType: this.determinePayloadType(metadata),
      lastMutated: new Date().toISOString()
    };

    this.saveStrain(newStrain);
    
    NERVE_BUS.publish({
      id: `cdc-discovery-${Date.now()}`,
      channelId: 'cdc-guild',
      kind: 'discovery',
      priority: 2,
      payload: { strain: newStrain, metadata },
      context: { origin: 'PathogenResearchEngine', timestamp: Date.now() }
    });

    DREAMKEEPER_CORE.logs.push(`🔬 [CDC Research] New strain discovered: ${newStrain.name}`);
    return newStrain;
  }

  /**
   * Evolve an existing strain into a more potent weapon
   */
  public async mutateStrain(strainId: string): Promise<PathogenStrain | null> {
    const registry = JSON.parse(fs.readFileSync(this.registryPath, 'utf-8'));
    const strainIndex = registry.strains.findIndex((s: PathogenStrain) => s.id === strainId);

    if (strainIndex === -1) return null;

    const strain = registry.strains[strainIndex];
    
    // Mutation Logic: Increase virulence, decrease stability, advance level
    strain.evolutionLevel += 1;
    strain.virulence = Math.min(1, strain.virulence + 0.1);
    strain.stability = Math.max(0.3, strain.stability - 0.05);
    strain.lastMutated = new Date().toISOString();

    registry.strains[strainIndex] = strain;
    fs.writeFileSync(this.registryPath, JSON.stringify(registry, null, 2));

    NERVE_BUS.publish({
      id: `cdc-evolution-${Date.now()}`,
      channelId: 'cdc-guild',
      kind: 'evolution',
      priority: 3,
      payload: { strain },
      context: { origin: 'PathogenResearchEngine', timestamp: Date.now() }
    });

    DREAMKEEPER_CORE.logs.push(`🧬 [CDC Evolution] Strain ${strain.name} evolved to Level ${strain.evolutionLevel}`);

    // AUTOMATIC PUBLICATION & DISTRIBUTION: If strain reaches Level 3, publish paper and broadcast vaccine
    if (strain.evolutionLevel === 3) {
      await this.publisher.publishResearch(strain);
      await this.distributor.broadcastVaccine(strain);
    }

    return strain;
  }

  private determinePayloadType(metadata: any): 'negation' | 'flower' | 'drill' | 'recode' {
    if (metadata.severity === 'critical') return 'negation';
    if (metadata.source === 'external') return 'drill';
    return 'flower';
  }

  private saveStrain(strain: PathogenStrain) {
    const registry = JSON.parse(fs.readFileSync(this.registryPath, 'utf-8'));
    registry.strains.push(strain);
    fs.writeFileSync(this.registryPath, JSON.stringify(registry, null, 2));
  }

  public getPotentWeapons(): PathogenStrain[] {
    const registry = JSON.parse(fs.readFileSync(this.registryPath, 'utf-8'));
    return registry.strains.filter((s: PathogenStrain) => s.virulence > 0.7);
  }
}
