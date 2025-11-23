const items = new Map();
const index = new Map();
export const VaultStore = {
    upsert(item) {
        const now = Date.now();
        const existing = items.get(item.id);
        const version = (existing?.version ?? 0) + 1;
        const merged = {
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
    get(id) {
        return items.get(id);
    },
    listAll() {
        return Array.from(items.values());
    },
    upsertIndex(entry) {
        index.set(entry.id, entry);
    },
    getIndex() {
        return index;
    },
    status(lastRunAt) {
        const sampleIndex = Array.from(index.values()).slice(0, 25);
        return {
            lastRunAt,
            itemCount: items.size,
            indexCount: index.size,
            sampleIndex,
        };
    },
};
