const sessions = new Map();
const activities = new Map();
const rewards = [];
let lastRunAt = null;
export const GardenStore = {
    upsertSession(partial) {
        const now = Date.now();
        const existing = sessions.get(partial.id);
        const merged = {
            id: partial.id,
            identityId: partial.identityId ?? existing?.identityId ?? "",
            state: partial.state ?? existing?.state ?? "planned",
            title: partial.title ?? existing?.title,
            ritualVaultItemId: partial.ritualVaultItemId ?? existing?.ritualVaultItemId,
            startedAt: existing?.startedAt ?? partial.startedAt ?? now,
            endedAt: partial.endedAt ?? existing?.endedAt,
            activityIds: partial.activityIds ?? existing?.activityIds ?? [],
            tags: partial.tags ?? existing?.tags ?? [],
            meta: { ...(existing?.meta ?? {}), ...(partial.meta ?? {}) },
        };
        sessions.set(merged.id, merged);
        return merged;
    },
    getSession(id) {
        return sessions.get(id);
    },
    listSessions() {
        return Array.from(sessions.values());
    },
    upsertActivity(record) {
        activities.set(record.id, record);
        const session = sessions.get(record.sessionId);
        if (session && !session.activityIds.includes(record.id)) {
            session.activityIds.push(record.id);
            sessions.set(session.id, session);
        }
        return record;
    },
    listActivitiesForSession(sessionId) {
        return Array.from(activities.values()).filter((a) => a.sessionId === sessionId);
    },
    addReward(rec) {
        rewards.push(rec);
    },
    listRewards() {
        return rewards;
    },
    setLastRunAt(ts) {
        lastRunAt = ts;
    },
    status() {
        const sampleSessions = Array.from(sessions.values()).slice(0, 25);
        return {
            lastRunAt,
            sessionCount: sessions.size,
            activityCount: activities.size,
            rewardCount: rewards.length,
            sampleSessions,
        };
    },
};
//# sourceMappingURL=gardenStore.js.map