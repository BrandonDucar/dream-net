import type { InitRitualContext, InitStep, IdentityInitState } from '../types.js';
/**
 * Seed a default init flow template if none exist.
 */
export declare function ensureDefaultTemplateSeeded(): void;
/**
 * Advance a given identity one step through its initialization flow.
 * This does not perform side effects (like actually creating posts),
 * but it returns hints about what should be done.
 */
export declare function advanceIdentityInit(ctx: InitRitualContext, identityId: string, templateId?: string): {
    state: IdentityInitState;
    nextStep?: InitStep;
};
/**
 * Mark a specific step as completed for an identity.
 */
export declare function completeInitStepForIdentity(identityId: string, stepId: string): IdentityInitState;
//# sourceMappingURL=ritualEngine.d.ts.map