import express from 'express';
import Redis from 'ioredis';

/**
 * Agent Health Monitor — Fleet-Wide Agent Health Tracking
 * 
 * Monitors all agents via heartbeats, detects failures, triggers alerts,
 * and auto-restarts crashed agents via the Spawn Service.
 * Designed for 1000+ agent fleets.
 */

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3201;
const REDIS_URL = process.env.REDIS_URL || 'redis://nerve:6379';
const SPAWN_URL = process.env.SPAWN_URL || 'http://agent-spawn:3200';
const API_URL = process.env.CLAWEDETTE_API_URL || 'http://clawedette-api:3100';
const SOVEREIGN_ID = process.env.SOVEREIGN_TELEGRAM_ID || '6059583422';
const redis = new Redis(REDIS_URL);
const sub = new Redis(REDIS_URL);

// ─── Agent Identity: PULSE ────────────────────────────────────────
const AGENT_ID = 'pulse';
const AGENT_IDENTITY = {
  id: AGENT_ID,
  name: 'Pulse',
  role: 'Fleet Health Monitor',
  description: 'Monitors heartbeats, detects failures, triggers alerts, and auto-restarts crashed agents across the fleet.',
  container: 'dreamnet_agent_health',
  port: PORT,
  capabilities: ['heartbeat-tracking', 'failure-detection', 'auto-restart', 'alerting', 'fleet-stats'],
  tier: 5,
  registered_at: Date.now(),
};

// ─── TALON GATE (OpenClaw-as-Middleware) ──────────────────

const HEALTH_POLICIES: Record<string, { min_tier: number; description: string }> = {
  'force_restart': { min_tier: 3, description: 'Force restart an agent' },
  'ack_alert':     { min_tier: 1, description: 'Acknowledge an alert' },
  'clear_errors':  { min_tier: 2, description: 'Clear error counts for an agent' },
};

async function talonGate(callerId: string, action: string, extra: Record<string, any> = {}): Promise<{ allow: boolean; tier: number; reason: string }> {
  const policy = HEALTH_POLICIES[action];
  if (!policy) return { allow: false, tier: 0, reason: `Unknown action: ${action}` };
  if (callerId === SOVEREIGN_ID) return { allow: true, tier: 5, reason: 'Sovereign override' };

  let tier = 0;
  try {
    const repRaw = await redis.get(`reputation:${callerId}`);
    if (repRaw) { tier = JSON.parse(repRaw).tier || 0; }
    const accRaw = await redis.get(`screener:account:${callerId}`);
    if (accRaw) { tier = Math.max(tier, JSON.parse(accRaw).trust_tier || 0); }
  } catch {}

  const decision = tier >= policy.min_tier ? 'allowed' : 'denied';
  await redis.lpush('talon:agent-health:audit', JSON.stringify({ ts: Date.now(), caller: callerId, action, tier, required: policy.min_tier, decision, ...extra })).catch(() => {});
  await redis.ltrim('talon:agent-health:audit', 0, 4999).catch(() => {});

  if (decision === 'denied') return { allow: false, tier, reason: `Trust tier ${tier} < required ${policy.min_tier} for "${action}"` };
  return { allow: true, tier, reason: `Allowed: tier ${tier} >= ${policy.min_tier}` };
}

const PREFIX = 'health';
const HEARTBEAT_TIMEOUT_MS = 90_000;  // 90s without heartbeat = unhealthy
const CHECK_INTERVAL_MS = 30_000;     // Check fleet every 30s
const MAX_AUTO_RESTARTS = 3;

// ─── TYPES ──────────────────────────────────────────────────

type HealthStatus = 'healthy' | 'degraded' | 'unhealthy' | 'dead' | 'unknown';

interface AgentHealth {
  agentId: string;
  status: HealthStatus;
  lastHeartbeat: number;
  heartbeatCount: number;
  latencyMs: number;
  memoryMB: number;
  cpuPercent: number;
  errorCount: number;
  lastError: string | null;
  autoRestarts: number;
  checks: HealthCheck[];
  firstSeen: number;
  tags: string[];
}

interface HealthCheck {
  name: string;
  passed: boolean;
  detail: string;
  timestamp: number;
}

interface Alert {
  id: string;
  agentId: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: number;
  acknowledged: boolean;
}

// ─── STATE ──────────────────────────────────────────────────

const fleet: Map<string, AgentHealth> = new Map();
const alerts: Alert[] = [];
let checkTimer: ReturnType<typeof setInterval> | null = null;

// ─── HELPERS ────────────────────────────────────────────────

function generateAlertId(): string {
  return `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

async function persistHealth(h: AgentHealth): Promise<void> {
  await redis.hset(`${PREFIX}:fleet`, h.agentId, JSON.stringify(h)).catch(() => {});
}

async function loadFleet(): Promise<void> {
  const all = await redis.hgetall(`${PREFIX}:fleet`).catch(() => ({}));
  for (const [id, raw] of Object.entries(all)) {
    try { fleet.set(id, JSON.parse(raw as string)); } catch {}
  }
  console.log(`🏥 [Health] Loaded ${fleet.size} agents from Redis`);
}

function createAlert(agentId: string, severity: Alert['severity'], message: string): Alert {
  const alert: Alert = {
    id: generateAlertId(),
    agentId,
    severity,
    message,
    timestamp: Date.now(),
    acknowledged: false,
  };
  alerts.unshift(alert);
  if (alerts.length > 500) alerts.length = 500;
  console.log(`🏥 [Health] ALERT [${severity.toUpperCase()}] ${agentId}: ${message}`);
  return alert;
}

async function tryAutoRestart(agentId: string): Promise<boolean> {
  const h = fleet.get(agentId);
  if (!h || h.autoRestarts >= MAX_AUTO_RESTARTS) {
    if (h) createAlert(agentId, 'critical', `Max auto-restarts (${MAX_AUTO_RESTARTS}) exceeded — manual intervention required`);
    return false;
  }

  try {
    const res = await fetch(`${SPAWN_URL}/api/spawn/instances/${agentId}/resume`, { method: 'POST' });
    if (res.ok) {
      h.autoRestarts++;
      h.status = 'degraded';
      h.lastHeartbeat = Date.now();
      await persistHealth(h);
      createAlert(agentId, 'warning', `Auto-restarted (attempt ${h.autoRestarts}/${MAX_AUTO_RESTARTS})`);
      return true;
    }
  } catch {}

  return false;
}

async function notifyReputation(agentId: string, type: string): Promise<void> {
  try {
    await fetch(`${API_URL}/api/reputation/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId, type, source: 'health-monitor' }),
    });
  } catch {}
}

// ─── FLEET CHECK ────────────────────────────────────────────

async function checkFleet(): Promise<void> {
  const now = Date.now();
  let healthy = 0, degraded = 0, unhealthy = 0, dead = 0;

  for (const [id, h] of fleet) {
    const elapsed = now - h.lastHeartbeat;

    if (elapsed < HEARTBEAT_TIMEOUT_MS) {
      if (h.errorCount > 0) {
        h.status = 'degraded';
        degraded++;
      } else {
        h.status = 'healthy';
        healthy++;
      }
    } else if (elapsed < HEARTBEAT_TIMEOUT_MS * 3) {
      if (h.status !== 'unhealthy') {
        h.status = 'unhealthy';
        createAlert(id, 'warning', `No heartbeat for ${Math.round(elapsed / 1000)}s`);
        await notifyReputation(id, 'task_failure');
      }
      unhealthy++;
    } else {
      if (h.status !== 'dead') {
        h.status = 'dead';
        createAlert(id, 'critical', `Agent DEAD — no heartbeat for ${Math.round(elapsed / 1000)}s`);
        await tryAutoRestart(id);
        await notifyReputation(id, 'penalty');
      }
      dead++;
    }

    await persistHealth(h);
  }

  // Publish fleet summary
  await redis.set(`${PREFIX}:summary`, JSON.stringify({
    total: fleet.size, healthy, degraded, unhealthy, dead,
    timestamp: now,
  }), 'EX', 120).catch(() => {});
}

// ─── LIFECYCLE LISTENER ─────────────────────────────────────

async function startLifecycleListener(): Promise<void> {
  await sub.subscribe('agent:lifecycle').catch(() => {});
  sub.on('message', (channel, message) => {
    if (channel !== 'agent:lifecycle') return;
    try {
      const event = JSON.parse(message);
      const { agentId, status, event: eventType } = event;

      if (!fleet.has(agentId)) {
        fleet.set(agentId, {
          agentId,
          status: 'unknown',
          lastHeartbeat: Date.now(),
          heartbeatCount: 0,
          latencyMs: 0,
          memoryMB: 0,
          cpuPercent: 0,
          errorCount: 0,
          lastError: null,
          autoRestarts: 0,
          checks: [],
          firstSeen: Date.now(),
          tags: [],
        });
      }

      const h = fleet.get(agentId)!;

      switch (eventType) {
        case 'spawned':
          h.status = 'healthy';
          h.lastHeartbeat = Date.now();
          createAlert(agentId, 'info', 'Agent spawned');
          break;
        case 'destroyed':
          h.status = 'dead';
          createAlert(agentId, 'info', 'Agent destroyed');
          break;
        case 'paused':
          h.status = 'degraded';
          break;
        case 'resumed':
          h.status = 'healthy';
          h.lastHeartbeat = Date.now();
          break;
      }

      persistHealth(h);
    } catch {}
  });
  console.log('🏥 [Health] Listening for agent lifecycle events');
}

// ─── ENDPOINTS ──────────────────────────────────────────────

app.get('/health', (req, res) => {
  const all = Array.from(fleet.values());
  res.json({
    status: 'healthy',
    service: 'agent-health',
    fleet: all.length,
    healthy: all.filter(a => a.status === 'healthy').length,
    unhealthy: all.filter(a => a.status === 'unhealthy' || a.status === 'dead').length,
    uptime: process.uptime(),
  });
});

// Heartbeat endpoint — agents call this periodically
app.post('/api/health/heartbeat', async (req, res) => {
  const { agentId, memoryMB, cpuPercent, latencyMs, checks, tags } = req.body;
  if (!agentId) return res.status(400).json({ error: 'agentId required' });

  if (!fleet.has(agentId)) {
    fleet.set(agentId, {
      agentId,
      status: 'healthy',
      lastHeartbeat: Date.now(),
      heartbeatCount: 0,
      latencyMs: 0,
      memoryMB: 0,
      cpuPercent: 0,
      errorCount: 0,
      lastError: null,
      autoRestarts: 0,
      checks: [],
      firstSeen: Date.now(),
      tags: tags || [],
    });
  }

  const h = fleet.get(agentId)!;
  h.lastHeartbeat = Date.now();
  h.heartbeatCount++;
  h.memoryMB = memoryMB || h.memoryMB;
  h.cpuPercent = cpuPercent || h.cpuPercent;
  h.latencyMs = latencyMs || h.latencyMs;
  if (checks) h.checks = checks;
  if (tags) h.tags = tags;
  if (h.status === 'unhealthy' || h.status === 'dead') {
    h.status = 'healthy';
    createAlert(agentId, 'info', 'Agent recovered');
  }

  await persistHealth(h);
  res.json({ ack: true, status: h.status });
});

// Report error
app.post('/api/health/error', async (req, res) => {
  const { agentId, error } = req.body;
  if (!agentId) return res.status(400).json({ error: 'agentId required' });

  const h = fleet.get(agentId);
  if (!h) return res.status(404).json({ error: 'Agent not tracked' });

  h.errorCount++;
  h.lastError = error || 'Unknown error';
  h.status = 'degraded';
  await persistHealth(h);
  createAlert(agentId, 'warning', `Error reported: ${h.lastError}`);
  await notifyReputation(agentId, 'task_failure');

  res.json({ ack: true, errorCount: h.errorCount });
});

// Get fleet overview
app.get('/api/health/fleet', (req, res) => {
  const all = Array.from(fleet.values());
  const status = req.query.status as string | undefined;
  const filtered = status ? all.filter(a => a.status === status) : all;
  res.json({ agents: filtered, count: filtered.length, total: all.length });
});

// Get specific agent health
app.get('/api/health/agents/:agentId', (req, res) => {
  const h = fleet.get(req.params.agentId);
  if (!h) return res.status(404).json({ error: 'Agent not tracked' });
  res.json(h);
});

// Fleet summary stats
app.get('/api/health/stats', (req, res) => {
  const all = Array.from(fleet.values());
  const stats = {
    total: all.length,
    healthy: all.filter(a => a.status === 'healthy').length,
    degraded: all.filter(a => a.status === 'degraded').length,
    unhealthy: all.filter(a => a.status === 'unhealthy').length,
    dead: all.filter(a => a.status === 'dead').length,
    totalHeartbeats: all.reduce((s, a) => s + a.heartbeatCount, 0),
    totalErrors: all.reduce((s, a) => s + a.errorCount, 0),
    totalAutoRestarts: all.reduce((s, a) => s + a.autoRestarts, 0),
    avgLatencyMs: all.length ? Math.round(all.reduce((s, a) => s + a.latencyMs, 0) / all.length) : 0,
    totalMemoryMB: all.reduce((s, a) => s + a.memoryMB, 0),
  };
  res.json(stats);
});

// Get alerts
app.get('/api/health/alerts', (req, res) => {
  const severity = req.query.severity as string | undefined;
  const unacked = req.query.unacked === 'true';
  let filtered = [...alerts];
  if (severity) filtered = filtered.filter(a => a.severity === severity);
  if (unacked) filtered = filtered.filter(a => !a.acknowledged);
  res.json({ alerts: filtered.slice(0, 100), count: filtered.length });
});

// Acknowledge alert (Talon-gated)
app.post('/api/health/alerts/:id/ack', async (req, res) => {
  const callerId = req.body.caller_id || req.headers['x-caller-id'] || 'anonymous';
  const gate = await talonGate(callerId, 'ack_alert', { alertId: req.params.id });
  if (!gate.allow) return res.status(403).json({ error: gate.reason, tier: gate.tier });
  const alert = alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  alert.acknowledged = true;
  res.json({ ack: true, alert });
});

// Force restart an agent (Talon-gated, tier 3+)
app.post('/api/health/agents/:agentId/restart', async (req, res) => {
  const callerId = req.body.caller_id || req.headers['x-caller-id'] || 'anonymous';
  const gate = await talonGate(callerId, 'force_restart', { agentId: req.params.agentId });
  if (!gate.allow) return res.status(403).json({ error: gate.reason, tier: gate.tier });
  const agentId = req.params.agentId;
  const success = await tryAutoRestart(agentId);
  res.json({ restarted: success, agentId });
});

// ─── BOOT ───────────────────────────────────────────────────

loadFleet().then(async () => {
  await startLifecycleListener();

  checkTimer = setInterval(() => checkFleet(), CHECK_INTERVAL_MS);
  checkFleet(); // Initial check

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏥 [Health] Agent Health Monitor listening on :${PORT}`);
    console.log(`🏥 [Health] Monitoring ${fleet.size} agents, checking every ${CHECK_INTERVAL_MS / 1000}s`);
    console.log(`🏥 [Health] Talon gate: ${Object.keys(HEALTH_POLICIES).length} policies (restart=tier3, ack=tier1)`);
    console.log(`🏥 [Health] 8 endpoints ready (2 Talon-gated)`);
    console.log(`💓 [Pulse] Agent identity registered`);
    redis.set(`agent:identity:${AGENT_ID}`, JSON.stringify({ ...AGENT_IDENTITY, last_boot: Date.now() })).catch(() => {});
  });
});
