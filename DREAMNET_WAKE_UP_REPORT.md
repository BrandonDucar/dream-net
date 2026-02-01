# DreamNet Wake-Up Report
**Generated:** $(date)  
**Purpose:** Complete mental model reconstruction of DreamNet monorepo

---

## Executive Summary

DreamNet is a **multi-agent, biomimetic AI + Web3 organism** deployed as a monorepo with:
- **Core Server** (Express.js) serving API + frontend
- **DreamNet OS** with 4 core agents (DreamKeeper, DeployKeeper, RelayBot, EnvKeeper)
- **20+ biomimetic subsystems** (Neural Mesh, Star Bridge Lungs, Slug-Time Memory, etc.)
- **Base blockchain mini-apps** and smart contracts
- **Google Cloud Platform** as primary infrastructure (GKE Autopilot + Cloud Run)
- **Simplified startup** via `INIT_HEAVY_SUBSYSTEMS` flag

---

## 1. Repository Structure

### Top-Level Organization

```
dream-net/
├── server/              # Express.js backend (serves API + frontend)
├── client/              # React/Vite frontend (Dream Hub + mini-apps)
├── packages/            # 80+ workspace packages (biomimetic subsystems)
├── apps/                # Standalone apps (hub, dreamos, sitebuilder, etc.)
├── infrastructure/      # Cloud deployment scripts
│   ├── google/         # GCP deployment (GKE + Cloud Run)
│   └── aws/            # AWS deployment (EKS + Lambda)
├── docs/                # Extensive documentation
├── contracts/           # Base blockchain smart contracts
└── scripts/             # Utility scripts
```

### Key Entry Points

**Server:**
- `server/index.ts` - Main Express server entrypoint
- `server/core/dreamnet-os.ts` - DreamNet OS core
- `server/core/agents/` - Core agents (DreamKeeper, DeployKeeper, RelayBot, EnvKeeper)
- `server/routes/` - 200+ route files

**Client:**
- `client/src/main.tsx` - React app entrypoint
- `client/src/App.tsx` - Main app component
- `client/src/miniapps/` - Base mini-apps registry

**Infrastructure:**
- `infrastructure/google/gke/deploy.ts` - GKE deployment script
- `infrastructure/google/deploy-all.ts` - Cloud Run deployment script
- `infrastructure/google/gke/*.yaml` - Kubernetes manifests

---

## 2. Core Systems

### DreamNet OS (Minimal)

**Location:** `server/core/dreamnet-os.ts`

**Purpose:** Agent orchestration system exposing `/api/agent` endpoint

**Core Agents:**
1. **DreamKeeper** - Health diagnostics, self-healing
2. **DeployKeeper** - Deployment management
3. **RelayBot** - Message dispatch/routing
4. **EnvKeeper** - Environment/config management

**API:**
- `GET /api/agents` - List available agents
- `POST /api/agent` - Run an agent with input

### Biomimetic Subsystems

**Tier II (Core Biomimetic):**
- Neural Mesh - Synapse network
- Quantum Anticipation Layer (QAL)
- Squad Alchemy Engine
- Wolf-Pack Protocol (WPP)
- Octopus Executor (8-Arm Runtime)
- Slug-Time Memory Layer (STM)
- Star Bridge Lungs - Cross-chain breathwork ⭐
- Predator–Scavenger Loop (PSL)

**Tier III (Advanced):**
- Dream Cortex - Global intent/goal engine
- Reputation Lattice - Trust weave
- Narrative Field - Global story stream
- Identity Grid - Wallet + agent identity layer

**Tier IV (Application Layer):**
- Dream Vault - Central repository
- Dream Shop - Marketplace layer
- Field Layer - Global parameter fields
- DreamBet Core - Games + fairness engine
- Zen Garden Core - Ritual + activity engine
- Civic Panel Core - Admin + status layer
- Dream Tank Core - Incubator engine
- Liquidity Engine - Liquidity pool registry
- Social Hub Core - Social feed layer
- Init & Ritual Core - Onboarding layer
- Economic Engine Core - Rewards + tokens
- Agent Registry Core - Agent store + health
- DreamNet OS Core - Global status + heartbeat

**Zero-Touch Systems:**
- Env Keeper Core - Auto-discovers ALL env vars
- API Keeper Core - Auto-discovers API keys
- AI SEO Core - AUTO-SEO for ALL content
- Webhook Nervous Core - Auto-discovers webhooks
- Jaggy Core - Silent Sentinel (webhook hunter)

**Packages Location:** `packages/*` (80+ packages)

### Star Bridge ("Lungs")

**Location:** `server/routes/star-bridge.ts`, `packages/star-bridge-lungs`

**Purpose:** Cross-chain monitoring and "breathing" (network flows)

**API:**
- `GET /api/star-bridge` - Status
- `GET /api/star-bridge/chains` - Chain metrics
- `GET /api/star-bridge/breaths` - Breath snapshots

---

## 3. Infrastructure & Deployment

### Google Cloud Platform (Primary)

**GKE Autopilot Cluster:**
- **Name:** `autopilot-cluster-1`
- **Region:** `us-central1`
- **Type:** Autopilot (managed)
- **Purpose:** Host DreamNet as multi-service organism

**Cloud Run:**
- **Purpose:** Simpler, serverless deployment option
- **Port:** 8080 (uses `$PORT` env var)
- **Memory:** 2Gi (configurable)
- **CPU:** 2 (configurable)

### Deployment Scripts

**Root `package.json` scripts:**

1. **Local Development:**
   - `pnpm dev` - Run all workspaces in parallel
   - `pnpm dev:app` - Run server only (`tsx server/index.ts`)

2. **Cloud Run:**
   - `pnpm deploy:gcp` - Deploy to Cloud Run (`infrastructure/google/deploy-all.ts`)
   - `pnpm deploy:data-gcp` - Deploy data infrastructure (`infrastructure/google/data/deploy.ts`)

3. **GKE:**
   - `pnpm deploy:gke` - Deploy to GKE Autopilot (`infrastructure/google/gke/deploy.ts`)

**Deployment Flow (GKE):**
1. Verify `gcloud` authentication
2. Check if cluster exists (create if needed)
3. Get cluster credentials (`gcloud container clusters get-credentials`)
4. Build Docker images (`gcloud builds submit`)
5. Push to GCR (`gcr.io/${PROJECT_ID}/dreamnet-api:latest`)
6. Create Kubernetes secrets
7. Apply deployment manifests (`deployment.yaml`, `service.yaml`, `ingress.yaml`)

**Deployment Flow (Cloud Run):**
1. Build Docker image (`gcloud builds submit`)
2. Deploy service (`gcloud run deploy`)
3. Set environment variables
4. Get service URL

### Kubernetes Manifests

**Location:** `infrastructure/google/gke/`

**Files:**
- `deployment.yaml` - API + Frontend deployments (3 replicas, HPA)
- `service.yaml` - LoadBalancer services (port 80 → 8080)
- `ingress.yaml` - GCE ingress for `dreamnet.ink` domain
- `cluster.yaml` - Cluster configuration (if using Config Connector)

**Key Configuration:**
- **Image:** `gcr.io/aqueous-tube-470317-m6/dreamnet-api:latest` (hardcoded, needs update)
- **Port:** 8080 (container), 80 (service)
- **Health Checks:** `/health/live`, `/health/ready`
- **Resources:** 500m-2000m CPU, 1Gi-4Gi memory
- **Autoscaling:** 3-20 replicas (70% CPU, 80% memory)

### Docker Configuration

**Dockerfile:** Root-level `Dockerfile`

**Build Process:**
1. Install pnpm globally
2. Copy package files
3. Install dependencies (`pnpm install --frozen-lockfile`)
4. Build frontend (`cd client && pnpm build`)
5. Build backend (`cd server && pnpm build`)
6. Copy `vite.ts` to `dist/vite.js` (for static serving)
7. Expose port 8080
8. Start server (`node server/dist/index.js`)

**Cloud Build:** `cloudbuild.yaml` (alternative build process)

---

## 4. Environment Variables

### Required

- `NODE_ENV` - `development` | `production` | `test`
- `PORT` - Server port (default: 3000, Cloud Run: 8080)

### Optional (Server can start without)

- `DATABASE_URL` - PostgreSQL connection string (GCP Cloud SQL or Neon)
- `CLOUD_SQL_INSTANCE_CONNECTION_NAME` - For Cloud SQL Proxy
- `GCP_PROJECT_ID` / `GOOGLE_CLOUD_PROJECT` - GCP project ID
- `GCP_REGION` / `GOOGLE_CLOUD_REGION` - GCP region (default: `us-central1`)
- `GCP_SERVICE_NAME` - Cloud Run service name
- `OPENAI_API_KEY` - OpenAI API key
- `ALLOWED_ORIGINS` - Comma-separated CORS origins
- `OPERATOR_WALLETS` - Comma-separated operator wallet addresses

### Feature Flags

- `INIT_SUBSYSTEMS` - Enable optional subsystems (default: `false`)
- `INIT_HEAVY_SUBSYSTEMS` - Enable heavy subsystems (DreamState, Directory, Nerve Fabric) (default: `false`)
- `MESH_AUTOSTART` - Auto-start mesh on server start (default: `true`)

### Legacy (Optional)

- `VERCEL_TOKEN` - Vercel integration (optional)
- `RAILWAY_TOKEN` - Railway integration (legacy, not needed for GCP)

**Note:** No `.env.example` file found. Should be created.

---

## 5. Server Startup Behavior

### Simplified Startup (Default)

**When `INIT_HEAVY_SUBSYSTEMS=false` (default):**
- ✅ Core server starts
- ✅ Core agents (DreamKeeper, DeployKeeper, RelayBot, EnvKeeper) available
- ✅ Star Bridge routes active
- ✅ Basic API routes work
- ❌ Heavy subsystems disabled (DreamState, Directory, Nerve Fabric, etc.)
- ❌ Most biomimetic subsystems not initialized

**When `INIT_SUBSYSTEMS=true` but `INIT_HEAVY_SUBSYSTEMS=false`:**
- ✅ Tier II subsystems initialized (Neural Mesh, Star Bridge Lungs, etc.)
- ❌ Tier III/IV subsystems still disabled

**When `INIT_HEAVY_SUBSYSTEMS=true`:**
- ✅ All subsystems initialized
- ✅ DreamState, Directory, Nerve Fabric enabled
- ⚠️ Slower startup, more memory usage

### Startup Sequence (`server/index.ts`)

1. Load environment config (`server/config/env.ts`)
2. Create Express app
3. Setup middleware (CORS, rate limiting, body parsing)
4. Register health endpoints (`/health`, `/ready`)
5. Register API routes (200+ routes)
6. Setup Vite (dev) or static serving (prod)
7. Start HTTP server on `$PORT`
8. Initialize optional subsystems asynchronously (non-blocking)

**Key Routes:**
- `/health` - Health check (checks DB if configured)
- `/ready` - Readiness probe
- `/api/agent` - DreamNet OS agent endpoint
- `/api/star-bridge` - Star Bridge status
- `/api/*` - 200+ other API routes

---

## 6. Key Issues & Observations

### Critical Issues

1. **Hardcoded Project ID in K8s Manifests**
   - `deployment.yaml` line 22: `gcr.io/aqueous-tube-470317-m6/dreamnet:latest`
   - Should use `${PROJECT_ID}` or be replaced by deploy script
   - **Fix:** Deploy script already replaces this, but manifests should be templated

2. **Missing `.env.example`**
   - No example env file for developers
   - **Fix:** Create `.env.example` with all documented env vars

3. **Dockerfile Path Mismatch**
   - GKE deploy script uses `-f server/Dockerfile` but Dockerfile is at root
   - **Fix:** Update deploy script or move Dockerfile

4. **Frontend Dockerfile Missing**
   - `deployment.yaml` references `dreamnet-frontend` image but no `client/Dockerfile`
   - Frontend is built in root Dockerfile, not separate
   - **Fix:** Update deployment.yaml to remove frontend container or create separate Dockerfile

5. **Health Check Endpoints**
   - Deployment uses `/health/live` and `/health/ready` but server only has `/health` and `/ready`
   - **Fix:** Add `/health/live` and `/health/ready` routes or update deployment.yaml

### Potential Issues

1. **Import Paths**
   - Many imports converted from `@dreamnet/*` to relative paths (`../../packages/*`)
   - Some may still be broken
   - **Fix:** Verify all imports work

2. **Missing Dependencies**
   - `axios` and `vm2` added recently (for agent isolation)
   - May need more dependencies
   - **Fix:** Run `pnpm install` and check for missing modules

3. **Database Optional**
   - Server can start without `DATABASE_URL`
   - Some routes may fail if DB not configured
   - **Fix:** Add graceful degradation for DB-dependent routes

4. **GKE Ingress Configuration**
   - Ingress references static IP `dreamnet-ip` and cert `dreamnet-ssl`
   - These must be created manually
   - **Fix:** Document manual setup or add to deploy script

### Observations

1. **Massive Refactor Recently**
   - 205 files changed, 34k+ insertions
   - Many imports converted to relative paths
   - Server startup simplified with flags

2. **Legacy Infrastructure**
   - Vercel, Railway, Neon configs still present
   - Marked as optional/legacy
   - Should be documented as deprecated

3. **Complex Subsystem Graph**
   - 80+ packages with interdependencies
   - Many subsystems depend on others
   - Startup order matters (handled by flags)

4. **Base Blockchain Integration**
   - Smart contracts in `contracts/`
   - Mini-apps in `client/src/miniapps/`
   - Base is primary chain

---

## 7. Deployment Paths Summary

### Local Development

```bash
# Install dependencies
pnpm install

# Run server (with all workspaces)
pnpm dev

# Run server only
pnpm dev:app
```

**Expected:**
- Server starts on port 3000 (or `$PORT`)
- Frontend served via Vite (dev) or static files (prod)
- API available at `http://localhost:3000/api/*`

### Cloud Run Deployment

```bash
# Set env vars
export GCP_PROJECT_ID=your-project-id
export GCP_REGION=us-central1

# Deploy
pnpm deploy:gcp
```

**What it does:**
1. Builds Docker image (`gcloud builds submit`)
2. Deploys to Cloud Run (`gcloud run deploy`)
3. Sets environment variables
4. Returns service URL

**Expected:**
- Service available at `https://dreamnet-{hash}-{region}.a.run.app`
- Can map custom domain (`dreamnet.ink`)

### GKE Autopilot Deployment

```bash
# Set env vars
export GCP_PROJECT_ID=your-project-id
export GCP_REGION=us-central1
export GKE_CLUSTER_NAME=autopilot-cluster-1

# Authenticate
gcloud auth login
gcloud config set project $GCP_PROJECT_ID

# Deploy
pnpm deploy:gke
```

**What it does:**
1. Checks cluster exists (creates if needed)
2. Gets cluster credentials
3. Builds Docker images (`gcloud builds submit`)
4. Pushes to GCR
5. Creates secrets (if `secrets.yaml` exists)
6. Applies Kubernetes manifests
7. Sets up ingress

**Expected:**
- API available at `http://dreamnet.ink/api/*` (after ingress setup)
- Frontend at `http://dreamnet.ink/`
- 3+ pods running (autoscaling 3-20)

**Prerequisites:**
- Static IP created: `dreamnet-ip`
- Managed certificate created: `dreamnet-ssl`
- DNS configured: `dreamnet.ink` → static IP

---

## 8. Scripts Reference

### Root Scripts (`package.json`)

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `pnpm -r --parallel run dev` | Run all workspaces in parallel |
| `dev:app` | `cross-env NODE_ENV=development tsx server/index.ts` | Run server only |
| `build` | `pnpm -r --if-present run build` | Build all workspaces |
| `start` | `NODE_ENV=production node server/dist/index.js` | Start production server |
| `deploy:gcp` | `tsx infrastructure/google/deploy-all.ts` | Deploy to Cloud Run |
| `deploy:data-gcp` | `tsx infrastructure/google/data/deploy.ts` | Deploy data infra |
| `deploy:gke` | `tsx infrastructure/google/gke/deploy.ts` | Deploy to GKE |
| `deploy:base-mainnet` | `hardhat run scripts/contracts/deploy.ts --network baseMainnet` | Deploy Base contracts |

### Server Scripts (`server/package.json`)

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `tsx index.ts` | Run server in dev mode |
| `build` | `node build.cjs` | Build server |
| `start` | `node dist/index.js` | Start production server |

---

## 9. Documentation Files

### Key Docs

- `docs/GKE_SETUP.md` - GKE cluster setup guide
- `docs/GOOGLE_CLOUD_DEPLOYMENT.md` - Cloud Run deployment guide
- `docs/dreamnet.md` - DreamNet OS minimal spec
- `docs/GKE_CLUSTER_STATUS.md` - Cluster status tracking

### Other Docs

- `docs/GOOGLE_CLOUD_*.md` - Various GCP setup guides
- `docs/BASE_*.md` - Base blockchain integration docs
- `docs/BIOMIMETIC_*.md` - Biomimetic system docs
- `docs/AGENT_*.md` - Agent ecosystem docs

---

## 10. Action Plan

### Phase 1: Fix Critical Issues

1. **Create `.env.example`**
   - Document all env vars
   - Include defaults and descriptions

2. **Fix Health Check Endpoints**
   - Add `/health/live` and `/health/ready` routes
   - Or update `deployment.yaml` to use `/health` and `/ready`

3. **Fix Dockerfile Path**
   - Update GKE deploy script to use root Dockerfile
   - Or move Dockerfile to `server/`

4. **Fix Frontend Container**
   - Remove frontend container from `deployment.yaml` (frontend served by API)
   - Or create separate `client/Dockerfile` if needed

5. **Verify Import Paths**
   - Check all relative imports work
   - Fix any broken imports

### Phase 2: Verify Server Health

1. **Test Local Startup**
   - Run `pnpm dev:app`
   - Verify server starts without errors
   - Test `/health`, `/ready`, `/api/agent`, `/api/star-bridge`

2. **Test Docker Build**
   - Build Docker image locally
   - Verify image runs
   - Test health endpoints

3. **Test Cloud Run Deploy**
   - Run `pnpm deploy:gcp` (dry-run or test project)
   - Verify deployment succeeds
   - Test service URL

### Phase 3: Harden GKE Deployment

1. **Update K8s Manifests**
   - Template project ID (or ensure deploy script replaces it)
   - Fix health check paths
   - Remove frontend container (or create separate deployment)

2. **Document Prerequisites**
   - Static IP creation
   - Managed certificate creation
   - DNS configuration

3. **Test GKE Deploy**
   - Run `pnpm deploy:gke` (dry-run or test cluster)
   - Verify pods start
   - Verify services work
   - Verify ingress routes traffic

### Phase 4: Documentation & Cleanup

1. **Consolidate Deployment Docs**
   - Create single deployment guide
   - Document all paths (local, Cloud Run, GKE)

2. **Mark Legacy Infrastructure**
   - Document Vercel/Railway/Neon as legacy
   - Keep configs but mark deprecated

3. **Update README**
   - Add quick start guide
   - Document env vars
   - Link to deployment guides

---

## 11. Environment Variables Checklist

### Required for Server Startup
- [x] `NODE_ENV` (defaults to `development` if not set, but should be explicit)
- [x] `PORT` (defaults to 3000, Cloud Run uses 8080)

### Required for Full Functionality
- [ ] `DATABASE_URL` (optional - server can start without)
- [ ] `GCP_PROJECT_ID` (for GCP deployments)
- [ ] `GCP_REGION` (defaults to `us-central1`)

### Optional (Features May Be Limited)
- [ ] `OPENAI_API_KEY` (for AI features)
- [ ] `ALLOWED_ORIGINS` (CORS, defaults to `*`)
- [ ] `OPERATOR_WALLETS` (admin wallets)
- [ ] `INIT_SUBSYSTEMS` (enable Tier II subsystems)
- [ ] `INIT_HEAVY_SUBSYSTEMS` (enable all subsystems)

### Legacy (Not Needed for GCP)
- [ ] `VERCEL_TOKEN` (optional Vercel integration)
- [ ] `RAILWAY_TOKEN` (legacy, not needed)

---

## 12. Mental Model Summary

### What DreamNet Is

DreamNet is a **living, evolving organism** that:
- Runs as a multi-service deployment (GKE or Cloud Run)
- Exposes a unified API (`/api/agent`) for agent orchestration
- Manages its own health, deployments, and environment
- Connects to Base blockchain for mini-apps and contracts
- Uses biomimetic subsystems to mirror biological processes

### How Systems Fit Together

1. **Server** (`server/index.ts`) is the entrypoint
2. **DreamNet OS** (`server/core/dreamnet-os.ts`) orchestrates agents
3. **Agents** (`server/core/agents/`) perform specific tasks
4. **Routes** (`server/routes/`) expose HTTP endpoints
5. **Packages** (`packages/*`) provide biomimetic subsystems
6. **Client** (`client/`) provides UI (Dream Hub + mini-apps)
7. **Infrastructure** (`infrastructure/`) handles deployment

### Current State

- ✅ Server startup simplified (flags control heavy subsystems)
- ✅ Core agents working (DreamKeeper, DeployKeeper, RelayBot, EnvKeeper)
- ✅ Star Bridge routes active
- ✅ GKE deployment scripts exist
- ✅ Cloud Run deployment scripts exist
- ⚠️ Some import paths may be broken
- ⚠️ Health check endpoints mismatch
- ⚠️ K8s manifests need updates
- ⚠️ Missing `.env.example`

### Next Steps

1. Fix critical issues (health checks, Dockerfile path, frontend container)
2. Verify server starts locally
3. Test Docker build
4. Test Cloud Run deploy
5. Harden GKE deployment
6. Document everything

---

**End of Report**

