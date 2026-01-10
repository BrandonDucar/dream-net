import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_MAP = {
    agent: path.resolve(__dirname, "store/agentDna.json"),
    squad: path.resolve(__dirname, "store/squadDna.json"),
    endpoint: path.resolve(__dirname, "store/endpointDna.json"),
    spore: path.resolve(__dirname, "store/sporeDna.json"),
};
async function readStore(entityType) {
    const filePath = STORE_MAP[entityType];
    try {
        const contents = await fs.readFile(filePath, "utf8");
        return JSON.parse(contents);
    }
    catch (error) {
        if (error.code === "ENOENT") {
            await fs.mkdir(path.dirname(filePath), { recursive: true });
            await fs.writeFile(filePath, "[]", "utf8");
            return [];
        }
        throw error;
    }
}
async function writeStore(entityType, records) {
    const filePath = STORE_MAP[entityType];
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(records, null, 2), "utf8");
}
export async function getMemoryRecord(entityType, entityId) {
    const records = await readStore(entityType);
    return records.find((record) => record.entityId === entityId) ?? null;
}
export async function upsertMemoryRecord(record) {
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
export async function listMemoryRecords(entityType) {
    return readStore(entityType);
}
export async function appendHistory(entityType, entityId, historyEntry) {
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
