import { LiquidityStore } from "../store/liquidityStore";
import { seedInitialLiquidityConfigs } from "../logic/poolPlanner";
let initialized = false;
export function ensureLiquidityConfigsInitialized() {
    if (initialized)
        return;
    seedInitialLiquidityConfigs();
    initialized = true;
}
export function runLiquidityEngineCycle(ctx) {
    const now = Date.now();
    // Ensure configs are in place
    ensureLiquidityConfigsInitialized();
    // In the future, we can enrich statuses from FieldLayer, or from chain indexers.
    // For now, just push a basic summary to NeuralMesh (if available).
    const status = LiquidityStore.status();
    if (ctx.neuralMesh?.remember) {
        ctx.neuralMesh.remember({
            source: "LiquidityEngine",
            poolCount: status.poolCount,
            plannedCount: status.plannedCount,
            deployedCount: status.deployedCount,
            activeCount: status.activeCount,
            timestamp: now,
        });
    }
    LiquidityStore.setLastRunAt(now);
    return status;
}
