/**
 * Metrics Engine
 * TEMPORARY: No-op placeholder to avoid blocking server startup
 * TODO: Replace with full implementation from metricsEngine.ts once dependencies are resolved
 */
/**
 * Get metrics snapshot
 * TEMPORARY: Returns placeholder data
 */
export async function getMetrics() {
    return {
        timestamp: new Date().toISOString(),
        uptimePercent: 100,
        avgHeartbeatMs: 0,
        haloCyclesToday: 0,
        tasksCompleted: 0,
        tasksPending: 0,
        events24h: 0,
        mediaCount: 0,
        mediaPublic: 0,
        postsQueued: 0,
        postsPosted: 0,
        phase: "placeholder",
        status: "placeholder",
        message: "Metrics Engine not implemented yet.",
        metrics: [],
    };
}
/**
 * Get metrics snapshot (sync version)
 * TEMPORARY: Returns placeholder data
 */
export function getMetricsSnapshot() {
    return {
        timestamp: new Date().toISOString(),
        uptimePercent: 100,
        avgHeartbeatMs: 0,
        haloCyclesToday: 0,
        tasksCompleted: 0,
        tasksPending: 0,
        events24h: 0,
        mediaCount: 0,
        mediaPublic: 0,
        postsQueued: 0,
        postsPosted: 0,
        phase: "placeholder",
        status: "placeholder",
        message: "Metrics Engine not implemented yet.",
        metrics: [],
    };
}
/**
 * Record a metric event
 * TEMPORARY: No-op placeholder
 */
export function recordMetric(_event) {
    // No-op: metrics engine not implemented yet
    return;
}
/**
 * Record an event (alias for recordMetric)
 * TEMPORARY: No-op placeholder
 */
export async function recordEvent(_event) {
    // No-op: metrics engine not implemented yet
    return;
}
/**
 * Record HALO cycle
 * TEMPORARY: No-op placeholder
 */
export async function recordHaloCycle(_event) {
    // No-op: metrics engine not implemented yet
    return;
}
/**
 * Record heartbeat
 * TEMPORARY: No-op placeholder
 */
export async function recordHeartbeat(_latencyMs) {
    // No-op: metrics engine not implemented yet
    return;
}
/**
 * Record task completion
 * TEMPORARY: No-op placeholder
 */
export async function recordTaskCompletion(_type, _status) {
    // No-op: metrics engine not implemented yet
    return;
}
/**
 * Get metrics for a specific time range
 * TEMPORARY: Returns empty array
 */
export function getMetricsHistory(_days) {
    return Promise.resolve([]);
}
/**
 * Update task counts
 * TEMPORARY: No-op placeholder
 */
export function updateTaskCounts(_completed, _pending) {
    // No-op: metrics engine not implemented yet
    return;
}
/**
 * Get metric by name
 * TEMPORARY: Returns null
 */
export function getMetric(_name) {
    return null;
}
// Re-export types
export * from "./types";
