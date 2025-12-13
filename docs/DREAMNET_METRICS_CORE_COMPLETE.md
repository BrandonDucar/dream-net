# DreamNet Metrics Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

DreamNet Metrics Core provides **performance monitoring and metrics collection** for DreamNet. It tracks request metrics, computes cluster-level statistics, generates performance snapshots, and enables querying of historical metrics data.

---

## Key Features

### Metrics Collection
- Request metrics tracking
- Error tracking
- Latency tracking
- Cluster-level aggregation

### Performance Analysis
- Percentile calculations (p50, p95, p99)
- Requests per second
- Errors per second
- Average latency

### Querying
- Cluster filtering
- Time range filtering
- Result limiting
- Historical data access

---

## Architecture

### Components

1. **Metrics Store** (`store/metricsStore.ts`)
   - Metric storage
   - Metric retrieval
   - Cluster aggregation
   - Performance snapshots

2. **Types** (`types.ts`)
   - Metric definitions
   - Query types
   - Snapshot types

---

## API Reference

### Metrics Recording

#### `recordMetric(metric: RequestMetric): void`
Records a request metric.

**Example**:
```typescript
import { DreamNetMetricsCore } from '@dreamnet/dreamnet-metrics-core';

DreamNetMetricsCore.recordMetric({
  traceId: 'trace-123',
  method: 'POST',
  path: '/api/dreams',
  clusterId: 'dream-state',
  statusCode: 200,
  latencyMs: 150,
  timestamp: Date.now(),
});
```

### Metrics Querying

#### `getMetrics(query?: MetricQuery): RequestMetric[]`
Gets metrics matching query.

**Example**:
```typescript
const metrics = DreamNetMetricsCore.getMetrics({
  clusterId: 'dream-state',
  startTime: Date.now() - 3600000, // Last hour
  endTime: Date.now(),
  limit: 100,
});
```

#### `getClusterMetrics(clusterId: string, windowMs?: number): ClusterMetrics`
Gets cluster-level metrics.

**Example**:
```typescript
const clusterMetrics = DreamNetMetricsCore.getClusterMetrics('dream-state', 3600000);
console.log(`Requests: ${clusterMetrics.requestCount}`);
console.log(`Errors: ${clusterMetrics.errorCount}`);
console.log(`Avg Latency: ${clusterMetrics.averageLatency}ms`);
console.log(`P95 Latency: ${clusterMetrics.p95Latency}ms`);
```

#### `getPerformanceSnapshot(): PerformanceSnapshot`
Gets global performance snapshot.

**Example**:
```typescript
const snapshot = DreamNetMetricsCore.getPerformanceSnapshot();
console.log(`Total Requests: ${snapshot.global.totalRequests}`);
console.log(`Total Errors: ${snapshot.global.totalErrors}`);
console.log(`Avg Latency: ${snapshot.global.averageLatency}ms`);
```

### Data Management

#### `clear(): void`
Clears all metrics.

---

## Data Models

### RequestMetric

```typescript
interface RequestMetric {
  traceId: string;
  method: string;
  path: string;
  clusterId?: string;
  statusCode: number;
  latencyMs: number;
  timestamp: number;
  error?: string;
}
```

### ClusterMetrics

```typescript
interface ClusterMetrics {
  clusterId: string;
  requestCount: number;
  errorCount: number;
  averageLatency: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  requestsPerSecond: number;
  errorsPerSecond: number;
  lastUpdatedAt: number;
}
```

### PerformanceSnapshot

```typescript
interface PerformanceSnapshot {
  timestamp: number;
  clusters: Record<string, ClusterMetrics>;
  global: {
    totalRequests: number;
    totalErrors: number;
    averageLatency: number;
    requestsPerSecond: number;
  };
}
```

### MetricQuery

```typescript
interface MetricQuery {
  clusterId?: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
}
```

---

## Metrics Calculation

### Percentiles
- **P50**: Median latency
- **P95**: 95th percentile latency
- **P99**: 99th percentile latency

### Rates
- **Requests Per Second**: Total requests / time window
- **Errors Per Second**: Total errors / time window

### Averages
- **Average Latency**: Sum of latencies / request count

---

## Integration Points

### DreamNet Systems
- **DreamNet Control Core**: Rate limiting
- **DreamNet Health Core**: Health monitoring
- **DreamNet OS Core**: System monitoring
- **Detector Generator**: Anomaly detection

### External Systems
- **Monitoring**: Metrics dashboards
- **Analytics**: Performance analytics
- **Alerting**: Metric-based alerts

---

## Usage Examples

### Record Metric

```typescript
DreamNetMetricsCore.recordMetric({
  traceId: 'trace-123',
  method: 'POST',
  path: '/api/dreams',
  clusterId: 'dream-state',
  statusCode: 200,
  latencyMs: 150,
  timestamp: Date.now(),
});
```

### Query Metrics

```typescript
const metrics = DreamNetMetricsCore.getMetrics({
  clusterId: 'dream-state',
  startTime: Date.now() - 3600000,
  endTime: Date.now(),
  limit: 100,
});
```

### Get Cluster Metrics

```typescript
const clusterMetrics = DreamNetMetricsCore.getClusterMetrics('dream-state', 3600000);
console.log(`Requests: ${clusterMetrics.requestCount}`);
console.log(`Errors: ${clusterMetrics.errorCount}`);
console.log(`P95 Latency: ${clusterMetrics.p95Latency}ms`);
```

### Get Performance Snapshot

```typescript
const snapshot = DreamNetMetricsCore.getPerformanceSnapshot();
console.log(`Global RPS: ${snapshot.global.requestsPerSecond}`);
Object.entries(snapshot.clusters).forEach(([clusterId, metrics]) => {
  console.log(`${clusterId}: ${metrics.requestsPerSecond} RPS`);
});
```

---

## Best Practices

1. **Metrics Recording**
   - Record all requests
   - Include trace IDs
   - Track errors
   - Use consistent timestamps

2. **Metrics Analysis**
   - Monitor percentiles
   - Track error rates
   - Watch latency trends
   - Set alert thresholds

3. **Query Optimization**
   - Use time ranges
   - Filter by cluster
   - Limit result sets
   - Cache snapshots

---

## Security Considerations

1. **Metrics Security**
   - Validate metric data
   - Protect metric storage
   - Audit metric access
   - Prevent metric injection

2. **Privacy**
   - Avoid sensitive data
   - Sanitize paths
   - Anonymize trace IDs
   - Protect user data

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

