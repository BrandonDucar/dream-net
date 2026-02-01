import { RuntimeContext } from '../types.js';
import { RuntimeStore } from '../store/runtimeStore.js';

/**
 * This module wires OrchestratorCore + OSCore + CivicPanelCore + EconCore together.
 * It does NOT own the subsystems; they are provided via RuntimeContext.
 */

let currentContext: RuntimeContext | undefined;
let cycleTimer: NodeJS.Timeout | undefined;
let cycleCounter = 0;

export function initRuntimeContext(ctx: RuntimeContext) {
  currentContext = ctx;
  RuntimeStore.markInitialized();
}

/**
 * Run a single orchestrator cycle and then refresh status snapshots.
 */
export async function runRuntimeCycleOnce() {
  if (!currentContext) return;

  const ctx = currentContext;
  const startedAt = Date.now();
  let error: string | undefined;

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
      RuntimeStore.updateOSStatus(os);
    }

    if (ctx.CivicPanelCore?.status) {
      const civ = ctx.CivicPanelCore.status();
      RuntimeStore.updateCivicStatus(civ);
    }

    if (ctx.EconomicEngineCore?.status) {
      const econ = ctx.EconomicEngineCore.status();
      RuntimeStore.updateEconStatus(econ);
    }
  } catch (err: any) {
    error = String(err);
  }

  const finishedAt = Date.now();
  const durationMs = finishedAt - startedAt;

  RuntimeStore.updateCycleInfo({
    finishedAt,
    durationMs,
    error,
  });

  cycleCounter += 1;
}

/**
 * Start a background loop. Caller is responsible for managing lifecycle in Node.
 */
export function startRuntimeLoop(intervalMs: number = 5000): NodeJS.Timeout | undefined {
  if (!currentContext) return;
  if (cycleTimer) return cycleTimer;

  cycleTimer = setInterval(() => {
    void runRuntimeCycleOnce();
  }, intervalMs);

  return cycleTimer;
}

/**
 * Stop the background loop.
 */
export function stopRuntimeLoop() {
  if (cycleTimer) {
    clearInterval(cycleTimer);
    cycleTimer = undefined;
  }
}

