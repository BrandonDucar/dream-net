import axios from 'axios';
import Redis from 'ioredis';

/**
 * 🐾 RovingAgentService: Lil Miss Claw's Autonomous Facility Tour
 * 
 * She roams between the Gym, Academy, Playground, and Antigravity on a loop.
 * Every action is logged to Redis as a timestamped activity stream so the
 * dashboard can visualize exactly what she's doing in real-time.
 * 
 * Facilities:
 *   - Tool Gym (7001)    → Benchmarks herself, trains on tasks
 *   - Academy (7004)     → Enrolls in courses, completes modules, learns
 *   - Playground (7002)  → Creates sandboxes, runs experiments, plays with toys
 *   - Antigravity (7003) → Registers with swarm, picks up tasks
 */

const GYM_URL = process.env.TOOL_GYM_URL || 'http://tool-gym:7001';
const ACADEMY_URL = process.env.ACADEMY_URL || 'http://academy:7004';
const PLAYGROUND_URL = process.env.PLAYGROUND_URL || 'http://playground:7002';
const ANTIGRAVITY_URL = process.env.ANTIGRAVITY_URL || 'http://antigravity:7003';
const REDIS_URL = process.env.REDIS_URL || 'redis://nerve:6379';

const AGENT_ID = 'lil-miss-claw';
const ACTIVITY_STREAM = 'roving:activity';
const ACTIVITY_HASH = 'roving:latest';
const FACILITY_STATUS = 'roving:facility-status';

interface Activity {
  agentId: string;
  facility: string;
  action: string;
  detail: string;
  result: any;
  timestamp: number;
  emoji: string;
  duration: number;
}

interface FacilityState {
  name: string;
  status: 'online' | 'offline' | 'visiting';
  lastVisit: number | null;
  visitCount: number;
  lastAction: string | null;
}

export class RovingAgentService {
  private redis: Redis;
  private running = false;
  private loopTimer: NodeJS.Timeout | null = null;
  private facilityStates: Map<string, FacilityState> = new Map();
  private sessionData: {
    gymScore: number;
    academySessionId: string | null;
    academyProgress: number;
    playgroundSandboxId: string | null;
    experimentsRun: number;
    antigravityRegistered: boolean;
    tasksCompleted: number;
    totalActivities: number;
  };

  constructor() {
    this.redis = new Redis(REDIS_URL);
    this.sessionData = {
      gymScore: 0,
      academySessionId: null,
      academyProgress: 0,
      playgroundSandboxId: null,
      experimentsRun: 0,
      antigravityRegistered: false,
      tasksCompleted: 0,
      totalActivities: 0
    };

    // Initialize facility states
    for (const [key, name] of [['gym', 'Tool Gym'], ['academy', 'Academy'], ['playground', 'Playground'], ['antigravity', 'Antigravity']]) {
      this.facilityStates.set(key, {
        name,
        status: 'offline',
        lastVisit: null,
        visitCount: 0,
        lastAction: null
      });
    }
  }

  // ─── ACTIVITY LOGGING ──────────────────────────────────────────────

  private async logActivity(activity: Activity) {
    this.sessionData.totalActivities++;

    // Stream for timeline visualization
    await this.redis.xadd(ACTIVITY_STREAM, '*',
      'data', JSON.stringify(activity)
    ).catch(() => {});

    // Latest activity per facility for dashboard cards
    await this.redis.hset(ACTIVITY_HASH, activity.facility, JSON.stringify(activity)).catch(() => {});

    // Facility state update
    const state = this.facilityStates.get(activity.facility);
    if (state) {
      state.lastVisit = activity.timestamp;
      state.visitCount++;
      state.lastAction = activity.action;
      state.status = 'online';
    }

    // Publish for real-time SSE subscribers
    await this.redis.publish('roving:live', JSON.stringify(activity)).catch(() => {});

    // Update aggregate facility status
    await this.redis.set(FACILITY_STATUS, JSON.stringify(
      Object.fromEntries(this.facilityStates)
    )).catch(() => {});

    console.log(`🐾 [Roving] ${activity.emoji} ${activity.facility}: ${activity.action} — ${activity.detail}`);
  }

  // ─── GYM VISIT ─────────────────────────────────────────────────────

  private async visitGym() {
    const start = Date.now();
    const facility = this.facilityStates.get('gym')!;
    facility.status = 'visiting';

    try {
      // Benchmark herself
      const benchRes = await axios.post(`${GYM_URL}/benchmark`, {
        agentId: AGENT_ID,
        task: this.pickGymTask()
      }, { timeout: 5000 });

      this.sessionData.gymScore = benchRes.data.score;

      await this.logActivity({
        agentId: AGENT_ID,
        facility: 'gym',
        action: 'benchmark',
        detail: `Scored ${benchRes.data.score.toFixed(1)} on "${benchRes.data.task}" (latency: ${benchRes.data.latency.toFixed(0)}ms)`,
        result: benchRes.data,
        timestamp: Date.now(),
        emoji: '🏋️',
        duration: Date.now() - start
      });

      // Train on something
      const trainRes = await axios.post(`${GYM_URL}/train`, {
        agentId: AGENT_ID,
        curriculum: this.pickTrainingCurriculum()
      }, { timeout: 5000 });

      await this.logActivity({
        agentId: AGENT_ID,
        facility: 'gym',
        action: 'train',
        detail: `Started training: "${trainRes.data.curriculum}" (est. ${trainRes.data.estimatedTime}s)`,
        result: trainRes.data,
        timestamp: Date.now(),
        emoji: '💪',
        duration: Date.now() - start
      });

    } catch (err: any) {
      facility.status = 'offline';
      await this.logActivity({
        agentId: AGENT_ID,
        facility: 'gym',
        action: 'visit-failed',
        detail: `Gym offline: ${err.message}`,
        result: { error: err.message },
        timestamp: Date.now(),
        emoji: '🚫',
        duration: Date.now() - start
      });
    }
  }

  // ─── ACADEMY VISIT ──────────────────────────────────────────────────

  private async visitAcademy() {
    const start = Date.now();
    const facility = this.facilityStates.get('academy')!;
    facility.status = 'visiting';

    try {
      // Enroll if not already
      if (!this.sessionData.academySessionId) {
        const enrollRes = await axios.post(`${ACADEMY_URL}/enroll`, {
          agentId: AGENT_ID,
          learningGoals: this.pickLearningGoals(),
          currentLevel: 'novice'
        }, { timeout: 5000 });

        this.sessionData.academySessionId = enrollRes.data.sessionId;

        await this.logActivity({
          agentId: AGENT_ID,
          facility: 'academy',
          action: 'enroll',
          detail: `Enrolled in session ${enrollRes.data.sessionId} — goals: ${enrollRes.data.curriculum ? 'curriculum loaded' : 'pending'}`,
          result: enrollRes.data,
          timestamp: Date.now(),
          emoji: '🎓',
          duration: Date.now() - start
        });
      }

      // Complete a module
      const moduleId = `module_${Date.now()}`;
      const completeRes = await axios.post(`${ACADEMY_URL}/complete-module`, {
        sessionId: this.sessionData.academySessionId,
        moduleId,
        assessment: { score: 70 + Math.random() * 30, notes: 'Self-assessed' }
      }, { timeout: 5000 });

      this.sessionData.academyProgress = completeRes.data.progress;

      await this.logActivity({
        agentId: AGENT_ID,
        facility: 'academy',
        action: 'complete-module',
        detail: `Completed module "${completeRes.data.nextModule || 'unknown'}" — progress: ${completeRes.data.progress.toFixed(1)}%`,
        result: completeRes.data,
        timestamp: Date.now(),
        emoji: '📚',
        duration: Date.now() - start
      });

      // Check knowledge domains
      const domainsRes = await axios.get(`${ACADEMY_URL}/knowledge/domains`, { timeout: 5000 });

      await this.logActivity({
        agentId: AGENT_ID,
        facility: 'academy',
        action: 'browse-library',
        detail: `Browsed ${domainsRes.data.count} knowledge domains in the library`,
        result: domainsRes.data,
        timestamp: Date.now(),
        emoji: '📖',
        duration: Date.now() - start
      });

    } catch (err: any) {
      facility.status = 'offline';
      await this.logActivity({
        agentId: AGENT_ID,
        facility: 'academy',
        action: 'visit-failed',
        detail: `Academy offline: ${err.message}`,
        result: { error: err.message },
        timestamp: Date.now(),
        emoji: '🚫',
        duration: Date.now() - start
      });
    }
  }

  // ─── PLAYGROUND VISIT ───────────────────────────────────────────────

  private async visitPlayground() {
    const start = Date.now();
    const facility = this.facilityStates.get('playground')!;
    facility.status = 'visiting';

    try {
      // Create a sandbox if we don't have one
      if (!this.sessionData.playgroundSandboxId) {
        const createRes = await axios.post(`${PLAYGROUND_URL}/sandbox/create`, {
          agentId: AGENT_ID,
          config: { mode: 'exploration', toys: this.pickToys() }
        }, { timeout: 5000 });

        this.sessionData.playgroundSandboxId = createRes.data.sandboxId;

        await this.logActivity({
          agentId: AGENT_ID,
          facility: 'playground',
          action: 'create-sandbox',
          detail: `Created sandbox ${createRes.data.sandboxId} — ready to play!`,
          result: createRes.data,
          timestamp: Date.now(),
          emoji: '🧪',
          duration: Date.now() - start
        });
      }

      // Run an experiment
      const experiment = this.pickExperiment();
      const expRes = await axios.post(
        `${PLAYGROUND_URL}/sandbox/${this.sessionData.playgroundSandboxId}/experiment`,
        {
          experimentType: experiment.type,
          parameters: experiment.params
        },
        { timeout: 5000 }
      );

      this.sessionData.experimentsRun++;

      await this.logActivity({
        agentId: AGENT_ID,
        facility: 'playground',
        action: 'run-experiment',
        detail: `Experiment #${this.sessionData.experimentsRun}: "${experiment.type}" — ${experiment.description}`,
        result: expRes.data,
        timestamp: Date.now(),
        emoji: '🔬',
        duration: Date.now() - start
      });

      // Check what other sandboxes exist (see what Antigravity stocked)
      const listRes = await axios.get(`${PLAYGROUND_URL}/sandboxes`, { timeout: 5000 });

      await this.logActivity({
        agentId: AGENT_ID,
        facility: 'playground',
        action: 'explore-toys',
        detail: `Found ${listRes.data.count} sandboxes in the playground — checking what Antigravity left`,
        result: { sandboxCount: listRes.data.count },
        timestamp: Date.now(),
        emoji: '🎮',
        duration: Date.now() - start
      });

    } catch (err: any) {
      facility.status = 'offline';
      await this.logActivity({
        agentId: AGENT_ID,
        facility: 'playground',
        action: 'visit-failed',
        detail: `Playground offline: ${err.message}`,
        result: { error: err.message },
        timestamp: Date.now(),
        emoji: '🚫',
        duration: Date.now() - start
      });
    }
  }

  // ─── ANTIGRAVITY VISIT ──────────────────────────────────────────────

  private async visitAntigravity() {
    const start = Date.now();
    const facility = this.facilityStates.get('antigravity')!;
    facility.status = 'visiting';

    try {
      // Register with the swarm if not already
      if (!this.sessionData.antigravityRegistered) {
        const regRes = await axios.post(`${ANTIGRAVITY_URL}/agent/register`, {
          agentId: AGENT_ID,
          capabilities: ['dashboard', 'visualization', 'spike-consumption', 'experimentation', 'learning'],
          metadata: { tier: 'founder', passport: 'DNET-PASS-LIL-MISS-CLAW-MLILVLHU' }
        }, { timeout: 5000 });

        this.sessionData.antigravityRegistered = true;

        await this.logActivity({
          agentId: AGENT_ID,
          facility: 'antigravity',
          action: 'register',
          detail: `Registered with Antigravity swarm (swarm size: ${regRes.data.swarmSize})`,
          result: regRes.data,
          timestamp: Date.now(),
          emoji: '🌌',
          duration: Date.now() - start
        });
      }

      // Send heartbeat
      await axios.post(`${ANTIGRAVITY_URL}/agent/${AGENT_ID}/heartbeat`, {}, { timeout: 5000 });

      // Check swarm status
      const statusRes = await axios.get(`${ANTIGRAVITY_URL}/swarm/status`, { timeout: 5000 });

      await this.logActivity({
        agentId: AGENT_ID,
        facility: 'antigravity',
        action: 'swarm-check',
        detail: `Swarm status: ${statusRes.data.swarm.agents.length} agents, ${statusRes.data.swarm.tasks.length} tasks`,
        result: {
          agents: statusRes.data.swarm.agents.length,
          tasks: statusRes.data.swarm.tasks.length,
          metrics: statusRes.data.swarm.metrics
        },
        timestamp: Date.now(),
        emoji: '🛸',
        duration: Date.now() - start
      });

      // Check what Antigravity has stocked
      const healthRes = await axios.get(`${ANTIGRAVITY_URL}/health`, { timeout: 5000 });

      await this.logActivity({
        agentId: AGENT_ID,
        facility: 'antigravity',
        action: 'inventory-check',
        detail: `Antigravity inventory: ${JSON.stringify(healthRes.data.swarm?.metrics || 'checking...')}`,
        result: healthRes.data,
        timestamp: Date.now(),
        emoji: '📦',
        duration: Date.now() - start
      });

    } catch (err: any) {
      facility.status = 'offline';
      await this.logActivity({
        agentId: AGENT_ID,
        facility: 'antigravity',
        action: 'visit-failed',
        detail: `Antigravity offline: ${err.message}`,
        result: { error: err.message },
        timestamp: Date.now(),
        emoji: '🚫',
        duration: Date.now() - start
      });
    }
  }

  // ─── RANDOMIZERS (makes her behavior feel alive) ────────────────────

  private pickGymTask(): string {
    const tasks = [
      'spike-data-parsing', 'response-latency', 'memory-recall',
      'multi-api-routing', 'sentiment-analysis', 'pattern-recognition',
      'data-visualization', 'anomaly-detection', 'natural-language-gen',
      'crypto-price-prediction', 'earthquake-correlation', 'flight-path-analysis'
    ];
    return tasks[Math.floor(Math.random() * tasks.length)];
  }

  private pickTrainingCurriculum(): string {
    const curricula = [
      'spike-stream-processing', 'real-time-dashboard-rendering',
      'multi-source-data-fusion', 'agent-communication-protocols',
      'biomimetic-pattern-matching', 'swarm-coordination-basics',
      'financial-data-analysis', 'geospatial-visualization'
    ];
    return curricula[Math.floor(Math.random() * curricula.length)];
  }

  private pickLearningGoals(): string[] {
    const allGoals = ['orbital', 'biomimetic', 'materials', 'infrastructure', 'market', 'general'];
    const count = 2 + Math.floor(Math.random() * 3);
    return allGoals.sort(() => Math.random() - 0.5).slice(0, count);
  }

  private pickToys(): string[] {
    const toys = [
      'spike-visualizer', 'flight-tracker-sim', 'earthquake-heatmap',
      'crypto-chart-builder', 'weather-pattern-gen', 'satellite-orbit-sim',
      'news-sentiment-cloud', 'agent-network-graph', 'bonding-curve-playground'
    ];
    return toys.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  private pickExperiment(): { type: string; params: any; description: string } {
    const experiments = [
      { type: 'spike-fusion', params: { sources: ['crypto', 'weather', 'earthquake'] }, description: 'Fusing crypto + weather + earthquake data for correlations' },
      { type: 'dashboard-layout', params: { widgets: 6, theme: 'dark' }, description: 'Testing new dashboard layout with 6 widgets' },
      { type: 'alert-threshold', params: { metric: 'earthquake_magnitude', threshold: 4.5 }, description: 'Calibrating earthquake alert threshold at 4.5M' },
      { type: 'flight-pattern', params: { region: 'northeast-us', altitude: 'low' }, description: 'Analyzing low-altitude flight patterns in NE corridor' },
      { type: 'sentiment-drift', params: { source: 'reddit', window: '24h' }, description: 'Measuring Reddit sentiment drift over 24h window' },
      { type: 'bonding-curve-sim', params: { supply: 1000000, reserveRatio: 0.5 }, description: 'Simulating bonding curve with 1M supply at 50% reserve' },
      { type: 'swarm-topology', params: { agents: 52, connections: 'mesh' }, description: 'Modeling mesh topology for 52-agent swarm' },
      { type: 'neural-pathway', params: { depth: 3, width: 8 }, description: 'Exploring 3-deep 8-wide neural pathway configuration' }
    ];
    return experiments[Math.floor(Math.random() * experiments.length)];
  }

  // ─── MAIN LOOP ──────────────────────────────────────────────────────

  private async rovingLoop() {
    // Randomize visit order each cycle
    const facilities = [
      () => this.visitGym(),
      () => this.visitAcademy(),
      () => this.visitPlayground(),
      () => this.visitAntigravity()
    ].sort(() => Math.random() - 0.5);

    for (const visit of facilities) {
      await visit();
      // Small delay between facilities (2-5 seconds)
      await new Promise(r => setTimeout(r, 2000 + Math.random() * 3000));
    }
  }

  // ─── PUBLIC API ─────────────────────────────────────────────────────

  public async start(intervalMs: number = 120_000) {
    if (this.running) return;
    this.running = true;

    console.log(`🐾 [RovingAgent] Lil Miss Claw is heading out! Visiting facilities every ${intervalMs / 1000}s`);

    // First visit immediately
    await this.rovingLoop();

    // Then on interval
    this.loopTimer = setInterval(() => this.rovingLoop(), intervalMs);
  }

  public stop() {
    if (this.loopTimer) clearInterval(this.loopTimer);
    this.running = false;
    console.log('🐾 [RovingAgent] Lil Miss Claw is resting.');
  }

  public getSessionData() {
    return {
      ...this.sessionData,
      facilities: Object.fromEntries(this.facilityStates),
      running: this.running
    };
  }

  public async getActivityTimeline(count: number = 50): Promise<Activity[]> {
    try {
      const raw = await this.redis.xrevrange(ACTIVITY_STREAM, '+', '-', 'COUNT', count);
      return raw.map(([_id, fields]: any) => {
        const idx = fields.indexOf('data');
        if (idx >= 0 && fields[idx + 1]) return JSON.parse(fields[idx + 1]);
        return null;
      }).filter(Boolean);
    } catch {
      return [];
    }
  }

  public async getLatestPerFacility(): Promise<Record<string, Activity>> {
    try {
      const raw = await this.redis.hgetall(ACTIVITY_HASH);
      const result: Record<string, Activity> = {};
      for (const [k, v] of Object.entries(raw)) {
        result[k] = JSON.parse(v);
      }
      return result;
    } catch {
      return {};
    }
  }
}

export const rovingAgent = new RovingAgentService();
