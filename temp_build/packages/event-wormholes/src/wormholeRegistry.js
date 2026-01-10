"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listWormholes = listWormholes;
exports.getWormholeById = getWormholeById;
exports.createWormhole = createWormhole;
exports.updateWormhole = updateWormhole;
exports.deleteWormhole = deleteWormhole;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const WORMHOLE_STORE_PATH = (0, node_path_1.join)(__dirname, "../store/wormholeStore.json");
function loadWormholes() {
    if (!(0, node_fs_1.existsSync)(WORMHOLE_STORE_PATH)) {
        return [];
    }
    try {
        const content = (0, node_fs_1.readFileSync)(WORMHOLE_STORE_PATH, "utf-8");
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
    const dir = (0, node_path_1.join)(WORMHOLE_STORE_PATH, "..");
    if (!(0, node_fs_1.existsSync)(dir)) {
        require("node:fs").mkdirSync(dir, { recursive: true });
    }
    (0, node_fs_1.writeFileSync)(WORMHOLE_STORE_PATH, JSON.stringify(wormholes, null, 2), "utf-8");
}
function listWormholes() {
    return loadWormholes();
}
function getWormholeById(id) {
    return loadWormholes().find((w) => w.id === id) ?? null;
}
function createWormhole(data) {
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
function updateWormhole(id, patch) {
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
function deleteWormhole(id) {
    const wormholes = loadWormholes();
    const filtered = wormholes.filter((w) => w.id !== id);
    if (filtered.length === wormholes.length)
        return false;
    saveWormholes(filtered);
    return true;
}
