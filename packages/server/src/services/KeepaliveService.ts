import Redis from "ioredis";

/**
 * KeepaliveService
 * 
 * Responsible for maintaining activity on the Upstash "Dreamnetwork" index
 * to prevent inactivity-based deletion.
 */
export class KeepaliveService {
    private redis: Redis | null = null;
    private readonly KEEPALIVE_KEY = "dreamnet:keepalive:heartbeat";

    constructor() {
        this.initializeRedis();
    }

    private initializeRedis() {
        const url = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;
        if (url) {
            this.redis = new Redis(url);
            this.redis.on("error", (err) => {
                console.error("[KeepaliveService] Redis error:", err);
            });
        }
    }

    /**
     * Pings the Redis store with a timestamp to maintain activity.
     */
    async ping() {
        if (!this.redis) {
            console.warn("[KeepaliveService] Redis client not initialized. Skipping ping.");
            return;
        }

        try {
            const timestamp = new Date().toISOString();
            await this.redis.set(this.KEEPALIVE_KEY, JSON.stringify({
                lastSeen: timestamp,
                origin: "DreamNet Server Keepalive"
            }));

            // Also perform a read to ensure bidirectional traffic
            const result = await this.redis.get(this.KEEPALIVE_KEY);

            console.log(`[KeepaliveService] Heartbeat sent: ${timestamp}`);
            return JSON.parse(result || "{}");
        } catch (error) {
            console.error("[KeepaliveService] Failed to send heartbeat:", error);
            throw error;
        }
    }

    async close() {
        if (this.redis) {
            await this.redis.quit();
        }
    }
}

export const keepaliveService = new KeepaliveService();
