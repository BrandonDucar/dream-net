export type InitStage = "not-started" | "welcome" | "choose-dream-seed" | "link-ritual" | "first-action" | "completed";
export type InitStepType = "show-message" | "attach-dream" | "attach-ritual" | "launch-zen-session" | "create-social-post" | "custom";
export interface InitStep {
    id: string;
    type: InitStepType;
    title: string;
    description?: string;
    dreamId?: string;
    vaultItemId?: string;
    suggestedAction?: string;
    order: number;
}
export interface InitFlowTemplate {
    id: string;
    label: string;
    description?: string;
    steps: InitStep[];
}
export interface IdentityInitState {
    identityId: string;
    templateId: string;
    stage: InitStage;
    completedStepIds: string[];
    createdAt: number;
    updatedAt: number;
}
export interface InitRitualContext {
    identityGrid?: any;
    dreamCortex?: any;
    dreamTankCore?: any;
    dreamVault?: any;
    zenGardenCore?: any;
    socialHubCore?: any;
    fieldLayer?: any;
    narrativeField?: any;
    neuralMesh?: any;
}
export interface InitRitualStatus {
    lastRunAt: number | null;
    templateCount: number;
    activeIdentityCount: number;
    completedCount: number;
    sampleStates: IdentityInitState[];
}
//# sourceMappingURL=types.d.ts.map