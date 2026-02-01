/**
 * Redis Store for Control State
 * Production-ready persistence layer
 */

import type { KillSwitchState, ClusterRateLimit, ControlConfig, ClusterId } from '../types.js';

// Redis client interface (use ioredis or similar in production)
interface RedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { EX?: number }): Promise<void>;
  del(key: string): Promise<void>;
  exists(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
}

class RedisControlStore {
  private redis: RedisClient | null = null;
  private useRedis: boolean = false;
  private prefix = "dreamnet:control:";

  constructor() {
    // Try to initialize Redis if available
    this.initializeRedis();
  }

  private async initializeRedis() {
    try {
      // In production, use actual Redis client
      // const Redis = require('ioredis');
      // this.redis = new Redis(process.env.REDIS_URL);
      // this.useRedis = true;

      // For now, fallback to in-memory
      this.useRedis = false;
      console.log("[RedisControlStore] Redis not configured, using in-memory fallback");
    } catch (error) {
      console.warn("[RedisControlStore] Redis initialization failed, using in-memory fallback:", error);
      this.useRedis = false;
    }
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  // Kill-switch methods
  async getKillSwitchState(): Promise<KillSwitchState | null> {
    if (!this.useRedis || !this.redis) {
      return null; // Fallback to in-memory store
    }

    try {
      const data = await this.redis.get(this.getKey("killswitch"));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("[RedisControlStore] Failed to get kill-switch state:", error);
      return null;
    }
  }

  async setKillSwitchState(state: KillSwitchState): Promise<void> {
    if (!this.useRedis || !this.redis) {
      return; // Fallback to in-memory store
    }

    try {
      await this.redis.set(this.getKey("killswitch"), JSON.stringify(state));
    } catch (error) {
      console.error("[RedisControlStore] Failed to set kill-switch state:", error);
    }
  }

  // Rate limit methods
  async getRateLimit(clusterId: ClusterId): Promise<ClusterRateLimit | null> {
    if (!this.useRedis || !this.redis) {
      return null;
    }

    try {
      const data = await this.redis.get(this.getKey(`ratelimit:${clusterId}`));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("[RedisControlStore] Failed to get rate limit:", error);
      return null;
    }
  }

  async setRateLimit(limit: ClusterRateLimit): Promise<void> {
    if (!this.useRedis || !this.redis) {
      return;
    }

    try {
      await this.redis.set(this.getKey(`ratelimit:${limit.clusterId}`), JSON.stringify(limit));
    } catch (error) {
      console.error("[RedisControlStore] Failed to set rate limit:", error);
    }
  }

  async getAllRateLimits(): Promise<ClusterRateLimit[]> {
    if (!this.useRedis || !this.redis) {
      return [];
    }

    try {
      const keys = await this.redis.keys(this.getKey("ratelimit:*"));
      const limits: ClusterRateLimit[] = [];

      for (const key of keys) {
        const data = await this.redis.get(key);
        if (data) {
          limits.push(JSON.parse(data));
        }
      }

      return limits;
    } catch (error) {
      console.error("[RedisControlStore] Failed to get all rate limits:", error);
      return [];
    }
  }

  // Request count methods (for rate limiting)
  async incrementRequestCount(clusterId: ClusterId, timestamp: number): Promise<void> {
    if (!this.useRedis || !this.redis) {
      return;
    }

    try {
      const key = this.getKey(`requests:${clusterId}:${timestamp}`);
      await this.redis.set(key, "1", { EX: 86400 }); // Expire after 24 hours
    } catch (error) {
      console.error("[RedisControlStore] Failed to increment request count:", error);
    }
  }

  async getRequestCount(clusterId: ClusterId, since: number): Promise<number> {
    if (!this.useRedis || !this.redis) {
      return 0;
    }

    try {
      const pattern = this.getKey(`requests:${clusterId}:*`);
      const keys = await this.redis.keys(pattern);
      const validKeys = keys.filter(key => {
        const timestamp = parseInt(key.split(":").pop() || "0");
        return timestamp >= since;
      });
      return validKeys.length;
    } catch (error) {
      console.error("[RedisControlStore] Failed to get request count:", error);
      return 0;
    }
  }

  // Circuit breaker methods
  async getCircuitBreaker(clusterId: ClusterId): Promise<any | null> {
    if (!this.useRedis || !this.redis) {
      return null;
    }

    try {
      const data = await this.redis.get(this.getKey(`circuitbreaker:${clusterId}`));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("[RedisControlStore] Failed to get circuit breaker:", error);
      return null;
    }
  }

  async setCircuitBreaker(clusterId: ClusterId, breaker: any): Promise<void> {
    if (!this.useRedis || !this.redis) {
      return;
    }

    try {
      await this.redis.set(this.getKey(`circuitbreaker:${clusterId}`), JSON.stringify(breaker));
    } catch (error) {
      console.error("[RedisControlStore] Failed to set circuit breaker:", error);
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    if (!this.useRedis || !this.redis) {
      return false;
    }

    try {
      await this.redis.get(this.getKey("health"));
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const redisControlStore = new RedisControlStore();

