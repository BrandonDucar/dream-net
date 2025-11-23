import { InitStore } from "./store/initStore";
import { ensureDefaultTemplateSeeded, advanceIdentityInit, completeInitStepForIdentity, } from "./logic/ritualEngine";
import { runInitRitualCycle } from "./scheduler/initScheduler";
export const InitRitualCore = {
    // Templates
    ensureDefaultTemplateSeeded() {
        ensureDefaultTemplateSeeded();
    },
    upsertTemplate(template) {
        return InitStore.upsertTemplate(template);
    },
    listTemplates() {
        return InitStore.listTemplates();
    },
    // Identity state
    getOrCreateIdentityState(identityId, templateId = "default-user-init") {
        return InitStore.getOrCreateIdentityState(identityId, templateId);
    },
    getIdentityState(identityId) {
        return InitStore.getIdentityState(identityId);
    },
    // Flow control
    advanceIdentity(context, identityId, templateId = "default-user-init") {
        return advanceIdentityInit(context, identityId, templateId);
    },
    completeStep(identityId, stepId) {
        return completeInitStepForIdentity(identityId, stepId);
    },
    // Orchestration
    run(context) {
        return runInitRitualCycle(context);
    },
    status() {
        return InitStore.status();
    },
};
export * from "./types";
export default InitRitualCore;
