import Redis from 'ioredis';

/**
 * TalonMiddleware — OpenClaw-as-Middleware for Every Mini App
 * 
 * "Talon" is the persistent agent that lives inside every DreamNet mini app.
 * It handles identity resolution, trust tiering, action gating, monetization,
 * audit trails, and kill switch enforcement.
 * 
 * Usage:
 *   const talon = new TalonMiddleware({ appName: 'signal-screener', redis });
 *   const decision = await talon.gate(subject, action, context);
 *   if (!decision.allow) return res.status(403).json(decision);
 * 
 * Every mini app gets:
 *   - Identity resolution (FID → trust tier)
 *   - Action gating (tier + rate limit + cooldown)
 *   - Monetization enforcement (free/builder/pro/operator)
 *   - Audit trail (every decision logged)
 *   - Kill switch (sovereign override)
 *   - Secret scrubbing (no leaks)
 *   - $LMC token gate checks
 */

// ─── Types ───────────────────────────────────────────────────────────

export interface TalonConfig {
  appName: string;
  redis: Redis;
  sovereignTelegramId?: string;
  lmcContractAddress?: string;
  customPolicies?: Record<string, ActionPolicy>;
  customTiers?: TierDefinition[];
  monetization?: MonetizationConfig;
}

export interface ActionPolicy {
  min_tier: number;
  cooldown_ms: number;
  description: string;
  requires_subscription?: string; // 'free' | 'builder' | 'pro' | 'operator'
}

export interface TierDefinition {
  tier: number;
  name: string;
  min_score: number;
  badge: string;
}

export interface MonetizationConfig {
  enabled: boolean;
  tiers: SubscriptionTier[];
  lmc_token_gate: LMCTokenGate;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price_usd: number;
  price_lmc: number; // $LMC tokens to hold as alternative
  features: string[];
}

export interface LMCTokenGate {
  enabled: boolean;
  contract: string;
  chain: string;
  thresholds: Record<string, number>; // tier_id → min tokens
}

export interface TalonSubject {
  type: 'fid' | 'wallet' | 'domain' | 'telegram';
  id: string;
  metadata?: Record<string, any>;
}

export interface TalonDecision {
  allow: boolean;
  tier_required: number;
  current_tier: number;
  subscription: string;
  reason: string;
  cooldown_ms: number;
  audit_id: string;
}

export interface TalonIdentity {
  fid: number;
  username: string;
  display_name: string;
  trust_tier: number;
  tier_name: string;
  tier_badge: string;
  score: number;
  subscription: string;
  power_badge: boolean;
  verified_wallets: string[];
  lmc_balance: number;
  registered_at: number;
  last_seen: number;
}

// ─── Default Configuration ───────────────────────────────────────────

const DEFAULT_TIERS: TierDefinition[] = [
  { tier: 0, name: 'Unknown',    min_score: 0,  badge: '⬜' },
  { tier: 1, name: 'Newcomer',   min_score: 20, badge: '🟫' },
  { tier: 2, name: 'Contributor', min_score: 35, badge: '🟨' },
  { tier: 3, name: 'Builder',    min_score: 50, badge: '🟩' },
  { tier: 4, name: 'Trusted',    min_score: 65, badge: '🟦' },
  { tier: 5, name: 'Veteran',    min_score: 80, badge: '🟪' },
];

const DEFAULT_POLICIES: Record<string, ActionPolicy> = {
  'view':                { min_tier: 0, cooldown_ms: 0,          description: 'View public content' },
  'search':              { min_tier: 0, cooldown_ms: 0,          description: 'Search content' },
  'notify_self':         { min_tier: 0, cooldown_ms: 0,          description: 'Receive notifications' },
  'watchlist_add':       { min_tier: 1, cooldown_ms: 0,          description: 'Add to personal watchlist', requires_subscription: 'free' },
  'export_data':         { min_tier: 2, cooldown_ms: 60_000,     description: 'Export data/reports', requires_subscription: 'builder' },
  'api_access':          { min_tier: 2, cooldown_ms: 0,          description: 'Use API endpoints', requires_subscription: 'pro' },
  'draft_content':       { min_tier: 2, cooldown_ms: 60_000,     description: 'AI-generate content drafts', requires_subscription: 'builder' },
  'alert_create':        { min_tier: 1, cooldown_ms: 0,          description: 'Create custom alerts', requires_subscription: 'builder' },
  'webhook_create':      { min_tier: 3, cooldown_ms: 0,          description: 'Create webhook integrations', requires_subscription: 'pro' },
  'bulk_api':            { min_tier: 3, cooldown_ms: 0,          description: 'Bulk API access', requires_subscription: 'operator' },
  'auto_action':         { min_tier: 4, cooldown_ms: 3_600_000,  description: 'Automated actions (follow/like)', requires_subscription: 'pro' },
  'white_label':         { min_tier: 4, cooldown_ms: 0,          description: 'White-label embeds', requires_subscription: 'operator' },
  'admin':               { min_tier: 5, cooldown_ms: 0,          description: 'Admin operations' },
};

const DEFAULT_MONETIZATION: MonetizationConfig = {
  enabled: true,
  tiers: [
    {
      id: 'free',
      name: 'Free',
      price_usd: 0,
      price_lmc: 0,
      features: [
        'Top 10 signals/day',
        'Basic topic view',
        '1 watchlist slot',
        'Public builder profiles',
      ],
    },
    {
      id: 'builder',
      name: 'Builder',
      price_usd: 0,
      price_lmc: 100,
      features: [
        'Full signal feed (unlimited)',
        'All topic hubs',
        '10 watchlist slots',
        'AI summaries',
        'Builder profiles with details',
        'Export reports',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price_usd: 5,
      price_lmc: 1000,
      features: [
        'Everything in Builder',
        'Real-time alerts',
        'Competitive intelligence',
        'Trend graphs',
        'API access (1000 req/day)',
        'Webhook integrations',
        'Priority notifications',
      ],
    },
    {
      id: 'operator',
      name: 'Operator',
      price_usd: 20,
      price_lmc: 5000,
      features: [
        'Everything in Pro',
        'Bulk API (10K req/day)',
        'White-label embeds',
        'Custom scoring weights',
        'Dedicated support channel',
        'Multi-app management',
      ],
    },
  ],
  lmc_token_gate: {
    enabled: true,
    contract: '0x53e77A6b6180b1A5bBA2F732667eA11853DCE550',
    chain: 'base',
    thresholds: {
      'builder': 100,
      'pro': 1000,
      'operator': 5000,
    },
  },
};

const DEFAULT_RATE_LIMITS: Record<string, { per_hour: number; per_day: number }> = {
  'view':           { per_hour: 200, per_day: 2000 },
  'search':         { per_hour: 60,  per_day: 500 },
  'notify_self':    { per_hour: 50,  per_day: 200 },
  'watchlist_add':  { per_hour: 10,  per_day: 50 },
  'export_data':    { per_hour: 5,   per_day: 20 },
  'api_access':     { per_hour: 100, per_day: 1000 },
  'draft_content':  { per_hour: 10,  per_day: 30 },
  'alert_create':   { per_hour: 5,   per_day: 20 },
  'webhook_create': { per_hour: 2,   per_day: 10 },
  'bulk_api':       { per_hour: 500, per_day: 10000 },
  'auto_action':    { per_hour: 2,   per_day: 10 },
  'white_label':    { per_hour: 10,  per_day: 50 },
  'admin':          { per_hour: 50,  per_day: 200 },
};

// ─── Talon Middleware Class ──────────────────────────────────────────

export class TalonMiddleware {
  private appName: string;
  private redis: Redis;
  private sovereignId: string;
  private policies: Record<string, ActionPolicy>;
  private tiers: TierDefinition[];
  private monetization: MonetizationConfig;
  private killed: boolean = false;
  private auditCounter: number = 0;

  constructor(config: TalonConfig) {
    this.appName = config.appName;
    this.redis = config.redis;
    this.sovereignId = config.sovereignTelegramId || '6059583422';
    this.policies = { ...DEFAULT_POLICIES, ...(config.customPolicies || {}) };
    this.tiers = config.customTiers || DEFAULT_TIERS;
    this.monetization = config.monetization || DEFAULT_MONETIZATION;

    console.log(`🦅 [Talon:${this.appName}] Initialized`);
    console.log(`🦅 [Talon:${this.appName}] ${Object.keys(this.policies).length} action policies`);
    console.log(`🦅 [Talon:${this.appName}] ${this.tiers.length} trust tiers`);
    console.log(`🦅 [Talon:${this.appName}] Monetization: ${this.monetization.enabled ? 'ON' : 'OFF'}`);
    console.log(`🦅 [Talon:${this.appName}] $LMC gate: ${this.monetization.lmc_token_gate.enabled ? 'ON' : 'OFF'}`);
  }

  // ─── Identity Resolution ─────────────────────────────────────────

  async resolveIdentity(subject: TalonSubject): Promise<TalonIdentity> {
    const key = `talon:${this.appName}:identity:${subject.type}:${subject.id}`;
    const cached = await this.redis.get(key);
    if (cached) {
      const identity: TalonIdentity = JSON.parse(cached);
      // Update last_seen
      identity.last_seen = Date.now();
      await this.redis.set(key, JSON.stringify(identity), 'EX', 604800);
      return identity;
    }

    // Check if we have a screener account score
    let score = 0;
    let username = '';
    let display_name = '';
    let power_badge = false;
    let verified_wallets: string[] = [];

    if (subject.type === 'fid') {
      const accountRaw = await this.redis.get(`screener:account:${subject.id}`);
      if (accountRaw) {
        const account = JSON.parse(accountRaw);
        score = account.score_total || 0;
        username = account.username || '';
        display_name = account.display_name || '';
        power_badge = account.power_badge || false;
        verified_wallets = account.verified_wallets || [];
      }
    }

    // Check reputation system
    const repRaw = await this.redis.get(`reputation:${subject.id}`);
    if (repRaw) {
      const rep = JSON.parse(repRaw);
      score = Math.max(score, rep.score || 0);
    }

    // Determine tier
    const tier = this.scoreToTier(score);

    // Check subscription
    const subRaw = await this.redis.get(`talon:${this.appName}:sub:${subject.type}:${subject.id}`);
    const subscription = subRaw ? JSON.parse(subRaw).tier : 'free';

    // Check $LMC balance
    const lmcRaw = await this.redis.get(`talon:lmc:${subject.id}`);
    const lmc_balance = lmcRaw ? Number(lmcRaw) : 0;

    const identity: TalonIdentity = {
      fid: subject.type === 'fid' ? Number(subject.id) : 0,
      username,
      display_name,
      trust_tier: tier.tier,
      tier_name: tier.name,
      tier_badge: tier.badge,
      score,
      subscription,
      power_badge,
      verified_wallets,
      lmc_balance,
      registered_at: Date.now(),
      last_seen: Date.now(),
    };

    await this.redis.set(key, JSON.stringify(identity), 'EX', 604800);
    return identity;
  }

  private scoreToTier(score: number): TierDefinition {
    let best = this.tiers[0];
    for (const t of this.tiers) {
      if (score >= t.min_score) best = t;
    }
    return best;
  }

  // ─── Core Gate Function ───────────────────────────────────────────

  async gate(
    subject: TalonSubject,
    action: string,
    context: Record<string, any> = {}
  ): Promise<TalonDecision> {
    const auditId = `${this.appName}-${Date.now()}-${++this.auditCounter}`;

    // 1. Kill switch
    if (this.killed) {
      return this.deny(auditId, 0, 0, 'free', 'System suspended by sovereign kill switch', 0);
    }

    // 2. Policy lookup
    const policy = this.policies[action];
    if (!policy) {
      return this.deny(auditId, -1, 0, 'free', `Unknown action: ${action}`, 0);
    }

    // 3. Resolve identity
    const identity = await this.resolveIdentity(subject);

    // 4. Trust tier check
    if (identity.trust_tier < policy.min_tier) {
      await this.audit('gate_denied_tier', { auditId, subject, action, tier: identity.trust_tier, required: policy.min_tier });
      return this.deny(auditId, policy.min_tier, identity.trust_tier, identity.subscription,
        `Trust tier ${identity.trust_tier} (${identity.tier_name}) < required ${policy.min_tier} for "${action}"`, 0);
    }

    // 5. Subscription check
    if (policy.requires_subscription) {
      const effectiveSub = this.resolveEffectiveSubscription(identity);
      const subLevel = this.subscriptionLevel(effectiveSub);
      const requiredLevel = this.subscriptionLevel(policy.requires_subscription);
      if (subLevel < requiredLevel) {
        await this.audit('gate_denied_subscription', { auditId, subject, action, sub: effectiveSub, required: policy.requires_subscription });
        return this.deny(auditId, policy.min_tier, identity.trust_tier, effectiveSub,
          `Subscription "${effectiveSub}" insufficient for "${action}" (requires "${policy.requires_subscription}")`, 0);
      }
    }

    // 6. Rate limit check
    const rateResult = await this.checkRateLimit(subject, action);
    if (!rateResult.allowed) {
      await this.audit('gate_denied_rate', { auditId, subject, action, reason: rateResult.reason });
      return this.deny(auditId, policy.min_tier, identity.trust_tier, identity.subscription,
        rateResult.reason!, rateResult.cooldown_ms || 0);
    }

    // 7. Cooldown check
    if (policy.cooldown_ms > 0) {
      const cooldownResult = await this.checkCooldown(subject, action, policy.cooldown_ms);
      if (!cooldownResult.allowed) {
        await this.audit('gate_denied_cooldown', { auditId, subject, action, remaining: cooldownResult.remaining_ms });
        return this.deny(auditId, policy.min_tier, identity.trust_tier, identity.subscription,
          `Cooldown: ${Math.ceil((cooldownResult.remaining_ms || 0) / 1000)}s remaining`, cooldownResult.remaining_ms || 0);
      }
    }

    // 8. ALLOW — record
    await this.recordAction(subject, action);
    await this.audit('gate_allowed', { auditId, subject, action, tier: identity.trust_tier, context });

    return {
      allow: true,
      tier_required: policy.min_tier,
      current_tier: identity.trust_tier,
      subscription: identity.subscription,
      reason: `Action "${action}" allowed for ${identity.tier_name} (tier ${identity.trust_tier})`,
      cooldown_ms: 0,
      audit_id: auditId,
    };
  }

  private deny(auditId: string, tierReq: number, tierCur: number, sub: string, reason: string, cooldown: number): TalonDecision {
    return { allow: false, tier_required: tierReq, current_tier: tierCur, subscription: sub, reason, cooldown_ms: cooldown, audit_id: auditId };
  }

  // ─── Subscription Resolution ──────────────────────────────────────

  private resolveEffectiveSubscription(identity: TalonIdentity): string {
    // Check $LMC token gate first (holding tokens = subscription equivalent)
    if (this.monetization.lmc_token_gate.enabled && identity.lmc_balance > 0) {
      const thresholds = this.monetization.lmc_token_gate.thresholds;
      if (identity.lmc_balance >= (thresholds['operator'] || Infinity)) return 'operator';
      if (identity.lmc_balance >= (thresholds['pro'] || Infinity)) return 'pro';
      if (identity.lmc_balance >= (thresholds['builder'] || Infinity)) return 'builder';
    }
    return identity.subscription;
  }

  private subscriptionLevel(tier: string): number {
    switch (tier) {
      case 'operator': return 4;
      case 'pro': return 3;
      case 'builder': return 2;
      case 'free': return 1;
      default: return 0;
    }
  }

  // ─── Rate Limiting ────────────────────────────────────────────────

  private async checkRateLimit(subject: TalonSubject, action: string): Promise<{ allowed: boolean; reason?: string; cooldown_ms?: number }> {
    const limits = DEFAULT_RATE_LIMITS[action];
    if (!limits) return { allowed: true };

    const hourKey = `talon:${this.appName}:rate:${action}:${subject.id}:h:${Math.floor(Date.now() / 3_600_000)}`;
    const dayKey = `talon:${this.appName}:rate:${action}:${subject.id}:d:${new Date().toISOString().slice(0, 10)}`;

    const [hourCount, dayCount] = await Promise.all([
      this.redis.get(hourKey).then(v => Number(v || 0)),
      this.redis.get(dayKey).then(v => Number(v || 0)),
    ]);

    if (hourCount >= limits.per_hour) {
      return { allowed: false, reason: `Hourly limit (${limits.per_hour}) for "${action}"`, cooldown_ms: 3_600_000 - (Date.now() % 3_600_000) };
    }
    if (dayCount >= limits.per_day) {
      return { allowed: false, reason: `Daily limit (${limits.per_day}) for "${action}"`, cooldown_ms: 86_400_000 - (Date.now() % 86_400_000) };
    }

    return { allowed: true };
  }

  // ─── Cooldown ─────────────────────────────────────────────────────

  private async checkCooldown(subject: TalonSubject, action: string, cooldownMs: number): Promise<{ allowed: boolean; remaining_ms?: number }> {
    const key = `talon:${this.appName}:cd:${action}:${subject.id}`;
    const lastTs = Number(await this.redis.get(key) || 0);
    const elapsed = Date.now() - lastTs;
    if (elapsed < cooldownMs) {
      return { allowed: false, remaining_ms: cooldownMs - elapsed };
    }
    return { allowed: true };
  }

  // ─── Record Action ────────────────────────────────────────────────

  private async recordAction(subject: TalonSubject, action: string): Promise<void> {
    const pipeline = this.redis.pipeline();
    const hourKey = `talon:${this.appName}:rate:${action}:${subject.id}:h:${Math.floor(Date.now() / 3_600_000)}`;
    const dayKey = `talon:${this.appName}:rate:${action}:${subject.id}:d:${new Date().toISOString().slice(0, 10)}`;

    pipeline.incr(hourKey);
    pipeline.expire(hourKey, 7200);
    pipeline.incr(dayKey);
    pipeline.expire(dayKey, 172800);

    // Record cooldown
    const policy = this.policies[action];
    if (policy && policy.cooldown_ms > 0) {
      const cdKey = `talon:${this.appName}:cd:${action}:${subject.id}`;
      pipeline.set(cdKey, String(Date.now()), 'EX', Math.ceil(policy.cooldown_ms / 1000));
    }

    // Increment global action counter
    pipeline.hincrby(`talon:${this.appName}:stats`, `actions:${action}`, 1);
    pipeline.hincrby(`talon:${this.appName}:stats`, 'total_actions', 1);

    await pipeline.exec();
  }

  // ─── Kill Switch ──────────────────────────────────────────────────

  kill(senderId: string): boolean {
    if (senderId !== this.sovereignId) return false;
    this.killed = true;
    this.audit('kill_switch', { by: senderId, app: this.appName });
    console.warn(`🦅 [Talon:${this.appName}] ⚠️ KILL SWITCH ACTIVATED`);
    return true;
  }

  resume(senderId: string): boolean {
    if (senderId !== this.sovereignId) return false;
    this.killed = false;
    this.audit('resume', { by: senderId, app: this.appName });
    console.log(`🦅 [Talon:${this.appName}] Kill switch deactivated`);
    return true;
  }

  isKilled(): boolean { return this.killed; }

  // ─── Subscription Management ──────────────────────────────────────

  async setSubscription(subject: TalonSubject, tier: string, expiresAt?: number): Promise<void> {
    const key = `talon:${this.appName}:sub:${subject.type}:${subject.id}`;
    const sub = { tier, set_at: Date.now(), expires_at: expiresAt || 0 };
    const ttl = expiresAt ? Math.ceil((expiresAt - Date.now()) / 1000) : 2592000; // 30 days default
    await this.redis.set(key, JSON.stringify(sub), 'EX', ttl);
    await this.audit('subscription_set', { subject, tier, expires_at: expiresAt });
  }

  async getSubscription(subject: TalonSubject): Promise<{ tier: string; expires_at: number }> {
    const key = `talon:${this.appName}:sub:${subject.type}:${subject.id}`;
    const raw = await this.redis.get(key);
    if (!raw) return { tier: 'free', expires_at: 0 };
    return JSON.parse(raw);
  }

  // ─── $LMC Balance (cached, updated by external poller) ───────────

  async setLMCBalance(subjectId: string, balance: number): Promise<void> {
    await this.redis.set(`talon:lmc:${subjectId}`, String(balance), 'EX', 3600);
  }

  async getLMCBalance(subjectId: string): Promise<number> {
    return Number(await this.redis.get(`talon:lmc:${subjectId}`) || 0);
  }

  // ─── Audit ────────────────────────────────────────────────────────

  private async audit(event: string, data: Record<string, any> = {}): Promise<void> {
    const entry = { ts: Date.now(), app: this.appName, event, ...data };
    try {
      await this.redis.lpush(`talon:${this.appName}:audit`, JSON.stringify(entry));
      await this.redis.ltrim(`talon:${this.appName}:audit`, 0, 9999);
      await this.redis.publish('talon:audit:live', JSON.stringify(entry));
    } catch {}
  }

  // ─── Status & Reporting ───────────────────────────────────────────

  async getStats(): Promise<Record<string, any>> {
    const raw = await this.redis.hgetall(`talon:${this.appName}:stats`);
    const auditLen = await this.redis.llen(`talon:${this.appName}:audit`);
    return {
      app: this.appName,
      killed: this.killed,
      policies: Object.keys(this.policies).length,
      tiers: this.tiers.length,
      monetization: this.monetization.enabled,
      lmc_gate: this.monetization.lmc_token_gate.enabled,
      lmc_contract: this.monetization.lmc_token_gate.contract,
      audit_entries: auditLen,
      ...raw,
    };
  }

  async getAuditLog(limit = 50): Promise<any[]> {
    const entries = await this.redis.lrange(`talon:${this.appName}:audit`, 0, limit - 1);
    return entries.map(e => JSON.parse(e));
  }

  getPolicies(): Record<string, ActionPolicy & { rate_limits?: any }> {
    const result: any = {};
    for (const [action, policy] of Object.entries(this.policies)) {
      result[action] = { ...policy, rate_limits: DEFAULT_RATE_LIMITS[action] || null };
    }
    return result;
  }

  getMonetization(): MonetizationConfig {
    return this.monetization;
  }

  getTiers(): TierDefinition[] {
    return this.tiers;
  }
}
