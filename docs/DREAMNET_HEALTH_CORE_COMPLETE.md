# DreamNet Health Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

DreamNet Health Core provides **automated health checking** for DreamNet clusters. It registers health checks, runs periodic checks, tracks health status, monitors dependencies, and provides cluster-level health information.

---

## Key Features

### Health Checks
- HTTP health checks
- TCP health checks
- Custom health checks
- Dependency checks

### Health Status
- Healthy status
- Degraded status
- Down status
- Unknown status

### Periodic Checking
- Configurable intervals
- Timeout handling
- Failure threshold tracking
- Consecutive failure tracking

### Cluster Health
- Cluster-level aggregation
- Uptime tracking
- Recent results
- Health history

---

## Architecture

### Components

1. **Health Checker** (`logic/healthChecker.ts`)
   - Health check execution
   - Dependency checking
   - Status determination

2. **Health Store** (`store/healthStore.ts`)
   - Check registration
   - Result storage
   - Cluster aggregation

3. **Types** (`types.ts`)
   - Health check types
   - Result types
   - Status types

---

## API Reference

### Health Check Registration

#### `registerCheck(check: HealthCheck): void`
Registers a health check.

**Example**:
```typescript
import { DreamNetHealthCore } from '@dreamnet/dreamnet-health-core';

DreamNetHealthCore.registerCheck({
  id: 'dream-state-http',
  clusterId: 'dream-state',
  name: 'Dream State HTTP Check',
  endpoint: 'https://dream-state.dreamnet.io/health',
  type: 'http',
  intervalMs: 30000,
  timeoutMs: 5000,
  enabled: true,
  consecutiveFailures: 0,
  failureThreshold: 3,
});
```

### Health Check Control

#### `startCheck(checkId: string): void`
Starts periodic health checking.

#### `stopCheck(checkId: string): void`
Stops periodic health checking.

#### `runCheck(checkId: string): Promise<HealthResult | null>`
Runs a single health check.

**Example**:
```typescript
const result = await DreamNetHealthCore.runCheck('dream-state-http');
if (result) {
  console.log(`Status: ${result.status}`);
  console.log(`Latency: ${result.latency}ms`);
}
```

### Health Status

#### `getClusterHealth(clusterId: string): ClusterHealth | null`
Gets cluster health.

**Example**:
```typescript
const health = DreamNetHealthCore.getClusterHealth('dream-state');
if (health) {
  console.log(`Status: ${health.status}`);
  console.log(`Uptime: ${health.uptime}ms`);
  console.log(`Checks: ${health.checks.length}`);
}
```

#### `getAllClusterHealth(): Record<string, ClusterHealth>`
Gets health for all clusters.

#### `getRecentResults(clusterId: string, limit?: number): HealthResult[]`
Gets recent health results.

---

## Data Models

### HealthStatus

```typescript
type HealthStatus = 'healthy' | 'degraded' | 'down' | 'unknown';
```

### HealthCheck

```typescript
interface HealthCheck {
  id: string;
  clusterId: string;
  name: string;
  endpoint?: string;
  type: 'http' | 'tcp' | 'custom';
  intervalMs: number;
  timeoutMs: number;
  enabled: boolean;
  lastCheck?: number;
  lastStatus?: HealthStatus;
  lastError?: string;
  consecutiveFailures: number;
  failureThreshold: number;
}
```

### HealthResult

```typescript
interface HealthResult {
  clusterId: string;
  status: HealthStatus;
  timestamp: number;
  latency?: number;
  checks: Array<{
    name: string;
    status: HealthStatus;
    latency?: number;
    error?: string;
  }>;
  dependencies?: Array<{
    name: string;
    status: HealthStatus;
    latency?: number;
  }>;
}
```

### ClusterHealth

```typescript
interface ClusterHealth {
  clusterId: string;
  status: HealthStatus;
  lastCheck: number;
  uptime: number;
  checks: HealthCheck[];
  recentResults: HealthResult[];
}
```

---

## Health Check Types

### HTTP Checks
- HTTP endpoint checks
- Status code validation
- Response time tracking
- Error detection

### TCP Checks
- TCP connection checks
- Port availability
- Connection time tracking
- Failure detection

### Custom Checks
- Custom logic checks
- Application-specific checks
- Complex validation
- Integration checks

---

## Health Status Determination

### Healthy
- All checks passing
- Dependencies healthy
- Latency acceptable
- No errors

### Degraded
- Some checks failing
- High latency
- Partial functionality
- Warnings present

### Down
- Critical checks failing
- Dependencies down
- Service unavailable
- Errors present

### Unknown
- No checks run
- Insufficient data
- Check disabled
- Initial state

---

## Integration Points

### DreamNet Systems
- **DreamNet Control Core**: Health-based control
- **DreamNet Metrics Core**: Health metrics
- **DreamNet OS Core**: System health
- **Startup Sequence**: Health gates

### External Systems
- **Monitoring**: Health dashboards
- **Alerting**: Health alerts
- **Analytics**: Health analytics

---

## Usage Examples

### Register Health Check

```typescript
DreamNetHealthCore.registerCheck({
  id: 'dream-state-http',
  clusterId: 'dream-state',
  name: 'Dream State HTTP Check',
  endpoint: 'https://dream-state.dreamnet.io/health',
  type: 'http',
  intervalMs: 30000,
  timeoutMs: 5000,
  enabled: true,
  consecutiveFailures: 0,
  failureThreshold: 3,
});

DreamNetHealthCore.startCheck('dream-state-http');
```

### Get Cluster Health

```typescript
const health = DreamNetHealthCore.getClusterHealth('dream-state');
if (health) {
  console.log(`Status: ${health.status}`);
  console.log(`Uptime: ${health.uptime}ms`);
  health.checks.forEach(check => {
    console.log(`${check.name}: ${check.lastStatus}`);
  });
}
```

### Run Single Check

```typescript
const result = await DreamNetHealthCore.runCheck('dream-state-http');
if (result) {
  console.log(`Status: ${result.status}`);
  console.log(`Latency: ${result.latency}ms`);
  result.checks.forEach(check => {
    console.log(`${check.name}: ${check.status}`);
  });
}
```

### Get All Cluster Health

```typescript
const allHealth = DreamNetHealthCore.getAllClusterHealth();
Object.entries(allHealth).forEach(([clusterId, health]) => {
  console.log(`${clusterId}: ${health.status}`);
});
```

---

## Best Practices

1. **Health Check Design**
   - Use appropriate types
   - Set correct intervals
   - Configure timeouts
   - Set failure thresholds

2. **Health Monitoring**
   - Monitor all clusters
   - Track dependencies
   - Watch latency
   - Alert on failures

3. **Health Response**
   - React to failures
   - Escalate issues
   - Document status
   - Update dashboards

---

## Security Considerations

1. **Health Check Security**
   - Validate endpoints
   - Secure health checks
   - Protect health data
   - Audit health access

2. **Health Data**
   - Avoid sensitive data
   - Sanitize responses
   - Protect endpoints
   - Monitor abuse

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

