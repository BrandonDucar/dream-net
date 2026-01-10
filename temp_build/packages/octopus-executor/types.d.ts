export type OctopusArmId = "deploy" | "batch" | "streams" | "secrets" | "builds" | "watchers" | "cleanup" | "analytics";
export type OctopusTaskType = "deploy-app" | "rotate-secret" | "run-batch-job" | "ingest-stream" | "run-build" | "watch-config" | "cleanup-artifacts" | "emit-analytics" | "generic";
export interface OctopusTask {
    id: string;
    type: OctopusTaskType;
    payload?: Record<string, any>;
    createdAt: number;
    priority?: number;
}
export interface OctopusArmConfig {
    id: OctopusArmId;
    enabled: boolean;
    maxParallel?: number;
}
export interface OctopusArmStatus {
    id: OctopusArmId;
    enabled: boolean;
    activeTasks: number;
    processedCount: number;
    lastRunAt?: number;
}
export interface OctopusContext {
    dreamOps?: any;
    deployKeeper?: any;
    envKeeper?: any;
    haloLoop?: any;
    neuralMesh?: any;
    quantumAnticipation?: any;
    squadAlchemy?: any;
    wolfPack?: any;
}
export interface OctopusRuntimeStatus {
    lastRunAt: number | null;
    arms: OctopusArmStatus[];
    queuedTasks: number;
}
