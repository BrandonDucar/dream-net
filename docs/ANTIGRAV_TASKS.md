# Antigrav Tasks - Reliability System Integration

**Date**: 2025-01-27  
**Purpose**: Tasks for Antigrav to help complete reliability system integration

---

## High Priority Tasks

### 1. Integrate Circuit Breakers into External Calls ✅ DONE
**Status**: Completed
**Files modified**:
- ✅ `packages/latent-collaboration/src/latentSpace.ts` - OpenAI embeddings wrapped
- ✅ `server/core/db-circuit-breaker.ts` - Database wrapper created
- ⏳ `spine/dreamnet-event-bus/` - Queue operations (pending)

**What was done**:
- ✅ OpenAI embeddings API calls wrapped with circuit breaker
- ✅ Database query wrapper created (`executeWithCircuitBreaker`)
- ⏳ Queue operations still need wrapping

**Remaining**: Wrap queue operations in event bus

---

### 2. Add Metrics Collection Middleware ✅ DONE
**Status**: Completed
**File created**: ✅ `server/middleware/metrics.ts`

**What was done**:
- ✅ Request count tracking per endpoint
- ✅ Error count tracking (4xx/5xx) per endpoint
- ✅ Latency tracking (p50, p95, p99) per endpoint
- ✅ In-memory storage with sample limits
- ✅ Integrated into Express middleware chain
- ✅ Exposed via `/api/observability/golden-signals`

**Remaining**: 
- Track active connections
- Integrate with Redis for distributed metrics (optional)

---

### 3. Integrate DAG into Server Startup
**File to modify**: `server/index.ts`

**What to do**:
- Call `initializeReliabilitySystem()` before `initOptionalSubsystems`
- Make it optional (behind `USE_RELIABILITY_SYSTEM=true` flag)
- Keep existing `initOptionalSubsystems` as fallback

**Location**: Around line 2452, before `initOptionalSubsystems` call

**Code**:
```typescript
// Initialize reliability system (if enabled)
if (process.env.USE_RELIABILITY_SYSTEM === 'true') {
  const { initializeReliabilitySystem } = await import('./core/dag-loader');
  await initializeReliabilitySystem().catch((error) => {
    console.warn('[Reliability] Failed to initialize:', error);
  });
}

// Fallback to existing initialization
initOptionalSubsystems(app, server).catch((error) => {
  console.error("[Optional Subsystems] Failed to initialize:", error);
});
```

---

### 4. Add Traffic Shaping Middleware
**File to create**: `server/middleware/traffic-shaping.ts`

**What to do**:
- Check rollout percentage for route
- Route requests based on rollout config
- Record metrics (success, latency)
- Auto-rollback on SLO breach

**Integration**: Add to Express middleware chain in `server/index.ts`

---

### 5. Create Incident Response Script
**File to create**: `scripts/incident-response.ts`

**What to do**:
- CLI commands for common incident actions:
  - `pnpm ops:rollback` - Rollback deployment
  - `pnpm ops:safe-mode` - Enable safe mode
  - `pnpm ops:quarantine-agent <agentId>` - Quarantine agent
  - `pnpm ops:drain-dlq` - Drain dead letter queue
  - `pnpm ops:brownout` - Enable brownout mode

**Commands should**:
- Call API endpoints or set environment variables
- Provide clear feedback
- Support both local and remote (via API)

---

## Medium Priority Tasks

### 6. Enhance Observability Dashboard
**File to create**: `client/src/pages/ops-dashboard.tsx`

**What to do**:
- Display golden signals (traffic, errors, latency, saturation)
- Show circuit breaker status
- Show health gates status
- Show rollout status
- Real-time updates (poll every 5s)

**Design**: Dark theme, cards, charts (use recharts or similar)

---

### 7. Add Queue Depth Monitoring
**Files to modify**:
- `spine/dreamnet-event-bus/` - Track queue depth
- `server/routes/observability.ts` - Expose queue depth

**What to do**:
- Track queue depth per agent/topic
- Expose via `/api/observability/watchdogs`
- Alert if queue depth > threshold

---

### 8. Add AI Call Latency Tracking
**Files to modify**:
- `packages/latent-collaboration/src/latentSpace.ts` - Track OpenAI call latency
- `server/routes/observability.ts` - Expose p99 latency

**What to do**:
- Track latency for each OpenAI API call
- Calculate p99 latency
- Expose via `/api/observability/watchdogs`

---

## Low Priority Tasks

### 9. Create Migration Examples
**File to create**: `migrations/example-migration.ts`

**What to do**:
- Example migration with `up()` and `down()` functions
- Show how to use `registerMigration()`
- Document migration best practices

---

### 10. Add Health Gate Tests
**File to create**: `server/core/__tests__/health-gates.test.ts`

**What to do**:
- Unit tests for health gates
- Test consecutive pass logic
- Test critical vs non-critical gates

---

## Testing Tasks

### 11. Test AWS Deployment
**What to do**:
- Use $100 AWS credits
- Deploy to AWS (S3 + CloudFront + App Runner)
- Verify health checks work
- Test circuit breakers
- Test feature flags
- Document any AWS-specific issues

---

### 12. Load Test Reliability Patterns
**What to do**:
- Use load testing tool (k6, artillery, etc.)
- Test circuit breaker behavior under load
- Test health gates under load
- Verify auto-rollback works
- Document performance impact

---

## Documentation Tasks

### 13. Update ENVIRONMENT_MANIFEST.md
**What to do**:
- Add `USE_RELIABILITY_SYSTEM` flag
- Document circuit breaker env vars
- Document health gate env vars
- Document traffic shaping env vars

---

### 14. Create Quick Start Guide
**File to create**: `docs/RELIABILITY_QUICK_START.md`

**What to do**:
- How to enable reliability system
- How to use feature flags
- How to check health gates
- How to use circuit breakers
- Common operations

---

## Priority Order

1. **Circuit breaker integration** (protects external calls)
2. **Metrics collection** (needed for observability)
3. **DAG integration** (completes Phase 1)
4. **Traffic shaping middleware** (enables gradual rollout)
5. **Incident response script** (makes ops easier)

---

**Note**: All tasks are optional enhancements. The core reliability system is already functional and tested.

