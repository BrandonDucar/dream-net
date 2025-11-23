import { randomUUID } from "node:crypto";
import { getMemoryRecord, listMemoryRecords, upsertMemoryRecord } from "./dnaStore";
function createMemoryRecord(entityType, entityId) {
    const now = new Date().toISOString();
    return {
        id: randomUUID(),
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
async function ensureRecord(entityType, entityId) {
    const existing = await getMemoryRecord(entityType, entityId);
    if (existing)
        return existing;
    const fresh = createMemoryRecord(entityType, entityId);
    await upsertMemoryRecord(fresh);
    return fresh;
}
export async function updateTraitsFromEvent(event) {
    switch (event.eventType) {
        case "api.endpoint.failed": {
            const endpointId = event.payload?.endpointId ?? event.payload?.url ?? event.sourceId;
            if (!endpointId)
                break;
            const record = await ensureRecord("endpoint", String(endpointId));
            adjustTrait(record, "reliability", -0.1);
            adjustTrait(record, "latency", 0.05);
            await upsertMemoryRecord({
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
            await upsertMemoryRecord({
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
            await upsertMemoryRecord({
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
            await upsertMemoryRecord({
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
            await upsertMemoryRecord({
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
            await upsertMemoryRecord({
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
}
export async function updateTraitsFromTaskResult(task) {
    if (!task.squadId && !task.agentIds?.length && !task.endpointId)
        return;
    const delta = task.status === "success" ? 0.08 : -0.1;
    if (task.squadId) {
        const record = await ensureRecord("squad", task.squadId);
        adjustTrait(record, "reliability", delta);
        await upsertMemoryRecord({
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
            await upsertMemoryRecord({
                ...record,
                updatedAt: new Date().toISOString(),
            });
        }
    }
    if (task.endpointId) {
        const record = await ensureRecord("endpoint", task.endpointId);
        adjustTrait(record, "reliability", delta);
        await upsertMemoryRecord({
            ...record,
            updatedAt: new Date().toISOString(),
        });
    }
}
export async function deriveChildMemory(entityType, parentId, childId) {
    const parent = await getMemoryRecord(entityType, parentId);
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
    await upsertMemoryRecord(child);
}
export async function listAllRecords() {
    return {
        agent: await listMemoryRecords("agent"),
        squad: await listMemoryRecords("squad"),
        endpoint: await listMemoryRecords("endpoint"),
        spore: await listMemoryRecords("spore"),
    };
}
