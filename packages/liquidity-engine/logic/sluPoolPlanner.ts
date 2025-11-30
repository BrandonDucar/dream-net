/**
 * SLU Pool Planner - Configuration for Staked Liquidity Units pools
 */

import type { SLUPoolConfig } from "../types";
import { LiquidityStore } from "../store/liquidityStore";

/**
 * Seed initial SLU pool configurations
 */
export function seedSLUPoolConfigs(stSPKAddress: string): SLUPoolConfig[] {
  const baseChain = "base" as const;

  // Token definitions
  const stSPK: Partial<SLUPoolConfig["tokenA"]> = {
    symbol: "stSPK",
    address: stSPKAddress,
    chain: baseChain,
  };

  const DREAM: Partial<SLUPoolConfig["tokenA"]> = {
    symbol: "DREAM",
    chain: baseChain,
  };

  const USDT: Partial<SLUPoolConfig["tokenA"]> = {
    symbol: "USDT",
    chain: baseChain,
  };

  const ETH: Partial<SLUPoolConfig["tokenA"]> = {
    symbol: "ETH",
    chain: baseChain, // wETH on Base
  };

  const SOL: Partial<SLUPoolConfig["tokenA"]> = {
    symbol: "SOL",
    chain: baseChain, // wSOL on Base (bridged)
  };

  const configs: SLUPoolConfig[] = [
    {
      id: "slu:stSPK-DREAM",
      label: "stSPK / DREAM",
      tokenA: stSPK as any,
      tokenB: DREAM as any,
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
      tokenA: stSPK as any,
      tokenB: USDT as any,
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
      tokenA: stSPK as any,
      tokenB: ETH as any,
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
      tokenA: stSPK as any,
      tokenB: SOL as any,
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
export function markSLUPoolDeployed(
  configId: string,
  poolAddress: string,
  wrapperAddress?: string
): void {
  const status = LiquidityStore.getStatus(configId);
  if (!status) return;

  const now = Date.now();

  LiquidityStore.upsertStatus({
    ...status,
    state: "deployed",
    updatedAt: now,
  });

  const cfg = LiquidityStore.getConfig(configId);
  if (cfg && 'isStakedPool' in cfg && cfg.isStakedPool) {
    const sluConfig = cfg as SLUPoolConfig;
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
export function markSLUPoolActive(configId: string): void {
  const status = LiquidityStore.getStatus(configId);
  if (!status) return;

  const now = Date.now();

  LiquidityStore.upsertStatus({
    ...status,
    state: "active",
    health: status.health === "unknown" ? "healthy" : status.health,
    seeded: true,
    updatedAt: now,
  });
}

