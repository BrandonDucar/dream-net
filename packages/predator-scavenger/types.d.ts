export interface DecaySignal {
    id: string;
    targetType: "route" | "event" | "service" | "agent" | "config" | "generic";
    targetId: string;
    severity: number;
    detectedAt: number;
    meta?: Record<string, any>;
}
export interface PredatorAction {
    signalId: string;
    targetId: string;
    quarantined: boolean;
    flagged: boolean;
    meta?: Record<string, any>;
}
export interface ScavengerAction {
    sourceId: string;
    reclaimed: boolean;
    recycled: boolean;
    meta?: Record<string, any>;
}
export interface PSLContext {
    haloLoop?: any;
    wolfPack?: any;
    slugTime?: any;
    neuralMesh?: any;
    octopusExecutor?: any;
}
export interface PSLStatus {
    lastRunAt: number | null;
    decaySignals: DecaySignal[];
    predatorActions: PredatorAction[];
    scavengerActions: ScavengerAction[];
}
//# sourceMappingURL=types.d.ts.map