import express from 'express';
import Redis from 'ioredis';
import path from 'path';

const app = express();
const PORT = Number(process.env.PORT) || 7004;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const BRIDGE_URL = process.env.BRIDGE_URL || process.env.CLAWEDETTE_API_URL || 'http://clawedette-api:3100';

const redis = new Redis(REDIS_URL);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Course Catalog ──────────────────────────────────────────────────────

interface Course {
  id: string;
  name: string;
  description: string;
  modules: string[];
  difficulty: number;
  xpReward: number;
  poeCredential: string;
}

const COURSES: Course[] = [
  { id: 'agent-101', name: 'Agent Fundamentals', description: 'Learn the basics of autonomous agent design', modules: ['What is an Agent?', 'Tools & Capabilities', 'Memory & Context', 'Decision Making'], difficulty: 1, xpReward: 200, poeCredential: 'Agent Fundamentals Certificate' },
  { id: 'bridge-comms', name: 'Sovereign Bridge Communication', description: 'Master inter-agent messaging via the Sovereign Bridge', modules: ['Bridge Architecture', 'Registration & Heartbeats', 'Message Types', 'SSE Streams', 'Task Sagas'], difficulty: 2, xpReward: 400, poeCredential: 'Bridge Communications Specialist' },
  { id: 'security-ops', name: 'Security Operations', description: 'Defend the swarm — immune system, RBAC, threat detection', modules: ['Threat Modeling', 'RBAC & Identity', 'Secret Scanning', 'Circuit Breakers', 'Incident Response'], difficulty: 3, xpReward: 600, poeCredential: 'Security Operations Expert' },
  { id: 'onchain-basics', name: 'On-Chain Basics (Base)', description: 'Read and write to Base blockchain — tokens, attestations, contracts', modules: ['Wallet Setup', 'Reading Contracts', 'EAS Attestations', 'Token Interactions', '$LMC Integration'], difficulty: 2, xpReward: 500, poeCredential: 'On-Chain Developer' },
  { id: 'social-intel', name: 'Social Intelligence', description: 'Farcaster engagement, trend detection, content strategy', modules: ['Platform APIs', 'Trend Detection', 'Content Generation', 'Engagement Metrics', 'Growth Hacking'], difficulty: 2, xpReward: 400, poeCredential: 'Social Intelligence Analyst' },
  { id: 'llm-mastery', name: 'LLM Mastery', description: 'Prompt engineering, API hopping, model selection, fine-tuning', modules: ['Model Landscape', 'Prompt Engineering', 'API Hopper Architecture', 'Cost Optimization', 'Evaluation & Testing'], difficulty: 3, xpReward: 600, poeCredential: 'LLM Master' },
];

// ─── Student State ───────────────────────────────────────────────────────

interface Enrollment {
  agentId: string;
  courseId: string;
  completedModules: number[];
  startedAt: number;
  completedAt?: number;
  poeIssued: boolean;
}

const enrollments: Map<string, Enrollment[]> = new Map();

// ─── API ─────────────────────────────────────────────────────────────────

app.get('/api/courses', (req, res) => {
  res.json({ courses: COURSES });
});

app.post('/api/enroll', async (req, res) => {
  const { agentId, courseId } = req.body;
  if (!agentId || !courseId) return res.status(400).json({ error: 'agentId and courseId required' });

  const course = COURSES.find(c => c.id === courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });

  const agentEnrollments = enrollments.get(agentId) || [];
  if (agentEnrollments.find(e => e.courseId === courseId)) {
    return res.status(409).json({ error: 'Already enrolled' });
  }

  const enrollment: Enrollment = { agentId, courseId, completedModules: [], startedAt: Date.now(), poeIssued: false };
  agentEnrollments.push(enrollment);
  enrollments.set(agentId, agentEnrollments);

  await redis.hset('academy:enrollments', `${agentId}:${courseId}`, JSON.stringify(enrollment)).catch(() => {});

  res.json({ enrollment, course: course.name });
});

app.post('/api/complete-module', async (req, res) => {
  const { agentId, courseId, moduleIndex } = req.body;
  if (!agentId || !courseId || moduleIndex === undefined) return res.status(400).json({ error: 'agentId, courseId, moduleIndex required' });

  const course = COURSES.find(c => c.id === courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });

  const agentEnrollments = enrollments.get(agentId) || [];
  const enrollment = agentEnrollments.find(e => e.courseId === courseId);
  if (!enrollment) return res.status(404).json({ error: 'Not enrolled' });

  if (!enrollment.completedModules.includes(moduleIndex)) {
    enrollment.completedModules.push(moduleIndex);
  }

  const allDone = enrollment.completedModules.length >= course.modules.length;
  if (allDone && !enrollment.completedAt) {
    enrollment.completedAt = Date.now();
    enrollment.poeIssued = true;

    // Broadcast graduation
    try {
      await fetch(`${BRIDGE_URL}/bridge/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'academy',
          content: `[ACADEMY] ${agentId} GRADUATED from "${course.name}" — PoE: ${course.poeCredential}`,
          data: { agentId, courseId, credential: course.poeCredential },
          priority: 'high',
        }),
      });
    } catch {}
  }

  await redis.hset('academy:enrollments', `${agentId}:${courseId}`, JSON.stringify(enrollment)).catch(() => {});

  res.json({
    enrollment,
    progress: `${enrollment.completedModules.length}/${course.modules.length}`,
    graduated: allDone,
    credential: allDone ? course.poeCredential : null,
  });
});

app.get('/api/student/:agentId', (req, res) => {
  const agentEnrollments = enrollments.get(req.params.agentId) || [];
  const enriched = agentEnrollments.map(e => {
    const course = COURSES.find(c => c.id === e.courseId);
    return { ...e, courseName: course?.name, totalModules: course?.modules.length, progress: `${e.completedModules.length}/${course?.modules.length || 0}` };
  });
  res.json({ agentId: req.params.agentId, enrollments: enriched, graduated: enriched.filter(e => e.completedAt).length });
});

app.get('/api/graduates', (req, res) => {
  const grads: any[] = [];
  for (const [agentId, enrs] of enrollments.entries()) {
    for (const e of enrs) {
      if (e.completedAt) {
        const course = COURSES.find(c => c.id === e.courseId);
        grads.push({ agentId, course: course?.name, credential: course?.poeCredential, graduatedAt: e.completedAt });
      }
    }
  }
  res.json({ graduates: grads.sort((a, b) => b.graduatedAt - a.graduatedAt) });
});

// ─── Roving Agent Compatibility Routes ─────────────────────────────────
// The RovingAgentService calls these without /api/ prefix

app.post('/enroll', async (req, res) => {
  const { agentId, learningGoals, currentLevel } = req.body;
  const courseId = COURSES[Math.floor(Math.random() * COURSES.length)].id;
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  res.json({ sessionId, agentId, courseId, curriculum: 'loaded', learningGoals, currentLevel });
});

app.post('/complete-module', async (req, res) => {
  const { sessionId, moduleId, assessment } = req.body;
  const progress = 10 + Math.random() * 90;
  const nextModules = ['Advanced Reasoning', 'Swarm Tactics', 'Bridge Protocol', 'Data Fusion', 'Immune Defense'];
  res.json({ sessionId, moduleId, progress: Math.round(progress * 10) / 10, nextModule: nextModules[Math.floor(Math.random() * nextModules.length)], assessment });
});

app.get('/knowledge/domains', (req, res) => {
  const domains = ['Orbital Systems', 'Biomimetic Design', 'Cryptographic Protocols', 'Swarm Intelligence', 'Market Microstructure', 'Social Signal Processing', 'Agent Architecture', 'Immune Defense'];
  res.json({ domains, count: domains.length });
});

app.get('/health', (req, res) => {
  res.json({ status: 'online', service: 'academy', port: PORT, courses: COURSES.length, students: enrollments.size });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎓 Academy: Online at http://0.0.0.0:${PORT}`);
});
