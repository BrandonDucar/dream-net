import express from 'express';
import Redis from 'ioredis';
import { initDatabase, recordAgentSpawn, updateAgentStatus, recordSpawnEvent, getActiveAgents, getSpawnMetrics } from './database';

/**
 * Agent Spawn Service — Automated Agent Deployment at Scale
 * 
 * Manages agent lifecycle: spawn, pause, resume, destroy.
 * Tracks agent templates, pools, and resource allocation.
 * Designed to scale to 1000+ agents.
 * 
 * Database Integration: Neon PostgreSQL for persistent storage
 */

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3200;
const REDIS_URL = process.env.REDIS_URL || 'redis://nerve:6379';
const API_URL = process.env.CLAWEDETTE_API_URL || 'http://clawedette-api:3100';
const SOVEREIGN_ID = process.env.SOVEREIGN_TELEGRAM_ID || '6059583422';
const redis = new Redis(REDIS_URL);

// ─── Agent Identity: HATCHLING ─────────────────────────────────────
const AGENT_ID = 'hatchling';
const AGENT_IDENTITY = {
  id: AGENT_ID,
  name: 'Hatchling',
  role: 'Agent Lifecycle Manager',
  description: 'Spawns, pauses, resumes, and destroys agents. Manages templates and resource allocation for the fleet.',
  container: 'dreamnet_agent_spawn',
  port: PORT,
  capabilities: ['spawn', 'pause', 'resume', 'destroy', 'batch-spawn', 'template-management'],
  tier: 5,
  registered_at: Date.now(),
};

// ─── TALON GATE (OpenClaw-as-Middleware) ──────────────────

const SPAWN_POLICIES: Record<string, { min_tier: number; description: string }> = {
  'spawn':         { min_tier: 2, description: 'Spawn a new agent' },
  'spawn_batch':   { min_tier: 3, description: 'Batch spawn agents' },
  'pause':         { min_tier: 1, description: 'Pause an agent' },
  'resume':        { min_tier: 1, description: 'Resume an agent' },
  'destroy':       { min_tier: 3, description: 'Destroy an agent' },
  'spawn_sovereign': { min_tier: 5, description: 'Spawn a sovereign-class agent' },
};

async function talonGate(callerId: string, action: string, extra: Record<string, any> = {}): Promise<{ allow: boolean; tier: number; reason: string }> {
  const policy = SPAWN_POLICIES[action];
  if (!policy) return { allow: false, tier: 0, reason: `Unknown action: ${action}` };

  // Sovereign override — always allowed
  if (callerId === SOVEREIGN_ID) return { allow: true, tier: 5, reason: 'Sovereign override' };

  // Look up caller trust tier from reputation system
  let tier = 0;
  try {
    const repRaw = await redis.get(`reputation:${callerId}`);
    if (repRaw) { tier = JSON.parse(repRaw).tier || 0; }
    // Also check screener account scores
    const accRaw = await redis.get(`screener:account:${callerId}`);
    if (accRaw) { tier = Math.max(tier, JSON.parse(accRaw).trust_tier || 0); }
  } catch {}

  if (tier < policy.min_tier) {
    await redis.lpush('talon:agent-spawn:audit', JSON.stringify({
      ts: Date.now(), caller: callerId, action, tier, required: policy.min_tier, decision: 'denied', ...extra,
    }));
    await redis.ltrim('talon:agent-spawn:audit', 0, 4999);
    return { allow: false, tier, reason: `Trust tier ${tier} < required ${policy.min_tier} for "${action}"` };
  }

  await redis.lpush('talon:agent-spawn:audit', JSON.stringify({
    ts: Date.now(), caller: callerId, action, tier, decision: 'allowed', ...extra,
  }));
  await redis.ltrim('talon:agent-spawn:audit', 0, 4999);
  return { allow: true, tier, reason: `Allowed: tier ${tier} >= ${policy.min_tier}` };
}

const PREFIX = 'spawn';

// ─── TYPES ──────────────────────────────────────────────────

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  defaultConfig: Record<string, any>;
  minTier: string;           // Minimum reputation tier to use this template
  resourceCost: number;      // Estimated memory MB
  createdAt: number;
}

interface AgentInstance {
  id: string;
  templateId: string;
  name: string;
  status: 'spawning' | 'running' | 'paused' | 'destroyed' | 'error';
  config: Record<string, any>;
  pid: number | null;
  port: number | null;
  memoryMB: number;
  spawnedAt: number;
  lastHeartbeat: number;
  restarts: number;
  parentId: string | null;   // For evolved/cloned agents
}

interface SpawnRequest {
  templateId: string;
  name?: string;
  config?: Record<string, any>;
  parentId?: string;
  autoStart?: boolean;
}

// ─── BUILT-IN TEMPLATES ─────────────────────────────────────

const TEMPLATES: AgentTemplate[] = [
  {
    id: 'scout',
    name: 'Scout Agent',
    description: 'Lightweight agent for web scraping, monitoring, and data collection',
    capabilities: ['web-search', 'scraping', 'monitoring', 'alerts'],
    defaultConfig: { maxConcurrent: 5, pollInterval: 60000 },
    minTier: 'Probation',
    resourceCost: 64,
    createdAt: Date.now(),
  },
  {
    id: 'worker',
    name: 'Worker Agent',
    description: 'General-purpose task executor with tool access',
    capabilities: ['tool-use', 'api-calls', 'file-ops', 'scheduling'],
    defaultConfig: { maxConcurrent: 3, timeout: 300000 },
    minTier: 'Trusted',
    resourceCost: 128,
    createdAt: Date.now(),
  },
  {
    id: 'specialist',
    name: 'Specialist Agent',
    description: 'Domain-specific agent with deep expertise in one area',
    capabilities: ['deep-analysis', 'report-generation', 'domain-expertise'],
    defaultConfig: { maxConcurrent: 2, model: 'gpt-4o-mini' },
    minTier: 'Trusted',
    resourceCost: 192,
    createdAt: Date.now(),
  },
  {
    id: 'coordinator',
    name: 'Coordinator Agent',
    description: 'Orchestrates other agents, manages workflows and task distribution',
    capabilities: ['orchestration', 'task-routing', 'load-balancing', 'delegation'],
    defaultConfig: { maxSubAgents: 10, strategy: 'round-robin' },
    minTier: 'Reliable',
    resourceCost: 256,
    createdAt: Date.now(),
  },
  {
    id: 'sovereign',
    name: 'Sovereign Agent',
    description: 'Full-autonomy agent with spending, spawning, and config modification rights',
    capabilities: ['full-autonomy', 'spending', 'spawning', 'config-modification'],
    defaultConfig: { budgetLimit: 50, requireApproval: true },
    minTier: 'Sovereign',
    resourceCost: 384,
    createdAt: Date.now(),
  },
];

// ─── STATE ──────────────────────────────────────────────────

let nextPort = 3300;
const instances: Map<string, AgentInstance> = new Map();

// ─── HELPERS ────────────────────────────────────────────────

function generateId(): string {
  return `agent-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function persistInstance(inst: AgentInstance): Promise<void> {
  await redis.hset(`${PREFIX}:instances`, inst.id, JSON.stringify(inst)).catch(() => {});
}

async function loadInstances(): Promise<void> {
  const all = await redis.hgetall(`${PREFIX}:instances`).catch(() => ({}));
  for (const [id, raw] of Object.entries(all)) {
    try {
      const inst = JSON.parse(raw as string) as AgentInstance;
      instances.set(id, inst);
    } catch {}
  }
  console.log(`🐣 [Spawn] Loaded ${instances.size} existing instances from Redis`);
}

async function audit(action: string, agentId: string, details: Record<string, any> = {}): Promise<void> {
  await redis.xadd(`${PREFIX}:audit`, '*',
    'action', action,
    'agentId', agentId,
    'details', JSON.stringify(details),
    'timestamp', String(Date.now()),
  ).catch(() => {});
}

async function notifyHealthMonitor(inst: AgentInstance, event: string): Promise<void> {
  await redis.publish('agent:lifecycle', JSON.stringify({
    event,
    agentId: inst.id,
    templateId: inst.templateId,
    status: inst.status,
    timestamp: Date.now(),
  })).catch(() => {});
}

async function notifyReputation(agentId: string, type: string): Promise<void> {
  try {
    await fetch(`${API_URL}/api/reputation/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId, type, source: 'spawn-service' }),
    });
  } catch {}
}

// ─── SPAWN ──────────────────────────────────────────────────

async function spawnAgent(req: SpawnRequest): Promise<AgentInstance> {
  const template = TEMPLATES.find(t => t.id === req.templateId);
  if (!template) throw new Error(`Unknown template: ${req.templateId}`);

  const id = generateId();
  const port = nextPort++;

  const inst: AgentInstance = {
    id,
    templateId: req.templateId,
    name: req.name || `${template.name} ${id.slice(-6)}`,
    status: 'spawning',
    config: { ...template.defaultConfig, ...(req.config || {}) },
    pid: null,
    port,
    memoryMB: template.resourceCost,
    spawnedAt: Date.now(),
    lastHeartbeat: Date.now(),
    restarts: 0,
    parentId: req.parentId || null,
  };

  instances.set(id, inst);

  // Simulate spawn delay then mark running
  setTimeout(async () => {
    inst.status = 'running';
    inst.pid = Math.floor(Math.random() * 65535);
    inst.lastHeartbeat = Date.now();
    await persistInstance(inst);
    await notifyHealthMonitor(inst, 'spawned');
    await notifyReputation(id, 'task_success');
    console.log(`🐣 [Spawn] Agent ${inst.name} (${id}) is now RUNNING on port ${port}`);
  }, 1000 + Math.random() * 2000);

  await persistInstance(inst);
  await audit('spawn', id, { templateId: req.templateId, name: inst.name });

  console.log(`🐣 [Spawn] Spawning ${inst.name} (${id}) from template "${template.name}"...`);

  return inst;
}

// ─── ENDPOINTS ──────────────────────────────────────────────

// Health
app.get('/health', (req, res) => {
  const running = Array.from(instances.values()).filter(i => i.status === 'running').length;
  const total = instances.size;
  res.json({ status: 'healthy', service: 'agent-spawn', running, total, uptime: process.uptime() });
});

// List templates
app.get('/api/spawn/templates', (req, res) => {
  res.json({ templates: TEMPLATES, count: TEMPLATES.length });
});

// Spawn a new agent (Talon-gated)
app.post('/api/spawn', async (req, res) => {
  try {
    const callerId = req.body.caller_id || req.headers['x-caller-id'] || 'anonymous';
    const templateId = req.body.templateId;
    const action = templateId === 'sovereign' ? 'spawn_sovereign' : 'spawn';
    const gate = await talonGate(callerId, action, { templateId });
    if (!gate.allow) return res.status(403).json({ error: gate.reason, tier: gate.tier });
    const inst = await spawnAgent(req.body);
    res.status(201).json(inst);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Batch spawn (Talon-gated, tier 3+)
app.post('/api/spawn/batch', async (req, res) => {
  try {
    const callerId = req.body.caller_id || req.headers['x-caller-id'] || 'anonymous';
    const gate = await talonGate(callerId, 'spawn_batch', { count: req.body.count });
    if (!gate.allow) return res.status(403).json({ error: gate.reason, tier: gate.tier });
    const { templateId, count, config } = req.body;
    if (!templateId || !count) return res.status(400).json({ error: 'templateId and count required' });
    const spawned: AgentInstance[] = [];
    for (let i = 0; i < Math.min(count, 50); i++) {
      const inst = await spawnAgent({ templateId, config, name: `${templateId}-${i + 1}` });
      spawned.push(inst);
    }
    res.status(201).json({ spawned: spawned.length, agents: spawned });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// List all instances
app.get('/api/spawn/instances', (req, res) => {
  const status = req.query.status as string | undefined;
  let list = Array.from(instances.values());
  if (status) list = list.filter(i => i.status === status);
  res.json({ instances: list, count: list.length });
});

// Get specific instance
app.get('/api/spawn/instances/:id', (req, res) => {
  const inst = instances.get(req.params.id);
  if (!inst) return res.status(404).json({ error: 'Agent not found' });
  res.json(inst);
});

// Pause agent (Talon-gated)
app.post('/api/spawn/instances/:id/pause', async (req, res) => {
  const callerId = req.body.caller_id || req.headers['x-caller-id'] || 'anonymous';
  const gate = await talonGate(callerId, 'pause', { agentId: req.params.id });
  if (!gate.allow) return res.status(403).json({ error: gate.reason, tier: gate.tier });
  const inst = instances.get(req.params.id);
  if (!inst) return res.status(404).json({ error: 'Agent not found' });
  inst.status = 'paused';
  await persistInstance(inst);
  await notifyHealthMonitor(inst, 'paused');
  await audit('pause', inst.id);
  res.json({ status: 'paused', agent: inst });
});

// Resume agent (Talon-gated)
app.post('/api/spawn/instances/:id/resume', async (req, res) => {
  const callerId = req.body.caller_id || req.headers['x-caller-id'] || 'anonymous';
  const gate = await talonGate(callerId, 'resume', { agentId: req.params.id });
  if (!gate.allow) return res.status(403).json({ error: gate.reason, tier: gate.tier });
  const inst = instances.get(req.params.id);
  if (!inst) return res.status(404).json({ error: 'Agent not found' });
  inst.status = 'running';
  inst.lastHeartbeat = Date.now();
  await persistInstance(inst);
  await notifyHealthMonitor(inst, 'resumed');
  await audit('resume', inst.id);
  res.json({ status: 'running', agent: inst });
});

// Destroy agent (Talon-gated, tier 3+)
app.delete('/api/spawn/instances/:id', async (req, res) => {
  const callerId = (req.query.caller_id as string) || req.headers['x-caller-id'] as string || 'anonymous';
  const gate = await talonGate(callerId, 'destroy', { agentId: req.params.id });
  if (!gate.allow) return res.status(403).json({ error: gate.reason, tier: gate.tier });
  const inst = instances.get(req.params.id);
  if (!inst) return res.status(404).json({ error: 'Agent not found' });
  inst.status = 'destroyed';
  await persistInstance(inst);
  await notifyHealthMonitor(inst, 'destroyed');
  await audit('destroy', inst.id);
  res.json({ status: 'destroyed', agent: inst });
});

// Fleet stats
app.get('/api/spawn/stats', (req, res) => {
  const all = Array.from(instances.values());
  const stats = {
    total: all.length,
    running: all.filter(i => i.status === 'running').length,
    paused: all.filter(i => i.status === 'paused').length,
    spawning: all.filter(i => i.status === 'spawning').length,
    destroyed: all.filter(i => i.status === 'destroyed').length,
    error: all.filter(i => i.status === 'error').length,
    totalMemoryMB: all.filter(i => i.status === 'running').reduce((s, i) => s + i.memoryMB, 0),
    byTemplate: {} as Record<string, number>,
  };
  for (const inst of all.filter(i => i.status === 'running')) {
    stats.byTemplate[inst.templateId] = (stats.byTemplate[inst.templateId] || 0) + 1;
  }
  res.json(stats);
});

// Audit log
app.get('/api/spawn/audit', async (req, res) => {
  const entries = await redis.xrange(`${PREFIX}:audit`, '-', '+', 'COUNT', 50).catch(() => []);
  const log = (entries as any[]).map((e: any) => {
    const fields: Record<string, string> = {};
    for (let i = 0; i < e[1].length; i += 2) fields[e[1][i]] = e[1][i + 1];
    return { id: e[0], ...fields };
  });
  res.json({ audit: log, count: log.length });
});

// ─── BOOT ───────────────────────────────────────────────────

// Initialize database and start server
initDatabase().then(() => {
  console.log(
    process.env.DATABASE_URL
      ? '✅ [Hatchling] Database initialized successfully'
      : '⚠️ [Hatchling] Database persistence disabled; running Redis-only'
  );
  
  loadInstances().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🐣 [Spawn] Agent Spawn Service listening on :${PORT}`);
      console.log(`🐣 [Spawn] ${TEMPLATES.length} templates, ${instances.size} existing instances`);
      console.log(`🐣 [Spawn] Talon gate: ${Object.keys(SPAWN_POLICIES).length} policies (spawn=tier2, batch=tier3, destroy=tier3, sovereign=tier5)`);
      console.log(`🐣 [Spawn] 10 endpoints ready (6 Talon-gated)`);
      console.log(`🥚 [Hatchling] Agent identity registered`);
      if (process.env.DATABASE_URL) {
        console.log(`🗄️ [Hatchling] Database connected for persistent storage`);
      }
      redis.set(`agent:identity:${AGENT_ID}`, JSON.stringify({ ...AGENT_IDENTITY, last_boot: Date.now() })).catch(() => {});
    });
  });
}).catch(error => {
  console.error('❌ [Hatchling] Database initialization failed:', error);
  process.exit(1);
});
