# Fiber-Optic Middleware Activation Plan

**Date**: 2025-01-27  
**Based on**: `docs/FIBER_OPTIC_MIDDLEWARE_AUDIT.md`

---

## Current State Summary

✅ **What Works**:
- Port system fully functional (11 ports registered)
- Laser Router fully functional (8 routes registered)
- Event Wormholes fully functional (6 wormholes registered)
- Nerve Bus fully functional (events can be published)

❌ **What's Disabled**:
- Nerve Fabric initialization (commented out)
- Express middleware integration (doesn't exist)
- Port handlers wired to subsystems (placeholders only)

⚠️ **What's Inconsistent**:
- Some routes use wormholes, others don't
- Events published but subscribers not registered

---

## Activation Steps

### Step 1: Enable Nerve Fabric (IMMEDIATE - 5 minutes)

**File**: `server/index.ts` lines 1225-1249

**Action**: Uncomment the Nerve Fabric initialization block

**Before**:
```typescript
// Initialize Nerve Fiber Event Fabric 🧠
// DISABLED FOR SIMPLIFIED STARTUP - Enable when ready
/*
try {
  const { initNerveFabric } = await import("@dreamnet/nerve/init");
  const { NERVE_BUS } = await import("@dreamnet/nerve/bus");
  
  // Initialize fabric and register subscribers
  const { dreamScope } = initNerveFabric();
  
  // Store dreamScope for API endpoint access
  (global as any).dreamScopeNerve = dreamScope;
  
  // Log stats
  const stats = NERVE_BUS.getStats();
  console.log(`🧠 [Nerve Fabric] Event bus online`);
  console.log(`   ✅ Shield Core subscribed`);
  console.log(`   ✅ Jaggy subscribed`);
  console.log(`   ✅ DreamScope subscribed`);
  console.log(`   📡 Nerve Fiber Event Fabric active - events routing through channels`);
  console.log(`   📊 Stats: ${stats.published} published, ${stats.dropped} dropped, queue: ${stats.queueSize}`);
} catch (error) {
  console.warn("[Nerve Fabric] Initialization warning:", error);
}
*/
```

**After**:
```typescript
// Initialize Nerve Fiber Event Fabric 🧠
try {
  const { initNerveFabric } = await import("@dreamnet/nerve/init");
  const { NERVE_BUS } = await import("@dreamnet/nerve/bus");
  
  // Initialize fabric and register subscribers
  const { dreamScope } = initNerveFabric();
  
  // Store dreamScope for API endpoint access
  (global as any).dreamScopeNerve = dreamScope;
  
  // Log stats
  const stats = NERVE_BUS.getStats();
  console.log(`🧠 [Nerve Fabric] Event bus online`);
  console.log(`   ✅ Shield Core subscribed`);
  console.log(`   ✅ Jaggy subscribed`);
  console.log(`   ✅ DreamScope subscribed`);
  console.log(`   📡 Nerve Fiber Event Fabric active - events routing through channels`);
  console.log(`   📊 Stats: ${stats.published} published, ${stats.dropped} dropped, queue: ${stats.queueSize}`);
} catch (error) {
  console.warn("[Nerve Fabric] Initialization warning:", error);
}
```

**Impact**:
- Shield Core subscriber will start processing shield events
- Jaggy subscriber will start monitoring all events
- DreamScope subscriber will start buffering events
- `/api/nerve/recent-events` will return actual data
- `/api/nerve/metrics` will show event statistics

**Testing**:
```bash
# After server restart, check logs for:
# 🧠 [Nerve Fabric] Event bus online
# ✅ Shield Core subscribed
# ✅ Jaggy subscribed
# ✅ DreamScope subscribed

# Test API endpoint:
curl http://localhost:3000/api/nerve/stats
curl http://localhost:3000/api/nerve/recent-events
```

---

### Step 2: Create Express Middleware (SHORT-TERM - 2-4 hours)

**File**: `server/middleware/fiber-optic-router.ts` (new)

**Purpose**: Bridge HTTP requests to fiber-optic packet system

**Design Options**:

#### Option A: Opt-In Middleware (Recommended)

Only specific routes use fiber-optic routing. Others work normally.

```typescript
/**
 * Fiber-Optic Router Middleware
 * 
 * Routes HTTP requests through the fiber-optic packet system.
 * Use this middleware on routes that should go through ports.
 */

import { Request, Response, NextFunction } from 'express';
import { createPacket } from '@dreamnet/internal-ports';
import { routePacket, FIBERS } from '@dreamnet/internal-router';

interface FiberOpticConfig {
  fiber?: string;
  packetType: string;
  enabled?: boolean;
}

export function fiberOpticRouter(config: FiberOpticConfig) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (config.enabled === false) {
      return next(); // Skip fiber-optic routing
    }

    try {
      // Create packet from request
      const packet = createPacket(config.packetType, {
        method: req.method,
        path: req.path,
        query: req.query,
        body: req.body,
        headers: req.headers,
      }, {
        fiber: config.fiber || FIBERS.ALPHA,
        traceId: (req as any).traceId,
      });

      // Route packet
      const result = await routePacket(packet, { 
        fiber: config.fiber || FIBERS.ALPHA 
      });

      // If handler returned a response, send it
      if (result && typeof result === 'object') {
        if (result.ok === false) {
          return res.status(500).json(result);
        }
        if (result.statusCode) {
          return res.status(result.statusCode).json(result.body || result);
        }
        return res.json(result);
      }

      // Otherwise continue to next middleware/route handler
      next();
    } catch (error: any) {
      console.error('[FiberOpticRouter] Error:', error);
      return res.status(500).json({
        ok: false,
        error: 'Fiber-optic routing failed',
        message: error.message
      });
    }
  };
}
```

**Usage**:
```typescript
// In route file
import { fiberOpticRouter } from '../middleware/fiber-optic-router';
import { FIBERS } from '@dreamnet/internal-ports';

router.post('/dreams', 
  fiberOpticRouter({ 
    fiber: FIBERS.ALPHA, 
    packetType: 'dream.created' 
  }),
  async (req, res) => {
    // This handler only runs if fiber-optic routing doesn't return early
    // ...
  }
);
```

#### Option B: Global Middleware (Advanced)

All routes go through fiber-optic system. Requires route-to-packet-type mapping.

**Not Recommended** - Too invasive, breaks existing routes.

---

### Step 3: Wire Port Handlers (LONG-TERM - Days/Weeks)

**File**: `packages/internal-ports/src/index.ts` (modify `registerDefaultPorts()`)

**Action**: Replace placeholder handlers with actual subsystem calls

**Example - DreamNet Core Port**:

```typescript
// Current placeholder
registerPort(createPort(
  PORT_IDS.DREAMNET_CORE,
  'DreamNet Core',
  'bidirectional',
  FIBERS.ALPHA,
  defaultHandler // Just logs
));

// Target implementation
registerPort(createPort(
  PORT_IDS.DREAMNET_CORE,
  'DreamNet Core',
  'bidirectional',
  FIBERS.ALPHA,
  async (packet: DreamPacket) => {
    switch (packet.type) {
      case 'dream.created':
        // Call actual DreamNet Core subsystem
        const { createDream } = await import('../../server/lib/saveDreamCore');
        return await createDream(packet.payload);
      
      case 'dream.updated':
        // Call update function
        return { ok: true };
      
      default:
        console.warn(`[DreamNet Core] Unknown packet type: ${packet.type}`);
        return { ok: false, reason: `Unknown packet type: ${packet.type}` };
    }
  }
));
```

**Required Knowledge**:
- Each subsystem's API
- Which packet types map to which functions
- Error handling patterns

**Risk**: High - requires deep understanding of each subsystem

---

### Step 4: Standardize Event Emission (SHORT-TERM - 1-2 hours)

**File**: `server/middleware/event-emitter.ts` (new)

**Purpose**: Automatically emit events for all routes

```typescript
/**
 * Event Emitter Middleware
 * 
 * Automatically emits events to Nerve Bus and Wormholes for all routes.
 */

import { Request, Response, NextFunction } from 'express';
import { NERVE_BUS } from '@dreamnet/nerve/src/bus';
import { sendThroughWormhole } from '@dreamnet/event-wormholes';
import { createPacket } from '@dreamnet/internal-ports';
import { randomUUID } from 'crypto';

export function eventEmitterMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const traceId = (req as any).traceId || randomUUID();

  // Emit request start event
  NERVE_BUS.publish({
    id: randomUUID(),
    channelId: 'HTTP_REQUEST',
    kind: 'REQUEST_START',
    priority: 2,
    payload: {
      method: req.method,
      path: req.path,
      query: req.query,
    },
    context: {
      traceId,
      sampled: Math.random() < 0.1, // 10% sample rate
    },
  });

  // Track response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // Emit request complete event
    NERVE_BUS.publish({
      id: randomUUID(),
      channelId: 'HTTP_REQUEST',
      kind: 'REQUEST_COMPLETE',
      priority: res.statusCode >= 500 ? 4 : 2,
      payload: {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
      },
      context: {
        traceId,
        sampled: Math.random() < 0.1,
      },
    });

    // Emit to wormhole if error
    if (res.statusCode >= 400) {
      const packet = createPacket('api.endpoint.failed', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
      });
      sendThroughWormhole('WH-CORE-OMEGA', packet).catch(console.error);
    }
  });

  next();
}
```

**Integration**: Add to middleware chain in `server/index.ts`:
```typescript
import { eventEmitterMiddleware } from './middleware/event-emitter';
app.use(eventEmitterMiddleware);
```

---

## Testing Strategy

### After Step 1 (Nerve Fabric)

```bash
# 1. Start server
pnpm start

# 2. Check logs for initialization
# Should see:
# 🧠 [Nerve Fabric] Event bus online
# ✅ Shield Core subscribed
# ✅ Jaggy subscribed
# ✅ DreamScope subscribed

# 3. Make some requests
curl http://localhost:3000/api/health
curl http://localhost:3000/api/dreams

# 4. Check Nerve stats
curl http://localhost:3000/api/nerve/stats
# Should show published events > 0

# 5. Check recent events
curl http://localhost:3000/api/nerve/recent-events
# Should return array of events
```

### After Step 2 (Express Middleware)

```bash
# 1. Add middleware to a test route
# 2. Make request to that route
# 3. Verify packet is routed through Laser Router
# 4. Check port handler is called
# 5. Verify response is returned
```

### After Step 4 (Event Emission)

```bash
# 1. Make requests to various routes
# 2. Check Nerve Bus stats - should see events for all requests
# 3. Check wormhole buffers - should see failed requests buffered
# 4. Verify DreamScope dashboard shows events
```

---

## Risk Assessment

| Step | Risk Level | Impact | Mitigation |
|------|------------|--------|------------|
| Step 1: Enable Nerve Fabric | Low | High (positive) | Subscribers are safe, only log/collect |
| Step 2: Express Middleware | Medium | High | Opt-in approach, doesn't break existing routes |
| Step 3: Wire Handlers | High | High | Requires subsystem knowledge, test thoroughly |
| Step 4: Event Emission | Low | Medium | Additive only, doesn't change behavior |

---

## Success Criteria

### Step 1 Complete When:
- ✅ Nerve Fabric initialization uncommented
- ✅ Server starts without errors
- ✅ Logs show subscribers registered
- ✅ `/api/nerve/stats` shows events being published
- ✅ `/api/nerve/recent-events` returns event data

### Step 2 Complete When:
- ✅ Middleware created and tested
- ✅ At least one route uses fiber-optic routing
- ✅ Packet flows through Laser Router
- ✅ Port handler executes
- ✅ Response returned correctly

### Step 3 Complete When:
- ✅ All port handlers wired to subsystems
- ✅ Packets trigger actual subsystem functions
- ✅ Error handling works
- ✅ Tests pass

### Step 4 Complete When:
- ✅ All routes emit events automatically
- ✅ Nerve Bus shows events for all requests
- ✅ Failed requests buffered in wormholes
- ✅ DreamScope dashboard shows complete event history

---

## Next Steps

1. **Immediate**: Enable Nerve Fabric (Step 1) - 5 minutes
2. **This Week**: Create Express middleware (Step 2) - 2-4 hours
3. **This Week**: Standardize event emission (Step 4) - 1-2 hours
4. **Future**: Wire port handlers (Step 3) - Ongoing, per subsystem

---

## Questions to Answer

1. **Should ALL routes go through fiber-optic system?**
   - Recommendation: Opt-in approach (Option A)
   - Some routes may need direct Express handling
   - Migration can be gradual

2. **How should errors be handled?**
   - Recommendation: Port handlers return error objects
   - Middleware converts to HTTP status codes
   - Logging via Nerve Bus

3. **What about performance?**
   - Recommendation: Measure overhead
   - Consider async processing for non-critical events
   - Use sampling for high-volume routes

4. **How to test?**
   - Recommendation: Start with test routes
   - Verify packet flow end-to-end
   - Monitor metrics and logs

