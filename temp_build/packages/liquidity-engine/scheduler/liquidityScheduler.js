"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureLiquidityConfigsInitialized = ensureLiquidityConfigsInitialized;
exports.runLiquidityEngineCycle = runLiquidityEngineCycle;
const liquidityStore_1 = require("../store/liquidityStore");
const poolPlanner_1 = require("../logic/poolPlanner");
const sluPoolPlanner_1 = require("../logic/sluPoolPlanner");
let initialized = false;
function ensureLiquidityConfigsInitialized() {
    if (initialized)
        return;
    (0, poolPlanner_1.seedInitialLiquidityConfigs)();
    // Seeding SLU Pools with placeholder Staked SPK address
    // In production, this would come from EnvKeeper or a registry
    (0, sluPoolPlanner_1.seedSLUPoolConfigs)("0x0000000000000000000000000000000000000000");
    initialized = true;
}
function runLiquidityEngineCycle(ctx) {
    const now = Date.now();
    // Ensure configs are in place
    ensureLiquidityConfigsInitialized();
    // In the future, we can enrich statuses from FieldLayer, or from chain indexers.
    // For now, just push a basic summary to NeuralMesh (if available).
    const status = liquidityStore_1.LiquidityStore.status();
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
    liquidityStore_1.LiquidityStore.setLastRunAt(now);
    return status;
}
