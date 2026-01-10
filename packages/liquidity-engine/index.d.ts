import type { LiquidityPoolConfig, LiquidityPoolStatus, LiquidityEngineContext, LiquidityEngineStatus } from './types.js';
export declare const LiquidityEngine: {
    initConfigs(): void;
    upsertConfig(config: LiquidityPoolConfig): LiquidityPoolConfig;
    getConfig(id: string): LiquidityPoolConfig | undefined;
    listConfigs(): LiquidityPoolConfig[];
    getStatus(configId: string): LiquidityPoolStatus | undefined;
    listStatuses(): LiquidityPoolStatus[];
    markPoolDeployed(configId: string, pairAddress: string): void;
    markPoolActive(configId: string): void;
    run(context: LiquidityEngineContext): LiquidityEngineStatus;
    status(): LiquidityEngineStatus;
};
export * from './types.js';
export default LiquidityEngine;
export { createLiquidityRouter } from './src/router.js';
//# sourceMappingURL=index.d.ts.map