# Observability Implementation Plan (OpenTelemetry)

## Overview

Implement OpenTelemetry-based observability sending OTLP → Google Cloud Trace (primary) and Honeycomb (optional), with cost-aware sampling and metric cardinality caps.

## Architecture

**Flow:**
```
Application → OpenTelemetry SDK → OTLP Collector → Google Cloud Trace + Honeycomb
```

**Sampling Strategy:**
- 1% head sampling (random)
- 100% tail sampling for errors/slow requests
- Metric cardinality caps to prevent label explosions

## Implementation Phases

### Phase 1: OpenTelemetry Collector Setup

**Files to create:**
- `infrastructure/otel-collector/otel-collector.yaml` - Collector configuration
- `infrastructure/otel-collector/Dockerfile` - Collector container
- `infrastructure/otel-collector/deploy.sh` - Deployment script

**Collector config features:**
- Tail sampling processor (keep errors/slow)
- Dual export (Google Cloud Trace + Honeycomb)
- Resource detection
- Batch processor for efficiency

**Deployment:**
- Deploy as Cloud Run service (sidecar pattern)
- Or deploy as standalone service
- Configure OTLP endpoint: `http://otel-collector:4317`

### Phase 2: Node.js SDK Integration

**Files to create:**
- `packages/observability-core/src/otel-node.ts` - Node.js auto-instrumentation
- `packages/observability-core/src/tracing.ts` - Manual tracing utilities
- `packages/observability-core/src/metrics.ts` - Metrics collection

**Dependencies:**
```json
{
  "@opentelemetry/api": "^1.8.0",
  "@opentelemetry/sdk-node": "^0.50.0",
  "@opentelemetry/auto-instrumentations-node": "^0.46.0",
  "@opentelemetry/exporter-otlp-proto": "^0.50.0",
  "@opentelemetry/instrumentation-http": "^0.50.0",
  "@opentelemetry/instrumentation-express": "^0.50.0"
}
```

**Environment variables:**
```bash
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
OTEL_SERVICE_NAME=dreamnet-api
OTEL_RESOURCE_ATTRIBUTES=service.name=dreamnet-api,service.version=1.0.0
OTEL_SAMPLING_RATIO=0.01
```

### Phase 3: Go SDK Integration (if needed)

**Files to create:**
- `packages/observability-go/otel.go` - Go instrumentation
- `packages/observability-go/tracing.go` - Manual spans

**Dependencies:**
```go
go.opentelemetry.io/otel v1.24.0
go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc v1.24.0
go.opentelemetry.io/otel/sdk v1.24.0
```

### Phase 4: Standard Trace Paths

**Implement standard spans:**
- `wallet_create` → `agent_tool_call` → `base_rpc`
- `dream_create` → `agent_process` → `storage_write`
- `deployment_trigger` → `cloud_run_deploy` → `verification`

**Files to update:**
- `server/routes/wallet.ts` - Add wallet_create span
- `server/routes/dreams.ts` - Add dream_create span
- `packages/deployment-core/src/index.ts` - Add deployment spans

### Phase 5: Metric Hygiene

**Cardinality caps:**
- Use bucketed attributes (user_tier, wallet_age_bucket) instead of raw IDs
- Histograms for latency (p95/p99 via views)
- Custom metric prefix: `custom.googleapis.com/dreamnet/`

**Files to create:**
- `packages/observability-core/src/metrics-buckets.ts` - Bucketing utilities
- `packages/observability-core/src/metrics-views.ts` - Metric views/aggregations

**Metrics to track:**
- `dreamnet.conversion.rate` - Dream creation → deployment conversion
- `dreamnet.tool.failures` - Agent tool failure count
- `dreamnet.api.latency` - API endpoint latency (histogram)

### Phase 6: Platform-Specific Configuration

**Cloud Run:**
- Auto-detects GCP project
- Uses default credentials
- No additional config needed

**Vercel:**
- Requires GCP service account JSON
- Set `GOOGLE_APPLICATION_CREDENTIALS` env var
- Configure OTLP endpoint to collector

**Firebase:**
- Similar to Cloud Run
- Use Firebase service account

### Phase 7: Verification & Testing

**Verification steps:**
1. Hit `/wallet/create` endpoint (one slow + one forced error)
2. Check Cloud Trace for full path: `wallet_create → agent_tool_call → base_rpc`
3. Verify slow/error traces kept despite 1% head sample
4. Check Honeycomb (if configured) for same traces

**Test files:**
- `tests/observability/tracing.test.ts` - Trace verification
- `tests/observability/metrics.test.ts` - Metric verification

## Integration Points

- **Spider Web Core:** Connect traces to event threading
- **Shield Core:** Security events as traces
- **Super Spine:** Agent orchestration traces
- **Deployment Core:** Deployment operation traces

## Success Criteria

- Traces visible in Google Cloud Trace
- Errors and slow requests always sampled (tail sampling working)
- Metrics visible in Cloud Monitoring
- Standard trace paths consistent across services
- Cost-aware sampling preventing excessive trace volume
- Honeycomb integration working (if configured)

