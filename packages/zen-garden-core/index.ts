import type {
  ActivityKind,
  SessionState,
  ActivityRecord,
  ZenSession,
  RewardRecommendation,
  ZenGardenContext,
  ZenGardenStatus,
} from "./types";
import { GardenStore } from "./store/gardenStore";
import { runZenGardenCycle } from "./scheduler/gardenScheduler";
import { computeRewardsForSession } from "./logic/rewardEngine";

export const ZenGardenCore = {
  upsertSession(
    session: Omit<ZenSession, "activityIds" | "startedAt"> & {
      activityIds?: string[];
      startedAt?: number;
    }
  ): ZenSession {
    return GardenStore.upsertSession(session);
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

export * from "./types";
export default ZenGardenCore;

