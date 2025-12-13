# Citadel Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Citadel Core provides the **strategic command center** for DreamNet. It orchestrates Vertex AI agents (1-8) that generate snapshots, reports, and blueprints, managing dependencies and ensuring agents run in the correct order.

---

## Key Features

### Agent Orchestration
- Sequential agent execution
- Dependency validation
- Error handling
- Status tracking

### Agent Types
- **Agent 1**: Snapshot Generator
- **Agent 2**: Drone Dome Scanner
- **Agent 3**: Event Fabric Builder
- **Agent 4**: DreamKeeper Architect
- **Agents 5-8**: Future agents

### Dependency Management
- Agent dependencies
- Dependency validation
- Skip logic for missing dependencies
- Dependency tracking

---

## Architecture

### Components

1. **Citadel Store** (`index.ts`)
   - Status storage
   - Run tracking
   - Error logging

2. **Agent Execution** (`index.ts`)
   - Agent orchestration
   - Dependency checking
   - Error handling

---

## API Reference

### Execution

#### `run(context?: CitadelContext): Promise<{ agentsRun: number[]; errors: string[] }>`
Runs Citadel cycle.

**Example**:
```typescript
import { CitadelCore } from '@dreamnet/citadel-core';

const result = await CitadelCore.run({
  neuralMesh: neuralMesh,
});

console.log(`Agents run: ${result.agentsRun}`);
console.log(`Errors: ${result.errors.length}`);
```

### Status

#### `getStatus(): CitadelStatus`
Gets Citadel status.

**Example**:
```typescript
const status = CitadelCore.getStatus();
console.log(`Total runs: ${status.totalRuns}`);
console.log(`Last run: ${status.lastRun?.cycleId}`);
```

---

## Data Models

### CitadelContext

```typescript
interface CitadelContext {
  neuralMesh?: any;
}
```

### CitadelStatus

```typescript
interface CitadelStatus {
  lastRun?: {
    cycleId: number;
    startedAt: number;
    finishedAt: number;
    durationMs: number;
    agentsRun: number[];
    errors?: string[];
  };
  totalRuns: number;
}
```

---

## Agent Execution Order

### Agent 1: Snapshot Generator
- **Dependencies**: None
- **Purpose**: Generate system snapshot
- **Output**: Snapshot data

### Agent 2: Drone Dome Scanner
- **Dependencies**: Agent 1
- **Purpose**: Scan and analyze
- **Output**: Analysis data

### Agent 3: Event Fabric Builder
- **Dependencies**: Agents 1, 2
- **Purpose**: Build event fabric
- **Output**: Event fabric data

### Agent 4: DreamKeeper Architect
- **Dependencies**: Agents 1, 2, 3
- **Purpose**: Architect DreamKeeper
- **Output**: Architecture data

### Agents 5-8
- **Status**: Future agents
- **Pattern**: Follow dependency chain
- **Execution**: Automatic when dependencies available

---

## Dependency Validation

### Validation Process
1. Check agent dependencies
2. Validate dependency outputs
3. Skip if dependencies missing
4. Log dependency status

### Dependency Types
- **Required**: Must exist
- **Optional**: Can be skipped
- **Chained**: Depends on previous agents

---

## Error Handling

### Error Types
- **Agent Errors**: Individual agent failures
- **Dependency Errors**: Missing dependencies
- **Cycle Errors**: Overall cycle failures

### Error Recovery
- Continue on agent errors
- Skip missing dependencies
- Log all errors
- Track error patterns

---

## Integration Points

### DreamNet Systems
- **Neural Mesh**: Memory integration
- **Agent Registry**: Agent management
- **DreamNet OS**: System integration

### External Systems
- **Vertex AI**: Agent execution
- **Analytics**: Performance tracking
- **Logging**: Error logging

---

## Usage Examples

### Run Citadel Cycle

```typescript
const result = await CitadelCore.run({
  neuralMesh: {
    remember: (data) => {
      console.log('Remembering:', data);
    },
  },
});

console.log(`Agents run: ${result.agentsRun.join(', ')}`);
if (result.errors.length > 0) {
  console.error(`Errors: ${result.errors.join(', ')}`);
}
```

### Get Status

```typescript
const status = CitadelCore.getStatus();
console.log(`Total runs: ${status.totalRuns}`);
if (status.lastRun) {
  console.log(`Last run duration: ${status.lastRun.durationMs}ms`);
  console.log(`Agents run: ${status.lastRun.agentsRun.join(', ')}`);
}
```

---

## Best Practices

1. **Agent Design**
   - Define clear dependencies
   - Handle errors gracefully
   - Log execution details
   - Track performance

2. **Dependency Management**
   - Document dependencies
   - Validate dependencies
   - Handle missing dependencies
   - Track dependency chains

3. **Error Handling**
   - Log all errors
   - Continue on non-critical errors
   - Track error patterns
   - Improve error recovery

---

## Security Considerations

1. **Agent Security**
   - Validate agent outputs
   - Secure agent execution
   - Audit agent runs
   - Prevent manipulation

2. **Dependency Security**
   - Validate dependencies
   - Secure dependency data
   - Audit dependency usage
   - Prevent dependency abuse

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27
