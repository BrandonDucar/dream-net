const dreams = new Map();
export const DreamRegistry = {
    upsert(dream) {
        const now = Date.now();
        const existing = dreams.get(dream.id);
        const merged = {
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
    get(id) {
        return dreams.get(id);
    },
    getAll() {
        return Array.from(dreams.values());
    },
    setStatus(id, status) {
        const existing = dreams.get(id);
        if (!existing)
            return;
        existing.status = status;
        existing.updatedAt = Date.now();
        dreams.set(id, existing);
    },
    setPriority(id, priority) {
        const existing = dreams.get(id);
        if (!existing)
            return;
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
//# sourceMappingURL=dreamRegistry.js.map