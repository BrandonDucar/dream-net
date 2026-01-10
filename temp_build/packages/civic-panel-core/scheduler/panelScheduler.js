"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCivicPanelCycle = runCivicPanelCycle;
const commandStore_1 = require("../store/commandStore");
const statusAggregator_1 = require("../logic/statusAggregator");
const commandHandler_1 = require("../logic/commandHandler");
async function runCivicPanelCycle(ctx) {
    const now = Date.now();
    // 1) Process queued commands (safe refreshes only)
    await (0, commandHandler_1.processCommands)(ctx);
    // 2) Rebuild dashboard snapshot
    const snapshot = (0, statusAggregator_1.buildDashboardSnapshot)(ctx);
    commandStore_1.CommandStore.setSnapshot(snapshot);
    // 3) Update lastRunAt
    commandStore_1.CommandStore.setLastRunAt(now);
    // 4) Optional: push quick summary into NeuralMesh
    if (ctx.neuralMesh?.remember) {
        ctx.neuralMesh.remember({
            source: "CivicPanelCore",
            widgets: snapshot.widgets.length,
            recentCommands: snapshot.recentCommands.length,
            timestamp: now,
        });
    }
    return commandStore_1.CommandStore.status();
}
