import type {
  ActivityKind,
  SessionState,
  ActivityRecord,
  ZenSession,
  RewardRecommendation,
  ZenGardenContext,
  ZenGardenStatus,
} from './types.js';
import { GardenStore } from './store/gardenStore.js';
import { runZenGardenCycle } from './scheduler/gardenScheduler.js';
import { computeRewardsForSession } from './logic/rewardEngine.js';

export const ZenGardenCore = {
  upsertSession(
    session: Omit<ZenSession, "activityIds" | "startedAt"> & {
      activityIds?: string[];
      startedAt?: number;
    }
  ): ZenSession {
    const fullSession: ZenSession = {
      ...session,
      activityIds: session.activityIds ?? [],
      startedAt: session.startedAt ?? Date.now(),
    };
    return GardenStore.upsertSession(fullSession);
  },

  getSession(id: string): ZenSession | undefined {
    return GardenStore.getSession(id);
  },

  listSessions(): ZenSession[] {
    return GardenStore.listSessions();
  },

  upsertActivity(record: ActivityRecord): ActivityRecord {
    return GardenStore.upsertActivity(record);
  },

  listActivitiesForSession(sessionId: string): ActivityRecord[] {
    return GardenStore.listActivitiesForSession(sessionId);
  },

  computeRewardsForSession(
    context: ZenGardenContext,
    session: ZenSession
  ): RewardRecommendation[] {
    return computeRewardsForSession(context, session);
  },

  run(context: ZenGardenContext): ZenGardenStatus {
    return runZenGardenCycle(context);
  },

  status(): ZenGardenStatus {
    return GardenStore.status();
  },
};

export * from './types.js';
export default ZenGardenCore;

