"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRuntimeContext = initRuntimeContext;
exports.runRuntimeCycleOnce = runRuntimeCycleOnce;
exports.startRuntimeLoop = startRuntimeLoop;
exports.stopRuntimeLoop = stopRuntimeLoop;
const runtimeStore_1 = require("../store/runtimeStore");
/**
 * This module wires OrchestratorCore + OSCore + CivicPanelCore + EconCore together.
 * It does NOT own the subsystems; they are provided via RuntimeContext.
 */
let currentContext;
let cycleTimer;
let cycleCounter = 0;
function initRuntimeContext(ctx) {
    currentContext = ctx;
    runtimeStore_1.RuntimeStore.markInitialized();
}
/**
 * Run a single orchestrator cycle and then refresh status snapshots.
 */
async function runRuntimeCycleOnce() {
    if (!currentContext)
        return;
    const ctx = currentContext;
    const startedAt = Date.now();
    let error;
    try {
        if (ctx.OrchestratorCore?.runSingleCycle) {
            await ctx.OrchestratorCore.runSingleCycle({
                DreamVault: ctx.DreamVault,
                DreamShop: ctx.DreamShop,
                FieldLayer: ctx.FieldLayer,
                DreamBetCore: ctx.DreamBetCore,
                ZenGardenCore: ctx.ZenGardenCore,
                CivicPanelCore: ctx.CivicPanelCore,
                DreamTankCore: ctx.DreamTankCore,
                LiquidityEngine: ctx.LiquidityEngine,
                SocialHubCore: ctx.SocialHubCore,
                InitRitualCore: ctx.InitRitualCore,
                EconomicEngineCore: ctx.EconomicEngineCore,
                AgentRegistryCore: ctx.AgentRegistryCore,
                DreamNetOSCore: ctx.DreamNetOSCore,
                WolfPackFundingCore: ctx.WolfPackFundingCore,
                WolfPackAnalystCore: ctx.WolfPackAnalystCore,
                IdentityGrid: ctx.IdentityGrid,
                ReputationLattice: ctx.ReputationLattice,
                NarrativeField: ctx.NarrativeField,
                NeuralMesh: ctx.NeuralMesh,
            });
        }
        // After cycle, pull high-level statuses
        if (ctx.DreamNetOSCore?.status) {
            const os = ctx.DreamNetOSCore.status();
            runtimeStore_1.RuntimeStore.updateOSStatus(os);
        }
        if (ctx.CivicPanelCore?.status) {
            const civ = ctx.CivicPanelCore.status();
            runtimeStore_1.RuntimeStore.updateCivicStatus(civ);
        }
        if (ctx.EconomicEngineCore?.status) {
            const econ = ctx.EconomicEngineCore.status();
            runtimeStore_1.RuntimeStore.updateEconStatus(econ);
        }
    }
    catch (err) {
        error = String(err);
    }
    const finishedAt = Date.now();
    const durationMs = finishedAt - startedAt;
    runtimeStore_1.RuntimeStore.updateCycleInfo({
        finishedAt,
        durationMs,
        error,
    });
    cycleCounter += 1;
}
/**
 * Start a background loop. Caller is responsible for managing lifecycle in Node.
 */
function startRuntimeLoop(intervalMs = 5000) {
    if (!currentContext)
        return;
    if (cycleTimer)
        return cycleTimer;
    cycleTimer = setInterval(() => {
        void runRuntimeCycleOnce();
    }, intervalMs);
    return cycleTimer;
}
/**
 * Stop the background loop.
 */
function stopRuntimeLoop() {
    if (cycleTimer) {
        clearInterval(cycleTimer);
        cycleTimer = undefined;
    }
}
