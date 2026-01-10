export declare function seedInitialLiquidityConfigs(): void;
/**
 * Helper to mark a pool as "deployed" once you have an on-chain pair address.
 * This does NOT seed any liquidity.
 */
export declare function markPoolDeployed(configId: string, pairAddress: string): void;
/**
 * Helper to mark a pool as "active" (e.g. once you HAVE seeded liquidity later).
 * We are not doing seeding logic now — this is just for future wiring.
 */
export declare function markPoolActive(configId: string): void;
