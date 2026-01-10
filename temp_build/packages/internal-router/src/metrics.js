"use strict";
/**
 * Router Metrics
 *
 * Simple in-memory metrics tracking for route usage
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementRouteCount = incrementRouteCount;
exports.getRouteStats = getRouteStats;
exports.getRouteCount = getRouteCount;
exports.resetMetrics = resetMetrics;
/**
 * In-memory metrics store
 * Key format: `${fiber}:${type}`
 */
const routeMetrics = new Map();
/**
 * Increment route count for a specific fiber and packet type
 *
 * @param fiber - Fiber channel name
 * @param type - Packet type
 */
function incrementRouteCount(fiber, type) {
    const key = `${fiber}:${type}`;
    const existing = routeMetrics.get(key);
    if (existing) {
        existing.count++;
    }
    else {
        routeMetrics.set(key, { count: 1 });
    }
}
/**
 * Get route statistics
 *
 * @returns Object mapping route keys to their usage counts
 */
function getRouteStats() {
    const stats = {};
    for (const [key, value] of routeMetrics.entries()) {
        stats[key] = { ...value };
    }
    return stats;
}
/**
 * Get count for a specific route
 *
 * @param fiber - Fiber channel name
 * @param type - Packet type
 * @returns Count for the route, or 0 if never routed
 */
function getRouteCount(fiber, type) {
    const key = `${fiber}:${type}`;
    return routeMetrics.get(key)?.count || 0;
}
/**
 * Reset all metrics
 */
function resetMetrics() {
    routeMetrics.clear();
}
