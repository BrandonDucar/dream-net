# DreamNet Server Blueprint

**Complete architectural documentation for the DreamNet server - your guide to understanding and modifying the system without breaking it.**

---

## Table of Contents

1. [Server Initialization Flow](#server-initialization-flow)
2. [Request Flow & Middleware Chain](#request-flow--middleware-chain)
3. [Subsystem Architecture](#subsystem-architecture)
4. [Reliability System](#reliability-system)
5. [Critical Paths & Failure Points](#critical-paths--failure-points)
6. [File Structure Map](#file-structure-map)
7. [Environment Variables](#environment-variables)
8. [Common Modification Patterns](#common-modification-patterns)

---

## Server Initialization Flow

### Phase 1: Immediate Setup (Synchronous)

**Location**: `server/index.ts` lines 1-400

1. **Environment Config** (`server/config/env.ts`)
   - Loads and validates `NODE_ENV`, `PORT`, `DATABASE_URL`
   - Sets defaults: PORT=3000, NODE_ENV=development
   - **CRITICAL**: Fails fast if invalid

2. **Express App Creation** (line 178)
   - Creates Express app instance
   - Sets body size limits (10mb)
   - Configures request timeouts (30s)

3. **CORS & Rate Limiting** (lines 192-252)
   - CORS: Allows origins from `ALLOWED_ORIGINS` env var
   - Rate limiting: 100 requests per 15 minutes per IP
   - **CRITICAL**: `/health` endpoint bypasses rate limiting

4. **Health Endpoint** (line 287)
   - `/health` - Must respond IMMEDIATELY for Cloud Run
   - Non-blocking DB check (1s timeout)
   - Returns 200 if DB not configured (optional)

### Phase 2: Middleware Registration (Synchronous)

**Location**: `server/index.ts` lines 364-396

**Order matters!** Middleware executes in registration order:

1. **Trace ID** (`traceIdMiddleware`)
   - Adds `X-Trace-Id` to all requests
   - Used for distributed tracing

2. **Metrics** (`metricsMiddleware`)
   - Tracks golden signals: traffic, errors, latency
   - Stores in-memory (per endpoint)

3. **Idempotency** (`idempotencyMiddleware`)
   - Handles `X-Idempotency-Key` header
   - Prevents duplicate requests

4. **Tier Resolver** (`tierResolverMiddleware`)
   - Resolves access tier from API key or wallet
   - Includes God Vault detection

5. **Control Core** (`controlCoreMiddleware`)
   - Enforces cluster-level access
   - Rate limits and feature flags
   - Only acts on routes with `clusterId`

6. **Auto SEO** (`autoSEORequestMiddleware`)
   - Applies SEO optimization globally

### Phase 3: Route Registration (Synchronous)

**Location**: `server/index.ts` lines 397-2240

Routes registered in order - **first match wins**:

- `/api/mesh` - Mesh router
- `/api/graft` - Graft router
- `/api` - Agent router (catch-all for many routes)
- `/api/dream` - Dream CRUD operations
- `/api/brain` - Super Brain API
- `/api/citadel` - Citadel agent
- `/api/health` - Health checks
- `/api/observability` - Golden signals, health gates
- ... (237 route files total)

### Phase 4: HTTP Server Creation (Synchronous)

**Location**: `server/index.ts` lines 2272-2370

**CRITICAL FOR CLOUD RUN**: Server must listen IMMEDIATELY

1. Create HTTP server (line 2280)
2. Add error handlers (lines 2343-2365)
3. **Start listening** (line 2370) - **DOES NOT WAIT**
4. Server responds to health checks immediately

### Phase 5: Async Initialization (Non-Blocking)

**Location**: `server/index.ts` lines 2374-2477

These run AFTER server is listening:

1. **Routes Registration** (lines 2375-2387)
   - Loads `server/routes/index.ts`
   - Registers additional routes

2. **Vite Setup** (lines 2389-2407)
   - Development: Hot module reload
   - Production: Static file serving
   - **Failure doesn't crash server**

3. **Reliability System** (lines 2460-2470)
   - Only if `USE_RELIABILITY_SYSTEM=true`
   - Loads `deploy/graph.json`
   - Initializes DAG, health gates, migrations

4. **Optional Subsystems** (line 2474)
   - Only if `INIT_SUBSYSTEMS=true`
   - Heavy subsystems (Neural Mesh, DreamState, etc.)
   - **Failure doesn't crash server**

---

## Request Flow & Middleware Chain

### Request Journey

```
HTTP Request
    ↓
Express App
    ↓
[1] Trace ID Middleware → Adds X-Trace-Id
    ↓
[2] Metrics Middleware → Tracks request metrics
    ↓
[3] Idempotency Middleware → Checks X-Idempotency-Key
    ↓
[4] Tier Resolver → Resolves access tier
    ↓
[5] Control Core → Enforces cluster access/rate limits
    ↓
[6] Auto SEO → Applies SEO optimization
    ↓
Route Handler (first matching route)
    ↓
Response
    ↓
[2] Metrics Middleware → Records latency/errors
```

### Critical Middleware Details

**Trace ID** (`server/middleware/traceId.ts`)
- Generates UUID for each request
- Available as `req.traceId`
- Used in error logging

**Metrics** (`server/middleware/metrics.ts`)
- Tracks per-endpoint metrics
- Calculates p50/p95/p99 latency
- Exposed via `/api/observability/golden-signals`

**Idempotency** (`server/middleware/idempotency.ts`)
- Stores idempotency keys in-memory (Map)
- Returns cached response for duplicate keys
- **TODO**: Should use Redis for production

**Tier Resolver** (`server/middleware/tierResolver.ts`)
- Checks `x-dreamnet-api-key` header
- Checks `x-wallet-address` header
- Resolves to tier: `free`, `pro`, `enterprise`, `god`
- Attaches `req.tier` to request

**Control Core** (`packages/dreamnet-control-core/controlCoreMiddleware.ts`)
- Only acts on routes with `clusterId`
- Checks feature flags
- Enforces rate limits per cluster
- **Routes without clusterId pass through**

---

## Subsystem Architecture

### Core Subsystems (Always Active)

1. **Database** (`server/db.ts`)
   - Supports: Netlify Neon, Neon Serverless, Standard Postgres
   - Auto-detects connection type
   - Can start without DB (degraded mode)

2. **Event Bus** (`spine/dreamnet-event-bus/DreamEventBus.ts`)
   - In-memory event bus
   - Used for agent communication
   - Available as `global.dreamEventBus`

3. **Spine Wrappers**
   - Shield Core Wrapper
   - Browser Agent Wrapper
   - Deployment Wrapper
   - Connected to Event Bus

### Optional Subsystems (INIT_SUBSYSTEMS=true)

**Tier II Subsystems**:
- Neural Mesh (memory system)
- Quantum Anticipation Layer
- Squad Alchemy Engine
- Wolf-Pack Protocol
- Octopus Executor (8-arm runtime)
- Slug-Time Memory Layer
- Predator-Scavenger Loop

**Tier III Subsystems**:
- Dream Cortex (global intent engine)
- Reputation Lattice (trust weave)
- Narrative Field (story stream)
- Identity Grid (wallet/agent identity)

**Tier IV Subsystems**:
- Dream Vault (central repository)
- Dream Shop (marketplace)
- Field Layer (parameter fields)
- DreamBet Core (games engine)
- Zen Garden Core (ritual engine)
- Civic Panel Core (admin layer)
- Dream Tank Core (incubator)
- Liquidity Engine (pool registry)
- Social Hub Core (feed layer)
- Init & Ritual Core (onboarding)
- Economic Engine Core (rewards)
- Agent Registry Core (agent store)

### Heavy Subsystems (INIT_HEAVY_SUBSYSTEMS=true)

- Dream State Core (governance)
- Directory (entity discovery)
- Nerve Fiber Event Fabric (commented out)
- Network Blueprint Bootstrap (commented out)

### Integration Packages (19 total)

**Agent Foundry** (3):
- LangChain Bridge
- CrewAI Orchestrator
- SuperAGI Marketplace

**Crypto Social** (2):
- Lens Protocol Client
- Farcaster Client

**OTT Streaming** (2):
- Jellyfin Media Server
- PeerTube Client

**Science** (2):
- ResearchHub Client
- DeSci Protocols

**Travel** (2):
- OpenTripPlanner Client
- Valhalla Router

**Military** (2):
- Ghidra Security Analyzer
- Metasploit Framework

**Government** (2):
- Aragon Governance Client
- Snapshot Voting

**Music** (2):
- MusicGen Client
- MusicLM Client

**Pods** (2):
- Matrix Federation Client
- Rocket.Chat Client

---

## Reliability System

### Components

**Location**: `server/core/`

1. **Startup DAG** (`startup-dag.ts`)
   - Manages service dependencies
   - Topological sort for initialization order
   - Blocks until dependencies ready

2. **Health Gates** (`health-gates.ts`)
   - Tracks service readiness
   - Requires X consecutive passes
   - Blocks traffic if critical services fail

3. **Circuit Breakers** (`circuit-breaker.ts`)
   - Protects external API calls
   - Exponential backoff retries
   - States: CLOSED, OPEN, HALF_OPEN

4. **Traffic Shaping** (`traffic-shaping.ts`)
   - Gradual rollout support
   - SLO monitoring
   - Auto-rollback on breach

5. **Metrics Collection** (`middleware/metrics.ts`)
   - Golden signals: traffic, errors, latency, saturation
   - Per-endpoint tracking
   - Exposed via `/api/observability/golden-signals`

6. **Feature Flags** (`services/IntegrationFlagsService.ts`)
   - Loads from `server/config/feature-flags.yaml`
   - Supports brownout mode (graceful degradation)
   - Emergency mode support

### Configuration

**Service Graph**: `deploy/graph.json`
- Defines services and dependencies
- Conditional initialization via env vars
- Critical vs non-critical services

**Feature Flags**: `server/config/feature-flags.yaml`
- Feature enable/disable
- Brownout configuration
- Owner and description

### Activation

Set in `.env`:
```
USE_RELIABILITY_SYSTEM=true
```

Initialization happens AFTER server starts listening (non-blocking).

---

## Critical Paths & Failure Points

### Critical Path 1: Server Startup

**Path**: Environment → Express → Middleware → Routes → Listen

**Failure Points**:
1. Invalid environment config → **Server won't start**
2. Port already in use → **Server exits**
3. Middleware throws → **Request fails**
4. Route handler throws → **500 error**

**Mitigation**:
- Health endpoint bypasses most middleware
- Error handler catches unhandled errors
- Server listens even if subsystems fail

### Critical Path 2: Database Access

**Path**: Request → Route Handler → `getDb()` → Query

**Failure Points**:
1. DB not configured → **Throws error**
2. Connection timeout → **Throws error**
3. Query timeout → **Throws error**

**Mitigation**:
- `isDbAvailable()` check before use
- Circuit breaker wraps DB calls
- Health check has 1s timeout

### Critical Path 3: External API Calls

**Path**: Request → Route Handler → External API → Response

**Failure Points**:
1. API timeout → **Request hangs**
2. API rate limit → **429 error**
3. API down → **503 error**

**Mitigation**:
- Circuit breaker wraps external calls
- Exponential backoff retries
- Timeout on all external calls

### Critical Path 4: Heavy Subsystem Initialization

**Path**: Server Start → `INIT_HEAVY_SUBSYSTEMS=true` → Load Packages → Initialize

**Failure Points**:
1. Package missing → **Warning, continues**
2. Initialization throws → **Warning, continues**
3. Circular dependency → **DAG throws error**

**Mitigation**:
- Non-blocking initialization
- Errors logged but don't crash server
- DAG detects circular dependencies

---

## File Structure Map

```
server/
├── index.ts                    # Main entry point (2499 lines!)
├── config/
│   ├── env.ts                 # Environment config
│   └── feature-flags.yaml     # Feature flags
├── core/
│   ├── startup-dag.ts         # Dependency DAG
│   ├── health-gates.ts       # Health gate system
│   ├── circuit-breaker.ts     # Circuit breaker pattern
│   ├── traffic-shaping.ts    # Traffic rollout
│   ├── dag-loader.ts         # Loads graph.json
│   └── agents/               # Core agents
├── middleware/
│   ├── metrics.ts            # Golden signals
│   ├── traceId.ts            # Request tracing
│   ├── idempotency.ts        # Idempotency keys
│   └── traffic-shaping.ts    # Traffic shaping middleware
├── routes/                   # 237 route files!
│   ├── health.ts             # Health checks
│   ├── observability.ts      # Golden signals API
│   └── ...                   # Many more
├── services/
│   └── IntegrationFlagsService.ts  # Feature flags
├── db.ts                     # Database connection
└── system/
    ├── inspector.ts          # System inspection
    └── graph.ts              # System graph API
```

---

## Environment Variables

### Required

- `NODE_ENV` - `development` | `production` | `test`
- `PORT` - Server port (default: 3000)

### Optional (Server can start without)

- `DATABASE_URL` - PostgreSQL connection string
- `ALLOWED_ORIGINS` - CORS origins (comma-separated)
- `OPERATOR_WALLETS` - Admin wallet addresses

### Feature Flags

- `USE_RELIABILITY_SYSTEM` - Enable reliability system
- `INIT_SUBSYSTEMS` - Enable optional subsystems
- `INIT_HEAVY_SUBSYSTEMS` - Enable heavy subsystems
- `USE_LATENT_COLLABORATION` - Enable latent collaboration
- `MESH_AUTOSTART` - Auto-start mesh

### API Keys (Optional)

- `OPENAI_API_KEY` - OpenAI API key
- `VERCEL_TOKEN` - Vercel API token (legacy)
- Many more for integrations...

---

## Common Modification Patterns

### Adding a New Route

1. Create route file: `server/routes/my-route.ts`
2. Export router: `export default Router()`
3. Register in `server/index.ts`: `app.use("/api/my-route", myRouteRouter)`
4. **Place before catch-all routes** (`/api`)

### Adding Middleware

1. Create middleware: `server/middleware/my-middleware.ts`
2. Export function: `export function myMiddleware(req, res, next)`
3. Register in `server/index.ts` **before routes**
4. **Order matters!**

### Adding a New Subsystem

1. Add to `deploy/graph.json`:
```json
{
  "id": "my-subsystem",
  "name": "My Subsystem",
  "dependencies": ["database"],
  "critical": false,
  "initModule": "packages/my-subsystem",
  "initFunction": "init"
}
```

2. Initialize in `server/index.ts` (inside `initOptionalSubsystems`)
3. Set conditional env var if needed

### Adding Circuit Breaker Protection

```typescript
import { withCircuitBreaker } from '../core/circuit-breaker';

const result = await withCircuitBreaker('my-api', async () => {
  return await externalApiCall();
});
```

### Adding Feature Flag

1. Add to `server/config/feature-flags.yaml`:
```yaml
- name: "my_feature"
  default: true
  description: "My feature"
  owner: "my-team"
  brownout: false
```

2. Check in code:
```typescript
import { IntegrationFlagsService } from '../services/IntegrationFlagsService';

if (await IntegrationFlagsService.isEnabled('my_feature')) {
  // Feature code
}
```

---

## How to NOT Break Things

### ✅ DO

1. **Test health endpoint** after changes: `curl http://localhost:3000/health`
2. **Add error handling** to new routes
3. **Use circuit breakers** for external calls
4. **Check feature flags** before enabling features
5. **Update graph.json** when adding subsystems
6. **Document dependencies** in service definitions

### ❌ DON'T

1. **Don't block** the health endpoint
2. **Don't throw** in middleware (use next(error))
3. **Don't initialize** heavy subsystems synchronously
4. **Don't modify** middleware order without testing
5. **Don't remove** error handlers
6. **Don't hardcode** API keys or secrets

---

## Debugging Guide

### Server Won't Start

1. Check environment config: `server/config/env.ts`
2. Check port availability: `lsof -i :3000`
3. Check logs for initialization errors
4. Try minimal startup: Comment out `initOptionalSubsystems`

### Routes Not Working

1. Check route registration order (first match wins)
2. Check middleware isn't blocking
3. Check feature flags: `/api/observability/feature-flags`
4. Check logs for route handler errors

### Database Errors

1. Check `DATABASE_URL` is set
2. Check `isDbAvailable()` before use
3. Check circuit breaker state: `/api/observability/circuit-breakers`
4. Check health gates: `/api/observability/health-gates`

### Subsystem Not Initializing

1. Check `INIT_SUBSYSTEMS` or `INIT_HEAVY_SUBSYSTEMS` env var
2. Check `deploy/graph.json` for service definition
3. Check dependencies are ready
4. Check logs for initialization errors

---

## Quick Reference

### Health Checks

- `/health` - Basic health (fast, non-blocking)
- `/health/ready` - Readiness probe (checks critical services)
- `/health/live` - Liveness probe (server is running)

### Observability

- `/api/observability/golden-signals` - Traffic, errors, latency
- `/api/observability/health-gates` - Service readiness
- `/api/observability/circuit-breakers` - Circuit breaker states
- `/api/system/graph` - System topology

### Feature Flags

- `/api/observability/feature-flags` - List all flags
- `IntegrationFlagsService.isEnabled('flag')` - Check flag
- `IntegrationFlagsService.enableBrownoutMode()` - Enable brownout

---

**Last Updated**: 2025-01-27
**Server Version**: See `server/index.ts` line 1

