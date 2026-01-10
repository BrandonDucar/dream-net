"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMemoryRecord = getMemoryRecord;
exports.upsertMemoryRecord = upsertMemoryRecord;
exports.listMemoryRecords = listMemoryRecords;
exports.appendHistory = appendHistory;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const node_url_1 = require("node:url");
const __filename = (0, node_url_1.fileURLToPath)(import.meta.url);
const __dirname = node_path_1.default.dirname(__filename);
const STORE_MAP = {
    agent: node_path_1.default.resolve(__dirname, "store/agentDna.json"),
    squad: node_path_1.default.resolve(__dirname, "store/squadDna.json"),
    endpoint: node_path_1.default.resolve(__dirname, "store/endpointDna.json"),
    spore: node_path_1.default.resolve(__dirname, "store/sporeDna.json"),
};
async function readStore(entityType) {
    const filePath = STORE_MAP[entityType];
    try {
        const contents = await node_fs_1.promises.readFile(filePath, "utf8");
        return JSON.parse(contents);
    }
    catch (error) {
        if (error.code === "ENOENT") {
            await node_fs_1.promises.mkdir(node_path_1.default.dirname(filePath), { recursive: true });
            await node_fs_1.promises.writeFile(filePath, "[]", "utf8");
            return [];
        }
        throw error;
    }
}
async function writeStore(entityType, records) {
    const filePath = STORE_MAP[entityType];
    await node_fs_1.promises.mkdir(node_path_1.default.dirname(filePath), { recursive: true });
    await node_fs_1.promises.writeFile(filePath, JSON.stringify(records, null, 2), "utf8");
}
async function getMemoryRecord(entityType, entityId) {
    const records = await readStore(entityType);
    return records.find((record) => record.entityId === entityId) ?? null;
}
async function upsertMemoryRecord(record) {
    const records = await readStore(record.entityType);
    const index = records.findIndex((existing) => existing.id === record.id || existing.entityId === record.entityId);
    if (index >= 0) {
        records[index] = record;
    }
    else {
        records.push(record);
    }
    await writeStore(record.entityType, records);
    return record;
}
async function listMemoryRecords(entityType) {
    return readStore(entityType);
}
async function appendHistory(entityType, entityId, historyEntry) {
    const records = await readStore(entityType);
    const index = records.findIndex((record) => record.entityId === entityId);
    if (index === -1)
        return;
    records[index] = {
        ...records[index],
        history: [historyEntry, ...records[index].history].slice(0, 100),
        updatedAt: historyEntry.timestamp,
    };
    await writeStore(entityType, records);
}
