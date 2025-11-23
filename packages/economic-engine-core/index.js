import { EconStore } from "./store/econStore";
import { applyEmissionForReward } from "./logic/rewardIngestion";
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
    listTokenConfigs() {
        return EconStore.listTokenConfigs();
    },
    listEmissionRules() {
        return EconStore.listEmissionRules();
    },
    // Balances
    // ✅ Identity Layer v1: Already accepts identityId (IdentityGrid node ID)
    // Usage: EconomicEngineCore.getBalance(ctx.identityId, "SHEEP")
    getBalance(identityId, token) {
        return EconStore.getBalance(identityId, token);
    },
    listBalances() {
        return EconStore.listBalances();
    },
    // Rewards
    // ✅ Identity Layer v1: Already accepts identityId in RawRewardEvent
    // Usage: EconomicEngineCore.recordRawReward({ identityId: ctx.identityId, source: "zen-garden", ... })
    recordRawReward(ev) {
        const now = Date.now();
        const full = {
            ...ev,
            id: nextRawRewardId(),
            createdAt: now,
        };
        EconStore.addRawReward(full);
        return full;
    },
    applyEmissionForReward(ev) {
        return applyEmissionForReward(ev);
    },
    listAppliedRewards() {
        return EconStore.listAppliedRewards();
    },
    // Orchestration
    run(context) {
        return runEconomicEngineCycle(context);
    },
    status() {
        return EconStore.status();
    },
};
export * from "./types";
export default EconomicEngineCore;
