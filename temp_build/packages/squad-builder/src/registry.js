"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgents = getAgents;
exports.getAgentById = getAgentById;
exports.registerAgent = registerAgent;
exports.getSquads = getSquads;
exports.getSquadById = getSquadById;
exports.createSquad = createSquad;
exports.updateSquad = updateSquad;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const STORE_PATH = (0, node_path_1.join)(__dirname, "../store/squadStore.json");
function loadStore() {
    if (!(0, node_fs_1.existsSync)(STORE_PATH)) {
        return { agents: [], squads: [] };
    }
    try {
        const content = (0, node_fs_1.readFileSync)(STORE_PATH, "utf-8");
        return JSON.parse(content);
    }
    catch {
        return { agents: [], squads: [] };
    }
}
function saveStore(store) {
    const dir = (0, node_path_1.join)(STORE_PATH, "..");
    if (!(0, node_fs_1.existsSync)(dir)) {
        require("node:fs").mkdirSync(dir, { recursive: true });
    }
    (0, node_fs_1.writeFileSync)(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}
function getAgents() {
    return loadStore().agents;
}
function getAgentById(id) {
    return getAgents().find((a) => a.id === id) ?? null;
}
function registerAgent(agent) {
    const store = loadStore();
    const existing = store.agents.findIndex((a) => a.id === agent.id);
    const fullAgent = {
        ...agent,
        lastSeen: new Date(),
    };
    if (existing >= 0) {
        store.agents[existing] = fullAgent;
    }
    else {
        store.agents.push(fullAgent);
    }
    saveStore(store);
    return fullAgent;
}
function getSquads() {
    return loadStore().squads;
}
function getSquadById(id) {
    return getSquads().find((s) => s.id === id) ?? null;
}
function createSquad(data) {
    const store = loadStore();
    const squad = {
        ...data,
        id: `squad-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    store.squads.push(squad);
    saveStore(store);
    return squad;
}
function updateSquad(id, patch) {
    const store = loadStore();
    const index = store.squads.findIndex((s) => s.id === id);
    if (index < 0)
        return null;
    store.squads[index] = {
        ...store.squads[index],
        ...patch,
        updatedAt: new Date(),
    };
    saveStore(store);
    return store.squads[index];
}
