import type {
  InitStage,
  InitStepType,
  InitStep,
  InitFlowTemplate,
  IdentityInitState,
  InitRitualContext,
  InitRitualStatus,
} from "./types";
import { InitStore } from "./store/initStore";
import {
  ensureDefaultTemplateSeeded,
  advanceIdentityInit,
  completeInitStepForIdentity,
} from "./logic/ritualEngine";
import { runInitRitualCycle } from "./scheduler/initScheduler";

export const InitRitualCore = {
  // Templates
  ensureDefaultTemplateSeeded() {
    ensureDefaultTemplateSeeded();
  },

  upsertTemplate(template: InitFlowTemplate): InitFlowTemplate {
    return InitStore.upsertTemplate(template);
  },

  listTemplates(): InitFlowTemplate[] {
    return InitStore.listTemplates();
  },

  // Identity state
  getOrCreateIdentityState(identityId: string, templateId = "default-user-init"): IdentityInitState {
    return InitStore.getOrCreateIdentityState(identityId, templateId);
  },

  getIdentityState(identityId: string): IdentityInitState | undefined {
    return InitStore.getIdentityState(identityId);
  },

  // Flow control
  advanceIdentity(
    context: InitRitualContext,
    identityId: string,
    templateId = "default-user-init"
  ): { state: IdentityInitState; nextStep?: InitStep } {
    return advanceIdentityInit(context, identityId, templateId);
  },

  completeStep(identityId: string, stepId: string): IdentityInitState {
    return completeInitStepForIdentity(identityId, stepId);
  },

  // Orchestration
  run(context: InitRitualContext): InitRitualStatus {
    return runInitRitualCycle(context);
  },

  status(): InitRitualStatus {
    return InitStore.status();
  },
};

export * from "./types";
export default InitRitualCore;

