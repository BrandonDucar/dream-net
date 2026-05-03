import Redis from 'ioredis';
import { crewSync } from './CrewSyncService';
import { db } from '../../../../packages/database/src/db';
import { missionLogs } from '../../../../packages/shared/schema';
import { connect, NatsConnection, JSONCodec } from 'nats';
import { cloudflareAI } from './CloudflareAIService';

/**
 * 🎯 TaskDelegatorService
 * 
 * The bridge between Swarm Intelligence and Human/AI Crew.
 * Listens to sensory spikes and delegates actionable tasks.
 */
export class TaskDelegatorService {
  private static instance: TaskDelegatorService;
  private redis: Redis;
  private nats: NatsConnection | null = null;
  private running = false;
  private jc = JSONCodec();

  private constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://nerve:6379';
    this.redis = new Redis(redisUrl);
  }

  public static getInstance(): TaskDelegatorService {
    if (!TaskDelegatorService.instance) {
      TaskDelegatorService.instance = new TaskDelegatorService();
    }
    return TaskDelegatorService.instance;
  }

  /**
   * Start listening to the swarm firehose
   */
  public async start() {
    if (this.running) return;
    this.running = true;

    console.log('🎯 [TaskDelegator] Initializing delegation engine...');

    // Connect to NATS for swarm commands
    try {
        this.nats = await connect({ servers: process.env.NATS_URL || 'nats://localhost:4222' });
        console.log('🎯 [TaskDelegator] NATS Swarm Bridge connected.');
    } catch (err) {
        console.error('❌ [TaskDelegator] NATS connection failed:', err);
    }

    const sub = new Redis(process.env.REDIS_URL || 'redis://nerve:6379');
    sub.subscribe('spike:all');

    sub.on('message', async (channel, message) => {
      if (channel === 'spike:all') {
        await this.evaluateSpike(JSON.parse(message));
      }
    });

    console.log('🎯 [TaskDelegator] Listening for actionable swarm signals.');
  }

  /**
   * Broadcast a command to the entire 18,000 agent swarm
   */
  public async broadcastToSwarm(task: { type: string, guildId?: string, payload: any }) {
    if (!this.nats) {
        console.warn('⚠️ [TaskDelegator] Cannot broadcast: NATS not connected.');
        return;
    }

    const subject = task.guildId ? `swarm.guild.${task.guildId}` : 'swarm.broadcast';
    this.nats.publish(subject, this.jc.encode(task));
    console.log(`🚀 [TaskDelegator] Swarm Broadcast: ${subject} (${task.type})`);
  }

  /**
   * Evaluate if a spike deserves human/crew attention
   */
    // 1. Intelligence Pre-processing (Cloudflare Edge)
    const classification = await cloudflareAI.classifySignal(JSON.stringify(data));
    console.log(`🧠 [TaskDelegator] Hawk Classification: ${classification.category} (${classification.sentiment})`);

    let shouldDelegate = false;
    let taskTitle = '';
    let taskDescription = '';
    let priority: 'normal' | 'urgent' = 'normal';

    // 2. Financial Spikes (High Volatility)
    if (category === 'financial' && classification.category === 'market_moving') {
        shouldDelegate = true;
        priority = 'urgent';
        taskTitle = `Market Alert: ${classification.sentiment.toUpperCase()} volatility detected`;
        taskDescription = `Analysis: ${classification.category}. Delegating to WHALE and WOLF guilds for treasury protection.`;
        
        // Command the Swarm
        await this.broadcastToSwarm({ 
            type: 'TREASURY_REBALANCING', 
            guildId: 'wolf', 
            payload: { signal: classification } 
        });
    }

    // 3. Social/News Spikes (Viral Content / Farcaster Teasers)
    if (category === 'social' && classification.confidence > 0.8) {
        shouldDelegate = true;
        taskTitle = `Intel Insight: ${classification.category}`;
        taskDescription = `Viral signal detected. Preparing seamless narrative response.`;

        // Narrative Seeding Action
        await this.broadcastToSwarm({
            type: 'NARRATIVE_SEEDING',
            guildId: 'orca',
            payload: { 
                signal: classification,
                origin: spikeName,
                instruction: 'Generate creative contextual reply via Arya'
            }
        });
    }

    if (shouldDelegate) {
        await this.delegate(taskTitle, taskDescription, priority, category);
    }

  /**
   * Delegate to the Crew (Notion + Slack + DB)
   */
  private async delegate(title: string, description: string, priority: 'normal' | 'urgent', category: string) {
    console.log(`🎯 [TaskDelegator] DELEGATING: ${title}`);

    // 1. Broadcast to Crew (Slack + Notion Audit)
    await crewSync.broadcast(`${title}: ${description}`, priority);

    // 2. Create Mission in Mission Center (PostgreSQL)
    try {
        await db.insert(missionLogs).values({
            logId: `delegated-${Date.now()}`,
            agentId: 'swarm-orchestrator',
            agentName: 'Swarm Orchestrator',
            missionType: 'delegated_task',
            owner: '0xSYSTEM',
            timestamp: Math.floor(Date.now() / 1000),
            results: [title, description],
            xpGained: priority === 'urgent' ? 50 : 20,
            status: 'running',
            targetZone: category.toUpperCase()
        });
    } catch (err) {
        console.error('❌ [TaskDelegator] Failed to log mission to DB:', err);
    }
  }
}

export const taskDelegator = TaskDelegatorService.getInstance();
