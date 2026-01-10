import type { LiquidityPoolConfig, LiquidityPoolStatus, LiquidityEngineStatus } from "../types";
export declare const LiquidityStore: {
    upsertConfig(config: LiquidityPoolConfig): LiquidityPoolConfig;
    getConfig(id: string): LiquidityPoolConfig | undefined;
    listConfigs(): LiquidityPoolConfig[];
    upsertStatus(status: LiquidityPoolStatus): LiquidityPoolStatus;
    getStatus(configId: string): LiquidityPoolStatus | undefined;
    listStatuses(): LiquidityPoolStatus[];
    setLastRunAt(ts: number | null): void;
    status(): LiquidityEngineStatus;
};
