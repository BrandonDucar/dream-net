import type { LiquidityPoolConfig, LiquidityPoolStatus, LiquidityEngineContext, LiquidityEngineStatus } from "./types";
export declare const LiquidityEngine: {
    initConfigs(): void;
    upsertConfig(config: LiquidityPoolConfig): LiquidityPoolConfig;
    getConfig(id: string): LiquidityPoolConfig;
    listConfigs(): LiquidityPoolConfig[];
    getStatus(configId: string): LiquidityPoolStatus;
    listStatuses(): LiquidityPoolStatus[];
    markPoolDeployed(configId: string, pairAddress: string): void;
    markPoolActive(configId: string): void;
    run(context: LiquidityEngineContext): LiquidityEngineStatus;
    status(): LiquidityEngineStatus;
};
export * from "./types";
export default LiquidityEngine;
