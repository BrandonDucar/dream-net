import type {
  EconTokenSymbol,
  EconTokenConfig,
  BalanceRecord,
  RewardSource,
  RewardKind,
  RawRewardEvent,
  EmissionRule,
  AppliedReward,
  EconomicEngineContext,
  EconomicEngineStatus,
} from "./types";
import { EconStore } from "./store/econStore";
import { ensureEconomicConfig, applyEmissionForReward } from "./logic/rewardIngestion";
import { ensureDefaultEconomicConfigSeeded } from "./logic/emissionRules";
import { runEconomicEngineCycle } from "./scheduler/econScheduler";

let rawRewardCounter = 0;
function nextRawRewardId() {
  rawRewardCounter += 1;
  return `rawreward-${Date.now()}-${rawRewardCounter}`;
}

export const EconomicEngineCore = {
  // Config
  ensureDefaultConfigSeeded() {
    ensureDefaultEconomicConfigSeeded();
  },

  listTokenConfigs(): EconTokenConfig[] {
    return EconStore.listTokenConfigs();
  },

  listEmissionRules(): EmissionRule[] {
    return EconStore.listEmissionRules();
  },

  // Balances
  // ✅ Identity Layer v1: Already accepts identityId (IdentityGrid node ID)
  // Usage: EconomicEngineCore.getBalance(ctx.identityId, "SHEEP")
  getBalance(identityId: string, token: EconTokenSymbol): BalanceRecord {
    return EconStore.getBalance(identityId, token);
  },

  listBalances(): BalanceRecord[] {
    return EconStore.listBalances();
  },

  // Rewards
  // ✅ Identity Layer v1: Already accepts identityId in RawRewardEvent
  // Usage: EconomicEngineCore.recordRawReward({ identityId: ctx.identityId, source: "zen-garden", ... })
  recordRawReward(ev: Omit<RawRewardEvent, "id" | "createdAt">): RawRewardEvent {
    const now = Date.now();
    const full: RawRewardEvent = {
      ...ev,
      id: nextRawRewardId(),
      createdAt: now,
    };
    EconStore.addRawReward(full);
    return full;
  },

  applyEmissionForReward(ev: RawRewardEvent): AppliedReward[] {
    return applyEmissionForReward(ev);
  },

  listAppliedRewards(): AppliedReward[] {
    return EconStore.listAppliedRewards();
  },

  // Orchestration
  run(context: EconomicEngineContext): EconomicEngineStatus {
    return runEconomicEngineCycle(context);
  },

  status(): EconomicEngineStatus {
    return EconStore.status();
  },
};

export * from "./types";
export default EconomicEngineCore;

