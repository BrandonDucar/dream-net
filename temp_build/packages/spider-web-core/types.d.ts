export type SpiderNodeKind = "wolf" | "whale" | "orca" | "dream-state" | "os" | "narrative" | "data-vault" | "economic-engine" | "neural-mesh" | "other";
export interface SpiderNodeRef {
    kind: SpiderNodeKind;
    id: string;
    label?: string;
}
export type SignalKind = "wolf-win-story" | "whale-hook-crosspost" | "dream-state-decision" | "status-broadcast" | "data-ingest" | "legal-review" | "fly-caught" | "message-response" | "revenue-event" | "engagement-event" | "custom";
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
    dependsOn?: string[];
    triggers?: string[];
    responseThreadId?: string;
    parentThreadId?: string;
    templateId?: string;
    executable: boolean;
    executionPlan?: ExecutionPlan;
}
export interface ExecutionPlan {
    steps: ExecutionStep[];
    rollbackSteps?: ExecutionStep[];
}
export interface ExecutionStep {
    id: string;
    action: string;
    target: SpiderNodeRef;
    params: Record<string, any>;
    order: number;
}
export type FlyType = "message" | "mention" | "transaction" | "webhook" | "metric" | "alert" | "social" | "api";
export type FlyPriority = "low" | "medium" | "high" | "critical";
export interface Fly {
    id: string;
    type: FlyType;
    source: string;
    payload: Record<string, any>;
    caughtAt: number;
    priority: FlyPriority;
    sticky: boolean;
    processed: boolean;
    threadId?: string;
    meta?: Record<string, any>;
}
export type SensorType = "twilio" | "telegram" | "twitter" | "webhook" | "blockchain" | "email" | "api" | "social" | "metric";
export interface WebSensor {
    id: string;
    type: SensorType;
    active: boolean;
    config: Record<string, any>;
    catchRate: number;
    lastCheckAt?: number;
    meta?: Record<string, any>;
}
export interface ThreadTemplate {
    id: string;
    name: string;
    description: string;
    kind: SignalKind;
    sourcePattern: SpiderNodeRef;
    targetPattern: SpiderNodeRef[];
    executionPlan?: ExecutionPlan;
    priority: ThreadPriority;
    conditions?: Record<string, any>;
    usageCount: number;
    successRate: number;
    createdAt: number;
    updatedAt: number;
}
export interface ThreadPattern {
    id: string;
    pattern: string;
    threadKind: SignalKind;
    successRate: number;
    avgExecutionTime: number;
    usageCount: number;
    discoveredAt: number;
    meta?: Record<string, any>;
}
export interface FlyPattern {
    id: string;
    flyType: FlyType;
    source: string;
    commonPayloadKeys: string[];
    typicalThreadKind: SignalKind;
    frequency: number;
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
}
export interface SpiderWebStatus {
    lastRunAt: number | null;
    threadCount: number;
    pendingCount: number;
    inProgressCount: number;
    completedCount: number;
    failedCount: number;
    insightCount: number;
    flyCount: number;
    fliesCaughtToday: number;
    stickyFlyCount: number;
    activeSensors: number;
    avgExecutionTime: number;
    threadSuccessRate: number;
    templateCount: number;
    patternCount: number;
    sampleThreads: SignalThread[];
    sampleInsights: SpiderInsight[];
    sampleFlies: Fly[];
    activeSensorsList: WebSensor[];
}
