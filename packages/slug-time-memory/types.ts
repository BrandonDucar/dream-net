export type SlugMetricKind =
  | "latency"
  | "failure-rate"
  | "throughput"
  | "reliability"
  | "economic-pressure"
  | "routing-health"
  | "generic";

export interface SlugMetricSample {
  id: string;
  key: string;               // e.g. service name, route id, wormhole id, etc.
  kind: SlugMetricKind;
  value: number;             // numeric metric
  weight?: number;           // optional weighting
  source?: string;           // which subsystem produced it
  createdAt: number;
}

export interface SlugMetricSnapshot {
  key: string;
  kind: SlugMetricKind;
  avg: number;
  count: number;
  lastUpdatedAt: number;
}

export interface SlugTimeConfig {
  decayHalfLifeMs: number;   // approximate half-life for metrics
  maxSamplesPerKey?: number;
}

export interface SlugTimeContext {
  pheromoneStore?: any;
  neuralMesh?: any;
  quantumAnticipation?: any;
  haloLoop?: any;
}

export interface SlugTimeStatus {
  lastRunAt: number | null;
  totalSamples: number;
  snapshotCount: number;
}

