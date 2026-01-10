export interface DreamTokenConfig {
  maxSupply: string; // "1000000000" as text
  decimals: number; // 18
  symbol: "DREAM";
  name: "DreamNet Token";
  emissionModel: "fixed" | "emissions" | "manual";
}

export interface DreamOnchainAccount {
  userId: string;
  baseAddress?: string;
  onchainBalance?: string; // string to hold big amounts
  claimableBalance?: string; // internal claimable amount (pre-mint buffer)
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

