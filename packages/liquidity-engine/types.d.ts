export type ChainId = "base" | "ethereum" | "unknown";
export type PoolState = "planned" | "deployed" | "active" | "deprecated";
export type PoolHealth = "unknown" | "thin" | "healthy" | "imbalanced";
export interface TokenSide {
    symbol: string;
    address?: string;
    decimals?: number;
    chain: ChainId;
}
export interface LiquidityPoolConfig {
    id: string;
    label: string;
    tokenA: TokenSide;
    tokenB: TokenSide;
    preferred?: boolean;
    category?: "growth" | "prestige" | "stable" | "experimental";
    routingPriority?: number;
    dex?: "aerodrome" | "uniswap-v3" | "unknown";
    pairAddress?: string;
}
export interface LiquidityPoolStatus {
    configId: string;
    state: PoolState;
    health: PoolHealth;
    totalLiquidityUSD?: number;
    volume24hUSD?: number;
    feeAprEstimate?: number;
    seeded?: boolean;
    updatedAt: number;
}
export interface LiquidityEngineContext {
    fieldLayer?: any;
    neuralMesh?: any;
    civicPanelCore?: any;
}
export interface LiquidityEngineStatus {
    lastRunAt: number | null;
    poolCount: number;
    plannedCount: number;
    deployedCount: number;
    activeCount: number;
    samplePools: Array<{
        config: LiquidityPoolConfig;
        status: LiquidityPoolStatus;
    }>;
}
export interface SLUPoolConfig extends LiquidityPoolConfig {
    isStakedPool: boolean;
    stSPKAddress?: string;
    sluPoolAddress?: string;
    wrapperAddress?: string;
}
//# sourceMappingURL=types.d.ts.map