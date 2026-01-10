import { GardenStore } from '../store/gardenStore.js';
import { computeRewardsForSession } from '../logic/rewardEngine.js';
export function runZenGardenCycle(ctx) {
    const now = Date.now();
    // For all completed sessions that don't yet have rewards, compute recommendations
    const sessions = GardenStore.listSessions().filter((s) => s.state === "completed");
    sessions.forEach((session) => {
        computeRewardsForSession(ctx, session);
    });
    GardenStore.setLastRunAt(now);
    // Optional: send a summary into NeuralMesh
    if (ctx.neuralMesh?.remember) {
        const status = GardenStore.status();
        ctx.neuralMesh.remember({
            source: "ZenGardenCore",
            sessionCount: status.sessionCount,
            rewardCount: status.rewardCount,
            timestamp: now,
        });
    }
    return GardenStore.status();
}
//# sourceMappingURL=gardenScheduler.js.map