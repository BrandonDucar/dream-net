import type {
  ZenGardenContext,
  ZenSession,
  ActivityRecord,
  RewardRecommendation,
} from '../types.js';
import { GardenStore } from '../store/gardenStore.js';

let rewardCounter = 0;
function nextRewardId() {
  rewardCounter += 1;
  return `reward-${Date.now()}-${rewardCounter}`;
}

export function computeRewardsForSession(
  ctx: ZenGardenContext,
  session: ZenSession
): RewardRecommendation[] {
  const activities = GardenStore.listActivitiesForSession(session.id);
  if (!activities.length) return [];

  const now = Date.now();

  const totalMinutes = activities.reduce(
    (sum, a) => sum + (a.durationMinutes ?? 0),
    0
  );
  const avgIntensity =
    activities.reduce((sum, a) => sum + (a.intensity ?? 0.5), 0) /
    activities.length;

  // Base score from time + intensity
  const baseScore = Math.min(1, totalMinutes / 60) * 0.6 + avgIntensity * 0.4;

  // Optional: sample FieldLayer for global load/stress
  let stressBonus = 0;
  if (ctx.fieldLayer?.sample) {
    const loadSample = ctx.fieldLayer.sample("load", {
      kind: "generic",
      id: "system:global",
    });
    const load = loadSample?.value ?? 0.5;
    // Higher system load -> bonus for doing zen activities
    stressBonus = load * 0.2;
  }

  const totalScore = Math.max(0, Math.min(1, baseScore + stressBonus));

  const rewards: RewardRecommendation[] = [];

  // Points reward
  rewards.push({
    id: nextRewardId(),
    sessionId: session.id,
    identityId: session.identityId,
    kind: "points",
    amount: Math.round(totalScore * 100),
    currency: "ZEN_POINTS",
    reason: `Zen session with ${totalMinutes} minutes and avg intensity ${avgIntensity.toFixed(
      2
    )}.`,
    createdAt: now,
  });

  // Optional token reward hint (no real transfer)
  if (totalScore > 0.7) {
    rewards.push({
      id: nextRewardId(),
      sessionId: session.id,
      identityId: session.identityId,
      kind: "token",
      amount: 0.1,
      currency: "SHEEP",
      reason: "High-quality zen session (score > 0.7). Consider granting SHEEP.",
      createdAt: now,
    });
  }

  // Optional badge
  if (totalMinutes >= 30) {
    rewards.push({
      id: nextRewardId(),
      sessionId: session.id,
      identityId: session.identityId,
      kind: "badge",
      reason: "Completed at least 30 minutes of zen activities.",
      createdAt: now,
    });
  }

  // Persist them
  rewards.forEach((r) => GardenStore.addReward(r));

  return rewards;
}

