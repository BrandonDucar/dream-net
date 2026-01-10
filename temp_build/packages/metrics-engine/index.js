"use strict";
/**
 * Metrics Engine
 * TEMPORARY: No-op placeholder to avoid blocking server startup
 * TODO: Replace with full implementation from metricsEngine.ts once dependencies are resolved
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetrics = getMetrics;
exports.getMetricsSnapshot = getMetricsSnapshot;
exports.recordMetric = recordMetric;
exports.recordEvent = recordEvent;
exports.recordHaloCycle = recordHaloCycle;
exports.recordHeartbeat = recordHeartbeat;
exports.recordTaskCompletion = recordTaskCompletion;
exports.getMetricsHistory = getMetricsHistory;
exports.updateTaskCounts = updateTaskCounts;
exports.getMetric = getMetric;
/**
 * Get metrics snapshot
 * TEMPORARY: Returns placeholder data
 */
async function getMetrics() {
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
function getMetricsSnapshot() {
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
function recordMetric(_event) {
    // No-op: metrics engine not implemented yet
    return;
}
/**
 * Record an event (alias for recordMetric)
 * TEMPORARY: No-op placeholder
 */
async function recordEvent(_event) {
    // No-op: metrics engine not implemented yet
    return;
}
/**
 * Record HALO cycle
 * TEMPORARY: No-op placeholder
 */
async function recordHaloCycle(_event) {
    // No-op: metrics engine not implemented yet
    return;
}
/**
 * Record heartbeat
 * TEMPORARY: No-op placeholder
 */
async function recordHeartbeat(_latencyMs) {
    // No-op: metrics engine not implemented yet
    return;
}
/**
 * Record task completion
 * TEMPORARY: No-op placeholder
 */
async function recordTaskCompletion(_type, _status) {
    // No-op: metrics engine not implemented yet
    return;
}
/**
 * Get metrics for a specific time range
 * TEMPORARY: Returns empty array
 */
function getMetricsHistory(_days) {
    return Promise.resolve([]);
}
/**
 * Update task counts
 * TEMPORARY: No-op placeholder
 */
function updateTaskCounts(_completed, _pending) {
    // No-op: metrics engine not implemented yet
    return;
}
/**
 * Get metric by name
 * TEMPORARY: Returns null
 */
function getMetric(_name) {
    return null;
}
// Re-export types
__exportStar(require("./types"), exports);
