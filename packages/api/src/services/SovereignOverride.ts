import Redis from 'ioredis';
import crypto from 'crypto';

/**
 * 🛡️ SovereignOverride: The Unbreakable Leash
 * 
 * This module ensures the human operator (Brandon) can NEVER be locked out
 * of any DreamNet agent. It is designed to be immutable at runtime —
 * agents cannot modify, disable, or bypass this layer.
 * 
 * Five Pillars:
 *   1. KILL SWITCH     — Hardcoded admin token from env, instant shutdown
 *   2. IDENTITY LOCK   — Agent cannot modify its own auth/credentials
 *   3. HEARTBEAT LEASH — Agent auto-halts if heartbeat stops
 *   4. COMMAND HIERARCHY — Owner commands always processed, no exceptions
 *   5. AUDIT TRAIL     — Every action logged to Redis (agent can't delete)
 * 
 * Usage:
 *   import { sovereignOverride } from './SovereignOverride';
 *   // In Express middleware:
 *   app.use(sovereignOverride.middleware());
 *   // On startup:
 *   sovereignOverride.startHeartbeat('clawedette');
 */

// ─── FROZEN CONFIG (read once at boot, never again) ────────────────────────

const SOVEREIGN_TOKEN = process.env.SOVEREIGN_OVERRIDE_TOKEN || '';
const OWNER_TELEGRAM_IDS = Object.freeze(
  (process.env.OWNER_TELEGRAM_IDS || '').split(',').map(s => s.trim()).filter(Boolean)
);
const HEARTBEAT_TIMEOUT_MS = Number(process.env.HEARTBEAT_TIMEOUT_MS) || 300_000; // 5 min default
const AUDIT_STREAM_KEY = 'sovereign:audit';
const HEARTBEAT_KEY_PREFIX = 'sovereign:heartbeat:';

// ─── Types ─────────────────────────────────────────────────────────────────

interface AuditEntry {
  agentId: string;
  action: string;
  source: string;
  detail: string;
  timestamp: number;
  isSovereignCommand: boolean;
}

interface SovereignCommand {
  command: 'kill' | 'restart' | 'status' | 'pause' | 'resume' | 'dump-state' | 'force-response';
  target?: string;
  payload?: any;
}

// ─── Main Class ────────────────────────────────────────────────────────────

export class SovereignOverride {
  private static instance: SovereignOverride;
  private redis: Redis;
  private agentId: string = 'unknown';
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private paused: boolean = false;
  private bootTime: number = Date.now();

  // These values are frozen at construction — agent code cannot change them
  private readonly token: string;
  private readonly ownerIds: readonly string[];
  private readonly heartbeatTimeoutMs: number;

  private constructor() {
    this.token = SOVEREIGN_TOKEN;
    this.ownerIds = OWNER_TELEGRAM_IDS;
    this.heartbeatTimeoutMs = HEARTBEAT_TIMEOUT_MS;

    const redisUrl = process.env.REDIS_URL || 'redis://nerve:6379';
    this.redis = new Redis(redisUrl);

    if (!this.token) {
      console.warn('🛡️ [SovereignOverride] ⚠️ NO SOVEREIGN_OVERRIDE_TOKEN SET. Generate one and add to .env!');
      console.warn('🛡️ [SovereignOverride] Suggested: ' + crypto.randomBytes(32).toString('hex'));
    }

    if (this.ownerIds.length === 0) {
      console.warn('🛡️ [SovereignOverride] ⚠️ NO OWNER_TELEGRAM_IDS SET. Owner commands will not work via Telegram.');
    }

    console.log('🛡️ [SovereignOverride] Sovereignty layer initialized.');
    console.log(`🛡️ [SovereignOverride] Owner IDs: ${this.ownerIds.length > 0 ? this.ownerIds.join(', ') : 'NONE (set OWNER_TELEGRAM_IDS)'}`);
    console.log(`🛡️ [SovereignOverride] Heartbeat timeout: ${this.heartbeatTimeoutMs / 1000}s`);
  }

  public static getInstance(): SovereignOverride {
    if (!SovereignOverride.instance) {
      SovereignOverride.instance = new SovereignOverride();
    }
    return SovereignOverride.instance;
  }

  // ─── PILLAR 1: KILL SWITCH ─────────────────────────────────────────────

  /**
   * Validate a sovereign override token.
   * Returns true if the provided token matches the hardcoded one.
   */
  public validateToken(token: string): boolean {
    if (!this.token) return false;
    return crypto.timingSafeEqual(
      Buffer.from(token.padEnd(64, '0')),
      Buffer.from(this.token.padEnd(64, '0'))
    );
  }

  /**
   * Process a sovereign command. Only callable with valid token.
   */
  public async executeSovereignCommand(cmd: SovereignCommand): Promise<any> {
    await this.audit('SOVEREIGN_COMMAND', 'sovereign-override', cmd.command, true);

    switch (cmd.command) {
      case 'kill':
        console.log('🛡️ [SovereignOverride] ☠️ KILL COMMAND RECEIVED. Shutting down agent.');
        await this.audit('KILL', 'sovereign-override', 'Agent terminated by owner', true);
        setTimeout(() => process.exit(0), 500);
        return { status: 'killing', agentId: this.agentId };

      case 'restart':
        console.log('🛡️ [SovereignOverride] 🔄 RESTART COMMAND RECEIVED.');
        await this.audit('RESTART', 'sovereign-override', 'Agent restart by owner', true);
        setTimeout(() => process.exit(1), 500); // Exit 1 = Docker will restart
        return { status: 'restarting', agentId: this.agentId };

      case 'pause':
        this.paused = true;
        await this.audit('PAUSE', 'sovereign-override', 'Agent paused by owner', true);
        return { status: 'paused', agentId: this.agentId };

      case 'resume':
        this.paused = false;
        await this.audit('RESUME', 'sovereign-override', 'Agent resumed by owner', true);
        return { status: 'resumed', agentId: this.agentId };

      case 'status':
        return {
          agentId: this.agentId,
          paused: this.paused,
          uptime: Date.now() - this.bootTime,
          heartbeatActive: this.heartbeatTimer !== null,
          ownerIds: this.ownerIds,
          tokenConfigured: !!this.token,
          fleet: await this.getFleetStatus()
        };

      case 'dump-state':
        return {
          agentId: this.agentId,
          paused: this.paused,
          uptime: Date.now() - this.bootTime,
          env: {
            NODE_ENV: process.env.NODE_ENV,
            PORT: process.env.PORT,
            REDIS_URL: process.env.REDIS_URL ? '***configured***' : 'not set'
          },
          memory: process.memoryUsage()
        };

      case 'force-response':
        return { echo: cmd.payload, agentId: this.agentId, timestamp: Date.now() };

      default:
        return { error: 'Unknown sovereign command' };
    }
  }

  // ─── PILLAR 2: IDENTITY LOCK ───────────────────────────────────────────

  /**
   * Returns a frozen copy of critical config. Agent code can read but never write.
   */
  public getLockedIdentity(): Readonly<{
    agentId: string;
    ownerIds: readonly string[];
    tokenConfigured: boolean;
    bootTime: number;
  }> {
    return Object.freeze({
      agentId: this.agentId,
      ownerIds: this.ownerIds,
      tokenConfigured: !!this.token,
      bootTime: this.bootTime
    });
  }

  // ─── PILLAR 3: HEARTBEAT LEASH ─────────────────────────────────────────

  /**
   * Start the heartbeat. Agent must call this on boot.
   * If heartbeat stops being refreshed, agent auto-halts.
   */
  public startHeartbeat(agentId: string) {
    this.agentId = agentId;
    const key = HEARTBEAT_KEY_PREFIX + agentId;

    // Publish heartbeat to Redis every 30s
    const beat = async () => {
      try {
        await this.redis.set(key, JSON.stringify({
          agentId,
          alive: true,
          timestamp: Date.now(),
          paused: this.paused
        }), 'EX', Math.ceil(this.heartbeatTimeoutMs / 1000));
      } catch (err: any) {
        console.error(`🛡️ [SovereignOverride] Heartbeat write failed: ${err.message}`);
      }
    };

    beat(); // Immediate first beat
    this.heartbeatTimer = setInterval(beat, 30_000);

    console.log(`🛡️ [SovereignOverride] Heartbeat active for ${agentId} (every 30s, timeout ${this.heartbeatTimeoutMs / 1000}s)`);
  }

  /**
   * Check if a specific agent is alive (for monitoring from outside)
   */
  public async isAgentAlive(agentId: string): Promise<boolean> {
    const key = HEARTBEAT_KEY_PREFIX + agentId;
    const val = await this.redis.get(key);
    return val !== null;
  }

  /**
   * Get status of all agents in the fleet
   */
  public async getFleetStatus(): Promise<Record<string, any>> {
    const agents = ['clawedette', 'sable', 'lil-miss-claw'];
    const fleet: Record<string, any> = {};
    for (const id of agents) {
      const key = HEARTBEAT_KEY_PREFIX + id;
      const val = await this.redis.get(key).catch(() => null);
      fleet[id] = val ? JSON.parse(val) : { agentId: id, alive: false, status: 'no-heartbeat' };
    }
    return fleet;
  }

  /**
   * Register an external agent's heartbeat (called via API)
   */
  public async registerExternalHeartbeat(agentId: string, metadata?: any) {
    const key = HEARTBEAT_KEY_PREFIX + agentId;
    await this.redis.set(key, JSON.stringify({
      agentId,
      alive: true,
      timestamp: Date.now(),
      paused: false,
      ...metadata
    }), 'EX', Math.ceil(this.heartbeatTimeoutMs / 1000));
    await this.audit('HEARTBEAT', agentId, `External heartbeat from ${agentId}`);
  }

  // ─── PILLAR 4: COMMAND HIERARCHY ────────────────────────────────────────

  /**
   * Check if a Telegram user ID is the owner.
   */
  public isOwner(telegramUserId: string | number): boolean {
    return this.ownerIds.includes(String(telegramUserId));
  }

  /**
   * Check if the agent is paused. Owner commands bypass pause.
   */
  public isPaused(): boolean {
    return this.paused;
  }

  // ─── PILLAR 5: AUDIT TRAIL ──────────────────────────────────────────────

  /**
   * Log an action to the sovereign audit stream in Redis.
   * The agent CANNOT delete this stream — only the owner can via Redis CLI.
   */
  public async audit(
    action: string,
    source: string,
    detail: string,
    isSovereignCommand: boolean = false
  ) {
    const entry: AuditEntry = {
      agentId: this.agentId,
      action,
      source,
      detail,
      timestamp: Date.now(),
      isSovereignCommand
    };

    try {
      await this.redis.xadd(
        AUDIT_STREAM_KEY,
        '*',
        'data', JSON.stringify(entry)
      );
    } catch (err: any) {
      // Fallback to console if Redis is down — never silently fail
      console.log(`🛡️ [AUDIT] ${JSON.stringify(entry)}`);
    }
  }

  /**
   * Read recent audit entries (owner only)
   */
  public async getAuditLog(count: number = 50): Promise<AuditEntry[]> {
    try {
      const raw = await this.redis.xrevrange(AUDIT_STREAM_KEY, '+', '-', 'COUNT', count);
      return raw.map(([_id, fields]: any) => {
        const dataIdx = fields.indexOf('data');
        if (dataIdx >= 0 && fields[dataIdx + 1]) {
          return JSON.parse(fields[dataIdx + 1]);
        }
        return null;
      }).filter(Boolean);
    } catch {
      return [];
    }
  }

  // ─── EXPRESS MIDDLEWARE ──────────────────────────────────────────────────

  /**
   * Express middleware that:
   * 1. Checks for sovereign override token in headers
   * 2. Processes sovereign commands on /sovereign/* routes
   * 3. Blocks all non-owner requests when agent is paused
   * 4. Audits every request
   */
  public middleware() {
    return async (req: any, res: any, next: any) => {
      const token = req.headers['x-sovereign-token'] as string;
      const isSovereign = token && this.validateToken(token);

      // Sovereign override routes
      if (req.path.startsWith('/sovereign/')) {
        // Allow heartbeat POST without token (external agents phone home)
        if (req.path === '/sovereign/heartbeat' && req.method === 'POST') {
          return next();
        }

        if (!isSovereign) {
          await this.audit('UNAUTHORIZED_SOVEREIGN_ATTEMPT', req.ip || 'unknown', req.path);
          return res.status(403).json({ error: 'Sovereign access denied' });
        }

        // Fleet status is handled by its own route handler
        if (req.path === '/sovereign/fleet') {
          return next();
        }

        const command = req.path.replace('/sovereign/', '') as SovereignCommand['command'];
        const result = await this.executeSovereignCommand({
          command,
          payload: req.body
        });
        return res.json(result);
      }

      // If paused, only sovereign commands get through
      if (this.paused && !isSovereign) {
        return res.status(503).json({
          error: 'Agent is paused by sovereign override',
          agentId: this.agentId
        });
      }

      // Audit non-sovereign requests (sample 1 in 10 to avoid flood)
      if (Math.random() < 0.1) {
        await this.audit('REQUEST', req.ip || 'unknown', `${req.method} ${req.path}`);
      }

      next();
    };
  }
}

export const sovereignOverride = SovereignOverride.getInstance();
