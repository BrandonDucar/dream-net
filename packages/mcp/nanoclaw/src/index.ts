// packages/mcp/nanoclaw/src/index.ts
import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import { NanoAgentSpawner } from './spawner.js';
import { Redis } from 'redis';
import { connect } from 'nats';

const app = Fastify({ logger: true });
await app.register(fastifyWebsocket);

const redisClient = Redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
await redisClient.connect();

const nc = await connect({ servers: (process.env.NATS_URL || 'nats://localhost:4222').split(',') });

const spawner = new NanoAgentSpawner({
  redis: redisClient,
  nats: nc,
  maxConcurrent: parseInt(process.env.MAX_CONCURRENT || '1000'),
});

// REST API for rapid nano-agent deployment
app.post('/api/nano/spawn', async (request, reply) => {
  try {
    const { count = 100, template = 'default', guildId = 'swarm' } = request.body as any;
    
    if (count > 10000) {
      return reply.code(400).send({ error: 'Max 10,000 agents per request' });
    }
    
    const batchId = `nano-batch-${Date.now()}`;
    const result = await spawner.spawnBatch(count, template, guildId, batchId);
    
    return reply.code(202).send({
      batchId,
      status: 'spawning',
      requested: count,
      queued: result.queued,
      estimatedTime: `${result.queued / 500}s` // ~500 agents/sec
    });
  } catch (err) {
    return reply.code(500).send({ error: (err as Error).message });
  }
});

// Check spawn status
app.get('/api/nano/batch/:batchId', async (request, reply) => {
  const { batchId } = request.params as any;
  const status = await spawner.getBatchStatus(batchId);
  return reply.send(status || { error: 'Batch not found' });
});

// WebSocket for real-time spawn events
app.get('/ws/nano/events', { websocket: true }, (socket) => {
  socket.send(JSON.stringify({ type: 'connected', message: 'Listening to nano spawn events' }));
  
  const unsub = spawner.onSpawnEvent((event) => {
    socket.send(JSON.stringify(event));
  });
  
  socket.on('close', () => unsub());
});

// Status endpoint
app.get('/api/nano/status', async (request, reply) => {
  const status = await spawner.getStatus();
  return reply.send(status);
});

// Health check
app.get('/health', async (request, reply) => {
  return reply.send({ 
    status: 'healthy',
    service: 'nanoclaw',
    timestamp: new Date().toISOString(),
    activeSpawns: spawner.activeSpawns,
    totalSpawned: spawner.totalSpawned
  });
});

const PORT = process.env.PORT || 18790;
await app.listen({ port: Number(PORT), host: '0.0.0.0' });

console.log(`🌊 NanoClaw MCP Server listening on port ${PORT}`);
console.log(`   API: http://localhost:${PORT}/api/nano`);
console.log(`   WebSocket: ws://localhost:${PORT}/ws/nano/events`);
console.log(`   Health: http://localhost:${PORT}/health`);
