import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

export interface PheromoneTrail {
  path: string; // e.g., "time:14:00:region:us-east-1:provider:vercel"
  strength: number; // 0.0 to 1.0 (Overall Success/Failure)

  // Qualitative Types (The Termite/Stigmergy Hijack)
  types: {
    HONEY: number;     // Success/Reward density
    SLIME: number;     // Error/Failure residue
    HEAT: number;      // Latency/Heavy traffic
    PULSE: number;     // Freshness/Recent activity
  };

  successCount: number;
  failureCount: number;
  lastSuccess: string; // ISO timestamp
  lastFailure: string; // ISO timestamp
  avgLatency: number;    // In milliseconds
  rewardDensity: number; // Cumulative rewards per successful action
  currentLoad: number;   // Number of active tasks on this path/agent
  createdAt: string;
  updatedAt: string;
}

const STORE_PATH = join(process.cwd(), "packages", "halo-loop", "store", "pheromoneStore.json");
const EVAPORATION_RATE = 0.1; // 10% per day
const MIN_STRENGTH = 0.01; // Minimum strength before removal

function ensureStoreDir(): void {
  const dir = join(STORE_PATH, "..");
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function loadStore(): Map<string, PheromoneTrail> {
  ensureStoreDir();
  if (!existsSync(STORE_PATH)) {
    return new Map();
  }

  try {
    const content = readFileSync(STORE_PATH, "utf-8");
    const data = JSON.parse(content);
    const map = new Map<string, PheromoneTrail>();

    for (const [path, trail] of Object.entries(data)) {
      map.set(path, trail as PheromoneTrail);
    }

    return map;
  } catch (error) {
    console.warn("[PheromoneStore] Failed to load store, starting fresh:", error);
    return new Map();
  }
}

function saveStore(store: Map<string, PheromoneTrail>): void {
  ensureStoreDir();
  const data: Record<string, PheromoneTrail> = {};
  for (const [path, trail] of store.entries()) {
    data[path] = trail;
  }
  writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Deposit pheromone on a successful path
 */
export function depositPheromone(
  path: string,
  success: boolean = true,
  strength: number = 0.1,
  metadata?: { latency?: number; reward?: number; loadDelta?: number }
): void {
  const store = loadStore();
  const now = new Date().toISOString();

  const existing = store.get(path);
  if (existing) {
    existing.updatedAt = now;

    // Initialize types if missing (Stigmergy Hijack)
    if (!existing.types) {
      existing.types = { HONEY: 0, SLIME: 0, HEAT: 0, PULSE: 0 };
    }

    if (success) {
      existing.successCount++;
      existing.lastSuccess = now;
      existing.strength = Math.min(1.0, existing.strength + strength);
      existing.types.HONEY = Math.min(1.0, existing.types.HONEY + strength);
      existing.types.PULSE = 1.0; // Peak activity

      // Update running average of latency (80/20 weighted)
      if (metadata?.latency) {
        existing.avgLatency = ((existing.avgLatency || 0) * 0.8) + (metadata.latency * 0.2);
        existing.types.HEAT = Math.min(1.0, existing.avgLatency / 2000);
      }

      // Update reward density
      if (metadata?.reward) {
        existing.rewardDensity = (existing.rewardDensity || 0) + metadata.reward;
      }
    } else {
      existing.failureCount++;
      existing.lastFailure = now;
      existing.strength = Math.max(0, existing.strength - strength * 0.5);
      existing.types.SLIME = Math.min(1.0, existing.types.SLIME + (strength * 2));
      existing.types.PULSE = 1.0;
    }

    if (metadata?.loadDelta) {
      existing.currentLoad = Math.max(0, (existing.currentLoad || 0) + metadata.loadDelta);
    }
  } else {
    store.set(path, {
      path,
      strength: success ? strength : 0,
      types: {
        HONEY: success ? strength : 0,
        SLIME: success ? 0 : strength * 2,
        HEAT: (metadata?.latency || 0) / 2000,
        PULSE: 1.0
      },
      successCount: success ? 1 : 0,
      failureCount: success ? 0 : 1,
      lastSuccess: success ? now : "",
      lastFailure: success ? "" : now,
      avgLatency: metadata?.latency || 0,
      rewardDensity: metadata?.reward || 0,
      currentLoad: metadata?.loadDelta || 0,
      createdAt: now,
      updatedAt: now,
    });
  }

  saveStore(store);
}

/**
 * Get pheromone strength for a path
 */
export function getPheromoneStrength(path: string): number {
  return getPheromoneTrail(path)?.strength || 0;
}

/**
 * Get full pheromone trail for a path
 */
export function getPheromoneTrail(path: string): PheromoneTrail | undefined {
  const store = loadStore();
  return store.get(path);
}

/**
 * Get top N paths by strength
 */
export function getTopPaths(limit: number = 10): PheromoneTrail[] {
  const store = loadStore();
  return Array.from(store.values())
    .sort((a, b) => b.strength - a.strength)
    .slice(0, limit);
}

/**
 * Evaporate pheromones (nightly job)
 */
export function evaporatePheromones(): number {
  const store = loadStore();
  const now = Date.now();
  let removed = 0;

  for (const [path, trail] of store.entries()) {
    // Calculate age in days
    const updatedAt = new Date(trail.updatedAt).getTime();
    const ageDays = (now - updatedAt) / (1000 * 60 * 60 * 24);

    // Apply evaporation
    trail.strength = trail.strength * Math.pow(1 - EVAPORATION_RATE, ageDays);

    // Remove if below minimum
    if (trail.strength < MIN_STRENGTH) {
      store.delete(path);
      removed++;
    } else {
      trail.updatedAt = new Date().toISOString();
    }
  }

  saveStore(store);
  return removed;
}

/**
 * Build path string from context
 */
export function buildPath(context: {
  time?: string; // "14:00" or "morning" | "afternoon" | "evening"
  region?: string; // "us-east-1", "eu-west-1", etc.
  provider?: string; // "vercel", "neon", "github", etc.
  agent?: string; // Agent ID
  endpoint?: string; // API endpoint
}): string {
  const parts: string[] = [];

  if (context.time) parts.push(`time:${context.time}`);
  if (context.region) parts.push(`region:${context.region}`);
  if (context.provider) parts.push(`provider:${context.provider}`);
  if (context.agent) parts.push(`agent:${context.agent}`);
  if (context.endpoint) parts.push(`endpoint:${context.endpoint}`);

  return parts.join(":");
}

