# DreamNet Server Middleware - Complete Documentation

**Status**: ✅ Complete  
**Last Updated**: 2025-01-27  
**Total Middleware Files**: 14

---

## Overview

The DreamNet server uses a carefully orchestrated middleware chain to handle request processing, authentication, authorization, observability, and content optimization. All middleware runs in a specific order to ensure proper request flow and security.

---

## Middleware Chain Order

The middleware chain executes in this exact order (as defined in `server/index.ts`):

```
1. traceIdMiddleware          → Generate/attach trace IDs
2. metricsMiddleware          → Collect golden signals (traffic, errors, latency)
3. idempotencyMiddleware      → Handle duplicate requests
4. tierResolverMiddleware     → Resolve access tier (API key/wallet)
5. controlCoreMiddleware       → Enforce cluster-level access & rate limits
6. autoSEORequestMiddleware    → Auto-optimize content for SEO
7. Route Handlers              → Actual business logic
```

**Critical Flow**: Trace → Metrics → Idempotency → Tier Resolver → Control Core → Route Handler

---

## Middleware Files

### 1. `traceId.ts` - Request Tracing

**Purpose**: Generates and propagates trace IDs for request tracking and debugging.

**Key Functions**:
- `generateTraceId()` - Creates unique trace ID (format: `timestamp-hex`)
- `getTraceId(req)` - Extracts trace ID from headers or generates new one
- `traceIdMiddleware` - Express middleware that attaches trace ID to all requests

**Headers**:
- Reads: `X-Trace-Id`, `X-Request-Id`
- Sets: `X-Trace-Id`

**Request Attachment**:
- `req.traceId` - String trace ID
- `req.traceContext` - Full trace context with span IDs

**Usage**:
```typescript
// Automatically applied to all requests
app.use(traceIdMiddleware);

// Access in route handlers
router.get("/api/example", (req, res) => {
  const traceId = req.traceId; // "abc123-def456"
});
```

**Why**: Enables distributed tracing, request correlation, and debugging across services.

---

### 2. `metrics.ts` - Golden Signals Collection

**Purpose**: Collects "golden signals" (traffic, errors, latency, saturation) for observability.

**Key Functions**:
- `metricsMiddleware` - Express middleware that tracks request metrics
- `getGoldenSignals()` - Returns current golden signals snapshot
- `getEndpointMetrics(endpoint)` - Get metrics for specific endpoint

**Metrics Collected**:
- **Traffic**: Request count per endpoint
- **Errors**: Error count and rate
- **Latency**: P50, P95, P99 latencies
- **Saturation**: Resource utilization

**Request Flow**:
1. Records request start time
2. Tracks endpoint path
3. Records response status code
4. Calculates latency
5. Updates golden signals

**Usage**:
```typescript
// Automatically applied to all requests
app.use(metricsMiddleware);

// Access metrics
import { getGoldenSignals } from './middleware/metrics';
const signals = getGoldenSignals();
```

**Why**: Critical for production monitoring, alerting, and performance optimization.

---

### 3. `idempotency.ts` - Duplicate Request Prevention

**Purpose**: Prevents duplicate processing of requests using idempotency keys.

**Key Functions**:
- `checkIdempotency(key, traceId, digest, ttlMs)` - Check if request is duplicate
- `storeIdempotencyResponse(key, response, ttlMs)` - Cache response for replay
- `getIdempotencyResponse(key)` - Get cached response
- `idempotencyMiddleware` - Express middleware

**Headers**:
- Reads: `X-Idempotency-Key`, `Idempotency-Key`

**Behavior**:
1. If idempotency key present, check cache
2. If cached response exists, return it immediately (200)
3. If key seen before (within TTL), return 409 Conflict
4. Otherwise, process request and cache response

**TTL**: Default 10 minutes (configurable)

**Usage**:
```typescript
// Automatically applied to all requests
app.use(idempotencyMiddleware);

// Client sends idempotency key
fetch('/api/create', {
  headers: { 'X-Idempotency-Key': 'unique-key-123' }
});
```

**Why**: Prevents duplicate charges, double-processing, and race conditions in distributed systems.

---

### 4. `tierResolver.ts` - Access Tier Resolution

**Purpose**: Resolves user access tier from API keys or wallet signatures (includes God Vault detection).

**Key Functions**:
- `resolveTier(req)` - Legacy tier resolution
- `tierResolverMiddleware` - Main middleware (uses `identityAndTierResolver`)
- `requireTier(minTierId)` - Middleware to require minimum tier
- `requireFeature(featureFlag)` - Middleware to require feature flag

**Headers**:
- Reads: `X-DreamNet-Api-Key`, `X-DreamNet-Wallet-Address`, `X-DreamNet-Wallet-Signature`

**Tiers** (in order):
1. `SEED` - Default tier (lowest)
2. `BUILDER` - Builders and developers
3. `OPERATOR` - Operators and admins
4. `GOD_MODE` - Highest tier (includes God Vault)

**Request Attachment**:
- `req.callerIdentity` - Full caller identity (includes `isGodVault`)
- `req.callerTierId` - Tier ID (for backward compatibility)
- `req.callerTier` - Tier configuration (for backward compatibility)

**God Vault Detection**:
- Automatically detected via `identityAndTierResolver`
- Special API keys prefixed with `dn_god_` are recognized as God Vault
- `callerIdentity.isGodVault` is set to `true` for God Vault keys

**Usage**:
```typescript
// Automatically applied to all requests
app.use(tierResolverMiddleware);

// Require minimum tier
router.post("/api/deploy", requireTier("BUILDER"), handler);

// Require feature flag
router.post("/api/wolf-pack", requireFeature("canAccessWolfPack"), handler);

// Access in route handlers
router.get("/api/example", (req, res) => {
  const tier = req.callerTierId; // "BUILDER"
  const isGod = req.callerIdentity?.isGodVault; // false
});
```

**Why**: Enables tier-based access control, feature flags, and rate limiting.

---

### 5. `control.ts` - Control Core Middleware

**Purpose**: Enforces cluster-level access control, rate limiting, and feature flags via DreamNet Control Core.

**Key Functions**:
- `controlMiddleware(clusterId)` - Main middleware
- `createControlMiddleware(clusterId)` - Factory function

**Integration**:
- Uses `DreamNetControlCore.checkOperation()` to validate requests
- Checks kill-switch status
- Enforces rate limits per cluster
- Validates tier-based access

**Request Flow**:
1. Extracts cluster ID, operation, trace ID, tier info
2. Calls `DreamNetControlCore.checkOperation()`
3. If blocked, returns 503 with reason
4. If allowed, adds control headers and continues

**Response Headers**:
- `X-Control-Status` - "allowed" or "blocked"
- `X-Cluster-ID` - Cluster identifier
- `X-Caller-Tier-Id` - Tier ID (if available)
- `X-Caller-Is-God-Vault` - "true" if God Vault (if applicable)

**Usage**:
```typescript
// Applied globally (only acts on routes with clusterId)
app.use(controlCoreMiddleware);

// Routes without clusterId pass through
router.get("/api/public", handler); // No clusterId, passes through

// Routes with clusterId are checked
router.post("/api/cluster/:clusterId", handler); // Checked via clusterId param
```

**Why**: Provides global kill-switch, rate limiting, and cluster-level access control.

---

### 6. `autoSEO.ts` - Automatic SEO Optimization

**Purpose**: Automatically optimizes content for SEO and geofencing on all POST/PUT/PATCH requests.

**Key Functions**:
- `autoSEOMiddleware` - Response interceptor (legacy)
- `autoSEORequestMiddleware` - Request body optimizer (active)

**Content Detection**:
- Detects content by checking for: `title`, `name`, `text`, `description`, `content`
- Determines content type: `post`, `product`, `page`
- Determines platform: `web`, `twitter`, `farcaster`, `instagram`, `tiktok`, `youtube`, `linkedin`

**Optimization**:
- Optimizes title and description
- Generates SEO keywords
- Applies geofencing
- Calculates SEO score (0-100)
- Generates meta tags

**Request Attachment**:
- `req.body.seoOptimized` - Optimized SEO data
- `req.body.seoKeywords` - Generated keywords
- `req.body.geofences` - Applied geofences
- `req.body.seoScore` - SEO score

**Nerve Events**:
- Publishes SEO events to Nerve Bus for observability

**Usage**:
```typescript
// Automatically applied to all requests
app.use(autoSEORequestMiddleware);

// Content is automatically optimized
router.post("/api/dreams", async (req, res) => {
  // req.body.title is already optimized
  // req.body.seoOptimized contains full SEO data
});
```

**Why**: Zero-touch SEO optimization for all content, improving discoverability and engagement.

---

### 7. `apiKeyAuth.ts` - API Key Authentication

**Purpose**: Validates DreamNet API keys from Authorization header or X-API-Key header.

**Key Functions**:
- `requireApiKey` - Middleware that requires API key
- `optionalApiKey` - Middleware that optionally validates API key
- `requirePermission(permission)` - Middleware to require specific permission

**Headers**:
- Reads: `Authorization: Bearer dn_live_...`, `X-API-Key: dn_live_...`

**Request Attachment**:
- `req.apiKey` - API key information:
  - `id` - Key ID
  - `keyPrefix` - Key prefix
  - `name` - Key name
  - `permissions` - Array of permissions
  - `rateLimit` - Rate limit
  - `userId` - Associated user ID
  - `walletAddress` - Associated wallet address

**Usage**:
```typescript
// Require API key
router.post("/api/secure", requireApiKey, handler);

// Optional API key (for endpoints that support both API key and wallet auth)
router.get("/api/public", optionalApiKey, handler);

// Require specific permission
router.delete("/api/resource", requireApiKey, requirePermission("delete"), handler);
```

**Why**: Provides API key-based authentication for programmatic access.

---

### 8. `passportGate.ts` - Dream State Passport Gate

**Purpose**: Checks if user has required Dream State passport tier for access.

**Key Functions**:
- `createPassportGate(requiredTier)` - Creates middleware requiring passport tier
- `getPassport(req)` - Helper to get passport from request
- `getIdentityId(req)` - Helper to get identity ID

**Tier Hierarchy**:
1. `visitor` - Level 1 (lowest)
2. `citizen` - Level 2
3. `ambassador` - Level 3
4. `operator` - Level 4
5. `architect` - Level 5
6. `founder` - Level 6 (highest)

**Request Attachment**:
- `req.passport` - Dream State passport object
- `req.identityId` - Identity ID (wallet address or user ID)

**Usage**:
```typescript
// Require passport tier
router.post("/api/governance", createPassportGate("ambassador"), handler);

// Access passport in handler
router.get("/api/profile", createPassportGate("citizen"), (req, res) => {
  const passport = getPassport(req);
  const tier = passport.tier; // "ambassador"
});
```

**Why**: Biomimetic access control - Dream State is top-level authority for all access.

---

### 9. `rbac.ts` - Role-Based Access Control

**Purpose**: Checks permissions before allowing actions via DreamNet RBAC Core.

**Key Functions**:
- `createRBACMiddleware(permission)` - Creates middleware requiring permission

**Integration**:
- Uses `DreamNetRBACCore.checkPermission()` to validate permissions
- Checks permissions based on userId, walletAddress, clusterId, resourceId

**Usage**:
```typescript
// Require permission
router.delete("/api/resource/:id", createRBACMiddleware("resource:delete"), handler);
```

**Why**: Fine-grained permission control for resource-level access.

---

### 10. `rateLimiter.ts` - Rate Limiting

**Purpose**: Simple in-memory rate limiter (production should use Redis).

**Key Functions**:
- `rateLimitManager.getClient(clientId)` - Get or create rate limit client
- `rateLimitManager.checkLimit(clientId)` - Check if request allowed
- `rateLimitManager.getStats()` - Get rate limiter stats

**Configuration**:
- Window: 60 seconds
- Max requests: 100 per window

**Usage**:
```typescript
import { rateLimitManager } from './middleware/rateLimiter';

router.get("/api/example", (req, res) => {
  const clientId = req.ip || 'unknown';
  const { allowed, remaining } = rateLimitManager.checkLimit(clientId);
  
  if (!allowed) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  
  res.setHeader('X-RateLimit-Remaining', remaining);
  // ... handler logic
});
```

**Why**: Prevents abuse and protects against DDoS attacks.

**Note**: This is a simple implementation. Production should use Redis-based rate limiting.

---

### 11. `validateRequest.ts` - Request Validation

**Purpose**: Validates request bodies, query params, and route params using Zod schemas.

**Key Functions**:
- `validateRequest(schema)` - Creates validation middleware

**Schema Format**:
```typescript
{
  body?: z.ZodSchema,      // Validate request body
  query?: z.ZodSchema,     // Validate query params
  params?: z.ZodSchema     // Validate route params
}
```

**Usage**:
```typescript
import { z } from 'zod';
import { validateRequest } from './middleware/validateRequest';

const createDreamSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

router.post("/api/dreams", 
  validateRequest({ body: createDreamSchema }),
  handler
);
```

**Why**: Ensures request data is valid before processing, preventing errors downstream.

---

### 12. `billable.ts` - Two-Phase Commit for Billable Actions

**Purpose**: Implements two-phase commit pattern for billable actions - charge only after response is confirmed stored.

**Key Functions**:
- `reserveCharge(idempotencyKey, action, amount, currency, traceId)` - Phase 1: Reserve charge
- `confirmAndCharge(actionId, response)` - Phase 2: Confirm and charge
- `billableActionMiddleware(action)` - Middleware wrapper
- `getBillableAction(actionId)` - Get action status
- `getBillableStats()` - Get billing statistics

**Two-Phase Commit Flow**:
1. **Phase 1**: Reserve charge (before processing)
   - Check idempotency
   - Create pending billable action
   - Return action ID
2. **Phase 2**: Confirm and charge (after response sent)
   - Mark action as confirmed
   - Charge payment processor
   - Mark as charged

**Request Attachment**:
- `req.billableActionId` - Action ID
- `req.billableAmount` - Amount to charge
- `req.billableCurrency` - Currency

**Usage**:
```typescript
// Wrap billable endpoint
router.post("/api/premium-feature", 
  billableActionMiddleware("premium_feature"),
  async (req, res) => {
    const actionId = req.billableActionId;
    // ... process request
    res.json({ success: true }); // Charge happens automatically after response
  }
);
```

**Why**: Prevents double-charging and ensures charges only happen after successful operations.

---

### 13. `errorLogger.ts` - Error Logging

**Purpose**: Structured error logging for production monitoring.

**Key Functions**:
- `errorLogger(err, req, res, next)` - Express error middleware

**Log Format**:
```json
{
  "timestamp": "2025-01-27T12:00:00.000Z",
  "level": "error",
  "traceId": "abc123-def456",
  "method": "POST",
  "path": "/api/example",
  "ip": "127.0.0.1",
  "userAgent": "Mozilla/5.0...",
  "error": {
    "name": "Error",
    "message": "Something went wrong",
    "stack": "..." // Only in development
  },
  "statusCode": 500
}
```

**Usage**:
```typescript
// Applied as error handler (last middleware)
app.use(errorLogger);
```

**Why**: Provides structured error logging for debugging and monitoring.

**Note**: Should integrate with Sentry or similar error tracking service in production.

---

### 14. `traffic-shaping.ts` - Traffic Shaping & Gradual Rollout

**Purpose**: Gradual traffic rollout and SLO monitoring for new features/deployments.

**Key Functions**:
- `trafficShapingMiddleware` - Main middleware
- `withTrafficShaping(config)` - Per-route configuration

**Integration**:
- Uses `server/core/traffic-shaping.ts` for core logic
- Checks rollout percentage
- Records metrics for SLO monitoring
- Supports auto-rollback on SLO breach

**Usage**:
```typescript
// Apply globally (optional)
app.use(trafficShapingMiddleware);

// Per-route configuration
router.post("/api/new-feature",
  withTrafficShaping({ rolloutName: "new-feature", enabled: true }),
  handler
);
```

**Why**: Enables safe gradual rollouts and automatic rollback on SLO breaches.

---

## Middleware Integration Points

### Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     HTTP Request                            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  1. traceIdMiddleware                                        │
│     → Generate/attach trace ID                              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  2. metricsMiddleware                                        │
│     → Record request start, track endpoint                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  3. idempotencyMiddleware                                    │
│     → Check for duplicate requests                          │
│     → Return cached response if replay                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  4. tierResolverMiddleware                                   │
│     → Resolve access tier (API key/wallet)                   │
│     → Detect God Vault                                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  5. controlCoreMiddleware                                    │
│     → Check kill-switch                                      │
│     → Enforce rate limits                                    │
│     → Validate tier access                                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  6. autoSEORequestMiddleware                                 │
│     → Auto-optimize content for SEO                         │
│     → Apply geofencing                                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Route Handler                            │
│     → Business logic                                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Response                                 │
│     → metricsMiddleware records completion                   │
│     → idempotencyMiddleware caches response                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Common Patterns

### 1. Conditional Middleware Application

Some middleware only applies to specific routes:

```typescript
// Global middleware (applies to all routes)
app.use(traceIdMiddleware);
app.use(metricsMiddleware);

// Route-specific middleware
router.post("/api/secure", requireApiKey, handler);
router.post("/api/governance", createPassportGate("ambassador"), handler);
```

### 2. Middleware Composition

Middleware can be composed for complex requirements:

```typescript
router.post("/api/premium-feature",
  requireApiKey,                    // Require API key
  requirePermission("premium"),      // Require permission
  billableActionMiddleware("premium"), // Handle billing
  validateRequest({ body: schema }), // Validate request
  handler
);
```

### 3. Request Context Attachment

Middleware attaches context to `req` object:

```typescript
// After middleware chain, req has:
req.traceId              // From traceIdMiddleware
req.callerIdentity       // From tierResolverMiddleware
req.callerTierId        // From tierResolverMiddleware
req.apiKey              // From apiKeyAuth (if applied)
req.passport            // From passportGate (if applied)
req.billableActionId    // From billableActionMiddleware (if applied)
```

---

## Best Practices

1. **Always use trace IDs**: All middleware should log with trace IDs for correlation
2. **Idempotency for mutations**: Use idempotency keys for POST/PUT/DELETE operations
3. **Tier-based access**: Use tier resolver for access control, not custom auth
4. **Validate early**: Use `validateRequest` before processing
5. **Monitor metrics**: All requests are automatically tracked via metrics middleware
6. **Error handling**: Use errorLogger middleware for structured error logging

---

## Configuration

### Environment Variables

- `DEBUG_TRACE=true` - Enable trace ID logging
- `DEBUG_TIER=true` - Enable tier info in response headers
- `AUTO_SEO_REPLACE=true` - Replace titles/descriptions with optimized versions

---

## Future Improvements

1. **Redis-based rate limiting**: Replace in-memory rate limiter with Redis
2. **Sentry integration**: Integrate errorLogger with Sentry
3. **Distributed tracing**: Integrate trace IDs with OpenTelemetry/Jaeger
4. **Metrics export**: Export metrics to Prometheus/Grafana
5. **Circuit breaker middleware**: Add circuit breaker pattern for external calls

---

**This documentation covers all 14 middleware files in the DreamNet server.**

