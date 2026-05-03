// packages/agent-gateway/src/index.ts
// Agent Gateway: Bridge between real-world APIs and DreamNet agent swarm
// Handles: webhooks, API calls, LLM integration, event streaming

import express, { Request, Response } from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import crypto from 'crypto';
import fetch from 'node-fetch';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT'] }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3205;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'dreamnet-webhook-secret';
const CONTROL_CORE_URL = process.env.CONTROL_CORE_URL || 'http://control-core:3000';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://ollama:11434';
const NANOCLAW_URL = process.env.NANOCLAW_URL || 'http://nanoclaw:18790';

// ─────────────────────────────────────────────────────────────────────────────
// 1. WEBHOOK INGESTION (Real-world events → agents)
// ─────────────────────────────────────────────────────────────────────────────

app.post('/webhooks/:eventType', async (req: Request, res: Response) => {
  try {
    const { eventType } = req.params;
    const { data, source } = req.body;

    // Verify webhook signature (if provided)
    const signature = req.headers['x-webhook-signature'] as string;
    if (signature) {
      const hash = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(JSON.stringify(req.body))
        .digest('hex');
      
      if (hash !== signature) {
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    console.log(`📩 Webhook received: ${eventType} from ${source}`);

    // Emit to all connected agents via NATS
    const event = {
      type: 'external_event',
      eventType,
      source,
      data,
      timestamp: new Date().toISOString(),
      id: crypto.randomUUID()
    };

    // Notify agents via socket.io
    io.emit('external_event', event);

    // Store in Redis for agent pickup
    await fetch(`${CONTROL_CORE_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    }).catch(() => {});

    res.status(202).json({
      status: 'webhook_queued',
      eventId: event.id,
      timestamp: event.timestamp
    });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. AGENT DISPATCH API (Trigger agents to take real-world actions)
// ─────────────────────────────────────────────────────────────────────────────

interface AgentTask {
  action: string;
  target?: string;
  params?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

app.post('/api/dispatch', async (req: Request, res: Response) => {
  try {
    const task: AgentTask = req.body;

    if (!task.action) {
      return res.status(400).json({ error: 'action required' });
    }

    const taskId = crypto.randomUUID();

    console.log(`🚀 Agent task dispatched: ${task.action} (${taskId})`);

    // Route to appropriate agent or spawn new one
    const dispatchResult = await fetch(`${CONTROL_CORE_URL}/api/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId,
        task,
        source: 'agent-gateway',
        externalOrigin: req.ip
      })
    }).then(r => r.json() as Promise<any>).catch(err => ({
      error: err.message,
      fallback: true
    }));

    res.status(202).json({
      taskId,
      status: 'dispatched',
      ...dispatchResult
    });
  } catch (err) {
    console.error('Dispatch error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. AGENT SPAWNING API (Spawn agents on demand)
// ─────────────────────────────────────────────────────────────────────────────

app.post('/api/spawn/agents', async (req: Request, res: Response) => {
  try {
    const { count = 10, template = 'default', guildId, reason } = req.body;

    if (count > 1000) {
      return res.status(400).json({ error: 'Max 1000 agents per request' });
    }

    const spawnResult = await fetch(`${NANOCLAW_URL}/api/nano/spawn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        count,
        template,
        guildId: guildId || 'external-spawn',
        reason,
        source: req.ip
      })
    }).then(r => r.json() as Promise<any>).catch(err => ({
      error: err.message
    }));

    res.status(202).json({
      status: 'spawn_queued',
      ...spawnResult
    });
  } catch (err) {
    console.error('Spawn error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. OLLAMA INFERENCE PROXY (LLM reasoning for external callers)
// ─────────────────────────────────────────────────────────────────────────────

app.post('/api/llm/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, model = 'llama2', stream = false } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'prompt required' });
    }

    const ollamaResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream
      })
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama error: ${ollamaResponse.statusText}`);
    }

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      ollamaResponse.body?.pipe(res);
    } else {
      const data = await ollamaResponse.json() as any;
      res.json({
        model,
        response: data.response,
        totalDuration: data.total_duration,
        loadDuration: data.load_duration
      });
    }
  } catch (err) {
    console.error('LLM error:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. REALTIME AGENT TELEMETRY (WebSocket stream)
// ─────────────────────────────────────────────────────────────────────────────

io.on('connection', (socket) => {
  console.log(`📡 Client connected: ${socket.id}`);

  // Broadcast agent logs to connected clients
  socket.on('subscribe', (channel) => {
    socket.join(channel);
    socket.emit('subscribed', { channel, timestamp: new Date().toISOString() });
  });

  socket.on('disconnect', () => {
    console.log(`📡 Client disconnected: ${socket.id}`);
  });
});

// Forward swarm logs from control-core to WebSocket clients
function broadcastAgentLog(source: string, message: string) {
  io.emit('agent_log', {
    source,
    message,
    timestamp: new Date().toISOString()
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. HEALTH & STATUS ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

app.get('/health', async (req: Request, res: Response) => {
  try {
    // Check downstream services
    const coreHealth = await fetch(`${CONTROL_CORE_URL}/health`)
      .then(r => r.json() as Promise<any>)
      .catch(() => ({ status: 'unavailable' }));

    const ollamaHealth = await fetch(`${OLLAMA_URL}/api/tags`)
      .then(r => ({ status: 'healthy' }))
      .catch(() => ({ status: 'unavailable' }));

    const allHealthy = coreHealth.status === 'ALIVE' && ollamaHealth.status === 'healthy';

    res.status(allHealthy ? 200 : 503).json({
      status: allHealthy ? 'healthy' : 'degraded',
      service: 'agent-gateway',
      timestamp: new Date().toISOString(),
      dependencies: {
        controlCore: coreHealth.status || 'unknown',
        ollama: ollamaHealth.status || 'unknown'
      }
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.get('/api/status', async (req: Request, res: Response) => {
  res.json({
    service: 'agent-gateway',
    uptime: process.uptime(),
    mode: process.env.NODE_ENV || 'development',
    endpoints: {
      webhooks: '/webhooks/:eventType',
      dispatch: 'POST /api/dispatch',
      spawn: 'POST /api/spawn/agents',
      llm: 'POST /api/llm/generate',
      telemetry: 'WS /socket.io'
    },
    capabilities: {
      webhookIngestion: true,
      agentDispatching: true,
      agentSpawning: true,
      llmIntegration: true,
      realtimeTelemetry: true
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Start server
// ─────────────────────────────────────────────────────────────────────────────

httpServer.listen(PORT, () => {
  console.log(`\n🌐 Agent Gateway listening on port ${PORT}`);
  console.log(`   Webhooks: POST /webhooks/:eventType`);
  console.log(`   Dispatch: POST /api/dispatch`);
  console.log(`   Spawn: POST /api/spawn/agents`);
  console.log(`   LLM: POST /api/llm/generate`);
  console.log(`   Telemetry: ws://localhost:${PORT}/socket.io`);
  console.log(`   Status: GET /api/status\n`);
});

process.on('SIGTERM', () => {
  console.log('🛑 Agent Gateway shutting down...');
  httpServer.close(() => process.exit(0));
});
