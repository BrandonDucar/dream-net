export type WolfTargetType = "route" | "service" | "agent" | "wormhole" | "deployment" | "unknown";
export interface WolfSignal {
    id: string;
    type: "anomaly" | "hunt" | "strike" | "noop";
    targetType: WolfTargetType;
    targetId?: string;
    severity: number;
    confidence: number;
    meta?: Record<string, any>;
    createdAt: number;
}
export interface WolfContext {
    haloLoop?: any;
    swarmPatrol?: any;
    quantumAnticipation?: any;
    neuralMesh?: any;
    governance?: any;
}
export interface WolfPackStatus {
    lastRunAt: number | null;
    lastSignalsCount: number;
    activeTargets: string[];
}
