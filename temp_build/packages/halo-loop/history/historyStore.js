"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendHistory = appendHistory;
exports.getHistory = getHistory;
exports.getLatestEntry = getLatestEntry;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const node_url_1 = require("node:url");
const __filename = (0, node_url_1.fileURLToPath)(import.meta.url);
const __dirname = node_path_1.default.dirname(__filename);
const historyFile = node_path_1.default.resolve(__dirname, "haloHistory.json");
let writeQueue = Promise.resolve();
async function readHistoryFile() {
    try {
        const data = await node_fs_1.promises.readFile(historyFile, "utf8");
        return JSON.parse(data);
    }
    catch (error) {
        if (error.code === "ENOENT") {
            await node_fs_1.promises.writeFile(historyFile, "[]", "utf8");
            return [];
        }
        throw error;
    }
}
async function writeHistoryFile(entries) {
    await node_fs_1.promises.writeFile(historyFile, JSON.stringify(entries, null, 2), "utf8");
}
async function appendHistory(entry) {
    writeQueue = writeQueue.then(async () => {
        const history = await readHistoryFile();
        history.unshift(entry);
        const trimmed = history.slice(0, 200); // keep latest 200 cycles
        await writeHistoryFile(trimmed);
    });
    return writeQueue;
}
async function getHistory(limit = 20) {
    const history = await readHistoryFile();
    return history.slice(0, limit);
}
async function getLatestEntry() {
    const history = await readHistoryFile();
    return history.length ? history[0] : null;
}
