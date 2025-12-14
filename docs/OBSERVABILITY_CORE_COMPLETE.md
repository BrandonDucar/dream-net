# Observability Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Observability Core provides **OpenTelemetry-based observability** for DreamNet. It includes distributed tracing, metrics collection, automatic instrumentation, and integration with Google Cloud Trace and Honeycomb. Features cardinality management, bucketing, and standard trace paths.

---

## Key Features

### Distributed Tracing
- OpenTelemetry SDK integration
- Automatic instrumentation
- Manual span creation
- Standard trace paths
- OTLP exporter

### Metrics Collection
- Histogram metrics (p95/p99)
- Counter metrics
- Business metrics
- Cardinality management
- Bucketing utilities

### Auto-Instrumentation
- HTTP instrumentation
- Express instrumentation
- Node.js auto-instrumentation
- Custom instrumentation

---

## Architecture

### Components

1. **OpenTelemetry Node** (`otel-node.ts`)
   - SDK initialization
   - Auto-instrumentation
   - OTLP exporter
   - Resource configuration

2. **Tracing** (`tracing.ts`)
   - Manual span creation
   - Standard trace paths
   - Wallet creation tracing
   - Dream creation tracing
   - Deployment tracing

3. **Metrics** (`metrics.ts`)
   - Histogram creation
   - Counter creation
   - Business metrics
   - Bucketing utilities

4. **Metrics Buckets** (`metrics-buckets.ts`)
   - User tier bucketing
   - Request size bucketing
   - Response time bucketing
   - Error code bucketing

5. **Metrics Views** (`metrics-views.ts`)
   - Metric views configuration
   - Aggregation settings

---

## API Reference

### Initialization

#### `initOpenTelemetry(): () => Promise<void>`
Initializes OpenTelemetry SDK.

**Example**:
```typescript
import { initOpenTelemetry } from '@dreamnet/observability-core';

const shutdown = initOpenTelemetry();
// ... application code ...
await shutdown(); // Graceful shutdown
```

#### `getShutdown(): () => Promise<void>`
Gets shutdown function for graceful shutdown.

**Example**:
```typescript
import { getShutdown } from '@dreamnet/observability-core';

const shutdown = getShutdown();
await shutdown();
```

### Tracing

#### `createSpan(name: string, parentContext?: any): any`
Creates a span for a standard operation.

**Example**:
```typescript
import { createSpan } from '@dreamnet/observability-core';

const span = createSpan('my-operation');
// ... operation ...
span.end();
```

#### `traceWalletCreate(operation: () => Promise<any>): Promise<any>`
Standard trace path: wallet_create → agent_tool_call → base_rpc.

**Example**:
```typescript
import { traceWalletCreate } from '@dreamnet/observability-core';

const wallet = await traceWalletCreate(async () => {
  return await createWallet();
});
```

#### `traceDreamCreate(operation: () => Promise<any>): Promise<any>`
Standard trace path: dream_create → agent_process → storage_write.

**Example**:
```typescript
import { traceDreamCreate } from '@dreamnet/observability-core';

const dream = await traceDreamCreate(async () => {
  return await createDream();
});
```

#### `traceDeployment(operation: () => Promise<any>): Promise<any>`
Standard trace path: deployment_trigger → cloud_run_deploy → verification.

**Example**:
```typescript
import { traceDeployment } from '@dreamnet/observability-core';

const deployment = await traceDeployment(async () => {
  return await deployToCloudRun();
});
```

### Metrics

#### `createLatencyHistogram(name: string, description: string)`
Creates a histogram metric with p95/p99 views.

**Example**:
```typescript
import { createLatencyHistogram } from '@dreamnet/observability-core';

const latencyHistogram = createLatencyHistogram(
  'api.latency',
  'API endpoint latency'
);

latencyHistogram.record(100); // Record 100ms latency
```

#### `createCounter(name: string, description: string)`
Creates a counter metric.

**Example**:
```typescript
import { createCounter } from '@dreamnet/observability-core';

const requestCounter = createCounter(
  'api.requests',
  'Total API requests'
);

requestCounter.add(1);
```

#### `bucketUserId(userId: string): string`
Buckets user IDs to prevent cardinality explosion.

**Example**:
```typescript
import { bucketUserId } from '@dreamnet/observability-core';

const bucketedId = bucketUserId('user-1234567890');
// Returns: 'user_12345678_tier_free'
```

#### `bucketWalletAge(ageDays: number): string`
Buckets wallet age.

**Example**:
```typescript
import { bucketWalletAge } from '@dreamnet/observability-core';

const bucket = bucketWalletAge(15);
// Returns: 'wallet_age_7-30d'
```

### Business Metrics

#### `dreamnetMetrics`
Pre-configured business metrics.

**Example**:
```typescript
import { dreamnetMetrics } from '@dreamnet/observability-core';

dreamnetMetrics.conversionRate.add(1);
dreamnetMetrics.toolFailures.add(1);
dreamnetMetrics.apiLatency.record(50);
```

---

## Data Models

### Trace Paths
- **Wallet Creation**: wallet_create → agent_tool_call → base_rpc
- **Dream Creation**: dream_create → agent_process → storage_write
- **Deployment**: deployment_trigger → cloud_run_deploy → verification

### Bucketing Functions
- **User IDs**: First 8 chars + tier
- **Wallet Age**: 0-7d, 7-30d, 30-90d, 90d+
- **Request Size**: Configurable buckets
- **Response Time**: Configurable buckets
- **Error Codes**: HTTP status code buckets

---

## Configuration

### Environment Variables
- `OTEL_EXPORTER_OTLP_ENDPOINT`: OTLP endpoint (default: http://localhost:4317)
- `OTEL_SERVICE_NAME`: Service name (default: dreamnet-api)
- `OTEL_SERVICE_VERSION`: Service version (default: 1.0.0)
- `OTEL_SAMPLING_RATIO`: Sampling ratio (default: 0.01)

### Sampling
- Head sampling: 1% by default
- Configurable via `OTEL_SAMPLING_RATIO`
- Reduces trace volume
- Maintains observability

---

## Integration Points

### DreamNet Systems
- **Server**: Automatic HTTP/Express instrumentation
- **Agent Registry Core**: Agent operation tracing
- **DreamNet OS Core**: System operation tracing
- **Deployment Core**: Deployment tracing

### External Systems
- **Google Cloud Trace**: Trace export
- **Honeycomb**: Trace export
- **OTLP Collector**: Trace collection

---

## Usage Examples

### Initialize Observability

```typescript
import { initOpenTelemetry } from '@dreamnet/observability-core';

const shutdown = initOpenTelemetry();
```

### Trace Operations

```typescript
import { traceWalletCreate } from '@dreamnet/observability-core';

const wallet = await traceWalletCreate(async () => {
  return await createWallet();
});
```

### Record Metrics

```typescript
import { dreamnetMetrics } from '@dreamnet/observability-core';

dreamnetMetrics.apiLatency.record(100);
```

---

## Best Practices

1. **Tracing**
   - Use standard trace paths
   - Create spans for key operations
   - Record exceptions
   - Set span status

2. **Metrics**
   - Use bucketing to prevent cardinality explosion
   - Record business metrics
   - Monitor key operations
   - Track performance

---

## Security Considerations

1. **Data Privacy**
   - Bucket user IDs
   - Avoid PII in spans
   - Sanitize trace data
   - Control sampling

2. **Access Control**
   - Secure OTLP endpoint
   - Control trace export
   - Monitor access
   - Audit observability

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

