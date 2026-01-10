export type SlugMetricKind = "latency" | "failure-rate" | "throughput" | "reliability" | "economic-pressure" | "routing-health" | "generic";
export interface SlugMetricSample {
    id: string;
    key: string;
    kind: SlugMetricKind;
    value: number;
    weight?: number;
    source?: string;
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
    decayHalfLifeMs: number;
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
