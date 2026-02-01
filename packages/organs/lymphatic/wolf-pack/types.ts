export type WolfTargetType =
  | "route"
  | "service"
  | "agent"
  | "wormhole"
  | "deployment"
  | "unknown";

export interface WolfSignal {
  id: string;
  type: "anomaly" | "hunt" | "strike" | "noop";
  targetType: WolfTargetType;
  targetId?: string;
  severity: number; // 0–1
  confidence: number; // 0–1
  meta?: Record<string, any>;
  createdAt: number;
}

export interface WolfContext {
  haloLoop?: any;             // health + analysis
  swarmPatrol?: any;          // micro-agent repair patrol
  quantumAnticipation?: any;  // QAL predictions
  neuralMesh?: any;           // mesh memory / pulses
  governance?: any;           // for safety overrides
}

export interface WolfPackStatus {
  lastRunAt: number | null;
  lastSignalsCount: number;
  activeTargets: string[];
}

