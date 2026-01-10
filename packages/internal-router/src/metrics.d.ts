/**
 * Router Metrics
 *
 * Simple in-memory metrics tracking for route usage
 */
/**
 * Increment route count for a specific fiber and packet type
 *
 * @param fiber - Fiber channel name
 * @param type - Packet type
 */
export declare function incrementRouteCount(fiber: string, type: string): void;
/**
 * Get route statistics
 *
 * @returns Object mapping route keys to their usage counts
 */
export declare function getRouteStats(): Record<string, {
    count: number;
}>;
/**
 * Get count for a specific route
 *
 * @param fiber - Fiber channel name
 * @param type - Packet type
 * @returns Count for the route, or 0 if never routed
 */
export declare function getRouteCount(fiber: string, type: string): number;
/**
 * Reset all metrics
 */
export declare function resetMetrics(): void;
//# sourceMappingURL=metrics.d.ts.map