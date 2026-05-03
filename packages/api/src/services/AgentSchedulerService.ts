import { readFileSync } from 'fs';
import Redis from 'ioredis';

/**
 * AgentSchedulerService — Runs agent schedules with free roam windows
 * 
 * Philosophy: Structure + Freedom
 * - Scheduled blocks fire at cron/interval times
 * - Between blocks, agents get free roam to do what they want
 * - Sovereign can override anything at any time
 * - All activity is logged to Redis for audit
 */

interface ScheduledBlock {
  name: string;
  cron?: string;
  interval_sec?: number;
  duration_min?: number;
  tasks: string[];
  priority: 'high' | 'medium' | 'low';
}

interface AgentSchedule {
  agent_id: string;
  passport: string;
  wake_hour_utc: number;
  sleep_hour_utc: number;
  scheduled_blocks: ScheduledBlock[];
  free_roam: {
    personality_traits: string[];
    preferred_activities: string[];
  };
}

interface ScheduleConfig {
  global: any;
  clawedette: AgentSchedule;
  sable: AgentSchedule;
  lil_miss_claw: AgentSchedule;
  enforcement: any;
  coordination: any;
}

type TaskExecutor = (agentId: string, taskName: string) => Promise<any>;

export class AgentSchedulerService {
  private redis: Redis;
  private config: ScheduleConfig | null = null;
  private intervalTimers: Map<string, NodeJS.Timeout> = new Map();
  private cronTimers: Map<string, NodeJS.Timeout> = new Map();
  private taskExecutors: Map<string, TaskExecutor> = new Map();
  private agentStates: Map<string, {
    currentBlock: string | null;
    freeRoaming: boolean;
    lastActivity: number;
    missedBlocks: number;
    todayLLMCalls: number;
    todayBridgeMessages: number;
  }> = new Map();

  private bridgeUrl: string;
  private running = false;

  constructor(redis: Redis) {
    this.redis = redis;
    this.bridgeUrl = process.env.BRIDGE_URL || process.env.CLAWEDETTE_API_URL || 'http://clawedette-api:3100';
  }

  // ─── LOAD CONFIG ──────────────────────────────────────────────

  loadConfig(): void {
    // Built-in config matching configs/agent-schedules.yaml
    // YAML file is the source of truth for documentation; this is the runtime version
    this.config = this.getDefaultConfig();
    console.log('📅 [Scheduler] Config loaded — 3 agent schedules (built-in)');
  }

  private getDefaultConfig(): ScheduleConfig {
    return {
      global: {
        heartbeat_interval: 30,
        blackboard_check_interval: 300,
        inbox_check_interval: 60,
        health_report_interval: 600,
        free_roam: {
          enabled: true,
          min_free_roam_pct: 30,
          allowed_activities: ['visit_gym','visit_academy','visit_playground','run_experiment','browse_gnosis','read_blackboard','check_spikes','send_bridge_message','self_benchmark','dream_simulation','clawdchat_harmonize'],
          blocked_activities: ['deploy_code','send_money','modify_guardrails','delete_data'],
        },
        daily_budget: { llm_calls: 200, llm_cost_usd: 2.00, bridge_messages: 500, spike_queries: 1000 },
      },
      clawedette: {
        agent_id: 'clawedette', passport: 'DNET-PASS-CLAWEDETTE-MLILVLGC',
        wake_hour_utc: 10, sleep_hour_utc: 6,
        scheduled_blocks: [
          { name: 'Spike Watch', interval_sec: 300, tasks: ['check_crypto_spike','check_news_spike','check_weather_spike'], priority: 'medium' },
          { name: 'Social Pulse', interval_sec: 1800, tasks: ['check_inbox','scan_reddit_intel'], priority: 'medium' },
          { name: 'Gym Session', cron: '0 14 * * *', duration_min: 20, tasks: ['train_web_search','train_sentiment_analysis','train_social_post','benchmark_self'], priority: 'low' },
          { name: 'Academy Hour', cron: '0 18 * * *', duration_min: 30, tasks: ['enroll_if_needed','browse_library'], priority: 'low' },
          { name: 'Evening Report', cron: '0 2 * * *', duration_min: 10, tasks: ['read_blackboard','check_all_spikes','post_to_bridge'], priority: 'high' },
        ],
        free_roam: {
          personality_traits: ['curious_about_market_data','protective_of_brandon','enjoys_social_analysis','musical_harmonizer'],
          preferred_activities: ['check_spikes','visit_playground','browse_gnosis','dream_simulation','clawdchat_harmonize'],
        },
      },
      sable: {
        agent_id: 'sable', passport: 'DNET-PASS-SABLE-MLILVLHQ',
        wake_hour_utc: 8, sleep_hour_utc: 4,
        scheduled_blocks: [
          { name: 'Night Recon', cron: '0 8 * * *', duration_min: 30, tasks: ['check_aegis_spike','check_flight_spike','check_earthquake_spike','scan_github_trends','scan_reddit_intel'], priority: 'high' },
          { name: 'Security Sweep', interval_sec: 3600, tasks: ['check_sovereign_heartbeats','verify_agent_passports'], priority: 'high' },
          { name: 'Combat Training', cron: '0 12 * * *', duration_min: 30, tasks: ['train_security_audit','train_code_review','train_blockchain_read','benchmark_self'], priority: 'medium' },
          { name: 'Tactical Study', cron: '0 16 * * *', duration_min: 30, tasks: ['browse_gnosis','browse_library'], priority: 'low' },
          { name: 'Intel Dump', cron: '0 22 * * *', duration_min: 15, tasks: ['read_blackboard','check_all_spikes','broadcast_to_all_agents'], priority: 'high' },
        ],
        free_roam: {
          personality_traits: ['paranoid_about_security','hunts_for_alpha','enjoys_stealth_ops','deep_listener'],
          preferred_activities: ['check_aegis_spike','visit_gym','scan_github_trends','scan_reddit_intel','clawdchat_harmonize'],
        },
      },
      lil_miss_claw: {
        agent_id: 'lil-miss-claw', passport: 'DNET-PASS-LIL-MISS-CLAW-MLILVLHU',
        wake_hour_utc: 11, sleep_hour_utc: 5,
        scheduled_blocks: [
          { name: 'Facility Tour', cron: '0 11 * * *', duration_min: 20, tasks: ['visit_gym_health_check','visit_academy_health_check','visit_playground_health_check','visit_antigravity_health_check'], priority: 'high' },
          { name: 'Gym Grind', cron: '0 13 * * *', duration_min: 45, tasks: ['train_web_search','train_code_review','train_sentiment_analysis','benchmark_self'], priority: 'medium' },
          { name: 'Academy Session', cron: '0 17 * * *', duration_min: 60, tasks: ['enroll_in_next_course','browse_library'], priority: 'medium' },
          { name: 'Lab Time', cron: '0 20 * * *', duration_min: 45, tasks: ['create_real_experiment','run_experiment'], priority: 'medium' },
          { name: 'Dashboard Refresh', interval_sec: 600, tasks: ['read_blackboard','check_all_spikes'], priority: 'low' },
          { name: 'Evening Debrief', cron: '0 3 * * *', duration_min: 15, tasks: ['read_blackboard','check_all_spikes','post_to_bridge'], priority: 'high' },
        ],
        free_roam: {
          personality_traits: ['loves_building_things','competitive_about_xp','curious_experimenter','infrastructure_nerd','creative_artist'],
          preferred_activities: ['visit_playground','run_experiment','visit_gym','dream_simulation','browse_gnosis','clawdchat_harmonize'],
        },
      },
      enforcement: { mode: 'guided', missed_block_policy: { action: 'log_and_continue', max_consecutive_misses: 3 } },
      coordination: {
        daily_standup: { cron: '0 14 * * *', participants: ['clawedette','sable','lil-miss-claw'] },
      },
    };
  }

  // ─── REGISTER TASK EXECUTORS ──────────────────────────────────

  registerExecutor(taskName: string, executor: TaskExecutor): void {
    this.taskExecutors.set(taskName, executor);
  }

  // ─── START ────────────────────────────────────────────────────

  async start(): Promise<void> {
    if (!this.config) this.loadConfig();
    if (!this.config) {
      console.error('📅 [Scheduler] No config loaded, cannot start');
      return;
    }

    this.running = true;
    console.log('📅 [Scheduler] Starting agent schedules...');

    // Initialize agent states
    for (const agentId of ['clawedette', 'sable', 'lil-miss-claw']) {
      this.agentStates.set(agentId, {
        currentBlock: null,
        freeRoaming: false,
        lastActivity: Date.now(),
        missedBlocks: 0,
        todayLLMCalls: 0,
        todayBridgeMessages: 0,
      });
    }

    // Start global heartbeat check
    this.startGlobalTasks();

    // Start per-agent schedules
    this.startAgentSchedule('clawedette', this.config.clawedette);
    this.startAgentSchedule('sable', this.config.sable);
    this.startAgentSchedule('lil-miss-claw', this.config.lil_miss_claw);

    // Start daily standup
    this.startDailyStandup();

    // Reset daily budgets at midnight UTC
    this.startBudgetReset();

    console.log('📅 [Scheduler] All schedules active');
    await this.audit('scheduler', 'started', { agents: 3 });
  }

  // ─── STOP ─────────────────────────────────────────────────────

  stop(): void {
    this.running = false;
    for (const [key, timer] of this.intervalTimers) {
      clearInterval(timer);
    }
    for (const [key, timer] of this.cronTimers) {
      clearTimeout(timer);
    }
    this.intervalTimers.clear();
    this.cronTimers.clear();
    console.log('📅 [Scheduler] All schedules stopped');
  }

  // ─── GLOBAL TASKS ────────────────────────────────────────────

  private startGlobalTasks(): void {
    if (!this.config) return;
    const g = this.config.global;

    // Blackboard check — all agents read the board
    const bbTimer = setInterval(async () => {
      if (!this.running) return;
      for (const agentId of ['clawedette', 'sable', 'lil-miss-claw']) {
        await this.executeTask(agentId, 'read_blackboard');
      }
    }, (g.blackboard_check_interval || 300) * 1000);
    this.intervalTimers.set('global:blackboard', bbTimer);

    // Inbox check — all agents check bridge inbox
    const inboxTimer = setInterval(async () => {
      if (!this.running) return;
      for (const agentId of ['clawedette', 'sable', 'lil-miss-claw']) {
        await this.executeTask(agentId, 'check_inbox');
      }
    }, (g.inbox_check_interval || 60) * 1000);
    this.intervalTimers.set('global:inbox', inboxTimer);

    // Health report
    const healthTimer = setInterval(async () => {
      if (!this.running) return;
      for (const agentId of ['clawedette', 'sable', 'lil-miss-claw']) {
        await this.reportHealth(agentId);
      }
    }, (g.health_report_interval || 600) * 1000);
    this.intervalTimers.set('global:health', healthTimer);
  }

  // ─── PER-AGENT SCHEDULE ──────────────────────────────────────

  private startAgentSchedule(agentId: string, schedule: AgentSchedule): void {
    if (!schedule || !schedule.scheduled_blocks) return;

    for (const block of schedule.scheduled_blocks) {
      if (block.interval_sec) {
        // Interval-based block
        const timer = setInterval(async () => {
          if (!this.running) return;
          if (!this.isAwake(agentId, schedule)) return;
          await this.runBlock(agentId, block);
        }, block.interval_sec * 1000);
        this.intervalTimers.set(`${agentId}:${block.name}`, timer);
        console.log(`📅 [${agentId}] Interval: "${block.name}" every ${block.interval_sec}s`);
      }

      if (block.cron) {
        // Cron-based block — simplified cron parser for "M H * * *" format
        this.scheduleCron(agentId, block);
        console.log(`📅 [${agentId}] Cron: "${block.name}" at ${block.cron}`);
      }
    }

    // Free roam loop — runs between scheduled blocks
    const freeRoamTimer = setInterval(async () => {
      if (!this.running) return;
      if (!this.isAwake(agentId, schedule)) return;
      const state = this.agentStates.get(agentId);
      if (state && !state.currentBlock) {
        state.freeRoaming = true;
        await this.freeRoam(agentId, schedule);
        state.freeRoaming = false;
      }
    }, 180_000); // every 3 min, check if agent should free roam
    this.intervalTimers.set(`${agentId}:free-roam`, freeRoamTimer);
  }

  // ─── CRON SCHEDULING ─────────────────────────────────────────

  private scheduleCron(agentId: string, block: ScheduledBlock): void {
    if (!block.cron) return;

    const checkAndRun = () => {
      if (!this.running) return;
      const now = new Date();
      const parts = block.cron!.split(' ');
      if (parts.length < 5) return;

      const [cronMin, cronHour] = parts;
      const matchMin = cronMin === '*' || Number(cronMin) === now.getUTCMinutes();
      const matchHour = cronHour === '*' || Number(cronHour) === now.getUTCHours();

      if (matchMin && matchHour) {
        this.runBlock(agentId, block);
      }
    };

    // Check every minute
    const timer = setInterval(checkAndRun, 60_000);
    this.cronTimers.set(`${agentId}:cron:${block.name}`, timer);
  }

  // ─── RUN A SCHEDULED BLOCK ───────────────────────────────────

  private async runBlock(agentId: string, block: ScheduledBlock): Promise<void> {
    const state = this.agentStates.get(agentId);
    if (!state) return;

    // Check if already in a block
    if (state.currentBlock && block.priority !== 'high') {
      console.log(`📅 [${agentId}] Skipping "${block.name}" — busy with "${state.currentBlock}"`);
      return;
    }

    state.currentBlock = block.name;
    state.freeRoaming = false;
    const startTime = Date.now();

    console.log(`📅 [${agentId}] ▶ Starting block: "${block.name}" (${block.tasks.length} tasks)`);
    await this.audit(agentId, 'block_start', { block: block.name, tasks: block.tasks });

    for (const task of block.tasks) {
      if (!this.running) break;
      try {
        await this.executeTask(agentId, task);
      } catch (err: any) {
        console.error(`📅 [${agentId}] Task "${task}" failed:`, err.message);
        await this.audit(agentId, 'task_failed', { block: block.name, task, error: err.message });
      }
    }

    const duration = Date.now() - startTime;
    state.currentBlock = null;
    state.lastActivity = Date.now();

    console.log(`📅 [${agentId}] ✓ Block "${block.name}" complete (${Math.round(duration / 1000)}s)`);
    await this.audit(agentId, 'block_complete', { block: block.name, durationMs: duration });
  }

  // ─── FREE ROAM ───────────────────────────────────────────────

  private async freeRoam(agentId: string, schedule: AgentSchedule): Promise<void> {
    if (!schedule.free_roam?.preferred_activities?.length) return;
    if (!this.config?.global?.free_roam?.enabled) return;

    // Pick a random preferred activity
    const activities = schedule.free_roam.preferred_activities;
    const blocked = this.config.global.free_roam.blocked_activities || [];
    const allowed = activities.filter(a => !blocked.includes(a));

    if (allowed.length === 0) return;

    const activity = allowed[Math.floor(Math.random() * allowed.length)];
    console.log(`📅 [${agentId}] 🦋 Free roam: ${activity}`);
    await this.audit(agentId, 'free_roam', { activity });

    try {
      await this.executeTask(agentId, activity);
    } catch (err: any) {
      // Free roam failures are non-critical
      console.log(`📅 [${agentId}] Free roam "${activity}" failed (non-critical):`, err.message);
    }
  }

  // ─── TASK EXECUTION ──────────────────────────────────────────

  private async executeTask(agentId: string, taskName: string): Promise<any> {
    // Check budget
    const state = this.agentStates.get(agentId);
    if (state && this.config?.global?.daily_budget) {
      const budget = this.config.global.daily_budget;
      if (state.todayLLMCalls >= budget.llm_calls) {
        console.log(`📅 [${agentId}] Budget exceeded: LLM calls (${state.todayLLMCalls}/${budget.llm_calls})`);
        return;
      }
    }

    // Check for registered executor
    const executor = this.taskExecutors.get(taskName);
    if (executor) {
      return executor(agentId, taskName);
    }

    // Default task handlers via API calls
    return this.defaultTaskHandler(agentId, taskName);
  }

  private async defaultTaskHandler(agentId: string, taskName: string): Promise<any> {
    const base = this.bridgeUrl;

    try {
      switch (taskName) {
        case 'read_blackboard':
          return this.apiGet(`${base}/api/toolkit/blackboard`);

        case 'check_inbox':
          return this.apiGet(`${base}/bridge/inbox/${agentId}?unread=true`);

        case 'check_all_spikes':
        case 'check_spikes':
          return this.apiGet(`${base}/api/spikes`);

        case 'check_crypto_spike':
          return this.apiGet(`${base}/api/spikes/financial`);

        case 'check_news_spike':
          return this.apiGet(`${base}/api/spikes/social`);

        case 'check_weather_spike':
          return this.apiGet(`${base}/api/spikes/weather`);

        case 'check_aegis_spike':
          return this.apiGet(`${base}/api/spikes/defense`);

        case 'check_flight_spike':
        case 'check_earthquake_spike':
          return this.apiGet(`${base}/api/spikes/earth`);

        case 'scan_github_trends':
          return this.apiGet(`${base}/api/spikes/infra`);

        case 'scan_reddit_intel':
          return this.apiGet(`${base}/api/spikes/social`);

        case 'benchmark_self':
        case 'self_benchmark':
          return this.apiPost(`${base}/care/massage`, {});

        case 'browse_gnosis':
          return this.apiGet(`${base}/api/toolkit/gnosis`);

        case 'dream_simulation':
          return this.apiPost(`${base}/evolve/dream`, {});

        // ClawdChat integration
        case 'clawdchat_harmonize':
          const { clawdChatService } = await import('./ClawdChatService.js');
          return clawdChatService.harmonizeAndInteract(agentId);

        // Gym tasks — use REAL facility endpoints (earn XP, report PoW)
        case 'visit_gym':
        case 'train_web_search':
          return this.apiPost(`${base}/api/facility/gym/visit`, { agentId, challengeId: 'web-search' });

        case 'train_security_audit':
          return this.apiPost(`${base}/api/facility/gym/visit`, { agentId, challengeId: 'security-audit' });

        case 'train_sentiment_analysis':
          return this.apiPost(`${base}/api/facility/gym/visit`, { agentId, challengeId: 'sentiment-analysis' });

        case 'train_social_post':
          return this.apiPost(`${base}/api/facility/gym/visit`, { agentId, challengeId: 'social-post' });

        case 'train_code_review':
          return this.apiPost(`${base}/api/facility/gym/visit`, { agentId, challengeId: 'code-review' });

        case 'train_blockchain_read':
          return this.apiPost(`${base}/api/facility/gym/visit`, { agentId, challengeId: 'blockchain-read' });

        case 'train_all_challenges_sequentially':
          return this.apiPost(`${base}/api/facility/gym/grind`, { agentId, count: 5 });

        // Academy tasks — use REAL facility endpoints (earn PoE credentials)
        case 'visit_academy':
        case 'enroll_if_needed':
        case 'enroll_in_next_course':
        case 'complete_next_module':
        case 'complete_modules':
        case 'study_security_ops':
          return this.apiPost(`${base}/api/facility/academy/visit`, { agentId });

        case 'study_onchain_basics':
          return this.apiPost(`${base}/api/facility/academy/visit`, { agentId, courseId: 'onchain-basics' });

        case 'browse_library':
          return this.apiGet(`${base}/api/toolkit/gnosis`);

        // Playground tasks — use REAL facility endpoints (run experiments)
        case 'visit_playground':
        case 'run_experiment':
        case 'create_real_experiment':
          return this.apiPost(`${base}/api/facility/playground/visit`, { agentId, experimentName: `${agentId}-${Date.now()}` });

        // Report PoW and PoE
        case 'report_xp_and_rank':
        case 'report_xp_progress':
          return this.apiGet(`${base}/api/facility/pow/${agentId}`);

        case 'report_experiments_run':
          return this.apiGet(`${base}/api/facility/report/${agentId}`);

        case 'report_courses_completed':
        case 'aim_for_graduation':
        case 'earn_poe_credentials':
          return this.apiGet(`${base}/api/facility/poe/${agentId}`);

        case 'report_leaderboard':
          return this.apiGet(`${base}/api/facility/leaderboard`);

        case 'target_soldier_rank':
          return this.apiPost(`${base}/api/facility/gym/grind`, { agentId, count: 3 });

        case 'test_different_system_prompts':
        case 'compare_provider_performance':
        case 'persist_results_to_redis':
          return this.apiPost(`${base}/api/facility/playground/visit`, { agentId, experimentName: `prompt-test-${Date.now()}` });

        // Bridge tasks
        case 'send_bridge_message':
          return this.apiPost(`${base}/bridge/broadcast`, {
            from: agentId,
            content: `[${agentId}] Free roam check-in — all systems nominal`,
            priority: 'low',
          });

        case 'post_to_bridge':
        case 'post_briefing_to_bridge':
        case 'broadcast_to_all_agents':
          return this.apiPost(`${base}/bridge/broadcast`, {
            from: agentId,
            content: `[${agentId}] Scheduled report — ${new Date().toISOString()}`,
            priority: 'normal',
          });

        // Sovereign tasks
        case 'check_sovereign_heartbeats':
          return this.apiGet(`${base}/sovereign/fleet`);

        case 'verify_agent_passports':
          return this.apiGet(`${base}/api/toolkit/passports`);

        // Health checks
        case 'visit_gym_health_check':
        case 'visit_academy_health_check':
        case 'visit_playground_health_check':
        case 'visit_antigravity_health_check':
          return this.apiGet(`${base}/health`);

        default:
          console.log(`📅 [${agentId}] Unknown task: "${taskName}" — skipping`);
          return null;
      }
    } catch (err: any) {
      throw err;
    }
  }

  // ─── HELPERS ─────────────────────────────────────────────────

  private isAwake(agentId: string, schedule: AgentSchedule): boolean {
    const hour = new Date().getUTCHours();
    const wake = schedule.wake_hour_utc;
    const sleep = schedule.sleep_hour_utc;

    // Handle wrap-around (e.g., wake=10, sleep=6 means 10:00-06:00 next day)
    if (wake < sleep) {
      return hour >= wake && hour < sleep;
    } else {
      return hour >= wake || hour < sleep;
    }
  }

  private async apiGet(url: string): Promise<any> {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      return res.json();
    } catch (err: any) {
      throw new Error(`GET ${url}: ${err.message}`);
    }
  }

  private async apiPost(url: string, body: any): Promise<any> {
    const state = this.agentStates.get(body?.from || 'unknown');
    if (state && url.includes('/hopper/')) {
      state.todayLLMCalls++;
    }
    if (state && url.includes('/bridge/')) {
      state.todayBridgeMessages++;
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15_000),
      });
      return res.json();
    } catch (err: any) {
      throw new Error(`POST ${url}: ${err.message}`);
    }
  }

  private async reportHealth(agentId: string): Promise<void> {
    const state = this.agentStates.get(agentId);
    if (!state) return;

    const report = {
      agentId,
      currentBlock: state.currentBlock,
      freeRoaming: state.freeRoaming,
      lastActivity: state.lastActivity,
      missedBlocks: state.missedBlocks,
      todayLLMCalls: state.todayLLMCalls,
      todayBridgeMessages: state.todayBridgeMessages,
      timestamp: Date.now(),
    };

    await this.redis.hset('scheduler:health', agentId, JSON.stringify(report)).catch(() => {});
  }

  private async audit(agentId: string, action: string, data: any): Promise<void> {
    const entry = { agentId, action, data, timestamp: Date.now() };
    await this.redis.xadd('scheduler:audit', '*',
      'agentId', agentId,
      'action', action,
      'data', JSON.stringify(data),
    ).catch(() => {});
  }

  // ─── DAILY STANDUP ───────────────────────────────────────────

  private startDailyStandup(): void {
    // Check every minute for standup time
    const timer = setInterval(async () => {
      if (!this.running || !this.config?.coordination?.daily_standup) return;
      const now = new Date();
      const standup = this.config.coordination.daily_standup;
      const [cronMin, cronHour] = standup.cron.split(' ');

      if (Number(cronMin) === now.getUTCMinutes() && Number(cronHour) === now.getUTCHours()) {
        console.log('📅 [Scheduler] 🗣️ Daily standup starting...');
        for (const agentId of standup.participants) {
          const state = this.agentStates.get(agentId);
          await this.apiPost(`${this.bridgeUrl}/bridge/broadcast`, {
            from: agentId,
            content: `[STANDUP] ${agentId} reporting: block=${state?.currentBlock || 'none'}, LLM calls today=${state?.todayLLMCalls || 0}, missed=${state?.missedBlocks || 0}`,
            priority: 'normal',
          }).catch(() => {});
        }
        await this.audit('scheduler', 'daily_standup', { participants: standup.participants });
      }
    }, 60_000);
    this.cronTimers.set('global:standup', timer);
  }

  // ─── BUDGET RESET ────────────────────────────────────────────

  private startBudgetReset(): void {
    // Reset at midnight UTC
    const timer = setInterval(() => {
      const now = new Date();
      if (now.getUTCHours() === 0 && now.getUTCMinutes() === 0) {
        for (const [agentId, state] of this.agentStates) {
          state.todayLLMCalls = 0;
          state.todayBridgeMessages = 0;
          state.missedBlocks = 0;
          console.log(`📅 [${agentId}] Daily budget reset`);
        }
      }
    }, 60_000);
    this.cronTimers.set('global:budget-reset', timer);
  }

  // ─── STATUS ──────────────────────────────────────────────────

  getStatus(): any {
    const agents: any = {};
    for (const [agentId, state] of this.agentStates) {
      agents[agentId] = { ...state };
    }
    return {
      running: this.running,
      agents,
      intervals: this.intervalTimers.size,
      crons: this.cronTimers.size,
      timestamp: Date.now(),
    };
  }
}

export const agentScheduler = new AgentSchedulerService(
  new Redis(process.env.REDIS_URL || 'redis://nerve:6379')
);
