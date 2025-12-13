# Antigrav Prompt - Reliability System Integration

**Date**: 2025-01-27  
**Context**: Complete the integration of the reliability system into DreamNet. Core infrastructure exists, but middleware, scripts, and integrations are missing.

---

## 🎯 Your Mission

Complete the reliability system integration by creating missing middleware, scripts, and integrating existing components into the server. All core infrastructure exists - you need to wire it together.

---

## ✅ What Already Exists (Don't Recreate)

1. **Circuit Breakers** - `server/core/circuit-breaker.ts` ✅
2. **Metrics Middleware** - `server/middleware/metrics.ts` ✅ (registered at line ~371)
3. **Traffic Shaping Core** - `server/core/traffic-shaping.ts` ✅
4. **Health Gates** - `server/core/health-gates.ts` ✅
5. **Observability Routes** - `server/routes/observability.ts` ✅ (NOT registered yet)
6. **DB Circuit Breaker Helper** - `server/core/db-circuit-breaker.ts` ✅
7. **DAG Loader** - `server/core/dag-loader.ts` ✅ (integrated)

---

## 📋 Tasks to Complete (In Order)

### Task 1: Create Traffic Shaping Middleware ⚠️ CRITICAL

**File to create**: `server/middleware/traffic-shaping.ts`

**Requirements**:
- Express middleware that uses `server/core/traffic-shaping.ts`
- Import `shouldRouteToNewVersion` and `recordRequestMetrics` from `../core/traffic-shaping`
- Check rollout percentage per request using `shouldRouteToNewVersion(rolloutName)`
- If blocked, return 503 with helpful message
- Record metrics on response finish (success, latency)
- Use request path as rollout name (or allow override)

**Code Template**:
```typescript
/**
 * Traffic Shaping Middleware
 * 
 * Express middleware for gradual traffic rollout and SLO monitoring.
 * Uses server/core/traffic-shaping.ts for core logic.
 */

import { Request, Response, NextFunction } from 'express';
import { shouldRouteToNewVersion, recordRequestMetrics } from '../core/traffic-shaping';

/**
 * Get rollout name for a route
 * Defaults to route path, but can be overridden per route
 */
function getRolloutName(req: Request): string {
  // Use route-specific config if available
  const routeConfig = (req as any).trafficShapingConfig as { rolloutName?: string } | undefined;
  if (routeConfig?.rolloutName) {
    return routeConfig.rolloutName;
  }
  
  // Default to route path
  return req.path || req.route?.path || 'default';
}

/**
 * Traffic shaping middleware
 * 
 * Checks if request should be routed to new version based on rollout percentage.
 * Records metrics for SLO monitoring and auto-rollback.
 */
export function trafficShapingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const rolloutName = getRolloutName(req);
  const startTime = Date.now();
  
  // Check if should route to new version
  if (!shouldRouteToNewVersion(rolloutName)) {
    // Route to old version (or return 503)
    res.status(503).json({
      error: 'Service in gradual rollout',
      message: 'This endpoint is currently rolling out. Please retry in a moment.',
      rolloutName,
    });
    return;
  }
  
  // Track metrics on response finish
  res.on('finish', () => {
    const latency = Date.now() - startTime;
    const success = res.statusCode < 400;
    recordRequestMetrics(rolloutName, success, latency);
  });
  
  next();
}

/**
 * Optional: Per-route traffic shaping config
 * Use this to set rollout name for specific routes
 */
export function withTrafficShaping(config: { rolloutName: string; enabled?: boolean }) {
  return (req: Request, _res: Response, next: NextFunction) => {
    (req as any).trafficShapingConfig = config;
    next();
  };
}
```

**Integration**: Add to `server/index.ts` at line ~372 (right after metrics middleware):
```typescript
// After metrics middleware (line ~371)
try {
  const { trafficShapingMiddleware } = await import('./middleware/traffic-shaping');
  app.use(trafficShapingMiddleware);
} catch (error: any) {
  console.warn('[TrafficShaping] Could not load traffic shaping middleware:', error.message);
}
```

---

### Task 2: Create Incident Response Script ⚠️ HIGH PRIORITY

**File to create**: `scripts/incident-response.ts`

**Requirements**:
- CLI tool for ops actions
- Commands: `safe-mode`, `rollback`, `quarantine-agent`, `brownout`
- Support both local (env vars/flags) and remote (API calls) modes
- Clear feedback and error handling
- Use `IntegrationFlagsService` for flag management

**Commands to implement**:
```bash
# Safe mode
tsx scripts/incident-response.ts safe-mode enable
tsx scripts/incident-response.ts safe-mode disable

# Rollback (placeholder - would need deployment system)
tsx scripts/incident-response.ts rollback

# Quarantine agent
tsx scripts/incident-response.ts quarantine-agent citadel

# Brownout mode
tsx scripts/incident-response.ts brownout enable "High load detected"
tsx scripts/incident-response.ts brownout disable
```

**Code Template**:
```typescript
#!/usr/bin/env tsx
/**
 * Incident Response Script
 * 
 * CLI tool for common incident response actions.
 * Usage: tsx scripts/incident-response.ts <action> [args...]
 */

import { IntegrationFlagsService } from '../server/services/IntegrationFlagsService';

async function safeMode(action: 'enable' | 'disable') {
  if (action === 'enable') {
    await IntegrationFlagsService.enableEmergencyMode();
    console.log('✅ Safe mode enabled - all tool use disabled');
  } else {
    await IntegrationFlagsService.disableEmergencyMode();
    console.log('✅ Safe mode disabled - normal operations resumed');
  }
}

async function rollback() {
  console.log('⚠️  Rollback not yet implemented - requires deployment system');
  console.log('   To rollback manually:');
  console.log('   1. Revert code changes');
  console.log('   2. Redeploy previous version');
  console.log('   3. Monitor health endpoints');
}

async function quarantineAgent(agentId: string) {
  // Use Control Core to disable agent
  console.log(`⚠️  Quarantine agent "${agentId}" not yet implemented`);
  console.log('   To quarantine manually:');
  console.log(`   1. Set CITADEL_ENABLED=false (if citadel)`);
  console.log(`   2. Or disable agent via Control Core API`);
}

async function brownout(action: 'enable' | 'disable', reason?: string) {
  if (action === 'enable') {
    // Enable brownout mode for brownout-capable flags
    console.log(`✅ Brownout mode enabled${reason ? `: ${reason}` : ''}`);
    console.log('   Expensive features will degrade gracefully');
    // TODO: Set brownout flags via IntegrationFlagsService
  } else {
    console.log('✅ Brownout mode disabled - full features restored');
    // TODO: Clear brownout flags
  }
}

async function main() {
  const action = process.argv[2];
  const args = process.argv.slice(3);

  try {
    switch (action) {
      case 'safe-mode':
        if (!args[0] || !['enable', 'disable'].includes(args[0])) {
          console.error('Usage: tsx scripts/incident-response.ts safe-mode <enable|disable>');
          process.exit(1);
        }
        await safeMode(args[0] as 'enable' | 'disable');
        break;

      case 'rollback':
        await rollback();
        break;

      case 'quarantine-agent':
        if (!args[0]) {
          console.error('Usage: tsx scripts/incident-response.ts quarantine-agent <agentId>');
          process.exit(1);
        }
        await quarantineAgent(args[0]);
        break;

      case 'brownout':
        if (!args[0] || !['enable', 'disable'].includes(args[0])) {
          console.error('Usage: tsx scripts/incident-response.ts brownout <enable|disable> [reason]');
          process.exit(1);
        }
        await brownout(args[0] as 'enable' | 'disable', args[1]);
        break;

      default:
        console.log('Available commands:');
        console.log('  safe-mode <enable|disable>');
        console.log('  rollback');
        console.log('  quarantine-agent <agentId>');
        console.log('  brownout <enable|disable> [reason]');
        process.exit(1);
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
```

---

### Task 3: Integrate Observability Routes ⚠️ HIGH PRIORITY

**File to modify**: `server/index.ts`

**What to do**:
- Import observability router
- Register it at `/api/observability`

**Location**: Around line 2135 (near other route registrations like `/api/health`)

**Code to add**:
```typescript
// Observability routes (reliability system)
try {
  const observabilityRouter = await import('./routes/observability');
  app.use('/api/observability', observabilityRouter.default);
} catch (error: any) {
  console.warn('[Observability] Could not load observability routes:', error.message);
}
```

**Note**: The observability router exports `default`, so use `.default` when importing.

---

### Task 4: Integrate Traffic Shaping Middleware ⚠️ HIGH PRIORITY

**File to modify**: `server/index.ts`

**What to do**:
- Import traffic shaping middleware (created in Task 1)
- Add it to middleware chain right after metrics middleware

**Location**: Around line 371-372 (right after metrics middleware)

**Code to add** (if not already added in Task 1):
```typescript
// Traffic shaping middleware (after metrics)
try {
  const { trafficShapingMiddleware } = await import('./middleware/traffic-shaping');
  app.use(trafficShapingMiddleware);
} catch (error: any) {
  console.warn('[TrafficShaping] Could not load traffic shaping middleware:', error.message);
}
```

---

### Task 5: Create Ops Dashboard ⚠️ MEDIUM PRIORITY

**File to create**: `client/src/pages/ops-dashboard.tsx`

**Requirements**:
- React component displaying reliability system metrics
- Show: Golden signals, Circuit breakers, Health gates, Rollouts
- Real-time updates (poll every 5s)
- Dark theme with cards and charts
- Use existing DreamNet UI patterns

**Data Sources**:
- `/api/observability/golden-signals`
- `/api/observability/circuit-breakers`
- `/api/observability/health-gates`
- `/api/observability/rollouts`

**Code Template**:
```typescript
import { useEffect, useState } from 'react';

interface GoldenSignals {
  traffic: { requestsPerSecond: number; totalRequests: number };
  errors: { rate: number; total: number; status4xx: number; status5xx: number };
  latency: { p50: number; p95: number; p99: number };
  saturation: { activeConnections: number };
}

interface CircuitBreaker {
  name: string;
  state: 'closed' | 'open' | 'half-open';
  failureCount: number;
}

export default function OpsDashboard() {
  const [signals, setSignals] = useState<GoldenSignals | null>(null);
  const [breakers, setBreakers] = useState<CircuitBreaker[]>([]);
  const [healthGates, setHealthGates] = useState<any>(null);
  const [rollouts, setRollouts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [signalsRes, breakersRes, gatesRes, rolloutsRes] = await Promise.all([
          fetch('/api/observability/golden-signals').then(r => r.json()),
          fetch('/api/observability/circuit-breakers').then(r => r.json()),
          fetch('/api/observability/health-gates').then(r => r.json()),
          fetch('/api/observability/rollouts').then(r => r.json()),
        ]);

        setSignals(signalsRes);
        setBreakers(breakersRes.breakers || []);
        setHealthGates(gatesRes);
        setRollouts(rolloutsRes.rollouts || []);
      } catch (error) {
        console.error('Failed to fetch observability data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Operations Dashboard</h1>

      {/* Golden Signals */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm text-gray-400">Traffic</h3>
          <p className="text-2xl font-bold">{signals?.traffic?.requestsPerSecond?.toFixed(1) || 0} req/s</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm text-gray-400">Error Rate</h3>
          <p className="text-2xl font-bold">{(signals?.errors?.rate * 100 || 0).toFixed(2)}%</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm text-gray-400">P99 Latency</h3>
          <p className="text-2xl font-bold">{signals?.latency?.p99?.toFixed(0) || 0}ms</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm text-gray-400">Connections</h3>
          <p className="text-2xl font-bold">{signals?.saturation?.activeConnections || 0}</p>
        </div>
      </div>

      {/* Circuit Breakers */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Circuit Breakers</h2>
        <div className="space-y-2">
          {breakers.map((b) => (
            <div key={b.name} className="flex justify-between">
              <span>{b.name}</span>
              <span className={`px-2 py-1 rounded ${
                b.state === 'closed' ? 'bg-green-600' :
                b.state === 'open' ? 'bg-red-600' :
                'bg-yellow-600'
              }`}>
                {b.state}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Health Gates */}
      {healthGates && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Health Gates</h2>
          <p>Ready: {healthGates.ready ? '✅' : '❌'}</p>
          <p>Critical Ready: {healthGates.criticalReady ? '✅' : '❌'}</p>
        </div>
      )}

      {/* Rollouts */}
      {rollouts.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Active Rollouts</h2>
          {rollouts.map((r: any) => (
            <div key={r.name} className="mb-2">
              <div className="flex justify-between mb-1">
                <span>{r.name}</span>
                <span>{r.status?.percentage || 0}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${r.status?.percentage || 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Integration**: Add route to your routing system (check `client/src/pages/index.tsx` or similar)

---

## ✅ Success Criteria

After completing all tasks:

1. ✅ Traffic shaping middleware created and integrated
2. ✅ Incident response script works for all commands
3. ✅ Observability routes accessible at `/api/observability/*`
4. ✅ Traffic shaping middleware active in middleware chain
5. ✅ Ops dashboard shows real-time metrics (optional but nice)

---

## 🧪 Testing

After completing tasks, test:

1. **Traffic Shaping**: Start a rollout, verify 503 responses when percentage < 100%
2. **Incident Response**: Run `tsx scripts/incident-response.ts safe-mode enable` and verify safe mode activates
3. **Observability**: Visit `/api/observability/golden-signals` and verify JSON response
4. **Ops Dashboard**: Navigate to `/ops-dashboard` and verify metrics display

---

## 📝 Notes

- All core infrastructure exists - you're just wiring it together
- Use existing patterns from `server/index.ts` for middleware registration
- Follow error handling patterns (try/catch with console.warn)
- Keep code consistent with existing DreamNet style
- Test each component as you create it

---

## 🚀 Start Here

Begin with **Task 1** (Traffic Shaping Middleware) - it's the foundation for the others. Then proceed in order: Task 2 → Task 3 → Task 4 → Task 5.

Good luck! 🛡️

