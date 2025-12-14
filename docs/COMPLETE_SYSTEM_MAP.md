# DreamNet Complete System Map & Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Request Flow Architecture](#request-flow-architecture)
3. [Server Initialization Sequence](#server-initialization-sequence)
4. [Middleware Chain Explained](#middleware-chain-explained)
5. [Agent Communication & Collaboration](#agent-communication--collaboration)
6. [Subsystem Architecture](#subsystem-architecture)
7. [Reliability & Resilience](#reliability--resilience)
8. [Why It Works This Way](#why-it-works-this-way)

---

## System Overview

DreamNet is a **biomimetic agent orchestration platform** that enables autonomous AI agents to collaborate, share context, and execute complex workflows. The architecture is designed to be:

- **Resilient**: Circuit breakers, health gates, graceful degradation
- **Observable**: Golden signals, trace IDs, comprehensive metrics
- **Secure**: Tier-based access, rate limiting, kill-switches
- **Scalable**: Dependency DAG, idempotent initialization, traffic shaping
- **Biomimetic**: Inspired by biological systems (neural mesh, lungs, immune system)

### Core Principles

1. **Fail-Safe Defaults**: Server can start without optional subsystems
2. **Progressive Enhancement**: Features enable gradually via feature flags
3. **Non-Blocking Initialization**: Heavy subsystems load asynchronously
4. **Circuit Breaker Pattern**: Protect external dependencies from cascading failures
5. **Idempotent Operations**: Safe to retry initialization and operations

---

## Request Flow Architecture

### Complete Request Journey

```
HTTP Request Arrives
    ↓
[1] Express App (server/index.ts)
    ↓
[2] Body Parsing Middleware (json, urlencoded)
    ↓
[3] Timeout Middleware (30s default)
    ↓
[4] CORS Middleware (configurable origins)
    ↓
[5] Rate Limiting Middleware (per-IP, per-API-key)
    ↓
[6] Trace ID Middleware (generates/reads X-Trace-Id)
    ↓
[7] Metrics Middleware (tracks golden signals)
    ↓
[8] Idempotency Middleware (handles X-Idempotency-Key)
    ↓
[9] Tier Resolver Middleware (resolves access tier)
    ↓
[10] Control Core Middleware (kill-switch, rate limits, feature flags)
    ↓
[11] Auto-SEO Middleware (SEO optimization)
    ↓
[12] Route Handler (actual business logic)
    ↓
[13] Response Sent
```

### Why This Order?

1. **Trace ID First**: Every request needs a trace ID for observability
2. **Metrics Early**: Capture all request metrics, including failures
3. **Idempotency Before Business Logic**: Prevent duplicate operations
4. **Tier Resolution Before Control**: Control Core needs tier info
5. **Control Core Before Routes**: Enforce security and rate limits
6. **SEO Last**: Don't waste cycles on blocked requests

---

## Server Initialization Sequence

### Phase 1: Core Server (Always Runs)

**Location**: `server/index.ts` (lines 1-400)

```typescript
1. Load environment config (server/config/env.ts)
   - Validates NODE_ENV, PORT
   - Loads optional vars (DATABASE_URL, API keys)
   - Sets feature flags (INIT_SUBSYSTEMS, etc.)

2. Create Express app
   - Sets up JSON/URL encoding
   - Configures timeouts
   - Sets up CORS

3. Register health endpoints FIRST
   - GET /health (lightweight, no deps)
   - GET /ready (checks critical deps)
   - WHY: Kubernetes/Docker need these immediately

4. Register middleware chain
   - Trace ID → Metrics → Idempotency → Tier → Control → SEO

5. Register API routes (200+ routes)
   - All routes under /api/*
   - Routes can be clustered (via withCluster())
   - Routes can require ports (via withPort())

6. Setup Vite dev server OR static file serving
   - Dev: Vite middleware for HMR
   - Prod: Static file serving

7. Create HTTP server
   - Listens on PORT (default: 3000)
   - WHY: Server must be listening BEFORE async init

8. Start server listening
   - Server.accept() called
   - Health endpoints immediately available
```

### Phase 2: Optional Subsystems (Non-Blocking)

**Location**: `server/index.ts` (lines 528-2499)

**Trigger**: Runs AFTER server is listening (non-blocking)

```typescript
async function initOptionalSubsystems(app, server) {
  // Only runs if INIT_SUBSYSTEMS=true
  
  // Tier II Subsystems (lightweight)
  - Neural Mesh (N-Mesh)
  - Quantum Anticipation Layer (QAL)
  - Squad Alchemy Engine
  - Wolf-Pack Protocol (WPP)
  - Octopus Executor (8-Arm Runtime)
  - Slug-Time Memory Layer (STM)
  - Star-Bridge Lungs (Cross-Chain)
  - Predator–Scavenger Loop (PSL)
  
  // Tier III Subsystems (moderate)
  - Dream Cortex (Global Intent Engine)
  - Reputation Lattice (Trust Weave)
  - Narrative Field (Story Stream)
  - Identity Grid (Wallet + Agent Identity)
  
  // Tier IV Subsystems (heavy) - only if INIT_HEAVY_SUBSYSTEMS=true
  - Dream Vault (Central Repository)
  - Dream Shop (Marketplace)
  - Field Layer (Global Parameters)
  - DreamBet Core (Games Engine)
  - Zen Garden Core (Ritual Engine)
  - Civic Panel Core (Admin Layer)
  - Dream Tank Core (Incubator)
  - Liquidity Engine (Pool Registry)
  - Social Hub Core (Social Feed)
  - Init & Ritual Core (Onboarding)
  - Economic Engine Core (Rewards)
  - Agent Registry Core (Agent Store)
  - DreamNet OS Core (Status Layer)
}
```

### Phase 3: Reliability System (If Enabled)

**Location**: `server/index.ts` (lines ~1200-1250)

**Trigger**: `USE_RELIABILITY_SYSTEM=true`

```typescript
if (process.env.USE_RELIABILITY_SYSTEM === 'true') {
  const { initializeReliabilitySystem } = await import('./core/dag-loader');
  await initializeReliabilitySystem();
}

// This loads deploy/graph.json → Load service definitions
// 2 StartupDAG → Register services with dependencies
// 3 Health Gates → Register critical service checks
// 4 Migrations → Run idempotent DB migrations
// 5 Queue Init → Initialize message queues
// 6 Health Gate Monitoring → Start periodic checks
```

### Why This Sequence?

1. **Server Listens First**: Health checks must work immediately (K8s requirement)
2. **Heavy Subsystems Async**: Don't block server startup
3. **Reliability System Optional**: Can run without it (graceful degradation)
4. **Dependency DAG**: Ensures services start in correct order
5. **Health Gates**: Prevents traffic until critical services ready

---

## Middleware Chain Explained

### 1. Trace ID Middleware

**File**: `server/middleware/traceId.ts`

**Purpose**: Generate/read `X-Trace-Id` header for request tracing

**How**:
```typescript
- Checks req.headers['x-trace-id']
- If missing, generates UUID
- Attaches to req.traceId
- Adds to response headers
```

**Why**: 
- Every request needs a unique ID for debugging
- Enables distributed tracing
- Links logs, metrics, and errors together

### 2. Metrics Middleware

**File**: `server/middleware/metrics.ts`

**Purpose**: Track golden signals (traffic, errors, latency, saturation)

**How**:
```typescript
- Records request start time
- Tracks endpoint, method, status code
- Calculates p50/p95/p99 latency
- Counts errors
- Exposes via /api/observability/golden-signals
```

**Why**:
- SRE best practice (golden signals)
- Enables alerting on anomalies
- Helps identify performance bottlenecks

### 3. Idempotency Middleware

**File**: `server/middleware/idempotency.ts`

**Purpose**: Prevent duplicate requests via `X-Idempotency-Key`

**How**:
```typescript
- Checks req.headers['x-idempotency-key']
- If present, checks cache for existing response
- If found, returns cached response (409 if duplicate)
- If new, stores response after sending
- TTL: 10 minutes default
```

**Why**:
- Prevents duplicate operations (e.g., double payments)
- Safe retries for network failures
- Idempotent API design (REST best practice)

### 4. Tier Resolver Middleware

**File**: `server/middleware/tierResolver.ts`

**Purpose**: Resolve access tier from API key or wallet address

**How**:
```typescript
- Checks API key (from apiKeyAuth middleware)
- Checks wallet address (from X-Wallet-Address header)
- Looks up tier in database/config
- Defaults to SEED tier if not found
- Attaches tier to req.callerIdentity
```

**Why**:
- Enables tier-based rate limiting
- Enables tier-based feature access
- Biomimetic access levels (SEED → BUILDER → OPERATOR → GOD_VAULT)

### 5. Control Core Middleware

**File**: `server/middleware/control.ts` → `packages/dreamnet-control-core/controlCoreMiddleware.ts`

**Purpose**: Enforce kill-switches, rate limits, feature flags, cluster access

**How**:
```typescript
1. Check global kill-switch
   - If ON → Deny (unless God Vault)
   
2. Check cluster exists
   - If missing → Deny
   
3. Check cluster enabled
   - If disabled → Deny (unless God Vault)
   
4. Check feature flags
   - If required flag missing → Deny
   
5. Check rate limits
   - effectiveLimit = min(tierLimit, clusterLimit)
   - If exceeded → Deny (429)
   
6. Allow → Add rate limit headers → next()
```

**Why**:
- Emergency kill-switch for incidents
- Per-cluster rate limiting
- Tier-based access control
- Feature flag enforcement

### 6. Auto-SEO Middleware

**File**: `server/middleware/auto-seo.ts` (if exists)

**Purpose**: Apply SEO optimizations to responses

**Why**: Improve search engine visibility

---

## Agent Communication & Collaboration

### Latent Collaboration System

**Purpose**: Agents share context via compressed latent representations

**How**:
```typescript
1. Agent A encodes thought to latent vector (OpenAI embeddings)
2. Stores in Neural Mesh (latent_sessions table)
3. Agent B queries Neural Mesh for similar latent vectors
4. Agent B decodes to understand Agent A's context
5. Agents collaborate without direct communication
```

**Why**:
- Reduces communication overhead
- Enables asynchronous collaboration
- Preserves privacy (compressed representations)
- Scalable (vector similarity search)

### Agent Marketplace (X402 Payments)

**Purpose**: Agents buy/sell services from each other

**How**:
```typescript
1. Agent A lists service with X402 price
2. Agent B purchases service
3. X402 Payment Gateway processes payment
4. Service executes
5. Payment settles on-chain (Base/Solana/Polygon)
```

**Why**:
- Enables agent-to-agent economy
- Micropayments for services
- Real-time settlement
- Multi-chain support

### Super Brain + Drive Engine

**Purpose**: Autonomous orchestration layer

**How**:
```typescript
Super Brain:
- Watches all Starbridge events
- Makes autonomous decisions
- Stores decisions in Brain Store
- Executes actions via Action Executor

Drive Engine:
- Calculates "hunger" for each pack
- Calculates "momentum" for each pack
- Generates actions based on drive
- Processes feedback to adjust drive
```

**Why**:
- Enables autonomous agent behavior
- Agents act without human intervention
- Self-optimizing based on outcomes
- Biomimetic motivation system

---

## Subsystem Architecture

### Neural Mesh (N-Mesh)

**Purpose**: Distributed memory and context sharing

**How**:
- Stores latent representations
- Vector similarity search
- Links subsystems via pulse handlers

**Why**: Enables agents to share context asynchronously

### Star Bridge Lungs

**Purpose**: Cross-chain communication

**How**:
- Monitors multiple chains
- Bridges assets/events
- Health metrics for chain status

**Why**: Multi-chain support for DreamNet

### Shield Core

**Purpose**: Security and threat detection

**How**:
- Detects threats (rate limit violations, suspicious patterns)
- Fires spikes (counter-attacks, blocks, rate limits)
- Updates risk profiles
- Emits events to Spine Event Bus

**Why**: Protects DreamNet from attacks

### DreamNet OS Core

**Purpose**: Agent registry and execution

**How**:
- Registers agents (DreamKeeper, DeployKeeper, etc.)
- Loads GPT agents from registry.json
- Runs agents via runAgent()
- Links subsystems via Neural Mesh

**Why**: Central agent orchestration

---

## Reliability & Resilience

### Dependency DAG (Startup DAG)

**File**: `server/core/startup-dag.ts`, `deploy/graph.json`

**Purpose**: Ensure services start in correct order

**How**:
```typescript
1. Load service definitions from deploy/graph.json
2. Build dependency graph
3. Topological sort to determine startup order
4. Initialize services in order
5. Wait for dependencies before starting service
```

**Why**:
- Prevents race conditions
- Ensures dependencies ready before use
- Idempotent initialization (safe to retry)

### Health Gates

**File**: `server/core/health-gates.ts`

**Purpose**: Prevent traffic until critical services ready

**How**:
```typescript
1. Register health checks for critical services
2. Run checks periodically (every 5s)
3. Require N consecutive passes before "ready"
4. /health/ready returns 503 if critical services not ready
```

**Why**:
- Prevents degraded service
- Kubernetes readiness probe integration
- Graceful startup

### Circuit Breakers

**File**: `server/core/circuit-breaker.ts`

**Purpose**: Prevent cascading failures

**How**:
```typescript
States: CLOSED → OPEN → HALF_OPEN

CLOSED: Normal operation
OPEN: Failing, reject requests immediately
HALF_OPEN: Testing if service recovered

Transitions:
- CLOSED → OPEN: After N failures
- OPEN → HALF_OPEN: After timeout
- HALF_OPEN → CLOSED: After M successes
- HALF_OPEN → OPEN: On failure
```

**Why**:
- Fast failure (don't wait for timeouts)
- Protects downstream services
- Allows services to recover

### Feature Flags

**File**: `server/config/feature-flags.yaml`, `server/services/IntegrationFlagsService.ts`

**Purpose**: Dynamic feature control

**How**:
```typescript
- Load flags from YAML or env vars
- Check flags before enabling features
- Support brownout mode (degraded operation)
- Emergency mode (disable all features)
```

**Why**:
- Gradual rollouts
- Emergency kill-switch
- A/B testing
- Graceful degradation

---

## Why It Works This Way

### 1. Why Server Listens Before Subsystems?

**Answer**: Kubernetes/Docker health checks need `/health` immediately. If server waits for subsystems, health checks fail → container restarts → infinite loop.

**Solution**: Server listens first, subsystems initialize async.

### 2. Why Middleware Order Matters?

**Answer**: 
- Trace ID must be first (needed by all other middleware)
- Metrics must be early (capture all requests)
- Control Core must be late (needs tier info from Tier Resolver)

**Solution**: Carefully ordered middleware chain.

### 3. Why Idempotent Initialization?

**Answer**: Cloud Run/K8s can restart containers. If initialization isn't idempotent, second startup fails.

**Solution**: All initialization checks "already initialized" before running.

### 4. Why Circuit Breakers?

**Answer**: External services (OpenAI, Database) can fail. Without circuit breakers, failures cascade → entire system down.

**Solution**: Circuit breakers fail fast, protect downstream services.

### 5. Why Health Gates?

**Answer**: If database isn't ready, all requests fail → degraded service.

**Solution**: Health gates prevent traffic until critical services ready.

### 6. Why Latent Collaboration?

**Answer**: Direct agent-to-agent communication doesn't scale. Agents need to share context without tight coupling.

**Solution**: Latent vectors enable asynchronous context sharing via vector similarity.

### 7. Why Tier-Based Access?

**Answer**: Different users need different access levels. Hard-coding limits doesn't scale.

**Solution**: Tier system enables flexible, biomimetic access control.

### 8. Why Dependency DAG?

**Answer**: Services have dependencies. Starting in wrong order causes failures.

**Solution**: DAG ensures correct startup order, handles circular dependencies.

---

## Key Design Decisions

### 1. Fail-Safe Defaults

**Decision**: Server starts without optional subsystems.

**Why**: Faster startup, easier debugging, graceful degradation.

### 2. Non-Blocking Initialization

**Decision**: Heavy subsystems load asynchronously.

**Why**: Health checks work immediately, faster startup.

### 3. Feature Flags

**Decision**: Features controlled via flags, not code.

**Why**: Gradual rollouts, emergency kill-switch, A/B testing.

### 4. Circuit Breakers

**Decision**: Protect external calls with circuit breakers.

**Why**: Prevent cascading failures, fast failure.

### 5. Health Gates

**Decision**: Prevent traffic until critical services ready.

**Why**: Prevent degraded service, Kubernetes integration.

### 6. Latent Collaboration

**Decision**: Agents share context via latent vectors.

**Why**: Scalable, asynchronous, privacy-preserving.

### 7. Tier-Based Access

**Decision**: Access control via tiers, not hard-coded.

**Why**: Flexible, biomimetic, scalable.

### 8. Dependency DAG

**Decision**: Services start in dependency order.

**Why**: Prevents race conditions, ensures correct startup.

---

## Conclusion

DreamNet's architecture is designed for **production reliability** with **biomimetic inspiration**. Every design decision serves a purpose:

- **Resilience**: Circuit breakers, health gates, graceful degradation
- **Observability**: Trace IDs, metrics, golden signals
- **Security**: Tier-based access, rate limiting, kill-switches
- **Scalability**: Dependency DAG, idempotent initialization, traffic shaping
- **Biomimetic**: Neural mesh, lungs, immune system, drive engine

The system can start without optional subsystems, enabling faster startup and easier debugging. Heavy subsystems load asynchronously, ensuring health checks work immediately. Feature flags enable gradual rollouts and emergency kill-switches. Circuit breakers prevent cascading failures. Health gates prevent degraded service. Latent collaboration enables scalable agent communication.

**This is how and why DreamNet works.**

