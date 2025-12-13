# DreamNet Server Workflow Master Guide

**Complete workflow documentation showing how all systems integrate cohesively**

---

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Initialization Sequence](#initialization-sequence)
3. [Request Flow](#request-flow)
4. [Event Flow](#event-flow)
5. [System Communication Patterns](#system-communication-patterns)
6. [Integration Points](#integration-points)

---

## System Architecture Overview

### Three-Layer Communication Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS REQUEST LAYER                     │
│  (HTTP Requests → Middleware → Route Handlers → Response)   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              FIBER-OPTIC MIDDLEWARE LAYER                    │
│  (Ports → Router → Wormholes → Nerve Fabric)                 │
│  Purpose: High-speed internal packet routing                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  SPINE EVENT BUS LAYER                       │
│  (DreamEventBus → Spine Wrappers → Agents)                   │
│  Purpose: Agent communication and coordination               │
└─────────────────────────────────────────────────────────────┘
```

### Core Systems

1. **Reliability System** - Ensures safe startup and operation
2. **Fiber-Optic Middleware** - Internal packet routing
3. **Spine Event Bus** - Agent communication
4. **Subsystems** - Tier I-IV subsystems (Neural Mesh, DreamState, etc.)
5. **Integration Packages** - 19 external integrations

---

## Initialization Sequence

### Phase 1: Foundation (Synchronous, Critical)

**WHY**: Server must respond to health checks immediately for Cloud Run

**WHAT**:
1. Load environment config (`server/config/env.ts`)
2. Create Express app
3. Register core middleware (trace, metrics, idempotency, tier resolver, control core)
4. Register `/health` endpoint (non-blocking)
5. Create HTTP server
6. **Start listening** (DOES NOT WAIT)

**ORDER MATTERS**: Health endpoint must be registered before server listens

### Phase 2: Reliability System (Async, Non-Blocking)

**WHY**: Ensures services start in correct order and health gates prevent traffic until ready

**WHEN**: Only if `USE_RELIABILITY_SYSTEM=true`

**SEQUENCE**:
```
1. Run Database Migrations (idempotent)
   └─> Ensures schema is up-to-date

2. Initialize Queues (idempotent)
   └─> Creates message queues if they don't exist

3. Load Service Graph (deploy/graph.json)
   └─> Defines service dependencies

4. Register Services with DAG
   └─> Each service registers with StartupDAG

5. Initialize Health Gates
   └─> Registers health checks for critical services

6. Initialize DAG Services (topological sort)
   └─> Services start in dependency order
   └─> Blocks until dependencies ready
   └─> Health checks verify readiness
```

**DEPENDENCIES**:
- Database → Event Bus → Neural Mesh → Latent Collaboration → Runtime Bridge → Agents

### Phase 3: Spine Event Bus (Early, Synchronous)

**WHY**: Agents need event bus for communication

**SEQUENCE**:
```
1. Initialize DreamEventBus
   └─> Creates in-memory event bus
   └─> Available as global.dreamEventBus

2. Initialize Spine Wrappers
   ├─> Shield Core Wrapper (connects to event bus)
   ├─> Browser Agent Wrapper (connects to event bus)
   └─> Deployment Wrapper (connects to event bus)
```

**INTEGRATION**: Wrappers subscribe to event bus channels

### Phase 4: Fiber-Optic Middleware (Conditional)

**WHY**: Provides high-speed internal packet routing

**WHEN**: Only if `INIT_HEAVY_SUBSYSTEMS=true` (currently commented out)

**SEQUENCE**:
```
1. Initialize Port Registry
   └─> Registers default ports (DreamNet Core, Shield Core, etc.)

2. Configure Laser Router
   └─> Sets up routing table
   └─> Registers default routes

3. Configure Event Wormholes
   └─> Sets up teleportation channels

4. Initialize Nerve Fiber Event Fabric
   ├─> Creates Nerve Bus
   ├─> Registers subscribers (Shield Core, Jaggy, DreamScope)
   └─> Connects to Spine Event Bus (via transport)
```

**INTEGRATION POINT**: Nerve Bus can transport events to Spine Event Bus

### Phase 5: Core Subsystems (Conditional)

**WHY**: Provides core functionality (memory, governance, etc.)

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

**DEPENDENCIES**: Tier II → Tier III → Tier IV (each tier depends on previous)

### Phase 6: Heavy Subsystems (Conditional)

**WHY**: Advanced features (governance, discovery, etc.)

**WHEN**: Only if `INIT_HEAVY_SUBSYSTEMS=true`

**SEQUENCE**:
```
├─> Dream State Core (governance)
├─> Directory (entity discovery)
├─> Network Blueprint Bootstrap
└─> Nerve Fiber Event Fabric (if not already initialized)
```

### Phase 7: Integration Packages (Always)

**WHY**: External integrations (LangChain, Lens, etc.)

**SEQUENCE**: All 19 packages initialize in parallel (failures don't block)

### Phase 8: Runtime Systems (Conditional)

**WHY**: Orchestration and cycle management

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

## Request Flow

### Standard HTTP Request

```
1. HTTP Request arrives
   ↓
2. Express App receives
   ↓
3. Middleware Chain (in order):
   ├─> Trace ID Middleware (adds X-Trace-Id)
   ├─> Metrics Middleware (tracks request)
   ├─> Idempotency Middleware (checks X-Idempotency-Key)
   ├─> Tier Resolver Middleware (resolves access tier)
   ├─> Control Core Middleware (enforces cluster access)
   └─> Auto SEO Middleware (applies SEO)
   ↓
4. Route Handler matches
   ↓
5. Handler executes (may use):
   ├─> Database (via circuit breaker)
   ├─> External APIs (via circuit breaker)
   ├─> Fiber-Optic Ports (via router)
   ├─> Event Bus (via spine wrappers)
   └─> Subsystems (via runtime bridge)
   ↓
6. Response sent
   ↓
7. Metrics Middleware records latency/errors
```

### Request Using Fiber-Optic Middleware

```
1. Route Handler creates DreamPacket
   ↓
2. Packet sent to Laser Router
   ↓
3. Router looks up route (fiber:type)
   ↓
4. Router finds target port
   ↓
5. Port handler executes
   ↓
6. Handler needs teleportation:
   ├─> Packet sent through Wormhole
   └─> Wormhole dispatches to target port
   ↓
7. Response packet returned
```

### Request Using Event Bus

```
1. Route Handler publishes event to Spine Event Bus
   ↓
2. Event Bus fans out to subscribers
   ├─> Shield Core Wrapper (if subscribed)
   ├─> Browser Agent Wrapper (if subscribed)
   └─> Other wrappers (if subscribed)
   ↓
3. Wrappers process event
   ↓
4. Wrappers may publish new events
   ↓
5. Response returned to route handler
```

---

## Event Flow

### Spine Event Bus Flow

```
Agent A publishes event
   ↓
DreamEventBus receives
   ↓
Event Bus fans out to subscribers:
   ├─> Shield Core Wrapper → Processes security event
   ├─> Browser Agent Wrapper → Processes browser event
   └─> Other wrappers → Process their events
   ↓
Wrappers may publish new events
   ↓
Cycle continues
```

### Nerve Fabric Flow (if enabled)

```
System publishes NerveEvent
   ↓
Nerve Bus receives
   ↓
Nerve Bus fans out to subscribers:
   ├─> Shield Core Subscriber → Processes security event
   ├─> Jaggy Subscriber → Processes webhook event
   └─> DreamScope Subscriber → Stores for UI
   ↓
Nerve Bus may transport to Spine Event Bus
   ↓
Spine Event Bus processes (see above)
```

### Integration: Nerve ↔ Spine

**HOW**: Nerve Bus can register a transport that sends events to Spine Event Bus

**WHY**: Allows Nerve Fabric events to trigger Spine actions

**WHEN**: Only if both systems are initialized

---

## System Communication Patterns

### Pattern 1: Direct Function Call

**USE**: Simple, synchronous operations

**EXAMPLE**: Route handler calls `getDb()` directly

**PROS**: Fast, simple
**CONS**: Tight coupling

### Pattern 2: Circuit Breaker Wrapper

**USE**: External API calls, database queries

**EXAMPLE**: `withCircuitBreaker('openai', async () => openai.call())`

**PROS**: Resilient, retries, prevents cascading failures
**CONS**: Slight overhead

### Pattern 3: Fiber-Optic Ports

**USE**: Internal subsystem communication

**EXAMPLE**: Route handler creates packet → Router → Port → Handler

**PROS**: Decoupled, high-speed, observable
**CONS**: Requires port registration

### Pattern 4: Event Bus (Spine)

**USE**: Agent communication, async operations

**EXAMPLE**: Agent publishes event → Event Bus → Subscribers

**PROS**: Decoupled, scalable, async
**CONS**: Eventual consistency

### Pattern 5: Nerve Fabric

**USE**: System-wide event routing (if enabled)

**EXAMPLE**: System publishes NerveEvent → Nerve Bus → Subscribers → Transports

**PROS**: Pro-grade event bus, backpressure, priorities
**CONS**: Requires initialization

---

## Integration Points

### Point 1: Reliability System ↔ Subsystems

**HOW**: DAG manages subsystem initialization order

**WHY**: Ensures dependencies are ready before dependent systems start

**CONFIG**: `deploy/graph.json` defines dependencies

### Point 2: Fiber-Optic ↔ Route Handlers

**HOW**: Route handlers create packets and send to router

**WHY**: Decouples route handlers from subsystem internals

**EXAMPLE**: `/api/mesh` route creates packet → Router → Mesh Port

### Point 3: Nerve Fabric ↔ Spine Event Bus

**HOW**: Nerve Bus transport sends events to Spine Event Bus

**WHY**: Allows Nerve events to trigger Spine actions

**STATUS**: Not yet implemented (commented out)

### Point 4: Spine Wrappers ↔ Event Bus

**HOW**: Wrappers subscribe to event bus channels

**WHY**: Allows agents to communicate via events

**EXAMPLE**: Shield Core Wrapper subscribes to `security` channel

### Point 5: Runtime Bridge ↔ Subsystems

**HOW**: Runtime Bridge provides context to subsystems

**WHY**: Centralizes subsystem access

**EXAMPLE**: Orchestrator uses Runtime Bridge context to access DreamVault

### Point 6: Control Core ↔ Feature Flags

**HOW**: Control Core checks feature flags before allowing requests

**WHY**: Enables gradual rollout and emergency controls

**CONFIG**: `server/config/feature-flags.yaml`

### Point 7: Metrics ↔ Observability

**HOW**: Metrics middleware collects data, observability routes expose it

**WHY**: Provides golden signals for monitoring

**ENDPOINTS**: `/api/observability/golden-signals`

---

## Why This Architecture Works

### 1. **Layered Communication**

Each layer has a specific purpose:
- **Express Layer**: HTTP request/response
- **Fiber-Optic Layer**: Internal packet routing
- **Spine Layer**: Agent communication

This separation allows each layer to evolve independently.

### 2. **Dependency Management**

The DAG ensures services start in correct order:
- Database → Event Bus → Neural Mesh → Agents

This prevents initialization failures due to missing dependencies.

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

## Common Workflows

### Workflow 1: Agent Communication

```
Agent A needs to communicate with Agent B
   ↓
Agent A publishes event to Spine Event Bus
   ↓
Event Bus fans out to subscribers
   ↓
Agent B's wrapper receives event
   ↓
Agent B processes event
   ↓
Agent B may publish response event
```

### Workflow 2: Subsystem Access

```
Route handler needs to access DreamVault
   ↓
Route handler calls Runtime Bridge
   ↓
Runtime Bridge provides DreamVault from context
   ↓
Route handler uses DreamVault
```

### Workflow 3: External API Call

```
Route handler needs to call OpenAI API
   ↓
Route handler wraps call in circuit breaker
   ↓
Circuit breaker checks state (CLOSED/OPEN/HALF_OPEN)
   ↓
If CLOSED: Execute with retries
If OPEN: Throw error immediately
If HALF_OPEN: Probe with single attempt
   ↓
On success: Reset failure count
On failure: Increment failure count, may open circuit
```

### Workflow 4: Health Check

```
Cloud Run health check arrives
   ↓
/health endpoint responds immediately
   ↓
Non-blocking DB check (1s timeout)
   ↓
Returns 200 if DB healthy or not configured
Returns 503 if DB configured but unhealthy
```

### Workflow 5: Feature Flag Check

```
Route handler checks feature flag
   ↓
IntegrationFlagsService.isEnabled('feature')
   ↓
Checks:
├─> Emergency mode? → Return false
├─> Flag disabled? → Check brownout
│   ├─> Brownout enabled? → Return true (degraded)
│   └─> Brownout disabled? → Return false
└─> Flag enabled? → Return true
```

---

## How to Extend the System

### Adding a New Route

1. Create route file: `server/routes/my-route.ts`
2. Export router
3. Register in `server/index.ts` BEFORE catch-all routes
4. Use middleware for common concerns (auth, rate limiting)

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
2. Configure options if needed: `{ failureThreshold: 5, resetTimeout: 60000 }`

---

## Troubleshooting Guide

### Server Won't Start

1. Check environment config (must be valid)
2. Check port availability
3. Check logs for initialization errors
4. Try minimal startup (comment out subsystems)

### Routes Not Working

1. Check route registration order (first match wins)
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

### Fiber-Optic Not Working

1. Check ports are registered
2. Check routes are registered
3. Check packet format is correct
4. Check fiber channel names match

---

**Last Updated**: 2025-01-27

