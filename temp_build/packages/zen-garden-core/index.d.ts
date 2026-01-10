import type { ActivityRecord, ZenSession, RewardRecommendation, ZenGardenContext, ZenGardenStatus } from "./types";
export declare const ZenGardenCore: {
    upsertSession(session: Omit<ZenSession, "activityIds" | "startedAt"> & {
        activityIds?: string[];
        startedAt?: number;
    }): ZenSession;
    getSession(id: string): ZenSession | undefined;
    listSessions(): ZenSession[];
    upsertActivity(record: ActivityRecord): ActivityRecord;
    listActivitiesForSession(sessionId: string): ActivityRecord[];
    computeRewardsForSession(context: ZenGardenContext, session: ZenSession): RewardRecommendation[];
    run(context: ZenGardenContext): ZenGardenStatus;
    status(): ZenGardenStatus;
};
export * from "./types";
export default ZenGardenCore;
