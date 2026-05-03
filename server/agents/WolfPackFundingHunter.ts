import { NERVE_BUS } from '@dreamnet/nerve';
import { natsService } from '../services/NatsService.js';
import { memoryCoordinator } from '../services/MemoryCoordinator.js';
import { type NerveEvent } from '@dreamnet/nerve/types';
import { storage } from '../storage.js';

export interface FundingTarget {
  amount: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'very_hard' | 'extreme';
  deadline: string;
  requirements: string[];
  huntStatus: 'stalking' | 'tracking' | 'investigating' | 'preparing_strike' | 'ready_to_capture' | 'long_term_target';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface PackStrategy {
  approach: string;
  timeline: string;
  success_factors: string[];
  pack_roles: Record<string, string>;
}

/**
 * 🐺 Wolf Pack Funding Hunter
 * Automated grant discovery and application system.
 * Converted to ESM TypeScript for DreamNet Control Core integration.
 */
export class WolfPackFundingHunter {
  private name = 'Wolf Pack Funding Hunter';
  private packMembers = {
    alpha: 'Lead Hunter',
    beta: 'Grant Researcher',
    gamma: 'Application Specialist',
    delta: 'Partnership Scout',
    epsilon: 'Compliance Tracker'
  };

  private huntingTargets: Map<string, Record<string, FundingTarget>> = new Map();
  private strategies: Map<string, PackStrategy> = new Map();
  private packCycles = 0;

  constructor() {
    this.log('🐺 Wolf Pack Funding Hunter activated - Grant hunting pack deployed');
    this.initializeHuntingPack();
  }

  private async initializeHuntingPack() {
    await this.defineFundingTargets();
    await this.setupHuntingStrategies();
    this.startPackHunting();
    this.log('🐺 Pack initialized - Ready for coordinated funding hunts');
  }

  private async defineFundingTargets() {
    const targets: Record<string, Record<string, FundingTarget>> = {
      government: {
        sbir_phase1: {
          amount: 300000,
          difficulty: 'medium',
          deadline: 'rolling',
          requirements: ['small_business', 'innovation', 'us_based'],
          huntStatus: 'stalking',
          priority: 'high'
        },
        nsf_sbir: {
          amount: 1500000,
          difficulty: 'hard',
          deadline: 'quarterly',
          requirements: ['research_component', 'commercialization'],
          huntStatus: 'tracking',
          priority: 'high'
        }
      },
      corporate: {
        google_ai_fund: {
          amount: 2000000,
          difficulty: 'hard',
          deadline: 'continuous',
          requirements: ['ai_focus', 'scalable_platform', 'strong_team'],
          huntStatus: 'preparing_strike',
          priority: 'critical'
        },
        aws_activate: {
          amount: 100000,
          difficulty: 'easy',
          deadline: 'continuous',
          requirements: ['startup_status', 'cloud_architecture'],
          huntStatus: 'ready_to_capture',
          priority: 'high'
        }
      }
    };

    Object.entries(targets).forEach(([category, t]) => {
      this.huntingTargets.set(category, t);
    });
  }

  private async setupHuntingStrategies() {
    const strategies: Record<string, PackStrategy> = {
      government: {
        approach: 'methodical_research',
        timeline: 'long_term',
        success_factors: ['compliance', 'documentation', 'innovation_proof'],
        pack_roles: {
          alpha: 'strategy_coordination',
          beta: 'deep_research',
          gamma: 'application_crafting',
          delta: 'agency_relationships',
          epsilon: 'compliance_verification'
        }
      }
    };

    Object.entries(strategies).forEach(([category, s]) => {
      this.strategies.set(category, s);
    });
  }

  private startPackHunting() {
    setInterval(() => this.executeHuntingCycle(), 300000); // 5 minutes
  }

  private async executeHuntingCycle() {
    this.packCycles++;
    this.log(`🐺 Pack hunting cycle ${this.packCycles} - Coordinated hunt begins`);

    const results = {
      cycle: this.packCycles,
      timestamp: new Date().toISOString(),
      findings: [] as any[]
    };

    // Scan for ready_to_capture targets
    this.huntingTargets.forEach((category, categoryName) => {
      Object.entries(category).forEach(([name, target]) => {
        if (target.huntStatus === 'ready_to_capture') {
          results.findings.push({ category: categoryName, name, ...target });
        }
      });
    });

    if (results.findings.length > 0) {
      await natsService.publish('dreamnet.agents.wolfpack.hunt_results', results);
      
      // Sync findings to the Neural Mesh for other agents to see
      await memoryCoordinator.syncState('funding_leads:active', results.findings, { persist: true, semantic: true });
      
      this.log(`🐺 Targets identified: ${results.findings.length}`);
    }
  }

  /**
   * Externally ingest a new lead (from a Sensory Spike or Hunter)
   */
  public async ingestLead(lead: any) {
      this.log(`🐺 Ingesting new lead: ${lead.name}`);
      // Evaluation logic would go here
      await storage.createFundingLead({
          name: lead.name,
          category: lead.category || 'general',
          amount: lead.amount || 0,
          status: 'stalking',
          source: lead.source || 'unknown',
          metadata: lead
      });
  }

  private log(message: string) {
    console.log(`🐺 [WolfPackFundingHunter] ${message}`);
  }

  public getStatus() {
    return {
      name: this.name,
      cycles: this.packCycles,
      targets: Array.from(this.huntingTargets.keys()).length,
      status: 'active'
    };
  }
}

export const wolfPackFundingHunter = new WolfPackFundingHunter();
