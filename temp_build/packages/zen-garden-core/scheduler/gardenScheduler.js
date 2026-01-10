"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runZenGardenCycle = runZenGardenCycle;
const gardenStore_1 = require("../store/gardenStore");
const rewardEngine_1 = require("../logic/rewardEngine");
function runZenGardenCycle(ctx) {
    const now = Date.now();
    // For all completed sessions that don't yet have rewards, compute recommendations
    const sessions = gardenStore_1.GardenStore.listSessions().filter((s) => s.state === "completed");
    sessions.forEach((session) => {
        (0, rewardEngine_1.computeRewardsForSession)(ctx, session);
    });
    gardenStore_1.GardenStore.setLastRunAt(now);
    // Optional: send a summary into NeuralMesh
    if (ctx.neuralMesh?.remember) {
        const status = gardenStore_1.GardenStore.status();
        ctx.neuralMesh.remember({
            source: "ZenGardenCore",
            sessionCount: status.sessionCount,
            rewardCount: status.rewardCount,
            timestamp: now,
        });
    }
    return gardenStore_1.GardenStore.status();
}
