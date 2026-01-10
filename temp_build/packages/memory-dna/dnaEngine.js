"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTraitsFromEvent = updateTraitsFromEvent;
exports.updateTraitsFromTaskResult = updateTraitsFromTaskResult;
exports.deriveChildMemory = deriveChildMemory;
exports.listAllRecords = listAllRecords;
exports.logSystemMemory = logSystemMemory;
const node_crypto_1 = require("node:crypto");
const dnaStore_1 = require("./dnaStore");
const VectorStore_1 = require("./store/VectorStore");
const index_1 = require("./index");
function createMemoryRecord(entityType, entityId) {
    const now = new Date().toISOString();
    return {
        id: (0, node_crypto_1.randomUUID)(),
        entityType,
        entityId,
        traits: [],
        tags: [],
        history: [],
        createdAt: now,
        updatedAt: now,
    };
}
function getTrait(record, key) {
    let trait = record.traits.find((item) => item.key === key);
    if (!trait) {
        trait = { key, value: 0.5, lastUpdated: new Date().toISOString() };
        record.traits.push(trait);
    }
    return trait;
}
function adjustTrait(record, key, delta, clamp = true) {
    const trait = getTrait(record, key);
    let next = trait.value + delta;
    if (clamp) {
        next = Math.max(0, Math.min(1, next));
    }
    trait.value = Number(next.toFixed(4));
    trait.lastUpdated = new Date().toISOString();
}
const honeycomb_1 = require("./logic/honeycomb");
async function ensureRecord(entityType, entityId) {
    const existing = await (0, dnaStore_1.getMemoryRecord)(entityType, entityId);
    if (existing)
        return existing;
    // 🐝 HONEYCOMB EXPANSION
    // Get all existing records to find the next spiral position
    const allRecords = await (0, dnaStore_1.listMemoryRecords)(entityType);
    const nextCoordinate = (0, honeycomb_1.getSpiralCoordinate)(allRecords.length);
    const fresh = createMemoryRecord(entityType, entityId);
    fresh.coordinates = nextCoordinate;
    await (0, dnaStore_1.upsertMemoryRecord)(fresh);
    // [VECTOR MEMORY] Capture entity creation
    try {
        await VectorStore_1.vectorStore.addMemory(`New ${entityType} entity created: ${entityId} at Hive Location q=${nextCoordinate.q},r=${nextCoordinate.r}`, { type: "entity_creation", entityType, entityId, coordinates: nextCoordinate });
    }
    catch (err) {
        console.warn("Vector embedding failed (non-critical):", err);
    }
    return fresh;
}
async function updateTraitsFromEvent(event) {
    // 🐙 OCTOPUS SENTINEL: The Librarian Check
    if (!(0, index_1.runLibrarianCheck)(event.eventType, event.payload)) {
        return; // DROP PACKET: The Librarian rejected this memory.
    }
    switch (event.eventType) {
        case "api.endpoint.failed": {
            const endpointId = event.payload?.endpointId ?? event.payload?.url ?? event.sourceId;
            if (!endpointId)
                break;
            const record = await ensureRecord("endpoint", String(endpointId));
            adjustTrait(record, "reliability", -0.1);
            adjustTrait(record, "latency", 0.05);
            await (0, dnaStore_1.upsertMemoryRecord)({
                ...record,
                updatedAt: new Date().toISOString(),
                history: [
                    {
                        timestamp: new Date().toISOString(),
                        summary: `Failure recorded: ${event.payload?.error ?? "unknown"}`,
                        metrics: event.payload,
                    },
                    ...record.history,
                ].slice(0, 25),
            });
            break;
        }
        case "api.endpoint.success": {
            const endpointId = event.payload?.endpointId ?? event.payload?.url ?? event.sourceId;
            if (!endpointId)
                break;
            const record = await ensureRecord("endpoint", String(endpointId));
            adjustTrait(record, "reliability", 0.05);
            adjustTrait(record, "latency", -0.02);
            await (0, dnaStore_1.upsertMemoryRecord)({
                ...record,
                updatedAt: new Date().toISOString(),
            });
            break;
        }
        case "halo.cycle.completed": {
            const issues = Number(event.payload?.issuesFound ?? event.payload?.weakPoints ?? 0);
            const tasks = Number(event.payload?.tasksGenerated ?? 0);
            const reliabilityDelta = tasks > 0 ? Math.max(-0.05, 0.1 - issues * 0.02) : 0;
            const squadId = event.payload?.primarySquadId ?? "halo-core";
            const record = await ensureRecord("squad", String(squadId));
            adjustTrait(record, "reliability", reliabilityDelta);
            adjustTrait(record, "velocity", Math.min(0.1, tasks * 0.01));
            await (0, dnaStore_1.upsertMemoryRecord)({
                ...record,
                updatedAt: new Date().toISOString(),
                history: [
                    {
                        timestamp: new Date().toISOString(),
                        summary: `HALO cycle completed: ${tasks} tasks, ${issues} weak points`,
                        metrics: event.payload,
                    },
                    ...record.history,
                ].slice(0, 25),
            });
            break;
        }
        case "graft.installed": {
            const agentId = event.payload?.installedBy ?? "graft-engine";
            const record = await ensureRecord("agent", String(agentId));
            adjustTrait(record, "creativity", 0.05);
            await (0, dnaStore_1.upsertMemoryRecord)({
                ...record,
                history: [
                    {
                        timestamp: new Date().toISOString(),
                        summary: `Graft ${event.payload?.graftId ?? ""} installed successfully`,
                    },
                    ...record.history,
                ].slice(0, 25),
                updatedAt: new Date().toISOString(),
            });
            break;
        }
        case "graft.failed": {
            const agentId = event.payload?.installedBy ?? "graft-engine";
            const record = await ensureRecord("agent", String(agentId));
            adjustTrait(record, "stability", -0.08);
            await (0, dnaStore_1.upsertMemoryRecord)({
                ...record,
                history: [
                    {
                        timestamp: new Date().toISOString(),
                        summary: `Graft failure for ${event.payload?.graftId ?? ""}`,
                        metrics: event.payload,
                    },
                    ...record.history,
                ].slice(0, 25),
                updatedAt: new Date().toISOString(),
            });
            break;
        }
        case "spore.instantiated": {
            const sporeId = event.payload?.sporeId ?? event.sourceId;
            if (!sporeId)
                break;
            const record = await ensureRecord("spore", String(sporeId));
            adjustTrait(record, "utility", 0.05);
            adjustTrait(record, "popularity", 0.07);
            await (0, dnaStore_1.upsertMemoryRecord)({
                ...record,
                history: [
                    {
                        timestamp: new Date().toISOString(),
                        summary: `Spore instantiated for target ${event.payload?.target ?? "unknown"}`,
                        metrics: event.payload,
                    },
                    ...record.history,
                ].slice(0, 25),
                updatedAt: new Date().toISOString(),
            });
            break;
        }
        default:
            break;
    }
    // [VECTOR MEMORY INJECTION]
    // Embed the event summary for semantic recall
    try {
        const summary = event.payload?.summary || `Event ${event.eventType} occurred for ${event.sourceId || "unknown"}`;
        await VectorStore_1.vectorStore.addMemory(`Event: ${summary}`, { type: "event", eventType: event.eventType, severity: event.severity });
    }
    catch (err) {
        console.warn("Vector embedding failed (non-critical):", err);
    }
}
async function updateTraitsFromTaskResult(task) {
    if (!task.squadId && !task.agentIds?.length && !task.endpointId)
        return;
    const delta = task.status === "success" ? 0.08 : -0.1;
    if (task.squadId) {
        const record = await ensureRecord("squad", task.squadId);
        adjustTrait(record, "reliability", delta);
        await (0, dnaStore_1.upsertMemoryRecord)({
            ...record,
            updatedAt: new Date().toISOString(),
            history: [
                {
                    timestamp: new Date().toISOString(),
                    summary: `Task ${task.type} ${task.status}`,
                    metrics: task.metadata,
                },
                ...record.history,
            ].slice(0, 25),
        });
    }
    if (task.agentIds?.length) {
        for (const agentId of task.agentIds) {
            const record = await ensureRecord("agent", agentId);
            adjustTrait(record, "reliability", delta);
            adjustTrait(record, "velocity", task.status === "success" ? 0.02 : 0);
            await (0, dnaStore_1.upsertMemoryRecord)({
                ...record,
                updatedAt: new Date().toISOString(),
            });
        }
    }
    if (task.endpointId) {
        const record = await ensureRecord("endpoint", task.endpointId);
        adjustTrait(record, "reliability", delta);
        await (0, dnaStore_1.upsertMemoryRecord)({
            ...record,
            updatedAt: new Date().toISOString(),
        });
    }
}
async function deriveChildMemory(entityType, parentId, childId) {
    const parent = await (0, dnaStore_1.getMemoryRecord)(entityType, parentId);
    if (!parent)
        return;
    const child = await ensureRecord(entityType, childId);
    child.traits = parent.traits.map((trait) => ({
        key: trait.key,
        value: Number((trait.value * 0.9).toFixed(4)),
        lastUpdated: new Date().toISOString(),
    }));
    child.tags = Array.from(new Set([...parent.tags, "inherited"]));
    child.history = [
        {
            timestamp: new Date().toISOString(),
            summary: `Inherited traits from ${parent.entityId}`,
        },
        ...child.history,
    ].slice(0, 25);
    child.updatedAt = new Date().toISOString();
    await (0, dnaStore_1.upsertMemoryRecord)(child);
}
async function listAllRecords() {
    return {
        agent: await (0, dnaStore_1.listMemoryRecords)("agent"),
        squad: await (0, dnaStore_1.listMemoryRecords)("squad"),
        endpoint: await (0, dnaStore_1.listMemoryRecords)("endpoint"),
        spore: await (0, dnaStore_1.listMemoryRecords)("spore"),
    };
}
async function logSystemMemory(action, metadata = {}) {
    // [SELF-REFLECTION]
    // Allows the System (Antigravity) to log its own evolution
    try {
        await VectorStore_1.vectorStore.addMemory(`SYSTEM ACTION: ${action}`, { type: "system_evolution", source: "Antigravity", ...metadata });
    }
    catch (err) {
        console.warn("System memory logging failed:", err);
    }
}
