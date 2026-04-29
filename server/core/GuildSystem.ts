import { NERVE_BUS } from '@dreamnet/nerve';
import { natsService } from '../services/NatsService.js';

export type GuildId = 'piclaw' | 'pyclaw' | 'axo' | 'edge' | 'ghost' | 'flash';

export interface GuildTask {
  id: string;
  guildId: GuildId;
  type: string;
  payload: any;
  priority: 'low' | 'medium' | 'high';
}

/**
 * 🏰 GuildSystem
 * Manages the "families" of specialized agents.
 * Provides a standardized interface for cross-guild coordination.
 */
export class GuildSystem {
  private static instance: GuildSystem;
  private activeGuilds: Set<GuildId> = new Set();
  private taskLedger: Map<string, GuildTask> = new Map();

  private constructor() {
    this.setupBusListeners();
  }

  public static getInstance(): GuildSystem {
    if (!GuildSystem.instance) {
      GuildSystem.instance = new GuildSystem();
    }
    return GuildSystem.instance;
  }

  private setupBusListeners() {
    console.log("🏰 [GuildSystem] Initializing guild network...");

    // Listen for guild-specific tasks on NATS
    natsService.subscribe('dreamnet.guilds.task', async (task: GuildTask) => {
      await this.routeToGuild(task);
    });
  }

  public activateGuild(id: GuildId) {
    this.activeGuilds.add(id);
    console.log(`🏰 [GuildSystem] Guild ${id.toUpperCase()} activated and ready for duty.`);
    
    // Broadcast guild activation
    natsService.publish('dreamnet.guilds.heartbeat', {
      guildId: id,
      status: 'active',
      timestamp: Date.now()
    });
  }

  private async routeToGuild(task: GuildTask) {
    console.log(`🏰 [GuildSystem] Routing task ${task.id} to guild ${task.guildId}...`);
    this.taskLedger.set(task.id, task);

    // In a full implementation, this would dispatch to specialized workers.
    // For now, we simulate the processing via the Nerve Bus.
    NERVE_BUS.publish({
      id: `guild-${Date.now()}`,
      channelId: 'GENERIC',
      kind: 'DEBUG',
      priority: 1,
      context: { timestamp: new Date().toISOString() },
      payload: {
        taskId: task.id,
        type: task.type,
        guildId: task.guildId
      }
    });

    // Simulate completion
    setTimeout(() => {
      this.completeTask(task.id, { success: true, result: `Processed by ${task.guildId}` });
    }, 2000);
  }

  public completeTask(taskId: string, result: any) {
    const task = this.taskLedger.get(taskId);
    if (task) {
      console.log(`✅ [GuildSystem] Task ${taskId} completed by ${task.guildId}.`);
      natsService.publish(`dreamnet.guilds.task_result.${taskId}`, {
        taskId,
        guildId: task.guildId,
        result,
        timestamp: Date.now()
      });
    }
  }

  public getStatus() {
    return {
      activeGuilds: Array.from(this.activeGuilds),
      pendingTasks: this.taskLedger.size,
      health: 'optimal'
    };
  }
}

export const guildSystem = GuildSystem.getInstance();
