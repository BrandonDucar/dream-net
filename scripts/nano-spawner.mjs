#!/usr/bin/env node
/**
 * DreamNet Nano Agent Spawner CLI
 * Pure Node.js (no TypeScript compilation needed)
 * Spawns agents into Redis + publishes to NATS
 */

import Redis from 'redis';
import { connect } from 'nats';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const NATS_URL = process.env.NATS_URL || 'nats://localhost:4222';
const SPAWN_COUNT = parseInt(process.env.SPAWN_COUNT || '100');

class NanoSpawner {
  constructor() {
    this.redis = null;
    this.nats = null;
    this.spawnedCount = 0;
    this.failedCount = 0;
  }

  async connect() {
    console.log('🔌 Connecting to Redis and NATS...');
    
    this.redis = Redis.createClient({ url: REDIS_URL });
    this.redis.on('error', (err) => console.error('Redis error:', err));
    await this.redis.connect();
    console.log('✅ Redis connected');

    this.nats = await connect({ servers: NATS_URL.split(',') });
    console.log('✅ NATS connected');
  }

  async spawn(count = SPAWN_COUNT) {
    console.log(`\n🌊 Spawning ${count} nano agents...`);
    console.time('spawn-batch');

    const templates = [
      { name: 'signal-scout', guild: 'Hawk', traits: { analytical: 0.9, vicious: 0.7 } },
      { name: 'executioner', guild: 'Arya', traits: { vicious: 0.95, witty: 0.88 } },
      { name: 'sentinel', guild: 'Governor', traits: { protective: 0.95, analytical: 0.95 } },
      { name: 'registry', guild: 'Genealogist', traits: { honorable: 0.99, analytical: 0.98 } },
      { name: 'broadcaster', guild: 'Loudspeakers', traits: { audacious: 0.85, witty: 0.95 } },
    ];

    const CHUNK_SIZE = 500;
    
    for (let i = 0; i < count; i += CHUNK_SIZE) {
      const currentChunkSize = Math.min(CHUNK_SIZE, count - i);
      const promises = [];

      for (let j = 0; j < currentChunkSize; j++) {
        const index = i + j;
        const template = templates[index % templates.length];
        const agentId = `nano-${template.guild.toLowerCase()}-${uuid().slice(0, 8)}`;

        const agent = {
          id: agentId,
          template: template.name,
          guild: template.guild,
          tier: 'nano',
          status: 'spawning',
          createdAt: Date.now(),
          lastHeartbeat: Date.now(),
          personality: this.generatePersonality(template.traits),
          metrics: {
            eventsProcessed: 0,
            successRate: 0,
          },
        };

        promises.push(this.spawnAgent(agent));
      }

      const results = await Promise.allSettled(promises);

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          this.spawnedCount++;
        } else {
          this.failedCount++;
          console.error('  ✗ Spawn failed:', result.reason?.message);
        }
      });

      console.log(`  ✓ ${this.spawnedCount}/${count} spawned`);
    }

    console.timeEnd('spawn-batch');
    console.log(
      `\n📊 Spawn Complete: ${this.spawnedCount} spawned, ${this.failedCount} failed`,
    );

    return { spawned: this.spawnedCount, failed: this.failedCount };
  }

  async spawnAgent(agent) {
    // Store in Redis
    const key = `nano:agents:${agent.id}`;
    const redisAgent = {
      ...agent,
      personality: JSON.stringify(agent.personality),
      metrics: JSON.stringify(agent.metrics)
    };
    await this.redis.hSet(key, redisAgent);
    await this.redis.expire(key, 86400); // 24h TTL

    // Add to guild set
    await this.redis.sAdd(`nano:guild:${agent.guild}`, agent.id);

    // Publish to NATS
    const event = {
      type: 'agent.spawned',
      agent,
      timestamp: Date.now(),
    };

    await this.nats.publish('agent.spawned', new TextEncoder().encode(JSON.stringify(event)));

    // Mark as active
    agent.status = 'active';
    await this.redis.hSet(key, 'status', 'active');
  }

  generatePersonality(baseTraits = {}) {
    return {
      vicious: baseTraits.vicious || Math.random(),
      witty: baseTraits.witty || Math.random(),
      protective: baseTraits.protective || Math.random(),
      playful: Math.random(),
      honorable: Math.random(),
      audacious: Math.random(),
      analytical: baseTraits.analytical || Math.random(),
      empathetic: Math.random(),
    };
  }

  async getStatus() {
    const agentKeys = await this.redis.keys('nano:agents:*');
    const guildKeys = await this.redis.keys('nano:guild:*');

    const guilds = {};
    for (const key of guildKeys) {
      const guildName = key.replace('nano:guild:', '');
      const count = await this.redis.sCard(key);
      guilds[guildName] = count;
    }

    return {
      totalAgents: agentKeys.length,
      guilds,
      timestamp: new Date().toISOString(),
    };
  }

  async close() {
    await this.redis.disconnect();
    await this.nats.close();
  }
}

// CLI
async function main() {
  const spawner = new NanoSpawner();

  try {
    await spawner.connect();

    // Parse CLI args
    const cmd = process.argv[2];
    const countArgIndex = process.argv.indexOf('--count');
    const cliCount = countArgIndex !== -1 ? parseInt(process.argv[countArgIndex + 1]) : null;
    const finalCount = cliCount || SPAWN_COUNT;

    if (cmd === 'spawn') {
      const result = await spawner.spawn(finalCount);
      console.log('\n✅ Spawn successful');
      process.exit(result.failed > 0 ? 1 : 0);
    } else if (cmd === 'status') {
      const status = await spawner.getStatus();
      console.log('\n📊 Swarm Status:');
      console.log(JSON.stringify(status, null, 2));
      process.exit(0);
    } else {
      console.log('Usage: node spawner.js [spawn|status]');
      console.log('Environment: SPAWN_COUNT, REDIS_URL, NATS_URL');
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await spawner.close();
  }
}

main();
