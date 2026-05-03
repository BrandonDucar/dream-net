import Redis from "ioredis";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
class RedisService {
    static instance;
    client;
    constructor() {
        this.client = new Redis(REDIS_URL, {
            maxRetriesPerRequest: null,
            enableReadyCheck: true,
        });
        this.client.on("error", (err) => {
            console.error("❌ [Redis] connection error:", err);
        });
        this.client.on("connect", () => {
            console.log("✅ [Redis] connected to swarm memory.");
        });
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new RedisService();
        }
        return this.instance;
    }
}
export const redisService = RedisService.getInstance();
export const redisClient = redisService.client;
//# sourceMappingURL=redis.js.map