import type { LiquidityEngineContext, LiquidityEngineStatus } from "../types";
import { LiquidityStore } from "../store/liquidityStore";
import { seedInitialLiquidityConfigs } from "../logic/poolPlanner";
import { seedSLUPoolConfigs } from "../logic/sluPoolPlanner";

let initialized = false;

export function ensureLiquidityConfigsInitialized() {
  if (initialized) return;
  seedInitialLiquidityConfigs();
  // Seeding SLU Pools with placeholder Staked SPK address
  // In production, this would come from EnvKeeper or a registry
  seedSLUPoolConfigs("0x0000000000000000000000000000000000000000");
  initialized = true;
}

export function runLiquidityEngineCycle(ctx: LiquidityEngineContext): LiquidityEngineStatus {
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

