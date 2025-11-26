/**
 * DreamNet Control Core Types
 * Type definitions for the Control Core module
 */

/**
 * Core Value - One of DreamNet's fundamental values
 */
export type CoreValue = {
  id: string;
  name: string;
  description: string;
  priority: number; // 1 = highest priority
  encoding?: string[]; // Where this value is encoded in the system
};

/**
 * Divine Law - One of the 8 core invariants that cannot be violated
 */
export type DivineLaw = {
  id: string;
  name: string;
  statement: string;
  meaning: string;
  enforcement?: string[];
  violationConsequences?: string[];
};

/**
 * Organ Status - Status of a core organ system
 */
export type OrganStatus = {
  name: string;
  status: "operational" | "degraded" | "critical";
  healthScore: number; // 0-100
  lastUpdate: Date;
  metrics?: Record<string, unknown>;
};

/**
 * Overview Snapshot - High-level system status
 */
export type OverviewSnapshot = {
  organismStatus: {
    health: "healthy" | "degraded" | "critical";
    mode: "observe" | "advise" | "semi-auto" | "full-auto";
    uptime: number; // percentage
    avgResponseTime: number; // milliseconds
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
    traffic: number; // requests/second
    errorRate: number; // percentage
    latency: number; // milliseconds
    uptime: number; // percentage
  };
  currentMood: {
    traits: string[];
    state: string;
    indicators: MoodIndicator[];
  };
  destinyAlignment: {
    phase: string;
    progress: number; // percentage
    goals: DestinyGoal[];
    overallAlignment: number; // percentage
  };
  recentActivity: Activity[];
  identity: {
    name: string;
    nature: string[];
    coreTraits: string[];
  };
  coreValues: CoreValue[];
};

/**
 * Mood Indicator - Current mood/state indicator
 */
export type MoodIndicator = {
  type: string;
  value: number;
  label: string;
};

/**
 * Destiny Goal - Goal for current phase
 */
export type DestinyGoal = {
  name: string;
  status: "on-track" | "behind" | "ahead";
  progress: number; // percentage
};

/**
 * Activity - Recent system activity
 */
export type Activity = {
  timestamp: Date;
  type: string;
  description: string;
  source: string;
};

/**
 * Consciousness Snapshot - Current consciousness state
 */
export type ConsciousnessSnapshot = {
  attention: {
    focusAreas: FocusArea[];
    salienceScore: number; // 0-10
    trends: AttentionTrend[];
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

/**
 * Focus Area - Current attention focus
 */
export type FocusArea = {
  name: string;
  percentage: number; // 0-100
  priority: number;
};

/**
 * Attention Trend - Trend in attention over time
 */
export type AttentionTrend = {
  time: Date;
  score: number;
};

/**
 * Reason Decision - Decision made through Reason Engine
 */
export type ReasonDecision = {
  id: string;
  timestamp: Date;
  type: string;
  description: string;
  cursorAnalysis?: string;
  values: string[];
  status: "approved" | "rejected" | "pending";
  outcome?: string;
};

/**
 * Reflex Event - Fast-path action taken automatically
 */
export type ReflexEvent = {
  id: string;
  timestamp: Date;
  type: string;
  description: string;
  latency: number; // milliseconds
  outcome: string;
};

/**
 * Value Trade-Off - Trade-off between values in a decision
 */
export type ValueTradeOff = {
  decisionId: string;
  chosen: { value: string; impact: number };
  sacrificed: { value: string; impact: number };
  neutral: string[];
};

/**
 * Pattern - Learned pattern
 */
export type Pattern = {
  id: string;
  name: string;
  description: string;
  learnedAt: Date;
};

/**
 * Strategy - Updated strategy
 */
export type Strategy = {
  id: string;
  name: string;
  description: string;
  updatedAt: Date;
};

/**
 * Perception Source - Source of perception
 */
export type PerceptionSource = {
  name: string;
  type: "event" | "api" | "transaction" | "user" | "log" | "external";
  active: boolean;
};

/**
 * Governance Snapshot - Divine Laws and Core Values
 */
export type GovernanceSnapshot = {
  divineLaws: DivineLaw[];
  coreValues: CoreValue[];
  constraints: Constraint[];
  rights: Right[];
  balanceRules: BalanceRule[];
};

/**
 * Constraint - What DreamNet cannot do
 */
export type Constraint = {
  id: string;
  description: string;
  category: "forbidden" | "limited" | "conditional";
};

/**
 * Right - What DreamNet has the right to
 */
export type Right = {
  id: string;
  name: string;
  description: string;
};

/**
 * Balance Rule - Rule for balancing trade-offs
 */
export type BalanceRule = {
  id: string;
  description: string;
  priority: number;
};

/**
 * Action Candidate - Hypothetical action to evaluate
 */
export type ActionCandidate = {
  id: string;
  type: string;
  description: string;
  target?: string;
  parameters?: Record<string, unknown>;
};

/**
 * Law Evaluation Result - Result of evaluating action against laws
 */
export type LawEvaluationResult = {
  valid: boolean;
  violations: LawViolation[];
  warnings: string[];
  passedLaws: string[];
};

/**
 * Law Violation - Violation of a Divine Law
 */
export type LawViolation = {
  lawId: string;
  lawName: string;
  reason: string;
  severity: "critical" | "high" | "medium" | "low";
};

/**
 * Event Candidate - Event to classify
 */
export type EventCandidate = {
  id: string;
  type: string;
  severity?: "critical" | "high" | "medium" | "low";
  source?: string;
  timestamp: Date;
  data?: Record<string, unknown>;
};

