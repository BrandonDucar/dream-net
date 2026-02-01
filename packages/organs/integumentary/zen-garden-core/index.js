import { GardenStore } from './store/gardenStore.js';
import { runZenGardenCycle } from './scheduler/gardenScheduler.js';
import { computeRewardsForSession } from './logic/rewardEngine.js';
export const ZenGardenCore = {
    upsertSession(session) {
        const fullSession = {
            ...session,
            activityIds: session.activityIds ?? [],
            startedAt: session.startedAt ?? Date.now(),
        };
        return GardenStore.upsertSession(fullSession);
    },
    getSession(id) {
        return GardenStore.getSession(id);
    },
    listSessions() {
        return GardenStore.listSessions();
    },
    upsertActivity(record) {
        return GardenStore.upsertActivity(record);
    },
    listActivitiesForSession(sessionId) {
        return GardenStore.listActivitiesForSession(sessionId);
    },
    computeRewardsForSession(context, session) {
        return computeRewardsForSession(context, session);
    },
    run(context) {
        return runZenGardenCycle(context);
    },
    status() {
        return GardenStore.status();
    },
};
export * from './types.js';
export default ZenGardenCore;
//# sourceMappingURL=index.js.map