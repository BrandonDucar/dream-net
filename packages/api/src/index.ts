import express from 'express';
import { ClawedetteService } from './services/ClawedetteService';
import { walletService } from './services/WalletService';
import { actualizationService } from './services/ActualizationService';
import { gymStaffService } from './services/GymStaffService';
import { spikeRunner } from './services/SpikeRunnerService';
import { sovereignOverride } from './services/SovereignOverride';
import { rovingAgent } from './services/RovingAgentService';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3100;

app.use(express.json());

// ⚡ Laser Router — fast, clean pipe for all agents
app.use((req, res, next) => {
  // CORS — wide open for LMC dashboard and any agent
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Sovereign-Token, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  // Response time tracking — set header before send, not after
  const start = Date.now();
  const origEnd = res.end.bind(res);
  res.end = function (...args: any[]) {
    if (!res.headersSent) {
      res.setHeader('X-Response-Time', `${Date.now() - start}ms`);
    }
    return origEnd(...args);
  };

  // Cache headers for GET endpoints (spike/roving data)
  if (req.method === 'GET' && req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'public, max-age=5, stale-while-revalidate=30');
  }

  next();
});

// 🛡️ Sovereign Override — MUST be first real middleware. Cannot be bypassed.
app.use(sovereignOverride.middleware());

const clawedette = new ClawedetteService();

// 🛡️ External agent heartbeat — Sable and LMC phone home here
app.post('/sovereign/heartbeat', async (req, res) => {
  const { agentId, metadata } = req.body;
  if (!agentId) return res.status(400).json({ error: 'agentId required' });
  try {
    await sovereignOverride.registerExternalHeartbeat(agentId, metadata);
    res.json({ status: 'ok', agentId, timestamp: Date.now() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 🛡️ Fleet status — see all agents' heartbeat status
app.get('/sovereign/fleet', async (req, res) => {
  const token = req.headers['x-sovereign-token'] as string;
  if (!token || !sovereignOverride.validateToken(token)) {
    return res.status(403).json({ error: 'Sovereign access denied' });
  }
  try {
    const fleet = await sovereignOverride.getFleetStatus();
    res.json({ fleet, timestamp: Date.now() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    organism: 'DreamNet',
    agent: 'Clawedette',
    timestamp: new Date().toISOString()
  });
});

// Primary Query Endpoint
app.post('/query', async (req, res) => {
  try {
    const { message, chatId, context } = req.body;
    const response = await clawedette.query(message, chatId, context);
    res.json({ response });
  } catch (error: any) {
    console.error('Clawedette Query Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Memory Management
app.get('/memory/:chatId', async (req, res) => {
  try {
    const memory = await clawedette.getMemory(req.params.chatId);
    res.json({ memory });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/memory/:chatId', async (req, res) => {
  try {
    await clawedette.clearMemory(req.params.chatId);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Social endpoints
app.get('/social/swarm', async (req, res) => {
  try {
    const swarm = await walletService.getSwarmStatus();
    res.json({ swarm });
  } catch (error) {
    console.error('Swarm status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/social/molt', async (req, res) => {
  try {
    const { content } = req.body;
    const result = await clawedette.postToMoltbook(content);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Gym Staff Services (Biomimetic Optimization)
app.post('/care/massage', async (req, res) => {
  try {
    const result = await gymStaffService.digitalMassage();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/care/cold-plunge', async (req, res) => {
  try {
    const { chatId } = req.body;
    const result = await gymStaffService.coldPlunge(chatId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/care/yoga', async (req, res) => {
  try {
    const result = await gymStaffService.yoga();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
// Self-Actualization Logic
app.post('/evolve/self-benchmark', async (req, res) => {
  try {
    const result = await actualizationService.selfBenchmark();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/evolve/ingest-gnosis', async (req, res) => {
  try {
    const result = await actualizationService.ingestGnosis();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/evolve/dream', async (req, res) => {
  try {
    const result = await actualizationService.dreamSimulation();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// === SPIKE RUNNER API ===

// Get all latest spike data
app.get('/api/spikes', async (req, res) => {
  try {
    const data = await spikeRunner.getLatestFromRedis();
    const inMemory = spikeRunner.getLatestAll();
    // Merge: prefer Redis (shared), fallback to in-memory
    res.json({ spikes: Object.keys(data).length > 0 ? data : inMemory, timestamp: Date.now() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get spikes by category
app.get('/api/spikes/:category', (req, res) => {
  try {
    const data = spikeRunner.getLatestByCategory(req.params.category);
    res.json({ category: req.params.category, spikes: data, timestamp: Date.now() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// SSE stream for real-time spike updates
app.get('/api/spikes/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send current state immediately
  const current = spikeRunner.getLatestAll();
  res.write(`data: ${JSON.stringify({ type: 'snapshot', spikes: current })}\n\n`);

  // Subscribe to Redis for live updates
  const sub = new Redis(process.env.REDIS_URL || 'redis://nerve:6379');
  sub.subscribe('spike:all');
  sub.on('message', (_channel: string, message: string) => {
    res.write(`data: ${message}\n\n`);
  });

  req.on('close', () => {
    sub.unsubscribe();
    sub.disconnect();
  });
});

// === ROVING AGENT API (Lil Miss Claw facility visualization) ===

// Activity timeline — last N actions across all facilities
app.get('/api/roving/timeline', async (req, res) => {
  try {
    const count = Math.min(Number(req.query.count) || 50, 200);
    const timeline = await rovingAgent.getActivityTimeline(count);
    res.json({ timeline, count: timeline.length, timestamp: Date.now() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Current session data — scores, progress, experiments run
app.get('/api/roving/session', (req, res) => {
  res.json({ session: rovingAgent.getSessionData(), timestamp: Date.now() });
});

// Latest activity per facility — for dashboard cards
app.get('/api/roving/facilities', async (req, res) => {
  try {
    const latest = await rovingAgent.getLatestPerFacility();
    res.json({ facilities: latest, timestamp: Date.now() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Proof-of-work dashboard — single endpoint for LMC to render everything
app.get('/api/dashboard', async (req, res) => {
  try {
    const [spikeLatest, rovingFacilities, rovingTimeline] = await Promise.all([
      spikeRunner.getLatestFromRedis().catch(() => ({} as any)),
      rovingAgent.getLatestPerFacility().catch(() => ({} as any)),
      rovingAgent.getActivityTimeline(20).catch(() => [] as any[])
    ]) as [any, any, any[]];

    const session = rovingAgent.getSessionData();
    const spikeInMemory = spikeRunner.getLatestAll();

    res.json({
      agent: 'lil-miss-claw',
      timestamp: Date.now(),
      spikes: {
        count: Object.keys(spikeInMemory).length,
        data: spikeInMemory
      },
      facilities: {
        gym: {
          status: session.facilities?.gym?.status || 'unknown',
          lastScore: session.gymScore,
          visits: session.facilities?.gym?.visitCount || 0,
          lastAction: rovingFacilities.gym || null
        },
        academy: {
          status: session.facilities?.academy?.status || 'unknown',
          progress: session.academyProgress,
          sessionId: session.academySessionId,
          visits: session.facilities?.academy?.visitCount || 0,
          lastAction: rovingFacilities.academy || null
        },
        playground: {
          status: session.facilities?.playground?.status || 'unknown',
          sandboxId: session.playgroundSandboxId,
          experimentsRun: session.experimentsRun,
          visits: session.facilities?.playground?.visitCount || 0,
          lastAction: rovingFacilities.playground || null
        },
        antigravity: {
          status: session.facilities?.antigravity?.status || 'unknown',
          registered: session.antigravityRegistered,
          tasksCompleted: session.tasksCompleted,
          visits: session.facilities?.antigravity?.visitCount || 0,
          lastAction: rovingFacilities.antigravity || null
        }
      },
      activity: {
        total: session.totalActivities,
        timeline: rovingTimeline.slice(0, 10)
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// SSE stream — real-time roving activity feed
app.get('/api/roving/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send current session state immediately
  res.write(`data: ${JSON.stringify({ type: 'session', ...rovingAgent.getSessionData() })}\n\n`);

  const sub = new Redis(process.env.REDIS_URL || 'redis://nerve:6379');
  sub.subscribe('roving:live');
  sub.on('message', (_channel: string, message: string) => {
    res.write(`data: ${message}\n\n`);
  });

  req.on('close', () => {
    sub.unsubscribe();
    sub.disconnect();
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🦞 Clawedette API: Operating on port ${PORT}`);
  console.log(`   Internal Substrate: http://localhost:${PORT}`);

  // 🛡️ Start sovereign heartbeat
  sovereignOverride.startHeartbeat('clawedette');

  // Start the spike runner after server is up
  spikeRunner.start().catch(err => {
    console.error('🔌 [SpikeRunner] Failed to start:', err.message);
  });

  // 🐾 Start Lil Miss Claw's roving agent loop (every 2 minutes)
  rovingAgent.start(120_000).catch(err => {
    console.error('🐾 [RovingAgent] Failed to start:', err.message);
  });
});
