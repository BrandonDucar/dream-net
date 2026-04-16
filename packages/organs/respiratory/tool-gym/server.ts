import express from 'express';
import Redis from 'ioredis';
import path from 'path';

const app = express();
const PORT = Number(process.env.PORT) || 7001;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const BRIDGE_URL = process.env.BRIDGE_URL || process.env.CLAWEDETTE_API_URL || 'http://clawedette-api:3100';

const redis = new Redis(REDIS_URL);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Types ───────────────────────────────────────────────────────────────

interface TrainingResult {
  agentId: string;
  tool: string;
  score: number;
  passed: boolean;
  xpEarned: number;
  timestamp: number;
}

type Rank = 'recruit' | 'soldier' | 'specialist' | 'elite' | 'sovereign';

// ─── In-Memory State (backed by Redis) ───────────────────────────────────

const xpStore: Map<string, number> = new Map();
const trainingLog: TrainingResult[] = [];

function getRank(xp: number): Rank {
  if (xp >= 10000) return 'sovereign';
  if (xp >= 5000) return 'elite';
  if (xp >= 2000) return 'specialist';
  if (xp >= 500) return 'soldier';
  return 'recruit';
}

// ─── Available Training Challenges ───────────────────────────────────────

const CHALLENGES = [
  { id: 'web-search', name: 'Web Search', description: 'Find and summarize information from the web', difficulty: 1, xpReward: 50 },
  { id: 'code-review', name: 'Code Review', description: 'Analyze code for bugs and improvements', difficulty: 2, xpReward: 100 },
  { id: 'data-analysis', name: 'Data Analysis', description: 'Parse and extract insights from datasets', difficulty: 2, xpReward: 100 },
  { id: 'social-post', name: 'Social Post Craft', description: 'Write engaging social media content', difficulty: 1, xpReward: 50 },
  { id: 'security-audit', name: 'Security Audit', description: 'Identify vulnerabilities in a system config', difficulty: 3, xpReward: 200 },
  { id: 'api-integration', name: 'API Integration', description: 'Connect to an external API and process results', difficulty: 2, xpReward: 120 },
  { id: 'prompt-engineering', name: 'Prompt Engineering', description: 'Craft effective prompts for LLM tasks', difficulty: 2, xpReward: 100 },
  { id: 'blockchain-read', name: 'Blockchain Read', description: 'Query on-chain data and interpret results', difficulty: 3, xpReward: 200 },
  { id: 'sentiment-analysis', name: 'Sentiment Analysis', description: 'Classify text sentiment accurately', difficulty: 1, xpReward: 60 },
  { id: 'multi-step-task', name: 'Multi-Step Workflow', description: 'Complete a complex multi-step task with dependencies', difficulty: 3, xpReward: 250 },
];

// ─── API Endpoints ───────────────────────────────────────────────────────

// List available challenges
app.get('/api/challenges', (req, res) => {
  res.json({ challenges: CHALLENGES });
});

// Start a training session
app.post('/api/train', async (req, res) => {
  const { agentId, challengeId } = req.body;
  if (!agentId || !challengeId) return res.status(400).json({ error: 'agentId and challengeId required' });

  const challenge = CHALLENGES.find(c => c.id === challengeId);
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

  // Simulate training (in production, this would run the actual challenge)
  const score = Math.random() * 100;
  const passed = score >= (challenge.difficulty * 20); // Higher difficulty = harder to pass
  const xpEarned = passed ? challenge.xpReward : Math.floor(challenge.xpReward * 0.1);

  const result: TrainingResult = {
    agentId,
    tool: challenge.id,
    score: Math.round(score * 10) / 10,
    passed,
    xpEarned,
    timestamp: Date.now(),
  };

  trainingLog.push(result);
  const currentXP = (xpStore.get(agentId) || 0) + xpEarned;
  xpStore.set(agentId, currentXP);

  // Persist to Redis
  await redis.hincrby('gym:xp', agentId, xpEarned).catch(() => {});
  await redis.xadd('gym:training-log', '*',
    'agentId', agentId,
    'challenge', challenge.id,
    'score', String(result.score),
    'passed', String(passed),
    'xpEarned', String(xpEarned),
  ).catch(() => {});

  // Broadcast to bridge
  try {
    await fetch(`${BRIDGE_URL}/bridge/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'tool-gym',
        content: `[GYM] ${agentId} ${passed ? 'PASSED' : 'FAILED'} "${challenge.name}" — Score: ${result.score}% | +${xpEarned} XP`,
        data: result,
        priority: passed ? 'normal' : 'low',
      }),
    });
  } catch {}

  res.json({
    result,
    totalXP: currentXP,
    rank: getRank(currentXP),
    challenge: challenge.name,
  });
});

// Get agent stats
app.get('/api/agent/:agentId', async (req, res) => {
  const { agentId } = req.params;
  const xp = xpStore.get(agentId) || Number(await redis.hget('gym:xp', agentId).catch(() => '0')) || 0;
  const results = trainingLog.filter(r => r.agentId === agentId);
  const passed = results.filter(r => r.passed).length;

  res.json({
    agentId,
    xp,
    rank: getRank(xp),
    totalSessions: results.length,
    passed,
    failed: results.length - passed,
    successRate: results.length > 0 ? Math.round((passed / results.length) * 100) : 0,
    recentResults: results.slice(-10),
  });
});

// Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  // Merge in-memory with Redis
  const redisXP = await redis.hgetall('gym:xp').catch(() => ({}));
  const merged = new Map(xpStore);
  for (const [id, xp] of Object.entries(redisXP)) {
    merged.set(id, Math.max(merged.get(id) || 0, Number(xp)));
  }

  const leaderboard = Array.from(merged.entries())
    .map(([agentId, xp]) => ({ agentId, xp, rank: getRank(xp) }))
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 20);

  res.json({ leaderboard });
});

// Recent training log
app.get('/api/log', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  res.json({ log: trainingLog.slice(-limit).reverse() });
});

// ─── Roving Agent Compatibility Routes ─────────────────────────────────
// The RovingAgentService calls these without /api/ prefix

app.post('/benchmark', async (req, res) => {
  const { agentId, task } = req.body;
  const challenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
  const score = 50 + Math.random() * 50;
  const latency = 100 + Math.random() * 400;
  res.json({ agentId, task: task || challenge.name, score: Math.round(score * 10) / 10, latency: Math.round(latency), passed: score >= 65 });
});

app.post('/train', async (req, res) => {
  const { agentId, curriculum } = req.body;
  const estimatedTime = 5 + Math.floor(Math.random() * 25);
  res.json({ agentId, curriculum: curriculum || 'general-training', estimatedTime, status: 'started' });
});

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'online', service: 'tool-gym', port: PORT, agents: xpStore.size, sessions: trainingLog.length });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🏋️ Tool Gym: Online at http://0.0.0.0:${PORT}`);
});
