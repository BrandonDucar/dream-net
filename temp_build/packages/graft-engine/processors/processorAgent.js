"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentProcessor = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const node_url_1 = require("node:url");
const __filename = (0, node_url_1.fileURLToPath)(import.meta.url);
const __dirname = node_path_1.default.dirname(__filename);
const agentsStore = node_path_1.default.resolve(process.cwd(), "packages/agents/graftedAgents.json");
async function readAgents() {
    try {
        const data = await promises_1.default.readFile(agentsStore, "utf8");
        return JSON.parse(data);
    }
    catch (error) {
        if (error.code === "ENOENT") {
            await promises_1.default.writeFile(agentsStore, "[]", "utf8");
            return [];
        }
        throw error;
    }
}
async function writeAgents(data) {
    await promises_1.default.writeFile(agentsStore, JSON.stringify(data, null, 2), "utf8");
}
class AgentProcessor {
    async install(graft) {
        const agents = await readAgents();
        const payload = {
            id: graft.id,
            name: graft.name,
            role: graft.metadata?.role ?? "Custom",
            capabilities: graft.metadata?.capabilities ?? [],
            path: graft.path,
        };
        const existingIdx = agents.findIndex((agent) => agent.id === graft.id || agent.name === graft.name);
        if (existingIdx >= 0) {
            agents[existingIdx] = payload;
        }
        else {
            agents.push(payload);
        }
        await writeAgents(agents);
        return {
            ok: true,
            message: `Agent ${graft.name} registered`,
            logs: [`Added agent ${graft.name} to grafted registry`],
        };
    }
}
exports.AgentProcessor = AgentProcessor;
