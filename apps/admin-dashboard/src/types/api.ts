/**
 * TypeScript types for Control Core API responses
 * These match the types defined in server/control-core/types.ts
 */

export type CoreValue = {
  id: string;
  name: string;
  description: string;
  priority: number;
  encoding?: string[];
};

export type DivineLaw = {
  id: string;
  name: string;
  statement: string;
  meaning: string;
  enforcement?: string[];
  violationConsequences?: string[];
};

export type OrganStatus = {
  name: string;
  status: "operational" | "degraded" | "critical";
  healthScore: number;
  lastUpdate: string; // ISO date string
  metrics?: Record<string, unknown>;
};

export type MoodIndicator = {
  type: string;
  value: number;
  label: string;
};

export type DestinyGoal = {
  name: string;
  status: "on-track" | "behind" | "ahead";
  progress: number;
};

export type Activity = {
  timestamp: string; // ISO date string
  type: string;
  description: string;
  source: string;
};

export type OverviewSnapshot = {
  organismStatus: {
    health: "healthy" | "degraded" | "critical";
    mode: "observe" | "advise" | "semi-auto" | "full-auto";
    uptime: number;
    avgResponseTime: number;
  };
  organStatus: {
    dreamOps: OrganStatus;
    dreamKeeper: OrganStatus;
    shieldCore: OrganStatus;
    starBridge: OrganStatus;
    dreamVault: OrganStatus;
    controlCore: OrganStatus;
  };
  globalHealth: {
    traffic: number;
    errorRate: number;
    latency: number;
    uptime: number;
  };
  currentMood: {
    traits: string[];
    state: string;
    indicators: MoodIndicator[];
  };
  destinyAlignment: {
    phase: string;
    progress: number;
    goals: DestinyGoal[];
    overallAlignment: number;
  };
  recentActivity: Activity[];
  identity: {
    name: string;
    nature: string[];
    coreTraits: string[];
  };
  coreValues: CoreValue[];
};

export type FocusArea = {
  name: string;
  percentage: number;
  priority: number;
};

export type ReasonDecision = {
  id: string;
  timestamp: string; // ISO date string
  type: string;
  description: string;
  cursorAnalysis?: string;
  values: string[];
  status: "approved" | "rejected" | "pending";
  outcome?: string;
};

export type ReflexEvent = {
  id: string;
  timestamp: string; // ISO date string
  type: string;
  description: string;
  latency: number;
  outcome: string;
};

export type ValueTradeOff = {
  decisionId: string;
  chosen: { value: string; impact: number };
  sacrificed: { value: string; impact: number };
  neutral: string[];
};

export type Pattern = {
  id: string;
  name: string;
  description: string;
  learnedAt: string; // ISO date string
};

export type Strategy = {
  id: string;
  name: string;
  description: string;
  updatedAt: string; // ISO date string
};

export type PerceptionSource = {
  name: string;
  type: "event" | "api" | "transaction" | "user" | "log" | "external";
  active: boolean;
};

export type ConsciousnessSnapshot = {
  attention: {
    focusAreas: FocusArea[];
    salienceScore: number;
    trends: unknown[]; // TODO: Define trend type
  };
  reasonDecisions: ReasonDecision[];
  reflexEvents: ReflexEvent[];
  valueTradeOffs: ValueTradeOff[];
  learning: {
    patternsLearned: Pattern[];
    strategiesUpdated: Strategy[];
  };
  perception: {
    sources: PerceptionSource[];
    currentInputs: string[];
  };
};

export type Constraint = {
  id: string;
  description: string;
  category: "forbidden" | "limited" | "conditional";
};

export type Right = {
  id: string;
  name: string;
  description: string;
};

export type BalanceRule = {
  id: string;
  description: string;
  priority: number;
};

export type GovernanceSnapshot = {
  divineLaws: DivineLaw[];
  coreValues: CoreValue[];
  constraints: Constraint[];
  rights: Right[];
  balanceRules: BalanceRule[];
};

