// packages/mcp/nanoclaw/src/spawner.ts
import { Redis } from 'redis';
import { NatsConnection } from 'nats';
import { v4 as uuidv4 } from 'uuid';

export interface NanoAgent {
  id: string;
  template: string;
  guildId: string;
  status: 'spawning' | 'active' | 'idle' | 'dead';
  createdAt: number;
  lastHeartbeat: number;
  metadata: Record<string, any>;
}

export class NanoAgentSpawner {
  private redis: Redis;
  private nats: NatsConnection;
  private maxConcurrent: number;
  public activeSpawns: number = 0;
  public totalSpawned: number = 0;
  private eventListeners: ((event: any) => void)[] = [];
  
  constructor(config: { redis: Redis; nats: NatsConnection; maxConcurrent: number }) {
    this.redis = config.redis;
    this.nats = config.nats;
    this.maxConcurrent = config.maxConcurrent;
    this.startHealthChecker();
  }
  
  async spawnBatch(count: number, template: string, guildId: string, batchId: string) {
    const queued: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const agentId = `nano-${guildId}-${uuidv4().slice(0, 8)}`;
      
      // Queue the spawn
      await this.redis.lPush(`nano:spawn:queue`, JSON.stringify({
        agentId,
        template,
        guildId,
        batchId,
        queuedAt: Date.now()
      }));
      
      queued.push(agentId);
      
      // Emit event
      this.broadcastEvent({
        type: 'spawn-queued',
        agentId,
        batchId,
        totalQueued: queued.length
      });
    }
    
    // Process queue in parallel (up to maxConcurrent)
    this.processSpawnQueue();
    
    return { queued: queued.length };
  }
  
  private async processSpawnQueue() {
    while (this.activeSpawns < this.maxConcurrent) {
      const item = await this.redis.rPop('nano:spawn:queue');
      if (!item) break;
      
      this.activeSpawns++;
      const spawn = JSON.parse(item);
      
      this.spawnAgentAsync(spawn)
        .then(() => {
          this.activeSpawns--;
          this.totalSpawned++;
          this.processSpawnQueue(); // Process next
        })
        .catch((err) => {
          this.activeSpawns--;
          console.error(`Spawn failed for ${spawn.agentId}:`, err);
          this.broadcastEvent({
            type: 'spawn-failed',
            agentId: spawn.agentId,
            error: err.message
          });
        });
    }
  }
  
  private async spawnAgentAsync(spawn: any) {
    const { agentId, template, guildId, batchId } = spawn;
    
    try {
      // Store agent metadata
      const agent: NanoAgent = {
        id: agentId,
        template,
        guildId,
        status: 'spawning',
        createdAt: Date.now(),
        lastHeartbeat: Date.now(),
        metadata: {
          batchId,
          tier: 'nano',
          personality: this.generatePersonality()
        }
      };
      
      // Store in Redis
      await this.redis.hSet(`nano:agents:${agentId}`, agent as any);
      await this.redis.sAdd(`nano:guild:${guildId}`, agentId);
      
      // Publish spawn event to NATS
      await this.nats.publish('agent.spawned', new TextEncoder().encode(JSON.stringify(agent)));
      
      // Mark as active
      agent.status = 'active';
      await this.redis.hSet(`nano:agents:${agentId}`, agent as any);
      
      this.broadcastEvent({
        type: 'spawn-success',
        agentId,
        batchId,
        guild: guildId,
        timestamp: Date.now()
      });
    } catch (err) {
      throw new Error(`Failed to spawn ${agentId}: ${(err as Error).message}`);
    }
  }
  
  async getBatchStatus(batchId: string) {
    // Count agents spawned in this batch
    const pattern = `nano:agents:*`;
    const agents: any[] = [];
    
    for await (const key of this.redis.scanIterator({ MATCH: pattern })) {
      const agent = await this.redis.hGetAll(key);
      if (agent.metadata && JSON.parse(agent.metadata as string).batchId === batchId) {
        agents.push(agent);
      }
    }
    
    const statusCounts = { spawning: 0, active: 0, idle: 0, dead: 0 };
    agents.forEach((a) => {
      statusCounts[(a.status as keyof typeof statusCounts)]++;
    });
    
    return {
      batchId,
      total: agents.length,
      statusCounts,
      timestamp: Date.now()
    };
  }
  
  async getStatus() {
    const totalAgents = await this.redis.dbSize();
    const guildCount = await this.redis.keys('nano:guild:*');
    
    return {
      activeSpawns: this.activeSpawns,
      totalSpawned: this.totalSpawned,
      totalAgentsInRedis: totalAgents,
      guilds: guildCount.length,
      maxConcurrent: this.maxConcurrent,
      timestamp: Date.now()
    };
  }
  
  private startHealthChecker() {
    setInterval(async () => {
      // Check for dead agents (no heartbeat for 30s)
      const pattern = `nano:agents:*`;
      const now = Date.now();
      
      for await (const key of this.redis.scanIterator({ MATCH: pattern, COUNT: 100 })) {
        const agent = await this.redis.hGetAll(key);
        if (now - Number(agent.lastHeartbeat) > 30000) {
          // Mark as dead
          await this.redis.hSet(key, 'status', 'dead');
          this.broadcastEvent({
            type: 'agent-dead',
            agentId: agent.id,
            lastHeartbeat: agent.lastHeartbeat
          });
        }
      }
    }, 10000); // Check every 10 seconds
  }
  
  private generatePersonality() {
    return {
      vicious: Math.random(),
      witty: Math.random(),
      protective: Math.random(),
      playful: Math.random(),
      honorable: Math.random(),
      audacious: Math.random(),
      analytical: Math.random(),
      empathetic: Math.random()
    };
  }
  
  private broadcastEvent(event: any) {
    this.eventListeners.forEach((listener) => listener(event));
  }
  
  onSpawnEvent(callback: (event: any) => void) {
    this.eventListeners.push(callback);
    return () => {
      const idx = this.eventListeners.indexOf(callback);
      if (idx > -1) this.eventListeners.splice(idx, 1);
    };
  }
}
