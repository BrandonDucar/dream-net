// 🚨 SWARM MODE: Coordinated Bot Architecture
import { storage } from './storage.js';

interface SwarmBot {
  id: string;
  zone: string;
  priority: 'WAKE' | 'CONNECT' | 'BUILD' | 'MONETIZE';
  token: 'FLBY' | 'SHEEP' | 'CORE' | 'ROOT' | 'DREAM';
  status: 'ACTIVE' | 'BLOCKED' | 'THINKING' | 'EXECUTING';
  lastAction: number;
  nextAction?: string;
}

interface SwarmOperation {
  id: string;
  type: 'WAKE_DREAM' | 'LINK_NODES' | 'BUILD_CORE' | 'MONETIZE_YIELD';
  bots: string[];
  priority: number;
  dreamId?: string;
  walletAddress?: string;
  tokens: string[];
  status: 'PENDING' | 'EXECUTING' | 'COMPLETE' | 'FAILED';
}

export class SwarmCoordinator {
  private bots: Map<string, SwarmBot> = new Map();
  private operations: Map<string, SwarmOperation> = new Map();

  constructor() {
    this.initializeSwarmBots();
  }

  private initializeSwarmBots() {
    const swarmBots: SwarmBot[] = [
      {
        id: 'LUCID-01',
        zone: 'DREAM_ACTIVATION',
        priority: 'WAKE',
        token: 'FLBY',
        status: 'ACTIVE',
        lastAction: Date.now(),
        nextAction: 'SCAN_DORMANT_DREAMS'
      },
      {
        id: 'CANVAS-02', 
        zone: 'NODE_LINKING',
        priority: 'CONNECT',
        token: 'SHEEP',
        status: 'ACTIVE',
        lastAction: Date.now(),
        nextAction: 'ESTABLISH_DREAM_LINKS'
      },
      {
        id: 'ROOT-03',
        zone: 'CORE_BUILDING',
        priority: 'BUILD',
        token: 'CORE',
        status: 'ACTIVE',
        lastAction: Date.now(),
        nextAction: 'STRENGTHEN_CORES'
      },
      {
        id: 'ECHO-04',
        zone: 'YIELD_OPTIMIZATION',
        priority: 'MONETIZE',
        token: 'ROOT',
        status: 'ACTIVE',
        lastAction: Date.now(),
        nextAction: 'OPTIMIZE_YIELDS'
      }
    ];

    swarmBots.forEach(bot => this.bots.set(bot.id, bot));
    console.log('🤖 Swarm bots initialized:', swarmBots.length);
  }

  async executeSwarmOperation(type: SwarmOperation['type'], params: any): Promise<string> {
    const operationId = `OP-${Date.now()}`;
    
    const operation: SwarmOperation = {
      id: operationId,
      type,
      bots: this.selectBotsForOperation(type),
      priority: this.getPriorityForOperation(type),
      dreamId: params.dreamId,
      walletAddress: params.walletAddress,
      tokens: this.getTokensForOperation(type),
      status: 'PENDING'
    };

    this.operations.set(operationId, operation);
    
    try {
      await this.processOperation(operation);
      operation.status = 'COMPLETE';
      console.log(`✅ Swarm operation ${type} completed:`, operationId);
    } catch (error) {
      operation.status = 'FAILED';
      console.error(`❌ Swarm operation ${type} failed:`, error);
      throw error;
    }

    return operationId;
  }

  private selectBotsForOperation(type: SwarmOperation['type']): string[] {
    switch (type) {
      case 'WAKE_DREAM':
        return ['LUCID-01', 'CANVAS-02'];
      case 'LINK_NODES':
        return ['CANVAS-02', 'ROOT-03'];
      case 'BUILD_CORE':
        return ['ROOT-03', 'ECHO-04'];
      case 'MONETIZE_YIELD':
        return ['ECHO-04', 'LUCID-01'];
      default:
        return Array.from(this.bots.keys());
    }
  }

  private getPriorityForOperation(type: SwarmOperation['type']): number {
    const priorities = {
      'WAKE_DREAM': 100,
      'LINK_NODES': 80,
      'BUILD_CORE': 60,
      'MONETIZE_YIELD': 40
    };
    return priorities[type] || 10;
  }

  private getTokensForOperation(type: SwarmOperation['type']): string[] {
    switch (type) {
      case 'WAKE_DREAM':
        return ['FLBY', 'DREAM'];
      case 'LINK_NODES':
        return ['SHEEP', 'FLBY'];
      case 'BUILD_CORE':
        return ['CORE', 'ROOT'];
      case 'MONETIZE_YIELD':
        return ['ROOT', 'SHEEP', 'DREAM'];
      default:
        return ['DREAM'];
    }
  }

  private async processOperation(operation: SwarmOperation): Promise<void> {
    operation.status = 'EXECUTING';
    
    switch (operation.type) {
      case 'WAKE_DREAM':
        await this.wakeDreamNetwork(operation);
        break;
      case 'LINK_NODES':
        await this.linkDreamNodes(operation);
        break;
      case 'BUILD_CORE':
        await this.buildDreamCore(operation);
        break;
      case 'MONETIZE_YIELD':
        await this.optimizeYields(operation);
        break;
    }
  }

  private async wakeDreamNetwork(operation: SwarmOperation): Promise<void> {
    console.log('🌟 WAKE: Activating dormant dreams...');
    
    // Identify low-score dreams that need awakening
    const dreams = await storage.getDreams();
    const dormantDreams = dreams.filter(d => d.score < 30);
    
    for (const dream of dormantDreams.slice(0, 3)) {
      // Boost dream score through swarm energy
      const scoreBoost = Math.floor(Math.random() * 20) + 10;
      dream.score += scoreBoost;
      dream.swarmBoosted = true;
      dream.swarmBoostTime = Date.now();
      
      console.log(`⚡ LUCID-01 boosted dream ${dream.id}: +${scoreBoost} points`);
    }
  }

  private async linkDreamNodes(operation: SwarmOperation): Promise<void> {
    console.log('🔗 CONNECT: Establishing dream network links...');
    
    const dreams = await storage.getDreams();
    const highScoreDreams = dreams.filter(d => d.score > 70);
    
    // Create cross-links between high-scoring dreams
    highScoreDreams.forEach((dream, index) => {
      if (!dream.linkedDreams) dream.linkedDreams = [];
      
      const linkTarget = highScoreDreams[(index + 1) % highScoreDreams.length];
      if (linkTarget && !dream.linkedDreams.includes(linkTarget.id)) {
        dream.linkedDreams.push(linkTarget.id);
        dream.networkStrength = (dream.networkStrength || 0) + 1;
      }
    });
    
    console.log(`🕸️ CANVAS-02 linked ${highScoreDreams.length} dream nodes`);
  }

  private async buildDreamCore(operation: SwarmOperation): Promise<void> {
    console.log('🔨 BUILD: Strengthening dream cores...');
    
    const dreams = await storage.getDreams();
    const evolvableDreams = dreams.filter(d => d.score >= 85 && !d.evolved);
    
    for (const dream of evolvableDreams.slice(0, 2)) {
      // Auto-evolve eligible dreams
      dream.evolved = true;
      dream.evolutionPath = ['Visionary', 'Protean', 'Oracle'][Math.floor(Math.random() * 3)];
      dream.specialAbility = this.generateSpecialAbility(dream.evolutionPath);
      dream.originalScore = dream.score;
      dream.score = Math.floor(dream.score * 1.2);
      
      console.log(`🧬 ROOT-03 evolved dream ${dream.id} → ${dream.evolutionPath}`);
    }
  }

  private async optimizeYields(operation: SwarmOperation): Promise<void> {
    console.log('💰 MONETIZE: Optimizing yield generation...');
    
    if (!operation.walletAddress) return;
    
    const yieldData = await storage.getHarvestYield(operation.walletAddress);
    
    // Apply swarm yield multipliers
    yieldData.forEach(dream => {
      if (dream.swarmBoosted) {
        dream.yieldRate *= 1.5; // Swarm boost multiplier
        dream.swarmOptimized = true;
      }
    });
    
    console.log(`📈 ECHO-04 optimized yields for ${yieldData.length} dreams`);
  }

  private generateSpecialAbility(evolutionPath: string): string {
    const abilities: Record<string, string> = {
      'Visionary': 'Enhanced Creative Synthesis - generates 2x innovation tokens',
      'Protean': 'Adaptive Learning Matrix - auto-adjusts to network changes', 
      'Oracle': 'Predictive Dream Mapping - forecasts network evolution patterns'
    };
    return abilities[evolutionPath] || 'Enhanced Dream Resonance';
  }

  getSwarmStatus(): any {
    return {
      bots: Array.from(this.bots.values()),
      activeOperations: Array.from(this.operations.values()).filter(op => op.status === 'EXECUTING'),
      completedOperations: Array.from(this.operations.values()).filter(op => op.status === 'COMPLETE'),
      networkHealth: this.calculateNetworkHealth()
    };
  }

  private calculateNetworkHealth(): number {
    const activeBots = Array.from(this.bots.values()).filter(bot => bot.status === 'ACTIVE').length;
    const totalBots = this.bots.size;
    return Math.floor((activeBots / totalBots) * 100);
  }
}

export const swarmCoordinator = new SwarmCoordinator();