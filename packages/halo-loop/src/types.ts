export type Severity = "low" | "medium" | "high" | "critical";

export interface Issue {
  id: string;
  analyzer: string;
  severity: Severity;
  description: string;
  data?: Record<string, unknown>;
}

export interface Recommendation {
  action: string;
  description: string;
  target?: string;
  meta?: Record<string, unknown>;
}

export interface AnalyzerResult {
  name: string;
  issues: Issue[];
  recommendations: Recommendation[];
}

export interface WeakPoint {
  id: string;
  severity: Severity;
  summary: string;
  relatedIssues: Issue[];
}

export interface SquadTask {
  type: string;
  payload: Record<string, unknown>;
  priority?: "low" | "normal" | "high" | "critical";
  targetAgents?: string[];
  status?: "pending" | "suggested" | "pending-approval";
}

export interface DispatchResult {
  task: SquadTask;
  squadId?: string;
  status: "queued" | "dispatched" | "failed";
  error?: string;
}

export interface HaloCycleResult {
  id: string;
  timestamp: string;
  analysis: AnalyzerResult[];
  weakPoints: WeakPoint[];
  generatedTasks: SquadTask[];
  dispatchResults: DispatchResult[];
  summary: string;
}

export interface HaloStatus {
  lastRunAt: string | null;
  lastSummary: string | null;
  isRunning: boolean;
  pendingTriggers: string[];
}

export interface TriggerRegistration {
  name: string;
  stop: () => void;
}


