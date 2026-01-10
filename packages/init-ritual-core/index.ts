import type {
  InitStage,
  InitStepType,
  InitStep,
  InitFlowTemplate,
  IdentityInitState,
  InitRitualContext,
  InitRitualStatus,
} from './types.js';
import { InitStore } from './store/initStore.js';
import {
  ensureDefaultTemplateSeeded,
  advanceIdentityInit,
  completeInitStepForIdentity,
} from './logic/ritualEngine.js';
import { runInitRitualCycle } from './scheduler/initScheduler.js';

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

export * from './types.js';
export * from './logic/GenesisCeremony.js';
export default InitRitualCore;

