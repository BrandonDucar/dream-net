import Redis from "ioredis";
declare class RedisService {
    private static instance;
    client: Redis;
    private constructor();
    static getInstance(): RedisService;
}
export declare const redisService: RedisService;
export declare const redisClient: Redis;
export {};
//# sourceMappingURL=redis.d.ts.map