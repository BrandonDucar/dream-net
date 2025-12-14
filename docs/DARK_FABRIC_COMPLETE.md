# Dark Fabric - Complete Documentation

**Package**: `@dreamnet/dark-fabric`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Dark Fabric provides **AI-powered code generation and mutation** with sandbox testing, validation, and approval workflows. It enables automated code generation, refactoring, testing, and merging with safety checks.

### Key Features

- **Code Generation**: Generate code from natural language instructions
- **Code Mutation**: Mutate and refactor existing code
- **Sandbox Testing**: Test generated code in isolated sandbox
- **Diff Engine**: Compute diffs for code changes
- **Validation**: Validate code safety and quality
- **Approval Workflow**: Approve/reject generated code

---

## API Reference

### Types

```typescript
export type FabricTaskType = "generate" | "mutate" | "refactor" | "test" | "merge" | "custom";
export type FabricTaskStatus = "pending" | "running" | "completed" | "failed" | "approved" | "rejected";

export interface FabricTask {
  id: string;
  type: FabricTaskType;
  status: FabricTaskStatus;
  target: { filePath?: string; modulePath?: string; endpointPath?: string; agentId?: string };
  instruction: string;
  context?: Record<string, unknown>;
  generated?: { code?: string; diff?: string; files?: Array<{ path: string; content: string }> };
  sandbox?: { runId?: string; testResults?: { passed: number; failed: number; logs: string[]; errors: string[] }; executionTime?: number };
  validation?: { passed: boolean; issues: string[]; warnings: string[] };
  approval?: { approvedBy?: string; approvedAt?: Date; rejectedBy?: string; rejectedAt?: Date; reason?: string };
  createdAt: Date;
  updatedAt: Date;
}
```

### Functions

- **`createFabricTask(data): FabricTask`**
- **`getFabricTask(id): FabricTask | null`**
- **`listFabricTasks(filters?): FabricTask[]`**
- **`runFabricTask(taskId): Promise<FabricTask>`**
- **`approveFabricTask(taskId, approvedBy): FabricTask | null`**
- **`rejectFabricTask(taskId, rejectedBy, reason): FabricTask | null`**

---

**Status**: ✅ Implemented

