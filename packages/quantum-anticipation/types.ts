export type QALContext = {
  // hook into existing systems where possible
  haloLoop?: any;
  slimeRouter?: any;
  pheromoneStore?: any;
  governance?: any;
  neuralMesh?: any;
};

export type QALSignalType =
  | "workload-spike"
  | "failure-risk"
  | "routing-bottleneck"
  | "pr-hotspot";

export interface QALPrediction {
  id: string;
  type: QALSignalType;
  confidence: number; // 0–1
  etaMs?: number;     // when this is likely to manifest
  meta?: Record<string, any>;
  createdAt: number;
}

