export type FieldEntityKind = "dream" | "agent" | "service" | "route" | "wormhole" | "chain" | "wallet" | "generic";
export interface FieldPointId {
    kind: FieldEntityKind;
    id: string;
}
export type FieldName = "trust" | "risk" | "liquidity" | "load" | "dreamPriority";
export interface FieldSample {
    field: FieldName;
    point: FieldPointId;
    value: number;
    updatedAt: number;
}
export interface FieldConfig {
    decayHalfLifeMs: number;
    smoothingFactor: number;
}
export interface FieldContext {
    reputationLattice?: any;
    quantumAnticipation?: any;
    slugTimeMemory?: any;
    starBridge?: any;
    dreamCortex?: any;
    wolfPack?: any;
    predatorScavenger?: any;
    neuralMesh?: any;
}
export interface FieldStatus {
    lastRunAt: number | null;
    totalSamples: number;
    samplePreview: FieldSample[];
}
