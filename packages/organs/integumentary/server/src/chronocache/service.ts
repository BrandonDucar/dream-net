import Redis from "ioredis";
import { recordMetric } from "../trust/metrics";

type CacheEntry = {
  value: unknown;
  storedAt: number;
};

const lambda = Number(process.env.LAMBDA ?? 0.0001);
const epsilon = Number(process.env.EPSILON ?? 0.01);

let redis: Redis | null = null;
const memoryStore = new Map<string, CacheEntry>();

let hitCount = 0;
let missCount = 0;

function getRedis(): Redis | null {
  if (redis) return redis;
  if (!process.env.REDIS_URL) return null;
  redis = new Redis(process.env.REDIS_URL);
  redis.on("error", (err) => {
    console.error("[ChronoCache] Redis error:", err);
  });
  return redis;
}

export async function chronoSet(key: string, value: unknown) {
  const entry: CacheEntry = { value, storedAt: Date.now() };
  const client = getRedis();
  if (client) {
    await client.set(`chronocache:${key}`, JSON.stringify(entry));
    await client.publish("dreamnet-cache-events", JSON.stringify({ type: "set", key }));
  } else {
    memoryStore.set(key, entry);
  }
}

export async function chronoGet(key: string) {
  const client = getRedis();
  let entry: CacheEntry | null = null;
  if (client) {
    const data = await client.get(`chronocache:${key}`);
    entry = data ? (JSON.parse(data) as CacheEntry) : null;
  } else {
    entry = memoryStore.get(key) ?? null;
  }

  if (!entry) {
    missCount++;
    return null;
  }

  hitCount++;
  const ageMs = Date.now() - entry.storedAt;
  const ageSeconds = ageMs / 1000;
  const weight = Math.exp(-lambda * ageSeconds);

  if (weight < epsilon) {
    return null;
  }

  return {
    value: entry.value,
    storedAt: entry.storedAt,
    ageSeconds,
    weight,
  };
}

export async function chronoStats() {
  const total = hitCount + missCount;
  const hitRate = total ? hitCount / total : 0;
  await recordMetric("chronocache.stats", {
    hitCount,
    missCount,
    hitRate,
    timestamp: new Date().toISOString(),
  });
  return { hitCount, missCount, hitRate, lambda, epsilon };
}
