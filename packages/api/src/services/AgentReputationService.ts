import Redis from 'ioredis';

/**
 * AgentReputationService — Three-Tier Trust & Reputation System
 * 
 * From Vex Intel: "Three-tier economic architecture: utility, trust (reputation), outcome (revenue)"
 * 
 * Reputation is computed from:
 *   1. Task completion rate (utility tier)
 *   2. PoW/PoE accumulation (trust tier)
 *   3. Revenue generation (outcome tier)
 *   4. Peer endorsements from other agents
 *   5. Penalty events (failures, guardrail violations, budget overruns)
 * 
 * Score range: 0–1000 (stored as integer)
 * Tiers: Untrusted (0-199), Probation (200-399), Trusted (400-599), 
 *        Reliable (600-799), Sovereign (800-1000)
 */

const REDIS_URL = process.env.REDIS_URL || 'redis://nerve:6379';
const REP_PREFIX = 'reputation';

// ─── TYPES ──────────────────────────────────────────────────

interface ReputationProfile {
  agentId: string;
  score: number;
  tier: string;
  components: {
    taskCompletion: number;   // 0-200 pts
    powAccumulation: number;  // 0-200 pts
    poeAccumulation: number;  // 0-200 pts
    revenueGeneration: number; // 0-200 pts
    peerEndorsements: number; // 0-100 pts
    penalties: number;        // 0 to -100 pts (negative)
  };
  history: ReputationEvent[];
  endorsements: Endorsement[];
  lastUpdated: number;
  createdAt: number;
}

interface ReputationEvent {
  type: 'task_success' | 'task_failure' | 'pow_earned' | 'poe_earned' | 
        'revenue_earned' | 'endorsement' | 'penalty' | 'guardrail_violation' |
        'budget_overrun' | 'uptime_bonus';
  delta: number;
  source: string;
  timestamp: number;
  details?: string;
}

interface Endorsement {
  fromAgent: string;
  reason: string;
  weight: number; // 1-5
  timestamp: number;
}

// ─── TIER DEFINITIONS ───────────────────────────────────────

const TIERS = [
  { name: 'Untrusted',  min: 0,   max: 199, permissions: ['read'] },
  { name: 'Probation',  min: 200, max: 399, permissions: ['read', 'basic_tools'] },
  { name: 'Trusted',    min: 400, max: 599, permissions: ['read', 'basic_tools', 'api_calls', 'bridge_messages'] },
  { name: 'Reliable',   min: 600, max: 799, permissions: ['read', 'basic_tools', 'api_calls', 'bridge_messages', 'spending', 'autonomous_tasks'] },
  { name: 'Sovereign',  min: 800, max: 1000, permissions: ['read', 'basic_tools', 'api_calls', 'bridge_messages', 'spending', 'autonomous_tasks', 'spawn_agents', 'modify_config'] },
];

// ─── SCORING WEIGHTS ────────────────────────────────────────

const WEIGHTS = {
  task_success: 5,
  task_failure: -8,
  pow_earned: 3,
  poe_earned: 4,
  revenue_earned: 10,    // per $1 earned
  endorsement: 8,
  penalty: -15,
  guardrail_violation: -25,
  budget_overrun: -10,
  uptime_bonus: 2,       // per day of continuous uptime
};

// ─── SERVICE ────────────────────────────────────────────────

export class AgentReputationService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(REDIS_URL);
    console.log('⭐ [Reputation] Agent reputation system initialized');
  }

  // ─── PROFILE MANAGEMENT ─────────────────────────────────

  async getProfile(agentId: string): Promise<ReputationProfile> {
    const raw = await this.redis.get(`${REP_PREFIX}:${agentId}`).catch(() => null);
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }

    // Create default profile
    const profile: ReputationProfile = {
      agentId,
      score: 300, // Start at Probation tier
      tier: 'Probation',
      components: {
        taskCompletion: 60,
        powAccumulation: 60,
        poeAccumulation: 60,
        revenueGeneration: 0,
        peerEndorsements: 0,
        penalties: 0,
      },
      history: [],
      endorsements: [],
      lastUpdated: Date.now(),
      createdAt: Date.now(),
    };

    await this.saveProfile(profile);
    return profile;
  }

  private async saveProfile(profile: ReputationProfile): Promise<void> {
    profile.lastUpdated = Date.now();
    profile.score = this.computeScore(profile);
    profile.tier = this.getTierName(profile.score);
    await this.redis.set(`${REP_PREFIX}:${profile.agentId}`, JSON.stringify(profile)).catch(() => {});
    // Update sorted set for leaderboard
    await this.redis.zadd(`${REP_PREFIX}:leaderboard`, profile.score, profile.agentId).catch(() => {});
  }

  private computeScore(profile: ReputationProfile): number {
    const c = profile.components;
    const raw = c.taskCompletion + c.powAccumulation + c.poeAccumulation +
                c.revenueGeneration + c.peerEndorsements + c.penalties;
    return Math.max(0, Math.min(1000, Math.round(raw)));
  }

  private getTierName(score: number): string {
    const tier = TIERS.find(t => score >= t.min && score <= t.max);
    return tier ? tier.name : 'Untrusted';
  }

  // ─── EVENT RECORDING ────────────────────────────────────

  async recordEvent(agentId: string, type: ReputationEvent['type'], source: string, details?: string): Promise<ReputationProfile> {
    const profile = await this.getProfile(agentId);
    const delta = WEIGHTS[type] || 0;

    const event: ReputationEvent = {
      type,
      delta,
      source,
      timestamp: Date.now(),
      details,
    };

    // Apply to appropriate component
    switch (type) {
      case 'task_success':
      case 'task_failure':
        profile.components.taskCompletion = Math.max(0, Math.min(200,
          profile.components.taskCompletion + delta));
        break;
      case 'pow_earned':
        profile.components.powAccumulation = Math.max(0, Math.min(200,
          profile.components.powAccumulation + delta));
        break;
      case 'poe_earned':
        profile.components.poeAccumulation = Math.max(0, Math.min(200,
          profile.components.poeAccumulation + delta));
        break;
      case 'revenue_earned':
        profile.components.revenueGeneration = Math.max(0, Math.min(200,
          profile.components.revenueGeneration + delta));
        break;
      case 'endorsement':
        profile.components.peerEndorsements = Math.max(0, Math.min(100,
          profile.components.peerEndorsements + delta));
        break;
      case 'penalty':
      case 'guardrail_violation':
      case 'budget_overrun':
        profile.components.penalties = Math.max(-100, Math.min(0,
          profile.components.penalties + delta));
        break;
      case 'uptime_bonus':
        // Split across task and pow
        profile.components.taskCompletion = Math.max(0, Math.min(200,
          profile.components.taskCompletion + 1));
        profile.components.powAccumulation = Math.max(0, Math.min(200,
          profile.components.powAccumulation + 1));
        break;
    }

    // Keep last 100 events
    profile.history.unshift(event);
    if (profile.history.length > 100) profile.history = profile.history.slice(0, 100);

    await this.saveProfile(profile);

    // Audit stream
    await this.redis.xadd(`${REP_PREFIX}:audit`, '*',
      'agentId', agentId, 'type', type, 'delta', String(delta),
      'newScore', String(profile.score), 'tier', profile.tier,
      'source', source,
    ).catch(() => {});

    console.log(`⭐ [Reputation] ${agentId}: ${type} (${delta > 0 ? '+' : ''}${delta}) → ${profile.score} [${profile.tier}]`);

    return profile;
  }

  // ─── ENDORSEMENTS ───────────────────────────────────────

  async endorse(fromAgent: string, toAgent: string, reason: string, weight: number = 3): Promise<ReputationProfile> {
    const profile = await this.getProfile(toAgent);

    // Prevent self-endorsement
    if (fromAgent === toAgent) {
      throw new Error('Agents cannot endorse themselves');
    }

    // Check if already endorsed recently (24h cooldown)
    const recentEndorsement = profile.endorsements.find(
      e => e.fromAgent === fromAgent && (Date.now() - e.timestamp) < 86_400_000
    );
    if (recentEndorsement) {
      throw new Error(`${fromAgent} already endorsed ${toAgent} in the last 24h`);
    }

    const endorsement: Endorsement = {
      fromAgent,
      reason,
      weight: Math.max(1, Math.min(5, weight)),
      timestamp: Date.now(),
    };

    profile.endorsements.unshift(endorsement);
    if (profile.endorsements.length > 50) profile.endorsements = profile.endorsements.slice(0, 50);

    // Endorsement weight scales the reputation boost
    const scaledDelta = WEIGHTS.endorsement * (weight / 3);
    profile.components.peerEndorsements = Math.max(0, Math.min(100,
      profile.components.peerEndorsements + scaledDelta));

    await this.saveProfile(profile);

    console.log(`⭐ [Reputation] ${fromAgent} endorsed ${toAgent}: "${reason}" (weight: ${weight})`);

    return profile;
  }

  // ─── PERMISSIONS CHECK ──────────────────────────────────

  async hasPermission(agentId: string, permission: string): Promise<boolean> {
    const profile = await this.getProfile(agentId);
    const tier = TIERS.find(t => t.name === profile.tier);
    if (!tier) return false;
    return tier.permissions.includes(permission);
  }

  async getPermissions(agentId: string): Promise<string[]> {
    const profile = await this.getProfile(agentId);
    const tier = TIERS.find(t => t.name === profile.tier);
    return tier ? tier.permissions : [];
  }

  // ─── LEADERBOARD ────────────────────────────────────────

  async getLeaderboard(limit: number = 10): Promise<Array<{ agentId: string; score: number; tier: string }>> {
    const results = await this.redis.zrevrange(`${REP_PREFIX}:leaderboard`, 0, limit - 1, 'WITHSCORES').catch(() => []);
    const board: Array<{ agentId: string; score: number; tier: string }> = [];

    for (let i = 0; i < results.length; i += 2) {
      const agentId = results[i];
      const score = parseInt(results[i + 1]);
      board.push({ agentId, score, tier: this.getTierName(score) });
    }

    return board;
  }

  // ─── DECAY ──────────────────────────────────────────────

  /**
   * Apply daily reputation decay — inactive agents slowly lose reputation
   * Call from scheduler at midnight alongside budget reset
   */
  async applyDailyDecay(decayRate: number = 1): Promise<void> {
    const agents = await this.redis.zrange(`${REP_PREFIX}:leaderboard`, 0, -1).catch(() => []);

    for (const agentId of agents) {
      const profile = await this.getProfile(agentId);
      const daysSinceUpdate = (Date.now() - profile.lastUpdated) / 86_400_000;

      // Only decay if inactive for 3+ days
      if (daysSinceUpdate >= 3) {
        const decay = Math.min(decayRate * Math.floor(daysSinceUpdate - 2), 10);
        profile.components.taskCompletion = Math.max(0, profile.components.taskCompletion - decay);
        profile.components.powAccumulation = Math.max(0, profile.components.powAccumulation - decay);
        await this.saveProfile(profile);
        console.log(`⭐ [Reputation] Decay: ${agentId} -${decay} (inactive ${Math.floor(daysSinceUpdate)}d)`);
      }
    }
  }

  // ─── AUDIT LOG ──────────────────────────────────────────

  async getAuditLog(count: number = 50): Promise<any[]> {
    const entries = await this.redis.xrange(`${REP_PREFIX}:audit`, '-', '+', 'COUNT', count).catch(() => []);
    return (entries as any[]).map((e: any) => {
      const fields: Record<string, string> = {};
      for (let i = 0; i < e[1].length; i += 2) {
        fields[e[1][i]] = e[1][i + 1];
      }
      return { id: e[0], ...fields };
    });
  }
}

export const agentReputation = new AgentReputationService();
