# DreamNet Safe Boot Sequence

**Based on battle-tested resilient startup patterns**

---

## The 7-Step Boot Sequence

DreamNet follows a layered startup approach where each layer must prove readiness before the next layer starts.

### 1. Config & Feature Flags ✅

**Status:** Implemented

**Current Implementation:**
- `server/config/env.ts` loads and validates environment variables
- Feature flags: `INIT_SUBSYSTEMS`, `INIT_HEAVY_SUBSYSTEMS`, `MESH_AUTOSTART`
- Config loaded early in `server/index.ts`

**Health Gate:**
- Config must load without errors
- Unknown flags = warn, not crash
- Required vars (NODE_ENV, PORT) must be present

**Improvements Needed:**
- [ ] Centralized config source (currently env vars)
- [ ] Config validation with clear error messages
- [ ] Feature flag registry with descriptions

---

### 2. Secrets & Env Loader (Fail Closed) ✅

**Status:** Implemented via EnvKeeper

**Current Implementation:**
- `packages/env-keeper-core` auto-discovers env vars
- EnvKeeper initialized when `INIT_HEAVY_SUBSYSTEMS=true`
- Critical secrets can be validated

**Health Gate:**
- Critical secrets (API keys, DB URLs) validated before proceeding
- Missing critical secrets = stop boot
- Secrets redacted in logs

**Improvements Needed:**
- [ ] Fail-closed validation for critical secrets
- [ ] Secrets validation before any subsystem starts
- [ ] Better secret redaction in logs

---

### 3. Orchestrator Kernel ✅

**Status:** Implemented via DreamNet OS

**Current Implementation:**
- `server/core/dreamnet-os.ts` - Core orchestrator
- Agent registry (DreamKeeper, DeployKeeper, RelayBot, EnvKeeper)
- Routing and middleware setup

**Health Gate:**
- Kernel must initialize successfully
- Agent registry must be populated
- Core routing must be configured

**Current Status:**
- ✅ Kernel initializes early
- ✅ Agents registered
- ✅ Routes configured

---

### 4. Stateful Stores (DB/Queues) ⚠️

**Status:** Partial - needs health gates

**Current Implementation:**
- `server/db.ts` - Database connection (optional)
- Database health check in `/health` endpoint
- Server can start without DB (graceful degradation)

**Health Gate:**
- [ ] DB migration check before API starts
- [ ] Schema version verification
- [ ] Read/write test before proceeding
- [ ] Queue connectivity check (if using queues)

**Current Behavior:**
- ✅ Server starts without DB (graceful)
- ⚠️ No migration gating
- ⚠️ No schema version check

**Improvements Needed:**
- [ ] Migration runner with health gate
- [ ] Schema hash verification
- [ ] Read/write liveness check
- [ ] Queue ping (if applicable)

---

### 5. Stateless APIs & Tools ✅

**Status:** Implemented

**Current Implementation:**
- Express app with 200+ routes
- APIs start after kernel
- Health endpoints: `/health`, `/health/live`, `/health/ready`

**Health Gate:**
- APIs advertise readiness only after dependencies pass
- `/health/ready` checks DB, env vars, critical services

**Current Status:**
- ✅ APIs start after kernel
- ✅ Readiness probe checks dependencies
- ✅ Graceful degradation if DB unavailable

---

### 6. Background Workers & Cron ⚠️

**Status:** Partial - needs sequencing

**Current Implementation:**
- Optional subsystems initialized asynchronously
- Workers start via `initOptionalSubsystems()`
- Cron jobs in various subsystems

**Health Gate:**
- [ ] Workers start only after APIs are ready
- [ ] Safe re-enqueue on crash
- [ ] Visibility timeouts set

**Current Behavior:**
- ⚠️ Workers start asynchronously (non-blocking)
- ⚠️ No explicit health gate before workers start
- ✅ Workers are optional (can start without)

**Improvements Needed:**
- [ ] Worker startup gated by API readiness
- [ ] Retry logic with exponential backoff
- [ ] Dead letter queues for failed jobs

---

### 7. UI/Ingress ✅

**Status:** Implemented

**Current Implementation:**
- Frontend served by API server (same container)
- Vite dev server or static files
- Ingress configured in Kubernetes

**Health Gate:**
- UI exposed only after APIs are ready
- Frontend build happens in Dockerfile before server starts

**Current Status:**
- ✅ UI served after API is ready
- ✅ Static files served correctly
- ✅ Ingress routes configured

---

## Current Startup Flow

```
1. Load config/env.ts ✅
2. Create Express app ✅
3. Setup middleware ✅
4. Register health endpoints ✅
5. Register API routes ✅
6. Setup Vite/static serving ✅
7. Start HTTP server ✅
8. Initialize optional subsystems (async, non-blocking) ⚠️
```

## Recommended Improvements

### 1. Add Health Gates Between Steps

```typescript
// Pseudo-code for health-gated startup
async function safeBoot() {
  // Step 1: Config
  const config = await loadConfig();
  if (!config.valid) throw new Error('Config invalid');
  
  // Step 2: Secrets (fail closed)
  const secrets = await loadSecrets();
  if (!secrets.criticalSecretsPresent) {
    throw new Error('Critical secrets missing');
  }
  
  // Step 3: Kernel
  const kernel = await startKernel();
  await kernel.healthCheck(); // Must pass
  
  // Step 4: Stores
  const db = await connectDatabase();
  await db.migrate();
  await db.healthCheck(); // Must pass
  
  // Step 5: APIs
  const api = await startAPIs();
  await api.healthCheck(); // Must pass
  
  // Step 6: Workers (only if APIs ready)
  if (api.isReady()) {
    await startWorkers();
  }
  
  // Step 7: UI
  await exposeUI();
}
```

### 2. Add Circuit Breakers

```typescript
// Circuit breaker for downstream services
class CircuitBreaker {
  private failures = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      return this.degradedResponse(); // Serve cached or no-op
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private degradedResponse() {
    // Return cached data or polite no-op
    return { ok: false, degraded: true, message: 'Service temporarily unavailable' };
  }
}
```

### 3. Add Retry Logic with Exponential Backoff

```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000; // Jitter
      await sleep(delay);
    }
  }
  throw new Error('Max retries exceeded');
}
```

### 4. Add Dependency Graph Validation

```typescript
class DependencyGraph {
  private dependencies = new Map<string, string[]>();
  
  addService(name: string, deps: string[]) {
    this.dependencies.set(name, deps);
  }
  
  async validateStartupOrder(): Promise<void> {
    // Check that dependencies are started before dependents
    for (const [service, deps] of this.dependencies) {
      for (const dep of deps) {
        if (!this.isStarted(dep)) {
          throw new Error(`${service} depends on ${dep} which is not started`);
        }
      }
    }
  }
}
```

---

## Implementation Plan

### Phase 1: Health Gates (High Priority)

1. **Add DB migration health gate**
   - Run migrations before API starts
   - Verify schema version
   - Test read/write

2. **Gate worker startup**
   - Start workers only after APIs are ready
   - Check `/health/ready` before starting workers

3. **Add dependency validation**
   - Validate startup order
   - Fail fast if dependencies not met

### Phase 2: Circuit Breakers (Medium Priority)

1. **Add circuit breaker middleware**
   - For external API calls
   - For database queries
   - For queue operations

2. **Add degraded mode responses**
   - Cached data fallback
   - Polite error messages
   - Feature flags for degraded mode

### Phase 3: Retry Logic (Medium Priority)

1. **Add retry utilities**
   - Exponential backoff
   - Jitter to avoid thundering herd
   - Max retry caps

2. **Apply to I/O operations**
   - Database queries
   - External API calls
   - Queue operations

### Phase 4: Monitoring & Observability (Low Priority)

1. **Add startup metrics**
   - Time to ready
   - Health check latencies
   - Dependency check results

2. **Add alerts**
   - Startup failures
   - Health check failures
   - Circuit breaker trips

---

## Quick Production Checklist

- [x] Flags/config load first; unknown flag = warn, not crash
- [x] Secrets loader (EnvKeeper) - needs fail-closed validation
- [x] Kernel up with registry + routing + budgets
- [ ] DB migration gated; schema hash verified
- [ ] Queues pinged; DLQs present; visibility timeouts set
- [x] APIs advertise readiness only after dependencies pass
- [ ] Workers start after APIs; safe re-enqueue on crash
- [x] UI exposed last; blue/green or canary by default
- [ ] Retries: exponential backoff + jitter + caps
- [ ] Circuit breakers + timeouts + bulkheads
- [ ] Hot standby for orchestrator; dual queues or DR region

---

## Mapping to DreamNet Architecture

### Current State

**✅ Already Implemented:**
- Config/flags: `server/config/env.ts`
- Secrets: `packages/env-keeper-core`
- Kernel: `server/core/dreamnet-os.ts`
- APIs: Express routes with health checks
- UI: Served by API server

**⚠️ Needs Improvement:**
- DB migration gating
- Worker startup sequencing
- Circuit breakers
- Retry logic
- Dependency graph validation

### Recommended Next Steps

1. **Add health-gated startup sequence** (Phase 1)
2. **Implement circuit breakers** (Phase 2)
3. **Add retry logic** (Phase 3)
4. **Add monitoring** (Phase 4)

---

**This document maps the battle-tested boot sequence to DreamNet's current architecture and provides a clear implementation plan.**

