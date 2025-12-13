# Octopus Executor - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Octopus Executor provides **multi-arm task execution** for DreamNet. It manages multiple execution "arms" that can process tasks in parallel, enabling concurrent execution of deployments, batch jobs, streams, secrets, builds, watchers, cleanup, and analytics tasks.

---

## Key Features

### Multi-Arm Execution
- Multiple execution arms
- Parallel task processing
- Arm-specific handlers
- Configurable parallelism

### Task Types
- Deploy app tasks
- Rotate secret tasks
- Run batch job tasks
- Ingest stream tasks
- Run build tasks
- Watch config tasks
- Cleanup artifacts tasks
- Emit analytics tasks
- Generic tasks

### Arm Management
- Arm registration
- Arm configuration
- Arm status tracking
- Arm enable/disable

---

## Architecture

### Components

1. **Octopus Engine** (`engine/octopusEngine.ts`)
   - Task queuing
   - Task execution
   - Arm coordination

2. **Arm Registry** (`arms/armRegistry.ts`)
   - Arm registration
   - Arm management
   - Handler management

3. **Octopus Scheduler** (`scheduler/octopusScheduler.ts`)
   - Cycle execution
   - Task processing

---

## API Reference

### Initialization

#### `init(): Promise<void>`
Initializes Octopus Executor.

**Example**:
```typescript
import { OctopusExecutor } from '@dreamnet/octopus-executor';

await OctopusExecutor.init();
```

### Task Management

#### `enqueue(task: OctopusTask): void`
Enqueues a task for execution.

**Example**:
```typescript
OctopusExecutor.enqueue({
  id: `task-${Date.now()}`,
  type: 'deploy-app',
  payload: {
    appId: 'app-123',
    environment: 'production',
  },
  createdAt: Date.now(),
  priority: 0.8,
});
```

### Execution

#### `run(context: OctopusContext): Promise<void>`
Runs Octopus Executor cycle.

#### `status(): OctopusRuntimeStatus`
Gets Octopus Executor status.

---

## Data Models

### OctopusArmId

```typescript
type OctopusArmId =
  | 'deploy'
  | 'batch'
  | 'streams'
  | 'secrets'
  | 'builds'
  | 'watchers'
  | 'cleanup'
  | 'analytics';
```

### OctopusTaskType

```typescript
type OctopusTaskType =
  | 'deploy-app'
  | 'rotate-secret'
  | 'run-batch-job'
  | 'ingest-stream'
  | 'run-build'
  | 'watch-config'
  | 'cleanup-artifacts'
  | 'emit-analytics'
  | 'generic';
```

### OctopusTask

```typescript
interface OctopusTask {
  id: string;
  type: OctopusTaskType;
  payload?: Record<string, any>;
  createdAt: number;
  priority?: number; // 0–1
}
```

### OctopusArmConfig

```typescript
interface OctopusArmConfig {
  id: OctopusArmId;
  enabled: boolean;
  maxParallel?: number;
}
```

### OctopusArmStatus

```typescript
interface OctopusArmStatus {
  id: OctopusArmId;
  enabled: boolean;
  activeTasks: number;
  processedCount: number;
  lastRunAt?: number;
}
```

---

## Default Arms

### Deploy Arm
- Application deployments
- Max parallel: 2
- Deployment tasks

### Batch Arm
- Batch job execution
- Max parallel: 4
- Batch processing

### Streams Arm
- Stream ingestion
- Max parallel: 2
- Data streaming

### Secrets Arm
- Secret rotation
- Max parallel: 1
- Security tasks

### Builds Arm
- Build execution
- Max parallel: 2
- Build tasks

### Watchers Arm
- Config watching
- Max parallel: 2
- Monitoring tasks

### Cleanup Arm
- Artifact cleanup
- Max parallel: 2
- Cleanup tasks

### Analytics Arm
- Analytics emission
- Max parallel: variable
- Analytics tasks

---

## Task Execution

### Execution Flow
1. Task enqueued
2. Arm selected
3. Handler executed
4. Result tracked

### Parallel Execution
- Configurable parallelism
- Per-arm limits
- Concurrent processing
- Load balancing

---

## Integration Points

### DreamNet Systems
- **DreamOps**: Deployment operations
- **DeployKeeper**: Deployment management
- **EnvKeeper**: Environment management
- **HALO Loop**: Health monitoring
- **Neural Mesh**: Memory integration
- **Quantum Anticipation**: Predictive tasks
- **Squad Alchemy**: Squad dispatch
- **Wolf Pack**: Anomaly tasks

### External Systems
- **CI/CD**: Build systems
- **Deployment**: Deployment platforms
- **Monitoring**: Task monitoring
- **Analytics**: Task analytics

---

## Usage Examples

### Initialize Octopus

```typescript
await OctopusExecutor.init();
```

### Enqueue Task

```typescript
OctopusExecutor.enqueue({
  id: `task-${Date.now()}`,
  type: 'deploy-app',
  payload: {
    appId: 'app-123',
    environment: 'production',
    version: '1.0.0',
  },
  createdAt: Date.now(),
  priority: 0.9,
});
```

### Run Cycle

```typescript
await OctopusExecutor.run({
  dreamOps: dreamOps,
  deployKeeper: deployKeeper,
  envKeeper: envKeeper,
  haloLoop: haloLoop,
  neuralMesh: neuralMesh,
});

const status = OctopusExecutor.status();
console.log(`Queued tasks: ${status.queuedTasks}`);
status.arms.forEach(arm => {
  console.log(`${arm.id}: ${arm.activeTasks} active, ${arm.processedCount} processed`);
});
```

---

## Best Practices

1. **Task Design**
   - Use appropriate types
   - Set correct priorities
   - Include necessary payload
   - Track task IDs

2. **Arm Configuration**
   - Set appropriate parallelism
   - Enable/disable as needed
   - Monitor arm performance
   - Balance load

3. **Task Execution**
   - Handle errors gracefully
   - Track execution results
   - Monitor task queues
   - Optimize throughput

---

## Security Considerations

1. **Task Security**
   - Validate task data
   - Sanitize payloads
   - Secure task execution
   - Audit task processing

2. **Arm Security**
   - Validate arm handlers
   - Secure arm execution
   - Audit arm activity
   - Prevent abuse

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

