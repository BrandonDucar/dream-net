import type { EconTokenSymbol, EconTokenConfig, BalanceRecord, RawRewardEvent, EmissionRule, AppliedReward, EconomicEngineContext, EconomicEngineStatus } from './types.js';
export declare const EconomicEngineCore: {
    ensureDefaultConfigSeeded(): void;
    listTokenConfigs(): EconTokenConfig[];
    listEmissionRules(): EmissionRule[];
    getBalance(identityId: string, token: EconTokenSymbol): BalanceRecord;
    listBalances(): BalanceRecord[];
    recordRawReward(ev: Omit<RawRewardEvent, "id" | "createdAt">): RawRewardEvent;
    applyEmissionForReward(ev: RawRewardEvent): AppliedReward[];
    listAppliedRewards(): AppliedReward[];
    run(context: EconomicEngineContext): EconomicEngineStatus;
    status(): EconomicEngineStatus;
};
export * from './types.js';
export default EconomicEngineCore;
//# sourceMappingURL=index.d.ts.map