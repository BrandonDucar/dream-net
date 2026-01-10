export type FieldEntityKind =
  | "dream"
  | "agent"
  | "service"
  | "route"
  | "wormhole"
  | "chain"
  | "wallet"
  | "generic";

export interface FieldPointId {
  kind: FieldEntityKind;
  id: string;             // e.g. "dream:xyz", "chain:base"
}

export type FieldName =
  | "trust"
  | "risk"
  | "liquidity"
  | "load"
  | "dreamPriority";

export interface FieldSample {
  field: FieldName;
  point: FieldPointId;
  value: number;          // usually [0,1], but not enforced here
  updatedAt: number;
}

export interface FieldConfig {
  decayHalfLifeMs: number;  // how fast fields decay without new input
  smoothingFactor: number;  // 0–1, how much to smooth vs raw updates
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

