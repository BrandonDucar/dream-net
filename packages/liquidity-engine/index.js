import { LiquidityStore } from "./store/liquidityStore";
import { runLiquidityEngineCycle, ensureLiquidityConfigsInitialized } from "./scheduler/liquidityScheduler";
import { markPoolDeployed, markPoolActive } from "./logic/poolPlanner";
export const LiquidityEngine = {
    initConfigs() {
        ensureLiquidityConfigsInitialized();
    },
    upsertConfig(config) {
        return LiquidityStore.upsertConfig(config);
    },
    getConfig(id) {
        return LiquidityStore.getConfig(id);
    },
    listConfigs() {
        return LiquidityStore.listConfigs();
    },
    getStatus(configId) {
        return LiquidityStore.getStatus(configId);
    },
    listStatuses() {
        return LiquidityStore.listStatuses();
    },
    markPoolDeployed(configId, pairAddress) {
        return markPoolDeployed(configId, pairAddress);
    },
    markPoolActive(configId) {
        return markPoolActive(configId);
    },
    run(context) {
        return runLiquidityEngineCycle(context);
    },
    status() {
        return LiquidityStore.status();
    },
};
export * from "./types";
export default LiquidityEngine;
