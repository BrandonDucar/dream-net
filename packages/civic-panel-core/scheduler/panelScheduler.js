import { CommandStore } from "../store/commandStore";
import { buildDashboardSnapshot } from "../logic/statusAggregator";
import { processCommands } from "../logic/commandHandler";
export async function runCivicPanelCycle(ctx) {
    const now = Date.now();
    // 1) Process queued commands (safe refreshes only)
    await processCommands(ctx);
    // 2) Rebuild dashboard snapshot
    const snapshot = buildDashboardSnapshot(ctx);
    CommandStore.setSnapshot(snapshot);
    // 3) Update lastRunAt
    CommandStore.setLastRunAt(now);
    // 4) Optional: push quick summary into NeuralMesh
    if (ctx.neuralMesh?.remember) {
        ctx.neuralMesh.remember({
            source: "CivicPanelCore",
            widgets: snapshot.widgets.length,
            recentCommands: snapshot.recentCommands.length,
            timestamp: now,
        });
    }
    return CommandStore.status();
}
