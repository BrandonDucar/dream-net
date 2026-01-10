import type { EconTokenConfig, EconTokenSymbol, BalanceRecord, RawRewardEvent, EmissionRule, AppliedReward, EconomicEngineStatus } from "../types";
export declare const EconStore: {
    upsertTokenConfig(cfg: EconTokenConfig): EconTokenConfig;
    listTokenConfigs(): EconTokenConfig[];
    getBalance(identityId: string, token: EconTokenSymbol): BalanceRecord;
    setBalance(identityId: string, token: EconTokenSymbol, amount: number): BalanceRecord;
    adjustBalance(identityId: string, token: EconTokenSymbol, delta: number): BalanceRecord;
    listBalances(): BalanceRecord[];
    addRawReward(ev: RawRewardEvent): void;
    listRawRewards(): RawRewardEvent[];
    addEmissionRule(rule: EmissionRule): void;
    listEmissionRules(): EmissionRule[];
    addAppliedReward(ar: AppliedReward): void;
    listAppliedRewards(): AppliedReward[];
    setLastRunAt(ts: number | null): void;
    status(): EconomicEngineStatus;
};
