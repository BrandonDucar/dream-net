import Redis from 'ioredis';
import { createHash, createHmac } from 'crypto';

/**
 * ReceiptGuard — Exactly-Once Tool Call Middleware
 * 
 * Prevents double-spend, double-post, duplicate bridge messages,
 * and repeated facility visits. Every tool call gets a receipt.
 * 
 * Pattern: SETNX receipt → acquire lease → execute → mark success/fail
 * 
 * From Vex Intel: "Drop-in Idempotency Receipt"
 */

const REDIS_URL = process.env.REDIS_URL || 'redis://nerve:6379';
const SERVICE_KEY = process.env.RECEIPT_GUARD_KEY || 'dreamnet-receipt-guard-v1';

// ─── TYPES ──────────────────────────────────────────────────────

interface Receipt {
  key: string;
  status: 'pending' | 'success' | 'failed';
  ownerId: string;
  createdAt: number;
  leaseExpiresAt: number;
  retries: number;
  resultLocation: string | null;
  resultDigest: string | null;
  resultSig: string | null;
  attempts: number;
  finishedAt: number | null;
  error: string | null;
}

interface ReceiptGuardOptions {
  leaseTtlMs?: number;       // Default: 180_000 (3 min)
  maxRetries?: number;        // Default: 6
  idempotencyWindowMs?: number; // Default: 86_400_000 (24h)
  ownerId?: string;
}

// ─── SERVICE ────────────────────────────────────────────────────

export class ReceiptGuardService {
  private redis: Redis;
  private ownerId: string;
  private leaseTtlMs: number;
  private maxRetries: number;
  private idempotencyWindowMs: number;

  constructor(options: ReceiptGuardOptions = {}) {
    this.redis = new Redis(REDIS_URL);
    this.ownerId = options.ownerId || `cascade-${process.pid}-${Date.now()}`;
    this.leaseTtlMs = options.leaseTtlMs || 180_000;
    this.maxRetries = options.maxRetries || 6;
    this.idempotencyWindowMs = options.idempotencyWindowMs || 86_400_000;
    console.log(`🔒 [ReceiptGuard] Initialized (owner: ${this.ownerId}, lease: ${this.leaseTtlMs}ms, window: ${this.idempotencyWindowMs}ms)`);
  }

  // ─── KEY GENERATION ─────────────────────────────────────────

  /**
   * Build a stable idempotency key from workflow context
   */
  buildKey(workflowId: string, stepId: string, toolName: string, inputDigest: string): string {
    const raw = `${workflowId}||${stepId}||${toolName}||${inputDigest}`;
    return `receipt:${createHash('sha256').update(raw).digest('hex').slice(0, 32)}`;
  }

  /**
   * Quick key from agentId + action + dedup seed
   */
  quickKey(agentId: string, action: string, seed?: string): string {
    const raw = `${agentId}||${action}||${seed || ''}`;
    return `receipt:${createHash('sha256').update(raw).digest('hex').slice(0, 32)}`;
  }

  // ─── CORE: RUN ONCE ─────────────────────────────────────────

  /**
   * Execute a function exactly once for the given key.
   * Returns cached result if already succeeded.
   * Throws if max retries exceeded.
   */
  async runOnce<T>(
    key: string,
    fn: () => Promise<T>,
    options?: { resultLocation?: string }
  ): Promise<{ result: T; fromCache: boolean; receipt: Receipt }> {
    // 1. Try to acquire or read existing receipt
    const existing = await this.getReceipt(key);

    if (existing) {
      // Already succeeded — return cached
      if (existing.status === 'success') {
        console.log(`🔒 [ReceiptGuard] Cache hit: ${key} (succeeded at ${new Date(existing.finishedAt!).toISOString()})`);
        return {
          result: JSON.parse(existing.resultLocation || 'null') as T,
          fromCache: true,
          receipt: existing,
        };
      }

      // Pending but lease held by someone else
      if (existing.status === 'pending' && existing.ownerId !== this.ownerId) {
        if (Date.now() < existing.leaseExpiresAt) {
          throw new Error(`ReceiptGuard: Key ${key} is leased by ${existing.ownerId} until ${new Date(existing.leaseExpiresAt).toISOString()}`);
        }
        // Lease expired — we can take over
      }

      // Failed too many times
      if (existing.status === 'failed' && existing.retries >= this.maxRetries) {
        throw new Error(`ReceiptGuard: Key ${key} permanently failed after ${existing.retries} retries`);
      }
    }

    // 2. Create or update receipt with our lease
    const receipt: Receipt = {
      key,
      status: 'pending',
      ownerId: this.ownerId,
      createdAt: existing?.createdAt || Date.now(),
      leaseExpiresAt: Date.now() + this.leaseTtlMs,
      retries: (existing?.retries || 0) + (existing ? 1 : 0),
      resultLocation: null,
      resultDigest: null,
      resultSig: null,
      attempts: (existing?.attempts || 0) + 1,
      finishedAt: null,
      error: null,
    };

    // Atomic SETNX (only set if not exists) or update if we own it
    const acquired = await this.acquireLease(key, receipt);
    if (!acquired) {
      throw new Error(`ReceiptGuard: Failed to acquire lease for ${key}`);
    }

    // 3. Execute the function
    try {
      const result = await fn();

      // 4. Mark success
      const resultJson = JSON.stringify(result);
      const digest = createHash('sha256').update(resultJson).digest('hex');
      const sig = createHmac('sha256', SERVICE_KEY).update(digest).digest('hex');

      receipt.status = 'success';
      receipt.resultLocation = resultJson;
      receipt.resultDigest = digest;
      receipt.resultSig = sig;
      receipt.finishedAt = Date.now();

      await this.saveReceipt(key, receipt);

      // Audit
      await this.redis.xadd('receipt:audit', '*',
        'key', key, 'status', 'success', 'owner', this.ownerId,
        'attempts', String(receipt.attempts), 'durationMs', String(receipt.finishedAt - receipt.createdAt),
      ).catch(() => {});

      console.log(`🔒 [ReceiptGuard] ✅ ${key} succeeded (attempt ${receipt.attempts})`);

      return { result, fromCache: false, receipt };
    } catch (err: any) {
      // 5. Mark failed
      receipt.status = 'failed';
      receipt.error = err.message;
      receipt.finishedAt = Date.now();

      await this.saveReceipt(key, receipt);

      await this.redis.xadd('receipt:audit', '*',
        'key', key, 'status', 'failed', 'owner', this.ownerId,
        'error', err.message, 'retries', String(receipt.retries),
      ).catch(() => {});

      console.log(`🔒 [ReceiptGuard] ❌ ${key} failed: ${err.message} (retry ${receipt.retries}/${this.maxRetries})`);
      throw err;
    }
  }

  // ─── LEASE MANAGEMENT ───────────────────────────────────────

  private async acquireLease(key: string, receipt: Receipt): Promise<boolean> {
    const json = JSON.stringify(receipt);
    // Try SETNX first (new receipt)
    const set = await this.redis.set(key, json, 'PX', this.idempotencyWindowMs, 'NX').catch(() => null);
    if (set === 'OK') return true;

    // Key exists — check if we can take over
    const existing = await this.getReceipt(key);
    if (!existing) return false;

    // We own it, or lease expired
    if (existing.ownerId === this.ownerId || Date.now() >= existing.leaseExpiresAt) {
      await this.redis.set(key, json, 'PX', this.idempotencyWindowMs).catch(() => null);
      return true;
    }

    return false;
  }

  // ─── RECEIPT STORAGE ────────────────────────────────────────

  private async getReceipt(key: string): Promise<Receipt | null> {
    const raw = await this.redis.get(key).catch(() => null);
    if (!raw) return null;
    try { return JSON.parse(raw) as Receipt; } catch { return null; }
  }

  private async saveReceipt(key: string, receipt: Receipt): Promise<void> {
    await this.redis.set(key, JSON.stringify(receipt), 'PX', this.idempotencyWindowMs).catch(() => {});
  }

  // ─── VERIFICATION ───────────────────────────────────────────

  /**
   * Verify a receipt's result hasn't been tampered with
   */
  async verifyReceipt(key: string): Promise<{ valid: boolean; receipt: Receipt | null }> {
    const receipt = await this.getReceipt(key);
    if (!receipt) return { valid: false, receipt: null };
    if (receipt.status !== 'success') return { valid: false, receipt };

    const expectedSig = createHmac('sha256', SERVICE_KEY)
      .update(receipt.resultDigest || '')
      .digest('hex');

    return { valid: receipt.resultSig === expectedSig, receipt };
  }

  // ─── DEAD LETTER QUEUE ──────────────────────────────────────

  /**
   * Get all permanently failed receipts
   */
  async getDeadLetters(): Promise<Receipt[]> {
    const keys = await this.redis.keys('receipt:*').catch(() => []);
    const dead: Receipt[] = [];
    for (const key of keys) {
      if (key.startsWith('receipt:audit')) continue;
      const receipt = await this.getReceipt(key);
      if (receipt && receipt.status === 'failed' && receipt.retries >= this.maxRetries) {
        dead.push(receipt);
      }
    }
    return dead;
  }

  // ─── STATS ──────────────────────────────────────────────────

  async getStats(): Promise<{
    totalReceipts: number;
    succeeded: number;
    failed: number;
    pending: number;
    deadLetters: number;
  }> {
    const keys = await this.redis.keys('receipt:*').catch(() => []);
    let succeeded = 0, failed = 0, pending = 0, deadLetters = 0;

    for (const key of keys) {
      if (key.startsWith('receipt:audit')) continue;
      const receipt = await this.getReceipt(key);
      if (!receipt) continue;
      if (receipt.status === 'success') succeeded++;
      else if (receipt.status === 'failed') {
        failed++;
        if (receipt.retries >= this.maxRetries) deadLetters++;
      }
      else if (receipt.status === 'pending') pending++;
    }

    return { totalReceipts: keys.length, succeeded, failed, pending, deadLetters };
  }
}

export const receiptGuard = new ReceiptGuardService();
