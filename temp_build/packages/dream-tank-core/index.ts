import type {
  DreamStage,
  DreamHealth,
  DreamIncubation,
  DreamMilestone,
  MilestoneState,
  DreamEvaluation,
  EvaluationKind,
  DreamTankContext,
  DreamTankStatus,
} from "./types";
import { TankStore } from "./store/tankStore";
import { runDreamTankCycle } from "./scheduler/tankScheduler";
import { evaluateDream } from "./logic/evaluationEngine";

export const DreamTankCore = {
  // Dreams
  // ✅ Identity Layer v1: Already accepts ownerIdentityId in DreamIncubation
  // Usage: DreamTankCore.upsertDream({ ..., ownerIdentityId: ctx.identityId, ... })
  upsertDream(
    dream: Omit<DreamIncubation, "createdAt" | "updatedAt">
  ): DreamIncubation {
    return TankStore.upsertDream(dream);
  },

  getDream(id: string): DreamIncubation | undefined {
    return TankStore.getDream(id);
  },

  listDreams(): DreamIncubation[] {
    return TankStore.listDreams();
  },

  // Milestones
  upsertMilestone(
    milestone: Omit<DreamMilestone, "createdAt" | "updatedAt">
  ): DreamMilestone {
    return TankStore.upsertMilestone(milestone);
  },

  listMilestonesForDream(dreamId: string): DreamMilestone[] {
    return TankStore.listMilestonesForDream(dreamId);
  },

  // Evaluations
  evaluateDream(
    context: DreamTankContext,
    dream: DreamIncubation,
    kind: EvaluationKind = "health-check"
  ): DreamEvaluation {
    return evaluateDream(context, dream, kind);
  },

  // Orchestration
  run(context: DreamTankContext): DreamTankStatus {
    return runDreamTankCycle(context);
  },

  status(): DreamTankStatus {
    return TankStore.status();
  },
};

export * from "./types";
export default DreamTankCore;

