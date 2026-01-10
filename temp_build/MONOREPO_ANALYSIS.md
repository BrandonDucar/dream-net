# DreamNet Monorepo Full Analysis & Deployment Readiness Report

Generated: $(date)

## Executive Summary

**Total Apps:** 5 (`client`, `server`, `apps/site`, `apps/api-forge`, `apps/hub`, `apps/dreamos`, `apps/seo`, `apps/sitebuilder`)
**Total Packages:** 80+ packages in `/packages`
**Status:** 
- ✅ **Client** - Builds successfully, ready for Vercel
- ⚠️ **Server** - Builds but Railway deployment failing (start command issue)
- ❓ **Apps** - Not configured for deployment
- ✅ **Packages** - Most compile, some missing exports

---

## 1. WHAT IS WORKING ✅

### Client (`client/`)
- **Status:** ✅ BUILDING & READY
- **Build:** `npm run build` succeeds
- **Output:** `client/dist/`
- **Vite Config:** Fixed with ESM-compatible path resolution
- **Routing:** Complete with 50+ routes, DreamNet Hub at `/`
- **Dependencies:** All resolved correctly
- **Vercel Config:** `vercel.json` configured with rootDirectory: `client`

### Server (`server/`)
- **Status:** ⚠️ BUILDING BUT NOT STARTING ON RAILWAY
- **Build:** `pnpm --filter @dreamnet/server build` succeeds
- **Output:** `server/dist/index.js` created
- **Routes:** 50+ API routes registered
- **Agent Loops:** WhalePack control loop configured
- **Database:** Neon PostgreSQL integration ready (optional)
- **Issue:** Railway can't find start script (Nixpacks detection issue)

### Packages
- **@dreamnet/base-mini-apps:** ✅ Complete with 32 mini-apps
- **@dreamnet/shield-core:** ✅ Working
- **@dreamnet/api-keeper-core:** ✅ Working
- **@dreamnet/economic-engine-core:** ✅ Working
- **All @dreamnet/*-core packages:** ✅ Most working

### Shared Modules (`shared/`)
- **schema.ts:** ✅ Complete Drizzle schema
- **tokens.ts:** ✅ Token definitions
- **agents.ts:** ✅ Agent definitions
- **dream-cloud.ts:** ✅ Dream cloud types
- **identity.ts:** ✅ Identity types

---

## 2. WHAT IS BROKEN ❌

### Critical Issues

#### A. Railway Backend Deployment
**Problem:** Railway/Nixpacks can't find start command
**Error:** `None of the selected packages has a "start" script`
**Location:** `railway.toml`, `package.json` root start script
**Impact:** Backend not deployable to Railway
**Fix Needed:** Configure Railway service start command or fix Nixpacks detection

#### B. Missing @shared Module Exports
**Problem:** Client imports `@shared/tokens`, `@shared/agents`, `@shared/schema` but some may not export correctly
**Files Affected:**
- `client/src/pages/token-demo.tsx`
- `client/src/pages/simple-token-demo.tsx`
- `client/src/components/TokenSelector.tsx`
- `client/src/components/AgentSelector.tsx`
- And 15+ more files

**Status:** Files exist in `shared/` but need verification of exports

#### C. Vercel Frontend Deployment
**Problem:** Vercel build may fail due to path resolution (recently fixed but needs verification)
**Status:** Fixed in `client/vite.config.ts` with ESM-compatible paths
**Needs:** Verification on Vercel

### Non-Critical Issues

#### D. Apps Not Configured for Deployment
- `apps/site` - Has build script but no deployment config
- `apps/api-forge` - Has build script but no deployment config
- `apps/hub` - TypeScript package, no deployment config
- `apps/dreamos` - TypeScript package, no deployment config
- `apps/seo` - TypeScript package, no deployment config
- `apps/sitebuilder` - TypeScript package, no deployment config

#### E. Commented Out Imports
- `server/index.ts` line 22: `createMediaRouter` disabled (missing @dreamnet/media-vault)
- `server/index.ts` line 26: `createPosterRouter` disabled (missing @dreamnet/media-vault)

---

## 3. WHAT EACH APP NEEDS BEFORE DEPLOYMENT

### Client (`client/`) - ✅ READY
**Needs:**
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Vite config: Fixed
- ✅ Environment: `VITE_API_URL` (set after Railway backend URL)
- **Action:** Deploy to Vercel after backend URL is available

### Server (`server/`) - ⚠️ NEEDS FIX
**Needs:**
- ✅ Build command: `pnpm --filter @dreamnet/server build`
- ✅ Start command: `node server/dist/index.js`
- ❌ Railway start command configuration
- ✅ Environment variables:
  - `NODE_ENV=production` ✅ Set
  - `PORT` (Railway auto-assigns)
  - `DATABASE_URL` (optional)
  - `OPENAI_API_KEY` (optional)
- **Action:** Fix Railway start command detection

### Apps (`apps/*`) - ❓ NOT PRIORITY
**apps/site:**
- Build: `tsc && vite build`
- Output: `dist/`
- Needs: Vercel project configuration

**apps/api-forge:**
- Build: `tsc && vite build`
- Output: `dist/`
- Needs: Vercel project configuration

**apps/hub, dreamos, seo, sitebuilder:**
- TypeScript packages, not deployable apps
- Used as libraries

---

## 4. FIX ORDER (Priority)

### Phase 1: Critical - Backend Deployment (IMMEDIATE)
1. **Fix Railway Start Command**
   - Option A: Set start command in Railway web UI
   - Option B: Fix `railway.toml` or `nixpacks.toml`
   - Option C: Update root `package.json` start script
   - **Files:** `railway.toml`, `package.json`, `nixpacks.toml`, `Procfile`

2. **Verify Backend Health Endpoints**
   - Test `/health`
   - Test `/api/system/graph`
   - Test `/alive`
   - **Action:** After Railway deployment succeeds

### Phase 2: Critical - Frontend Deployment (AFTER BACKEND)
3. **Deploy Client to Vercel**
   - Verify build succeeds on Vercel
   - Set `VITE_API_URL` environment variable
   - **Action:** `vercel --prod` from `client/`

4. **Wire Frontend to Backend**
   - Update `client/.env` with Railway backend URL
   - Redeploy frontend
   - **Action:** After Railway backend is live

### Phase 3: Verification (AFTER DEPLOYMENT)
5. **Verify Shared Module Exports**
   - Check `shared/tokens.ts` exports
   - Check `shared/agents.ts` exports
   - Check `shared/schema.ts` exports
   - **Action:** Test imports in client build

6. **Test Agent Loops**
   - Verify WhalePack control loop starts
   - Check DreamKeeper, DeployKeeper status
   - **Action:** Check server logs after deployment

### Phase 4: Optional - Apps Deployment (LATER)
7. **Configure apps/site for Vercel** (if needed)
8. **Configure apps/api-forge for Vercel** (if needed)

---

## 5. COMMANDS & FILE CHANGES

### Fix Railway Backend Deployment

#### Option 1: Set Start Command via Railway CLI (RECOMMENDED)
```bash
# Link service if not already linked
railway service "@dreamnet/server"

# Set start command variable (if Railway supports this)
railway variables --set "START_COMMAND=node server/dist/index.js"

# Or configure via Railway web UI:
# Settings → Deploy → Start Command: node server/dist/index.js
```

#### Option 2: Fix railway.toml
```toml
[deploy]
command = "node server/dist/index.js"
```

#### Option 3: Update root package.json (ALREADY DONE)
```json
"start": "NODE_ENV=production node server/dist/index.js"
```

#### Option 4: Create/Update Procfile (ALREADY CREATED)
```
web: node server/dist/index.js
```

**Current Status:** Options 2, 3, 4 already attempted. Need to verify Railway picks them up or use Option 1.

### Deploy Frontend to Vercel

```bash
cd client
vercel link  # Link to existing dreamnet.ink project
vercel --prod
```

### Set Environment Variables

**Vercel (Frontend):**
```bash
vercel env add VITE_API_URL production
# Enter: https://dreamnetserver-production.up.railway.app
```

**Railway (Backend):**
```bash
railway variables --set "NODE_ENV=production"
railway variables --set "DATABASE_URL=your_neon_url"  # Optional
railway variables --set "OPENAI_API_KEY=your_key"  # Optional
```

### Verify Shared Module Exports

Check these files export correctly:
- `shared/tokens.ts` - Should export `SUPPORTED_TOKENS`, `getTokenBySymbol`, etc.
- `shared/agents.ts` - Should export `AGENTS`, `getAvailableAgents`, etc.
- `shared/schema.ts` - Should export types like `Dream`, `Wallet`, `Cocoon`, etc.

---

## 6. DEPENDENCY GRAPH

### Client Dependencies
- `@dreamnet/base-mini-apps` → `packages/base-mini-apps/frontend`
- `@shared/*` → `shared/*`
- `wagmi`, `viem`, `ethers` → For Base chain integration
- `react`, `react-dom` → UI framework
- `wouter` → Routing

### Server Dependencies
- `@dreamnet/directory` → Directory service
- `@dreamnet/dreamnet-control-core` → Control system
- `@dreamnet/internal-ports` → Port management
- `@dreamnet/network-blueprints` → Network configs
- `@dreamnet/metrics-engine` → Metrics
- `@dreamnet/nerve` → Nerve system
- All `@dreamnet/*-core` packages → Core systems
- `express` → Web server
- `@neondatabase/serverless` → Database

### Package Dependencies
- Most packages depend on other `@dreamnet/*` packages
- Some packages have `peerDependencies` (wagmi, viem, react)

---

## 7. ENVIRONMENT VARIABLES REQUIRED

### Server (Railway)
**Required:**
- `NODE_ENV` = `production` ✅
- `PORT` = (Railway auto-assigns)

**Optional:**
- `DATABASE_URL` = Neon PostgreSQL connection string
- `OPENAI_API_KEY` = OpenAI API key
- `ALLOWED_ORIGINS` = Comma-separated CORS origins
- `OPERATOR_WALLETS` = Comma-separated wallet addresses
- `INIT_SUBSYSTEMS` = `true`/`false`
- `MESH_AUTOSTART` = `true`/`false`

### Client (Vercel)
**Required:**
- `VITE_API_URL` = Backend API URL (set after Railway deployment)

**Optional:**
- None currently

---

## 8. ROUTING STRUCTURE

### Frontend Routes (`client/src/App.tsx`)
- `/` → `BaseMiniAppsHubPage` (DreamNet Hub - 32 mini-apps)
- `/home`, `/about` → `HomePage`
- `/os` → `OsPage`
- `/vault` → `VaultPage`
- `/shop` → `ShopPage`
- `/dreamtank` → `DreamTankPage`
- `/agents` → `AgentsPage`
- `/community` → `CommunityPage`
- `/system/os-status` → `SystemOsStatusPage`
- `/system/runtime` → `SystemRuntimePage`
- `/mini-apps/*` → Various mini-app routes
- `/admin/*` → Admin routes (auth required)
- 50+ legacy routes for backwards compatibility

### Backend Routes (`server/index.ts`)
- `/health` → Health check
- `/api/*` → All API routes
- `/api/system/graph` → System graph
- `/api/whale/metrics` → Whale Pack metrics
- `/api/whale/manifest` → Whale Pack manifest
- `/api/onboarding/*` → Onboarding API
- `/api/dreams` → Dreams API
- 50+ other API routes

---

## 9. DATABASE STRUCTURE

### Schema (`shared/schema.ts`)
- `users` table
- `dreams` table (main dreams)
- `cocoons` table (dream cocoons)
- `cores` table (dream cores)
- `contributors` table
- `wallets` table
- `dream_contributions` table
- And more...

### Migrations
- Managed by Drizzle ORM
- Config: `drizzle.config.ts`
- Command: `pnpm db:push`

---

## 10. AGENT DIRECTORIES

### Server Agents (`server/`)
- `server/whale/controlLoop.ts` → WhalePack control loop
- `server/core/agents/` → (if exists) DreamKeeper, DeployKeeper

### Root Agents (`agents/`)
- `agents/deployKeeper.cjs` → Deployment keeper
- `agents/deploymentAssistant.ts` → Deployment assistant
- `agents/integrationScanner.cjs` → Integration scanner
- `agents/nano/*` → Nano agents (domainCheck, heartbeat, route404, vercelStatus)
- `agents/status.cjs` → Status agent
- `agents/WolfPackFundingHunter.js` → Funding hunter

---

## 11. BUILD COMMANDS SUMMARY

### Root
```bash
pnpm install          # Install all workspace dependencies
pnpm build            # Build all packages/apps that have build scripts
pnpm dev              # Run all dev scripts in parallel
pnpm --filter @dreamnet/server build  # Build server only
pnpm --filter @dreamnet/server start  # Start server
```

### Client
```bash
cd client
npm install
npm run build         # Builds to client/dist/
npm run dev           # Dev server
```

### Server
```bash
cd server
pnpm build            # Builds to server/dist/index.js
pnpm start            # Runs server/dist/index.js
pnpm dev              # Runs tsx index.ts
```

---

## 12. IMMEDIATE ACTION ITEMS

### 🔴 CRITICAL (Do Now)
1. **Fix Railway backend start command**
   - Check Railway web UI for service settings
   - Set start command: `node server/dist/index.js`
   - Or verify `Procfile`/`nixpacks.toml` is being read

2. **Deploy backend to Railway**
   - Run `railway up` after fixing start command
   - Verify `/health` endpoint responds
   - Capture backend URL

3. **Deploy frontend to Vercel**
   - Set `VITE_API_URL` environment variable
   - Run `vercel --prod` from `client/`
   - Verify site loads at `dreamnet.ink`

### 🟡 HIGH PRIORITY (Do Next)
4. **Verify shared module exports**
   - Test imports in client build
   - Fix any missing exports

5. **Test agent loops**
   - Verify WhalePack control loop starts
   - Check server logs for agent activity

### 🟢 LOW PRIORITY (Later)
6. **Configure apps/site for deployment** (if needed)
7. **Configure apps/api-forge for deployment** (if needed)
8. **Fix commented-out media router** (if @dreamnet/media-vault exists)

---

## 13. DEPLOYMENT CHECKLIST

### Backend (Railway)
- [ ] Railway project linked
- [ ] Service linked: `@dreamnet/server`
- [ ] Environment variables set
- [ ] Start command configured
- [ ] Build succeeds
- [ ] Deployment succeeds
- [ ] `/health` endpoint responds
- [ ] `/api/system/graph` responds
- [ ] Agent loops start

### Frontend (Vercel)
- [ ] Vercel project linked to `dreamnet.ink`
- [ ] Root directory: `client`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] `VITE_API_URL` environment variable set
- [ ] Build succeeds
- [ ] Deployment succeeds
- [ ] Site loads at `dreamnet.ink`
- [ ] Hub displays correctly
- [ ] API calls work

---

## END OF REPORT

**Next Steps:** Fix Railway backend deployment, then deploy frontend to Vercel.

