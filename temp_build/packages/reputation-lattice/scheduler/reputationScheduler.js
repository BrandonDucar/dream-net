"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runReputationCycle = runReputationCycle;
exports.reputationStatus = reputationStatus;
const reputationStore_1 = require("../store/reputationStore");
const reputationAggregator_1 = require("../logic/reputationAggregator");
const reputationScorer_1 = require("../logic/reputationScorer");
let lastRunAt = null;
function runReputationCycle(ctx) {
    const now = Date.now();
    // 1) Ingest fresh signals from subsystems
    (0, reputationAggregator_1.ingestExternalSignals)(ctx);
    // 2) Recompute scores with decay
    (0, reputationScorer_1.recomputeReputation)(now);
    lastRunAt = now;
    // 3) Optionally push a snapshot into NeuralMesh
    if (ctx.neuralMesh?.remember) {
        const st = reputationStore_1.ReputationStore.status();
        ctx.neuralMesh.remember({
            source: "ReputationLattice",
            status: st,
            timestamp: now,
        });
    }
    return reputationStatus();
}
function reputationStatus() {
    const st = reputationStore_1.ReputationStore.status();
    return {
        lastRunAt,
        entityCount: st.entityCount,
        signalCount: st.signalCount,
        scoresSample: st.scoresSample,
    };
}
