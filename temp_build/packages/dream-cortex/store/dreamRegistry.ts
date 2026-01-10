import type { DreamNode, DreamStatus, DreamPriority } from "../types";

const dreams: Map<string, DreamNode> = new Map();

export const DreamRegistry = {
  upsert(dream: Partial<DreamNode> & { id: string; name: string }): DreamNode {
    const now = Date.now();
    const existing = dreams.get(dream.id);

    const merged: DreamNode = {
      id: dream.id,
      name: dream.name,
      description: dream.description ?? existing?.description ?? "",
      status: dream.status ?? existing?.status ?? "idle",
      priority: dream.priority ?? existing?.priority ?? "normal",
      tags: dream.tags ?? existing?.tags ?? [],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      score: dream.score ?? existing?.score ?? 0,
      dependencies: dream.dependencies ?? existing?.dependencies ?? [],
    };

    dreams.set(merged.id, merged);
    return merged;
  },

  get(id: string): DreamNode | undefined {
    return dreams.get(id);
  },

  getAll(): DreamNode[] {
    return Array.from(dreams.values());
  },

  setStatus(id: string, status: DreamStatus) {
    const existing = dreams.get(id);
    if (!existing) return;
    existing.status = status;
    existing.updatedAt = Date.now();
    dreams.set(id, existing);
  },

  setPriority(id: string, priority: DreamPriority) {
    const existing = dreams.get(id);
    if (!existing) return;
    existing.priority = priority;
    existing.updatedAt = Date.now();
    dreams.set(id, existing);
  },

  status() {
    return {
      count: dreams.size,
      sample: Array.from(dreams.values()).slice(0, 20),
    };
  },
};

