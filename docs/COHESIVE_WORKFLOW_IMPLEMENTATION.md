# Cohesive Workflow Implementation Guide

**How all systems integrate cohesively - not just jammed together**

---

## 🎯 Core Principle

**Every system has a purpose and a place. Nothing is random.**

---

## 🏗️ Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────┐
│ LAYER 1: HTTP REQUEST LAYER (Express)                  │
│ Purpose: Handle HTTP requests/responses                 │
│ Components: Routes, Middleware, Handlers               │
└─────────────────────────────────────────────────────────┘
                    ↓ (creates packets/events)
┌─────────────────────────────────────────────────────────┐
│ LAYER 2: FIBER-OPTIC MIDDLEWARE (Internal Routing)     │
│ Purpose: High-speed internal packet routing             │
│ Components: Ports, Router, Wormholes, Nerve Fabric     │
│ Status: ARCHITECTURALLY COMPLETE, DISABLED BY DEFAULT   │
└─────────────────────────────────────────────────────────┘
                    ↓ (transports events)
┌─────────────────────────────────────────────────────────┐
│ LAYER 3: SPINE EVENT BUS (Agent Communication)         │
│ Purpose: Agent communication and coordination          │
│ Components: Event Bus, Wrappers, Agents               │
│ Status: ACTIVE                                          │
└────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Proper Initialization Sequence

### Phase 1: Foundation (Synchronous, Always Runs)

**WHY FIRST**: Server must respond to health checks immediately

**SEQUENCE**:
```
1. Load Environment Config
   └─> Validates NODE_ENV, PORT, DATABASE_URL
   └─> Fails fast if invalid

2. Create Express App
   └─> Sets body limits (10mb)
   └─> Sets timeouts (30s)

3. Register Core Middleware (ORDER MATTERS!)
   ├─> Trace ID (adds X-Trace-Id)
   ├─> Metrics (tracks golden signals)
   ├─> Idempotency (checks X-Idempotency-Key)
   ├─> Tier Resolver (resolves access tier)
   ├─> Control Core (enforces cluster access)
   └─> Auto SEO (applies SEO)

4. Register Health Endpoint
   └─> /health (non-blocking DB check)
   └─> Must respond IMMEDIATELY

5. Create HTTP Server
   └─> Sets up error handlers

6. Start Listening
   └─> DOES NOT WAIT for anything
   └─> Server responds to health checks immediately
```

**CRITICAL**: Health endpoint must be registered BEFORE server listens

### Phase 2: Reliability System (Async, Non-Blocking)

**WHY SECOND**: Ensures safe startup before subsystems

**WHEN**: Only if `USE_RELIABILITY_SYSTEM=true`

**SEQUENCE**:
```
1. Run Migrations (idempotent)
   └─> Ensures schema is up-to-date
   └─> Can be run multiple times safely

2. Initialize Queues (idempotent)
   └─> Creates message queues if they don't exist
   └─> Can be run multiple times safely

3. Load Service Graph (deploy/graph.json)
   └─> Defines service dependencies
   └─> Defines initialization order

4. Register Services with DAG
   └─> Each service registers with StartupDAG
   └─> Includes: id, name, dependencies, init function, health check

5. Initialize Health Gates
   └─> Registers health checks for critical services
   └─> Starts periodic checks (every 5s)

6. Initialize DAG Services (topological sort)
   └─> Services start in dependency order
   └─> Blocks until dependencies ready
   └─> Health checks verify readiness
   └─> Critical services block traffic if not ready
```

**DEPENDENCY ORDER**:
```
database → event-bus → neural-mesh → latent-collaboration → runtime-bridge → citadel
```

### Phase 3: Spine Event Bus (Early, Synchronous)

**WHY THIRD**: Agents need event bus for communication

**SEQUENCE**:
```
1. Initialize DreamEventBus
   └─> Creates in-memory event bus
   └─> Available as global.dreamEventBus
   └─> Supports channels and subscribers

2. Initialize Spine Wrappers
   ├─> Shield Core Wrapper
   │   └─> Subscribes to 'security' channel
   ├─> Browser Agent Wrapper
   │   └─> Subscribes to 'browser' channel
   └─> Deployment Wrapper
       └─> Subscribes to 'deployment' channel
```

**INTEGRATION**: Wrappers subscribe to event bus channels and process events

### Phase 4: Fiber-Optic Middleware (Conditional, Currently Disabled)

**WHY FOURTH**: Provides high-speed internal routing (optional)

**WHEN**: Only if `INIT_HEAVY_SUBSYSTEMS=true` AND uncommented

**SEQUENCE**:
```
1. Initialize Port Registry
   └─> Registers default ports:
       ├─> DreamNet Core Port
       ├─> Shield Core Port
       ├─> Mesh Core Port
       └─> Other system ports

2. Configure Laser Router
   └─> Sets up routing table
   └─> Registers default routes (fiber:type → port)
   └─> Configures fallback routing

3. Configure Event Wormholes
   └─> Sets up teleportation channels
   └─> Registers wormhole endpoints

4. Initialize Nerve Fiber Event Fabric
   ├─> Creates Nerve Bus (pro-grade event bus)
   ├─> Registers subscribers:
   │   ├─> Shield Core Subscriber
   │   ├─> Jaggy Subscriber
   │   └─> DreamScope Subscriber
   └─> Connects to Spine Event Bus (via transport)
```

**INTEGRATION POINT**: Nerve Bus can transport events to Spine Event Bus

**STATUS**: Currently commented out in `server/index.ts` lines 1225-1249

### Phase 5: Core Subsystems (Conditional)

**WHY FIFTH**: Provides core functionality

**WHEN**: Only if `INIT_SUBSYSTEMS=true`

**SEQUENCE** (Tier II → Tier III → Tier IV):
```
Tier II (Memory & Execution):
├─> Neural Mesh (memory system)
├─> Quantum Anticipation Layer
├─> Squad Alchemy Engine
├─> Wolf-Pack Protocol
├─> Octopus Executor
├─> Slug-Time Memory Layer
└─> Predator-Scavenger Loop

Tier III (Intelligence & Identity):
├─> Dream Cortex (global intent)
├─> Reputation Lattice (trust)
├─> Narrative Field (story)
└─> Identity Grid (wallet/agent identity)

Tier IV (Applications):
├─> Dream Vault (repository)
├─> Dream Shop (marketplace)
├─> Field Layer (parameters)
├─> DreamBet Core (games)
├─> Zen Garden Core (rituals)
├─> Civic Panel Core (admin)
├─> Dream Tank Core (incubator)
├─> Liquidity Engine (pools)
├─> Social Hub Core (feed)
├─> Init & Ritual Core (onboarding)
├─> Economic Engine Core (rewards)
└─> Agent Registry Core (agents)
```

**DEPENDENCIES**: Each tier depends on previous tiers

### Phase 6: Heavy Subsystems (Conditional)

**WHY SIXTH**: Advanced features

**WHEN**: Only if `INIT_HEAVY_SUBSYSTEMS=true`

**SEQUENCE**:
```
├─> Dream State Core (governance)
├─> Directory (entity discovery)
├─> Network Blueprint Bootstrap
└─> Nerve Fiber Event Fabric (if not already initialized)
```

### Phase 7: Integration Packages (Always)

**WHY SEVENTH**: External integrations (don't block startup)

**SEQUENCE**: All 19 packages initialize in parallel

**FAILURE HANDLING**: Failures don't block server startup

### Phase 8: Runtime Systems (Conditional)

**WHY EIGHTH**: Orchestration and cycle management

**WHEN**: Only if `INIT_HEAVY_SUBSYSTEMS=true`

**SEQUENCE**:
```
├─> Runtime Bridge Core
│   ├─> Initializes context (DreamVault, DreamShop, NeuralMesh, LatentCollaboration)
│   └─> Starts runtime loop (every 30s)
│
├─> Orchestrator Core
│   ├─> Connects to Citadel, DreamVault, DreamShop, NeuralMesh
│   └─> Starts orchestrator loop (every 60s)
│
└─> DreamNet OS Core
    ├─> Runs heartbeat with all subsystems
    └─> Starts continuous heartbeat (every 30s)
```

---

## 🔗 Integration Points

### Point 1: Routes → Subsystems

**HOW**: Routes call subsystem methods directly or via Runtime Bridge

**PATTERN**:
```typescript
// Route handler
router.get('/api/dream/:id', async (req, res) => {
  // Option 1: Direct call
  const dream = await DreamVault.getItem(req.params.id);
  
  // Option 2: Via Runtime Bridge
  const context = RuntimeBridgeCore.getContext();
  const dream = await context.DreamVault.getItem(req.params.id);
  
  res.json({ ok: true, dream });
});
```

**WHY**: Routes are the entry point, subsystems provide functionality

### Point 2: Routes → Event Bus

**HOW**: Routes publish events to Spine Event Bus

**PATTERN**:
```typescript
// Route handler
router.post('/api/agent/:id/command', async (req, res) => {
  const eventBus = global.dreamEventBus;
  
  // Publish event
  eventBus.publish({
    channel: 'agent-commands',
    type: 'command',
    payload: {
      agentId: req.params.id,
      command: req.body.command,
    },
  });
  
  res.json({ ok: true });
});
```

**WHY**: Events enable async processing and agent communication

### Point 3: Routes → Fiber-Optic Ports (if enabled)

**HOW**: Routes create packets and send to router

**PATTERN**:
```typescript
// Route handler
router.post('/api/mesh/route', async (req, res) => {
  const { createPacket } = await import('@dreamnet/internal-ports');
  const { routePacket } = await import('@dreamnet/internal-router');
  
  // Create packet
  const packet = createPacket('mesh-route', req.body, {
    fiber: 'ALPHA',
  });
  
  // Route packet
  const result = await routePacket(packet);
  
  res.json({ ok: true, result });
});
```

**WHY**: Fiber-optic provides decoupled, high-speed routing

**STATUS**: Currently disabled (commented out)

### Point 4: Event Bus → Agents

**HOW**: Agents subscribe to event bus channels via wrappers

**PATTERN**:
```typescript
// Spine wrapper
class MyAgentWrapper {
  constructor(eventBus) {
    // Subscribe to channel
    eventBus.subscribe('my-channel', (event) => {
      this.handleEvent(event);
    });
  }
  
  handleEvent(event) {
    // Process event
    // May publish new events
  }
}
```

**WHY**: Enables agent communication and coordination

### Point 5: Nerve Fabric → Spine Event Bus (if enabled)

**HOW**: Nerve Bus transport sends events to Spine Event Bus

**PATTERN**:
```typescript
// Nerve Bus transport
const spineTransport = {
  name: 'spine-event-bus',
  send: (nerveEvent) => {
    const eventBus = global.dreamEventBus;
    
    // Convert NerveEvent to SpineEvent
    eventBus.publish({
      channel: nerveEvent.channelId,
      type: nerveEvent.type,
      payload: nerveEvent.payload,
    });
  },
};

// Register transport
NERVE_BUS.registerTransport(spineTransport);
```

**WHY**: Allows Nerve events to trigger Spine actions

**STATUS**: Not yet implemented (commented out)

### Point 6: Reliability System → Subsystems

**HOW**: DAG manages subsystem initialization order

**PATTERN**:
```json
// deploy/graph.json
{
  "services": [
    {
      "id": "neural-mesh",
      "dependencies": ["database"],
      "initModule": "@dreamnet/neural-mesh",
      "initFunction": "init"
    }
  ]
}
```

**WHY**: Ensures dependencies are ready before dependent systems start

### Point 7: Control Core → Feature Flags

**HOW**: Control Core checks feature flags before allowing requests

**PATTERN**:
```typescript
// Control Core middleware
if (!await IntegrationFlagsService.isEnabled('feature')) {
  return res.status(403).json({ error: 'Feature disabled' });
}
```

**WHY**: Enables gradual rollout and emergency controls

---

## 🎯 Why This Architecture Works

### 1. **Separation of Concerns**

Each layer has a specific purpose:
- **Express Layer**: HTTP request/response
- **Fiber-Optic Layer**: Internal packet routing (optional)
- **Spine Layer**: Agent communication

This allows each layer to evolve independently.

### 2. **Dependency Management**

The DAG ensures services start in correct order:
- Database → Event Bus → Neural Mesh → Agents

This prevents initialization failures.

### 3. **Resilience**

Circuit breakers protect external calls:
- Prevents cascading failures
- Exponential backoff retries
- Graceful degradation

### 4. **Observability**

Multiple observability layers:
- Metrics middleware (golden signals)
- Health gates (service readiness)
- Circuit breakers (failure states)
- Event bus (event flow)

### 5. **Flexibility**

Feature flags enable gradual rollout:
- Can enable/disable features without code changes
- Brownout mode for graceful degradation
- Emergency controls for incidents

---

## 🔧 How to Extend the System

### Adding a New Route

1. Create route file: `server/routes/my-route.ts`
2. Export router
3. Register in `server/index.ts` BEFORE catch-all routes
4. Use middleware for common concerns

### Adding a New Subsystem

1. Add to `deploy/graph.json` with dependencies
2. Create init function
3. Create health check function
4. Register with DAG
5. Initialize in `initOptionalSubsystems` (if heavy)

### Adding a New Port

1. Create port: `createPort(id, label, direction, fiber, handler)`
2. Register port: `registerPort(port)`
3. Register route: `registerRoute({ key: { fiber, type }, target: { portId } })`
4. Use in route handler: `routePacket(packet)`

### Adding a New Event Bus Subscriber

1. Create wrapper: `new MyWrapper(eventBus)`
2. Subscribe to channels: `eventBus.subscribe('channel', handler)`
3. Initialize in `server/index.ts` (Spine Wrappers section)

### Adding Circuit Breaker Protection

1. Wrap external call: `withCircuitBreaker('service-name', async () => call())`
2. Configure options if needed

---

## 🚨 Common Mistakes to Avoid

### ❌ DON'T

1. **Don't block** the health endpoint
2. **Don't initialize** heavy subsystems synchronously
3. **Don't modify** middleware order without testing
4. **Don't remove** error handlers
5. **Don't hardcode** API keys or secrets
6. **Don't skip** dependency management in graph.json
7. **Don't ignore** health gates

### ✅ DO

1. **Do test** health endpoint after changes
2. **Do add** error handling to new routes
3. **Do use** circuit breakers for external calls
4. **Do check** feature flags before enabling features
5. **Do update** graph.json when adding subsystems
6. **Do document** dependencies in service definitions
7. **Do respect** initialization order

---

## 📊 System Health Indicators

### Health Gates

Check: `/api/observability/health-gates`

**Critical services must be ready**:
- Database (if configured)
- Startup DAG (if reliability system enabled)

### Circuit Breakers

Check: `/api/observability/circuit-breakers`

**States**:
- CLOSED: Normal operation
- OPEN: Too many failures, blocking requests
- HALF_OPEN: Probing for recovery

### Golden Signals

Check: `/api/observability/golden-signals`

**Metrics**:
- Traffic: Requests per second
- Errors: Error rate, 4xx, 5xx
- Latency: p50, p95, p99
- Saturation: CPU, memory, queue depth

### Feature Flags

Check: `IntegrationFlagsService.getAllFlags()`

**States**:
- Enabled: Feature active
- Disabled: Feature inactive
- Brownout: Feature degraded

---

## 🎓 Understanding the Flow

### Request Flow

```
HTTP Request
    ↓
Express App
    ↓
Middleware Chain
    ↓
Route Handler
    ├─> Direct subsystem call
    ├─> Event bus publish
    ├─> Fiber-optic packet (if enabled)
    └─> External API call (via circuit breaker)
    ↓
Response
```

### Event Flow

```
Route Handler publishes event
    ↓
Spine Event Bus
    fans out to subscribers

Spine Wrappers
    Nerve Fabric (if enabled)
    process events        ↓
Agents
    process events
    may publish new events
```

---

**Subsystem Flow**

```
DAG Initialization
    loads graph
    sorts dependencies
    initializes in order

Services
    ↓
Services
    register
```

checks verify readiness
    ↓
Health Gates
    check readiness
    block traffic if critical services
    ↓
Traffic Allowed
    (if critical services ready)
```

---

## 🔍 Debugging Guide

### Server Won't Start

1. Check environment config: `server/config/env.ts`
2. Check port availability
3. Check logs for initialization errors
4. Try minimal startup (comment out subsystems)

### Routes Not Working

1. Check route registration order
2. Check middleware isn't blocking
3. Check feature flags
4. Check logs for route handler errors

### Subsystem Not Initializing

1. Check `INIT_SUBSYSTEMS` or `INIT_HEAVY_SUBSYSTEMS` env var
2. Check `deploy/graph.json` for service definition
3. Check dependencies are ready
4. Check logs for initialization errors

### Event Bus Not Working

1. Check `global.dreamEventBus` exists
2. Check wrappers are initialized
3. Check subscribers are registered
4. Check event channel names match

---

**Last Updated**: 2025-01-27

