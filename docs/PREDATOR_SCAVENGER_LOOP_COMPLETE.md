# Predator Scavenger Loop (PSL) - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Predator Scavenger Loop (PSL) provides **decay detection and resource cleanup** for DreamNet. It detects decaying routes, events, services, agents, and configs, quarantines them (predator), and reclaims/recycles resources (scavenger).

---

## Key Features

### Decay Detection
- Route decay detection
- Event decay detection
- Service decay detection
- Agent decay detection
- Config decay detection

### Predator Actions
- Quarantine decaying resources
- Flag problematic resources
- Isolate issues
- Prevent spread

### Scavenger Actions
- Reclaim unused resources
- Recycle resources
- Clean up decay
- Optimize utilization

---

## Architecture

### Components

1. **PSL Scheduler** (`scheduler/pslScheduler.ts`)
   - Cycle execution
   - Decay detection
   - Action execution

---

## API Reference

### Execution

#### `run(context: PSLContext): PSLStatus`
Runs PSL cycle.

**Example**:
```typescript
import { PredatorScavengerLoop } from '@dreamnet/predator-scavenger';

const status = PredatorScavengerLoop.run({
  haloLoop: haloLoop,
  wolfPack: wolfPack,
  slugTime: slugTime,
  neuralMesh: neuralMesh,
  octopusExecutor: octopusExecutor,
});
```

### Status

#### `status(): PSLStatus`
Gets PSL status.

---

## Data Models

### DecaySignal

```typescript
interface DecaySignal {
  id: string;
  targetType: 'route' | 'event' | 'service' | 'agent' | 'config' | 'generic';
  targetId: string;
  severity: number; // 0–1
  detectedAt: number;
  meta?: Record<string, any>;
}
```

### PredatorAction

```typescript
interface PredatorAction {
  signalId: string;
  targetId: string;
  quarantined: boolean;
  flagged: boolean;
  meta?: Record<string, any>;
}
```

### ScavengerAction

```typescript
interface ScavengerAction {
  sourceId: string;
  reclaimed: boolean;
  recycled: boolean;
  meta?: Record<string, any>;
}
```

### PSLStatus

```typescript
interface PSLStatus {
  lastRunAt: number | null;
  decaySignals: DecaySignal[];
  predatorActions: PredatorAction[];
  scavengerActions: ScavengerAction[];
}
```

---

## Target Types

### Route
- Routing decay
- Path degradation
- Network issues
- Connection problems

### Event
- Event decay
- Event processing issues
- Event queue problems
- Event handling degradation

### Service
- Service decay
- Service degradation
- Service health issues
- Service performance problems

### Agent
- Agent decay
- Agent degradation
- Agent health issues
- Agent performance problems

### Config
- Configuration decay
- Config drift
- Config inconsistencies
- Config problems

---

## Predator Actions

### Quarantine
- Isolate decaying resources
- Prevent spread
- Contain issues
- Protect system

### Flag
- Mark problematic resources
- Track issues
- Monitor decay
- Alert on problems

---

## Scavenger Actions

### Reclaim
- Reclaim unused resources
- Free up capacity
- Optimize utilization
- Improve efficiency

### Recycle
- Recycle resources
- Repurpose materials
- Optimize allocation
- Reduce waste

---

## Integration Points

### DreamNet Systems
- **HALO Loop**: Health data
- **Wolf Pack**: Anomaly detection
- **Slug Time**: Temporal metrics
- **Neural Mesh**: Pattern recognition
- **Octopus Executor**: Resource execution

### External Systems
- **Monitoring**: Decay metrics
- **Analytics**: Decay analysis
- **Dashboards**: Decay visualization

---

## Usage Examples

### Run PSL Cycle

```typescript
const status = PredatorScavengerLoop.run({
  haloLoop: {
    getStatus: () => ({ ... }),
  },
  wolfPack: {
    getSignals: () => ({ ... }),
  },
  slugTime: {
    getSnapshots: () => ({ ... }),
  },
  neuralMesh: {
    remember: (data) => { ... },
  },
});

console.log(`Decay signals: ${status.decaySignals.length}`);
console.log(`Predator actions: ${status.predatorActions.length}`);
console.log(`Scavenger actions: ${status.scavengerActions.length}`);
```

### Get Status

```typescript
const status = PredatorScavengerLoop.status();

status.decaySignals.forEach(signal => {
  console.log(`${signal.targetType}:${signal.targetId} - severity: ${signal.severity}`);
});

status.predatorActions.forEach(action => {
  if (action.quarantined) {
    console.log(`Quarantined: ${action.targetId}`);
  }
});
```

---

## Best Practices

1. **Decay Detection**
   - Monitor regularly
   - Set appropriate thresholds
   - Track decay patterns
   - Detect early

2. **Predator Actions**
   - Quarantine promptly
   - Flag appropriately
   - Isolate effectively
   - Prevent spread

3. **Scavenger Actions**
   - Reclaim efficiently
   - Recycle appropriately
   - Optimize utilization
   - Reduce waste

---

## Security Considerations

1. **Decay Security**
   - Validate decay signals
   - Protect decay data
   - Audit decay detection
   - Prevent manipulation

2. **Action Security**
   - Validate actions
   - Secure action execution
   - Audit actions
   - Prevent abuse

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

