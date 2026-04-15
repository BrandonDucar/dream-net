export type DreamStage =
  | "seed"
  | "cocoon"
  | "prototype"
  | "beta"
  | "launch-ready"
  | "launched"
  | "archived";

export type DreamHealth =
  | "stable"
  | "fragile"
  | "stalled"
  | "infected";

export interface DreamIncubation {
  id: string;                 // same as DreamCortex dream id where possible
  name: string;
  description?: string;

  stage: DreamStage;
  health: DreamHealth;

  // Links out
  cortexDreamId?: string;
  vaultBlueprintId?: string;
  ownerIdentityId?: string;   // IdentityGrid node id (user/team)
  tags?: string[];

  // Scores
  priorityScore?: number;     // [0,1]
  trustScore?: number;        // [0,1]
  riskScore?: number;         // [0,1]

  createdAt: number;
  updatedAt: number;
}

export type MilestoneState =
  | "planned"
  | "in-progress"
  | "completed"
  | "dropped";

export interface DreamMilestone {
  id: string;
  dreamId: string;            // DreamIncubation.id
  title: string;
  description?: string;
  state: MilestoneState;
  order?: number;
  createdAt: number;
  updatedAt: number;
}

export type EvaluationKind =
  | "health-check"
  | "stage-review"
  | "risk-assessment"
  | "launch-readiness";

export interface DreamEvaluation {
  id: string;
  dreamId: string;
  kind: EvaluationKind;
  summary: string;
  score: number;              // [0,1]
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

