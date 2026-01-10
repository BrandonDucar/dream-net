import type {
  ZenSession,
  ActivityRecord,
  RewardRecommendation,
  ZenGardenStatus,
} from '../types.js';

const sessions: Map<string, ZenSession> = new Map();
const activities: Map<string, ActivityRecord> = new Map();
const rewards: RewardRecommendation[] = [];

let lastRunAt: number | null = null;

export const GardenStore = {
  upsertSession(
    partial: Omit<ZenSession, "startedAt"> & { startedAt?: number }
  ): ZenSession {
    const now = Date.now();
    const existing = sessions.get(partial.id);

    const merged: ZenSession = {
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

  getSession(id: string): ZenSession | undefined {
    return sessions.get(id);
  },

  listSessions(): ZenSession[] {
    return Array.from(sessions.values());
  },

  upsertActivity(
    record: ActivityRecord
  ): ActivityRecord {
    activities.set(record.id, record);

    const session = sessions.get(record.sessionId);
    if (session && !session.activityIds.includes(record.id)) {
      session.activityIds.push(record.id);
      sessions.set(session.id, session);
    }

    return record;
  },

  listActivitiesForSession(sessionId: string): ActivityRecord[] {
    return Array.from(activities.values()).filter(
      (a) => a.sessionId === sessionId
    );
  },

  addReward(rec: RewardRecommendation) {
    rewards.push(rec);
  },

  listRewards(): RewardRecommendation[] {
    return rewards;
  },

  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  status(): ZenGardenStatus {
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

