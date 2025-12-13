# DreamNet Server Workflow & Integration Guide

**Complete guide to how and why everything works together - your blueprint for understanding and modifying the system.**

---

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Initialization Sequence](#initialization-sequence)
3. [Request Flow](#request-flow)
4. [Subsystem Integration](#subsystem-integration)
5. [Reliability System Integration](#reliability-system-integration)
6. [Why This Design?](#why-this-design)
7. [Modification Patterns](#modification-patterns)

---

## System Architecture Overview

### Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Layer 1: Core Server (Always Active)                   │
│ - Express app, middleware, routes                       │
│ - Health endpoints                                      │
│ - Basic error handling                                  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 2: Reliability System (Optional)                 │
│ - Startup DAG, Health Gates                             │
│ - Circuit Breakers, Metrics                             │
│ - Traffic Shaping, Feature Flags                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 3: Optional Subsystems (Conditional)             │
│ - Neural Mesh, DreamState, Directory                    │
│ - Agents, Packs, Integrations                           │
│ - Heavy subsystems                                      │
└─────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Fail Fast on Critical Errors**: Environment config, port binding
2. **Graceful Degradation**: Server starts even if subsystems fail
3. **Non-Blocking Initialization**: Heavy work happens after server listens
4. **Dependency Management**: DAG ensures correct initialization order
5. **Health-Aware**: Health gates prevent traffic until ready

---

## Initialization Sequence

### Phase 1: Synchronous Core Setup (Lines 1-400)

**WHY**: These must complete before server can accept requests.

```
1. Load Environment Config (server/config/env.ts)
   ├─ Validates NODE_ENV, PORT
   ├─ Loads optional vars (DATABASE_URL, etc.)
   └─ THROWS if invalid → Server won't start
   
2. Create Express App (line 178)
   ├─ Sets body size limits (10mb)
   ├─ Configures request timeouts (30s)
   └─ Creates app instance
   
3. Setup CORS & Rate Limiting (lines 192-252)
   ├─ CORS: Allows origins from ALLOWED_ORIGINS
   ├─ Rate limit: 100 req/15min per IP
   └─ Health endpoints bypass rate limiting
   
4. Register Health Endpoint (line 287)
   ├─ /health - Fast, non-blocking DB check
   ├─ Returns 200 even if DB not configured
   └─ CRITICAL: Must respond quickly for Cloud Run
```

**Why This Order?**
- Environment must be valid before anything else
- Express app needed for all routes
- CORS/rate limiting protect server immediately
- Health endpoint needed for Cloud Run health checks

### Phase 2: Middleware Registration (Lines 364-396)

**WHY**: Middleware executes in registration order - order matters!

```
1. Trace ID Middleware
   └─ Adds X-Trace-Id to all requests
   
2. Metrics Middleware
   └─ Tracks golden signals (traffic, errors, latency)
   
3. Idempotency Middleware
   └─ Handles X-Idempotency-Key header
   
4. Tier Resolver Middleware
   └─ Resolves access tier from API key/wallet
   
5. Control Core Middleware
   └─ Enforces cluster access, rate limits, feature flags
   
6. Auto SEO Middleware
   └─ Applies SEO optimization globally
```

**Why This Order?**
- Trace ID first: All requests get traced
- Metrics second: Track everything
- Idempotency third: Prevent duplicates before processing
- Tier resolver fourth: Access control before business logic
- Control core fifth: Feature flags before routes
- SEO last: Optimize responses

### Phase 3: Route Registration (Lines 397-2240)

**WHY**: Routes registered in order - first match wins!

```
Specific routes first:
├─ /api/mesh
├─ /api/graft
├─ /api/dream
├─ /api/brain
└─ ... (237 routes)

Catch-all routes last:
└─ /api (catches everything else)
```

**Why This Order?**
- Specific routes must come before catch-all
- First matching route handles request
- Order determines which handler runs

### Phase 4: HTTP Server Creation (Lines 2272-2370)

**WHY**: Server must listen IMMEDIATELY for Cloud Run health checks.

```
1. Create HTTP Server (line 2280)
   └─ Wraps Express app
   
2. Add Error Handlers (lines 2343-2365)
   ├─ Server error handler
   ├─ Unhandled rejection handler
   └─ Uncaught exception handler
   
3. Start Listening (line 2370)
   └─ NON-BLOCKING: Returns immediately
   └─ Server can now accept requests
```

**Why This Order?**
- Server must exist before listening
- Error handlers catch failures gracefully
- Listening happens immediately (doesn't wait for subsystems)

### Phase 5: Async Initialization (Lines 2374-2477)

**WHY**: Heavy initialization happens AFTER server is listening.

```
1. Register Additional Routes (lines 2375-2387)
   └─ Loads server/routes/index.ts
   └─ Non-blocking: Routes added asynchronously
   
2. Setup Vite (lines 2389-2407)
   ├─ Development: Hot module reload
   ├─ Production: Static file serving
   └─ Non-blocking: Frontend unavailable if fails
   
3. Initialize Reliability System (lines 2460-2470)
   ├─ Only if USE_RELIABILITY_SYSTEM=true
   ├─ Runs migrations, queues, DAG, health gates
   └─ Non-blocking: Server runs in degraded mode if fails
   
4. Initialize Optional Subsystems (line 2474)
   ├─ Only if INIT_SUBSYSTEMS=true
   ├─ Loads heavy packages, initializes agents
   └─ Non-blocking: Features unavailable if fails
```

**Why This Order?**
- Routes added asynchronously don't block startup
- Vite setup can fail without crashing server
- Reliability system initializes independently
- Subsystems initialize last (heaviest work)

---

## Request Flow

### Complete Request Journey

```
HTTP Request arrives
    ↓
Express App receives request
    ↓
[Middleware Chain - Executes in Order]
    ├─ Trace ID → Adds X-Trace-Id
    ├─ Metrics → Starts tracking
    ├─ Idempotency → Checks X-Idempotency-Key
    ├─ Tier Resolver → Resolves access tier
    ├─ Control Core → Checks feature flags
    └─ Auto SEO → Applies optimization
    ↓
Route Handler (first matching route)
    ├─ Checks health gates (if critical route)
    ├─ Executes business logic
    ├─ May call external APIs (protected by circuit breaker)
    └─ Returns response
    ↓
[Middleware Chain - Response Phase]
    ├─ Metrics → Records latency/errors
    └─ Auto SEO → Optimizes response
    ↓
HTTP Response sent
```

### Health Gate Integration

**Critical Routes** check health gates before processing:

```typescript
// Example: Critical route handler
router.post('/api/critical-operation', async (req, res) => {
  // Check health gates
  const gates = getHealthGates();
  const readiness = await gates.getReadiness();
  
  if (!readiness.criticalReady) {
    return res.status(503).json({
      error: 'Service not ready',
      gates: readiness.gates,
    });
  }
  
  // Proceed with operation
  // ...
});
```

**Why?**
- Prevents operations when critical services are down
- Returns 503 instead of 500 (service unavailable vs error)
- Includes gate status in response

### Circuit Breaker Integration

**External API Calls** are protected:

```typescript
import { withCircuitBreaker } from '../core/circuit-breaker';

// Protected external call
const result = await withCircuitBreaker('openai-api', async () => {
  return await openaiClient.chat.completions.create({...});
});
```

**Why?**
- Prevents cascading failures
- Exponential backoff retries
- Opens circuit after N failures
- Half-open state for recovery

### Feature Flag Integration

**Feature Checks** use IntegrationFlagsService:

```typescript
import { IntegrationFlagsService } from '../services/IntegrationFlagsService';

if (await IntegrationFlagsService.isEnabled('my_feature')) {
  // Feature code
} else {
  // Fallback or error
}
```

**Why?**
- Runtime feature toggles
- Brownout mode support (graceful degradation)
- Emergency mode support
- No code deployment needed

---

## Subsystem Integration

### Dependency Graph

```
database (critical)
    ↓
event-bus (optional)
    ↓
neural-mesh (conditional: INIT_SUBSYSTEMS)
    ↓
agent-wallet-manager (optional)
    ↓
latent-collaboration (conditional: USE_LATENT_COLLABORATION)
    ↓
runtime-bridge (conditional: INIT_SUBSYSTEMS)
    ↓
citadel (conditional: INIT_SUBSYSTEMS)
dreamkeeper (optional)
drone-dome (conditional: INIT_SUBSYSTEMS)
```

### How DAG Works

1. **Registration**: Services register with dependencies
2. **Topological Sort**: DAG calculates initialization order
3. **Sequential Init**: Services initialize in dependency order
4. **Health Checks**: Each service verified after init
5. **Failure Handling**: Critical failures stop init, non-critical continue

**Example Flow**:
```
1. database → No dependencies → Initialize immediately
2. event-bus → Depends on database → Wait for database ready
3. neural-mesh → Depends on database → Wait for database ready
4. runtime-bridge → Depends on neural-mesh → Wait for neural-mesh ready
5. citadel → Depends on runtime-bridge → Wait for runtime-bridge ready
```

### Health Gates Integration

**Health gates** track service readiness:

```typescript
// Register gate
gates.register({
  serviceId: 'database',
  name: 'Database',
  check: checkDatabaseGate,
  critical: true,
  requiredPasses: 3, // Must pass 3 times consecutively
});

// Periodic checks (every 5 seconds)
gates.start();

// Check readiness
const readiness = await gates.getReadiness();
if (!readiness.criticalReady) {
  // Block traffic
}
```

**Why Required Passes?**
- Prevents false positives from transient failures
- Ensures service is stable before accepting traffic
- Configurable per service (default: 3)

---

## Reliability System Integration

### Components Working Together

```
┌─────────────────────────────────────────┐
│ Startup DAG                             │
│ - Manages initialization order          │
│ - Tracks service status                 │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Health Gates                             │
│ - Monitors service health               │
│ - Blocks traffic if critical services down│
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Circuit Breakers                         │
│ - Protects external calls               │
│ - Prevents cascading failures            │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Metrics Collection                      │
│ - Tracks golden signals                 │
│ - Exposed via /api/observability        │
└─────────────────────────────────────────┘
```

### Integration Points

1. **DAG → Health Gates**
   - DAG initializes services
   - Health gates monitor service health
   - Health gates check DAG status

2. **Health Gates → Readiness Endpoint**
   - `/health/ready` checks health gates
   - Returns 503 if critical gates fail
   - Includes gate status in response

3. **Circuit Breakers → External Calls**
   - All external API calls wrapped
   - Circuit breaker state exposed via observability
   - Auto-recovery after timeout

4. **Metrics → Observability**
   - Metrics middleware collects data
   - Exposed via `/api/observability/golden-signals`
   - Used for SLO monitoring

5. **Feature Flags → Control Core**
   - Feature flags loaded from YAML
   - Control core middleware checks flags
   - Brownout mode degrades gracefully

---

## Why This Design?

### 1. Cloud Run Compatibility

**Problem**: Cloud Run requires health checks to pass within seconds.

**Solution**: 
- Server listens immediately (Phase 4)
- Health endpoint responds quickly (Phase 1)
- Heavy initialization happens after (Phase 5)

**Result**: Server responds to health checks immediately, even if subsystems aren't ready.

### 2. Graceful Degradation

**Problem**: One failing subsystem shouldn't crash the server.

**Solution**:
- Non-blocking initialization (Phase 5)
- Try-catch around all subsystem init
- Server runs in degraded mode if subsystems fail

**Result**: Server starts even if optional subsystems fail.

### 3. Dependency Management

**Problem**: Services have complex dependencies.

**Solution**:
- Startup DAG manages dependencies
- Topological sort ensures correct order
- Services wait for dependencies

**Result**: Services initialize in correct order, no race conditions.

### 4. Health-Aware Routing

**Problem**: Routes shouldn't accept traffic if critical services are down.

**Solution**:
- Health gates monitor service health
- Critical routes check gates before processing
- Returns 503 (service unavailable) instead of 500

**Result**: Clear error messages, prevents cascading failures.

### 5. Observability

**Problem**: Need visibility into system health.

**Solution**:
- Metrics middleware tracks everything
- Circuit breakers expose state
- Health gates expose readiness
- All exposed via `/api/observability`

**Result**: Complete visibility into system health.

---

## Modification Patterns

### Adding a New Route

**Pattern**:
1. Create route file: `server/routes/my-route.ts`
2. Export router
3. Register in `server/index.ts` BEFORE catch-all routes
4. Add error handling

**Example**:
```typescript
// server/routes/my-route.ts
import { Router } from 'express';
const router = Router();

router.get('/endpoint', async (req, res) => {
  try {
    // Handler logic
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
```

```typescript
// server/index.ts (around line 400)
import myRouteRouter from './routes/my-route';
app.use('/api/my-route', myRouteRouter); // BEFORE catch-all routes
```

### Adding Middleware

**Pattern**:
1. Create middleware file: `server/middleware/my-middleware.ts`
2. Export function: `(req, res, next) => void`
3. Register in `server/index.ts` in correct order
4. Consider if it should run before/after other middleware

**Example**:
```typescript
// server/middleware/my-middleware.ts
export function myMiddleware(req, res, next) {
  // Middleware logic
  next();
}
```

```typescript
// server/index.ts (around line 365)
import { myMiddleware } from './middleware/my-middleware';
app.use(myMiddleware); // Register in correct order
```

### Adding a New Subsystem

**Pattern**:
1. Add to `deploy/graph.json` with dependencies
2. Create init function in subsystem package
3. Initialize in `server/index.ts` (inside `initOptionalSubsystems`)
4. Register health gate if critical

**Example**:
```json
// deploy/graph.json
{
  "id": "my-subsystem",
  "name": "My Subsystem",
  "dependencies": ["database"],
  "critical": false,
  "initModule": "packages/my-subsystem",
  "initFunction": "init",
  "conditional": "INIT_SUBSYSTEMS"
}
```

```typescript
// server/index.ts (inside initOptionalSubsystems)
try {
  const { MySubsystem } = await import('@dreamnet/my-subsystem');
  await MySubsystem.init();
  console.log('✅ [My Subsystem] Initialized');
} catch (error) {
  console.warn('[My Subsystem] Initialization warning:', error);
}
```

### Adding Circuit Breaker Protection

**Pattern**:
1. Import `withCircuitBreaker`
2. Wrap external API call
3. Handle circuit breaker errors

**Example**:
```typescript
import { withCircuitBreaker } from '../core/circuit-breaker';

try {
  const result = await withCircuitBreaker('my-api', async () => {
    return await externalApiCall();
  });
} catch (error) {
  if (error.message.includes('Circuit breaker')) {
    // Circuit is open - service unavailable
    return res.status(503).json({ error: 'Service temporarily unavailable' });
  }
  throw error;
}
```

### Adding Feature Flag

**Pattern**:
1. Add to `server/config/feature-flags.yaml`
2. Check flag in code
3. Handle disabled state

**Example**:
```yaml
# server/config/feature-flags.yaml
flags:
  - name: "my_feature"
    default: true
    description: "My feature"
    owner: "my-team"
    brownout: false
```

```typescript
import { IntegrationFlagsService } from '../services/IntegrationFlagsService';

if (await IntegrationFlagsService.isEnabled('my_feature')) {
  // Feature code
} else {
  // Fallback or error
  return res.status(503).json({ error: 'Feature disabled' });
}
```

---

## Common Mistakes & How to Avoid Them

### ❌ Mistake 1: Blocking Health Endpoint

**Problem**: Health endpoint waits for heavy initialization.

**Solution**: Health endpoint must return immediately, check DB with timeout.

### ❌ Mistake 2: Wrong Middleware Order

**Problem**: Middleware executes in wrong order.

**Solution**: Register middleware in correct order (trace → metrics → idempotency → tier → control → SEO).

### ❌ Mistake 3: Route Registration Order

**Problem**: Catch-all route matches before specific route.

**Solution**: Register specific routes BEFORE catch-all routes.

### ❌ Mistake 4: Synchronous Heavy Initialization

**Problem**: Heavy initialization blocks server startup.

**Solution**: Do heavy initialization AFTER server.listen() in async function.

### ❌ Mistake 5: Missing Error Handling

**Problem**: Unhandled errors crash server.

**Solution**: Wrap all async operations in try-catch, use global error handler.

### ❌ Mistake 6: Missing Dependency Declaration

**Problem**: Service initializes before dependency is ready.

**Solution**: Declare dependencies in `deploy/graph.json`, let DAG manage order.

---

## Debugging Workflow

### Server Won't Start

1. Check environment config: `server/config/env.ts`
2. Check port availability: `lsof -i :3000`
3. Check logs for initialization errors
4. Try minimal startup: Comment out `initOptionalSubsystems`

### Routes Not Working

1. Check route registration order
2. Check middleware isn't blocking
3. Check feature flags: `/api/observability/feature-flags`
4. Check health gates: `/api/observability/health-gates`

### Subsystem Not Initializing

1. Check env vars: `INIT_SUBSYSTEMS`, `INIT_HEAVY_SUBSYSTEMS`
2. Check `deploy/graph.json` for service definition
3. Check dependencies are ready
4. Check logs for initialization errors

### Health Gates Failing

1. Check service health: `/api/observability/health-gates`
2. Check DAG status: `/api/observability/startup-dag`
3. Check service logs for errors
4. Verify health check function is correct

---

**Last Updated**: 2025-01-27
**Version**: 1.0

