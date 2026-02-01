import type { ZenSession, ActivityRecord, RewardRecommendation, ZenGardenStatus } from '../types.js';
export declare const GardenStore: {
    upsertSession(partial: Omit<ZenSession, "startedAt"> & {
        startedAt?: number;
    }): ZenSession;
    getSession(id: string): ZenSession | undefined;
    listSessions(): ZenSession[];
    upsertActivity(record: ActivityRecord): ActivityRecord;
    listActivitiesForSession(sessionId: string): ActivityRecord[];
    addReward(rec: RewardRecommendation): void;
    listRewards(): RewardRecommendation[];
    setLastRunAt(ts: number | null): void;
    status(): ZenGardenStatus;
};
//# sourceMappingURL=gardenStore.d.ts.map