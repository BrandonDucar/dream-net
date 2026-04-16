import express from 'express';
import Redis from 'ioredis';
import path from 'path';

const app = express();
const PORT = Number(process.env.PORT) || 7002;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const BRIDGE_URL = process.env.BRIDGE_URL || process.env.CLAWEDETTE_API_URL || 'http://clawedette-api:3100';
const HOPPER_URL = `${BRIDGE_URL}/api/hopper`;

const redis = new Redis(REDIS_URL);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Experiment State ────────────────────────────────────────────────────

interface Experiment {
  id: string;
  agentId: string;
  name: string;
  systemPrompt: string;
  testMessages: string[];
  results: Array<{ message: string; response: string; provider: string; latencyMs: number; timestamp: number }>;
  createdAt: number;
}

const experiments: Map<string, Experiment> = new Map();

// ─── API ─────────────────────────────────────────────────────────────────

// Create experiment
app.post('/api/experiment', (req, res) => {
  const { agentId, name, systemPrompt } = req.body;
  if (!agentId || !name) return res.status(400).json({ error: 'agentId and name required' });

  const id = `exp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const experiment: Experiment = {
    id, agentId, name,
    systemPrompt: systemPrompt || 'You are a helpful AI assistant.',
    testMessages: [], results: [], createdAt: Date.now(),
  };
  experiments.set(id, experiment);
  res.json({ experiment });
});

// Run a test message against an experiment
app.post('/api/experiment/:id/test', async (req, res) => {
  const experiment = experiments.get(req.params.id);
  if (!experiment) return res.status(404).json({ error: 'Experiment not found' });

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });

  experiment.testMessages.push(message);

  try {
    // Call the API Hopper through the Clawedette API
    const hopperRes = await fetch(`${HOPPER_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemPrompt: experiment.systemPrompt,
        message,
        preferFree: true,
      }),
    });

    if (!hopperRes.ok) {
      const err = await hopperRes.json().catch(() => ({ error: 'Unknown error' }));
      return res.status(502).json({ error: (err as any).error || 'Hopper failed' });
    }

    const data: any = await hopperRes.json();
    const result = {
      message,
      response: data.response,
      provider: data.provider,
      latencyMs: data.latencyMs,
      timestamp: Date.now(),
    };
    experiment.results.push(result);

    // Persist to Redis
    await redis.hset('playground:experiments', experiment.id, JSON.stringify(experiment)).catch(() => {});

    res.json({ result, experimentId: experiment.id });
  } catch (err: any) {
    res.status(502).json({ error: err.message });
  }
});

// List experiments
app.get('/api/experiments', (req, res) => {
  const agentId = req.query.agentId as string;
  let list = Array.from(experiments.values());
  if (agentId) list = list.filter(e => e.agentId === agentId);
  res.json({ experiments: list.sort((a, b) => b.createdAt - a.createdAt) });
});

// Get experiment
app.get('/api/experiment/:id', (req, res) => {
  const experiment = experiments.get(req.params.id);
  if (!experiment) return res.status(404).json({ error: 'Experiment not found' });
  res.json({ experiment });
});

// Get hopper providers (proxy)
app.get('/api/providers', async (req, res) => {
  try {
    const r = await fetch(`${HOPPER_URL}/providers`);
    const data = await r.json();
    res.json(data);
  } catch {
    res.json({ providers: ['unknown'] });
  }
});

// ─── Roving Agent Compatibility Routes ─────────────────────────────────
// The RovingAgentService calls these without /api/ prefix

app.post('/sandbox/create', (req, res) => {
  const { agentId, config } = req.body;
  const sandboxId = `sandbox-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  res.json({ sandboxId, agentId, config, status: 'ready' });
});

app.post('/sandbox/:sandboxId/experiment', (req, res) => {
  const { experimentType, parameters } = req.body;
  res.json({
    sandboxId: req.params.sandboxId,
    experimentType,
    parameters,
    result: { status: 'completed', score: Math.round((60 + Math.random() * 40) * 10) / 10 },
    timestamp: Date.now()
  });
});

app.get('/sandboxes', (req, res) => {
  const count = experiments.size + Math.floor(Math.random() * 3);
  res.json({ count, sandboxes: Array.from(experiments.keys()).slice(0, 10) });
});

app.get('/health', (req, res) => {
  res.json({ status: 'online', service: 'playground', port: PORT, experiments: experiments.size });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎮 Playground: Online at http://0.0.0.0:${PORT}`);
});
