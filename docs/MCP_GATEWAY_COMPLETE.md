# MCP Gateway - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

MCP Gateway provides **authentication, authorization, metrics, and quotas** for MCP (Model Context Protocol) tools. It acts as a gateway layer for observability and governance, tracking tool usage, enforcing quotas, and managing access control.

---

## Key Features

### Authentication & Authorization
- API key authentication
- User-based authentication
- Permission-based authorization
- Tool-level permissions

### Metrics Tracking
- Tool invocation tracking
- Success/failure rates
- Latency tracking
- Cost tracking

### Quota Management
- Per-tool quotas
- Usage tracking
- Quota enforcement
- Quota configuration

---

## Architecture

### Components

1. **MCP Auth** (`MCPAuth.ts`)
   - Authentication
   - Authorization
   - API key management
   - Permission checking

2. **MCP Metrics** (`MCPMetrics.ts`)
   - Tool metrics tracking
   - Invocation counting
   - Latency tracking
   - Cost tracking

3. **MCP Quotas** (`MCPQuotas.ts`)
   - Quota configuration
   - Usage tracking
   - Quota enforcement

---

## API Reference

### Authentication

#### `MCPAuth`
MCP authentication and authorization.

**Example**:
```typescript
import { MCPAuth } from '@dreamnet/mcp-gateway';

const auth = new MCPAuth();

// Register API key
auth.registerApiKey('api-key-123', {
  userId: 'user-123',
  permissions: ['tool:read', 'tool:write'],
});

// Authenticate
const result = auth.authenticate({
  apiKey: 'api-key-123',
});

if (result.allowed) {
  console.log('Authenticated');
}
```

#### `authenticate(context: AuthContext): AuthResult`
Authenticates a request.

**Example**:
```typescript
const result = auth.authenticate({
  apiKey: 'api-key-123',
});
```

#### `authorize(toolName: string, context: AuthContext): AuthResult`
Authorizes tool access.

**Example**:
```typescript
auth.setToolPermissions('my-tool', ['tool:write']);

const result = auth.authorize('my-tool', {
  apiKey: 'api-key-123',
  permissions: ['tool:write'],
});

if (result.allowed) {
  console.log('Authorized');
}
```

### Metrics

#### `MCPMetrics`
MCP metrics tracking.

**Example**:
```typescript
import { MCPMetrics } from '@dreamnet/mcp-gateway';

const metrics = new MCPMetrics();

// Record invocation
metrics.recordInvocation('my-tool', true, 100, 0.01);

// Get metrics
const toolMetrics = metrics.getMetrics('my-tool');
console.log(`Invocations: ${toolMetrics.invocationCount}`);
console.log(`Success rate: ${toolMetrics.successCount / toolMetrics.invocationCount}`);
```

#### `recordInvocation(toolName: string, success: boolean, latency: number, cost?: number): void`
Records a tool invocation.

**Example**:
```typescript
metrics.recordInvocation('my-tool', true, 100, 0.01);
```

#### `getMetrics(toolName: string): ToolMetrics | undefined`
Gets metrics for a tool.

**Example**:
```typescript
const toolMetrics = metrics.getMetrics('my-tool');
```

### Quotas

#### `MCPQuotas`
MCP quota management.

**Example**:
```typescript
import { MCPQuotas } from '@dreamnet/mcp-gateway';

const quotas = new MCPQuotas();

// Set quota
quotas.setQuota('my-tool', 100);

// Check quota
const canUse = quotas.checkQuota('my-tool');
if (canUse) {
  quotas.incrementUsage('my-tool');
}
```

---

## Data Models

### AuthContext

```typescript
interface AuthContext {
  userId?: string;
  apiKey?: string;
  permissions?: string[];
}
```

### AuthResult

```typescript
interface AuthResult {
  allowed: boolean;
  reason?: string;
}
```

### ToolMetrics

```typescript
interface ToolMetrics {
  toolName: string;
  invocationCount: number;
  successCount: number;
  failureCount: number;
  averageLatency: number;
  totalCost: number;
  lastInvocation: number;
}
```

### QuotaConfig

```typescript
interface QuotaConfig {
  limit: number;
  period?: 'daily' | 'weekly' | 'monthly';
}
```

---

## Authentication Flow

### API Key Authentication
1. Client provides API key
2. Gateway validates API key
3. Returns authentication result

### User-Based Authentication
1. Client provides user ID
2. Gateway validates user
3. Returns authentication result

### Authorization Flow
1. Authenticate request
2. Check tool permissions
3. Verify user permissions
4. Return authorization result

---

## Metrics Tracking

### Tracked Metrics
- Invocation count
- Success count
- Failure count
- Average latency
- Total cost
- Last invocation time

### Metric Calculation
- Simple moving average for latency
- Incremental counting for invocations
- Cost accumulation
- Success rate calculation

---

## Quota Management

### Quota Types
- Per-tool quotas
- Per-user quotas
- Time-based quotas (daily/weekly/monthly)

### Quota Enforcement
- Check quota before execution
- Increment usage on success
- Block execution if exceeded
- Reset on period boundary

---

## Integration Points

### DreamNet Systems
- **MCP Backbone**: MCP server integration
- **DreamNet Audit Core**: Audit logging
- **DreamNet Cost Core**: Cost tracking
- **DreamNet RBAC Core**: Permission management

---

## Usage Examples

### Authenticate and Authorize

```typescript
const auth = new MCPAuth();
auth.registerApiKey('key', { permissions: ['tool:read'] });
auth.setToolPermissions('tool', ['tool:read']);

const authResult = auth.authenticate({ apiKey: 'key' });
const authzResult = auth.authorize('tool', { apiKey: 'key' });
```

### Track Metrics

```typescript
const metrics = new MCPMetrics();
metrics.recordInvocation('tool', true, 100, 0.01);
const toolMetrics = metrics.getMetrics('tool');
```

### Manage Quotas

```typescript
const quotas = new MCPQuotas();
quotas.setQuota('tool', 100);
const canUse = quotas.checkQuota('tool');
```

---

## Best Practices

1. **Authentication**
   - Use API keys for services
   - Use user IDs for users
   - Validate all requests
   - Monitor authentication failures

2. **Metrics**
   - Track all invocations
   - Monitor success rates
   - Track costs
   - Analyze trends

---

## Security Considerations

1. **Authentication Security**
   - Secure API key storage
   - Validate all requests
   - Monitor authentication attempts
   - Rotate keys regularly

2. **Authorization Security**
   - Enforce permissions
   - Validate tool access
   - Audit authorizations
   - Prevent privilege escalation

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

