export type InitStage =
  | "not-started"
  | "welcome"
  | "choose-dream-seed"
  | "link-ritual"
  | "first-action"
  | "completed";

export type InitStepType =
  | "show-message"
  | "attach-dream"
  | "attach-ritual"
  | "launch-zen-session"
  | "create-social-post"
  | "custom";

export interface InitStep {
  id: string;
  type: InitStepType;

  title: string;
  description?: string;

  // Optional references into DreamNet
  dreamId?: string;              // DreamTank / DreamCortex id
  vaultItemId?: string;          // DreamVault ritual/template
  suggestedAction?: string;      // e.g. "meditate-10-minutes", "post-intro"

  order: number;
}

export interface InitFlowTemplate {
  id: string;                    // e.g. "default-user-init"
  label: string;
  description?: string;
  steps: InitStep[];
}

export interface IdentityInitState {
  identityId: string;            // IdentityGrid node id (e.g. "user:founder", "wallet:0x...")
  templateId: string;
  stage: InitStage;

  // Steps that are completed (by step id)
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

