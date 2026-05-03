import { NERVE_BUS } from '@dreamnet/nerve';
import { natsService } from './NatsService.js';
import { guildSystem } from '../core/GuildSystem.js';
import { brainBridge } from './BrainBridge.js';
import { wolfPackFundingHunter } from '../agents/WolfPackFundingHunter.js';
import { tickerResearchSystem } from './TickerResearchSystem.js';
import { economicEngineCore } from './EconomicEngineCore.js';

/**
 * ⚡ SwarmDaemon
 * The background heartbeat of the DreamNet swarm.
 * Orchestrates periodic pulses, global state synchronization, and "guild quests".
 */
export class SwarmDaemon {
  private static instance: SwarmDaemon;
  private pulseCount = 0;
  private intervalId: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): SwarmDaemon {
    if (!SwarmDaemon.instance) {
      SwarmDaemon.instance = new SwarmDaemon();
    }
    return SwarmDaemon.instance;
  }

  public start() {
    if (this.intervalId) return;

    console.log("⚡ [SwarmDaemon] Initializing global pulse...");

    // Main heartbeat pulse (every 60 seconds)
    this.intervalId = setInterval(() => {
      this.pulse();
    }, 60000);

    // Initial pulse
    this.pulse();
  }

  private async pulse() {
    this.pulseCount++;
    const timestamp = Date.now();

    console.log(`⚡ [SwarmDaemon] Global Pulse ${this.pulseCount} - Synchronizing all sectors...`);

    // 1. Ticker Research Cycle (Real-time Alpha)
    if (this.pulseCount % 2 === 0) {
      await tickerResearchSystem.runCycle((event, data) => {
        natsService.publish(`dreamnet.alpha.${data.symbol}`, data);
      });
    }

    // 2. Economic Engine Cycle (Treasury Health)
    const economyStatus = await economicEngineCore.run();

    // 3. Health Heartbeat
    await natsService.publish('dreamnet.system.heartbeat', {
      pulse: this.pulseCount,
      timestamp,
      sectors: {
        reasoning: brainBridge.getStatus(),
        guilds: guildSystem.getStatus(),
        engines: {
          wolfPack: wolfPackFundingHunter.getStatus(),
          economy: economyStatus
        }
      }
    });

    // 4. Trigger "Guild Quests" (Autonomous tasks)
    if (this.pulseCount % 5 === 0) {
      this.triggerGuildQuest();
    }

    // 5. Update Nerve Bus status
    NERVE_BUS.publish({
      id: `heartbeat-${Date.now()}`,
      channelId: 'SYSTEM_METRIC',
      kind: 'METRIC_SNAPSHOT',
      priority: 2,
      context: { timestamp: new Date().toISOString() },
      payload: { 
        metricName: 'pulse', 
        value: this.pulseCount,
        economyHealth: economyStatus.health
      }
    });
  }

  private triggerGuildQuest() {
    const guilds: string[] = [
      'piclaw', 'pyclaw', 'axo', 'edge', 'ghost', 'flash', 
      'quantum', 'aegis', 'archimedes', 'wolf', 'whale', 'orca', 'spider', 'fly'
    ];
    const selectedGuild = guilds[Math.floor(Math.random() * guilds.length)];

    console.log(`⚡ [SwarmDaemon] Dispatching Quest to ${selectedGuild.toUpperCase()} Guild...`);

    natsService.publish('dreamnet.guilds.task', {
      id: `quest-${Date.now()}`,
      guildId: selectedGuild,
      type: 'AUTONOMOUS_EXPLORATION',
      payload: { goal: 'Optimization' },
      priority: 'low'
    });
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public getStatus() {
    return {
      pulses: this.pulseCount,
      status: this.intervalId ? 'running' : 'stopped',
      lastPulse: new Date().toISOString()
    };
  }
}

export const swarmDaemon = SwarmDaemon.getInstance();
