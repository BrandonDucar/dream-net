const squadMap = new Map();
export const SquadRegistry = {
    upsert(squad) {
        const now = Date.now();
        const existing = squadMap.get(squad.id);
        const merged = {
            ...squad,
            createdAt: existing?.createdAt ?? squad.createdAt ?? now,
            updatedAt: now,
        };
        squadMap.set(merged.id, merged);
        return merged;
    },
    get(id) {
        return squadMap.get(id);
    },
    getAll() {
        return Array.from(squadMap.values());
    },
    remove(id) {
        squadMap.delete(id);
    },
    clear() {
        squadMap.clear();
    },
    status() {
        return {
            count: squadMap.size,
            squads: Array.from(squadMap.values()).slice(0, 20), // avoid massive dumps
        };
    },
};
//# sourceMappingURL=squadRegistry.js.map