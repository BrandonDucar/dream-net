export type EconTokenSymbol =
  | "SHEEP"
  | "DREAM"
  | "FLBY"
  | "ZEN_POINTS"
  | "VAULT_CREDITS"
  | "PLAY_TOKENS";

export interface EconTokenConfig {
  symbol: EconTokenSymbol;
  label: string;
  decimals: number;
  description?: string;
}

export interface BalanceRecord {
  identityId: string;          // IdentityGrid node id (user/wallet/agent)
  token: EconTokenSymbol;
  amount: number;              // internal, float is fine for simulation
  updatedAt: number;
}

export type RewardSource =
  | "zen-garden"
  | "dreambet"
  | "dreamvault"
  | "dreamshop"
  | "socialhub"
  | "dreamtank"
  | "init-ritual"
  | "ai-factory"
  | "system";

export type RewardKind =
  | "activity"
  | "streak"
  | "win"
  | "participation"
  | "purchase"
  | "contribution"
  | "milestone"
  | "emission"
  | "bonus";

export interface RawRewardEvent {
  id: string;
  identityId: string;
  source: RewardSource;
  kind: RewardKind;
  baseValue: number;           // abstract value [0,inf), used by emission rules
  meta?: Record<string, any>;
  createdAt: number;
  processed?: boolean;
}

export interface EmissionRule {
  id: string;
  source: RewardSource;
  kind: RewardKind;
  token: EconTokenSymbol;
  multiplier: number;          // awarded amount = baseValue * multiplier
  label?: string;
}

export interface AppliedReward {
  id: string;
  rawRewardId: string;
  identityId: string;
  token: EconTokenSymbol;
  amount: number;
  createdAt: number;
  meta?: Record<string, any>;
}

export interface EconomicEngineContext {
  identityGrid?: any;
  zenGardenCore?: any;
  dreamBetCore?: any;
  dreamVault?: any;
  dreamShop?: any;
  socialHubCore?: any;
  dreamTankCore?: any;
  initRitualCore?: any;
  fieldLayer?: any;
  narrativeField?: any;
  neuralMesh?: any;
}

export interface EconomicEngineStatus {
  lastRunAt: number | null;
  tokenCount: number;
  emissionRuleCount: number;
  balanceCount: number;
  appliedRewardCount: number;
  sampleBalances: BalanceRecord[];
}

