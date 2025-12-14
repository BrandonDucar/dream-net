# 🏰 Citadel Core Package

## Overview

The Citadel Core package orchestrates DreamNet's strategic command center - 8 specialized Vertex AI agents that generate snapshots, reports, and blueprints.

## Installation

This package is part of the DreamNet monorepo and is automatically available when the server starts.

## Usage

### Basic Usage

```typescript
import { CitadelCore } from "@dreamnet/citadel-core";

// Run Citadel cycle
const { agentsRun, errors } = await CitadelCore.run({
  neuralMesh: neuralMeshInstance, // optional
});

// Get status
const status = CitadelCore.getStatus();
```

### Integration with Orchestrator

The Citadel is automatically integrated into OrchestratorCore and runs first in every cycle:

```typescript
OrchestratorCore.startIntervalLoop({
  CitadelCore: citadelCoreInstance,
  // ... other systems
}, 60 * 1000);
```

## API

### `CitadelCore.run(context?)`

Runs all available agents in sequence, validating dependencies before each run.

**Parameters**:
- `context` (optional): `CitadelContext` with optional `neuralMesh`

**Returns**: `Promise<{ agentsRun: number[]; errors: string[] }>`

**Example**:
```typescript
const result = await CitadelCore.run();
console.log(`Ran agents: ${result.agentsRun.join(", ")}`);
if (result.errors.length > 0) {
  console.error(`Errors: ${result.errors.join(", ")}`);
}
```

### `CitadelCore.getStatus()`

Gets the current status of The Citadel.

**Returns**: `CitadelStatus`

**Example**:
```typescript
const status = CitadelCore.getStatus();
console.log(`Total runs: ${status.totalRuns}`);
if (status.lastRun) {
  console.log(`Last run: ${status.lastRun.agentsRun.join(", ")}`);
}
```

## Types

### `CitadelContext`

```typescript
interface CitadelContext {
  neuralMesh?: any; // Optional Neural Mesh instance
}
```

### `CitadelStatus`

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

## Agent Execution Order

1. **Agent 1**: Snapshot Engine (no dependencies)
2. **Agent 2**: Drone Dome Scanner (depends on Agent 1)
3. **Agent 3**: Event Fabric Builder (depends on Agents 1-2)
4. **Agent 4**: DreamKeeper Architect (depends on Agents 1-3)
5. **Agent 5**: DeployKeeper Architect (depends on Agents 1-2) - *Pending*
6. **Agent 6**: Data Spine Architect (depends on Agent 1) - *Pending*
7. **Agent 7**: SocialOps Architect (depends on Agents 1-2) - *Pending*
8. **Agent 8**: Master Blueprint Planner (depends on Agents 1-7) - *Pending*

## Error Handling

- Agents skip if dependencies are missing (not an error)
- Errors are logged but don't stop the cycle
- All errors are tracked in status

## See Also

- [The Citadel Documentation](../../docs/THE_CITADEL.md)
- [Agent Helpers](../../server/services/AgentHelpers.ts)
- [Agent Output Store](../../server/services/AgentOutputStore.ts)

