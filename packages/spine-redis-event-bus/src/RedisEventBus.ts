/**
 * Redis Event Bus - Persistent event bus using Redis pub/sub
 * 
 * Extends DreamEventBus with Redis persistence and distributed pub/sub
 */

import Redis from "ioredis";
import { DreamEventBus } from "../../../spine/dreamnet-event-bus/DreamEventBus.js";
import type { EventEnvelope } from "../../../spine/dreamnet-event-bus/EventEnvelope.js";

export interface RedisEventBusConfig {
  redisUrl?: string;
  redisHost?: string;
  redisPort?: number;
  redisPassword?: string;
  channelPrefix?: string;
  enablePersistence?: boolean;
  enablePubSub?: boolean;
}

/**
 * Redis Event Bus - Persistent and distributed event bus
 */
export class RedisEventBus extends DreamEventBus {
  private redis: Redis | null = null;
  private subscriber: Redis | null = null;
  private publisher: Redis | null = null;
  private config: RedisEventBusConfig;
  private isConnected: boolean = false;

  constructor(config: RedisEventBusConfig = {}) {
    super();
    this.config = {
      channelPrefix: "dreamnet:events:",
      enablePersistence: true,
      enablePubSub: true,
      ...config,
    };
  }

  /**
   * Initialize Redis connections
   */
  async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      const redisOptions: any = {
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
      };

      if (this.config.redisUrl) {
        redisOptions.url = this.config.redisUrl;
      } else {
        redisOptions.host = this.config.redisHost || "localhost";
        redisOptions.port = this.config.redisPort || 6379;
        if (this.config.redisPassword) {
          redisOptions.password = this.config.redisPassword;
        }
      }

      // Create main Redis connection for persistence
      if (this.config.enablePersistence) {
        this.redis = new Redis(redisOptions);
        this.redis.on("error", (err) => {
          console.error("[RedisEventBus] Redis error:", err);
        });
        this.redis.on("connect", () => {
          console.log("[RedisEventBus] Redis connected");
        });
      }

      // Create separate connections for pub/sub (required by Redis)
      if (this.config.enablePubSub) {
        this.subscriber = new Redis(redisOptions);
        this.publisher = new Redis(redisOptions);

        this.subscriber.on("error", (err) => {
          console.error("[RedisEventBus] Subscriber error:", err);
        });
        this.publisher.on("error", (err) => {
          console.error("[RedisEventBus] Publisher error:", err);
        });

        // Subscribe to all event types
        await this.subscriber.psubscribe(`${this.config.channelPrefix}*`);

        // Handle incoming messages
        this.subscriber.on("pmessage", (pattern, channel, message) => {
          try {
            const event: EventEnvelope = JSON.parse(message);
            // Only process if not from this instance (avoid loops)
            if (event.source !== "RedisEventBus") {
              // Call local handlers
              super.publish(event);
            }
          } catch (error) {
            console.error("[RedisEventBus] Failed to parse event:", error);
          }
        });
      }

      this.isConnected = true;
      console.log("[RedisEventBus] Connected to Redis");
    } catch (error: any) {
      console.warn("[RedisEventBus] Failed to connect to Redis:", error.message);
      console.warn("[RedisEventBus] Falling back to in-memory only");
      this.isConnected = false;
    }
  }

  /**
   * Publish event with Redis persistence and pub/sub
   */
  publish(event: EventEnvelope): void {
    // Call parent to handle local handlers
    super.publish(event);

    // Persist to Redis if enabled
    if (this.config.enablePersistence && this.redis && this.isConnected) {
      const key = `${this.config.channelPrefix}event:${event.id}`;
      this.redis.setex(key, 86400, JSON.stringify(event)).catch((err) => {
        console.error("[RedisEventBus] Failed to persist event:", err);
      });
    }

    // Publish to Redis pub/sub if enabled
    if (this.config.enablePubSub && this.publisher && this.isConnected) {
      const channel = `${this.config.channelPrefix}${event.type}`;
      const message = JSON.stringify({ ...event, source: "RedisEventBus" });
      this.publisher.publish(channel, message).catch((err) => {
        console.error("[RedisEventBus] Failed to publish event:", err);
      });
    }
  }

  /**
   * Get event from Redis persistence
   */
  async getEventFromRedis(eventId: string): Promise<EventEnvelope | null> {
    if (!this.config.enablePersistence || !this.redis || !this.isConnected) {
      return super.getEnvelope(eventId) || null;
    }

    try {
      const key = `${this.config.channelPrefix}event:${eventId}`;
      const data = await this.redis.get(key);
      if (data) {
        return JSON.parse(data) as EventEnvelope;
      }
    } catch (error) {
      console.error("[RedisEventBus] Failed to get event from Redis:", error);
    }

    // Fallback to in-memory
    return super.getEnvelope(eventId) || null;
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
      this.redis = null;
    }
    if (this.subscriber) {
      await this.subscriber.quit();
      this.subscriber = null;
    }
    if (this.publisher) {
      await this.publisher.quit();
      this.publisher = null;
    }
    this.isConnected = false;
  }
}

