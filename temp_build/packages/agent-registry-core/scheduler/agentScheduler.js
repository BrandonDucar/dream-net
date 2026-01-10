"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAgentRegistryCycle = runAgentRegistryCycle;
const agentStore_1 = require("../store/agentStore");
const healthUpdater_1 = require("../logic/healthUpdater");
function runAgentRegistryCycle(ctx) {
    const now = Date.now();
    (0, healthUpdater_1.ensureDefaultAgentsSeeded)();
    (0, healthUpdater_1.refreshAgentScores)(ctx);
    agentStore_1.AgentStore.setLastRunAt(now);
    const status = agentStore_1.AgentStore.status();
    // Optional: NarrativeField log
    if (ctx.narrativeField?.add && status.agentCount > 0) {
        ctx.narrativeField.add({
            id: `narrative-agents-${now}`,
            timestamp: now,
            title: "Agent Registry Snapshot",
            summary: `Tracking ${status.agentCount} agents (active=${status.activeCount}, degraded=${status.degradedCount}, error=${status.errorCount}).`,
            severity: status.errorCount > 0 ? "warning" : "info",
            domain: "infra",
            tags: ["agents", "registry"],
            references: status.sampleAgents.map((a) => ({
                kind: "service",
                id: a.config.id,
                label: a.config.name,
            })),
            meta: { status },
        });
    }
    // Optional: NeuralMesh
    if (ctx.neuralMesh?.remember) {
        ctx.neuralMesh.remember({
            source: "AgentRegistryCore",
            agentCount: status.agentCount,
            errorCount: status.errorCount,
            timestamp: now,
        });
    }
    return status;
}
