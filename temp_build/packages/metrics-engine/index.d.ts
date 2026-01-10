/**
 * Metrics Engine
 * TEMPORARY: No-op placeholder to avoid blocking server startup
 * TODO: Replace with full implementation from metricsEngine.ts once dependencies are resolved
 */
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
    phase: string;
    status?: string;
    message?: string;
    metrics?: any[];
    [key: string]: any;
}
export interface MetricEvent {
    name?: string;
    value?: number;
    tags?: Record<string, string>;
    timestamp?: string;
    [key: string]: any;
}
export interface HaloCycleEvent {
    success?: boolean;
    timestamp?: string;
    [key: string]: any;
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
    lastHaloCycleAt: string | null;
    createdAt: string;
    updatedAt: string;
}
/**
 * Get metrics snapshot
 * TEMPORARY: Returns placeholder data
 */
export declare function getMetrics(): Promise<MetricsSnapshot>;
/**
 * Get metrics snapshot (sync version)
 * TEMPORARY: Returns placeholder data
 */
export declare function getMetricsSnapshot(): MetricsSnapshot;
/**
 * Record a metric event
 * TEMPORARY: No-op placeholder
 */
export declare function recordMetric(_event: MetricEvent): void;
/**
 * Record an event (alias for recordMetric)
 * TEMPORARY: No-op placeholder
 */
export declare function recordEvent(_event?: MetricEvent): Promise<void>;
/**
 * Record HALO cycle
 * TEMPORARY: No-op placeholder
 */
export declare function recordHaloCycle(_event: HaloCycleEvent): Promise<void>;
/**
 * Record heartbeat
 * TEMPORARY: No-op placeholder
 */
export declare function recordHeartbeat(_latencyMs?: number): Promise<void>;
/**
 * Record task completion
 * TEMPORARY: No-op placeholder
 */
export declare function recordTaskCompletion(_type?: string, _status?: "success" | "failed"): Promise<void>;
/**
 * Get metrics for a specific time range
 * TEMPORARY: Returns empty array
 */
export declare function getMetricsHistory(_days?: number): Promise<MetricsDaily[]>;
/**
 * Update task counts
 * TEMPORARY: No-op placeholder
 */
export declare function updateTaskCounts(_completed?: number, _pending?: number): void;
/**
 * Get metric by name
 * TEMPORARY: Returns null
 */
export declare function getMetric(_name: string): any | null;
export * from "./types";
