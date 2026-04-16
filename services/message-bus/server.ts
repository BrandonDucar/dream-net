import express from 'express';
import Redis from 'ioredis';

/**
 * Cross-Agent Message Bus — Scalable Inter-Agent Communication
 * 
 * Pub/sub message routing, topic-based channels, broadcast, unicast,
 * and multicast messaging between 100-1000+ agents.
 * Built on Redis Streams for persistence and replay.
 */

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3202;
const REDIS_URL = process.env.REDIS_URL || 'redis://nerve:6379';
const SOVEREIGN_ID = process.env.SOVEREIGN_TELEGRAM_ID || '6059583422';
const redis = new Redis(REDIS_URL);
const sub = new Redis(REDIS_URL);

// ─── Agent Identity: COURIER ──────────────────────────────────────
const AGENT_ID = 'courier';
const AGENT_IDENTITY = {
  id: AGENT_ID,
  name: 'Courier',
  role: 'Inter-Agent Message Router',
  description: 'Routes messages between agents via pub/sub, manages topic subscriptions, enforces trust gates on sensitive topics.',
  container: 'dreamnet_message_bus',
  port: PORT,
  capabilities: ['publish', 'subscribe', 'broadcast', 'unicast', 'multicast', 'replay', 'topic-gating'],
  tier: 5,
  registered_at: Date.now(),
};

// ─── TALON GATE (OpenClaw-as-Middleware) ──────────────────

// Topics that require elevated trust to publish to
const SENSITIVE_TOPICS: Record<string, number> = {
  'governance.vote': 4,
  'governance.proposal': 4,
  'economy.trade': 3,
  'economy.budget': 3,
  'agent.spawn': 2,
  'agent.destroy': 3,
  'system.lifecycle': 2,
  'bridge.attestation': 3,
};

const BUS_POLICIES: Record<string, { min_tier: number; description: string }> = {
  'publish':           { min_tier: 0, description: 'Publish to standard topics' },
  'publish_sensitive':  { min_tier: 2, description: 'Publish to sensitive topics' },
  'publish_governance': { min_tier: 4, description: 'Publish to governance topics' },
  'subscribe':         { min_tier: 0, description: 'Subscribe to topics' },
  'replay':            { min_tier: 1, description: 'Replay historical messages' },
};

async function talonGate(callerId: string, action: string, extra: Record<string, any> = {}): Promise<{ allow: boolean; tier: number; reason: string }> {
  const policy = BUS_POLICIES[action];
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
  await redis.lpush('talon:message-bus:audit', JSON.stringify({ ts: Date.now(), caller: callerId, action, tier, required: policy.min_tier, decision, ...extra })).catch(() => {});
  await redis.ltrim('talon:message-bus:audit', 0, 4999).catch(() => {});

  if (decision === 'denied') return { allow: false, tier, reason: `Trust tier ${tier} < required ${policy.min_tier} for "${action}"` };
  return { allow: true, tier, reason: `Allowed: tier ${tier} >= ${policy.min_tier}` };
}

function getPublishAction(topic: string): string {
  const requiredTier = SENSITIVE_TOPICS[topic];
  if (!requiredTier) return 'publish';
  if (requiredTier >= 4) return 'publish_governance';
  return 'publish_sensitive';
}

const PREFIX = 'msgbus';
const MAX_STREAM_LEN = 10000;
const MAX_PENDING_PER_AGENT = 500;

// ─── TYPES ──────────────────────────────────────────────────

interface BusMessage {
  id?: string;
  from: string;
  to: string | string[] | '*';   // agentId, array, or '*' for broadcast
  topic: string;
  payload: any;
  priority: 'low' | 'normal' | 'high' | 'critical';
  ttlMs: number;
  timestamp: number;
  correlationId?: string;        // For request/reply patterns
  replyTo?: string;              // Channel to reply on
}

interface TopicSubscription {
  agentId: string;
  topic: string;
  filter?: string;               // Optional payload filter
  subscribedAt: number;
}

interface ChannelStats {
  topic: string;
  subscribers: number;
  messageCount: number;
  lastMessage: number;
}

// ─── STATE ──────────────────────────────────────────────────

const subscriptions: Map<string, TopicSubscription[]> = new Map(); // topic -> subs
const agentInboxes: Map<string, BusMessage[]> = new Map();         // agentId -> pending messages
let totalMessages = 0;
let totalDelivered = 0;
let totalDropped = 0;

// ─── BUILT-IN TOPICS ────────────────────────────────────────

const SYSTEM_TOPICS = [
  'system.heartbeat',
  'system.alerts',
  'system.lifecycle',
  'agent.spawn',
  'agent.destroy',
  'agent.health',
  'task.assign',
  'task.complete',
  'task.fail',
  'economy.revenue',
  'economy.budget',
  'economy.trade',
  'bridge.message',
  'bridge.attestation',
  'reputation.update',
  'governance.vote',
  'governance.proposal',
];

// ─── HELPERS ────────────────────────────────────────────────

function getSubscribers(topic: string): TopicSubscription[] {
  const exact = subscriptions.get(topic) || [];
  // Also match wildcard subscriptions (e.g., 'agent.*' matches 'agent.spawn')
  const wildcards: TopicSubscription[] = [];
  for (const [pattern, subs] of subscriptions) {
    if (pattern.endsWith('.*')) {
      const prefix = pattern.slice(0, -2);
      if (topic.startsWith(prefix + '.')) {
        wildcards.push(...subs);
      }
    }
  }
  return [...exact, ...wildcards];
}

function getOrCreateInbox(agentId: string): BusMessage[] {
  if (!agentInboxes.has(agentId)) agentInboxes.set(agentId, []);
  return agentInboxes.get(agentId)!;
}

async function persistMessage(msg: BusMessage): Promise<string> {
  const id = await redis.xadd(
    `${PREFIX}:stream:${msg.topic}`, 'MAXLEN', '~', String(MAX_STREAM_LEN), '*',
    'from', msg.from,
    'to', typeof msg.to === 'string' ? msg.to : JSON.stringify(msg.to),
    'topic', msg.topic,
    'payload', JSON.stringify(msg.payload),
    'priority', msg.priority,
    'timestamp', String(msg.timestamp),
    'correlationId', msg.correlationId || '',
  ).catch(() => `local-${Date.now()}`);
  return id as string;
}

async function deliverToAgent(agentId: string, msg: BusMessage): Promise<boolean> {
  const inbox = getOrCreateInbox(agentId);
  if (inbox.length >= MAX_PENDING_PER_AGENT) {
    // Drop oldest low-priority messages
    const lowIdx = inbox.findIndex(m => m.priority === 'low');
    if (lowIdx >= 0) {
      inbox.splice(lowIdx, 1);
      totalDropped++;
    } else {
      totalDropped++;
      return false;
    }
  }
  inbox.push(msg);
  totalDelivered++;

  // Also publish via Redis pub/sub for real-time listeners
  await redis.publish(`${PREFIX}:agent:${agentId}`, JSON.stringify(msg)).catch(() => {});
  return true;
}

// ─── PUBLISH ────────────────────────────────────────────────

async function publish(msg: BusMessage): Promise<{ id: string; delivered: number; dropped: number }> {
  msg.timestamp = msg.timestamp || Date.now();
  msg.priority = msg.priority || 'normal';
  msg.ttlMs = msg.ttlMs || 300_000; // 5 min default

  const id = await persistMessage(msg);
  msg.id = id;
  totalMessages++;

  let delivered = 0;
  let dropped = 0;

  if (msg.to === '*') {
    // Broadcast to all subscribers of this topic
    const subs = getSubscribers(msg.topic);
    for (const sub of subs) {
      if (sub.agentId === msg.from) continue; // Don't echo back
      const ok = await deliverToAgent(sub.agentId, msg);
      if (ok) delivered++; else dropped++;
    }
  } else if (Array.isArray(msg.to)) {
    // Multicast to specific agents
    for (const agentId of msg.to) {
      const ok = await deliverToAgent(agentId, msg);
      if (ok) delivered++; else dropped++;
    }
  } else {
    // Unicast to single agent
    const ok = await deliverToAgent(msg.to, msg);
    if (ok) delivered++; else dropped++;
  }

  // Update topic stats
  await redis.hset(`${PREFIX}:topic-stats`, msg.topic, JSON.stringify({
    topic: msg.topic,
    lastMessage: msg.timestamp,
    messageCount: totalMessages,
  })).catch(() => {});

  return { id, delivered, dropped };
}

// ─── ENDPOINTS ──────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'message-bus',
    topics: subscriptions.size,
    agents: agentInboxes.size,
    totalMessages,
    totalDelivered,
    totalDropped,
    uptime: process.uptime(),
  });
});

// Publish a message (Talon-gated for sensitive topics)
app.post('/api/bus/publish', async (req, res) => {
  try {
    const { from, to, topic, payload, priority, ttlMs, correlationId, replyTo } = req.body;
    if (!from || !topic) return res.status(400).json({ error: 'from and topic required' });

    // Gate sensitive topics
    const action = getPublishAction(topic);
    if (action !== 'publish') {
      const callerId = req.body.caller_id || req.headers['x-caller-id'] || from;
      const gate = await talonGate(callerId, action, { topic });
      if (!gate.allow) return res.status(403).json({ error: gate.reason, tier: gate.tier, topic });
    }

    const result = await publish({
      from,
      to: to || '*',
      topic,
      payload: payload || {},
      priority: priority || 'normal',
      ttlMs: ttlMs || 300_000,
      timestamp: Date.now(),
      correlationId,
      replyTo,
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Subscribe to a topic
app.post('/api/bus/subscribe', (req, res) => {
  const { agentId, topic, filter } = req.body;
  if (!agentId || !topic) return res.status(400).json({ error: 'agentId and topic required' });

  if (!subscriptions.has(topic)) subscriptions.set(topic, []);
  const subs = subscriptions.get(topic)!;

  // Prevent duplicate subscriptions
  if (subs.some(s => s.agentId === agentId)) {
    return res.json({ status: 'already_subscribed', topic, agentId });
  }

  subs.push({ agentId, topic, filter, subscribedAt: Date.now() });
  console.log(`📬 [Bus] ${agentId} subscribed to "${topic}" (${subs.length} subscribers)`);
  res.json({ status: 'subscribed', topic, agentId, subscribers: subs.length });
});

// Unsubscribe from a topic
app.post('/api/bus/unsubscribe', (req, res) => {
  const { agentId, topic } = req.body;
  if (!agentId || !topic) return res.status(400).json({ error: 'agentId and topic required' });

  const subs = subscriptions.get(topic);
  if (!subs) return res.json({ status: 'not_subscribed' });

  const idx = subs.findIndex(s => s.agentId === agentId);
  if (idx >= 0) subs.splice(idx, 1);

  res.json({ status: 'unsubscribed', topic, agentId, remaining: subs.length });
});

// Poll inbox (agent pulls pending messages)
app.get('/api/bus/inbox/:agentId', (req, res) => {
  const inbox = agentInboxes.get(req.params.agentId) || [];
  const limit = parseInt(req.query.limit as string) || 50;
  const topic = req.query.topic as string | undefined;

  let messages = [...inbox];
  if (topic) messages = messages.filter(m => m.topic === topic);

  // Sort by priority (critical first)
  const priorityOrder: Record<string, number> = { critical: 0, high: 1, normal: 2, low: 3 };
  messages.sort((a, b) => (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2));

  const batch = messages.slice(0, limit);
  res.json({ messages: batch, pending: inbox.length, returned: batch.length });
});

// Acknowledge messages (remove from inbox)
app.post('/api/bus/inbox/:agentId/ack', (req, res) => {
  const { messageIds } = req.body;
  const inbox = agentInboxes.get(req.params.agentId);
  if (!inbox) return res.json({ acked: 0 });

  if (messageIds && Array.isArray(messageIds)) {
    const idSet = new Set(messageIds);
    const before = inbox.length;
    const remaining = inbox.filter(m => !idSet.has(m.id));
    agentInboxes.set(req.params.agentId, remaining);
    res.json({ acked: before - remaining.length });
  } else {
    // Ack all
    const count = inbox.length;
    agentInboxes.set(req.params.agentId, []);
    res.json({ acked: count });
  }
});

// List all topics
app.get('/api/bus/topics', (req, res) => {
  const topics: ChannelStats[] = [];
  for (const [topic, subs] of subscriptions) {
    topics.push({
      topic,
      subscribers: subs.length,
      messageCount: 0,
      lastMessage: 0,
    });
  }
  // Add system topics that may not have subscribers yet
  for (const t of SYSTEM_TOPICS) {
    if (!topics.some(tt => tt.topic === t)) {
      topics.push({ topic: t, subscribers: 0, messageCount: 0, lastMessage: 0 });
    }
  }
  res.json({ topics, count: topics.length });
});

// Get subscriptions for an agent
app.get('/api/bus/subscriptions/:agentId', (req, res) => {
  const agentId = req.params.agentId;
  const agentSubs: TopicSubscription[] = [];
  for (const [topic, subs] of subscriptions) {
    for (const s of subs) {
      if (s.agentId === agentId) agentSubs.push(s);
    }
  }
  res.json({ agentId, subscriptions: agentSubs, count: agentSubs.length });
});

// Replay messages from a topic stream
app.get('/api/bus/replay/:topic', async (req, res) => {
  const topic = req.params.topic;
  const count = parseInt(req.query.count as string) || 50;
  const entries = await redis.xrange(`${PREFIX}:stream:${topic}`, '-', '+', 'COUNT', count).catch(() => []);
  const messages = (entries as any[]).map((e: any) => {
    const fields: Record<string, string> = {};
    for (let i = 0; i < e[1].length; i += 2) fields[e[1][i]] = e[1][i + 1];
    return { id: e[0], ...fields };
  });
  res.json({ topic, messages, count: messages.length });
});

// Bus stats
app.get('/api/bus/stats', (req, res) => {
  const agentStats: Record<string, number> = {};
  for (const [agentId, inbox] of agentInboxes) {
    agentStats[agentId] = inbox.length;
  }
  res.json({
    totalMessages,
    totalDelivered,
    totalDropped,
    activeTopics: subscriptions.size,
    activeAgents: agentInboxes.size,
    systemTopics: SYSTEM_TOPICS.length,
    pendingByAgent: agentStats,
  });
});

// ─── BOOT ───────────────────────────────────────────────────

// Auto-subscribe system topics
for (const topic of SYSTEM_TOPICS) {
  subscriptions.set(topic, []);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`📬 [Bus] Cross-Agent Message Bus listening on :${PORT}`);
  console.log(`📬 [Bus] ${SYSTEM_TOPICS.length} system topics registered`);
  console.log(`📬 [Bus] Talon gate: ${Object.keys(SENSITIVE_TOPICS).length} sensitive topics gated (governance=tier4, economy=tier3, spawn=tier2)`);
  console.log(`📬 [Bus] 10 endpoints ready (publish Talon-gated on sensitive topics)`);
  console.log(`📨 [Courier] Agent identity registered`);
  redis.set(`agent:identity:${AGENT_ID}`, JSON.stringify({ ...AGENT_IDENTITY, last_boot: Date.now() })).catch(() => {});
});
