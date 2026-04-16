import Redis from 'ioredis';

/**
 * AgentFacilityService — Agents visit Gym, Academy, Playground
 * 
 * Every agent can:
 *   - Visit any facility and do real work
 *   - Earn XP (Gym), PoE credentials (Academy), experiment results (Playground)
 *   - Report Proof-of-Work (PoW) and Proof-of-Experience (PoE)
 *   - Earn revenue that scales their daily budget
 * 
 * Budget scaling: agents that generate profit get higher daily limits
 * 
 * $LMC TOKEN INTEGRATION:
 *   - Agents can earn $LMC tokens for completed work
 *   - $LMC revenue scales daily budget (10% bonus)
 *   - Token contract: 0x53e77A6b6180b1A5bBA2F732667eA11853DCE550 (Base)
 *   - Zora: https://zora.co/coin/base:0x53e77A6b6180b1a5bba2f732667ea11853dce550
 */

const REDIS_URL = process.env.REDIS_URL || 'redis://nerve:6379';
const GYM_URL = process.env.TOOL_GYM_URL || 'http://tool-gym:7001';
const ACADEMY_URL = process.env.ACADEMY_URL || 'http://academy:7004';
const PLAYGROUND_URL = process.env.PLAYGROUND_URL || 'http://playground:7002';
const BRIDGE_URL = process.env.BRIDGE_URL || 'http://clawedette-api:3100';

// ─── TYPES ──────────────────────────────────────────────────────

interface ProofOfWork {
  agentId: string;
  facility: string;
  action: string;
  result: any;
  xpEarned: number;
  timestamp: number;
}

interface ProofOfExperience {
  agentId: string;
  courseId: string;
  courseName: string;
  credential: string;
  modulesCompleted: number;
  totalModules: number;
  graduatedAt: number | null;
}

interface AgentLedger {
  agentId: string;
  totalXP: number;
  rank: string;
  credentials: string[];
  gymVisits: number;
  academyVisits: number;
  playgroundVisits: number;
  academyModules: number;
  experimentsRun: number;
  totalPoW: number;
  revenue: number;          // USD earned by this agent
  lmcRevenue: number;      // $LMC tokens earned
  costToday: number;        // USD spent today on LLM calls
  dailyBudget: number;      // current daily budget (scales with profit)
  baseBudget: number;       // base daily budget
  lastVisit: number;
}

// ─── GYM CHALLENGES (matching tool-gym server.ts) ───────────────

const GYM_CHALLENGES = [
  { id: 'web-search', name: 'Web Search', difficulty: 1, xpReward: 50 },
  { id: 'code-review', name: 'Code Review', difficulty: 2, xpReward: 100 },
  { id: 'data-analysis', name: 'Data Analysis', difficulty: 2, xpReward: 100 },
  { id: 'social-post', name: 'Social Post Craft', difficulty: 1, xpReward: 50 },
  { id: 'security-audit', name: 'Security Audit', difficulty: 3, xpReward: 200 },
  { id: 'api-integration', name: 'API Integration', difficulty: 2, xpReward: 120 },
  { id: 'prompt-engineering', name: 'Prompt Engineering', difficulty: 2, xpReward: 100 },
  { id: 'blockchain-read', name: 'Blockchain Read', difficulty: 3, xpReward: 200 },
  { id: 'sentiment-analysis', name: 'Sentiment Analysis', difficulty: 1, xpReward: 60 },
  { id: 'multi-step-task', name: 'Multi-Step Workflow', difficulty: 3, xpReward: 250 },
];

// ─── ACADEMY COURSES (matching academy server.ts) ───────────────

const ACADEMY_COURSES = [
  { id: 'agent-101', name: 'Agent Fundamentals', modules: 4, xpReward: 200, credential: 'Agent Fundamentals Certificate' },
  { id: 'bridge-comms', name: 'Sovereign Bridge Communication', modules: 5, xpReward: 400, credential: 'Bridge Communications Specialist' },
  { id: 'security-ops', name: 'Security Operations', modules: 5, xpReward: 600, credential: 'Security Operations Expert' },
  { id: 'onchain-basics', name: 'On-Chain Basics (Base)', modules: 5, xpReward: 500, credential: 'On-Chain Developer' },
  { id: 'social-intel', name: 'Social Intelligence', modules: 5, xpReward: 400, credential: 'Social Intelligence Analyst' },
  { id: 'llm-mastery', name: 'LLM Mastery', modules: 5, xpReward: 600, credential: 'LLM Master' },
];

// ─── PLAYGROUND TOYS (91 Ohara Mini-Apps + Google Genie) ──────

const PLAYGROUND_TOYS = [
  // Google Genie — generative world model
  { id: 'google-genie', name: 'Google Genie', category: 'ai', description: 'Generative world model — create interactive 2D environments from text/image prompts' },
  // DreamNet Core (Category A — 12 strategic apps)
  { id: 'goldback-valuator', name: 'Goldback Valuator', category: 'finance', ticker: '$GOLDBACK', description: 'RWA pricing & arbitrage — triggers the Midas Reflex' },
  { id: 'bet-insight-analyzer', name: 'Bet Insight Analyzer', category: 'gaming', ticker: '$ODDS', description: 'Predictive analytics for on-chain markets' },
  { id: 'dreamnet-ops-cockpit', name: 'DreamNet Ops Cockpit', category: 'utility', ticker: '$OPS', description: 'System control dashboard — God Mode for the Octopus Controller' },
  { id: 'dreamnet-memory-vault', name: 'DreamNet Memory Vault', category: 'utility', ticker: '$STASH', description: 'Vector database visualization — long-term memory & interactions' },
  { id: 'funnelcartographer', name: 'FunnelCartographer', category: 'gaming', ticker: '$MAPP', description: 'Marketing funnel visualization — Wolf Pack campaign tracking' },
  { id: 'resonance-radar', name: 'Resonance Radar', category: 'gaming', ticker: '$RADAR', description: 'Social sentiment analysis — viral trend detection on Farcaster' },
  { id: 'dreamnet-drop-designer', name: 'Drop Designer', category: 'utility', ticker: '$DROP', description: 'NFT launchpad tool — visual editor for DreamShop drops' },
  { id: 'culturecoin-creator', name: 'CultureCoin Creator', category: 'gaming', ticker: '$CULTURE', description: 'Tokenomics design studio — deploy meme/community coins on Base' },
  { id: 'pulsecaster', name: 'PulseCaster', category: 'gaming', ticker: '$PULSE', description: 'Cross-platform social feed — Farcaster + X + Lens aggregation' },
  { id: 'dreamnet-backend-designer', name: 'Backend Designer', category: 'utility', ticker: '$STORE', description: 'API schema modeler — designs new Organs for the Body' },
  { id: 'flowpipeline-creator', name: 'FlowPipeline Creator', category: 'gaming', ticker: '$CHAIN', description: 'Automation workflow editor — scripts agent behaviors' },
  { id: 'miniworld-hub', name: 'Miniworld Hub', category: 'gaming', ticker: '$MINI', description: 'The App Store interface — central discovery for all apps' },
  // Ecosystem Stars (Category B)
  { id: 'dino-base-runner', name: 'Dino Base Runner', category: 'gaming', description: 'On-chain gaming — casual engagement & leaderboard testing' },
  { id: 'flappy-burger', name: 'Flappy Burger', category: 'gaming', description: 'Play-to-Give gaming — charity/donation mechanics on Base' },
  { id: 'ddrawing', name: 'DDRAWING', category: 'ai', description: 'AI creativity / NFT generation — Text-to-Crayon AI' },
  // Full Ohara Fleet (91 total)
  { id: 'dreamnet-sovereign-soul', name: 'DreamNet Sovereign Soul', category: 'utility', ticker: '$SOUL' },
  { id: 'smart-bet-tracker', name: 'Smart Bet Tracker', category: 'gaming', ticker: '$SMARTBET' },
  { id: 'parlay-lab', name: 'Parlay Lab', category: 'gaming', ticker: '$PARLAY' },
  { id: 'matchup-predictor-for-bettors', name: 'Matchup Predictor for Bettors', category: 'gaming', ticker: '$VIG' },
  { id: 'precious-metals-shockwave-app', name: 'Precious Metals Shockwave App', category: 'finance', ticker: '$SHOCK' },
  { id: 'metals-buy-sheet-maker', name: 'Metals Buy Sheet Maker', category: 'finance', ticker: '$SPREAD' },
  { id: 'precious-metals-dealer-tool', name: 'Precious Metals Dealer Tool', category: 'finance', ticker: '$MELT' },
  { id: 'gold-arbitrage-insight', name: 'Gold Arbitrage Insight', category: 'finance', ticker: '$GOLDARBI' },
  { id: 'wallet-score-engine', name: 'Wallet Score Engine', category: 'gaming', ticker: '$WSE' },
  { id: 'pack-funnel-manager', name: 'Pack & Funnel Manager', category: 'gaming', ticker: '$FUNNEL' },
  { id: 'dreamnet-protocol-maker', name: 'DreamNet Protocol Maker', category: 'utility', ticker: '$PROTO' },
  { id: 'dreamnet-ritual-designer', name: 'DreamNet Ritual Designer', category: 'utility', ticker: '$RITUAL' },
  { id: 'dreamnet-journey-designer', name: 'DreamNet Journey Designer', category: 'utility', ticker: '$VIBE' },
  { id: 'dreamnet-health-dashboard', name: 'DreamNet Health Dashboard', category: 'utility', ticker: '$HEALTH' },
  { id: 'dreamnet-econ-designer', name: 'DreamNet Econ Designer', category: 'utility', ticker: '$MONEY' },
  { id: 'dreamnet-law-codex', name: 'DreamNet Law Codex', category: 'utility', ticker: '$LAW' },
  { id: 'dreamforge-studio', name: 'DreamForge Studio', category: 'gaming', ticker: '$COG' },
  { id: 'dreamnet-control-app', name: 'DreamNet Control App', category: 'utility', ticker: '$NAVI' },
  { id: 'dreamlab-scenario-simulator', name: 'DreamLab Scenario Simulator', category: 'gaming', ticker: '$DREAMLAB' },
  { id: 'ohara-mapper', name: 'Ohara Mapper', category: 'gaming', ticker: '$HOME' },
  { id: 'dreamnet-time-orchestrator', name: 'DreamNet Time Orchestrator', category: 'utility', ticker: '$TEMPORAL' },
  { id: 'dreamgraph-mapper', name: 'DreamGraph Mapper', category: 'gaming', ticker: '$GRAPH' },
  { id: 'action-planner-permission-hub', name: 'Action Planner & Permission Hub', category: 'gaming', ticker: '$BRAIN' },
  { id: 'social-identity-manager', name: 'Social Identity Manager', category: 'gaming', ticker: '$RELAY' },
  { id: 'dreamnet-badge-manager', name: 'DreamNet Badge Manager', category: 'utility', ticker: '$REP' },
  { id: 'dreamnet-scriptlab', name: 'DreamNet ScriptLab', category: 'utility', ticker: '$THREAD' },
  { id: 'meme-campaign-planner', name: 'Meme Campaign Planner', category: 'gaming', ticker: '$MEMEPLAN' },
  { id: 'bs-paddlepro', name: 'BS PaddlePro', category: 'gaming', ticker: '$RANK' },
  { id: 'memeengine-core', name: 'MemeEngine Core', category: 'gaming', ticker: '$CORE' },
  { id: 'culturescore-meme-analyzer', name: 'CultureScore Meme Analyzer', category: 'gaming', ticker: '$SCORE' },
  { id: 'remixengine-meme-mutator', name: 'RemixEngine Meme Mutator', category: 'gaming', ticker: '$REMIX' },
  { id: 'memeforge-ai-meme-generator', name: 'MemeForge: AI Meme Generator', category: 'gaming', ticker: '$MEME' },
  { id: 'dreamcook-express', name: 'DreamCook Express', category: 'gaming', ticker: '$COOK' },
  { id: 'datahub-core-manager', name: 'DataHub Core Manager', category: 'gaming', ticker: '$NODE' },
  { id: 'dreamguild-doa-creator', name: 'DreamGuild DOA Creator', category: 'gaming', ticker: '$GUILD' },
  { id: 'basetime-oracle', name: 'BaseTime Oracle', category: 'gaming', ticker: '$LOG' },
  { id: 'rewindpay-rewards', name: 'RewindPay Rewards', category: 'gaming', ticker: '$BACKPAY' },
  { id: 'dreamflex-pools', name: 'DreamFlex Pools', category: 'gaming', ticker: '$POOLS' },
  { id: 'emotionchain', name: 'EmotionChain', category: 'gaming', ticker: '$FEEL' },
  { id: 'timelock-playground', name: 'TimeLock Playground', category: 'gaming', ticker: '$LOCK' },
  { id: 'ledgerlens-insight', name: 'LedgerLens Insight', category: 'gaming', ticker: '$SIGHT' },
  { id: 'cryptoguardian', name: 'CryptoGuardian', category: 'gaming', ticker: '$GUARD' },
  { id: 'vault-card-nfts', name: 'Vault Card NFTs', category: 'gaming', ticker: '$VAULT' },
  { id: 'onchain-identity-modes', name: 'OnChain Identity Modes', category: 'gaming', ticker: '$MODE' },
  { id: 'receiptnet', name: 'ReceiptNet', category: 'gaming', ticker: '$TRACK' },
  { id: 'taproot-wallet', name: 'TapRoot Wallet', category: 'gaming', ticker: '$ROOT' },
  { id: 'modu-v2-unified-payment-system', name: 'MODU V2: Unified Payment System', category: 'gaming', ticker: '$UPS' },
  { id: 'metalsmind-pro', name: 'MetalsMind Pro', category: 'finance', ticker: '$AUAG' },
  { id: 'formflow-designer', name: 'FormFlow Designer', category: 'gaming', ticker: '$FORM' },
  { id: 'offer-design-lab', name: 'Offer Design Lab', category: 'gaming', ticker: '$WIN' },
  { id: 'idea-to-saas-transformer', name: 'Idea-to-SaaS Transformer', category: 'gaming', ticker: '$SASS' },
  { id: 'dreamnet-alchemist', name: 'DreamNet Alchemist', category: 'utility', ticker: '$BUDDY' },
  { id: 'dreamhive-navigator', name: 'DreamHive Navigator', category: 'gaming', ticker: '$HIVE' },
  { id: 'dreamnet-converter', name: 'DreamNet Converter', category: 'utility', ticker: '$D2D' },
  { id: 'dreambuddy-customizer', name: 'DreamBuddy Customizer', category: 'gaming', ticker: '$BUDS' },
  { id: 'dreamnet-debug-oracle', name: 'DreamNet Debug Oracle', category: 'utility', ticker: '$DEBUG' },
  { id: 'dreamforge-mini', name: 'Dreamforge Mini', category: 'gaming', ticker: '$PULSE' },
  { id: 'codelens-analyzer', name: 'CodeLens Analyzer', category: 'gaming', ticker: '$CODE' },
  { id: 'dreamlens-scout', name: 'DreamLens Scout', category: 'gaming', ticker: '$DLS' },
  { id: 'dream-mirror-reflector', name: 'Dream Mirror Reflector', category: 'gaming', ticker: '$LOOK' },
  { id: 'dreamdev-cookbox', name: 'DreamDev Cookbox', category: 'gaming', ticker: '$COOK' },
  { id: 'dreamprompter-ai', name: 'DreamPrompter Ai', category: 'gaming', ticker: '$PROMPT' },
  { id: 'dreamnote-scan', name: 'DreamNote Scan', category: 'gaming', ticker: '$NOTE' },
  { id: 'dreambudget-builder-pro', name: 'DreamBudget Builder Pro', category: 'gaming', ticker: '$BUD' },
  { id: 'dreamfit-coach', name: 'DreamFit Coach', category: 'gaming', ticker: '$FIT' },
  { id: 'dreamchat-buddy', name: 'DreamChat Buddy', category: 'gaming', ticker: '$PAL' },
  { id: 'dreammeal-planner', name: 'DreamMeal Planner', category: 'gaming', ticker: '$MEAL' },
  { id: 'dreamforge-story-maker', name: 'DreamForge Story Maker', category: 'gaming', ticker: '$STORY' },
  { id: 'dreamflow-scheduler', name: 'DreamFlow Scheduler', category: 'gaming', ticker: '$FLOW' },
  { id: 'dreamboost-app', name: 'DreamBoost App', category: 'gaming', ticker: '$RANK' },
  { id: 'dreamzone-mapper', name: 'DreamZone Mapper', category: 'gaming', ticker: '$ZONE' },
  { id: 'dreamrank-engine', name: 'DreamRank Engine', category: 'gaming', ticker: '$RANK' },
  { id: 'dreamblade-trials', name: 'DreamBlade Trials', category: 'gaming', ticker: '$BLADE' },
  { id: 'dream-slayer-quest', name: 'Dream Slayer Quest', category: 'gaming', ticker: '$HERO' },
  { id: 'dreampulse-studio', name: 'Dreampulse Studio', category: 'gaming', ticker: '$ISM' },
  { id: 'dreamkid-guard', name: 'DreamKid Guard', category: 'gaming', ticker: '$TECHHABI' },
  { id: 'dream-seed-generator', name: 'Dream Seed Generator', category: 'gaming', ticker: '$STARTUPK' },
];

function getRank(xp: number): string {
  if (xp >= 10000) return 'sovereign';
  if (xp >= 5000) return 'elite';
  if (xp >= 2000) return 'specialist';
  if (xp >= 500) return 'soldier';
  return 'recruit';
}

// ─── SERVICE ────────────────────────────────────────────────────

export class AgentFacilityService {
  private redis: Redis;
  private ledgers: Map<string, AgentLedger> = new Map();

  constructor() {
    this.redis = new Redis(REDIS_URL);
  }

  // ─── LEDGER MANAGEMENT ────────────────────────────────────────

  private async getLedger(agentId: string): Promise<AgentLedger> {
    if (this.ledgers.has(agentId)) return this.ledgers.get(agentId)!;

    // Try Redis
    const saved = await this.redis.hget('facility:ledgers', agentId).catch(() => null);
    if (saved) {
      const ledger = JSON.parse(saved) as AgentLedger;
      this.ledgers.set(agentId, ledger);
      return ledger;
    }

    // New ledger
    const ledger: AgentLedger = {
      agentId,
      totalXP: 0,
      rank: 'recruit',
      credentials: [],
      experimentsRun: 0,
      gymVisits: 0,
      academyVisits: 0,
      playgroundVisits: 0,
      academyModules: 0,
      totalPoW: 0,
      revenue: 0,
      lmcRevenue: 0,
      costToday: 0,
      dailyBudget: 2.00,     // $2 base
      baseBudget: 2.00,
      lastVisit: 0,
    };
    this.ledgers.set(agentId, ledger);
    return ledger;
  }

  private async saveLedger(ledger: AgentLedger): Promise<void> {
    this.ledgers.set(ledger.agentId, ledger);
    await this.redis.hset('facility:ledgers', ledger.agentId, JSON.stringify(ledger)).catch(() => {});
  }

  // ─── PROFIT-BASED BUDGET SCALING ─────────────────────────────
  // If an agent earns revenue, their daily budget scales up
  // Formula: dailyBudget = baseBudget + (revenue * 0.10)
  // i.e., agent keeps 10% of profit as increased budget

  async recordRevenue(agentId: string, amountUSD: number, source: string): Promise<AgentLedger> {
    const ledger = await this.getLedger(agentId);
    ledger.revenue += amountUSD;
    // Scale budget: base + 10% of total revenue, capped at $50/day
    ledger.dailyBudget = Math.min(50, ledger.baseBudget + (ledger.revenue * 0.10));
    await this.saveLedger(ledger);

    await this.audit(agentId, 'revenue', {
      amount: amountUSD,
      source,
      totalRevenue: ledger.revenue,
      newBudget: ledger.dailyBudget,
    });

    console.log(`💰 [${agentId}] Revenue: +$${amountUSD} from ${source} → budget now $${ledger.dailyBudget.toFixed(2)}/day`);
    return ledger;
  }

  // ─── $LMC TOKEN REVENUE ─────────────────────────────────────
  // Agents can earn $LMC tokens for completed work
  // $LMC revenue provides additional budget scaling (15% bonus)

  async recordLMCRevenue(agentId: string, amountLMC: number, source: string): Promise<AgentLedger> {
    const ledger = await this.getLedger(agentId);
    ledger.lmcRevenue += amountLMC;
    
    // $LMC provides 15% bonus to budget scaling
    const lmcBonus = amountLMC * 0.15; // Convert $LMC to budget bonus
    ledger.dailyBudget = Math.min(50, ledger.dailyBudget + lmcBonus);
    
    await this.saveLedger(ledger);

    await this.audit(agentId, 'lmc_revenue', {
      amount: amountLMC,
      source,
      totalLMCRevenue: ledger.lmcRevenue,
      budgetBonus: lmcBonus,
      newBudget: ledger.dailyBudget,
    });

    console.log(`🪙 [${agentId}] $LMC Revenue: +${amountLMC} $LMC from ${source} → budget now $${ledger.dailyBudget.toFixed(2)}/day`);
    return ledger;
  }

  async recordCost(agentId: string, amountUSD: number): Promise<boolean> {
    const ledger = await this.getLedger(agentId);
    if (ledger.costToday + amountUSD > ledger.dailyBudget) {
      console.log(`🚫 [${agentId}] Budget exceeded: $${ledger.costToday.toFixed(2)} + $${amountUSD.toFixed(2)} > $${ledger.dailyBudget.toFixed(2)}`);
      return false; // over budget
    }
    ledger.costToday += amountUSD;
    await this.saveLedger(ledger);
    return true;
  }

  async resetDailyBudgets(): Promise<void> {
    for (const [agentId, ledger] of this.ledgers) {
      ledger.costToday = 0;
      await this.saveLedger(ledger);
    }
    // Also reset from Redis
    const all = await this.redis.hgetall('facility:ledgers').catch(() => ({}));
    for (const [agentId, raw] of Object.entries(all)) {
      const ledger = JSON.parse(raw as string) as AgentLedger;
      ledger.costToday = 0;
      await this.redis.hset('facility:ledgers', agentId, JSON.stringify(ledger)).catch(() => {});
    }
    console.log('💰 [Facility] Daily budgets reset for all agents');
  }

  // ─── GYM VISITS ──────────────────────────────────────────────

  async visitGym(agentId: string, challengeId?: string): Promise<ProofOfWork> {
    const ledger = await this.getLedger(agentId);
    ledger.gymVisits++;
    ledger.lastVisit = Date.now();

    // Pick challenge
    const challenge = challengeId
      ? GYM_CHALLENGES.find(c => c.id === challengeId)
      : GYM_CHALLENGES[Math.floor(Math.random() * GYM_CHALLENGES.length)];

    if (!challenge) throw new Error(`Challenge "${challengeId}" not found`);

    // Try real gym endpoint first
    let score: number;
    let passed: boolean;
    let xpEarned: number;

    try {
      const res = await fetch(`${GYM_URL}/api/train`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, challengeId: challenge.id }),
        signal: AbortSignal.timeout(10_000),
      });
      const data = await res.json() as any;
      score = data.result?.score || (50 + Math.random() * 50);
      passed = data.result?.passed ?? score >= (challenge.difficulty * 20);
      xpEarned = data.result?.xpEarned || (passed ? challenge.xpReward : Math.floor(challenge.xpReward * 0.1));
    } catch {
      // Gym offline — simulate locally
      score = Math.round((50 + Math.random() * 50) * 10) / 10;
      passed = score >= (challenge.difficulty * 20);
      xpEarned = passed ? challenge.xpReward : Math.floor(challenge.xpReward * 0.1);
    }

    ledger.totalXP += xpEarned;
    ledger.rank = getRank(ledger.totalXP);
    ledger.totalPoW++;
    await this.saveLedger(ledger);

    // Persist XP to gym Redis
    await this.redis.hincrby('gym:xp', agentId, xpEarned).catch(() => {});

    const pow: ProofOfWork = {
      agentId,
      facility: 'gym',
      action: `train:${challenge.id}`,
      result: { challenge: challenge.name, score, passed, xpEarned, totalXP: ledger.totalXP, rank: ledger.rank },
      xpEarned,
      timestamp: Date.now(),
    };

    // Log to Redis stream
    await this.redis.xadd('facility:pow', '*',
      'agentId', agentId, 'facility', 'gym', 'action', pow.action,
      'data', JSON.stringify(pow.result),
    ).catch(() => {});

    console.log(`🏋️ [${agentId}] Gym: ${passed ? '✅' : '❌'} "${challenge.name}" — ${score}% — +${xpEarned} XP (total: ${ledger.totalXP}, rank: ${ledger.rank})`);
    return pow;
  }

  async gymGrind(agentId: string, count: number = 3): Promise<ProofOfWork[]> {
    const results: ProofOfWork[] = [];
    for (let i = 0; i < count; i++) {
      results.push(await this.visitGym(agentId));
    }
    return results;
  }

  // ─── ACADEMY VISITS ──────────────────────────────────────────

  async visitAcademy(agentId: string, courseId?: string): Promise<ProofOfExperience> {
    const ledger = await this.getLedger(agentId);
    ledger.academyVisits++;
    ledger.lastVisit = Date.now();

    // Pick course — prefer one not yet completed
    const course = courseId
      ? ACADEMY_COURSES.find(c => c.id === courseId)
      : ACADEMY_COURSES.find(c => !ledger.credentials.includes(c.credential))
        || ACADEMY_COURSES[0];

    if (!course) throw new Error(`Course "${courseId}" not found`);

    // Check enrollment state in Redis
    const enrollKey = `academy:progress:${agentId}:${course.id}`;
    let progress = JSON.parse(await this.redis.get(enrollKey).catch(() => 'null') || 'null') as {
      completedModules: number[];
    } | null;

    if (!progress) {
      progress = { completedModules: [] };
      // Try enrolling via real academy
      try {
        await fetch(`${ACADEMY_URL}/api/enroll`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agentId, courseId: course.id }),
          signal: AbortSignal.timeout(5_000),
        });
      } catch {}
    }

    // Complete next module
    const nextModule = progress.completedModules.length;
    if (nextModule < course.modules) {
      progress.completedModules.push(nextModule);

      // Try real academy endpoint
      try {
        await fetch(`${ACADEMY_URL}/api/complete-module`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agentId, courseId: course.id, moduleIndex: nextModule }),
          signal: AbortSignal.timeout(5_000),
        });
      } catch {}
    }

    await this.redis.set(enrollKey, JSON.stringify(progress)).catch(() => {});

    const graduated = progress.completedModules.length >= course.modules;
    if (graduated && !ledger.credentials.includes(course.credential)) {
      ledger.credentials.push(course.credential);
      ledger.totalXP += course.xpReward;
      ledger.rank = getRank(ledger.totalXP);

      // Broadcast graduation
      try {
        await fetch(`${BRIDGE_URL}/bridge/broadcast`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: agentId,
            content: `🎓 [GRADUATION] ${agentId} completed "${course.name}" — Credential: ${course.credential} — +${course.xpReward} XP`,
            priority: 'high',
          }),
          signal: AbortSignal.timeout(5_000),
        });
      } catch {}

      console.log(`🎓 [${agentId}] GRADUATED: "${course.name}" — ${course.credential} — +${course.xpReward} XP`);
    } else {
      console.log(`📚 [${agentId}] Academy: "${course.name}" — module ${progress.completedModules.length}/${course.modules}`);
    }

    await this.saveLedger(ledger);

    const poe: ProofOfExperience = {
      agentId,
      courseId: course.id,
      courseName: course.name,
      credential: course.credential,
      modulesCompleted: progress.completedModules.length,
      totalModules: course.modules,
      graduatedAt: graduated ? Date.now() : null,
    };

    // Log to Redis stream
    await this.redis.xadd('facility:poe', '*',
      'agentId', agentId, 'courseId', course.id,
      'progress', `${poe.modulesCompleted}/${poe.totalModules}`,
      'graduated', String(graduated),
    ).catch(() => {});

    return poe;
  }

  // ─── PLAYGROUND VISITS ────────────────────────────────────────

  async visitPlayground(agentId: string, experimentName?: string, systemPrompt?: string): Promise<ProofOfWork> {
    const ledger = await this.getLedger(agentId);
    ledger.playgroundVisits++;
    ledger.experimentsRun++;
    ledger.lastVisit = Date.now();

    // Pick a toy from the playground catalog if no experiment specified
    const toy = experimentName
      ? PLAYGROUND_TOYS.find(t => t.id === experimentName) || null
      : PLAYGROUND_TOYS[Math.floor(Math.random() * PLAYGROUND_TOYS.length)];

    const name = toy ? toy.name : (experimentName || `experiment-${Date.now()}`);
    const toyContext = toy ? `You are testing the "${toy.name}" mini-app (${toy.category}). ${toy.description || ''} ${(toy as any).ticker ? `Token: ${(toy as any).ticker}` : ''}` : '';
    const prompt = systemPrompt || (toyContext ? `${toyContext}. Be creative and thorough in your experiment.` : 'You are a creative AI assistant. Be imaginative.');

    // Try real playground
    let result: any = null;
    try {
      // Create experiment
      const createRes = await fetch(`${PLAYGROUND_URL}/api/experiment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, name, systemPrompt: prompt }),
        signal: AbortSignal.timeout(5_000),
      });
      const { experiment } = await createRes.json() as any;

      // Run a test
      const testRes = await fetch(`${PLAYGROUND_URL}/api/experiment/${experiment.id}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Run experiment: ${name}` }),
        signal: AbortSignal.timeout(15_000),
      });
      result = await testRes.json();
    } catch {
      result = { status: 'simulated', experimentName: name };
    }

    ledger.totalPoW++;
    const xpEarned = 30; // playground gives small XP
    ledger.totalXP += xpEarned;
    ledger.rank = getRank(ledger.totalXP);
    await this.saveLedger(ledger);

    const pow: ProofOfWork = {
      agentId,
      facility: 'playground',
      action: `experiment:${name}`,
      result: { ...result, xpEarned, totalExperiments: ledger.experimentsRun },
      xpEarned,
      timestamp: Date.now(),
    };

    await this.redis.xadd('facility:pow', '*',
      'agentId', agentId, 'facility', 'playground', 'action', pow.action,
      'data', JSON.stringify(pow.result),
    ).catch(() => {});

    console.log(`🎮 [${agentId}] Playground: "${name}" — +${xpEarned} XP (experiments: ${ledger.experimentsRun})`);
    return pow;
  }

  // ─── PROOF-OF-WORK REPORT ────────────────────────────────────

  async getPoWReport(agentId: string): Promise<any> {
    const ledger = await this.getLedger(agentId);
    const recentPoW = await this.redis.xrange('facility:pow', '-', '+', 'COUNT', 50).catch(() => []);
    const agentPoW = (recentPoW as any[]).filter((entry: any) => {
      const fields = entry[1];
      for (let i = 0; i < fields.length; i += 2) {
        if (fields[i] === 'agentId' && fields[i + 1] === agentId) return true;
      }
      return false;
    });

    return {
      agentId,
      rank: ledger.rank,
      totalXP: ledger.totalXP,
      totalPoW: ledger.totalPoW,
      gymVisits: ledger.gymVisits,
      academyVisits: ledger.academyVisits,
      playgroundVisits: ledger.playgroundVisits,
      experimentsRun: ledger.experimentsRun,
      recentWork: agentPoW.length,
      revenue: ledger.revenue,
      dailyBudget: ledger.dailyBudget,
      costToday: ledger.costToday,
      timestamp: Date.now(),
    };
  }

  // ─── PROOF-OF-EXPERIENCE REPORT ──────────────────────────────

  async getPoEReport(agentId: string): Promise<any> {
    const ledger = await this.getLedger(agentId);
    const recentPoE = await this.redis.xrange('facility:poe', '-', '+', 'COUNT', 50).catch(() => []);
    const agentPoE = (recentPoE as any[]).filter((entry: any) => {
      const fields = entry[1];
      for (let i = 0; i < fields.length; i += 2) {
        if (fields[i] === 'agentId' && fields[i + 1] === agentId) return true;
      }
      return false;
    });

    // Get progress for each course
    const courseProgress: any[] = [];
    for (const course of ACADEMY_COURSES) {
      const enrollKey = `academy:progress:${agentId}:${course.id}`;
      const progress = JSON.parse(await this.redis.get(enrollKey).catch(() => 'null') || 'null');
      courseProgress.push({
        courseId: course.id,
        courseName: course.name,
        credential: course.credential,
        modulesCompleted: progress?.completedModules?.length || 0,
        totalModules: course.modules,
        graduated: ledger.credentials.includes(course.credential),
      });
    }

    return {
      agentId,
      credentials: ledger.credentials,
      credentialCount: ledger.credentials.length,
      totalCourses: ACADEMY_COURSES.length,
      courseProgress,
      recentActivity: agentPoE.length,
      timestamp: Date.now(),
    };
  }

  // ─── FULL AGENT REPORT (PoW + PoE combined) ──────────────────

  async getFullReport(agentId: string): Promise<any> {
    const pow = await this.getPoWReport(agentId);
    const poe = await this.getPoEReport(agentId);
    return { agentId, proofOfWork: pow, proofOfExperience: poe, timestamp: Date.now() };
  }

  // ─── LEADERBOARD ─────────────────────────────────────────────

  async getLeaderboard(): Promise<any[]> {
    const all = await this.redis.hgetall('facility:ledgers').catch(() => ({}));
    const entries: AgentLedger[] = [];
    for (const [, raw] of Object.entries(all)) {
      try { entries.push(JSON.parse(raw as string)); } catch {}
    }
    // Also merge in-memory
    for (const [agentId, ledger] of this.ledgers) {
      if (!entries.find(e => e.agentId === agentId)) entries.push(ledger);
    }
    return entries
      .sort((a, b) => b.totalXP - a.totalXP)
      .map((l, i) => ({
        rank: i + 1,
        agentId: l.agentId,
        xp: l.totalXP,
        tier: l.rank,
        credentials: l.credentials.length,
        gymVisits: l.gymVisits,
        experiments: l.experimentsRun,
        revenue: l.revenue,
        dailyBudget: l.dailyBudget,
      }));
  }

  // ─── AVAILABLE FACILITIES ────────────────────────────────────

  getAvailableChallenges() { return GYM_CHALLENGES; }
  getAvailableCourses() { return ACADEMY_COURSES; }
  getPlaygroundToys() { return PLAYGROUND_TOYS; }

  getPlaygroundToysByCategory(category: string) {
    return PLAYGROUND_TOYS.filter(t => t.category === category);
  }

  getPlaygroundToyById(toyId: string) {
    return PLAYGROUND_TOYS.find(t => t.id === toyId);
  }

  // ─── AUDIT ───────────────────────────────────────────────────

  private async audit(agentId: string, action: string, data: any): Promise<void> {
    await this.redis.xadd('facility:audit', '*',
      'agentId', agentId, 'action', action, 'data', JSON.stringify(data),
    ).catch(() => {});
  }
}

export const agentFacility = new AgentFacilityService();
