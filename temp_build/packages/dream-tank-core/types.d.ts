export type DreamStage = "seed" | "cocoon" | "prototype" | "beta" | "launch-ready" | "launched" | "archived";
export type DreamHealth = "stable" | "fragile" | "stalled" | "infected";
export interface DreamIncubation {
    id: string;
    name: string;
    description?: string;
    stage: DreamStage;
    health: DreamHealth;
    cortexDreamId?: string;
    vaultBlueprintId?: string;
    ownerIdentityId?: string;
    tags?: string[];
    priorityScore?: number;
    trustScore?: number;
    riskScore?: number;
    createdAt: number;
    updatedAt: number;
}
export type MilestoneState = "planned" | "in-progress" | "completed" | "dropped";
export interface DreamMilestone {
    id: string;
    dreamId: string;
    title: string;
    description?: string;
    state: MilestoneState;
    order?: number;
    createdAt: number;
    updatedAt: number;
}
export type EvaluationKind = "health-check" | "stage-review" | "risk-assessment" | "launch-readiness";
export interface DreamEvaluation {
    id: string;
    dreamId: string;
    kind: EvaluationKind;
    summary: string;
    score: number;
    createdAt: number;
    meta?: Record<string, any>;
}
export interface DreamTankContext {
    dreamCortex?: any;
    dreamVault?: any;
    reputationLattice?: any;
    fieldLayer?: any;
    identityGrid?: any;
    narrativeField?: any;
    neuralMesh?: any;
}
export interface DreamTankStatus {
    lastRunAt: number | null;
    dreamCount: number;
    milestoneCount: number;
    evaluationCount: number;
    sampleDreams: DreamIncubation[];
}
