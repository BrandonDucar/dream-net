/**
 * SLU Pool Planner - Configuration for Staked Liquidity Units pools
 */
import type { SLUPoolConfig } from '../types.js';
/**
 * Seed initial SLU pool configurations
 */
export declare function seedSLUPoolConfigs(stSPKAddress: string): SLUPoolConfig[];
/**
 * Mark SLU pool as deployed
 */
export declare function markSLUPoolDeployed(configId: string, poolAddress: string, wrapperAddress?: string): void;
/**
 * Mark SLU pool as active (seeded with liquidity)
 */
export declare function markSLUPoolActive(configId: string): void;
//# sourceMappingURL=sluPoolPlanner.d.ts.map