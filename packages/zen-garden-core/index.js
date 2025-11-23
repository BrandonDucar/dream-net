import { GardenStore } from "./store/gardenStore";
import { runZenGardenCycle } from "./scheduler/gardenScheduler";
import { computeRewardsForSession } from "./logic/rewardEngine";
export const ZenGardenCore = {
    upsertSession(session) {
        return GardenStore.upsertSession(session);
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
export * from "./types";
export default ZenGardenCore;
