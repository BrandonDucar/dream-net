import type {
  DreamIncubation,
  DreamMilestone,
  DreamEvaluation,
  DreamTankStatus,
} from '../types.js';

const dreams: Map<string, DreamIncubation> = new Map();
const milestones: Map<string, DreamMilestone> = new Map();
const evaluations: DreamEvaluation[] = [];

let lastRunAt: number | null = null;

export const TankStore = {
  upsertDream(
    partial: Omit<DreamIncubation, "createdAt" | "updatedAt">
  ): DreamIncubation {
    const now = Date.now();
    const existing = dreams.get(partial.id);

    const merged: DreamIncubation = {
      id: partial.id,
      name: partial.name ?? existing?.name ?? "",
      description: partial.description ?? existing?.description,
      stage: partial.stage ?? existing?.stage ?? "seed",
      health: partial.health ?? existing?.health ?? "stable",
      cortexDreamId: partial.cortexDreamId ?? existing?.cortexDreamId,
      vaultBlueprintId: partial.vaultBlueprintId ?? existing?.vaultBlueprintId,
      ownerIdentityId: partial.ownerIdentityId ?? existing?.ownerIdentityId,
      tags: partial.tags ?? existing?.tags ?? [],
      priorityScore: partial.priorityScore ?? existing?.priorityScore ?? 0.5,
      trustScore: partial.trustScore ?? existing?.trustScore ?? 0.5,
      riskScore: partial.riskScore ?? existing?.riskScore ?? 0.5,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    dreams.set(merged.id, merged);
    return merged;
  },

  getDream(id: string): DreamIncubation | undefined {
    return dreams.get(id);
  },

  listDreams(): DreamIncubation[] {
    return Array.from(dreams.values());
  },

  upsertMilestone(
    partial: Omit<DreamMilestone, "createdAt" | "updatedAt">
  ): DreamMilestone {
    const now = Date.now();
    const existing = milestones.get(partial.id);

    const merged: DreamMilestone = {
      id: partial.id,
      dreamId: partial.dreamId ?? existing?.dreamId ?? "",
      title: partial.title ?? existing?.title ?? "",
      description: partial.description ?? existing?.description,
      state: partial.state ?? existing?.state ?? "planned",
      order: partial.order ?? existing?.order,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    milestones.set(merged.id, merged);
    return merged;
  },

  listMilestonesForDream(dreamId: string): DreamMilestone[] {
    return Array.from(milestones.values()).filter(
      (m) => m.dreamId === dreamId
    );
  },

  addEvaluation(ev: DreamEvaluation) {
    evaluations.push(ev);
  },

  listEvaluations(): DreamEvaluation[] {
    return evaluations;
  },

  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  status(): DreamTankStatus {
    const sampleDreams = Array.from(dreams.values()).slice(0, 25);

    return {
      lastRunAt,
      dreamCount: dreams.size,
      milestoneCount: milestones.size,
      evaluationCount: evaluations.length,
      sampleDreams,
    };
  },
};

