import { ReputationStore } from '../store/reputationStore.js';
import { ingestExternalSignals } from '../logic/reputationAggregator.js';
import { recomputeReputation } from '../logic/reputationScorer.js';
let lastRunAt = null;
export function runReputationCycle(ctx) {
    const now = Date.now();
    // 1) Ingest fresh signals from subsystems
    ingestExternalSignals(ctx);
    // 2) Recompute scores with decay
    recomputeReputation(now);
    lastRunAt = now;
    // 3) Optionally push a snapshot into NeuralMesh
    if (ctx.neuralMesh?.remember) {
        const st = ReputationStore.status();
        ctx.neuralMesh.remember({
            source: "ReputationLattice",
            status: st,
            timestamp: now,
        });
    }
    return reputationStatus();
}
export function reputationStatus() {
    const st = ReputationStore.status();
    return {
        lastRunAt,
        entityCount: st.entityCount,
        signalCount: st.signalCount,
        scoresSample: st.scoresSample,
    };
}
//# sourceMappingURL=reputationScheduler.js.map