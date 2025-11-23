import type { InitStep, InitFlowTemplate, IdentityInitState, InitRitualContext, InitRitualStatus } from "./types";
export declare const InitRitualCore: {
    ensureDefaultTemplateSeeded(): void;
    upsertTemplate(template: InitFlowTemplate): InitFlowTemplate;
    listTemplates(): InitFlowTemplate[];
    getOrCreateIdentityState(identityId: string, templateId?: string): IdentityInitState;
    getIdentityState(identityId: string): IdentityInitState | undefined;
    advanceIdentity(context: InitRitualContext, identityId: string, templateId?: string): {
        state: IdentityInitState;
        nextStep?: InitStep;
    };
    completeStep(identityId: string, stepId: string): IdentityInitState;
    run(context: InitRitualContext): InitRitualStatus;
    status(): InitRitualStatus;
};
export * from "./types";
export default InitRitualCore;
