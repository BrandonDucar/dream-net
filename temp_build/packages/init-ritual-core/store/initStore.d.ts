import type { InitFlowTemplate, IdentityInitState, InitRitualStatus } from "../types";
export declare const InitStore: {
    upsertTemplate(template: InitFlowTemplate): InitFlowTemplate;
    getTemplate(id: string): InitFlowTemplate | undefined;
    listTemplates(): InitFlowTemplate[];
    getOrCreateIdentityState(identityId: string, templateId: string): IdentityInitState;
    updateIdentityState(state: IdentityInitState): IdentityInitState;
    getIdentityState(identityId: string): IdentityInitState | undefined;
    listIdentityStates(): IdentityInitState[];
    setLastRunAt(ts: number | null): void;
    status(): InitRitualStatus;
};
