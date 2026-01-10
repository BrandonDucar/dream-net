export interface DreamTokenConfig {
    maxSupply: string;
    decimals: number;
    symbol: "DREAM";
    name: "DreamNet Token";
    emissionModel: "fixed" | "emissions" | "manual";
}
export interface DreamOnchainAccount {
    userId: string;
    baseAddress?: string;
    onchainBalance?: string;
    claimableBalance?: string;
    lastSyncedAt?: string;
}
export type DreamTokenEventType = "mint" | "burn" | "reserve" | "sync" | "reward";
export interface DreamTokenEvent {
    id: string;
    type: DreamTokenEventType;
    userId?: string;
    amount: string;
    createdAt: string;
    meta?: Record<string, unknown>;
}
