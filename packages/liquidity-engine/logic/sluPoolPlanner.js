/**
 * SLU Pool Planner - Configuration for Staked Liquidity Units pools
 */
import { LiquidityStore } from '../store/liquidityStore.js';
/**
 * Seed initial SLU pool configurations
 */
export function seedSLUPoolConfigs(stSPKAddress) {
    const baseChain = "base";
    // Token definitions
    const stSPK = {
        symbol: "stSPK",
        address: stSPKAddress,
        chain: baseChain,
    };
    const DREAM = {
        symbol: "DREAM",
        chain: baseChain,
    };
    const USDT = {
        symbol: "USDT",
        chain: baseChain,
    };
    const ETH = {
        symbol: "ETH",
        chain: baseChain, // wETH on Base
    };
    const SOL = {
        symbol: "SOL",
        chain: baseChain, // wSOL on Base (bridged)
    };
    const configs = [
        {
            id: "slu:stSPK-DREAM",
            label: "stSPK / DREAM",
            tokenA: stSPK,
            tokenB: DREAM,
            preferred: true,
            category: "growth",
            routingPriority: 1,
            dex: "unknown", // Custom SLU pool
            isStakedPool: true,
            stSPKAddress: stSPKAddress,
        },
        {
            id: "slu:stSPK-USDT",
            label: "stSPK / USDT",
            tokenA: stSPK,
            tokenB: USDT,
            preferred: true,
            category: "stable",
            routingPriority: 1,
            dex: "unknown",
            isStakedPool: true,
            stSPKAddress: stSPKAddress,
        },
        {
            id: "slu:stSPK-ETH",
            label: "stSPK / ETH",
            tokenA: stSPK,
            tokenB: ETH,
            preferred: true,
            category: "prestige",
            routingPriority: 1,
            dex: "unknown",
            isStakedPool: true,
            stSPKAddress: stSPKAddress,
        },
        {
            id: "slu:stSPK-SOL",
            label: "stSPK / SOL",
            tokenA: stSPK,
            tokenB: SOL,
            preferred: true,
            category: "experimental",
            routingPriority: 1,
            dex: "unknown",
            isStakedPool: true,
            stSPKAddress: stSPKAddress,
        },
    ];
    configs.forEach((cfg) => LiquidityStore.upsertConfig(cfg));
    return configs;
}
/**
 * Mark SLU pool as deployed
 */
export function markSLUPoolDeployed(configId, poolAddress, wrapperAddress) {
    const status = LiquidityStore.getStatus(configId);
    if (!status)
        return;
    const now = Date.now();
    LiquidityStore.upsertStatus({
        ...status,
        state: "deployed",
        updatedAt: now,
    });
    const cfg = LiquidityStore.getConfig(configId);
    if (cfg && 'isStakedPool' in cfg && cfg.isStakedPool) {
        const sluConfig = cfg;
        LiquidityStore.upsertConfig({
            ...sluConfig,
            pairAddress: poolAddress,
            sluPoolAddress: poolAddress,
            wrapperAddress: wrapperAddress,
        });
    }
}
/**
 * Mark SLU pool as active (seeded with liquidity)
 */
export function markSLUPoolActive(configId) {
    const status = LiquidityStore.getStatus(configId);
    if (!status)
        return;
    const now = Date.now();
    LiquidityStore.upsertStatus({
        ...status,
        state: "active",
        health: status.health === "unknown" ? "healthy" : status.health,
        seeded: true,
        updatedAt: now,
    });
}
//# sourceMappingURL=sluPoolPlanner.js.map