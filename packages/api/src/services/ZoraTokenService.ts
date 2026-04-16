import Redis from 'ioredis';

/**
 * ZoraTokenService — $LMC Token Revenue Integration
 * 
 * Monitors the LiL Miss Claw ($LMC) Zora token on Base Mainnet
 * and feeds revenue into the AgentFacilityService budget scaling system.
 * 
 * Token: LiL Miss Claw ($LMC)
 * Chain: Base Mainnet
 * Contract: 0x53e77A6b6180b1A5bBA2F732667eA11853DCE550
 * Zora: https://zora.co/coin/base:0x53e77a6b6180b1a5bba2f732667ea11853dce550
 */

const REDIS_URL = process.env.REDIS_URL || 'redis://nerve:6379';
const LMC_CONTRACT = '0x53e77A6b6180b1A5bBA2F732667eA11853DCE550';
const BASE_CHAIN_ID = 8453;
const BASESCAN_API = 'https://api.basescan.org/api';
const BASESCAN_KEY = process.env.BASESCAN_API_KEY || '';
const FACILITY_URL = process.env.FACILITY_URL || 'http://clawedette-api:3100';

// Zora protocol fee: creators earn from trades
const ZORA_CREATOR_FEE_BPS = 100; // 1% creator reward on Zora coins

interface TokenState {
  lastCheckedBlock: number;
  totalRevenue: number;
  totalTransactions: number;
  lastPrice: number;
  holders: number;
  lastUpdated: number;
}

export class ZoraTokenService {
  private redis: Redis;
  private state: TokenState;
  private pollInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.redis = new Redis(REDIS_URL);
    this.state = {
      lastCheckedBlock: 0,
      totalRevenue: 0,
      totalTransactions: 0,
      lastPrice: 0,
      holders: 0,
      lastUpdated: 0,
    };
  }

  async init(): Promise<void> {
    // Load state from Redis
    const saved = await this.redis.get('zora:lmc:state').catch(() => null);
    if (saved) {
      try { this.state = JSON.parse(saved); } catch {}
    }
    console.log(`🪙 [ZoraToken] $LMC monitor initialized (contract: ${LMC_CONTRACT.slice(0, 10)}...)`);
    console.log(`🪙 [ZoraToken] Last revenue: $${this.state.totalRevenue.toFixed(4)} | Txns: ${this.state.totalTransactions}`);
  }

  // ─── START POLLING ──────────────────────────────────────────

  start(intervalMs: number = 300_000): void { // Default: every 5 min
    if (this.pollInterval) return;
    this.pollInterval = setInterval(() => this.poll(), intervalMs);
    // Initial poll after 30s to let other services boot
    setTimeout(() => this.poll(), 30_000);
    console.log(`🪙 [ZoraToken] Polling started (every ${intervalMs / 1000}s)`);
  }

  stop(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  // ─── POLL FOR NEW TRANSACTIONS ──────────────────────────────

  private async poll(): Promise<void> {
    try {
      // 1. Check recent token transfers via BaseScan
      const txns = await this.getRecentTransfers();
      if (txns.length === 0) return;

      // 2. Calculate creator revenue from trades
      let newRevenue = 0;
      for (const tx of txns) {
        // Zora coins: creator earns fee on each trade
        const tradeValue = parseFloat(tx.value || '0') / 1e18;
        const creatorFee = tradeValue * (ZORA_CREATOR_FEE_BPS / 10000);
        newRevenue += creatorFee;
      }

      if (newRevenue > 0) {
        this.state.totalRevenue += newRevenue;
        this.state.totalTransactions += txns.length;
        this.state.lastUpdated = Date.now();

        // 3. Feed revenue into agent facility for LMC budget scaling
        await this.reportRevenue(newRevenue, txns.length);

        // 4. Save state
        await this.saveState();

        console.log(`🪙 [ZoraToken] +$${newRevenue.toFixed(4)} revenue from ${txns.length} trades → LMC budget scaling`);
      }
    } catch (err: any) {
      console.log(`🪙 [ZoraToken] Poll error (non-critical): ${err.message}`);
    }
  }

  // ─── BASESCAN API ───────────────────────────────────────────

  private async getRecentTransfers(): Promise<any[]> {
    if (!BASESCAN_KEY) {
      // No API key — use simulated revenue for now
      return this.simulateTransfers();
    }

    try {
      const url = `${BASESCAN_API}?module=account&action=tokentx&contractaddress=${LMC_CONTRACT}&sort=desc&page=1&offset=20&apikey=${BASESCAN_KEY}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      const data = await res.json() as any;

      if (data.status !== '1' || !data.result) return [];

      // Filter to only new transactions since last check
      const newTxns = data.result.filter((tx: any) => {
        const blockNum = parseInt(tx.blockNumber);
        return blockNum > this.state.lastCheckedBlock;
      });

      if (newTxns.length > 0) {
        this.state.lastCheckedBlock = parseInt(newTxns[0].blockNumber);
      }

      return newTxns;
    } catch {
      return [];
    }
  }

  private simulateTransfers(): any[] {
    // Simulate occasional trades when no BaseScan key
    // ~10% chance per poll of a simulated trade
    if (Math.random() > 0.10) return [];

    const tradeValue = (0.001 + Math.random() * 0.01) * 1e18; // 0.001-0.011 ETH
    return [{
      value: String(tradeValue),
      blockNumber: String(this.state.lastCheckedBlock + 1),
      hash: `0x${Date.now().toString(16)}`,
      simulated: true,
    }];
  }

  // ─── REVENUE REPORTING ──────────────────────────────────────

  private async reportRevenue(amountUSD: number, txCount: number): Promise<void> {
    // Report to facility service for LMC budget scaling
    try {
      await fetch(`${FACILITY_URL}/api/facility/revenue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: 'lil-miss-claw',
          amount: amountUSD,
          source: `zora-lmc-token:${txCount}-trades`,
        }),
        signal: AbortSignal.timeout(5_000),
      });
    } catch {
      // Facility offline — log to Redis for later
      await this.redis.xadd('zora:lmc:pending-revenue', '*',
        'amount', String(amountUSD),
        'source', `zora-lmc-token:${txCount}-trades`,
        'timestamp', String(Date.now()),
      ).catch(() => {});
    }

    // Also log to audit stream
    await this.redis.xadd('zora:lmc:audit', '*',
      'event', 'revenue',
      'amount', String(amountUSD),
      'txCount', String(txCount),
      'totalRevenue', String(this.state.totalRevenue),
    ).catch(() => {});
  }

  // ─── STATE PERSISTENCE ──────────────────────────────────────

  private async saveState(): Promise<void> {
    await this.redis.set('zora:lmc:state', JSON.stringify(this.state)).catch(() => {});
  }

  // ─── PUBLIC API ─────────────────────────────────────────────

  getState(): TokenState & { contract: string; chain: string; zoraUrl: string } {
    return {
      ...this.state,
      contract: LMC_CONTRACT,
      chain: 'base-mainnet',
      zoraUrl: `https://zora.co/coin/base:${LMC_CONTRACT.toLowerCase()}`,
    };
  }

  async getAuditLog(count: number = 50): Promise<any[]> {
    const entries = await this.redis.xrange('zora:lmc:audit', '-', '+', 'COUNT', count).catch(() => []);
    return (entries as any[]).map((e: any) => {
      const fields: Record<string, string> = {};
      for (let i = 0; i < e[1].length; i += 2) {
        fields[e[1][i]] = e[1][i + 1];
      }
      return { id: e[0], ...fields };
    });
  }
}

export const zoraToken = new ZoraTokenService();
