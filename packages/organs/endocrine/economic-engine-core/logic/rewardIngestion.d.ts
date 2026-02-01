import type { EconomicEngineContext, RawRewardEvent, AppliedReward } from '../types.js';
/**
 * Core function: apply all matching emission rules to a raw reward event.
 * This updates balances and records AppliedReward entries.
 */
export declare function applyEmissionForReward(ev: RawRewardEvent): AppliedReward[];
/**
 * Ingest pending rewards from other systems (future extension).
 * For now, this module expects callers to feed RawRewardEvent objects explicitly.
 */
export declare function ensureEconomicConfig(ctx: EconomicEngineContext): void;
//# sourceMappingURL=rewardIngestion.d.ts.map