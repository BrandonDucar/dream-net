# Antigrav Next Steps - Reliability System

**Status**: Core system complete, integration tasks remaining

---

## ✅ What's Already Done

1. **Circuit Breakers** - Created and OpenAI integrated
2. **Metrics Collection** - Middleware created and integrated
3. **DAG Integration** - Loader created, integrated into server startup
4. **Traffic Shaping** - Core logic created (`server/core/traffic-shaping.ts`)
5. **Health Gates** - Created and integrated
6. **Feature Flags** - YAML-based with brownout support

---

## 🎯 High Priority Tasks for Antigrav

### 1. Create Traffic Shaping Middleware ⚠️ HIGH PRIORITY
**File to create**: `server/middleware/traffic-shaping.ts`

**What to do**:
- Create Express middleware that uses `server/core/traffic-shaping.ts`
- Check rollout percentage per route
- Route requests based on `shouldRouteToNewVersion()`
- Record metrics via `recordRequestMetrics()`
- Auto-rollback on SLO breach

**Integration**: Add to `server/index.ts` middleware chain (after metrics, before routes)

**Example**:
```typescript
import { shouldRouteToNewVersion, recordRequestMetrics } from '../core/traffic-shaping';

export function trafficShapingMiddleware(req: Request, res: Response, next: NextFunction) {
  const rolloutName = req.path; // or route-specific config
  const startTime = Date.now();
  
  // Check if should route to new version
  if (!shouldRouteToNewVersion(rolloutName)) {
    // Route to old version (or return 503)
    return res.status(503).json({ error: 'Service in rollout, please retry' });
  }
  
  // Track metrics
  res.on('finish', () => {
    const latency = Date.now() - startTime;
    const success = res.statusCode < 400;
    recordRequestMetrics(rolloutName, success, latency);
  });
  
  next();
}
```

---

### 2. Create Incident Response Script ⚠️ HIGH PRIORITY
**File to create**: `scripts/incident-response.ts`

**What to do**:
- CLI tool for ops actions
- Commands: `safe-mode`, `rollback`, `quarantine-agent`, `drain-dlq`, `brownout`
- Support both local (env vars) and remote (API calls)

**Commands needed**:
```bash
tsx scripts/incident-response.ts safe-mode enable
tsx scripts/incident-response.ts rollback
tsx scripts/incident-response.ts quarantine-agent citadel
tsx scripts/incident-response.ts brownout enable "High load"
```

**Implementation**: Use `IntegrationFlagsService` for flags, API calls for remote ops

---

### 3. Integrate DB Circuit Breaker ⚠️ MEDIUM PRIORITY
**Files to modify**: Routes that use `db.execute()` directly

**What to do**:
- Replace direct `db.execute()` calls with `executeWithCircuitBreaker()` from `server/core/db-circuit-breaker.ts`
- Start with high-traffic routes (health checks, common queries)
- Keep health checks using `executeDirect()` (no circuit breaker)

**Files to check**:
- `server/routes/health.ts` - Use `executeDirect()` for health checks
- Other routes - Use `executeWithCircuitBreaker()` for regular queries

---

### 4. Wrap Queue Operations ⚠️ MEDIUM PRIORITY
**Files to modify**: `spine/dreamnet-event-bus/` or event bus usage

**What to do**:
- Wrap event bus publish/subscribe calls with circuit breaker
- Protect against queue failures cascading

**Example**:
```typescript
import { withCircuitBreaker } from '../../server/core/circuit-breaker';

// Wrap publish calls
await withCircuitBreaker('event-bus-publish', async () => {
  return await eventBus.publish(topic, message);
});
```

---

### 5. Create Observability Dashboard ⚠️ LOW PRIORITY
**File to create**: `client/src/pages/ops-dashboard.tsx`

**What to do**:
- React component displaying:
  - Golden signals (traffic, errors, latency, saturation)
  - Circuit breaker status
  - Health gates status
  - Rollout status
- Real-time updates (poll every 5s)
- Dark theme, cards, charts

**Data source**: `/api/observability/*` endpoints

---

## 📋 Quick Wins (Easy Tasks)

### 6. Add Active Connection Tracking
**File to modify**: `server/middleware/metrics.ts`

**What to do**:
- Track active HTTP connections
- Expose via `/api/observability/golden-signals`

### 7. Add Queue Depth Monitoring
**File to modify**: `server/routes/observability.ts`

**What to do**:
- Get queue depth from event bus
- Expose via `/api/observability/watchdogs`

### 8. Add AI Call Latency Tracking
**File to modify**: `packages/latent-collaboration/src/latentSpace.ts`

**What to do**:
- Track latency for each OpenAI API call
- Store in memory, expose via `/api/observability/watchdogs`

---

## 🚀 Recommended Order

1. **Traffic Shaping Middleware** (enables gradual rollout)
2. **Incident Response Script** (makes ops easier)
3. **DB Circuit Breaker Integration** (protects database)
4. **Queue Operations Circuit Breaker** (protects event bus)
5. **Observability Dashboard** (nice to have)

---

## ✅ Success Criteria

- Traffic shaping middleware integrated and tested
- Incident response script works for all commands
- Database queries protected by circuit breaker
- Queue operations protected by circuit breaker
- Dashboard shows real-time metrics

---

**Note**: Core reliability system is functional. These are enhancements to make it production-ready.

