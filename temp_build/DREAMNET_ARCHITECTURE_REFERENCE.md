# DreamNet Architecture Reference
## Chief Architect & DevOps Mental Model

**Last Updated**: Initial scan complete  
**Status**: ✅ System mapped and ready for operations

---

## 🏗️ Repository Structure

### Monorepo Layout (pnpm workspaces)
```
dream-net/
├── apps/              # Application frontends
│   ├── hub/          # DreamHub backend service
│   ├── dreamos/      # DreamOS core
│   ├── api-forge/    # API forge tool
│   ├── seo/          # SEO service
│   └── sitebuilder/  # Site builder tool
├── client/           # 🎯 MAIN FRONTEND (dreamnet.ink)
├── server/           # 🎯 MAIN BACKEND (Railway)
├── packages/         # 100+ shared packages & mini-apps
│   ├── base-mini-apps/      # Mini-app ecosystem
│   ├── dreamnet-*-core/     # Core agent packages
│   ├── coinsensei-core/     # Financial intelligence
│   ├── wolfpack-funding-core/ # Funding automation
│   └── [90+ more packages]
├── contracts/        # Smart contracts (Base)
└── scripts/          # Deployment & utility scripts
```

---

## 🌐 Deployment Architecture

### Frontend: dreamnet.ink (Vercel)
- **Location**: `client/` directory
- **Framework**: React 18 + TypeScript + Vite
- **Build Command**: `pnpm --filter client run build`
- **Output Directory**: `dist`
- **Root Directory**: `client` (configured in root `vercel.json`)
- **Install Command**: `pnpm --filter client... install --no-frozen-lockfile`
- **Domain**: dreamnet.ink
- **API Proxy**: `/api/*` → `https://api.dreamnet.ink/*`

**Vercel Configuration** (`vercel.json`):
```json
{
  "version": 2,
  "rootDirectory": "client",
  "installCommand": "pnpm --filter client... install --no-frozen-lockfile",
  "buildCommand": "pnpm --filter client run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://api.dreamnet.ink/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Backend: api.dreamnet.ink (Railway)
- **Location**: `server/` directory
- **Runtime**: Node.js + Express + TypeScript
- **Build Command**: `pnpm install && pnpm build:app`
- **Start Command**: `pnpm start` (runs `node server/dist/index.js`)
- **Port**: `process.env.PORT` (Railway-injected)
- **Health Check**: `/health` endpoint
- **Database**: Neon PostgreSQL (via `DATABASE_URL`)

**Railway Configuration** (`railway.json`):
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install && pnpm build:app"
  },
  "deploy": {
    "startCommand": "pnpm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

---

## 🔗 Smart Contracts (Base Mainnet)

### Core Contracts
- **DreamPassport**: `0x62805dBCc7fb37b62d9Ca92e14aFf63d1e1424CC`
- **DreamGovernance**: `0x44a2E7ee89EEa63C6EAC6532c6B356be1655ff16`
- **DreamVault**: `0x832876CDAaC6e7BAd9C4B953efce19AF0D89Fbd7`
- **BountyEscrow**: `0x21c4BD450a6689353aFfB3EDCA887aa9F908Fc2c`
- **BadgeNFT**: `0x6Ece1531C0547b366Fd10814Fae5963788d2c2a1`

### Mini-App Contracts
- **DreamShop**: `0xa1E35292c736a68B9CAB7b9e5c271575632F442d`
- **TributeGate**: `0x318292412250E906951f849eB3446c00b7688a6B`
- **SeasonalEventsRegistry**: `0x9e8424DFAae2863d43a3B54482D8fBDC679437Ce`
- **NightmareRegistry**: `0x335386C46AFe17890C41588C2584caf872315291`
- **RevenueSplitter**: `0xB48843CDC5E8daf8b325D574e6DF2690b98d9D76`
- **DreamDNASequencer**: `0xd88644649945d295A1a2cdF496012eBe3E7755a6`
- **DreamRemixRegistry**: `0x66Ef7DDb340537E22F567D60d6c22EDA2B8c3619`
- **WhisperMessenger**: `0x1cBf5C4AB1aa0f1D0Db0fF17f978EC1e165E1002`
- **MissionRegistry**: `0x73999460083aC079A199B10f1DE1f4A9cA3db837`
- **ProgressionRegistry**: `0xDa02C8383D42C9b0943d532fC9F95C27C9A8055B`
- **DreamTimeCapsule**: `0x891A71eB2D20692D22bF7106B16Ba48253826409`
- **DreamPredictionMarket**: `0x036b043Ebb894f16639452fC35B7C379bbD05593`

**Full list**: See `ALL_CONTRACT_ADDRESSES.md`

---

## 🤖 Core Agents (Brainstem Layer)

### DreamKeeper
- **Package**: `packages/dreamnet-health-core`
- **Role**: Health monitoring, diagnostics, healing, immune system
- **Capabilities**: System health checks, anomaly detection, auto-healing

### DeployKeeper
- **Package**: `packages/dreamnet-vercel-agent`
- **Role**: DevOps automation, deployments, infrastructure changes
- **Capabilities**: Vercel API, Railway API, deployment automation
- **Status**: Ready for button-pressing operations

### EnvKeeper
- **Package**: `packages/env-keeper-core`
- **Role**: Environment/config management
- **Capabilities**: Env var validation, config synchronization

### Star Bridge
- **Package**: `packages/star-bridge-lungs`
- **Role**: Routing and IO nerve center
- **Capabilities**: Request routing, service discovery

### Coin Sensei
- **Package**: `packages/coinsensei-core`
- **Role**: Financial + wallet intelligence (Base)
- **Capabilities**: Wallet tracking, contract monitoring, treasury management

### Jaggy
- **Package**: `packages/jaggy-core`
- **Role**: Observer/analytics, stealth watcher
- **Capabilities**: Analytics, anomaly detection

### RelayBot
- **Package**: `packages/webhook-nervous-core`
- **Role**: Message dispatcher across channels
- **Capabilities**: Webhook routing, notifications

---

## 📦 Mini-Apps Ecosystem

### Location
- **Frontend**: `packages/base-mini-apps/frontend/`
- **Contracts**: `packages/base-mini-apps/contracts/`
- **Deployment**: Integrated into `client/` frontend

### Active Mini-Apps
1. **Passport** - Identity registry
2. **Government Offices** - Records, licensing, permits
3. **Vault** - Asset management
4. **Bounty** - Incentive and task marketplace
5. **Remix** - Idea/app remixing
6. **DreamShop** - Marketplace
7. **TributeGate** - Tribute system
8. **SeasonalEvents** - Event registry
9. **NightmareRegistry** - Nightmare tracking
10. **RevenueSplitter** - Revenue distribution
11. **DreamDNASequencer** - DNA sequencing
12. **WhisperMessenger** - Messaging
13. **MissionRegistry** - Mission tracking
14. **ProgressionRegistry** - User progression
15. **DreamTimeCapsule** - Time capsules
16. **DreamPredictionMarket** - Prediction markets

---

## 🔧 Build & Deployment Commands

### Root Level
```bash
# Development
pnpm dev                    # Run all dev servers in parallel
pnpm dev:app               # Run backend dev server

# Build
pnpm build                 # Build all packages/apps
pnpm build:app             # Build backend for production
pnpm vercel-build          # Vercel build command (alias for build:app)

# Type checking
pnpm typecheck             # Type check all packages

# Contracts
pnpm compile               # Compile Hardhat contracts
pnpm deploy:base-mainnet   # Deploy contracts to Base mainnet
pnpm deploy:base-sepolia  # Deploy contracts to Base Sepolia
```

### Client (Frontend)
```bash
cd client
pnpm dev                   # Vite dev server
pnpm build                 # Production build → dist/
pnpm preview              # Preview production build
```

### Server (Backend)
```bash
cd server
pnpm dev                   # tsx index.ts (dev mode)
pnpm build                 # tsc compilation → dist/
pnpm start                 # node dist/index.js (production)
```

---

## 🔐 Environment Variables

### Frontend (Vercel)
```bash
# Contract Addresses (VITE_ prefix for Vite)
VITE_DREAM_SHOP_ADDRESS=0xa1E35292c736a68B9CAB7b9e5c271575632F442d
VITE_TRIBUTE_GATE_ADDRESS=0x318292412250E906951f849eB3446c00b7688a6B
VITE_SEASONAL_EVENTS_ADDRESS=0x9e8424DFAae2863d43a3B54482D8fBDC679437Ce
VITE_NIGHTMARE_ADDRESS=0x335386C46AFe17890C41588C2584caf872315291
VITE_REVENUE_SPLITTER_ADDRESS=0xB48843CDC5E8daf8b325D574e6DF2690b98d9D76
VITE_DNA_SEQUENCER_ADDRESS=0xd88644649945d295A1a2cdF496012eBe3E7755a6

# API Endpoint
VITE_API_URL=https://api.dreamnet.ink

# Runtime
NODE_ENV=production
```

### Backend (Railway)
```bash
# Database
DATABASE_URL=postgresql://... (Neon PostgreSQL)
# OR
NEON_DATABASE_URL=postgresql://...

# Server
NODE_ENV=production
PORT=auto (Railway injects)

# Optional Subsystems
INIT_SUBSYSTEMS=true      # Enable heavy subsystems (default: false)
MESH_AUTOSTART=false      # Disable mesh autostart

# API Keys
OPENAI_API_KEY=...
DREAMNET_API_KEY=...
STRIPE_SECRET_KEY=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
```

---

## 🚀 Deployment Workflows

### Frontend Deployment (Vercel)
1. **Automatic**: Push to main branch triggers deploy
2. **Manual**: `vercel --prod` from repo root
3. **Prebuilt**: `pnpm build:prebuilt && pnpm deploy:prebuilt`

**Vercel Settings**:
- Root Directory: `client`
- Build Command: `pnpm --filter client run build`
- Output Directory: `dist`
- Install Command: `pnpm --filter client... install --no-frozen-lockfile`

### Backend Deployment (Railway)
1. **Automatic**: Push to main branch triggers deploy
2. **Manual**: Railway dashboard → Deploy

**Railway Settings**:
- Root Directory: `server` (via railway.json)
- Build Command: `pnpm install && pnpm build:app`
- Start Command: `pnpm start`

---

## 🎯 Key Routes & Endpoints

### Frontend Routes (`client/src/App.tsx`)
- `/` - Landing/home
- `/dashboard` - Main dashboard
- `/dreams` - Dream gallery
- `/admin` - Admin panel
- `/miniapps/*` - Mini-app routes
- `/bounties` - Bounty explorer
- `/remix` - Remix submission
- `/tokens` - Token demo
- `/wallet-profile/:address` - Wallet profiles
- `/dream-cloud/:slug` - DreamCloud pages

### Backend API (`server/index.ts`)
- `GET /health` - Health check (public)
- `GET /ready` - Readiness check (subsystems initialized)
- `GET /api/*` - API routes
- `POST /api/webhooks/*` - Webhook endpoints

---

## 📊 Package Inventory

### Core Agent Packages (90+)
- `dreamnet-health-core` - DreamKeeper
- `dreamnet-vercel-agent` - DeployKeeper
- `env-keeper-core` - EnvKeeper
- `star-bridge-lungs` - Star Bridge
- `coinsensei-core` - Coin Sensei
- `jaggy-core` - Jaggy
- `webhook-nervous-core` - RelayBot
- `wolfpack-funding-core` - Funding automation
- `whale-pack-core` - Whale operations
- `inbox-squared-core` - Email intelligence
- `dreamnet-snail-core` - DreamSnail
- `dreamnet-control-core` - Control plane
- `dreamnet-os-core` - OS core
- `dreamnet-metrics-core` - Metrics
- `dreamnet-audit-core` - Audit
- `dreamnet-alerts-core` - Alerts
- `dreamnet-cost-core` - Cost tracking
- `dreamnet-rbac-core` - RBAC
- `dreamnet-scheduler-core` - Scheduling
- `dreamnet-incident-core` - Incident management
- `dreamnet-autoscale-core` - Autoscaling
- `dreamnet-shield-health-bridge` - Shield bridge
- `dreamnet-identity-passport-bridge` - Identity bridge
- `dreamnet-cost-economic-bridge` - Economic bridge
- `dreamnet-operational-bridge` - Operational bridge
- `base-mini-apps` - Mini-app ecosystem
- `agent-registry-core` - Agent registry
- `agent-gateway` - Agent gateway
- `agent-wallet-manager` - Wallet management
- `orchestrator-core` - Orchestration
- `neural-mesh` - Neural mesh
- `quantum-anticipation` - Quantum anticipation
- `squad-alchemy` - Squad alchemy
- `dream-state-core` - Dream state
- `shield-core` - Shield core
- `spider-web-core` - Spider web
- `reputation-lattice` - Reputation system
- `narrative-field` - Narrative field
- `memory-dna` - Memory DNA
- `slug-time-memory` - Slug time memory
- `event-wormholes` - Event wormholes
- `field-layer` - Field layer
- `graft-engine` - Graft engine
- `halo-loop` - Halo loop
- `identity-grid` - Identity grid
- `init-ritual-core` - Init ritual
- `internal-ports` - Internal ports
- `internal-router` - Internal router
- `liquidity-engine` - Liquidity engine
- `media-vault` - Media vault
- `metrics-engine` - Metrics engine
- `network-blueprints` - Network blueprints
- `nerve` - Nerve system
- `octopus-executor` - Octopus executor
- `orca-pack-core` - Orca pack
- `port-governor` - Port governor
- `predator-scavenger` - Predator scavenger
- `quantum-anticipation` - Quantum anticipation
- `rewards-engine` - Rewards engine
- `runtime-bridge-core` - Runtime bridge
- `social-hub-core` - Social hub
- `spore-engine` - Spore engine
- `squad-builder` - Squad builder
- `tag-bridge-core` - Tag bridge
- `zen-garden-core` - Zen garden
- `dream-cortex` - Dream cortex
- `dream-shop` - Dream shop
- `dream-tank-core` - Dream tank
- `dream-token` - Dream token
- `dream-vault` - Dream vault
- `dreambet-core` - Dream bet
- `dreamnet-agent-client` - Agent client
- `dreamnet-bridge` - Bridge
- `dreamstate` - Dream state
- `economic-engine-core` - Economic engine
- `governance` - Governance
- `directory` - Directory
- `dark-fabric` - Dark fabric
- `civic-panel-core` - Civic panel
- `ai-seo-core` - AI SEO
- `alive-mode` - Alive mode
- `api-keeper-core` - API keeper

---

## 🔍 Troubleshooting Guide

### Frontend Build Failures
1. Check `client/vite.config.ts` for alias resolution
2. Verify all workspace dependencies are installed
3. Check for missing environment variables (VITE_*)
4. Review Vercel build logs for specific errors

### Backend Deployment Issues
1. Verify `DATABASE_URL` is set in Railway
2. Check `PORT` is not manually set (Railway injects it)
3. Review Railway logs for runtime errors
4. Verify `/health` endpoint is accessible

### Contract Deployment
1. Check Base network RPC endpoint
2. Verify wallet has sufficient ETH for gas
3. Review Hardhat deployment scripts
4. Check contract addresses in `ALL_CONTRACT_ADDRESSES.md`

---

## 📝 DeployKeeper Capabilities

As DeployKeeper PRIME, I can:
- ✅ Scan repo structure and detect frontends/backends
- ✅ Identify correct Root Directory, Build Command, Output Directory
- ✅ Propose Vercel API calls for configuration
- ✅ Propose Railway API calls for deployment
- ✅ Design desired-state files (YAML/JSON)
- ✅ Fix deployment issues systematically
- ✅ Ensure idempotent, production-grade patterns

---

## 🎯 Current Status

- ✅ Repository structure mapped
- ✅ Frontend deployment config understood
- ✅ Backend deployment config understood
- ✅ Contract addresses documented
- ✅ Agent ecosystem cataloged
- ✅ Build commands identified
- ✅ Environment variables documented
- ✅ Ready for operations

---

**I am now fully operational as DreamNet's Chief Architect and DevOps Engineer. Ready to handle deployment issues, infrastructure changes, and agent coordination.**

