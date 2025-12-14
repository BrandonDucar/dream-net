# Runtime Bridge Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Runtime Bridge Core provides **runtime orchestration and context management** for DreamNet systems. It initializes runtime contexts, executes cycles, manages loops, and provides status snapshots for monitoring and debugging.

---

## Key Features

### Runtime Context Management
- Context initialization
- Subsystem integration
- Dependency management
- Status tracking

### Cycle Execution
- Single cycle execution
- Loop management
- Error handling
- Status updates

### Status Snapshots
- Runtime status
- Subsystem status
- Cycle metrics
- Error tracking

---

## Architecture

### Components

1. **Runtime Harness** (`logic/runtimeHarness.ts`)
   - Context initialization
   - Cycle execution
   - Loop management
   - Status tracking

2. **Runtime Store** (`store/runtimeStore.ts`)
   - Status storage
   - Snapshot management
   - Metrics tracking

3. **Runtime Status Adapter** (`adapters/runtimeStatusAdapter.ts`)
   - Status adaptation
   - Format conversion
   - Integration

---

## API Reference

### Context Initialization

#### `initContext(ctx: RuntimeContext): void`
Initializes runtime context.

**Example**:
```typescript
import { RuntimeBridgeCore } from '@dreamnet/runtime-bridge-core';

RuntimeBridgeCore.initContext({
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
  EconomicEngineCore: economicEngine,
  AgentRegistryCore: agentRegistry,
  DreamNetOSCore: dreamNetOS,
  WolfPackFundingCore: wolfPackFunding,
  WolfPackAnalystCore: wolfPackAnalyst,
  IdentityGrid: identityGrid,
  ReputationLattice: reputationLattice,
  NarrativeField: narrativeField,
  NeuralMesh: neuralMesh,
  OrchestratorCore: orchestrator,
  LatentCollaboration: latentCollaboration,
  AgentWalletManager: agentWalletManager,
});
```

### Cycle Execution

#### `runOnce(): RuntimeSnapshot`
Runs single cycle.

**Example**:
```typescript
const snapshot = RuntimeBridgeCore.runOnce();
console.log(`Last Cycle: ${snapshot.lastCycleAt}`);
console.log(`Duration: ${snapshot.lastCycleDurationMs}ms`);
```

### Loop Management

#### `startLoop(intervalMs?: number): void`
Starts runtime loop.

**Example**:
```typescript
RuntimeBridgeCore.startLoop(60000); // Run every 60 seconds
```

#### `stopLoop(): void`
Stops runtime loop.

**Example**:
```typescript
RuntimeBridgeCore.stopLoop();
```

### Status

#### `getStatus(): RuntimeBridgeStatus`
Gets runtime bridge status.

**Example**:
```typescript
const status = RuntimeBridgeCore.getStatus();
console.log(`Initialized: ${status.initialized}`);
console.log(`OS Status: ${status.snapshots.osStatus}`);
console.log(`Civic Status: ${status.snapshots.civicStatus}`);
console.log(`Econ Status: ${status.snapshots.econStatus}`);
```

---

## Data Models

### RuntimeContext

```typescript
interface RuntimeContext {
  // Core subsystems
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

  // Shared infra
  IdentityGrid?: any;
  ReputationLattice?: any;
  NarrativeField?: any;
  NeuralMesh?: any;

  // Orchestrator
  OrchestratorCore?: any;
  
  // Latent Collaboration
  LatentCollaboration?: any;
  AgentWalletManager?: any;
}
```

### RuntimeSnapshot

```typescript
interface RuntimeSnapshot {
  lastCycleAt: number | null;
  lastCycleDurationMs: number | null;
  lastCycleError?: string;
  osStatus?: any;         // DreamNetOSCore.status()
  civicStatus?: any;      // CivicPanelCore.status()
  econStatus?: any;       // EconomicEngineCore.status()
}
```

### RuntimeBridgeStatus

```typescript
interface RuntimeBridgeStatus {
  initialized: boolean;
  snapshots: RuntimeSnapshot;
}
```

---

## Runtime Context Subsystems

### Core Subsystems
- **DreamVault**: Dream item storage
- **DreamShop**: Marketplace
- **FieldLayer**: Field tracking
- **DreamBetCore**: Gaming
- **ZenGardenCore**: Wellness
- **CivicPanelCore**: Admin dashboard
- **DreamTankCore**: Dream incubation
- **LiquidityEngine**: Liquidity pools
- **SocialHubCore**: Social feed
- **InitRitualCore**: Onboarding
- **EconomicEngineCore**: Token economics
- **AgentRegistryCore**: Agent management
- **DreamNetOSCore**: OS layer
- **WolfPackFundingCore**: Funding leads
- **WolfPackAnalystCore**: Analysis

### Shared Infrastructure
- **IdentityGrid**: Identity graph
- **ReputationLattice**: Reputation scoring
- **NarrativeField**: Narrative logging
- **NeuralMesh**: Neural system

### Orchestration
- **OrchestratorCore**: Main orchestrator
- **LatentCollaboration**: Agent collaboration
- **AgentWalletManager**: Wallet management

---

## Integration Points

### DreamNet Systems
- All core subsystems
- Shared infrastructure
- Orchestration systems
- Agent systems

### External Systems
- Monitoring systems
- Logging systems
- Analytics systems

---

## Usage Examples

### Initialize Context

```typescript
RuntimeBridgeCore.initContext({
  DreamVault: dreamVault,
  DreamShop: dreamShop,
  FieldLayer: fieldLayer,
  // ... other subsystems
});
```

### Run Single Cycle

```typescript
const snapshot = RuntimeBridgeCore.runOnce();
if (snapshot.lastCycleError) {
  console.error(`Cycle error: ${snapshot.lastCycleError}`);
}
```

### Start Loop

```typescript
RuntimeBridgeCore.startLoop(60000); // Run every minute
```

### Get Status

```typescript
const status = RuntimeBridgeCore.getStatus();
console.log(`Initialized: ${status.initialized}`);
console.log(`Last Cycle: ${status.snapshots.lastCycleAt}`);
```

---

## Best Practices

1. **Context Initialization**
   - Initialize all subsystems
   - Check dependencies
   - Validate context
   - Handle errors

2. **Cycle Execution**
   - Monitor cycle duration
   - Handle errors gracefully
   - Track metrics
   - Log status

3. **Loop Management**
   - Set appropriate intervals
   - Handle interruptions
   - Monitor performance
   - Graceful shutdown

---

## Security Considerations

1. **Context Security**
   - Validate subsystems
   - Protect context data
   - Secure initialization
   - Audit access

2. **Execution Security**
   - Validate cycles
   - Handle errors securely
   - Monitor execution
   - Prevent abuse

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27
