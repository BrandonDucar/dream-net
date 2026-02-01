import { randomUUID } from "node:crypto";
import type { EntityType, MemoryRecord, Trait } from './types.js';
import { appendHistory, getMemoryRecord, listMemoryRecords, upsertMemoryRecord } from './dnaStore.js';
import { vectorStore } from './store/VectorStore.js';
import { runLibrarianCheck } from './index.js';

// Event + Task fallbacks (lightweight Phase 1 definitions)
export interface EventModel {
  id: string;
  timestamp: string;
  sourceType: "agent" | "squad" | "halo" | "api" | "graft" | "spore" | "system";
  sourceId?: string;
  eventType: string;
  severity: "info" | "warning" | "error" | "critical";
  payload?: Record<string, any>;
  handled?: boolean;
}

export interface TaskModel {
  id: string;
  type: string;
  status: "pending" | "running" | "success" | "failed";
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, any>;
  agentIds?: string[];
  endpointId?: string;
  squadId?: string;
}

function createMemoryRecord(entityType: EntityType, entityId: string): MemoryRecord {
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

function getTrait(record: MemoryRecord, key: string): Trait {
  let trait = record.traits.find((item) => item.key === key);
  if (!trait) {
    trait = { key, value: 0.5, lastUpdated: new Date().toISOString() };
    record.traits.push(trait);
  }
  return trait;
}

function adjustTrait(record: MemoryRecord, key: string, delta: number, clamp = true) {
  const trait = getTrait(record, key);
  let next = trait.value + delta;
  if (clamp) {
    next = Math.max(0, Math.min(1, next));
  }
  trait.value = Number(next.toFixed(4));
  trait.lastUpdated = new Date().toISOString();
}

import { getSpiralCoordinate } from './logic/honeycomb.js';

export async function ensureRecord(entityType: EntityType, entityId: string): Promise<MemoryRecord> {
  const existing = await getMemoryRecord(entityType, entityId);
  if (existing) return existing;

  // 🐝 HONEYCOMB EXPANSION
  // Get all existing records to find the next spiral position
  const allRecords = await listMemoryRecords(entityType);
  const nextCoordinate = getSpiralCoordinate(allRecords.length);

  const fresh = createMemoryRecord(entityType, entityId);
  fresh.coordinates = nextCoordinate;

  await upsertMemoryRecord(fresh);

  // [VECTOR MEMORY] Capture entity creation
  try {
    await vectorStore.addMemory(
      `New ${entityType} entity created: ${entityId} at Hive Location q=${nextCoordinate.q},r=${nextCoordinate.r}`,
      { type: "entity_creation", entityType, entityId, coordinates: nextCoordinate }
    );
  } catch (err) {
    console.warn("Vector embedding failed (non-critical):", err);
  }

  return fresh;
}

export async function updateTraitsFromEvent(event: EventModel): Promise<void> {
  // 🐙 OCTOPUS SENTINEL: The Librarian Check
  if (!runLibrarianCheck(event.eventType, event.payload)) {
    return; // DROP PACKET: The Librarian rejected this memory.
  }

  switch (event.eventType) {
    case "api.endpoint.failed": {
      const endpointId = event.payload?.endpointId ?? event.payload?.url ?? event.sourceId;
      if (!endpointId) break;
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
      if (!endpointId) break;
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
      if (!sporeId) break;
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

  // [VECTOR MEMORY INJECTION]
  // Embed the event summary for semantic recall
  try {
    const summary = event.payload?.summary || `Event ${event.eventType} occurred for ${event.sourceId || "unknown"}`;
    await vectorStore.addMemory(
      `Event: ${summary}`,
      { type: "event", eventType: event.eventType, severity: event.severity }
    );
  } catch (err) {
    console.warn("Vector embedding failed (non-critical):", err);
  }
}

export async function updateTraitsFromTaskResult(task: TaskModel): Promise<void> {
  if (!task.squadId && !task.agentIds?.length && !task.endpointId) return;
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

export async function deriveChildMemory(entityType: EntityType, parentId: string, childId: string): Promise<void> {
  const parent = await getMemoryRecord(entityType, parentId);
  if (!parent) return;

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

export async function listAllRecords(): Promise<Record<EntityType, MemoryRecord[]>> {
  return {
    agent: await listMemoryRecords("agent"),
    squad: await listMemoryRecords("squad"),
    endpoint: await listMemoryRecords("endpoint"),
    spore: await listMemoryRecords("spore"),
  };
}

export async function logSystemMemory(action: string, metadata: any = {}) {
  // [SELF-REFLECTION]
  // Allows the System (Antigravity) to log its own evolution
  try {
    await vectorStore.addMemory(
      `SYSTEM ACTION: ${action}`,
      { type: "system_evolution", source: "Antigravity", ...metadata }
    );
  } catch (err) {
    console.warn("System memory logging failed:", err);
  }
}
