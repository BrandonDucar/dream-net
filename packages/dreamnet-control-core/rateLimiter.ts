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

interface RateLimitWindow {
  requests: Array<{ timestamp: number }>;
  lastCleanup: number;
}

class RateLimiter {
  private windows: Map<string, RateLimitWindow> = new Map();
  private readonly CLEANUP_INTERVAL = 60000; // 1 minute

  /**
   * Check if request is allowed and consume a token
   * 
   * @param clusterId - Cluster identifier
   * @param tierId - Tier identifier
   * @param limitPerMinute - Maximum requests per minute
   * @returns Object with allowed status and remaining requests
   */
  checkAndConsume(
    clusterId: ClusterId,
    tierId: TierId,
    limitPerMinute: number
  ): { allowed: boolean; remaining: number } {
    const key = `${clusterId}:${tierId}`;
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Get or create window
    let window = this.windows.get(key);
    if (!window) {
      window = {
        requests: [],
        lastCleanup: now,
      };
      this.windows.set(key, window);
    }

    // Cleanup old requests
    if (now - window.lastCleanup > this.CLEANUP_INTERVAL) {
      window.requests = window.requests.filter(
        (req) => req.timestamp > oneMinuteAgo
      );
      window.lastCleanup = now;
    }

    // Count requests in the last minute
    const recentRequests = window.requests.filter(
      (req) => req.timestamp > oneMinuteAgo
    ).length;

    // Check if limit exceeded
    if (recentRequests >= limitPerMinute) {
      return {
        allowed: false,
        remaining: 0,
      };
    }

    // Consume token (add request)
    window.requests.push({ timestamp: now });

    return {
      allowed: true,
      remaining: limitPerMinute - recentRequests - 1,
    };
  }

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
  } {
    const key = `${clusterId}:${tierId}`;
    const window = this.windows.get(key);
    if (!window) {
      return { current: 0, limit: 0 };
    }

    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const recentRequests = window.requests.filter(
      (req) => req.timestamp > oneMinuteAgo
    ).length;

    return {
      current: recentRequests,
      limit: 0, // Limit not stored, would need to be passed
    };
  }

  /**
   * Clear all rate limit windows (for testing)
   */
  clear(): void {
    this.windows.clear();
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

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
export function checkAndConsume(
  clusterId: ClusterId,
  tierId: TierId,
  limitPerMinute: number
): { allowed: boolean; remaining: number } {
  return rateLimiter.checkAndConsume(clusterId, tierId, limitPerMinute);
}

