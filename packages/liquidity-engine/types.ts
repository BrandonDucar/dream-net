export type ChainId =
  | "base"
  | "ethereum"
  | "unknown";

export type PoolState =
  | "planned"     // intended, not on-chain yet
  | "deployed"    // pair contract exists, but may be empty
  | "active"      // has liquidity + live trading
  | "deprecated"; // no longer used or visible

export type PoolHealth =
  | "unknown"
  | "thin"
  | "healthy"
  | "imbalanced";

export interface TokenSide {
  symbol: string;          // "DREAM", "SHEEP", "AERO", "ETH", "USDT"
  address?: string;        // optional for now (can be filled later)
  decimals?: number;       // optional, defaults can be inferred later
  chain: ChainId;
}

export interface LiquidityPoolConfig {
  id: string;              // internal id, e.g. "pool:DREAM-AERO"
  label: string;           // user-friendly name
  tokenA: TokenSide;
  tokenB: TokenSide;

  preferred?: boolean;     // primary pair for this token
  category?: "growth" | "prestige" | "stable" | "experimental";

  // Optional: planned routing priority, 1 = highest
  routingPriority?: number;

  // On-chain specific fields can be added later
  dex?: "aerodrome" | "uniswap-v3" | "unknown";
  pairAddress?: string;    // to be filled once deployed
}

export interface LiquidityPoolStatus {
  configId: string;

  state: PoolState;
  health: PoolHealth;

  // All numeric values are placeholders for now – no on-chain reads yet
  // Can be filled later by blockchain indexers or oracles.
  totalLiquidityUSD?: number;
  volume24hUSD?: number;
  feeAprEstimate?: number;

  // Whether initial seeding has been performed
  seeded?: boolean;

  // Last updated timestamp
  updatedAt: number;
}

export interface LiquidityEngineContext {
  fieldLayer?: any;        // optional, for risk/trust fields later
  neuralMesh?: any;        // optional, for memory
  civicPanelCore?: any;    // optional, may consume statuses
}

export interface LiquidityEngineStatus {
  lastRunAt: number | null;
  poolCount: number;
  plannedCount: number;
  deployedCount: number;
  activeCount: number;
  samplePools: Array<{
    config: LiquidityPoolConfig;
    status: LiquidityPoolStatus;
  }>;
}

