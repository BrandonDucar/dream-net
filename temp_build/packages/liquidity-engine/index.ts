import type {
  ChainId,
  PoolState,
  PoolHealth,
  TokenSide,
  LiquidityPoolConfig,
  LiquidityPoolStatus,
  LiquidityEngineContext,
  LiquidityEngineStatus,
} from "./types";
import { LiquidityStore } from "./store/liquidityStore";
import { runLiquidityEngineCycle, ensureLiquidityConfigsInitialized } from "./scheduler/liquidityScheduler";
import { markPoolDeployed, markPoolActive } from "./logic/poolPlanner";

export const LiquidityEngine = {
  initConfigs() {
    ensureLiquidityConfigsInitialized();
  },

  upsertConfig(config: LiquidityPoolConfig) {
    return LiquidityStore.upsertConfig(config);
  },

  getConfig(id: string) {
    return LiquidityStore.getConfig(id);
  },

  listConfigs() {
    return LiquidityStore.listConfigs();
  },

  getStatus(configId: string) {
    return LiquidityStore.getStatus(configId);
  },

  listStatuses() {
    return LiquidityStore.listStatuses();
  },

  markPoolDeployed(configId: string, pairAddress: string) {
    return markPoolDeployed(configId, pairAddress);
  },

  markPoolActive(configId: string) {
    return markPoolActive(configId);
  },

  run(context: LiquidityEngineContext): LiquidityEngineStatus {
    return runLiquidityEngineCycle(context);
  },

  status(): LiquidityEngineStatus {
    return LiquidityStore.status();
  },
};

export * from "./types";
export default LiquidityEngine;

