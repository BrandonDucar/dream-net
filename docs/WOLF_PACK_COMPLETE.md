# Wolf Pack - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Wolf Pack provides **anomaly detection and hunting** for DreamNet. It monitors system health, detects anomalies, hunts for issues, and generates "strikes" (remediation actions) to fix problems before they become critical.

---

## Key Features

### Anomaly Detection
- Health monitoring
- Anomaly identification
- Severity assessment
- Confidence scoring

### Hunting System
- Target tracking
- Issue hunting
- Problem identification
- Root cause analysis

### Strike Generation
- Remediation actions
- Automatic fixes
- Strike recommendations
- Action execution

### Signal Types
- Anomaly signals
- Hunt signals
- Strike signals
- No-op signals

---

## Architecture

### Components

1. **Wolf Pack Engine** (`engine/wolfPackEngine.ts`)
   - Cycle execution
   - Signal generation
   - Strike creation

2. **Target Tracker** (`trackers/targetTracker.ts`)
   - Target management
   - Target tracking
   - Target clearing

---

## API Reference

### Execution

#### `run(context: WolfContext): { signals: WolfSignal[]; strikes: any[] }`
Runs Wolf Pack cycle.

**Example**:
```typescript
import { WolfPack } from '@dreamnet/wolf-pack';

const result = WolfPack.run({
  haloLoop: haloLoop,
  swarmPatrol: swarmPatrol,
  quantumAnticipation: qal,
  neuralMesh: neuralMesh,
  governance: governance,
});

console.log(`Signals: ${result.signals.length}`);
console.log(`Strikes: ${result.strikes.length}`);
```

### Target Management

#### `listTargets(): string[]`
Lists active targets.

#### `clearTarget(targetId: string): void`
Clears a target.

#### `clearAllTargets(): void`
Clears all targets.

### Status

#### `status(): WolfPackStatus`
Gets Wolf Pack status.

---

## Data Models

### WolfTargetType

```typescript
type WolfTargetType =
  | 'route'
  | 'service'
  | 'agent'
  | 'wormhole'
  | 'deployment'
  | 'unknown';
```

### WolfSignal

```typescript
interface WolfSignal {
  id: string;
  type: 'anomaly' | 'hunt' | 'strike' | 'noop';
  targetType: WolfTargetType;
  targetId?: string;
  severity: number; // 0–1
  confidence: number; // 0–1
  meta?: Record<string, any>;
  createdAt: number;
}
```

### WolfContext

```typescript
interface WolfContext {
  haloLoop?: any; // health + analysis
  swarmPatrol?: any; // micro-agent repair patrol
  quantumAnticipation?: any; // QAL predictions
  neuralMesh?: any; // mesh memory / pulses
  governance?: any; // for safety overrides
}
```

### WolfPackStatus

```typescript
interface WolfPackStatus {
  lastRunAt: number | null;
  lastSignalsCount: number;
  activeTargets: string[];
}
```

---

## Signal Types

### Anomaly
- Anomaly detected
- Issue identified
- Problem found
- Needs investigation

### Hunt
- Actively hunting
- Investigating issue
- Searching for problems
- Tracking down issues

### Strike
- Remediation action
- Fix recommended
- Action required
- Strike executed

### No-op
- No action needed
- All clear
- No issues
- Healthy state

---

## Target Types

### Route
- Routing issues
- Path problems
- Network issues
- Connection problems

### Service
- Service issues
- Service health
- Service performance
- Service reliability

### Agent
- Agent issues
- Agent health
- Agent performance
- Agent reliability

### Wormhole
- Wormhole issues
- Bridge problems
- Transport issues
- Connection problems

### Deployment
- Deployment issues
- Release problems
- Version issues
- Update problems

---

## Integration Points

### DreamNet Systems
- **HALO Loop**: Health analysis
- **Swarm Patrol**: Micro-agent repair
- **Quantum Anticipation**: Predictive detection
- **Neural Mesh**: Pattern recognition
- **Governance**: Safety overrides

### External Systems
- **Monitoring**: Health monitoring
- **Alerting**: Alert generation
- **Analytics**: Anomaly analytics

---

## Usage Examples

### Run Wolf Pack Cycle

```typescript
const result = WolfPack.run({
  haloLoop: {
    getHealthMetrics: () => ({ ... }),
  },
  swarmPatrol: {
    getPatrolStatus: () => ({ ... }),
  },
  quantumAnticipation: qal,
  neuralMesh: {
    remember: (data) => { ... },
  },
  governance: {
    checkPolicy: (actor, capability, scope) => ({ ... }),
  },
});

result.signals.forEach(signal => {
  console.log(`${signal.type}: ${signal.targetType} (severity: ${signal.severity})`);
  if (signal.targetId) {
    console.log(`Target: ${signal.targetId}`);
  }
});

result.strikes.forEach(strike => {
  console.log(`Strike: ${strike.action} on ${strike.target}`);
});
```

### List Targets

```typescript
const targets = WolfPack.listTargets();
console.log(`Active targets: ${targets.length}`);
targets.forEach(target => {
  console.log(`Target: ${target}`);
});
```

### Clear Target

```typescript
WolfPack.clearTarget('service:api-gateway');
```

### Get Status

```typescript
const status = WolfPack.status();
console.log(`Last run: ${status.lastRunAt}`);
console.log(`Signals: ${status.lastSignalsCount}`);
console.log(`Active targets: ${status.activeTargets.length}`);
```

---

## Best Practices

1. **Anomaly Detection**
   - Monitor regularly
   - Set appropriate thresholds
   - Track confidence levels
   - Investigate anomalies

2. **Hunting**
   - Track targets carefully
   - Investigate thoroughly
   - Document findings
   - Clear resolved targets

3. **Strikes**
   - Execute strikes promptly
   - Verify strike success
   - Track strike outcomes
   - Learn from strikes

---

## Security Considerations

1. **Signal Security**
   - Validate signals
   - Protect signal data
   - Audit signal generation
   - Prevent manipulation

2. **Strike Security**
   - Validate strikes
   - Secure strike execution
   - Audit strike actions
   - Prevent abuse

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

