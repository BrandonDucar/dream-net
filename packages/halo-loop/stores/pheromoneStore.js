import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
const STORE_PATH = join(process.cwd(), "packages", "halo-loop", "store", "pheromoneStore.json");
const EVAPORATION_RATE = 0.1; // 10% per day
const MIN_STRENGTH = 0.01; // Minimum strength before removal
function ensureStoreDir() {
    const dir = join(STORE_PATH, "..");
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
}
function loadStore() {
    ensureStoreDir();
    if (!existsSync(STORE_PATH)) {
        return new Map();
    }
    try {
        const content = readFileSync(STORE_PATH, "utf-8");
        const data = JSON.parse(content);
        const map = new Map();
        for (const [path, trail] of Object.entries(data)) {
            map.set(path, trail);
        }
        return map;
    }
    catch (error) {
        console.warn("[PheromoneStore] Failed to load store, starting fresh:", error);
        return new Map();
    }
}
function saveStore(store) {
    ensureStoreDir();
    const data = {};
    for (const [path, trail] of store.entries()) {
        data[path] = trail;
    }
    writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
}
/**
 * Deposit pheromone on a successful path
 */
export function depositPheromone(path, success = true, strength = 0.1) {
    const store = loadStore();
    const now = new Date().toISOString();
    const existing = store.get(path);
    if (existing) {
        if (success) {
            existing.successCount++;
            existing.lastSuccess = now;
            existing.strength = Math.min(1.0, existing.strength + strength);
        }
        else {
            existing.failureCount++;
            existing.lastFailure = now;
            existing.strength = Math.max(0, existing.strength - strength * 0.5);
        }
        existing.updatedAt = now;
    }
    else {
        store.set(path, {
            path,
            strength: success ? strength : 0,
            successCount: success ? 1 : 0,
            failureCount: success ? 0 : 1,
            lastSuccess: success ? now : "",
            lastFailure: success ? "" : now,
            createdAt: now,
            updatedAt: now,
        });
    }
    saveStore(store);
}
/**
 * Get pheromone strength for a path
 */
export function getPheromoneStrength(path) {
    const store = loadStore();
    const trail = store.get(path);
    return trail?.strength || 0;
}
/**
 * Get top N paths by strength
 */
export function getTopPaths(limit = 10) {
    const store = loadStore();
    return Array.from(store.values())
        .sort((a, b) => b.strength - a.strength)
        .slice(0, limit);
}
/**
 * Evaporate pheromones (nightly job)
 */
export function evaporatePheromones() {
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
        }
        else {
            trail.updatedAt = new Date().toISOString();
        }
    }
    saveStore(store);
    return removed;
}
/**
 * Build path string from context
 */
export function buildPath(context) {
    const parts = [];
    if (context.time)
        parts.push(`time:${context.time}`);
    if (context.region)
        parts.push(`region:${context.region}`);
    if (context.provider)
        parts.push(`provider:${context.provider}`);
    if (context.agent)
        parts.push(`agent:${context.agent}`);
    if (context.endpoint)
        parts.push(`endpoint:${context.endpoint}`);
    return parts.join(":");
}
