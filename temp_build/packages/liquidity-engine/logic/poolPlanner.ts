import type { LiquidityPoolConfig } from "../types";
import { LiquidityStore } from "../store/liquidityStore";

export function seedInitialLiquidityConfigs() {
  // NOTE:
  // Addresses are intentionally left undefined or as placeholders for now.
  // They can be filled in once the real token contracts and pools are deployed.

  const baseChain = "base" as const;
  const ethChain = "ethereum" as const;

  // Core token sides (addresses can be filled in later)
  const DREAM: Partial<LiquidityPoolConfig["tokenA"]> = {
    symbol: "DREAM",
    chain: baseChain,
  };

  const SHEEP: Partial<LiquidityPoolConfig["tokenA"]> = {
    symbol: "SHEEP",
    chain: baseChain,
  };

  const AERO: Partial<LiquidityPoolConfig["tokenA"]> = {
    symbol: "AERO",
    chain: baseChain,
  };

  const ETH: Partial<LiquidityPoolConfig["tokenA"]> = {
    symbol: "ETH",
    chain: ethChain,
  };

  const USDT: Partial<LiquidityPoolConfig["tokenA"]> = {
    symbol: "USDT",
    chain: baseChain, // or ethChain depending on how you model it later
  };

  const configs: LiquidityPoolConfig[] = [
    // DREAM pairs
    {
      id: "pool:DREAM-AERO",
      label: "DREAM / AERO",
      tokenA: DREAM as any,
      tokenB: AERO as any,
      preferred: true,
      category: "growth",
      routingPriority: 1,
      dex: "aerodrome",
    },
    {
      id: "pool:DREAM-ETH",
      label: "DREAM / ETH",
      tokenA: DREAM as any,
      tokenB: ETH as any,
      preferred: false,
      category: "prestige",
      routingPriority: 2,
      dex: "aerodrome",
    },
    {
      id: "pool:DREAM-USDT",
      label: "DREAM / USDT",
      tokenA: DREAM as any,
      tokenB: USDT as any,
      preferred: false,
      category: "stable",
      routingPriority: 2,
      dex: "aerodrome",
    },

    // SHEEP pairs (ready, can be activated later)
    {
      id: "pool:SHEEP-AERO",
      label: "SHEEP / AERO",
      tokenA: SHEEP as any,
      tokenB: AERO as any,
      preferred: true,
      category: "growth",
      routingPriority: 1,
      dex: "aerodrome",
    },
    {
      id: "pool:SHEEP-ETH",
      label: "SHEEP / ETH",
      tokenA: SHEEP as any,
      tokenB: ETH as any,
      preferred: false,
      category: "prestige",
      routingPriority: 2,
      dex: "aerodrome",
    },
    {
      id: "pool:SHEEP-USDT",
      label: "SHEEP / USDT",
      tokenA: SHEEP as any,
      tokenB: USDT as any,
      preferred: false,
      category: "stable",
      routingPriority: 2,
      dex: "aerodrome",
    },
  ];

  configs.forEach((cfg) => LiquidityStore.upsertConfig(cfg));
}

/**
 * Helper to mark a pool as "deployed" once you have an on-chain pair address.
 * This does NOT seed any liquidity.
 */
export function markPoolDeployed(configId: string, pairAddress: string) {
  const status = LiquidityStore.getStatus(configId);
  if (!status) return;

  const now = Date.now();

  LiquidityStore.upsertStatus({
    ...status,
    state: "deployed",
    updatedAt: now,
  });

  const cfg = LiquidityStore.getConfig(configId);
  if (cfg) {
    LiquidityStore.upsertConfig({
      ...cfg,
      pairAddress,
    });
  }
}

/**
 * Helper to mark a pool as "active" (e.g. once you HAVE seeded liquidity later).
 * We are not doing seeding logic now — this is just for future wiring.
 */
export function markPoolActive(configId: string) {
  const status = LiquidityStore.getStatus(configId);
  if (!status) return;

  const now = Date.now();

  LiquidityStore.upsertStatus({
    ...status,
    state: "active",
    health: status.health === "unknown" ? "thin" : status.health,
    seeded: true,
    updatedAt: now,
  });
}

