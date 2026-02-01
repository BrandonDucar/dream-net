import { LiquidityStore } from './store/liquidityStore.js';
import { runLiquidityEngineCycle, ensureLiquidityConfigsInitialized } from './scheduler/liquidityScheduler.js';
import { markPoolDeployed, markPoolActive } from './logic/poolPlanner.js';
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
export * from './types.js';
export default LiquidityEngine;
export { createLiquidityRouter } from './src/router.js';
//# sourceMappingURL=index.js.map