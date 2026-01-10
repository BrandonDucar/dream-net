"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGraft = registerGraft;
exports.getGrafts = getGrafts;
exports.getGraftById = getGraftById;
exports.updateGraftStatus = updateGraftStatus;
exports.removeGraft = removeGraft;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const node_url_1 = require("node:url");
const __filename = (0, node_url_1.fileURLToPath)(import.meta.url);
const __dirname = node_path_1.default.dirname(__filename);
const storePath = node_path_1.default.resolve(__dirname, "graftStore.json");
async function readStore() {
    try {
        const data = await node_fs_1.promises.readFile(storePath, "utf8");
        return JSON.parse(data);
    }
    catch (error) {
        if (error.code === "ENOENT") {
            await node_fs_1.promises.writeFile(storePath, "[]", "utf8");
            return [];
        }
        throw error;
    }
}
async function writeStore(grafts) {
    await node_fs_1.promises.writeFile(storePath, JSON.stringify(grafts, null, 2), "utf8");
}
async function registerGraft(graft) {
    const grafts = await readStore();
    grafts.push(graft);
    await writeStore(grafts);
    return graft;
}
async function getGrafts() {
    return readStore();
}
async function getGraftById(id) {
    const grafts = await readStore();
    return grafts.find((graft) => graft.id === id);
}
async function updateGraftStatus(id, status, update = {}) {
    const grafts = await readStore();
    const idx = grafts.findIndex((g) => g.id === id);
    if (idx === -1)
        return undefined;
    const updated = {
        ...grafts[idx],
        status,
        ...update,
    };
    grafts[idx] = updated;
    await writeStore(grafts);
    return updated;
}
async function removeGraft(id) {
    const grafts = await readStore();
    const filtered = grafts.filter((g) => g.id !== id);
    await writeStore(filtered);
}
