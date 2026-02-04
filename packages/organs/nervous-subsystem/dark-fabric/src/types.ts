export type FabricTaskType = "generate" | "mutate" | "refactor" | "test" | "merge" | "custom" | "patch" | "heal";

export type FabricTaskStatus = "pending" | "running" | "completed" | "failed" | "approved" | "rejected";

export interface FabricTask {
  id: string;
  type: FabricTaskType;
  status: FabricTaskStatus;
  target: {
    filePath?: string;
    modulePath?: string;
    endpointPath?: string;
    agentId?: string;
  };
  instruction: string;
  context?: Record<string, unknown>;
  generated?: {
    code?: string;
    diff?: string;
    files?: Array<{ path: string; content: string }>;
  };
  sandbox?: {
    runId?: string;
    testResults?: {
      passed: number;
      failed: number;
      logs: string[];
      errors: string[];
    };
    executionTime?: number;
  };
  validation?: {
    passed: boolean;
    issues: string[];
    warnings: string[];
  };
  approval?: {
    approvedBy?: string;
    approvedAt?: Date;
    rejectedBy?: string;
    rejectedAt?: Date;
    reason?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DiffResult {
  filePath: string;
  oldContent: string;
  newContent: string;
  diff: string;
  additions: number;
  deletions: number;
  changes: number;
}

export interface SandboxResult {
  runId: string;
  success: boolean;
  output: string;
  errors: string[];
  testResults?: {
    passed: number;
    failed: number;
    logs: string[];
    errors: string[];
  };
  executionTime: number;
}

