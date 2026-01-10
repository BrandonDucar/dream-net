export type SpiderNodeKind =
  | "wolf"
  | "whale"
  | "orca"
  | "dream-state"
  | "os"
  | "narrative"
  | "data-vault"
  | "economic-engine"
  | "neural-mesh"
  | "system"
  | "health"
  | "operational"
  | "cluster"
  | "other";

export interface SpiderNodeRef {
  kind: SpiderNodeKind;
  id: string;                // "wolf:funding", "whale:tiktok", "orca:social", etc.
  label?: string;
}

export type SignalKind =
  | "wolf-win-story"
  | "whale-hook-crosspost"
  | "dream-state-decision"
  | "status-broadcast"
  | "data-ingest"
  | "legal-review"
  | "fly-caught"
  | "message-response"
  | "revenue-event"
  | "engagement-event"
  | "health"
  | "incident"
  | "governance"
  | "throttle"
  | "economic"
  | "scale"
  | "automation"
  | "control"
  | "signal"
  | "custom";

export type SignalStatus = "pending" | "in-progress" | "completed" | "blocked" | "failed";

export type ThreadPriority = "low" | "medium" | "high" | "critical";

export interface SignalThread {
  id: string;
  source: SpiderNodeRef;
  targets: SpiderNodeRef[];
  kind: SignalKind;
  payload?: Record<string, any>;
  status: SignalStatus;
  priority: ThreadPriority;
  createdAt: number;
  updatedAt: number;
  executedAt?: number;
  executionResult?: Record<string, any>;
  error?: string;

  // Dependencies & chains
  dependsOn?: string[];      // Thread IDs this depends on
  triggers?: string[];        // Thread IDs this triggers

  // Bidirectional
  responseThreadId?: string;  // Thread that responds back
  parentThreadId?: string;    // Thread that created this

  // Template
  templateId?: string;        // Thread template used

  // Execution
  executable: boolean;         // Can this thread execute actions?
  executionPlan?: ExecutionPlan;
}

export interface ExecutionPlan {
  steps: ExecutionStep[];
  rollbackSteps?: ExecutionStep[];
}

export interface ExecutionStep {
  id: string;
  action: string;             // "create-orca-post", "update-narrative", etc.
  target: SpiderNodeRef;
  params: Record<string, any>;
  order: number;
}

// Fly stuck in web system
export type FlyType = "message" | "mention" | "transaction" | "webhook" | "metric" | "alert" | "social" | "api";

export type FlyPriority = "low" | "medium" | "high" | "critical";

export interface Fly {
  id: string;
  type: FlyType;
  source: string;             // "twilio", "telegram", "twitter", "webhook", etc.
  payload: Record<string, any>;
  caughtAt: number;
  priority: FlyPriority;
  sticky: boolean;            // Does it stick to web or bounce off?
  processed: boolean;
  threadId?: string;          // Thread created from this fly
  meta?: Record<string, any>;
}

export type SensorType = "twilio" | "telegram" | "twitter" | "webhook" | "blockchain" | "email" | "api" | "social" | "metric";

export interface WebSensor {
  id: string;
  type: SensorType;
  active: boolean;
  config: Record<string, any>;
  catchRate: number;          // Flies caught per hour
  lastCheckAt?: number;
  meta?: Record<string, any>;
}

// Thread templates
export interface ThreadTemplate {
  id: string;
  name: string;
  description: string;
  kind: SignalKind;
  sourcePattern: SpiderNodeRef;
  targetPattern: SpiderNodeRef[];
  executionPlan?: ExecutionPlan;
  priority: ThreadPriority;
  conditions?: Record<string, any>;  // When to use this template
  usageCount: number;
  successRate: number;        // 0-1
  createdAt: number;
  updatedAt: number;
}

// Thread learning patterns
export interface ThreadPattern {
  id: string;
  pattern: string;            // Pattern description
  threadKind: SignalKind;
  successRate: number;        // 0-1
  avgExecutionTime: number;   // ms
  usageCount: number;
  discoveredAt: number;
  meta?: Record<string, any>;
}

// Fly patterns (for learning)
export interface FlyPattern {
  id: string;
  flyType: FlyType;
  source: string;
  commonPayloadKeys: string[];
  typicalThreadKind: SignalKind;
  frequency: number;          // How often this pattern appears
  discoveredAt: number;
  meta?: Record<string, any>;
}

export type SpiderInsightType = "pattern" | "recommendation" | "warning" | "fly-pattern" | "thread-optimization";

export interface SpiderInsight {
  id: string;
  type: SpiderInsightType;
  title: string;
  description: string;
  createdAt: number;
  meta?: Record<string, any>;
}

export interface SpiderWebContext {
  wolfPackCore?: any;
  whalePackCore?: any;
  orcaPackCore?: any;
  dreamStateCore?: any;
  dreamNetOSCore?: any;
  narrativeField?: any;
  dataVaultCore?: any;
  economicEngineCore?: any;
  neuralMesh?: any;
  spiderWebCore?: {
    AISEOCore?: any;
    ShieldCore?: any;
  };
}

export interface SpiderWebStatus {
  lastRunAt: number | null;
  threadCount: number;
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  failedCount: number;
  insightCount: number;

  // Fly metrics
  flyCount: number;
  fliesCaughtToday: number;
  stickyFlyCount: number;
  activeSensors: number;

  // Thread metrics
  avgExecutionTime: number;
  threadSuccessRate: number;
  templateCount: number;
  patternCount: number;

  sampleThreads: SignalThread[];
  sampleInsights: SpiderInsight[];
  sampleFlies: Fly[];
  activeSensorsList: WebSensor[];
}
