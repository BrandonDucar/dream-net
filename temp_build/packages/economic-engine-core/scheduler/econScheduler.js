"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runEconomicEngineCycle = runEconomicEngineCycle;
const econStore_1 = require("../store/econStore");
const rewardIngestion_1 = require("../logic/rewardIngestion");
function runEconomicEngineCycle(ctx) {
    const now = Date.now();
    (0, rewardIngestion_1.ensureEconomicConfig)(ctx);
    // In the future, we could poll other subsystems for queued rewards.
    // For now, we only operate on already-added RawRewardEvent entries
    // when someone explicitly calls applyEmissionForReward.
    econStore_1.EconStore.setLastRunAt(now);
    const status = econStore_1.EconStore.status();
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
