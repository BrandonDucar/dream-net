// packages/mcp/zeroclaw/src/index.ts
/**
 * ZeroClaw: Zero-Touch Infrastructure Healer
 * Automatically detects dead agents, respawns them, manages swarm health
 */
import { Redis } from 'redis';
import { connect } from 'nats';

class ZeroClaw {
  private redis: Redis;
  private nats: any;
  private healThresholdMs: number;
  private maxRespawns: number;
  private backoffMultiplier: number;
  
  constructor() {
    this.healThresholdMs = parseInt(process.env.HEAL_THRESHOLD_MS || '300000'); // 5 min
    this.maxRespawns = parseInt(process.env.MAX_RESPAWNS || '10');
    this.backoffMultiplier = parseFloat(process.env.BACKOFF_MULTIPLIER || '2');
  }
  
  async initialize() {
    this.redis = Redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    await this.redis.connect();
    
    this.nats = await connect({ servers: (process.env.NATS_URL || 'nats://localhost:4222').split(',') });
    
    console.log('🔧 ZeroClaw initialized');
    console.log(`   Heal Threshold: ${this.healThresholdMs}ms`);
    console.log(`   Max Respawns: ${this.maxRespawns}`);
    console.log(`   Backoff Multiplier: ${this.backoffMultiplier}x`);
    
    this.startHealingCycle();
    this.startMetricsReporter();
    this.listenForHeartbeats();
  }
  
  private async startHealingCycle() {
    setInterval(async () => {
      try {
        await this.scanAndHeal();
      } catch (err) {
        console.error('Healing cycle error:', err);
      }
    }, 10000); // Every 10 seconds
  }
  
  private async scanAndHeal() {
    const pattern = 'nano:agents:*';
    const now = Date.now();
    const deadAgents: string[] = [];
    const respawnCandidates: string[] = [];
    
    for await (const key of this.redis.scanIterator({ MATCH: pattern, COUNT: 100 })) {
      const agent = await this.redis.hGetAll(key);
      const agentId = agent.id;
      
      // Check if agent is dead (no heartbeat)
      const lastHeartbeat = Number(agent.lastHeartbeat);
      const timeSinceBeat = now - lastHeartbeat;
      
      if (timeSinceBeat > this.healThresholdMs) {
        deadAgents.push(agentId);
        
        // Check respawn count
        const respawnCount = parseInt(agent.respawnCount || '0');
        
        if (respawnCount < this.maxRespawns) {
          respawnCandidates.push(agentId);
          
          // Calculate backoff
          const backoffMs = 5000 * Math.pow(this.backoffMultiplier, respawnCount);
          
          // Schedule respawn
          await this.scheduleRespawn(agentId, agent.template, agent.guildId, respawnCount, backoffMs);
        } else {
          // Mark as permanently dead
          await this.redis.hSet(key, 'status', 'dead-permanent');
          
          this.nats.publish('system.agent-dead-permanent', 
            new TextEncoder().encode(JSON.stringify({ agentId, respawns: respawnCount }))
          );
          
          console.log(`💀 Agent ${agentId} exceeded max respawns (${respawnCount}/${this.maxRespawns})`);
        }
      }
    }
    
    if (deadAgents.length > 0) {
      console.log(`🔴 Found ${deadAgents.length} dead agents, respawning ${respawnCandidates.length}`);
    }
  }
  
  private async scheduleRespawn(agentId: string, template: string, guildId: string, respawnCount: number, delayMs: number) {
    const respawnId = `respawn-${agentId}-${Date.now()}`;
    
    const task = {
      respawnId,
      agentId,
      template,
      guildId,
      respawnCount: respawnCount + 1,
      scheduledFor: Date.now() + delayMs
    };
    
    await this.redis.lPush('zeroclaw:respawn:queue', JSON.stringify(task));
    
    console.log(`⏱️ Scheduled respawn for ${agentId} in ${delayMs}ms (attempt ${respawnCount + 1})`);
  }
  
  private async listenForHeartbeats() {
    const sub = await this.nats.subscribe('agent.heartbeat');
    
    (async () => {
      for await (const msg of sub) {
        const beat = JSON.parse(new TextDecoder().decode(msg.data));
        
        // Update agent heartbeat in Redis
        const key = `nano:agents:${beat.agentId}`;
        await this.redis.hSet(key, 'lastHeartbeat', beat.timestamp);
        
        // If this was a respawned agent, clear respawn counter on success
        if (beat.isRespawned) {
          await this.redis.hSet(key, 'respawnCount', '0');
          await this.redis.hSet(key, 'status', 'active');
        }
      }
    })();
  }
  
  private async startMetricsReporter() {
    setInterval(async () => {
      const stats = {
        timestamp: Date.now(),
        totalAgents: 0,
        activeAgents: 0,
        deadAgents: 0,
        respawningAgents: 0,
        guilds: 0
      };
      
      // Count agents
      const pattern = 'nano:agents:*';
      for await (const key of this.redis.scanIterator({ MATCH: pattern })) {
        const agent = await this.redis.hGetAll(key);
        stats.totalAgents++;
        
        switch (agent.status) {
          case 'active': stats.activeAgents++; break;
          case 'dead':
          case 'dead-permanent': stats.deadAgents++; break;
          case 'respawning': stats.respawningAgents++; break;
        }
      }
      
      // Count guilds
      const guildKeys = await this.redis.keys('nano:guild:*');
      stats.guilds = guildKeys.length;
      
      // Publish metrics
      await this.nats.publish('system.zeroclaw-metrics', 
        new TextEncoder().encode(JSON.stringify(stats))
      );
      
      console.log(`📊 ZeroClaw Status: ${stats.activeAgents}/${stats.totalAgents} active, ${stats.deadAgents} dead, ${stats.guilds} guilds`);
    }, 30000); // Every 30 seconds
  }
}

// Start ZeroClaw
const zeroclaw = new ZeroClaw();
await zeroclaw.initialize();

console.log('🧠 ZeroClaw running - healing infrastructure autonomously');

process.on('SIGTERM', () => {
  console.log('Shutting down ZeroClaw...');
  process.exit(0);
});
