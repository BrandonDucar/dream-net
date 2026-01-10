import type {
  EconTokenConfig,
  EconTokenSymbol,
  BalanceRecord,
  RawRewardEvent,
  EmissionRule,
  AppliedReward,
  EconomicEngineStatus,
} from '../types.js';

const tokenConfigs: Map<EconTokenSymbol, EconTokenConfig> = new Map();
const balances: Map<string, BalanceRecord> = new Map(); // key: identityId:token
const rawRewards: RawRewardEvent[] = [];
const emissionRules: EmissionRule[] = [];
const appliedRewards: AppliedReward[] = [];

let lastRunAt: number | null = null;

function balanceKey(identityId: string, token: EconTokenSymbol): string {
  return `${identityId}:${token}`;
}

export const EconStore = {
  // Tokens
  upsertTokenConfig(cfg: EconTokenConfig): EconTokenConfig {
    tokenConfigs.set(cfg.symbol, cfg);
    return cfg;
  },

  listTokenConfigs(): EconTokenConfig[] {
    return Array.from(tokenConfigs.values());
  },

  // Balances
  getBalance(identityId: string, token: EconTokenSymbol): BalanceRecord {
    const key = balanceKey(identityId, token);
    const existing = balances.get(key);
    const now = Date.now();
    if (existing) return existing;

    const rec: BalanceRecord = {
      identityId,
      token,
      amount: 0,
      updatedAt: now,
    };

    balances.set(key, rec);
    return rec;
  },

  setBalance(identityId: string, token: EconTokenSymbol, amount: number): BalanceRecord {
    const now = Date.now();
    const key = balanceKey(identityId, token);
    const rec: BalanceRecord = {
      identityId,
      token,
      amount,
      updatedAt: now,
    };

    balances.set(key, rec);
    return rec;
  },

  adjustBalance(identityId: string, token: EconTokenSymbol, delta: number): BalanceRecord {
    const existing = EconStore.getBalance(identityId, token);
    const newAmount = existing.amount + delta;
    return EconStore.setBalance(identityId, token, newAmount);
  },

  listBalances(): BalanceRecord[] {
    return Array.from(balances.values());
  },

  // Rewards
  addRawReward(ev: RawRewardEvent) {
    rawRewards.push(ev);
  },

  listRawRewards(): RawRewardEvent[] {
    return rawRewards;
  },

  addEmissionRule(rule: EmissionRule) {
    emissionRules.push(rule);
  },

  listEmissionRules(): EmissionRule[] {
    return emissionRules;
  },

  addAppliedReward(ar: AppliedReward) {
    appliedRewards.push(ar);
  },

  listAppliedRewards(): AppliedReward[] {
    return appliedRewards;
  },

  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  markRewardProcessed(id: string) {
    const r = rawRewards.find((x) => x.id === id);
    if (r) r.processed = true;
  },

  status(): EconomicEngineStatus {
    const sampleBalances = EconStore.listBalances().slice(0, 25);
    return {
      lastRunAt,
      tokenCount: tokenConfigs.size,
      emissionRuleCount: emissionRules.length,
      balanceCount: balances.size,
      appliedRewardCount: appliedRewards.length,
      sampleBalances,
    };
  },
};

