export type ChainId =
  | "base"
  | "ethereum"
  | "solana"
  | "polygon"
  | "arbitrum"
  | "avalanche"
  | "near"
  | "monad"
  | "unknown";

export type BreathDirection = "inhale" | "exhale";

export interface ChainBreathMetrics {
  chain: ChainId;
  gasPressure: number;        // 0–1 (heuristic)
  liquidityPressure: number;  // 0–1 (USDC/bridge pressure)
  congestion: number;         // 0–1
  reliability: number;        // 0–1
  lastUpdatedAt: number;
}

export interface BreathSnapshot {
  id: string;
  fromChain: ChainId;
  toChain: ChainId;
  direction: BreathDirection;
  pressureScore: number;       // 0–1
  recommended: boolean;
  meta?: Record<string, any>;
  createdAt: number;
}

export interface StarBridgeContext {
  neuralMesh?: any;
  quantumAnticipation?: any;
  slugTimeMemory?: any;
  slimeRouter?: any;         // event-wormholes routing
}

export interface StarBridgeStatus {
  lastRunAt: number | null;
  chainMetrics: ChainBreathMetrics[];
  lastBreaths: BreathSnapshot[];
}

