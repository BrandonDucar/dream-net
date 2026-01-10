import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const WORMHOLE_STORE_PATH = join(__dirname, "../store/wormholeStore.json");
function loadWormholes() {
    if (!existsSync(WORMHOLE_STORE_PATH)) {
        return [];
    }
    try {
        const content = readFileSync(WORMHOLE_STORE_PATH, "utf-8");
        return JSON.parse(content).map((w) => ({
            ...w,
            createdAt: new Date(w.createdAt),
            updatedAt: new Date(w.updatedAt),
        }));
    }
    catch {
        return [];
    }
}
function saveWormholes(wormholes) {
    const dir = join(WORMHOLE_STORE_PATH, "..");
    if (!existsSync(dir)) {
        require("node:fs").mkdirSync(dir, { recursive: true });
    }
    writeFileSync(WORMHOLE_STORE_PATH, JSON.stringify(wormholes, null, 2), "utf-8");
}
export function listWormholes() {
    return loadWormholes();
}
export function getWormholeById(id) {
    return loadWormholes().find((w) => w.id === id) ?? null;
}
export function createWormhole(data) {
    const wormholes = loadWormholes();
    const wormhole = {
        id: `wormhole-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name: data.name,
        description: data.description,
        from: data.from,
        to: data.to,
        filters: data.filters,
        enabled: data.enabled ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    wormholes.push(wormhole);
    saveWormholes(wormholes);
    return wormhole;
}
export function updateWormhole(id, patch) {
    const wormholes = loadWormholes();
    const index = wormholes.findIndex((w) => w.id === id);
    if (index < 0)
        return null;
    wormholes[index] = {
        ...wormholes[index],
        ...patch,
        updatedAt: new Date(),
    };
    saveWormholes(wormholes);
    return wormholes[index];
}
export function deleteWormhole(id) {
    const wormholes = loadWormholes();
    const filtered = wormholes.filter((w) => w.id !== id);
    if (filtered.length === wormholes.length)
        return false;
    saveWormholes(filtered);
    return true;
}
//# sourceMappingURL=wormholeRegistry.js.map