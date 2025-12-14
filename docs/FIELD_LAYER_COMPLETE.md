# Field Layer - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Field Layer provides a **unified field system** for tracking trust, risk, liquidity, load, and dream priority across DreamNet entities. It aggregates data from multiple systems and applies decay to maintain accurate field values.

---

## Key Features

### Field Types
- **Trust**: Entity trustworthiness
- **Risk**: Entity risk level
- **Liquidity**: Chain liquidity pressure
- **Load**: System load
- **Dream Priority**: Dream prioritization

### Field Updates
- Reputation-based updates
- Star Bridge updates
- QAL updates
- Dream Cortex updates
- Wolf Pack/PSL updates

### Field Decay
- Exponential decay
- Configurable half-life
- Smoothing factor
- Time-based decay

---

## Architecture

### Components

1. **Field Store** (`store/fieldStore.ts`)
   - Field sample storage
   - Field retrieval
   - Configuration management

2. **Field Scheduler** (`scheduler/fieldScheduler.ts`)
   - Field cycle execution
   - Update coordination
   - Decay application

3. **Field Updaters** (`logic/fieldUpdaters.ts`)
   - Reputation updates
   - Star Bridge updates
   - QAL updates
   - Dream Cortex updates

4. **Field Decay** (`logic/fieldDecay.ts`)
   - Exponential decay
   - Time-based updates
   - Smoothing

---

## API Reference

### Configuration

#### `configure(config: Partial<FieldConfig>): void`
Configures field layer.

**Example**:
```typescript
import { FieldLayer } from '@dreamnet/field-layer';

FieldLayer.configure({
  decayHalfLifeMs: 3600000, // 1 hour
  smoothingFactor: 0.7,
});
```

### Field Operations

#### `sample(field: FieldName, point: FieldPointId): FieldSample | undefined`
Gets a field sample.

**Example**:
```typescript
const sample = FieldLayer.sample('trust', {
  kind: 'dream',
  id: 'dream:xyz',
});

console.log(`Trust value: ${sample?.value}`);
```

#### `allSamples(): FieldSample[]`
Gets all field samples.

### Execution

#### `run(context: FieldContext): FieldStatus`
Runs field cycle.

#### `status(): FieldStatus`
Gets field layer status.

---

## Data Models

### FieldName

```typescript
type FieldName =
  | 'trust'
  | 'risk'
  | 'liquidity'
  | 'load'
  | 'dreamPriority';
```

### FieldPointId

```typescript
interface FieldPointId {
  kind: FieldEntityKind;
  id: string; // e.g. "dream:xyz", "chain:base"
}
```

### FieldEntityKind

```typescript
type FieldEntityKind =
  | 'dream'
  | 'agent'
  | 'service'
  | 'route'
  | 'wormhole'
  | 'chain'
  | 'wallet'
  | 'generic';
```

### FieldSample

```typescript
interface FieldSample {
  field: FieldName;
  point: FieldPointId;
  value: number; // usually [0,1]
  updatedAt: number;
}
```

### FieldConfig

```typescript
interface FieldConfig {
  decayHalfLifeMs: number;
  smoothingFactor: number; // 0–1
}
```

### FieldStatus

```typescript
interface FieldStatus {
  lastRunAt: number | null;
  totalSamples: number;
  samplePreview: FieldSample[];
}
```

---

## Field Update Sources

### Reputation Lattice
- Trust field updates
- Risk field updates
- Entity-based updates

### Star Bridge
- Liquidity field updates
- Chain reliability updates
- Cross-chain metrics

### Quantum Anticipation Layer (QAL)
- Predictive field updates
- Anticipation-based values
- Future state estimation

### Dream Cortex
- Dream priority updates
- Cognitive field updates
- Dream state fields

### Wolf Pack & PSL
- Load field updates
- Performance metrics
- System health fields

---

## Field Decay

### Exponential Decay
- Time-based decay
- Configurable half-life
- Smooth value reduction
- Maintains field freshness

### Smoothing
- Smooths raw updates
- Reduces noise
- Configurable factor
- Time-weighted averaging

---

## Integration Points

### DreamNet Systems
- **Reputation Lattice**: Trust/risk fields
- **Star Bridge**: Liquidity fields
- **QAL**: Predictive fields
- **Dream Cortex**: Priority fields
- **Neural Mesh**: Field patterns

### External Systems
- **Analytics**: Field analysis
- **Dashboards**: Field visualization
- **Alerts**: Field-based alerts

---

## Usage Examples

### Configure Field Layer

```typescript
import { FieldLayer } from '@dreamnet/field-layer';

FieldLayer.configure({
  decayHalfLifeMs: 3600000, // 1 hour half-life
  smoothingFactor: 0.7, // 70% smoothing
});
```

### Get Field Sample

```typescript
const trustSample = FieldLayer.sample('trust', {
  kind: 'dream',
  id: 'dream:my-dream',
});

if (trustSample) {
  console.log(`Trust: ${trustSample.value}`);
  console.log(`Updated: ${new Date(trustSample.updatedAt)}`);
}
```

### Run Field Cycle

```typescript
import { FieldLayer } from '@dreamnet/field-layer';

const status = FieldLayer.run({
  reputationLattice: { status: () => ({ ... }) },
  starBridge: { status: () => ({ ... }) },
  quantumAnticipation: { status: () => ({ ... }) },
  dreamCortex: { status: () => ({ ... }) },
  neuralMesh: { remember: (data) => { ... } },
});

console.log(`Total samples: ${status.totalSamples}`);
console.log(`Last run: ${status.lastRunAt}`);
```

### Get All Samples

```typescript
const samples = FieldLayer.allSamples();

samples.forEach(sample => {
  console.log(`${sample.field} at ${sample.point.id}: ${sample.value}`);
});
```

---

## Best Practices

1. **Field Configuration**
   - Set appropriate decay half-life
   - Choose smoothing factor
   - Balance freshness vs stability
   - Monitor field values

2. **Field Updates**
   - Update from reliable sources
   - Validate field values
   - Track update frequency
   - Monitor field trends

3. **Field Usage**
   - Use fields for decision-making
   - Combine multiple fields
   - Consider field decay
   - Validate field freshness

---

## Security Considerations

1. **Field Security**
   - Validate field values
   - Sanitize field inputs
   - Protect field data
   - Audit field changes

2. **Field Integrity**
   - Prevent manipulation
   - Validate sources
   - Monitor anomalies
   - Track field history

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27
