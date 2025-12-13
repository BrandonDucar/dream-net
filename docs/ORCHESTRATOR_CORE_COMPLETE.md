# Orchestrator Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Orchestrator Core provides the **main orchestration system** for DreamNet. It coordinates cycles across all subsystems, manages execution order, tracks telemetry, and ensures proper system coordination.

---

## Key Features

### Cycle Orchestration
- Single cycle execution
- Interval loop management
- Subsystem coordination
- Execution order management

### Telemetry Tracking
- Cycle tracking
- Duration measurement
- Error tracking
- Status monitoring

### Subsystem Integration
- Dream Vault integration
- Dream Shop integration
- Field Layer integration
- All subsystem integration

---

## Architecture

### Components

1. **Orchestrator Store** (`store/orchestratorStore.ts`)
   - Status storage
   - Telemetry tracking

2. **Run Cycle** (`logic/runCycle.ts`)
   - Cycle execution
   - Subsystem coordination
   - Error handling

---

## API Reference

### Cycle Execution

#### `runSingleCycle(context: OrchestratorContext): Promise<CycleTelemetry>`
Runs a single orchestration cycle.

**Example**:
```typescript
import { OrchestratorCore } from '@dreamnet/orchestrator-core';

const telemetry = await OrchestratorCore.runSingleCycle({
  DreamVault: dreamVault,
  DreamShop: dreamShop,
  FieldLayer: fieldLayer,
  DreamBetCore: dreamBetCore,
  ZenGardenCore: zenGardenCore,
  CivicPanelCore: civicPanelCore,
  DreamTankCore: dreamTankCore,
  LiquidityEngine: liquidityEngine,
  SocialHubCore: socialHubCore,
  InitRitualCore: initRitualCore,
  EconomicEngineCore: economicEngineCore,
  AgentRegistryCore: agentRegistryCore,
  DreamNetOSCore: dreamNetOSCore,
  IdentityGrid: identityGrid,
  ReputationLattice: reputationLattice,
  NarrativeField: narrativeField,
  NeuralMesh: neuralMesh,
});

console.log(`Cycle ${telemetry.cycleId} completed in ${telemetry.durationMs}ms`);
```

### Interval Loop

#### `startIntervalLoop(context: OrchestratorContext, intervalMs: number): NodeJS.Timeout`
Starts an interval loop.

**Example**:
```typescript
const interval = OrchestratorCore.startIntervalLoop(context, 60000); // Every minute

// Later, clear the interval
clearInterval(interval);
```

### Status

#### `getStatus(): OrchestratorStatus`
Gets orchestrator status.

---

## Data Models

### OrchestratorContext

```typescript
interface OrchestratorContext {
  DreamVault?: any;
  DreamShop?: any;
  FieldLayer?: any;
  DreamBetCore?: any;
  ZenGardenCore?: any;
  CivicPanelCore?: any;
  DreamTankCore?: any;
  LiquidityEngine?: any;
  SocialHubCore?: any;
  InitRitualCore?: any;
  EconomicEngineCore?: any;
  AgentRegistryCore?: any;
  DreamNetOSCore?: any;
  WolfPackFundingCore?: any;
  WolfPackAnalystCore?: any;
  CitadelCore?: any;
  IdentityGrid?: any;
  ReputationLattice?: any;
  NarrativeField?: any;
  NeuralMesh?: any;
  LatentCollaboration?: any;
  AgentWalletManager?: any;
  QuantumAnticipation?: any;
  SlugTimeMemory?: any;
  StarBridgeLungs?: any;
  DreamCortex?: any;
  WolfPack?: any;
  PredatorScavengerLoop?: any;
}
```

### CycleTelemetry

```typescript
interface CycleTelemetry {
  cycleId: number;
  startedAt: number;
  finishedAt: number;
  durationMs: number;
  error?: string;
}
```

### OrchestratorStatus

```typescript
interface OrchestratorStatus {
  lastCycle?: CycleTelemetry;
  totalCycles: number;
}
```

---

## Cycle Execution

### Execution Order
1. Subsystem initialization
2. Subsystem cycles
3. Error handling
4. Telemetry recording

### Error Handling
- Continue on errors
- Log errors
- Track failures
- Report issues

---

## Integration Points

### DreamNet Systems
- **All Subsystems**: Cycle coordination
- **Neural Mesh**: Pattern recognition
- **Identity Grid**: Identity management
- **Reputation Lattice**: Reputation tracking

### External Systems
- **Monitoring**: Cycle monitoring
- **Analytics**: Cycle analytics
- **Dashboards**: Cycle visualization

---

## Usage Examples

### Run Single Cycle

```typescript
const telemetry = await OrchestratorCore.runSingleCycle({
  DreamVault: dreamVault,
  DreamShop: dreamShop,
  FieldLayer: fieldLayer,
  // ... other subsystems
});

if (telemetry.error) {
  console.error(`Cycle ${telemetry.cycleId} failed: ${telemetry.error}`);
} else {
  console.log(`Cycle ${telemetry.cycleId} completed successfully`);
}
```

### Start Interval Loop

```typescript
const interval = OrchestratorCore.startIntervalLoop(
  {
    DreamVault: dreamVault,
    DreamShop: dreamShop,
    // ... other subsystems
  },
  60000 // Run every minute
);

// Later, stop the loop
clearInterval(interval);
```

### Get Status

```typescript
const status = OrchestratorCore.getStatus();
console.log(`Total cycles: ${status.totalCycles}`);
if (status.lastCycle) {
  console.log(`Last cycle: ${status.lastCycle.cycleId}`);
  console.log(`Duration: ${status.lastCycle.durationMs}ms`);
}
```

---

## Best Practices

1. **Cycle Management**
   - Run cycles regularly
   - Monitor cycle duration
   - Handle errors gracefully
   - Track telemetry

2. **Subsystem Integration**
   - Provide complete context
   - Include all subsystems
   - Update regularly
   - Monitor integration

3. **Interval Loops**
   - Set appropriate intervals
   - Monitor loop health
   - Handle errors
   - Clean up intervals

---

## Security Considerations

1. **Cycle Security**
   - Validate context
   - Secure cycle execution
   - Audit cycles
   - Prevent manipulation

2. **Telemetry Security**
   - Protect telemetry data
   - Audit telemetry access
   - Secure storage
   - Prevent tampering

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27
