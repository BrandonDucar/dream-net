export type ChainId = "base" | "ethereum" | "solana" | "polygon" | "arbitrum" | "avalanche" | "near" | "monad" | "unknown";
export type BreathDirection = "inhale" | "exhale";
export interface ChainBreathMetrics {
    chain: ChainId;
    gasPressure: number;
    liquidityPressure: number;
    congestion: number;
    reliability: number;
    lastUpdatedAt: number;
}
export interface BreathSnapshot {
    id: string;
    fromChain: ChainId;
    toChain: ChainId;
    direction: BreathDirection;
    pressureScore: number;
    recommended: boolean;
    meta?: Record<string, any>;
    createdAt: number;
}
export interface StarBridgeContext {
    neuralMesh?: any;
    quantumAnticipation?: any;
    slugTimeMemory?: any;
    slimeRouter?: any;
}
export interface StarBridgeStatus {
    lastRunAt: number | null;
    chainMetrics: ChainBreathMetrics[];
    lastBreaths: BreathSnapshot[];
}
