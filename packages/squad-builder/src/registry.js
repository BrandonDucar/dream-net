import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const STORE_PATH = join(__dirname, "../store/squadStore.json");
function loadStore() {
    if (!existsSync(STORE_PATH)) {
        return { agents: [], squads: [] };
    }
    try {
        const content = readFileSync(STORE_PATH, "utf-8");
        return JSON.parse(content);
    }
    catch {
        return { agents: [], squads: [] };
    }
}
function saveStore(store) {
    const dir = join(STORE_PATH, "..");
    if (!existsSync(dir)) {
        require("node:fs").mkdirSync(dir, { recursive: true });
    }
    writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}
export function getAgents() {
    return loadStore().agents;
}
export function getAgentById(id) {
    return getAgents().find((a) => a.id === id) ?? null;
}
export function registerAgent(agent) {
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
export function getSquads() {
    return loadStore().squads;
}
export function getSquadById(id) {
    return getSquads().find((s) => s.id === id) ?? null;
}
export function createSquad(data) {
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
export function updateSquad(id, patch) {
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
//# sourceMappingURL=registry.js.map