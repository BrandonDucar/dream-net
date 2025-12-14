# DreamNet Server Routes - Critical Routes Documentation

**Status**: ✅ In Progress  
**Last Updated**: 2025-01-27  
**Total Route Files**: 206 files, ~1023 route handlers

---

## Overview

The DreamNet server exposes 200+ route files with over 1000 API endpoints. Routes are dynamically registered from `server/routes/` directory. This document covers the most critical routes that power core functionality.

**Route Registration**: Routes are auto-discovered and registered via `server/routes/index.ts`:
- Each `.ts` file exports a default Router
- Routes are mounted at `/api/{filename}` (e.g., `agent.ts` → `/api/agent`)

---

## Route Categories

### 1. Core System Routes
### 2. Agent Routes  
### 3. Dream Routes
### 4. Authentication & Authorization
### 5. Pack Routes (Wolf, Whale, Orca)
### 6. Control & Governance
### 7. Observability & Monitoring
### 8. Integration Routes
### 9. Economic Routes
### 10. Infrastructure Routes

---

## 1. Core System Routes

### `health.ts` - Health & Status Endpoints

**Purpose**: Health checks, liveness/readiness probes, status dashboard, and operational controls.

**Endpoints**:
- `GET /health` - Comprehensive health check (backward compatible)
- `GET /health/live` - Liveness probe (process only, no external deps)
- `GET /health/ready` - Readiness probe (critical dependencies)
- `GET /health/status` - Public status page (HTML dashboard)
- `GET /health/metrics` - Metrics endpoint for dashboard integration
- `POST /health/ops/pause` - Pause system operations
- `POST /health/ops/resume` - Resume system operations
- `GET /health/ops/status` - Get operations status
- `POST /health/ops/backup/now` - Create manual backup (admin)
- `GET /health/ops/backup/status` - Get backup status
- `POST /health/ops/backup/auto/:action` - Control auto-backup (admin)
- `POST /health/ops/sim/failhealth` - Simulate health failure (testing)
- `GET /health/ops/sim/status` - Get simulation status
- `GET /health/privacy` - Privacy policy (HTML)
- `GET /health/terms` - Terms of service (HTML)
- `GET /health/ops/privacy` - Privacy controls (JSON)

**Key Features**:
- Liveness probe for Kubernetes/Docker (no external deps)
- Readiness probe checks database, health gates, environment
- Status dashboard with real-time monitoring
- Backup system endpoints
- Legal compliance endpoints
- Health simulation for testing

**Usage**:
```bash
# Liveness probe (Kubernetes)
curl http://localhost:3000/health/live

# Readiness probe (Kubernetes)
curl http://localhost:3000/health/ready

# Comprehensive health check
curl http://localhost:3000/health
```

**Why**: Critical for production deployments, monitoring, and operational control.

---

### `control.ts` - Control Plane API

**Purpose**: Global kill-switch, per-cluster rate limiting, and circuit breaker control.

**Endpoints**:
- `GET /api/control` - Get full control config (requires operator tier)
- `GET /api/control/kill-switch` - Get kill-switch state
- `POST /api/control/kill-switch/enable` - Enable global kill-switch (architect tier)
- `POST /api/control/kill-switch/disable` - Disable global kill-switch (architect tier)
- `POST /api/control/cluster/:clusterId/enable` - Enable cluster
- `POST /api/control/cluster/:clusterId/disable` - Disable cluster
- `GET /api/control/cluster/:clusterId/rate-limit` - Get cluster rate limit
- `POST /api/control/cluster/:clusterId/rate-limit` - Set cluster rate limit
- `POST /api/control/cluster/:clusterId/circuit-breaker/trip` - Trip circuit breaker
- `POST /api/control/cluster/:clusterId/circuit-breaker/reset` - Reset circuit breaker

**Clusters**:
- `WOLF_PACK` - Wolf Pack funding cluster
- `API_KEEPER` - API Keeper cluster
- `DREAMNET_CORE` - Core DreamNet cluster
- And more...

**Usage**:
```bash
# Enable kill-switch (emergency)
curl -X POST http://localhost:3000/api/control/kill-switch/enable \
  -H "Authorization: Bearer <architect-token>" \
  -d '{"reason": "Emergency maintenance"}'

# Set rate limit for cluster
curl -X POST http://localhost:3000/api/control/cluster/WOLF_PACK/rate-limit \
  -d '{"requestsPerMinute": 100, "requestsPerHour": 1000}'
```

**Why**: Provides global control over system operations, enabling emergency shutdowns and rate limiting.

---

### `status.ts` - System Status

**Purpose**: Simple status endpoint (backward compatible alias for `/health`).

**Endpoints**:
- `GET /api/status` - System status

**Why**: Backward compatibility endpoint.

---

## 2. Agent Routes

### `agent.ts` - Agent Execution

**Purpose**: List agents and execute agent tasks.

**Endpoints**:
- `GET /api/agents` - List all agents (includes GPT agents)
- `POST /api/agent` - Execute agent task

**Usage**:
```bash
# List agents
curl http://localhost:3000/api/agents

# Execute agent
curl -X POST http://localhost:3000/api/agent \
  -d '{"agent": "dreamkeeper", "input": {...}}'
```

**Why**: Core agent execution interface.

---

### `agent-gateway.ts` - Agent Gateway (AI-Native Ingress)

**Purpose**: High-bandwidth, AI-native ingress for ChatGPT, Cursor, Replit agents. Routes intents to tools via Tool Registry.

**Endpoints**:
- `GET /api/agent/gateway/tools` - List available tools (filtered by permissions)
- `POST /api/agent/gateway` - Execute tool via intent

**Features**:
- Intent resolution (natural language → tool)
- Tool registry with permissions
- Governance/policy checks
- Tier-based access control
- Office/Cabinet-based access control

**Request Format**:
```json
{
  "intent": "get environment variable OPENAI_API_KEY",
  "payload": {},
  "constraints": {}
}
```

**Response Format**:
```json
{
  "traceId": "abc123",
  "tierId": "BUILDER",
  "intent": "get environment variable OPENAI_API_KEY",
  "toolId": "env.get",
  "result": {
    "ok": true,
    "data": {...},
    "latencyMs": 50
  }
}
```

**Usage**:
```bash
# List available tools
curl http://localhost:3000/api/agent/gateway/tools \
  -H "X-DreamNet-Api-Key: dn_live_..."

# Execute tool via intent
curl -X POST http://localhost:3000/api/agent/gateway \
  -H "X-DreamNet-Api-Key: dn_live_..." \
  -d '{"intent": "get environment variable OPENAI_API_KEY"}'
```

**Why**: Provides unified AI-native interface for all DreamNet tools, enabling ChatGPT/Cursor/Replit agents to interact with DreamNet.

---

### `super-spine.ts` - Agent Orchestration

**Purpose**: Agent discovery, registration, task routing, load balancing, health monitoring, and subscriptions.

**Endpoints**:
- `GET /api/super-spine/agents` - Get all agents (filter by capability/available)
- `GET /api/super-spine/agent/:key` - Get specific agent
- `GET /api/super-spine/agent/:key/access` - Check user access to agent
- `POST /api/super-spine/subscription` - Create agent subscription
- `GET /api/super-spine/subscription/:agentKey` - Get user's subscription
- `POST /api/super-spine/task` - Submit task to agent
- `GET /api/super-spine/tasks` - Get user's tasks

**Usage**:
```bash
# Get all agents
curl http://localhost:3000/api/super-spine/agents

# Check access
curl http://localhost:3000/api/super-spine/agent/wolf-pack/access?userId=user123

# Submit task
curl -X POST http://localhost:3000/api/super-spine/task \
  -d '{"agentKey": "wolf-pack", "type": "find_funding", "input": {...}}'
```

**Why**: Provides centralized agent orchestration and marketplace functionality.

---

### `brain.ts` - Super Brain Routes

**Purpose**: Query Super Brain, get Brain status, Drive Engine status, and inject events.

**Endpoints**:
- `GET /api/brain/status` - Get Brain status
- `POST /api/brain/query` - Query the Brain (for AI assistants)
- `GET /api/brain/drive` - Get Drive Engine status
- `POST /api/brain/event` - Manually inject event (testing)
- `POST /api/brain/initialize` - Initialize Brain integration

**Usage**:
```bash
# Query Brain (for Cursor/AI assistants)
curl -X POST http://localhost:3000/api/brain/query \
  -d '{"question": "What is DreamNet?", "context": {}}'

# Get Drive Engine status
curl http://localhost:3000/api/brain/drive
```

**Why**: Enables AI assistants to query DreamNet's knowledge base and interact with the Brain.

---

## 3. Dream Routes

### `dream.ts` - Dream Management

**Purpose**: Core dream creation, retrieval, and management.

**Endpoints**:
- Various dream CRUD operations

**Note**: File appears to be a placeholder - needs exploration.

---

### `dreams.ts` - Dreams Listing

**Purpose**: List and query dreams.

**Endpoints**:
- Dream listing and query endpoints

**Note**: File appears minimal - needs exploration.

---

## 4. Authentication & Authorization Routes

### `auth.ts` - Authentication

**Purpose**: Authentication endpoints for JWT and Stack Auth.

**Endpoints**:
- `GET /auth/selftest` - Auth selftest (accepts JWT or Stack Auth)
- `GET /auth/stack-selftest` - Stack Auth specific selftest
- `POST /auth/token` - Generate mock token (testing only)

**Usage**:
```bash
# Test authentication
curl http://localhost:3000/auth/selftest \
  -H "Authorization: Bearer <token>"
```

**Why**: Provides authentication verification endpoints.

---

### `api-keys.ts` - API Key Management

**Purpose**: Create, manage, and revoke DreamNet API keys.

**Endpoints**:
- `POST /api/keys/create` - Create new API key (requires wallet auth)
- `GET /api/keys` - List API keys (requires auth)
- `DELETE /api/keys/:keyId` - Revoke API key (requires auth)
- `GET /api/keys/:keyId` - Get API key info (admin)

**Usage**:
```bash
# Create API key
curl -X POST http://localhost:3000/api/keys/create \
  -H "Authorization: Bearer <wallet-token>" \
  -d '{"name": "My API Key", "permissions": ["read", "write"]}'

# List keys
curl http://localhost:3000/api/keys \
  -H "Authorization: Bearer <wallet-token>"
```

**Why**: Enables programmatic access to DreamNet API via API keys.

---

## 5. Pack Routes

### `wolf-pack.ts` - Wolf Pack (Funding)

**Purpose**: Funding opportunity discovery, hunts, and management.

**Endpoints**:
- `GET /api/wolf-pack/opportunities` - Get all funding opportunities
- `POST /api/wolf-pack/discover` - Trigger discovery
- `POST /api/wolf-pack/hunt` - Create funding hunt
- `GET /api/wolf-pack/hunts` - Get all hunts
- `GET /api/wolf-pack/hunt/:id` - Get specific hunt
- More endpoints...

**Cluster**: `WOLF_PACK` (enforced via `withCluster`)

**Usage**:
```bash
# Get opportunities
curl http://localhost:3000/api/wolf-pack/opportunities

# Create hunt
curl -X POST http://localhost:3000/api/wolf-pack/hunt \
  -d '{"targetAmount": 100000, "targetSources": ["grants", "vc"]}'
```

**Why**: Provides funding discovery and management for DreamNet.

---

### `whale.ts` - Whale Pack (Commerce)

**Purpose**: Commerce and product management.

**Endpoints**:
- Commerce-related endpoints

**Note**: Needs exploration.

---

### `orca-marketplace.ts` - Orca Pack (Communication)

**Purpose**: Communication and narrative management.

**Endpoints**:
- Communication-related endpoints

**Note**: Needs exploration.

---

## 6. Observability Routes

### `nerve.ts` - Nerve Fabric

**Purpose**: Nerve Bus statistics and event access.

**Endpoints**:
- `GET /api/nerve/stats` - Get Nerve Bus statistics
- `GET /api/nerve/recent-events` - Get recent events
- `GET /api/nerve/metrics` - Get Nerve metrics

**Why**: Provides observability into Nerve Fabric event bus.

---

### `ports-ops.ts` - Port Operations

**Purpose**: Admin-only route for port definitions, Env Keeper, API Keeper, and Nerve Fabric stats.

**Endpoints**:
- `GET /api/ports/ops` - Get port operations summary (admin)

**Why**: Provides admin visibility into internal port system.

---

### `observability.ts` - Observability

**Purpose**: Golden signals, health gates, and circuit breaker states.

**Endpoints**:
- `GET /api/observability/golden-signals` - Get golden signals
- `GET /api/observability/health-gates` - Get health gate status
- `GET /api/observability/circuit-breakers` - Get circuit breaker states

**Why**: Provides production observability metrics.

---

## 7. Integration Routes

### `vercel.ts` - Vercel Integration

**Purpose**: Vercel deployment management.

**Endpoints**:
- Vercel deployment endpoints

**Note**: Needs exploration.

---

### `google-cloud.ts` - Google Cloud Integration

**Purpose**: Google Cloud Platform integration.

**Endpoints**:
- GCP integration endpoints

**Note**: Needs exploration.

---

## Route Registration Flow

```
server/index.ts
  ↓
server/routes/index.ts (auto-discovery)
  ↓
For each .ts file in server/routes/:
  - Import default Router
  - Mount at /api/{filename}
  - Log registration
```

**Example**:
- `server/routes/agent.ts` → `/api/agent`
- `server/routes/wolf-pack.ts` → `/api/wolf-pack`
- `server/routes/health.ts` → `/api/health` (but also `/health` via direct mount)

---

## Middleware Applied to Routes

Routes inherit middleware from `server/index.ts`:
1. `traceIdMiddleware` - Trace ID generation
2. `metricsMiddleware` - Golden signals collection
3. `idempotencyMiddleware` - Duplicate request prevention
4. `tierResolverMiddleware` - Access tier resolution
5. `controlCoreMiddleware` - Cluster-level access control
6. `autoSEORequestMiddleware` - Auto SEO optimization

**Route-Specific Middleware**:
- `requireApiKey` - API key authentication
- `requireAuth` - Wallet authentication (SIWE)
- `createPassportGate(tier)` - Dream State passport gate
- `withCluster(clusterId)` - Cluster attachment
- `withPort(portId)` - Port attachment
- `withGovernance({ clusterId })` - Governance checks

---

## Critical Routes Summary

| Route File | Purpose | Key Endpoints | Priority |
|------------|---------|---------------|----------|
| `health.ts` | Health checks | `/health`, `/health/ready`, `/health/live` | 🔴 Critical |
| `control.ts` | Control plane | `/api/control/kill-switch` | 🔴 Critical |
| `agent-gateway.ts` | AI-native ingress | `/api/agent/gateway` | 🔴 Critical |
| `agent.ts` | Agent execution | `/api/agents`, `/api/agent` | 🟠 High |
| `super-spine.ts` | Agent orchestration | `/api/super-spine/*` | 🟠 High |
| `brain.ts` | Super Brain queries | `/api/brain/query` | 🟠 High |
| `api-keys.ts` | API key management | `/api/keys/*` | 🟠 High |
| `wolf-pack.ts` | Funding discovery | `/api/wolf-pack/*` | 🟡 Medium |
| `auth.ts` | Authentication | `/auth/*` | 🟡 Medium |
| `nerve.ts` | Nerve Fabric | `/api/nerve/*` | 🟡 Medium |
| `observability.ts` | Observability | `/api/observability/*` | 🟡 Medium |

---

## 8. Integration Routes

### `vercel.ts` - Vercel Deployment Management

**Purpose**: Manage Vercel deployments, projects, and cleanup old projects.

**Endpoints**:
- `GET /api/vercel/status` - Get Vercel agent status
- `GET /api/vercel/projects` - List all projects
- `GET /api/vercel/project/:name` - Get project by name
- `POST /api/vercel/deploy` - Deploy project
- `DELETE /api/vercel/project/:name` - Delete project
- More endpoints...

**Features**:
- Optional imports (graceful degradation)
- Port attachment (`withPort`)
- Governance checks (`withGovernance`)
- Nerve event emission
- Env Keeper / API Keeper integration

**Why**: Enables automated Vercel deployments from DreamNet.

---

### `env-keeper.ts` - Environment Variable Management

**Purpose**: Unified interface for managing environment variables through Env Keeper Core.

**Endpoints**:
- `GET /api/env-keeper/status` - Get Env Keeper status
- `GET /api/env-keeper/list` - List all env vars (values masked)
- `GET /api/env-keeper/get/:key` - Get specific env var (decrypted if authorized)
- `POST /api/env-keeper/set` - Set env var (governed port)
- `POST /api/env-keeper/delete/:key` - Delete env var (admin)
- `POST /api/env-keeper/sync` - Sync env vars (admin)
- `GET /api/env-keeper/summary` - Get summary (admin)

**Security**:
- Secret values masked unless admin + decrypt=true
- Port governance (`ENVKEEPER_PORT`)
- Cluster governance (`ENVKEEPER_CORE`)
- Nerve event emission for audit

**Why**: Provides zero-touch environment variable management with security controls.

---

### `citadel.ts` - The Citadel (Strategic Command Center)

**Purpose**: Access The Citadel - DreamNet's strategic command center that generates snapshots and blueprints.

**Endpoints**:
- `GET /api/citadel/state` - Run Citadel once and return all agent outputs

**Usage**:
```bash
# Run Citadel
curl http://localhost:3000/api/citadel/state
```

**Why**: Provides access to strategic planning and agent coordination system.

---

### `dreamkeeper.ts` - DreamKeeper (Agent 4)

**Purpose**: Generate and retrieve health specs and surgeon protocols.

**Endpoints**:
- `POST /api/dreamkeeper/analyze` - Run full Agent 4 analysis
- `GET /api/dreamkeeper/spec` - Get latest dreamkeeper spec
- `GET /api/dreamkeeper/protocols` - Get latest surgeon protocols

**Why**: Provides health analysis and surgical protocols for DreamNet.

---

## Route Registration Flow (HOW)

### Dynamic Route Discovery

**WHERE**: `server/routes/index.ts`

**HOW**:
1. Reads all files in `server/routes/` directory
2. For each `.ts` file:
   - Dynamically imports default export
   - Checks if export is a Router instance
   - Mounts at `/api/{filename}` (e.g., `agent.ts` → `/api/agent`)
   - Logs registration success/failure

**Code Flow**:
```typescript
// server/routes/index.ts
export const registerRoutes = async (app: Express) => {
  const files = readdirSync(routesDir);
  
  for (const file of files) {
    if (file === 'index.ts' || file.endsWith('.map')) continue;
    
    const { default: router } = await import(routePath);
    
    if (router instanceof Router) {
      const routeName = file.replace('.ts', '').replace('.js', '');
      app.use(`/api/${routeName}`, router);
      console.log(`✅ [Routes] Registered /api/${routeName}`);
    }
  }
};
```

**WHY**: 
- Auto-discovery reduces boilerplate
- Easy to add new routes (just create file)
- Failures are isolated (one route failure doesn't break others)

---

### Manual Route Registration

**WHERE**: `server/index.ts` (lines 51-137)

**HOW**: Some routes are manually imported and registered:
- `healthRouter` → `/health` (not `/api/health`)
- `controlRouter` → `/api/control`
- `agentGatewayRouter` → `/api/agent/gateway`
- And more...

**WHY**: 
- Special mounting paths (e.g., `/health` instead of `/api/health`)
- Explicit control over route order
- Integration with middleware chain

---

## Middleware Chain (HOW)

**WHERE**: `server/index.ts` (middleware setup)

**Order**:
1. `traceIdMiddleware` - Generate trace IDs
2. `metricsMiddleware` - Collect golden signals
3. `idempotencyMiddleware` - Prevent duplicate requests
4. `tierResolverMiddleware` - Resolve access tiers
5. `controlCoreMiddleware` - Cluster-level access control
6. `autoSEORequestMiddleware` - Auto SEO optimization
7. **Route handlers**

**WHY**: 
- Consistent request processing
- Observability at every layer
- Security enforcement
- Performance optimization

---

## Route-Specific Middleware (HOW)

### Port Attachment
```typescript
router.get("/endpoint", withPort("PORT_ID"), handler);
```
**WHAT**: Attaches route to internal port system  
**WHY**: Enables port-based routing and governance

### Governance Checks
```typescript
router.post("/endpoint", withGovernance({ clusterId: "CLUSTER_ID" }), handler);
```
**WHAT**: Enforces cluster-level access control  
**WHY**: Tier-based, office-based, cabinet-based permissions

### Authentication
```typescript
router.get("/endpoint", requireAuth, handler);
router.get("/endpoint", requireAdmin, handler);
router.get("/endpoint", requireApiKey, handler);
```
**WHAT**: Various authentication mechanisms  
**WHY**: Different routes need different auth levels

### Cluster Attachment
```typescript
router.use(withCluster("CLUSTER_ID"));
```
**WHAT**: Attaches entire router to cluster  
**WHY**: Enables cluster-level rate limiting and feature flags

---

## Route Categories Summary

| Category | Route Files | Purpose | Priority |
|----------|-------------|---------|----------|
| **Core System** | `health.ts`, `control.ts`, `status.ts` | Health, control, status | 🔴 Critical |
| **Agents** | `agent.ts`, `agent-gateway.ts`, `super-spine.ts`, `brain.ts` | Agent execution, orchestration | 🔴 Critical |
| **Dreams** | `dream.ts`, `dreams.ts`, `dream-*.ts` | Dream management | 🟠 High |
| **Auth** | `auth.ts`, `api-keys.ts` | Authentication, API keys | 🟠 High |
| **Packs** | `wolf-pack.ts`, `whale.ts`, `orca-marketplace.ts` | Funding, commerce, communication | 🟡 Medium |
| **Observability** | `nerve.ts`, `ports-ops.ts`, `observability.ts` | Monitoring, metrics | 🟡 Medium |
| **Integrations** | `vercel.ts`, `env-keeper.ts`, `google-cloud.ts` | External integrations | 🟡 Medium |
| **Core Systems** | `citadel.ts`, `dreamkeeper.ts` | Strategic systems | 🟡 Medium |

---

## Route Dependencies (WHERE)

### Internal Dependencies
- Routes depend on:
  - `server/core/` - Core systems
  - `server/services/` - Business logic
  - `server/middleware/` - Middleware functions
  - `packages/*` - Package exports

### External Dependencies
- Routes may depend on:
  - Database (Postgres/Neon)
  - External APIs (Vercel, Google Cloud, etc.)
  - Blockchain (Base mainnet)
  - AI services (OpenAI, etc.)

---

## Route Error Handling (HOW)

**Pattern**:
```typescript
router.get("/endpoint", async (req, res) => {
  try {
    // Handler logic
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("[Route] Error:", error);
    res.status(500).json({ error: error.message });
  }
});
```

**WHY**: 
- Consistent error handling
- Error logging
- User-friendly error messages

---

## Route Testing (HOW)

**Strategy**:
1. Unit tests for route handlers
2. Integration tests for route + middleware
3. E2E tests for complete flows

**Tools**:
- Jest for unit tests
- Supertest for integration tests
- Playwright for E2E tests

---

## Next Steps

1. ✅ **Critical routes documented** - Core system routes covered
2. ⏳ **Remaining routes** - Document all 200+ route files
3. ⏳ **Route dependencies** - Map all dependencies
4. ⏳ **API documentation** - Generate OpenAPI/Swagger docs
5. ⏳ **Route testing** - Document testing strategies

---

**This document covers critical routes with HOW, WHY, WHERE, and WHAT. Moving to integrations next.**

