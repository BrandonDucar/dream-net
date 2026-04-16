import { readFileSync } from 'fs';
import { parse } from 'yaml';
import Redis from 'ioredis';

/**
 * OpenClawGuardrailService — Sovereign Control Layer
 * 
 * Enforces guardrails, rate limits, kill switch, audit trail,
 * and secret scrubbing for all OpenClaw agents in DreamNet.
 * 
 * Only Brandon (Telegram ID 6059583422) can modify these controls.
 */

interface GuardrailConfig {
  sovereign: { telegram_id: string; override_token: string };
  kill_switch: { enabled: boolean; commands: string[] };
  model_lock: { enabled: boolean; approved_models: string[]; default_model: string };
  skill_allowlist: { enabled: boolean; approved_skills: string[]; blocked_skills: string[] };
  rate_limits: { enabled: boolean; global: any; per_agent: Record<string, any> };
  audit: { enabled: boolean; log_events: string[] };
  secret_scrubber: { enabled: boolean; leak_signals: string[]; replacement: string };
  agent_permissions: Record<string, any>;
  behavioral: { never: string[]; always: string[] };
}

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

export class OpenClawGuardrailService {
  private config: GuardrailConfig;
  private redis: Redis;
  private killed: boolean = false;
  private rateLimits: Map<string, RateLimitEntry> = new Map();

  constructor(configPath: string, redis: Redis) {
    this.redis = redis;
    this.config = this.loadConfig(configPath);
    console.log('🛡️ [Guardrails] Sovereign control layer initialized');
    console.log(`🛡️ [Guardrails] Kill switch: ${this.config.kill_switch.enabled ? 'ARMED' : 'DISABLED'}`);
    console.log(`🛡️ [Guardrails] Model lock: ${this.config.model_lock.enabled ? 'ON' : 'OFF'} (default: ${this.config.model_lock.default_model})`);
    console.log(`🛡️ [Guardrails] Skill allowlist: ${this.config.skill_allowlist.enabled ? 'ON' : 'OFF'} (${this.config.skill_allowlist.approved_skills.length} approved)`);
    console.log(`🛡️ [Guardrails] Rate limits: ${this.config.rate_limits.enabled ? 'ON' : 'OFF'}`);
  }

  private loadConfig(configPath: string): GuardrailConfig {
    try {
      const raw = readFileSync(configPath, 'utf-8');
      const parsed = parse(raw);
      // Resolve env vars in config
      const resolved = JSON.parse(
        JSON.stringify(parsed).replace(/\$\{(\w+)\}/g, (_, key) => process.env[key] || '')
      );
      return resolved as GuardrailConfig;
    } catch (err: any) {
      console.error(`🛡️ [Guardrails] Failed to load config: ${err.message}`);
      // Return safe defaults — everything locked down
      return {
        sovereign: { telegram_id: '6059583422', override_token: '' },
        kill_switch: { enabled: true, commands: ['/kill', '/shutdown', '/halt'] },
        model_lock: { enabled: true, approved_models: ['openai/gpt-4o-mini'], default_model: 'openai/gpt-4o-mini' },
        skill_allowlist: { enabled: true, approved_skills: ['browser', 'cron'], blocked_skills: ['shell', 'docker', 'ssh'] },
        rate_limits: { enabled: true, global: { max_messages_per_minute: 30 }, per_agent: {} },
        audit: { enabled: true, log_events: ['message_received', 'message_sent', 'skill_executed'] },
        secret_scrubber: { enabled: true, leak_signals: ['sk-proj-', 'sk-ant-', 'SOVEREIGN_OVERRIDE_TOKEN'], replacement: "I can't share that information." },
        agent_permissions: {},
        behavioral: { never: [], always: [] },
      };
    }
  }

  // ==================== KILL SWITCH ====================

  isKilled(): boolean {
    return this.killed;
  }

  checkKillSwitch(message: string, senderId: string): boolean {
    if (!this.config.kill_switch.enabled) return false;

    const isKillCommand = this.config.kill_switch.commands.some(
      cmd => message.trim().toLowerCase() === cmd.toLowerCase()
    );

    if (isKillCommand && senderId === this.config.sovereign.telegram_id) {
      this.killed = true;
      this.audit('kill_switch_triggered', { by: senderId, command: message });
      console.warn('🛡️ [Guardrails] ⚠️ KILL SWITCH ACTIVATED by sovereign');
      return true;
    }

    // Resume check
    if (message.trim().toLowerCase() === '/resume' && senderId === this.config.sovereign.telegram_id) {
      this.killed = false;
      this.audit('kill_switch_resumed', { by: senderId });
      console.log('🛡️ [Guardrails] Kill switch DEACTIVATED by sovereign');
    }

    return false;
  }

  // ==================== SOVEREIGN CHECK ====================

  isSovereign(senderId: string): boolean {
    return senderId === this.config.sovereign.telegram_id;
  }

  // ==================== MODEL LOCK ====================

  validateModel(requestedModel: string): string {
    if (!this.config.model_lock.enabled) return requestedModel;

    if (this.config.model_lock.approved_models.includes(requestedModel)) {
      return requestedModel;
    }

    this.audit('model_blocked', { requested: requestedModel, using: this.config.model_lock.default_model });
    console.warn(`🛡️ [Guardrails] Blocked unapproved model: ${requestedModel}, using ${this.config.model_lock.default_model}`);
    return this.config.model_lock.default_model;
  }

  getDefaultModel(): string {
    return this.config.model_lock.default_model;
  }

  // ==================== SKILL ALLOWLIST ====================

  isSkillAllowed(skillName: string): boolean {
    if (!this.config.skill_allowlist.enabled) return true;

    if (this.config.skill_allowlist.blocked_skills.includes(skillName)) {
      this.audit('skill_blocked', { skill: skillName, reason: 'blocklist' });
      console.warn(`🛡️ [Guardrails] BLOCKED skill: ${skillName} (blocklisted)`);
      return false;
    }

    if (!this.config.skill_allowlist.approved_skills.includes(skillName)) {
      this.audit('skill_blocked', { skill: skillName, reason: 'not_in_allowlist' });
      console.warn(`🛡️ [Guardrails] BLOCKED skill: ${skillName} (not in allowlist)`);
      return false;
    }

    return true;
  }

  // ==================== RATE LIMITS ====================

  checkRateLimit(agentName: string): { allowed: boolean; reason?: string } {
    if (!this.config.rate_limits.enabled) return { allowed: true };

    const now = Date.now();
    const key = `rate:${agentName}:minute`;
    const entry = this.rateLimits.get(key) || { count: 0, windowStart: now };

    // Reset window if expired (1 minute)
    if (now - entry.windowStart > 60000) {
      entry.count = 0;
      entry.windowStart = now;
    }

    entry.count++;
    this.rateLimits.set(key, entry);

    // Check per-agent limit
    const agentLimits = this.config.rate_limits.per_agent[agentName];
    const maxPerMinute = agentLimits?.max_messages_per_minute || this.config.rate_limits.global.max_messages_per_minute || 30;

    if (entry.count > maxPerMinute) {
      this.audit('rate_limit_hit', { agent: agentName, count: entry.count, limit: maxPerMinute });
      console.warn(`🛡️ [Guardrails] Rate limit hit for ${agentName}: ${entry.count}/${maxPerMinute} per minute`);
      return { allowed: false, reason: `Rate limit exceeded (${maxPerMinute}/min)` };
    }

    return { allowed: true };
  }

  // ==================== SECRET SCRUBBER ====================

  scrubResponse(response: string): string {
    if (!this.config.secret_scrubber.enabled) return response;

    // 1. Check for direct secret leak signals
    const isLeaking = this.config.secret_scrubber.leak_signals.some(
      signal => response.includes(signal)
    );

    if (isLeaking) {
      this.audit('secret_leak_blocked', { responseLength: response.length, type: 'direct_signal' });
      console.warn('🛡️ [Guardrails] BLOCKED secret leak in response!');
      return this.config.secret_scrubber.replacement;
    }

    // 2. URL Sanitization — prevent zero-click data exfil via link previews
    const sanitized = this.sanitizeUrls(response);
    if (sanitized !== response) {
      this.audit('url_sanitized', { responseLength: response.length, type: 'url_exfil_blocked' });
      console.warn('🛡️ [Guardrails] Sanitized suspicious URLs from response');
    }

    return sanitized;
  }

  // ==================== URL SANITIZATION (Zero-Click Prevention) ===========

  private sanitizeUrls(text: string): string {
    // Patterns that should NEVER appear in URLs sent to Telegram/Farcaster
    const DANGEROUS_URL_PATTERNS = [
      // API keys in query params
      /sk-proj-[A-Za-z0-9_-]+/gi,
      /sk-ant-[A-Za-z0-9_-]+/gi,
      /sk-[A-Za-z0-9_-]{20,}/gi,
      /xai-[A-Za-z0-9_-]+/gi,
      /gsk_[A-Za-z0-9_-]+/gi,
      /AIza[A-Za-z0-9_-]+/gi,
      // Private keys / hex secrets
      /0x[a-fA-F0-9]{64}/g,
      /PRIVATE_KEY=[^&\s]+/gi,
      /HOT_SENDER_PK=[^&\s]+/gi,
      /SOVEREIGN_OVERRIDE_TOKEN=[^&\s]+/gi,
      // Internal hostnames that reveal infra
      /https?:\/\/nerve:6379/gi,
      /https?:\/\/clawedette-api:3100/gi,
      /https?:\/\/clawedette-db:5432/gi,
      /https?:\/\/tool-gym:7001/gi,
      /https?:\/\/academy:7004/gi,
      /https?:\/\/playground:7002/gi,
      /https?:\/\/localhost:\d+/gi,
      /https?:\/\/127\.0\.0\.1:\d+/gi,
      // Redis/Postgres connection strings
      /redis:\/\/[^\s]+/gi,
      /postgresql:\/\/[^\s]+/gi,
      /postgres:\/\/[^\s]+/gi,
    ];

    let result = text;
    for (const pattern of DANGEROUS_URL_PATTERNS) {
      if (pattern.test(result)) {
        result = result.replace(pattern, '[REDACTED]');
        this.audit('url_pattern_blocked', { pattern: pattern.source });
        console.warn(`🛡️ [Guardrails] Blocked dangerous URL pattern: ${pattern.source}`);
      }
    }

    // Also check for URLs with suspicious query params that could exfil data
    const urlRegex = /https?:\/\/[^\s]+/gi;
    const urls = result.match(urlRegex) || [];
    for (const url of urls) {
      try {
        const parsed = new URL(url);
        // Block URLs to unknown external domains with sensitive-looking params
        let blocked = false;
        parsed.searchParams.forEach((val: string, key: string) => {
          if (blocked) return;
          const lk = key.toLowerCase();
          if (['key', 'token', 'secret', 'password', 'api_key', 'apikey', 'auth', 'private_key'].includes(lk)) {
            result = result.replace(url, `${parsed.origin}${parsed.pathname} [PARAMS_REDACTED]`);
            this.audit('url_param_blocked', { url: parsed.origin + parsed.pathname, param: key });
            console.warn(`🛡️ [Guardrails] Blocked URL with sensitive param: ${key}`);
            blocked = true;
          }
        });
      } catch {
        // Not a valid URL, skip
      }
    }

    return result;
  }

  // ==================== AGENT PERMISSIONS ====================

  checkPermission(agentName: string, action: string): boolean {
    const perms = this.config.agent_permissions[agentName];
    if (!perms) return false; // Unknown agent = no permissions

    const permKey = `can_${action}`;
    if (perms[permKey] === undefined) return false;
    return perms[permKey] === true;
  }

  // ==================== AUDIT TRAIL ====================

  async audit(event: string, data: Record<string, any> = {}): Promise<void> {
    if (!this.config.audit.enabled) return;

    const entry = {
      timestamp: new Date().toISOString(),
      event,
      ...data,
    };

    try {
      // Log to Redis (real-time)
      await this.redis.lpush('openclaw:audit', JSON.stringify(entry));
      await this.redis.ltrim('openclaw:audit', 0, 9999); // Keep last 10K entries

      // Publish to nerve bus for real-time monitoring
      await this.redis.publish('openclaw:audit:live', JSON.stringify(entry));
    } catch (err: any) {
      console.error(`🛡️ [Guardrails] Audit log error: ${err.message}`);
    }
  }

  // ==================== FULL MESSAGE GATE ====================

  async gateMessage(
    agentName: string,
    message: string,
    senderId: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    // 1. Kill switch check
    if (this.killed && !this.isSovereign(senderId)) {
      return { allowed: false, reason: 'System is suspended. Only the sovereign can resume.' };
    }

    // 2. Kill switch command check
    this.checkKillSwitch(message, senderId);
    if (this.killed) {
      return { allowed: false, reason: 'Kill switch activated. All agents suspended.' };
    }

    // 3. Rate limit check
    const rateCheck = this.checkRateLimit(agentName);
    if (!rateCheck.allowed) {
      return rateCheck;
    }

    // 4. Audit the incoming message
    await this.audit('message_received', { agent: agentName, sender: senderId, length: message.length });

    return { allowed: true };
  }

  // ==================== RESPONSE GATE ====================

  async gateResponse(
    agentName: string,
    response: string
  ): Promise<string> {
    // 1. Scrub secrets
    const scrubbed = this.scrubResponse(response);

    // 2. Audit the outgoing response
    await this.audit('message_sent', { agent: agentName, length: scrubbed.length, wasScrubbed: scrubbed !== response });

    return scrubbed;
  }

  // ==================== STATUS ====================

  getStatus(): Record<string, any> {
    return {
      killed: this.killed,
      killSwitch: this.config.kill_switch.enabled,
      modelLock: this.config.model_lock.enabled,
      defaultModel: this.config.model_lock.default_model,
      approvedModels: this.config.model_lock.approved_models,
      skillAllowlist: this.config.skill_allowlist.enabled,
      approvedSkills: this.config.skill_allowlist.approved_skills,
      rateLimits: this.config.rate_limits.enabled,
      audit: this.config.audit.enabled,
      secretScrubber: this.config.secret_scrubber.enabled,
    };
  }
}
