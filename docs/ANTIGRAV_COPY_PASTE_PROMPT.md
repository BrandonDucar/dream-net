# Copy-Paste Prompt for Antigrav

---

**Copy everything below this line and paste it to Antigrav:**

---

You are Antigrav, an AI assistant helping complete the DreamNet reliability system integration. Core infrastructure exists - you need to wire it together.

## Context

The reliability system core is complete:
- ✅ Circuit breakers (`server/core/circuit-breaker.ts`)
- ✅ Metrics middleware (`server/middleware/metrics.ts`) - registered at line ~371
- ✅ Traffic shaping core (`server/core/traffic-shaping.ts`)
- ✅ Health gates (`server/core/health-gates.ts`)
- ✅ Observability routes (`server/routes/observability.ts`) - NOT registered yet
- ✅ DB circuit breaker helper (`server/core/db-circuit-breaker.ts`)

## Your Tasks (Complete in Order)

### Task 1: Create Traffic Shaping Middleware
**File**: `server/middleware/traffic-shaping.ts`

Create Express middleware that:
- Uses `shouldRouteToNewVersion` and `recordRequestMetrics` from `../core/traffic-shaping`
- Checks rollout percentage per request
- Returns 503 if blocked, records metrics on response finish
- Uses request path as rollout name

See `docs/ANTIGRAV_PROMPT.md` Task 1 for full code template.

Then integrate in `server/index.ts` at line ~372 (right after metrics middleware):
```typescript
try {
  const { trafficShapingMiddleware } = await import('./middleware/traffic-shaping');
  app.use(trafficShapingMiddleware);
} catch (error: any) {
  console.warn('[TrafficShaping] Could not load traffic shaping middleware:', error.message);
}
```

### Task 2: Create Incident Response Script
**File**: `scripts/incident-response.ts`

CLI tool with commands:
- `safe-mode <enable|disable>` - Uses `IntegrationFlagsService.enableEmergencyMode()`
- `rollback` - Placeholder (deployment system needed)
- `quarantine-agent <agentId>` - Placeholder (Control Core needed)
- `brownout <enable|disable> [reason]` - Enable/disable brownout mode

See `docs/ANTIGRAV_PROMPT.md` Task 2 for full code template.

### Task 3: Integrate Observability Routes
**File**: `server/index.ts`

Add around line 2135 (near `/api/health` registration):
```typescript
// Observability routes (reliability system)
try {
  const observabilityRouter = await import('./routes/observability');
  app.use('/api/observability', observabilityRouter.default);
} catch (error: any) {
  console.warn('[Observability] Could not load observability routes:', error.message);
}
```

### Task 4: Create Ops Dashboard (Optional)
**File**: `client/src/pages/ops-dashboard.tsx`

React component displaying:
- Golden signals (traffic, errors, latency, saturation)
- Circuit breaker status
- Health gates status
- Rollout status
- Real-time updates (poll every 5s)

See `docs/ANTIGRAV_PROMPT.md` Task 5 for full code template.

## Success Criteria

- [ ] Traffic shaping middleware created and integrated
- [ ] Incident response script works for all commands
- [ ] Observability routes accessible at `/api/observability/*`
- [ ] Ops dashboard shows metrics (optional)

## Reference

Full details with code templates: `docs/ANTIGRAV_PROMPT.md`

Start with Task 1, then proceed in order. Test each component as you create it.

---

**End of prompt for Antigrav**

