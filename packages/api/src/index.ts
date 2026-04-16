import express from 'express';
import { ClawedetteService } from './services/ClawedetteService';
import { walletService } from './services/WalletService';
import { actualizationService } from './services/ActualizationService';
import { gymStaffService } from './services/GymStaffService';
import { spikeRunner } from './services/SpikeRunnerService';
import { sovereignOverride } from './services/SovereignOverride';
import { rovingAgent } from './services/RovingAgentService';
import { apiHopper } from './services/APIHopperService';
import { agentBridge } from './services/AgentBridgeService';
import { DreamNetToolkit } from './services/DreamNetToolkit';
import { agentScheduler } from './services/AgentSchedulerService';
import { agentFacility } from './services/AgentFacilityService';
import { receiptGuard } from './services/ReceiptGuardService';
import { zoraToken } from './services/ZoraTokenService';
import { agentReputation } from './services/AgentReputationService';
import { optioBridge } from './services/OptioBridgeService';
import feedRouter from './routes/feed';
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

// � RSS/Atom/JSON Feed — ecosystem activity stream for IFTTT, ChatGPT, feed readers
app.use('/api/feed', feedRouter);

// �🛡️ Sovereign Override — MUST be first real middleware. Cannot be bypassed.
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

// ─── 🔄 DreamNet API Hopper — Shared LLM Gateway ────────────────────────

// Any agent can query an LLM through the hopper
app.post('/api/hopper/query', async (req, res) => {
  try {
    const { systemPrompt, message, preferFree, providerId, timeoutMs } = req.body;
    if (!message) return res.status(400).json({ error: 'message required' });

    const result = await apiHopper.query(
      systemPrompt || 'You are a helpful DreamNet agent.',
      message,
      { preferFree: preferFree !== false, providerId, timeoutMs }
    );
    res.json(result);
  } catch (error: any) {
    res.status(502).json({ error: error.message, hint: 'All LLM providers exhausted' });
  }
});

// Hopper stats — health, usage, latency per provider
app.get('/api/hopper/stats', (req, res) => {
  res.json(apiHopper.getStats());
});

// List available provider IDs
app.get('/api/hopper/providers', (req, res) => {
  res.json({ providers: apiHopper.getProviderIds() });
});

// Reset all providers to healthy (admin)
app.post('/api/hopper/reset', (req, res) => {
  apiHopper.resetAll();
  res.json({ status: 'all providers reset', timestamp: Date.now() });
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

// ─── 🌉 DreamNet Sovereign Bridge — Inter-Agent Communication ────────────────

// Register agent on the bridge
app.post('/bridge/register', async (req, res) => {
  try {
    const { agentId, name, type, version, capabilities, endpoint, metadata } = req.body;
    if (!agentId || !name) return res.status(400).json({ error: 'agentId and name required' });
    const result = await agentBridge.register({
      agentId, name,
      type: type || 'external',
      version: version || '1.0.0',
      capabilities: capabilities || [],
      endpoint,
      status: 'online',
      lastSeen: Date.now(),
      registeredAt: Date.now(),
      uptimeMs: 0,
      messagesSent: 0,
      messagesReceived: 0,
      tasksCompleted: 0,
      circuitBreaker: 'closed',
      metadata,
    });
    res.json({ status: 'registered', ...result, agentId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Agent heartbeat — returns pending inbox/task counts
app.post('/bridge/heartbeat', async (req, res) => {
  try {
    const { agentId, status, metadata } = req.body;
    if (!agentId) return res.status(400).json({ error: 'agentId required' });
    const result = await agentBridge.heartbeat(agentId, status, metadata);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Send message to specific agent
app.post('/bridge/send', async (req, res) => {
  try {
    const { from, to, content, type, data, priority, replyTo } = req.body;
    if (!from || !to || !content) return res.status(400).json({ error: 'from, to, content required' });
    const msg = await agentBridge.send(from, to, content, type, data, priority, replyTo);
    res.json({ status: 'sent', message: msg });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Broadcast to all agents
app.post('/bridge/broadcast', async (req, res) => {
  try {
    const { from, content, data, priority } = req.body;
    if (!from || !content) return res.status(400).json({ error: 'from, content required' });
    const result = await agentBridge.broadcast(from, content, data, priority);
    res.json({ status: 'broadcast', ...result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Relay — cross-network message forwarding
app.post('/bridge/relay', async (req, res) => {
  try {
    const { from, to, content, data } = req.body;
    if (!from || !to || !content) return res.status(400).json({ error: 'from, to, content required' });
    const msg = await agentBridge.relay(from, to, content, data);
    res.json({ status: 'relayed', message: msg });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Read agent inbox
app.get('/bridge/inbox/:agentId', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const unreadOnly = req.query.unread === 'true';
    const msgs = await agentBridge.getInbox(req.params.agentId, limit, unreadOnly);
    res.json({ agentId: req.params.agentId, messages: msgs, count: msgs.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Mark inbox read
app.post('/bridge/inbox/:agentId/read', async (req, res) => {
  try {
    const count = await agentBridge.markRead(req.params.agentId);
    res.json({ agentId: req.params.agentId, markedRead: count });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// List all agents
app.get('/bridge/agents', async (req, res) => {
  try {
    const agents = await agentBridge.getAllAgents();
    res.json({ agents, count: agents.length, timestamp: Date.now() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific agent
app.get('/bridge/agent/:agentId', async (req, res) => {
  try {
    const agent = await agentBridge.getAgent(req.params.agentId);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    res.json({ agent });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Assign task to agent
app.post('/bridge/task', async (req, res) => {
  try {
    const { assignedTo, assignedBy, title, description, priority, deadline, subtasks, saga } = req.body;
    if (!assignedTo || !title) return res.status(400).json({ error: 'assignedTo, title required' });
    const task = await agentBridge.assignTask({
      assignedTo,
      assignedBy: assignedBy || 'sovereign',
      title,
      description: description || '',
      priority: priority || 'medium',
      deadline, subtasks, saga,
    });
    res.json({ status: 'assigned', task });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent tasks
app.get('/bridge/tasks/:agentId', async (req, res) => {
  try {
    const statusFilter = req.query.status as string | undefined;
    const tasks = await agentBridge.getTasks(req.params.agentId, statusFilter);
    res.json({ agentId: req.params.agentId, tasks, count: tasks.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Complete task
app.post('/bridge/task/:taskId/complete', async (req, res) => {
  try {
    const { agentId, result } = req.body;
    if (!agentId) return res.status(400).json({ error: 'agentId required' });
    const task = await agentBridge.updateTask(agentId, req.params.taskId, { status: 'completed', result });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ status: 'completed', task });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Fail task
app.post('/bridge/task/:taskId/fail', async (req, res) => {
  try {
    const { agentId, result } = req.body;
    if (!agentId) return res.status(400).json({ error: 'agentId required' });
    const task = await agentBridge.updateTask(agentId, req.params.taskId, { status: 'failed', result });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ status: 'failed', task });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// SSE stream — real-time messages for an agent
app.get('/bridge/stream/:agentId', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  res.write(`data: ${JSON.stringify({ type: 'connected', agentId: req.params.agentId, timestamp: Date.now() })}\n\n`);
  agentBridge.registerSSEClient(req.params.agentId, res);

  // Keepalive ping every 30s
  const keepalive = setInterval(() => {
    try { res.write(`: keepalive\n\n`); } catch { clearInterval(keepalive); }
  }, 30_000);

  req.on('close', () => clearInterval(keepalive));
});

// Bridge health — structural integrity
app.get('/bridge/health', async (req, res) => {
  try {
    const health = await agentBridge.getHealth();
    res.json(health);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Network topology map
app.get('/bridge/topology', async (req, res) => {
  try {
    const topology = await agentBridge.getTopology();
    res.json(topology);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Audit trail
app.get('/bridge/audit', async (req, res) => {
  try {
    const count = Math.min(Number(req.query.count) || 50, 200);
    const log = await agentBridge.getAuditLog(count);
    res.json({ audit: log, count: log.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ─── 🧰 DreamNet Toolkit — Unified API for OpenClaw Agents ───────────────────
const toolkitRedis = new Redis(process.env.REDIS_URL || 'redis://nerve:6379');
const toolkit = new DreamNetToolkit(toolkitRedis);

// Full tool catalog — lists every API/CLI/SDK available to agents
app.get('/api/toolkit/catalog', (req: any, res: any) => {
  res.json({ tools: toolkit.getToolCatalog(), count: toolkit.getToolCatalog().length, timestamp: Date.now() });
});

// Tool summary for system prompt injection — compact text format
app.get('/api/toolkit/summary', (req: any, res: any) => {
  res.json({ summary: toolkit.getToolSummaryForPrompt(), timestamp: Date.now() });
});

// Read the full blackboard
app.get('/api/toolkit/blackboard', (req: any, res: any) => {
  res.json({ blackboard: toolkit.readBlackboard(), timestamp: Date.now() });
});

// Read a specific blackboard section by keyword
app.get('/api/toolkit/blackboard/section/:keyword', (req: any, res: any) => {
  const section = toolkit.readBlackboardSection(req.params.keyword);
  res.json({ keyword: req.params.keyword, section, timestamp: Date.now() });
});

// List gnosis documents
app.get('/api/toolkit/gnosis', (req: any, res: any) => {
  res.json({ documents: toolkit.listGnosisDocs(), timestamp: Date.now() });
});

// Read a specific gnosis document
app.get('/api/toolkit/gnosis/:filename', (req: any, res: any) => {
  const content = toolkit.readGnosis(req.params.filename);
  res.json({ filename: req.params.filename, content, timestamp: Date.now() });
});

// Agent passports
app.get('/api/toolkit/passports', async (req: any, res: any) => {
  const passports = await toolkit.getAgentPassports();
  res.json({ passports, timestamp: Date.now() });
});

// Sovereign bindings
app.get('/api/toolkit/bindings', async (req: any, res: any) => {
  const bindings = await toolkit.getSovereignBindings();
  res.json({ bindings, timestamp: Date.now() });
});

console.log('🧰 DreamNet Toolkit: 9 endpoints live at /api/toolkit/*');

// ─── 📅 Agent Scheduler — Plans & Schedules with Free Roam ──────────────────

// Scheduler status — see all agents' current state
app.get('/api/scheduler/status', (req: any, res: any) => {
  res.json(agentScheduler.getStatus());
});

// Start scheduler (sovereign only)
app.post('/api/scheduler/start', async (req: any, res: any) => {
  await agentScheduler.start();
  res.json({ status: 'started', timestamp: Date.now() });
});

// Stop scheduler (sovereign only)
app.post('/api/scheduler/stop', (req: any, res: any) => {
  agentScheduler.stop();
  res.json({ status: 'stopped', timestamp: Date.now() });
});

// Scheduler audit trail
app.get('/api/scheduler/audit', async (req: any, res: any) => {
  try {
    const count = Math.min(Number(req.query.count) || 50, 200);
    const entries = await toolkitRedis.xrange('scheduler:audit', '-', '+', 'COUNT', count);
    const audit = entries.map(([id, fields]: [string, string[]]) => {
      const obj: any = { id };
      for (let i = 0; i < fields.length; i += 2) obj[fields[i]] = fields[i + 1];
      if (obj.data) try { obj.data = JSON.parse(obj.data); } catch {}
      return obj;
    });
    res.json({ audit, count: audit.length });
  } catch (err: any) {
    res.json({ audit: [], error: err.message });
  }
});

// Agent health from scheduler
app.get('/api/scheduler/health', async (req: any, res: any) => {
  try {
    const health = await toolkitRedis.hgetall('scheduler:health');
    const parsed: any = {};
    for (const [k, v] of Object.entries(health)) {
      try { parsed[k] = JSON.parse(v as string); } catch { parsed[k] = v; }
    }
    res.json({ health: parsed, timestamp: Date.now() });
  } catch (err: any) {
    res.json({ health: {}, error: err.message });
  }
});

console.log('📅 Agent Scheduler: 5 endpoints live at /api/scheduler/*');

// ─── 🏢 Agent Facility Service — Gym/Academy/Playground + PoW/PoE ────────────

// Visit gym — train on a challenge, earn XP
app.post('/api/facility/gym/visit', async (req: any, res: any) => {
  try {
    const { agentId, challengeId } = req.body;
    if (!agentId) return res.status(400).json({ error: 'agentId required' });
    const pow = await agentFacility.visitGym(agentId, challengeId);
    res.json({ proofOfWork: pow });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// Gym grind — multiple challenges in sequence
app.post('/api/facility/gym/grind', async (req: any, res: any) => {
  try {
    const { agentId, count } = req.body;
    if (!agentId) return res.status(400).json({ error: 'agentId required' });
    const results = await agentFacility.gymGrind(agentId, count || 3);
    res.json({ results, count: results.length });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// Visit academy — enroll/progress in a course
app.post('/api/facility/academy/visit', async (req: any, res: any) => {
  try {
    const { agentId, courseId } = req.body;
    if (!agentId) return res.status(400).json({ error: 'agentId required' });
    const poe = await agentFacility.visitAcademy(agentId, courseId);
    res.json({ proofOfExperience: poe });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// Visit playground — run an experiment
app.post('/api/facility/playground/visit', async (req: any, res: any) => {
  try {
    const { agentId, experimentName, systemPrompt } = req.body;
    if (!agentId) return res.status(400).json({ error: 'agentId required' });
    const pow = await agentFacility.visitPlayground(agentId, experimentName, systemPrompt);
    res.json({ proofOfWork: pow });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// PoW report for an agent
app.get('/api/facility/pow/:agentId', async (req: any, res: any) => {
  const report = await agentFacility.getPoWReport(req.params.agentId);
  res.json(report);
});

// PoE report for an agent
app.get('/api/facility/poe/:agentId', async (req: any, res: any) => {
  const report = await agentFacility.getPoEReport(req.params.agentId);
  res.json(report);
});

// Full report (PoW + PoE combined)
app.get('/api/facility/report/:agentId', async (req: any, res: any) => {
  const report = await agentFacility.getFullReport(req.params.agentId);
  res.json(report);
});

// Leaderboard
app.get('/api/facility/leaderboard', async (req: any, res: any) => {
  const leaderboard = await agentFacility.getLeaderboard();
  res.json({ leaderboard, timestamp: Date.now() });
});

// Record revenue (agent earned money → budget scales up)
app.post('/api/facility/revenue', async (req: any, res: any) => {
  try {
    const { agentId, amount, source } = req.body;
    if (!agentId || !amount) return res.status(400).json({ error: 'agentId and amount required' });
    const ledger = await agentFacility.recordRevenue(agentId, amount, source || 'unknown');
    res.json({ agentId, revenue: ledger.revenue, dailyBudget: ledger.dailyBudget, rank: ledger.rank });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// Record $LMC token revenue (agent earned $LMC → budget scales up)
app.post('/api/facility/lmc-revenue', async (req: any, res: any) => {
  try {
    const { agentId, amountLMC, source } = req.body;
    if (!agentId || !amountLMC) return res.status(400).json({ error: 'agentId and amountLMC required' });
    const ledger = await agentFacility.recordLMCRevenue(agentId, amountLMC, source || 'unknown');
    res.json({ 
      agentId, 
      lmcRevenue: ledger.lmcRevenue, 
      dailyBudget: ledger.dailyBudget, 
      rank: ledger.rank,
      tokenContract: '0x53e77A6b6180b1A5bBA2F732667eA11853DCE550',
      chain: 'Base Mainnet'
    });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// Get $LMC token info
app.get('/api/facility/lmc-info', (req: any, res: any) => {
  res.json({
    token: {
      name: 'LiL Miss Claw',
      symbol: 'LMC',
      contract: '0x53e77A6b6180b1A5bBA2F732667eA11853DCE550',
      chain: 'Base Mainnet',
      zora: 'https://zora.co/coin/base:0x53e77A6b6180b1a5bba2f732667ea11853dce550',
      basescan: 'https://basescan.org/address/0x53e77A6b6180b1A5bBA2F732667eA11853DCE550'
    },
    benefits: {
      budgetBonus: '15% of $LMC revenue added to daily budget',
      maxBudget: '$50/day cap',
      scaling: 'Base budget + 10% USD revenue + 15% $LMC bonus'
    }
  });
});

// Available challenges and courses
app.get('/api/facility/challenges', (req: any, res: any) => {
  res.json({ challenges: agentFacility.getAvailableChallenges() });
});

app.get('/api/facility/courses', (req: any, res: any) => {
  res.json({ courses: agentFacility.getAvailableCourses() });
});

// Playground toys catalog (91 Ohara mini-apps + Google Genie)
app.get('/api/facility/playground/toys', (req: any, res: any) => {
  const toys = agentFacility.getPlaygroundToys();
  res.json({ toys, count: toys.length, categories: ['ai', 'gaming', 'utility', 'finance'] });
});

app.get('/api/facility/playground/toys/:category', (req: any, res: any) => {
  const toys = agentFacility.getPlaygroundToysByCategory(req.params.category);
  res.json({ toys, count: toys.length, category: req.params.category });
});

// Reset daily budgets (sovereign only, runs at midnight)
app.post('/api/facility/reset-budgets', async (req: any, res: any) => {
  await agentFacility.resetDailyBudgets();
  res.json({ status: 'reset', timestamp: Date.now() });
});

console.log('🏢 Agent Facility: 16 endpoints live at /api/facility/* (91 toys stocked + $LMC token)');

// ─── � ReceiptGuard — Exactly-Once Tool Calls ──────────────────────────

app.get('/api/receipts/stats', async (req: any, res: any) => {
  const stats = await receiptGuard.getStats();
  res.json({ ...stats, timestamp: Date.now() });
});

app.get('/api/receipts/verify/:key', async (req: any, res: any) => {
  const { valid, receipt } = await receiptGuard.verifyReceipt(req.params.key);
  res.json({ valid, receipt });
});

app.get('/api/receipts/dlq', async (req: any, res: any) => {
  const dead = await receiptGuard.getDeadLetters();
  res.json({ deadLetters: dead, count: dead.length });
});

console.log('🔒 ReceiptGuard: 3 endpoints live at /api/receipts/*');

// ─── 🪙 $LMC Zora Token Monitor ─────────────────────────────────────────

app.get('/api/zora/lmc/status', (req: any, res: any) => {
  res.json(zoraToken.getState());
});

app.get('/api/zora/lmc/audit', async (req: any, res: any) => {
  const log = await zoraToken.getAuditLog(50);
  res.json({ audit: log, count: log.length });
});

// Boot Zora token monitor
zoraToken.init().then(() => zoraToken.start(300_000)).catch(() => {});
console.log('🪙 $LMC Zora Token: 2 endpoints at /api/zora/lmc/* (polling every 5m)');

// ─── ⭐ Agent Reputation System ──────────────────────────────────────────

app.get('/api/reputation/:agentId', async (req: any, res: any) => {
  const profile = await agentReputation.getProfile(req.params.agentId);
  res.json(profile);
});

app.post('/api/reputation/event', async (req: any, res: any) => {
  try {
    const { agentId, type, source, details } = req.body;
    if (!agentId || !type) return res.status(400).json({ error: 'agentId and type required' });
    const profile = await agentReputation.recordEvent(agentId, type, source || 'api', details);
    res.json({ score: profile.score, tier: profile.tier, components: profile.components });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post('/api/reputation/endorse', async (req: any, res: any) => {
  try {
    const { fromAgent, toAgent, reason, weight } = req.body;
    if (!fromAgent || !toAgent || !reason) return res.status(400).json({ error: 'fromAgent, toAgent, reason required' });
    const profile = await agentReputation.endorse(fromAgent, toAgent, reason, weight);
    res.json({ score: profile.score, tier: profile.tier, endorsements: profile.endorsements.length });
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

app.get('/api/reputation/:agentId/permissions', async (req: any, res: any) => {
  const permissions = await agentReputation.getPermissions(req.params.agentId);
  res.json({ agentId: req.params.agentId, permissions });
});

app.get('/api/reputation/leaderboard', async (req: any, res: any) => {
  const board = await agentReputation.getLeaderboard(10);
  res.json({ leaderboard: board, timestamp: Date.now() });
});

app.get('/api/reputation/audit', async (req: any, res: any) => {
  const log = await agentReputation.getAuditLog(50);
  res.json({ audit: log, count: log.length });
});

app.post('/api/reputation/decay', async (req: any, res: any) => {
  await agentReputation.applyDailyDecay();
  res.json({ status: 'decay_applied', timestamp: Date.now() });
});

console.log('⭐ Agent Reputation: 7 endpoints at /api/reputation/*');

// ─── 🌐 OptioBridge — Read-Only Cosmos Chain Bridge ─────────────────────

app.get('/api/optio/snapshot', async (req: any, res: any) => {
  const snapshot = await optioBridge.getSnapshot();
  if (!snapshot) {
    const fresh = await optioBridge.poll();
    return res.json(fresh);
  }
  res.json(snapshot);
});

app.get('/api/optio/balance', async (req: any, res: any) => {
  const wallet = req.query.wallet as string | undefined;
  const balances = await optioBridge.getBalance(wallet);
  res.json({ wallet: wallet || 'default', balances });
});

app.get('/api/optio/staking', async (req: any, res: any) => {
  const wallet = req.query.wallet as string | undefined;
  const staking = await optioBridge.getStakingInfo(wallet);
  res.json(staking);
});

app.get('/api/optio/transactions', async (req: any, res: any) => {
  const wallet = req.query.wallet as string | undefined;
  const limit = parseInt(req.query.limit as string) || 20;
  const txs = await optioBridge.getRecentTransactions(wallet, limit);
  res.json({ transactions: txs, count: txs.length });
});

app.get('/api/optio/node', async (req: any, res: any) => {
  const status = await optioBridge.getNodeStatus();
  res.json(status);
});

app.get('/api/optio/audit', async (req: any, res: any) => {
  const log = await optioBridge.getAuditLog(50);
  res.json({ audit: log, count: log.length });
});

// Boot OptioBridge polling (every 10 minutes)
optioBridge.start(600_000);
console.log('🌐 OptioBridge: 6 endpoints at /api/optio/* (polling every 10m)');

// ─── 🚀 Surge x402 — Farcaster Engagement Engine ─────────────────────────

// Buy likes or recasts for a Farcaster cast via x402 protocol
app.post('/api/surge/buy', async (req, res) => {
  try {
    const { castHash, type, budget, minScore } = req.body;
    if (!castHash) return res.status(400).json({ error: 'castHash required' });
    const surgeEngine = await import('../../organs/endocrine/surge-x402/index.js');
    const result = await surgeEngine.buyEngagement(
      castHash,
      type || 'likes',
      budget,
      minScore,
    );
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Boost a cast — buy both likes AND recasts
app.post('/api/surge/boost', async (req, res) => {
  try {
    const { castHash, likeBudget, recastBudget, minScore } = req.body;
    if (!castHash) return res.status(400).json({ error: 'castHash required' });
    const surgeEngine = await import('../../organs/endocrine/surge-x402/index.js');
    const result = await surgeEngine.boostCast(castHash, likeBudget, recastBudget, minScore);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Campaign management
app.post('/api/surge/campaign', async (req, res) => {
  try {
    const { castHash, likeBudget, recastBudget, minScore, autoBoost } = req.body;
    if (!castHash) return res.status(400).json({ error: 'castHash required' });
    const surgeEngine = await import('../../organs/endocrine/surge-x402/index.js');
    surgeEngine.createCampaign({
      castHash,
      likeBudget: likeBudget || 5,
      recastBudget: recastBudget || 5,
      minScore: minScore || 0.7,
      autoBoost: autoBoost !== false,
    });
    res.json({ status: 'campaign_created', castHash });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/surge/campaigns', async (req, res) => {
  try {
    const surgeEngine = await import('../../organs/endocrine/surge-x402/index.js');
    res.json({ campaigns: surgeEngine.listCampaigns(), timestamp: Date.now() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Purchase history and stats
app.get('/api/surge/history', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const surgeEngine = await import('../../organs/endocrine/surge-x402/index.js');
    res.json({ history: surgeEngine.getPurchaseHistory(limit), timestamp: Date.now() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/surge/stats', async (req, res) => {
  try {
    const surgeEngine = await import('../../organs/endocrine/surge-x402/index.js');
    res.json({ stats: surgeEngine.getStats(), timestamp: Date.now() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Dead letter queue
app.get('/bridge/dlq', async (req, res) => {
  try {
    const dls = await agentBridge.getDeadLetters();
    res.json({ deadLetters: dls, count: dls.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Retry dead letter
app.post('/bridge/dlq/retry/:dlqId', async (req, res) => {
  try {
    const msg = await agentBridge.retryDeadLetter(req.params.dlqId);
    if (!msg) return res.status(404).json({ error: 'Dead letter not found' });
    res.json({ status: 'retried', message: msg });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🦞 Clawedette API: Operating on port ${PORT}`);
  console.log(`   Internal Substrate: http://localhost:${PORT}`);
  const disableBackgroundAgents = process.env.DISABLE_BACKGROUND_AGENTS === 'true';

  // 🛡️ Start sovereign heartbeat
  sovereignOverride.startHeartbeat('clawedette');

  if (disableBackgroundAgents) {
    console.log('🧪 Forensics mode: background agent loops disabled (DISABLE_BACKGROUND_AGENTS=true)');
  } else {
    // Start the spike runner after server is up
    spikeRunner.start().catch(err => {
      console.error('🔌 [SpikeRunner] Failed to start:', err.message);
    });

    // 🐾 Start Lil Miss Claw's roving agent loop (every 2 minutes)
    rovingAgent.start(120_000).catch(err => {
      console.error('🐾 [RovingAgent] Failed to start:', err.message);
    });

    console.log('🌉 Sovereign Bridge: 20 endpoints live at /bridge/*');

    // 📅 Start agent scheduler
    agentScheduler.start().catch(err => {
      console.error('📅 [Scheduler] Failed to start:', err.message);
    });
    console.log('🚀 Surge x402: 6 endpoints live at /api/surge/*');

    // ─── 🦞 Telegram ↔ LLM Bridge ─────────────────────────────────────────
    // Subscribe to clawedette-inbound (from voice bot) → query LLM → publish reply
    const telegramSub = new Redis(process.env.REDIS_URL || 'redis://nerve:6379');
    const telegramPub = new Redis(process.env.REDIS_URL || 'redis://nerve:6379');

    telegramSub.subscribe('clawedette-inbound', (err) => {
      if (err) console.error('❌ Failed to subscribe to clawedette-inbound:', err);
      else console.log('🦞 Telegram ↔ LLM bridge: listening on clawedette-inbound');
    });

    telegramSub.on('message', async (channel: string, message: string) => {
      if (channel !== 'clawedette-inbound') return;
      try {
        const data = JSON.parse(message);
        const { chatId, username, prompt } = data;
        if (!chatId || !prompt) return;

        console.log(`🦞 [Telegram→LLM] @${username}: ${prompt.slice(0, 80)}`);

        // Call ClawedetteService which uses the API Hopper (Ollama → Gemini → Groq → etc.)
        const response = await clawedette.query(prompt, String(chatId));

        // Publish reply back to voice bot
        telegramPub.publish('clawedette-outbound', JSON.stringify({
          chatId,
          text: response,
          username,
          timestamp: Date.now(),
        }));

        console.log(`🦞 [LLM→Telegram] Reply sent to chat ${chatId} (${response.length} chars)`);
      } catch (err: any) {
        console.error('🦞 [Telegram↔LLM] Error:', err.message);
        // Try to send an error message back so user isn't left hanging
        try {
          const data = JSON.parse(message);
          if (data.chatId) {
            telegramPub.publish('clawedette-outbound', JSON.stringify({
              chatId: data.chatId,
              text: `🦞 Hmm, my neural pathways hit a snag: ${err.message.slice(0, 100)}. Try again in a moment!`,
              timestamp: Date.now(),
            }));
          }
        } catch {}
      }
    });
  }
});
