import { EconStore } from "../store/econStore";
import { ensureEconomicConfig } from "../logic/rewardIngestion";
export function runEconomicEngineCycle(ctx) {
    const now = Date.now();
    ensureEconomicConfig(ctx);
    // In the future, we could poll other subsystems for queued rewards.
    // For now, we only operate on already-added RawRewardEvent entries
    // when someone explicitly calls applyEmissionForReward.
    EconStore.setLastRunAt(now);
    const status = EconStore.status();
    // Optional: log into NeuralMesh
    if (ctx.neuralMesh?.remember) {
        ctx.neuralMesh.remember({
            source: "EconomicEngineCore",
            tokenCount: status.tokenCount,
            balanceCount: status.balanceCount,
            appliedRewards: status.appliedRewardCount,
            timestamp: now,
        });
    }
    return status;
}
