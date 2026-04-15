import type {
  VaultItem,
  VaultIndexEntry,
  VaultStatus,
} from "../types";

const items: Map<string, VaultItem> = new Map();
const index: Map<string, VaultIndexEntry> = new Map();

export const VaultStore = {
  upsert(item: Omit<VaultItem, "createdAt" | "updatedAt" | "version">): VaultItem {
    const now = Date.now();
    const existing = items.get(item.id);

    const version = (existing?.version ?? 0) + 1;

    const merged: VaultItem = {
      ...existing,
      ...item,
      tags: item.tags ?? existing?.tags ?? [],
      links: item.links ?? existing?.links ?? [],
      refs: item.refs ?? existing?.refs ?? [],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      version,
    };

    items.set(merged.id, merged);
    return merged;
  },

  get(id: string): VaultItem | undefined {
    return items.get(id);
  },

  listAll(): VaultItem[] {
    return Array.from(items.values());
  },

  upsertIndex(entry: VaultIndexEntry) {
    index.set(entry.id, entry);
  },

  getIndex(): Map<string, VaultIndexEntry> {
    return index;
  },

  status(lastRunAt: number | null): VaultStatus {
    const sampleIndex = Array.from(index.values()).slice(0, 25);

    return {
      lastRunAt,
      itemCount: items.size,
      indexCount: index.size,
      sampleIndex,
    };
  },
};

