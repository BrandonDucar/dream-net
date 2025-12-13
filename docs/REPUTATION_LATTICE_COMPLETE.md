# Reputation Lattice - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Reputation Lattice provides a **reputation scoring system** for DreamNet entities. It aggregates reputation signals from multiple sources, applies decay, and computes reputation scores for dreams, agents, services, routes, wormholes, chains, and wallets.

---

## Key Features

### Reputation Signals
- Multi-source signals
- Weighted aggregation
- Signal decay
- Signal history

### Reputation Scores
- Entity-based scores
- Score computation
- Score decay
- Score stability

### Signal Sources
- Wolf Pack signals
- Slug Time signals
- Star Bridge signals
- Dream Cortex signals

---

## Architecture

### Components

1. **Reputation Store** (`store/reputationStore.ts`)
   - Signal storage
   - Score storage
   - Configuration management

2. **Reputation Scheduler** (`scheduler/reputationScheduler.ts`)
   - Reputation cycle execution
   - Score computation
   - Decay application

---

## API Reference

### Configuration

#### `configure(config: Partial<ReputationConfig>): void`
Configures reputation lattice.

**Example**:
```typescript
import { ReputationLattice } from '@dreamnet/reputation-lattice';

ReputationLattice.configure({
  decayHalfLifeMs: 86400000, // 1 day
  minSignalsForStableScore: 5,
});
```

### Signal Management

#### `addSignal(signal: ReputationSignal): void`
Adds a reputation signal.

**Example**:
```typescript
ReputationLattice.addSignal({
  id: 'signal-123',
  entityType: 'dream',
  entityId: 'dream:xyz',
  source: 'WolfPack',
  weight: 0.8,
  value: 0.7, // -1 to 1
  createdAt: Date.now(),
  meta: {
    reason: 'Successful completion',
  },
});
```

### Score Retrieval

#### `getScore(entityType: RepEntityType, entityId: string): ReputationScore | undefined`
Gets reputation score for an entity.

**Example**:
```typescript
const score = ReputationLattice.getScore('dream', 'dream:xyz');

if (score) {
  console.log(`Score: ${score.score}`);
  console.log(`Signals: ${score.signalCount}`);
  console.log(`Updated: ${new Date(score.lastUpdatedAt)}`);
}
```

### Execution

#### `run(context: ReputationContext): ReputationStatus`
Runs reputation cycle.

#### `status(): ReputationStatus`
Gets reputation lattice status.

---

## Data Models

### RepEntityType

```typescript
type RepEntityType =
  | 'dream'
  | 'agent'
  | 'service'
  | 'route'
  | 'wormhole'
  | 'wallet'
  | 'generic';
```

### ReputationSignal

```typescript
interface ReputationSignal {
  id: string;
  entityType: RepEntityType;
  entityId: string;
  source: string; // e.g. "WolfPack", "SlugTime", "StarBridge"
  weight: number; // 0–1
  value: number; // -1 to 1 (negative to positive)
  createdAt: number;
  meta?: Record<string, any>;
}
```

### ReputationScore

```typescript
interface ReputationScore {
  entityType: RepEntityType;
  entityId: string;
  score: number; // 0–1
  lastUpdatedAt: number;
  signalCount: number;
}
```

### ReputationConfig

```typescript
interface ReputationConfig {
  decayHalfLifeMs: number;
  minSignalsForStableScore?: number;
}
```

### ReputationStatus

```typescript
interface ReputationStatus {
  lastRunAt: number | null;
  entityCount: number;
  signalCount: number;
  scoresSample: ReputationScore[];
}
```

---

## Signal Sources

### Wolf Pack
- Performance signals
- Reliability signals
- Quality signals

### Slug Time
- Temporal signals
- Historical signals
- Pattern signals

### Star Bridge
- Cross-chain signals
- Bridge reliability
- Transaction signals

### Dream Cortex
- Cognitive signals
- Dream quality
- Completion signals

---

## Score Computation

### Weighted Aggregation
- Signal weights
- Signal values
- Time-weighted averaging
- Source weighting

### Score Decay
- Exponential decay
- Time-based reduction
- Signal freshness
- Score stability

### Minimum Signals
- Stability threshold
- Score confidence
- Signal count requirement
- Score reliability

---

## Integration Points

### DreamNet Systems
- **Field Layer**: Trust/risk fields
- **Wolf Pack**: Performance signals
- **Slug Time**: Historical signals
- **Star Bridge**: Cross-chain signals
- **Dream Cortex**: Cognitive signals
- **Neural Mesh**: Reputation patterns

### External Systems
- **Analytics**: Reputation analysis
- **Dashboards**: Reputation visualization
- **Alerts**: Reputation-based alerts

---

## Usage Examples

### Configure Reputation Lattice

```typescript
import { ReputationLattice } from '@dreamnet/reputation-lattice';

ReputationLattice.configure({
  decayHalfLifeMs: 86400000, // 1 day
  minSignalsForStableScore: 5,
});
```

### Add Reputation Signal

```typescript
ReputationLattice.addSignal({
  id: `signal-${Date.now()}`,
  entityType: 'dream',
  entityId: 'dream:my-dream',
  source: 'WolfPack',
  weight: 0.9,
  value: 0.8, // Positive signal
  createdAt: Date.now(),
  meta: {
    reason: 'High quality completion',
    metrics: {
      completionRate: 0.95,
      userSatisfaction: 0.9,
    },
  },
});
```

### Get Reputation Score

```typescript
const score = ReputationLattice.getScore('dream', 'dream:my-dream');

if (score) {
  console.log(`Reputation Score: ${score.score.toFixed(2)}`);
  console.log(`Based on ${score.signalCount} signals`);
  console.log(`Last updated: ${new Date(score.lastUpdatedAt)}`);
} else {
  console.log('No reputation score yet');
}
```

### Run Reputation Cycle

```typescript
const status = ReputationLattice.run({
  wolfPack: { getSignals: () => [...] },
  slugTime: { getSignals: () => [...] },
  starBridge: { getSignals: () => [...] },
  dreamCortex: { getSignals: () => [...] },
  neuralMesh: { remember: (data) => { ... } },
});

console.log(`Entities: ${status.entityCount}`);
console.log(`Signals: ${status.signalCount}`);
console.log(`Last run: ${status.lastRunAt}`);
```

---

## Best Practices

1. **Signal Management**
   - Use appropriate weights
   - Set correct values (-1 to 1)
   - Include metadata
   - Track signal sources

2. **Score Usage**
   - Consider signal count
   - Check score freshness
   - Use for decision-making
   - Monitor score trends

3. **Configuration**
   - Set appropriate decay
   - Define stability threshold
   - Balance freshness vs stability
   - Monitor score quality

---

## Security Considerations

1. **Signal Security**
   - Validate signal sources
   - Sanitize signal data
   - Prevent manipulation
   - Audit signal history

2. **Score Security**
   - Protect score data
   - Validate computations
   - Monitor anomalies
   - Track score changes

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27
