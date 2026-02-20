import express, { Request, Response } from 'express';
import Redis from 'ioredis';
import Docker from 'dockerode';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://nerve:6379');
const docker = new Docker();
const PORT = process.env.PORT || 7010;

interface AgentSpawnRequest {
  agentId: string;
  agentName: string;
  agentType: 'governor' | 'executor' | 'designer' | 'generic';
  capabilities: string[];
  telegramToken?: string;
  bridgeUrl: string;
  environment?: Record<string, string>;
}

interface SpawnResult {
  success: boolean;
  agentId: string;
  containerId?: string;
  message: string;
}

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'agent-spawn-service',
    uptime: process.uptime(),
    agentsSpawned: global.agentsSpawned || 0
  });
});

// Spawn new agent
app.post('/spawn', async (req: Request, res: Response) => {
  try {
    const spawnReq: AgentSpawnRequest = req.body;
    console.log(`🚀 [Spawn] Spawning agent: ${spawnReq.agentName} (${spawnReq.agentId})`);

    // Generate spawn config
    const spawnConfig = generateSpawnConfig(spawnReq);
    
    // Create container
    const container = await docker.createContainer(spawnConfig);
    console.log(`🚀 [Spawn] Container created: ${container.id.substring(0, 12)}`);

    // Start container
    await container.start();
    console.log(`🚀 [Spawn] Container started: ${container.id.substring(0, 12)}`);

    // Register agent in Redis
    await redis.hset(
      `agent:${spawnReq.agentId}`,
      'containerId', container.id,
      'status', 'spawned',
      'createdAt', new Date().toISOString(),
      'type', spawnReq.agentType
    );

    // Register in Antigravity
    await registerWithAntigravity(spawnReq);

    global.agentsSpawned = (global.agentsSpawned || 0) + 1;

    const result: SpawnResult = {
      success: true,
      agentId: spawnReq.agentId,
      containerId: container.id,
      message: `Agent ${spawnReq.agentName} spawned successfully`
    };

    console.log(`✅ [Spawn] ${result.message}`);
    res.json(result);
  } catch (error: any) {
    console.error(`❌ [Spawn] Error:`, error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// List all spawned agents
app.get('/agents', async (req: Request, res: Response) => {
  try {
    const keys = await redis.keys('agent:*');
    const agents = [];

    for (const key of keys) {
      const agent = await redis.hgetall(key);
      agents.push({
        id: key.replace('agent:', ''),
        ...agent
      });
    }

    res.json({
      count: agents.length,
      agents
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Stop agent
app.post('/agents/:agentId/stop', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const agentData = await redis.hgetall(`agent:${agentId}`);

    if (!agentData.containerId) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const container = docker.getContainer(agentData.containerId);
    await container.stop();
    await redis.hset(`agent:${agentId}`, 'status', 'stopped');

    res.json({ success: true, message: `Agent ${agentId} stopped` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

function generateSpawnConfig(req: AgentSpawnRequest): Docker.ContainerCreateOptions {
  const containerName = `agent-${req.agentId}`;
  
  const env = [
    `AGENT_ID=${req.agentId}`,
    `AGENT_NAME=${req.agentName}`,
    `AGENT_TYPE=${req.agentType}`,
    `BRIDGE_URL=${req.bridgeUrl}`,
    `REDIS_URL=${process.env.REDIS_URL || 'redis://nerve:6379'}`,
    ...Object.entries(req.environment || {}).map(([k, v]) => `${k}=${v}`)
  ];

  return {
    Image: `agent-${req.agentType}:latest`,
    name: containerName,
    Env: env,
    HostConfig: {
      Memory: 512 * 1024 * 1024, // 512 MB
      CpuShares: 1024,
      RestartPolicy: {
        Name: 'unless-stopped',
        MaximumRetryCount: 5
      }
    },
    NetworkMode: 'dream_network',
    Labels: {
      'dreamnet.role': 'agent',
      'dreamnet.agentId': req.agentId,
      'dreamnet.type': req.agentType
    }
  };
}

async function registerWithAntigravity(req: AgentSpawnRequest) {
  try {
    await axios.post(`${req.bridgeUrl}/bridge/register`, {
      agentId: req.agentId,
      name: req.agentName,
      type: req.agentType,
      version: '1.0.0',
      capabilities: req.capabilities,
      endpoint: `http://agent-${req.agentId}:3100`
    });
    console.log(`✅ [Spawn] Agent registered with Antigravity`);
  } catch (error: any) {
    console.warn(`⚠️ [Spawn] Antigravity registration failed:`, error.message);
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 [Agent Spawn Service] Online on port ${PORT}`);
  console.log(`🚀 POST /spawn - Spawn a new agent`);
  console.log(`🚀 GET /agents - List all agents`);
  console.log(`🚀 POST /agents/:agentId/stop - Stop an agent`);
});

export default app;
