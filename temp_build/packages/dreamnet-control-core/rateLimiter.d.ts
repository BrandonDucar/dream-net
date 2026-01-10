/**
 * Rate Limiter - In-memory rate limiting helper
 *
 * This is a lightweight, in-memory rate limiter for development/testing.
 * In production, this should be replaced with Redis-based rate limiting.
 *
 * Uses sliding window per-minute limits with key format: "${clusterId}:${tierId}"
 *
 * @module @dreamnet/dreamnet-control-core/rateLimiter
 */
import type { ClusterId } from "./clusters";
import type { TierId } from "./tierConfig";
declare class RateLimiter {
    private windows;
    private readonly CLEANUP_INTERVAL;
    /**
     * Check if request is allowed and consume a token
     *
     * @param clusterId - Cluster identifier
     * @param tierId - Tier identifier
     * @param limitPerMinute - Maximum requests per minute
     * @returns Object with allowed status and remaining requests
     */
    checkAndConsume(clusterId: ClusterId, tierId: TierId, limitPerMinute: number): {
        allowed: boolean;
        remaining: number;
    };
    /**
     * Get current rate limit stats (for debugging)
     *
     * @param clusterId - Cluster identifier
     * @param tierId - Tier identifier
     * @returns Current request count and limit
     */
    getStats(clusterId: ClusterId, tierId: TierId): {
        current: number;
        limit: number;
    };
    /**
     * Clear all rate limit windows (for testing)
     */
    clear(): void;
}
export declare const rateLimiter: RateLimiter;
/**
 * Check if request is allowed and consume a token
 *
 * @param clusterId - Cluster identifier
 * @param tierId - Tier identifier
 * @param limitPerMinute - Maximum requests per minute
 * @returns Object with allowed status and remaining requests
 *
 * @example
 * ```typescript
 * const result = checkAndConsume("WOLF_PACK", "BUILDER", 60);
 * if (!result.allowed) {
 *   // Rate limited
 * }
 * ```
 */
export declare function checkAndConsume(clusterId: ClusterId, tierId: TierId, limitPerMinute: number): {
    allowed: boolean;
    remaining: number;
};
export {};
