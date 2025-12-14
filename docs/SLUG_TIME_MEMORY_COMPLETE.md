# Slug Time Memory - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Slug Time Memory provides **temporal memory** for DreamNet metrics. It collects metric samples, aggregates them into snapshots, applies exponential decay, and maintains historical context for latency, failure rates, throughput, reliability, and economic pressure.

---

## Key Features

### Metric Collection
- Multiple metric kinds (latency, failure-rate, throughput, reliability, economic-pressure, routing-health)
- Sample storage
- Weighted samples
- Source tracking

### Snapshot Aggregation
- Time-based aggregation
- Average calculation
- Count tracking
- Snapshot updates

### Exponential Decay
- Configurable half-life
- Time-based decay
- Automatic decay application
- Freshness maintenance

---

## Architecture

### Components

1. **Slug Memory Store** (`store/slugMemoryStore.ts`)
   - Sample storage
   - Snapshot storage
   - Configuration management

2. **Slug Aggregator** (`logic/slugAggregator.ts`)
   - Snapshot computation
   - Average calculation
   - Weighted aggregation

3. **Slug Decay** (`logic/slugDecay.ts`)
   - Exponential decay
   - Time-based reduction
   - Decay application

4. **Slug Scheduler** (`scheduler/slugScheduler.ts`)
   - Cycle execution
   - Aggregation coordination
   - Decay application

---

## API Reference

### Configuration

#### `configure(config: Partial<SlugTimeConfig>): void`
Configures Slug Time Memory.

**Example**:
```typescript
import { SlugTimeMemory } from '@dreamnet/slug-time-memory';

SlugTimeMemory.configure({
  decayHalfLifeMs: 86400000, // 24 hours
  maxSamplesPerKey: 512,
});
```

### Sample Management

#### `addSample(sample: SlugMetricSample): void`
Adds a metric sample.

**Example**:
```typescript
SlugTimeMemory.addSample({
  id: `sample-${Date.now()}`,
  key: 'api-gateway',
  kind: 'latency',
  value: 150, // milliseconds
  weight: 1.0,
  source: 'monitoring',
  createdAt: Date.now(),
});
```

### Execution

#### `run(context: SlugTimeContext): SlugTimeStatus`
Runs Slug Time cycle.

#### `status(): SlugTimeStatus`
Gets Slug Time status.

---

## Data Models

### SlugMetricKind

```typescript
type SlugMetricKind =
  | 'latency'
  | 'failure-rate'
  | 'throughput'
  | 'reliability'
  | 'economic-pressure'
  | 'routing-health'
  | 'generic';
```

### SlugMetricSample

```typescript
interface SlugMetricSample {
  id: string;
  key: string; // e.g. service name, route id, wormhole id
  kind: SlugMetricKind;
  value: number; // numeric metric
  weight?: number; // optional weighting
  source?: string; // which subsystem produced it
  createdAt: number;
}
```

### SlugMetricSnapshot

```typescript
interface SlugMetricSnapshot {
  key: string;
  kind: SlugMetricKind;
  avg: number;
  count: number;
  lastUpdatedAt: number;
}
```

### SlugTimeConfig

```typescript
interface SlugTimeConfig {
  decayHalfLifeMs: number; // approximate half-life for metrics
  maxSamplesPerKey?: number;
}
```

### SlugTimeStatus

```typescript
interface SlugTimeStatus {
  lastRunAt: number | null;
  totalSamples: number;
  snapshotCount: number;
}
```

---

## Metric Kinds

### Latency
- Response time metrics
- Service latency
- Network latency
- Processing time

### Failure Rate
- Error rates
- Failure percentages
- Success rates
- Reliability metrics

### Throughput
- Request rates
- Transaction rates
- Processing rates
- Capacity metrics

### Reliability
- Uptime metrics
- Availability
- Consistency
- Stability

### Economic Pressure
- Cost pressure
- Budget pressure
- Economic stress
- Financial metrics

### Routing Health
- Route performance
- Routing reliability
- Network health
- Path quality

---

## Snapshot Aggregation

### Weighted Average
- Sample weighting
- Average calculation
- Count tracking
- Time-based updates

### Aggregation Process
1. Collect samples by key
2. Calculate weighted average
3. Update snapshot
4. Track count

---

## Exponential Decay

### Decay Formula
- Half-life based
- Exponential reduction
- Time-weighted
- Automatic application

### Decay Application
- Age calculation
- Decay factor computation
- Value reduction
- Count reduction

---

## Integration Points

### DreamNet Systems
- **Neural Mesh**: Memory integration
- **Pheromone Store**: Path tracking
- **Quantum Anticipation**: Predictive metrics
- **HALO Loop**: Health metrics

### External Systems
- **Monitoring**: Metric collection
- **Analytics**: Metric analysis
- **Dashboards**: Metric visualization

---

## Usage Examples

### Configure Slug Time

```typescript
SlugTimeMemory.configure({
  decayHalfLifeMs: 86400000, // 24 hours
  maxSamplesPerKey: 512,
});
```

### Add Latency Sample

```typescript
SlugTimeMemory.addSample({
  id: `sample-${Date.now()}`,
  key: 'api-gateway',
  kind: 'latency',
  value: 150,
  weight: 1.0,
  source: 'monitoring',
  createdAt: Date.now(),
});
```

### Add Failure Rate Sample

```typescript
SlugTimeMemory.addSample({
  id: `sample-${Date.now()}`,
  key: 'payment-service',
  kind: 'failure-rate',
  value: 0.02, // 2% failure rate
  weight: 1.0,
  source: 'error-tracking',
  createdAt: Date.now(),
});
```

### Run Cycle

```typescript
const status = SlugTimeMemory.run({
  neuralMesh: { remember: (data) => { ... } },
  pheromoneStore: { ... },
});

console.log(`Total samples: ${status.totalSamples}`);
console.log(`Snapshots: ${status.snapshotCount}`);
```

---

## Best Practices

1. **Sample Collection**
   - Use appropriate keys
   - Set correct weights
   - Track sources
   - Collect regularly

2. **Configuration**
   - Set appropriate half-life
   - Limit sample count
   - Balance freshness vs stability
   - Monitor performance

3. **Metric Usage**
   - Use snapshots for decisions
   - Consider decay
   - Track trends
   - Monitor health

---

## Security Considerations

1. **Sample Security**
   - Validate sample data
   - Sanitize keys
   - Protect sensitive metrics
   - Audit collection

2. **Snapshot Security**
   - Validate snapshots
   - Protect snapshot data
   - Audit updates
   - Prevent manipulation

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27
