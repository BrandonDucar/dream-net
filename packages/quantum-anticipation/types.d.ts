export type QALContext = {
    haloLoop?: any;
    slimeRouter?: any;
    pheromoneStore?: any;
    governance?: any;
    neuralMesh?: any;
};
export type QALSignalType = "workload-spike" | "failure-risk" | "routing-bottleneck" | "pr-hotspot";
export interface QALPrediction {
    id: string;
    type: QALSignalType;
    confidence: number;
    etaMs?: number;
    meta?: Record<string, any>;
    createdAt: number;
}
//# sourceMappingURL=types.d.ts.map