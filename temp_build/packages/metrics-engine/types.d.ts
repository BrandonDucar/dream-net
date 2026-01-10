export interface MetricsSnapshot {
    timestamp: string;
    uptimePercent: number;
    avgHeartbeatMs: number;
    haloCyclesToday: number;
    tasksCompleted: number;
    tasksPending: number;
    events24h: number;
    mediaCount: number;
    mediaPublic: number;
    postsQueued: number;
    postsPosted: number;
    daNsaCount: number;
    phase: string;
}
export interface MetricsDaily {
    date: string;
    uptimePercent: number;
    avgHeartbeatMs: number;
    haloCycles: number;
    tasksCompleted: number;
    tasksPending: number;
    events: number;
    mediaAdded: number;
    mediaPublic: number;
    postsQueued: number;
    postsPosted: number;
    daNsaCount: number;
    lastHaloCycleAt: string | null;
    createdAt: string;
    updatedAt: string;
}
