"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointProcessor = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const node_url_1 = require("node:url");
const __filename = (0, node_url_1.fileURLToPath)(import.meta.url);
const __dirname = node_path_1.default.dirname(__filename);
const endpointsStore = node_path_1.default.resolve(__dirname, "../graftedEndpoints.json");
async function readStore() {
    try {
        const data = await promises_1.default.readFile(endpointsStore, "utf8");
        return JSON.parse(data);
    }
    catch (error) {
        if (error.code === "ENOENT") {
            await promises_1.default.writeFile(endpointsStore, "[]", "utf8");
            return [];
        }
        throw error;
    }
}
async function writeStore(data) {
    await promises_1.default.writeFile(endpointsStore, JSON.stringify(data, null, 2), "utf8");
}
class EndpointProcessor {
    async install(graft) {
        const endpoints = await readStore();
        const existing = endpoints.find((entry) => entry.path === graft.path);
        const payload = {
            id: graft.id,
            name: graft.name,
            path: graft.path,
            metadata: graft.metadata,
            response: graft.metadata?.response ?? {
                message: `Grafted endpoint ${graft.name} operational.`,
            },
        };
        if (existing) {
            Object.assign(existing, payload);
        }
        else {
            endpoints.push(payload);
        }
        await writeStore(endpoints);
        return {
            ok: true,
            message: `Endpoint ${graft.path} registered`,
            logs: [`Registered grafted endpoint at ${graft.path}`],
        };
    }
}
exports.EndpointProcessor = EndpointProcessor;
