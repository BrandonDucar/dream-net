# DreamNet Scheduler Core - Complete Documentation

**Package**: `@dreamnet/dreamnet-scheduler-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

DreamNet Scheduler Core provides **cron-based scheduled operations** for running tasks on schedules. It supports cron expressions, one-time tasks, and periodic tasks.

### Key Features

- **Cron Scheduling**: Support for cron expressions
- **One-Time Tasks**: Schedule tasks to run once
- **Periodic Tasks**: Schedule recurring tasks
- **Task Management**: Register, start, stop tasks
- **Execution Tracking**: Track task execution history
- **Error Handling**: Track errors and retry logic

---

## API Reference

### Types

```typescript
export type ScheduleType = "cron" | "interval" | "once";

export interface ScheduledTask {
  id: string;
  name: string;
  description?: string;
  type: ScheduleType;
  schedule: string; // Cron expression or interval
  enabled: boolean;
  task: () => Promise<void>;
  nextRun?: number;
  lastRun?: number;
  runCount: number;
  errorCount: number;
  lastError?: string;
}

export interface TaskExecution {
  taskId: string;
  startedAt: number;
  completedAt?: number;
  success: boolean;
  error?: string;
}
```

### Main Export

#### `DreamNetSchedulerCore`

**Methods**:
- **`registerTask(task): void`**
- **`startTask(taskId): void`**
- **`stopTask(taskId): void`**
- **`getAllTasks(): ScheduledTask[]`**
- **`getTask(taskId): ScheduledTask | undefined`**

---

**Status**: ✅ Implemented

