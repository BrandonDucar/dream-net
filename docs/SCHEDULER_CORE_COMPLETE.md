# DreamNet Scheduler Core - Complete Documentation

**Package**: `@dreamnet/dreamnet-scheduler-core`  
**Status**: ✅ Complete  
**Last Updated**: 2025-01-27

---

## Overview

DreamNet Scheduler Core provides **cron-based scheduled operations** for DreamNet. It allows scheduling tasks (kill-switch operations, rate limit updates, cluster management) to run at specific times or intervals.

### Key Features

- **Multiple Schedule Types**: Cron expressions, intervals, and one-time tasks
- **Task Execution**: Executes actions via Control Core
- **Error Handling**: Tracks execution success/failure with error counts
- **Audit Integration**: All executions logged to Audit Core
- **Spider Web Integration**: Task executions bridged to Spider Web for monitoring

---

## Architecture

### How It Works

```
Task Registration → Schedule Calculation → Periodic Check → Task Execution → Audit Logging → Spider Web Bridge
```

1. **Task Registration**: Tasks registered with schedule (cron, interval, or once)
2. **Schedule Calculation**: Next run time calculated based on schedule type
3. **Periodic Check**: System checks every minute if tasks are due
4. **Task Execution**: Task executed via `TaskScheduler.performAction()`
5. **Audit Logging**: Execution logged to Audit Core
6. **Spider Web Bridge**: Events bridged to Spider Web for operational visibility

### Why This Design

- **Flexible Scheduling**: Supports cron, intervals, and one-time tasks
- **Reliable**: Periodic checks ensure tasks aren't missed
- **Auditable**: All executions logged for compliance
- **Observable**: Events bridged to Spider Web for monitoring
- **Error Resilient**: Tracks errors but continues running

---

## API Reference

### Types

```typescript
export type ScheduleType = "cron" | "interval" | "once";

export interface ScheduledTask {
  id: string;
  name: string;
  type: ScheduleType;
  schedule: string; // Cron expression, interval in ms, or timestamp
  enabled: boolean;
  action: string; // e.g., "kill_switch:enable", "rate_limit:update"
  params: Record<string, any>;
  lastRun?: number;
  nextRun?: number;
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
  result?: any;
}
```

### Supported Actions

- `kill_switch:enable` - Enable global kill-switch
- `kill_switch:disable` - Disable global kill-switch
- `rate_limit:update` - Update rate limit (requires `clusterId` and `limit` in params)
- `cluster:enable` - Enable cluster (requires `clusterId` in params)
- `cluster:disable` - Disable cluster (requires `clusterId` in params)

### Functions

#### `registerTask(task: ScheduledTask): void`

Register a scheduled task.

**Example**:
```typescript
DreamNetSchedulerCore.registerTask({
  id: "daily-rate-limit-reset",
  name: "Daily Rate Limit Reset",
  type: "cron",
  schedule: "0 0 * * *", // Every day at midnight
  enabled: true,
  action: "rate_limit:update",
  params: {
    clusterId: "api",
    limit: 10000,
  },
  runCount: 0,
  errorCount: 0,
});
```

#### `startTask(taskId: string): void`

Start a task (begins scheduling).

**Example**:
```typescript
DreamNetSchedulerCore.startTask("daily-rate-limit-reset");
```

#### `stopTask(taskId: string): void`

Stop a task (disables scheduling).

**Example**:
```typescript
DreamNetSchedulerCore.stopTask("daily-rate-limit-reset");
```

#### `getAllTasks(): ScheduledTask[]`

Get all registered tasks.

#### `getTask(taskId: string): ScheduledTask | undefined`

Get a specific task.

---

## Integration Points

### Consumes

- **DreamNet Control Core**: Executes actions (kill-switch, rate limits, clusters)
- **DreamNet Audit Core**: Logs task executions

### Produces

- **Spider Web Events**:
  - `scheduled_task_executed`: When task executes successfully
  - `scheduled_task_failed`: When task execution fails

### Integration Pattern

```typescript
// Task execution flow
TaskScheduler.executeTask(task)
  → performAction(action, params)
  → DreamNetControlCore.[action]()
  → DreamNetAuditCore.recordAction()
  → bridgeToSpiderWeb({ type: "scheduled_task_executed" })
```

---

## Usage Examples

### Cron-Based Task

```typescript
import { DreamNetSchedulerCore } from "@dreamnet/dreamnet-scheduler-core";

// Schedule daily rate limit reset
DreamNetSchedulerCore.registerTask({
  id: "daily-reset",
  name: "Daily Rate Limit Reset",
  type: "cron",
  schedule: "0 0 * * *", // Midnight UTC
  enabled: true,
  action: "rate_limit:update",
  params: {
    clusterId: "api",
    limit: 10000,
  },
  runCount: 0,
  errorCount: 0,
});

DreamNetSchedulerCore.startTask("daily-reset");
```

### Interval-Based Task

```typescript
// Check health every 5 minutes
DreamNetSchedulerCore.registerTask({
  id: "health-check",
  name: "Health Check",
  type: "interval",
  schedule: "300000", // 5 minutes in ms
  enabled: true,
  action: "cluster:enable", // Enable cluster if disabled
  params: {
    clusterId: "api",
  },
  runCount: 0,
  errorCount: 0,
});
```

### One-Time Task

```typescript
// Schedule one-time kill-switch enable
DreamNetSchedulerCore.registerTask({
  id: "maintenance-window",
  name: "Maintenance Window",
  type: "once",
  schedule: String(Date.now() + 3600000), // 1 hour from now
  enabled: true,
  action: "kill_switch:enable",
  params: {},
  runCount: 0,
  errorCount: 0,
});
```

---

## Best Practices

1. **Task IDs**: Use descriptive, unique IDs
2. **Error Handling**: Monitor `errorCount` and `lastError` for failed tasks
3. **Testing**: Test tasks with `type: "once"` before scheduling recurring tasks
4. **Audit Trail**: All executions are logged, review regularly
5. **Resource Cleanup**: Stop tasks when no longer needed

---

## Security Considerations

- **Action Permissions**: Tasks execute with system permissions, ensure actions are safe
- **Parameter Validation**: Validate task parameters before registration
- **Audit Logging**: All task executions logged for compliance
- **Error Monitoring**: Monitor failed tasks for security issues

---

## Related Systems

- **DreamNet Control Core**: Executes scheduled actions
- **DreamNet Audit Core**: Logs task executions
- **Spider Web Core**: Receives task execution events
- **DreamNet Operational Bridge**: Bridges events to Spider Web

---

**Status**: ✅ Complete  
**Next**: Continue with Alerts Core documentation
