export type RepEntityType = "dream" | "agent" | "service" | "route" | "wormhole" | "wallet" | "generic";
export interface ReputationSignal {
    id: string;
    entityType: RepEntityType;
    entityId: string;
    source: string;
    weight: number;
    value: number;
    createdAt: number;
    meta?: Record<string, any>;
}
export interface ReputationScore {
    entityType: RepEntityType;
    entityId: string;
    score: number;
    lastUpdatedAt: number;
    signalCount: number;
}
export interface ReputationConfig {
    decayHalfLifeMs: number;
    minSignalsForStableScore?: number;
}
export interface ReputationContext {
    wolfPack?: any;
    slugTime?: any;
    starBridge?: any;
    dreamCortex?: any;
    neuralMesh?: any;
}
export interface ReputationStatus {
    lastRunAt: number | null;
    entityCount: number;
    signalCount: number;
    scoresSample: ReputationScore[];
}
