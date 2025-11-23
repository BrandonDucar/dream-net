const commands = [];
let lastRunAt = null;
let lastSnapshot = {
    generatedAt: 0,
    widgets: [],
    recentCommands: [],
};
export const CommandStore = {
    enqueue(cmd) {
        const now = Date.now();
        const record = {
            id: cmd.id,
            type: cmd.type,
            label: cmd.label,
            state: "queued",
            createdAt: now,
            updatedAt: now,
            meta: cmd.meta ?? {},
        };
        commands.unshift(record);
        return record;
    },
    updateCommandState(id, state, meta) {
        const idx = commands.findIndex((c) => c.id === id);
        if (idx === -1)
            return;
        const existing = commands[idx];
        const now = Date.now();
        commands[idx] = {
            ...existing,
            state,
            updatedAt: now,
            meta: { ...(existing.meta ?? {}), ...(meta ?? {}) },
        };
    },
    listRecentCommands(limit = 20) {
        return commands.slice(0, limit);
    },
    setLastRunAt(ts) {
        lastRunAt = ts;
    },
    setSnapshot(snapshot) {
        lastSnapshot = snapshot;
    },
    status() {
        return {
            lastRunAt,
            widgetCount: lastSnapshot.widgets.length,
            commandCount: commands.length,
            snapshot: lastSnapshot,
        };
    },
};
