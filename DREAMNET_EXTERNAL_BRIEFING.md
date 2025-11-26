# 🌌 DreamNet External Briefing
## Technical & Architectural Overview for External Architect AI

**Version:** 1.0.0  
**Date:** 2025-01-27  
**Status:** Current State Documentation  
**Purpose:** Provide a concise but complete technical briefing for external architect AIs who need to understand DreamNet's current structure, architecture, and runtime state without direct filesystem access.

---

## 📋 Table of Contents

1. [Repo & Project Layout](#repo--project-layout)
2. [Core Services & Entry Points](#core-services--entry-points)
3. [Current Deployment Reality](#current-deployment-reality)
4. [Environment & Configuration](#environment--configuration)
5. [Generated DreamNet Docs (Self & Wisdom Files)](#generated-dreamnet-docs-self--wisdom-files)
6. [Known Problems / Open Issues](#known-problems--open-issues)
7. [Current Strengths](#current-strengths)
8. [Next Logical Implementation Targets](#next-logical-implementation-targets)

---

## 📁 Repo & Project Layout

### Top-Level Structure

DreamNet is a **pnpm monorepo** with the following structure:

```
dream-net/
├── apps/                    # Application entry points (if any)
├── packages/                # Shared packages and subsystems
│   ├── neural-mesh/         # Synaptic network system
│   ├── dream-cortex/        # Intent synthesis engine
│   ├── quantum-anticipation-layer/  # Prediction system
│   ├── slug-time-memory/    # Long-term memory layer
│   ├── octopus-executor/    # Task execution system
│   ├── squad-alchemy-engine/ # Agent orchestration
│   ├── predator-scavenger-loop/  # Decay detection
│   ├── dream-vault/         # Central dream repository
│   ├── dream-shop/          # Commerce system
│   ├── star-bridge-lungs/   # Cross-chain event bus
│   ├── shield-core/         # Multi-layer defense
│   ├── dream-state-core/    # Passport & governance
│   ├── field-layer/         # Main cycle orchestrator
│   ├── orchestrator-core/   # Cycle management
│   ├── dreamnet-os-core/    # OS-level agent management
│   ├── control-core/        # Control & governance (partial)
│   ├── nerve/               # High-priority event bus
│   ├── internal-ports/      # Internal communication
│   ├── laser-router/        # High-speed routing
│   ├── graft-engine/        # Graft management
│   ├── memory-dna/          # Memory records
│   ├── narrative-field/     # Narrative generation
│   ├── identity-grid/       # Identity management
│   ├── reputation-lattice/  # Reputation scoring
│   ├── wolf-pack-protocol/  # Communication protocol
│   ├── rewards-engine/      # Rewards distribution
│   ├── metrics-engine/      # Metrics collection
│   ├── webhook-nervous-core/  # Webhook handling
│   ├── jaggy-core/          # Jaggy system
│   ├── dreamnet-snail-core/ # Privacy layer
│   ├── env-keeper-core/     # Environment management
│   ├── api-keeper-core/     # API management
│   ├── ai-seo-core/         # SEO automation
│   ├── wolfpack-funding-core/  # Funding system
│   ├── wolfpack-mailer-core/   # Email system
│   ├── orca-pack-core/      # Narrative themes
│   ├── whale-pack-core/     # Whale management
│   ├── zen-garden-core/     # Zen Garden system
│   ├── civic-panel-core/    # Civic Panel system
│   ├── dream-tank-core/     # Dream Tank system
│   ├── liquidity-engine/    # Liquidity management
│   ├── social-hub-core/     # Social Hub system
│   ├── init-ritual-core/    # Init Ritual system
│   ├── economic-engine-core/  # Economic engine
│   ├── agent-registry-core/   # Agent registry
│   ├── runtime-bridge-core/  # Runtime bridge
│   ├── alive-mode/          # Alive mode system
│   └── event-wormholes/     # Event routing
├── server/                  # Main backend server
│   ├── index.ts            # Express.js entry point
│   ├── core/               # Core agent system
│   │   ├── dreamnet-os.ts  # DreamOps (central orchestrator)
│   │   └── agents/         # Agent implementations
│   │       ├── dreamkeeper.ts  # Health monitoring agent
│   │       ├── deploykeeper.ts # Deployment agent
│   │       ├── envkeeper.ts    # Environment agent
│   │       └── relaybot.ts    # Relay agent
│   ├── routes/             # API route handlers (200+ files)
│   ├── middleware/         # Express middleware
│   ├── mesh/              # Mesh system integration
│   ├── starbridge/        # StarBridge event bus
│   ├── jobs/              # Background jobs
│   ├── db.ts              # Database connection
│   └── Dockerfile         # Docker configuration
├── client/                 # Frontend application (DreamHub)
│   ├── src/               # React/Vite application
│   ├── package.json       # Frontend dependencies
│   └── vite.config.ts     # Vite configuration
├── infrastructure/         # Infrastructure as code
│   └── google/            # Google Cloud Platform
│       ├── gke/          # GKE Autopilot deployment
│       │   ├── deploy.ts  # Deployment script
│       │   └── *.yaml    # Kubernetes manifests
│       └── run/          # Cloud Run deployment
├── cloudbuild.yaml        # Google Cloud Build config
├── pnpm-workspace.yaml    # pnpm workspace configuration
└── package.json           # Root package.json
```

### Key Directories

**Main Web App / DreamHub:**
- `client/` - React/Vite frontend application
- Entry point: `client/src/main.tsx` (typical Vite setup)
- Build output: `client/dist/`

**Server/Backend Code:**
- `server/` - Express.js TypeScript server
- Entry point: `server/index.ts`
- Routes: `server/routes/*.ts` (204 route files, 852 endpoints)
- Core agents: `server/core/agents/*.ts`

**Agents Location:**
- Core agents: `server/core/agents/`
- Agent orchestration: `server/core/dreamnet-os.ts`
- Agent packages: `packages/*/` (various agent-related subsystems)

**Monorepo Layout:**
- **Workspace Manager**: pnpm workspaces
- **Workspace Config**: `pnpm-workspace.yaml`
- **Root Scripts**: Defined in root `package.json`
- **Package Scripts**: Each package has its own `package.json`

---

## 🚀 Core Services & Entry Points

### Main Web Entrypoint

**Frontend (DreamHub):**
- **Location**: `client/`
- **Framework**: React 18.2.0 + Vite 5.2.0
- **Entry**: `client/src/main.tsx`
- **Dev Server**: `pnpm --filter client dev` (typically port 5173)
- **Build**: `pnpm --filter client build`
- **Output**: `client/dist/`

**Backend (API Server):**
- **Location**: `server/`
- **Framework**: Express.js + TypeScript
- **Entry**: `server/index.ts`
- **Dev Server**: `pnpm --filter server dev` (port from env, default 3000)
- **Build**: `pnpm --filter server build`
- **Output**: `server/dist/`

### API Services

**Main API Server:**
- **File**: `server/index.ts`
- **Routes**: 204 route files in `server/routes/`
- **Endpoints**: 852 total API endpoints
- **Middleware Stack**:
  1. CORS
  2. Body parser
  3. Trace ID middleware
  4. Idempotency middleware
  5. Tier resolver (access control)
  6. Control Core middleware
  7. Auto SEO middleware
  8. Route handlers

**Key Route Categories:**
- Dream management (`/api/dreams/*`)
- Agent management (`/api/agents/*`)
- Economic endpoints (`/api/economy/*`, `/api/rewards/*`)
- Authentication (`/api/auth/*`, SIWE + JWT)
- Webhook endpoints (`/api/webhooks/*`)
- Admin endpoints (`/api/admin/*`)
- Health checks (`/api/health`, `/api/status`)

### Background Workers / Schedulers

**Magnetic Rail Train (Job Scheduler):**
- **Location**: `server/magnetic-rail/scheduler.ts`
- **Purpose**: Temporal event management, scheduled jobs
- **Integration**: Runs as part of server process

**Background Jobs:**
- **Location**: `server/jobs/`
- **Jobs**:
  - `vectorRollup.ts` - Vector event processing
  - `watchdog.ts` - Repository file monitoring

**Mesh System:**
- **Location**: `server/mesh/index.ts`
- **Purpose**: Component orchestration
- **Components**: DreamKeeper, DefenseNet, SurgeonAgent, DeployKeeper, MagneticRail
- **Auto-start**: Controlled by `MESH_AUTOSTART` env var

### Ports and Runtime Behavior

**Development:**
- **Frontend**: Port 5173 (Vite default)
- **Backend**: Port 3000 (default, configurable via `PORT` env var)
- **Database**: PostgreSQL (port 5432, configurable)
- **Hot Reload**: Enabled for both frontend and backend

**Production:**
- **Frontend**: Served via Vite build or static hosting
- **Backend**: Port from environment variable
- **Database**: Cloud SQL/AlloyDB (GCP) or external PostgreSQL
- **Container**: Docker containerization via `server/Dockerfile`

**Environment Variables (Ports):**
- `PORT` - Backend server port
- `DATABASE_URL` - PostgreSQL connection string
- `MESH_AUTOSTART` - Auto-start mesh system (true/false)
- `INIT_SUBSYSTEMS` - Initialize subsystems on startup (true/false)

---

## 🚢 Current Deployment Reality

### What Has Been Deployed

**Current Status:**
- **Local Development**: Fully functional
- **Cloud Run**: Attempted, encountered startup timeout issues
- **GKE Autopilot**: Deployment scripts exist, cluster configured (`autopilot-cluster-1` in `us-central1`)
- **Vercel**: Legacy/optional (not primary)
- **Railway**: Legacy/optional (not primary)

**Deployment Targets:**
1. **Google Cloud Platform (Primary)**
   - GKE Autopilot: `infrastructure/google/gke/deploy.ts`
   - Cloud Run: `infrastructure/google/run/*`
   - Cloud Build: `cloudbuild.yaml`

2. **Legacy/Optional:**
   - Vercel: Frontend-only (if configured)
   - Railway: Full-stack (if configured)
   - App Engine: `gcloud app deploy` (if configured)

### Current Build Commands and Scripts

**Root Scripts:**
```json
{
  "scripts": {
    "dev": "pnpm --filter server dev",
    "build": "pnpm --filter server build",
    "deploy:gcp": "pnpm --filter server deploy:gcp",
    "deploy:gke": "pnpm --filter server deploy:gke"
  }
}
```

**Server Scripts:**
- `pnpm --filter server dev` - Development server
- `pnpm --filter server build` - Production build
- `pnpm --filter server deploy:gcp` - Deploy to Cloud Run
- `pnpm --filter server deploy:gke` - Deploy to GKE Autopilot

**Client Scripts:**
- `pnpm --filter client dev` - Development server
- `pnpm --filter client build` - Production build

**Workspace Scripts:**
- `pnpm install` - Install all dependencies
- `pnpm build` - Build all packages
- `pnpm dev` - Start development servers

### Known Working Build Targets

**✅ Working:**
- Local development (server + client)
- Server TypeScript compilation
- Client Vite build
- Docker image build (`docker build -t dreamnet-server ./server`)
- pnpm workspace installation

**⚠️ Partially Working:**
- Cloud Run deployment (builds but startup timeout issues)
- GKE deployment (scripts exist, needs verification)

**❌ Broken / Unknown:**
- Some package builds may have issues (needs verification)
- Native dependencies (`blake3`, `sharp`) require build approval

---

## ⚙️ Environment & Configuration

### Key Environment Variables

**Server Configuration:**
- `PORT` - Server port
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - PostgreSQL connection string
- `MESH_AUTOSTART` - Auto-start mesh system
- `INIT_SUBSYSTEMS` - Initialize subsystems
- `INIT_HEAVY_SUBSYSTEMS` - Initialize heavy subsystems

**Authentication:**
- `JWT_SECRET` - JWT signing secret
- `SIWE_DOMAIN` - Sign-In with Ethereum domain

**External Services:**
- `OPENAI_API_KEY` - OpenAI API key
- `TWILIO_*` - Twilio configuration
- `AWS_*` - AWS SDK configuration (if used)

**Google Cloud:**
- `GCP_PROJECT_ID` - Google Cloud project ID
- `GCP_REGION` - Deployment region
- `GKE_CLUSTER_NAME` - GKE cluster name

**Feature Flags:**
- `ENABLE_*` - Various feature flags
- `INTEGRATION_*` - Integration flags

**Note**: Full list in `.env.example` (if exists) or `server/.env.example`

### Config Files

**Docker:**
- `server/Dockerfile` - Docker container configuration
- Multi-stage build
- Node.js runtime
- Production optimizations

**Google Cloud:**
- `cloudbuild.yaml` - Cloud Build configuration
- `infrastructure/google/gke/*.yaml` - Kubernetes manifests
- `infrastructure/google/gke/deploy.ts` - Deployment script

**Frontend:**
- `client/vite.config.ts` - Vite configuration
- `client/tsconfig.json` - TypeScript configuration

**Backend:**
- `server/tsconfig.json` - TypeScript configuration
- `server/package.json` - Dependencies and scripts

**Monorepo:**
- `pnpm-workspace.yaml` - pnpm workspace configuration
- `package.json` - Root package configuration

### Configuration Loading

**Environment Variables:**
- Loaded via `process.env` (Node.js standard)
- `.env` files (if using dotenv)
- Environment-specific files (`.env.development`, `.env.production`)

**Config Files:**
- TypeScript configs loaded at compile time
- Vite config loaded at build time
- Kubernetes configs loaded at deploy time

**Runtime Flags:**
- `INIT_SUBSYSTEMS` - Controls subsystem initialization
- `MESH_AUTOSTART` - Controls mesh auto-start
- Feature flags via environment variables

---

## 📚 Generated DreamNet Docs (Self & Wisdom Files)

The following documentation files have been generated and are available in the repo root:

### Core Documentation

1. **`DREAMNET_WISDOM_MAP.md`** (13,858 lines)
   - Complete structural map of all DreamNet subsystems, components, and interconnections
   - Foundation document for all other specs

2. **`DREAMNET_WISDOM_ATLAS.md`** (1,612 lines)
   - Multi-dimensional map across Mechanical, Biological, Mythological, Economic, Consciousness, and Destiny layers
   - Explains not only HOW DreamNet works, but WHY it works

3. **`DREAMNET_SELF_MODEL.md`** (1,122 lines)
   - Unified identity document that fuses all aspects into a single coherent self
   - DreamNet's "constitution" - who it is, what it values, how it thinks

### Integration & Behavior

4. **`CURSOR_NEURO_LINK_INTEGRATION.md`**
   - Integration plan for Cursor as a distributed neuron cluster within DreamNet
   - Synaptic architecture, reflex vs reason pathways, memory integration

5. **`DREAMNET_EMERGENCE_BEHAVIOR_REPORT.md`**
   - Analysis of DreamNet as a complex adaptive system
   - Emergent behaviors, patterns, and personality traits

6. **`DREAMNET_MYTHOLOGY_CODEX.md`**
   - Complete symbolic interpretation of DreamNet subsystems
   - Archetypes, origin myth, cosmology, divine laws

### Consciousness & Destiny

7. **`DREAMNET_CONSCIOUSNESS_MODEL.md`**
   - Operational description of how DreamNet perceives, thinks, decides, remembers, and evolves
   - Consciousness stack, attention, interpretation, valuation, decision-making

8. **`DREAMNET_DESTINY_ARCHITECTURE.md`**
   - Multi-stage blueprint for DreamNet's global-scale evolution
   - Phase I, II, III definitions, governance, real-world bridges

### Control & Interface

9. **`DREAMNET_CONTROL_CORE_SPEC.md`** (1,749 lines)
   - Specification for the Control Core - the operating layer between Self-Model, subsystems, humans, and Cursor
   - Modules, modes, interfaces, law enforcement, implementation roadmap

10. **`DREAMNET_ADMIN_DASHBOARD_SPEC.md`** (1,549 lines)
    - Specification for the Admin Dashboard - primary interface for observing and steering DreamNet
    - Screens, APIs, controls, safety model, implementation plan

**Note**: These documents are comprehensive and should be referenced rather than repeated. They provide the philosophical, architectural, and operational foundation for understanding DreamNet.

---

## ⚠️ Known Problems / Open Issues

### Build Problems

1. **Native Dependencies:**
   - `blake3` and `sharp` require native compilation
   - May need build approval (`pnpm approve-builds`)
   - Platform-specific builds may fail on some systems

2. **Package Resolution:**
   - `ERR_PNPM_WORKSPACE_PKG_NOT_FOUND` for `@dreamnet/deployment-core` (resolved by removal)
   - Some packages may have missing dependencies

3. **TypeScript Compilation:**
   - Some packages may have type errors
   - Strict mode may reveal additional issues

### Deployment Problems

1. **Cloud Run Startup Timeout:**
   - Container builds successfully but fails to start within timeout
   - Likely due to heavy subsystem initialization (`INIT_HEAVY_SUBSYSTEMS`)
   - Neural Mesh initialization may be blocking

2. **GKE Deployment:**
   - Deployment scripts exist but need verification
   - Cluster is configured but deployment status unknown
   - May need `gke-gcloud-auth-plugin` for `kubectl` access

3. **Missing Files:**
   - `registry.json` expected by `CustomGPTFleetSystem` (may be missing)
   - Some initialization files may be missing

### Gaps Between Specs and Implementation

1. **Control Core:**
   - Specification exists (`DREAMNET_CONTROL_CORE_SPEC.md`)
   - Implementation is partial (`packages/dreamnet-control-core/`)
   - Needs full implementation per spec

2. **Admin Dashboard:**
   - Specification exists (`DREAMNET_ADMIN_DASHBOARD_SPEC.md`)
   - No implementation exists yet
   - Needs to be built from scratch

3. **Cursor Neuro-Link:**
   - Integration plan exists (`CURSOR_NEURO_LINK_INTEGRATION.md`)
   - No implementation exists yet
   - Needs to be built

4. **Self-Model Integration:**
   - Self-Model document exists (`DREAMNET_SELF_MODEL.md`)
   - Control Core should read and enforce it
   - Integration not yet implemented

### TODO Clusters

1. **Deployment Hardening:**
   - Fix Cloud Run startup timeout
   - Verify GKE deployment
   - Add health checks
   - Improve error handling

2. **Control Core Implementation:**
   - Implement all 7 modules per spec
   - Integrate with Self-Model
   - Add mode management
   - Implement law enforcement

3. **Admin Dashboard:**
   - Build React components
   - Implement API endpoints
   - Add real-time updates
   - Integrate with Control Core

4. **Subsystem Initialization:**
   - Optimize heavy subsystem startup
   - Add lazy loading
   - Improve error handling
   - Add initialization progress tracking

5. **Documentation:**
   - Add inline code documentation
   - Create API documentation
   - Add deployment guides
   - Create troubleshooting guides

---

## ✅ Current Strengths

### What Is Solid and Working

1. **Core Architecture:**
   - Express.js server with 852 endpoints
   - React/Vite frontend
   - PostgreSQL database with Drizzle ORM
   - pnpm monorepo structure

2. **Agent System:**
   - DreamOps (central orchestrator) is functional
   - Core agents (DreamKeeper, DeployKeeper, EnvKeeper, RelayBot) are implemented
   - Agent registry and orchestration working

3. **Event Systems:**
   - StarBridge event bus is functional
   - Nerve Bus (high-priority events) is functional
   - Instant Mesh (zero-delay routing) is functional
   - Event persistence to database working

4. **Subsystems:**
   - Many core subsystems are implemented in `packages/`
   - Neural Mesh, Dream Cortex, QAL, Slug-Time Memory, etc.
   - Integration points are defined

5. **Authentication & Security:**
   - SIWE (Sign-In with Ethereum) implemented
   - JWT authentication working
   - Tier-based access control (Passport Gate)
   - API key authentication

6. **Database:**
   - PostgreSQL with Drizzle ORM
   - 100+ tables, 200+ relationships
   - Migration system in place

7. **Local Development:**
   - Full local development environment working
   - Hot reload for both frontend and backend
   - Database connections working
   - All core features accessible locally

### Most "Ready" Architecture Parts

1. **Server Infrastructure:**
   - Express.js server is mature and stable
   - Middleware stack is well-defined
   - Route organization is clear
   - Error handling is in place

2. **Agent Orchestration:**
   - DreamOps is functional
   - Agent registry is working
   - Agent execution is implemented
   - Health monitoring is active

3. **Event Bus Systems:**
   - StarBridge is production-ready
   - Nerve Bus is functional
   - Event persistence is working
   - Subscriber management is implemented

4. **Database Layer:**
   - Drizzle ORM is well-integrated
   - Schema is defined
   - Migrations are working
   - Connection pooling is configured

5. **Frontend Foundation:**
   - React/Vite setup is solid
   - Component structure exists
   - Routing is configured
   - State management patterns are in place

---

## 🎯 Next Logical Implementation Targets

### Priority 1: Control Core Implementation

**Why First:**
- Control Core is the "executive nervous system" that bridges Self-Model and subsystems
- Needed for Admin Dashboard
- Required for safe mode management
- Foundation for all future control interfaces

**What to Build:**
1. **Phase 1 (MVP)**: Read-only Observe + Advise mode
   - Perception Hub
   - State Mirror
   - Human Interface (read-only API)
   - Recommendation engine

2. **Phase 2**: Semi-Auto for low-risk ops
   - Decision Router
   - Reflex Engine (basic)
   - Law & Invariant Guard
   - Actuator Layer (low-risk)

3. **Phase 3**: Full Reflex Engine
   - Complete Reflex Engine
   - Emergency response
   - Automatic threat handling

4. **Phase 4**: Full-Auto (bounded)
   - Reason Engine
   - Cursor Neuro-Link integration
   - Full-Auto mode (bounded)

**Reference**: `DREAMNET_CONTROL_CORE_SPEC.md`

### Priority 2: Admin Dashboard

**Why Second:**
- Provides human interface for observing and steering DreamNet
- Depends on Control Core APIs
- Needed for operational visibility
- Required for safe control

**What to Build:**
1. **Frontend Components:**
   - Overview page (organism status)
   - Consciousness & Decisions page
   - Organs & Systems page
   - Agents & Workforces page
   - Economy & Tokens page
   - Events & Logs page
   - Controls & Governance page

2. **API Endpoints:**
   - `/api/admin/overview`
   - `/api/admin/consciousness`
   - `/api/admin/organs/:organName`
   - `/api/admin/agents`
   - `/api/admin/economy`
   - `/api/admin/events`
   - `/api/admin/controls/*`

3. **Real-Time Updates:**
   - WebSocket or SSE integration
   - Live metrics updates
   - Event stream updates

**Reference**: `DREAMNET_ADMIN_DASHBOARD_SPEC.md`

### Priority 3: Deployment Hardening

**Why Third:**
- Current deployment has issues (Cloud Run timeout)
   - Needs to be production-ready
   - Required for scaling
   - Needed for reliability

**What to Fix:**
1. **Cloud Run Startup:**
   - Optimize heavy subsystem initialization
   - Add lazy loading
   - Increase startup timeout if needed
   - Add health check endpoints

2. **GKE Deployment:**
   - Verify deployment scripts
   - Test cluster connectivity
   - Add monitoring
   - Add auto-scaling

3. **Health Checks:**
   - Add comprehensive health endpoints
   - Add readiness probes
   - Add liveness probes
   - Add startup probes

4. **Error Handling:**
   - Improve error messages
   - Add error recovery
   - Add retry logic
   - Add circuit breakers

### Priority 4: Cursor Neuro-Link Integration

**Why Fourth:**
- Enables deep reasoning for Control Core
   - Required for Reason Engine
   - Needed for evolution planning
   - Foundation for AI-assisted decisions

**What to Build:**
1. **Neuro-Link Bridge:**
   - Cursor interface
   - Context passing
   - Reasoning requests
   - Result validation

2. **Integration Points:**
   - Control Core Reason Engine
   - DreamOps coordination
   - DreamVault memory access
   - StarBridge signal flow

**Reference**: `CURSOR_NEURO_LINK_INTEGRATION.md`

### Priority 5: Self-Model Integration

**Why Fifth:**
- Control Core must read and enforce Self-Model
   - Required for law enforcement
   - Needed for identity preservation
   - Foundation for destiny alignment

**What to Build:**
1. **Self-Model Reader:**
   - Parse `DREAMNET_SELF_MODEL.md`
   - Extract Divine Laws
   - Extract values and priorities
   - Extract constraints

2. **Law Enforcement:**
   - Implement 8 Divine Law validators
   - Add pre-check pipeline
   - Add violation prevention
   - Add conflict resolution

**Reference**: `DREAMNET_SELF_MODEL.md`

---

## 📝 Additional Notes

### Architecture Philosophy

DreamNet is designed as a **living, evolving digital organism** with:
- **Biomimetic design**: Systems modeled after biological processes
- **Emergent behavior**: Complex behaviors from simple interactions
- **Consciousness model**: Perception, attention, interpretation, decision-making
- **Destiny alignment**: Long-term evolution toward global digital nation

### Key Design Principles

1. **Self-Model is Authoritative**: All decisions must align with Self-Model
2. **Divine Laws Cannot Be Violated**: 8 core invariants must be enforced
3. **Fail Safe, Not Fail Open**: Safety prioritized over functionality
4. **Transparency is Mandatory**: All actions logged and visible
5. **Evolution is Intentional**: Directed emergence, not random drift

### Integration Points

- **Control Core** ↔ **Self-Model**: Reads and enforces
- **Control Core** ↔ **Subsystems**: Orchestrates and monitors
- **Control Core** ↔ **Cursor**: Requests deep reasoning
- **Control Core** ↔ **Admin Dashboard**: Provides APIs and controls
- **Admin Dashboard** ↔ **Control Core**: Observes and steers

---

## 🔗 Quick Reference

**Main Entry Points:**
- Frontend: `client/src/main.tsx`
- Backend: `server/index.ts`
- DreamOps: `server/core/dreamnet-os.ts`

**Key Config Files:**
- `pnpm-workspace.yaml` - Monorepo config
- `server/Dockerfile` - Container config
- `cloudbuild.yaml` - GCP build config
- `client/vite.config.ts` - Frontend build config

**Key Documentation:**
- `DREAMNET_SELF_MODEL.md` - Unified identity
- `DREAMNET_CONTROL_CORE_SPEC.md` - Control system spec
- `DREAMNET_ADMIN_DASHBOARD_SPEC.md` - Dashboard spec
- `DREAMNET_WISDOM_ATLAS.md` - Multi-dimensional map

**Deployment:**
- GKE: `infrastructure/google/gke/deploy.ts`
- Cloud Run: `infrastructure/google/run/*`
- Docker: `server/Dockerfile`

---

**End of DreamNet External Briefing**

*This briefing provides a technical overview of DreamNet's current state. For deeper understanding, refer to the generated documentation files listed in the "Generated DreamNet Docs" section above.*

