export type RepEntityType =
  | "dream"
  | "agent"
  | "service"
  | "route"
  | "wormhole"
  | "wallet"
  | "generic";

export interface ReputationSignal {
  id: string;
  entityType: RepEntityType;
  entityId: string;
  source: string;       // e.g. "WolfPack", "SlugTime", "StarBridge", "DreamCortex"
  weight: number;       // 0–1
  value: number;        // -1 to 1 (negative to positive)
  createdAt: number;
  meta?: Record<string, any>;
}

export interface ReputationScore {
  entityType: RepEntityType;
  entityId: string;
  score: number;        // 0–1
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

