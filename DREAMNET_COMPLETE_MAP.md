# 🧬 DreamNet Complete Map & Explanation
## The Living Organism - Full System Architecture

**Last Updated:** 2025-01-27  
**Status:** ✅ Complete Deep Dive - Full System Mapped  
**Purpose:** Comprehensive reference for understanding DreamNet as a living, biomimetic digital organism

**Recent Updates (2025-01-27):**
- ✅ Social Media Integration (Instagram, Facebook, LinkedIn, Farcaster, etc.)
- ✅ Wolf Pack & Whale Pack Real-World Activation
- ✅ X402 Payment Gateway Implementation
- ✅ Google Cloud Integration (Cloud Run, Storage, Build, Functions)
- ✅ Agent Marketplace
- ✅ 5 New X402 Mini Apps Ready to Build

---

## 📋 Table of Contents

1. [What DreamNet Is](#what-dreamnet-is)
2. [Repository Structure](#repository-structure)
3. [Core Systems Architecture](#core-systems-architecture)
4. [Biomimetic Subsystems](#biomimetic-subsystems)
5. [API Routes & Endpoints](#api-routes--endpoints)
6. [Base Mini-Apps & Smart Contracts](#base-mini-apps--smart-contracts)
7. [Infrastructure & Deployment](#infrastructure--deployment)
8. [Environment Variables](#environment-variables)
9. [Key Scripts & Commands](#key-scripts--commands)
10. [System Interconnections](#system-interconnections)
11. [Current State & Status](#current-state--status)

---

## What DreamNet Is

**DreamNet is a living, breathing, biomimetic AI + Web3 organism** - not just a platform, but a complete ecosystem modeled after biological systems. It functions as:

1. **Multi-Agent AI Platform** - Orchestrates 143+ agents for various tasks
2. **Deployment & Orchestration System** - Manages its own infrastructure and deployments
3. **Web3 Ecosystem** - Integrates with Base blockchain for mini-apps and smart contracts
4. **Biomimetic Organism** - Mirrors biological systems (nervous system, lungs, organs, immune system)

### Key Concepts

- **DreamNet OS**: Core agent orchestration system with agents like DreamKeeper, DeployKeeper, RelayBot, EnvKeeper
- **Biomimetic Subsystems**: Systems that mirror biological organs (Star Bridge Lungs, Neural Mesh, Shield Core, etc.)
- **Base Mini-Apps**: Discoverable web applications running within Base App, not network nodes
- **Dream Hub**: Frontend UI for mini-apps, dashboards, controls
- **Self-Healing**: Systems that automatically detect and fix issues
- **Self-Organizing**: Systems that adapt and optimize themselves

---

## Repository Structure

### Monorepo Layout (pnpm workspaces)

```
dream-net/
├── apps/                    # Application frontends
│   ├── hub/                 # DreamHub backend service
│   ├── dreamos/             # DreamOS core
│   ├── api-forge/           # API forge tool
│   ├── seo/                 # SEO service
│   └── sitebuilder/         # Site builder tool
│
├── client/                  # 🎯 MAIN FRONTEND (dreamnet.ink)
│   ├── src/
│   │   ├── pages/           # 134 page files
│   │   ├── components/      # 166 component files
│   │   ├── miniapps/        # Base mini-app integrations
│   │   └── ...
│   └── dist/                # Built frontend
│
├── server/                  # 🎯 MAIN BACKEND (Express.js)
│   ├── index.ts             # Main entrypoint
│   ├── core/
│   │   ├── dreamnet-os.ts   # DreamNet OS core
│   │   └── agents/          # Core agents (DreamKeeper, DeployKeeper, etc.)
│   ├── routes/              # 200+ route files
│   └── ...
│
├── packages/                # 100+ shared packages
│   ├── base-mini-apps/       # Base blockchain mini-apps
│   ├── dreamnet-*-core/     # Core agent packages
│   ├── neural-mesh/         # Neural network system
│   ├── star-bridge-lungs/    # Cross-chain monitoring
│   ├── shield-core/         # Security/immune system
│   ├── spider-web-core/     # Event routing (nervous system)
│   └── [90+ more packages]
│
├── infrastructure/          # Deployment infrastructure
│   ├── google/
│   │   ├── gke/             # GKE deployment scripts & manifests
│   │   ├── run/             # Cloud Run deployment
│   │   └── data/            # Data infrastructure (Cloud SQL, etc.)
│   └── aws/                 # AWS deployment (alternative)
│
├── contracts/               # Smart contracts (Base blockchain)
├── shared/                  # Shared schema/types (Drizzle ORM)
├── scripts/                 # Utility scripts
└── Dockerfile               # Container configuration
```

### Package Count

- **Core Agent Packages**: ~30 packages
- **Mini-App Packages**: 16+ mini-apps
- **Infrastructure Packages**: ~20 packages
- **Utility Packages**: ~30 packages
- **Total**: 100+ packages in monorepo

---

## Core Systems Architecture

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

### Server Entrypoint

**Location:** `server/index.ts`

**Key Features:**
- Express.js HTTP server
- 200+ route handlers
- Optional subsystem initialization (controlled by `INIT_SUBSYSTEMS` flag)
- Star Bridge Lungs initialization (always runs, critical)
- Vercel Agent (disabled by default, requires `ENABLE_VERCEL_AGENT=true`)

**Startup Flow:**
1. Server starts immediately (listens on port)
2. Star Bridge Lungs initializes in `server.listen()` callback
3. Optional subsystems initialize asynchronously (non-blocking)
4. Health endpoints (`/health`, `/ready`) available immediately

---

## Biomimetic Subsystems

DreamNet is architected as a **living organism** with distinct biological systems:

### Tier I: Foundation (Skeletal System)

- **Control Core** (`@dreamnet/dreamnet-control-core`) - Cluster-level rate limiting, feature flags, global kill switches
- **Port Governor** (`@dreamnet/port-governor`) - Port management and governance
- **Tier System** - Access control (SEED, BUILDER, OPERATOR, GOD_MODE)
- **Nerve Fabric** (`@dreamnet/nerve`) - Event bus system

### Tier II: Core Biomimetic (Metabolic Organs)

1. **Neural Mesh** (`packages/neural-mesh/`)
   - Synaptic network connecting all systems
   - Pattern learning and routing
   - Self-healing connections

2. **Quantum Anticipation Layer (QAL)** (`packages/quantum-anticipation/`)
   - Predictive modeling
   - Future state anticipation
   - Decision optimization

3. **Squad Alchemy Engine** (`packages/squad-alchemy/`)
   - Agent squad optimization
   - Team formation and coordination
   - Performance optimization

4. **Wolf-Pack Protocol (WPP)** (`packages/wolf-pack/`)
   - Offensive/executional agents
   - Funding discovery and grant hunting
   - Partner outreach and email automation
   - **Sub-packages:**
     - `wolfpack-funding-core` - Funding automation
     - `wolfpack-analyst-core` - Lead analysis
     - `wolfpack-mailer-core` - Email automation

5. **Octopus Executor** (`packages/octopus-executor/`)
   - Multi-arm integration brain
   - 8-arm parallel task execution
   - Integrations: GitHub, Vercel, Replit, Stripe, Google, etc.

6. **Slug-Time Memory Layer (STM)** (`packages/slug-time-memory/`)
   - Long-term trend tracking
   - Historical pattern analysis
   - Memory persistence

7. **Star Bridge Lungs** (`packages/star-bridge-lungs/`) ⭐ **CRITICAL**
   - Cross-chain monitoring (Base, Ethereum, Solana, Polygon, Arbitrum, Avalanche, Near, Monad)
   - Breath cycles every 2 minutes
   - Chain health metrics (gas pressure, congestion, reliability)
   - Routing preference recommendations
   - **Always initializes** - runs independently of `INIT_SUBSYSTEMS` flag

8. **Predator–Scavenger Loop (PSL)** (`packages/predator-scavenger/`)
   - Metabolic cleanup
   - Resource optimization
   - Dead resource cleanup

### Tier III: Advanced (Cognitive & Social)

1. **Dream Cortex** (`packages/dream-cortex/`)
   - Global intent/goal engine
   - Purpose tracking
   - Goal alignment

2. **Reputation Lattice** (`packages/reputation-lattice/`)
   - Trust weave system
   - Reputation scoring
   - Social trust network

3. **Narrative Field** (`packages/narrative-field/`)
   - Global story stream
   - Narrative tracking
   - Story evolution

4. **Identity Grid** (`packages/identity-grid/`)
   - Wallet + agent identity layer
   - Identity verification
   - Access control

### Tier IV: Application Layer (Ecosystem)

1. **Dream Vault** (`packages/dream-vault/`) - Central repository
2. **Dream Shop** (`packages/dream-shop/`) - Marketplace layer
3. **Field Layer** (`packages/field-layer/`) - Global parameter fields
4. **DreamBet Core** (`packages/dreambet-core/`) - Games + fairness engine
5. **Zen Garden Core** (`packages/zen-garden-core/`) - Ritual + activity engine
6. **Civic Panel Core** (`packages/civic-panel-core/`) - Admin + status layer
7. **Dream Tank Core** (`packages/dream-tank-core/`) - Incubator engine
8. **Liquidity Engine** (`packages/liquidity-engine/`) - Liquidity pool registry
9. **Social Hub Core** (`packages/social-hub-core/`) - Social feed layer
10. **Init & Ritual Core** (`packages/init-ritual-core/`) - Onboarding layer
11. **Economic Engine Core** (`packages/economic-engine-core/`) - Rewards + tokens
12. **Agent Registry Core** (`packages/agent-registry-core/`) - Agent store + health
13. **DreamNet OS Core** (`packages/dreamnet-os-core/`) - Global status + heartbeat

### Autonomous Orchestration Systems 🧠

1. **Super Brain** (`server/core/SuperBrain.ts`) - **The Autonomous Mind**
   - Event Watcher (watches all Starbridge events)
   - Decision Engine (makes autonomous decisions)
   - Action Executor (executes decisions)
   - Brain Store (persistent memory in DreamVault)
   - Query Interface (enables AI assistants to query knowledge)
   - **Status**: ✅ Built, ✅ Connected to Starbridge (via Brain Integration)

2. **Drive Engine** (`server/core/DriveEngine.ts`) - **The Motivational System**
   - Purpose Engine (defines what drives each pack)
   - Hunger System (measures how "hungry" each pack is)
   - Momentum System (maintains velocity of actions)
   - Action Generator (generates actions based on drive)
   - Feedback Loop (adjusts drive based on outcomes)
   - **Status**: ✅ Built, ✅ Connected to packs (via Brain Integration)

3. **Brain Integration** (`server/core/BrainIntegration.ts`) - **The Integration Layer**
   - Hooks Starbridge events → Super Brain
   - Hooks Drive Engine → Packs
   - Initializes Biomimetic Integration
   - Starts Super Brain watching
   - Starts Drive Engine cycle
   - **Status**: ✅ Built, ✅ Initialized on server startup (if `INIT_SUBSYSTEMS=true`)

4. **Biomimetic Integration** (`server/core/BiomimeticIntegration.ts`) - **The Biomimetic Hookup**
   - Hooks Star Bridge Lungs → Super Brain
   - Hooks Neural Mesh → Super Brain
   - Hooks Halo-Loop → Super Brain
   - Hooks Shield Core → Super Brain
   - Hooks Dream Snail → Super Brain
   - Hooks Slug-Time Memory → Super Brain
   - Hooks Predator-Scavenger Loop → Super Brain
   - Hooks Dream Cortex → Super Brain
   - Hooks Mini-Apps → Super Brain
   - **Status**: ✅ Built, ✅ Initialized via Brain Integration

5. **GPT Agent Registry** (`server/gpt-agents/GPTAgentRegistry.ts`) - **The GPT Integration**
   - Registers 75+ Custom GPTs as first-class DreamNet agents
   - Maps GPTs to DreamNet agent properties (cluster, kind, tier)
   - Issues passports to GPTs
   - Registers in Directory, AgentRegistryCore, DreamNetOS.registry, SuperSpine
   - **Status**: ✅ Built, ✅ Integrated with all 4 registry systems

### Specialized Systems

1. **Spider Web Core** (`packages/spider-web-core/`) - **Nervous System**
   - Event routing system
   - **Flies** = External events (webhooks, messages, signals)
   - **Threads** = Signal pathways routing events
   - **Sensors** = Funnel Web spiders catching flies
   - **Orb Weaver** = Routes and executes threads
   - **Pattern Learning** = Remembers successful patterns

2. **Webhook Nervous Core** (`packages/webhook-nervous-core/`)
   - Biomimetic webhook processing
   - Neurons, synapses, reflex arcs
   - Automatic webhook discovery

3. **Shield Core** (`packages/shield-core/`) - **Immune System**
   - Threat detection
   - Rate limiting
   - Anomaly detection
   - Multi-phase shield system (cellular, cross-chain)

4. **Dream State Core** (`packages/dream-state-core/`) - **Government**
   - Governance system
   - Passport tiers (Visitor → Founder)
   - Proposal creation and voting
   - Tier-weighted access control

5. **Dream Snail Core** (`packages/dreamnet-snail-core/`) - **Privacy Layer**
   - Privacy trails
   - Verifiable provenance
   - Event recording

6. **Jaggy Core** (`packages/jaggy-core/`) - **Silent Sentinel**
   - Webhook hunter
   - Silent monitoring
   - Background operations

7. **Halo-Loop** (`packages/halo-loop/`) - **Self-Healing**
   - Automatic issue detection
   - Self-repair mechanisms
   - Health monitoring

### Zero-Touch Systems (Auto-Discovery)

1. **Env Keeper Core** (`packages/env-keeper-core/`)
   - Auto-discovers ALL environment variables
   - Recursive `.env` file scanning
   - Vercel secrets sync
   - Auto-applies to `process.env`

2. **API Keeper Core** (`packages/api-keeper-core/`)
   - Auto-discovers API keys
   - Provider management
   - Cost monitoring
   - Rail guards

3. **AI SEO Core** (`packages/ai-seo-core/`)
   - AUTO-SEO for ALL content
   - Automatic optimization
   - Content enhancement

4. **Webhook Nervous Core** (`packages/webhook-nervous-core/`)
   - Auto-discovers webhooks
   - Biomimetic processing
   - Reflex arc routing

### Additional Specialized Systems

- **Whale Pack** (`packages/whale-pack-core/`) - Commerce & product management
- **Orca Pack** (`packages/orca-pack-core/`) - Communications & narrative management
- **Graft Engine** (`packages/graft-engine/`) - Agent grafting and evolution
- **Event Wormholes** (`packages/event-wormholes/`) - Event routing through wormholes
- **Orchestrator Core** (`packages/orchestrator-core/`) - System orchestration
- **Runtime Bridge Core** (`packages/runtime-bridge-core/`) - Runtime integration
- **DreamNet Operational Bridge** (`packages/dreamnet-operational-bridge/`) - Operational event routing
- **Internal Ports** (`packages/internal-ports/`) - Internal port management
- **Internal Router** (`packages/internal-router/`) - Internal routing
- **Agent Gateway** (`packages/agent-gateway/`) - Agent access gateway

---

## API Routes & Endpoints

### Core Endpoints

- `GET /health` - Health check (always available, lightweight)
- `GET /ready` - Readiness check (indicates subsystems initialized)
- `GET /api/heartbeat` - System heartbeat
- `GET /api/public/status` - Public status

### DreamNet OS

- `GET /api/agents` - List available agents
- `POST /api/agent` - Run an agent with input

### Star Bridge Lungs ⭐

- `GET /api/star-bridge` - Star Bridge Lungs status
- `GET /api/star-bridge/chains` - Chain metrics
- `GET /api/star-bridge/breaths` - Recent breath snapshots
- `POST /api/star-bridge/breathe` - Trigger breath cycle manually

### Authentication & API Keys

- `GET /api/keys/validate` - Validate API key
- `GET /api/keys` - List API keys
- `GET /api/keys/default` - Get or create default API key
- `POST /api/keys/create` - Create new API key
- `DELETE /api/keys/:keyId` - Revoke API key
- `POST /api/auth/verify` - Wallet authentication (SIWE)

### Dreams

- `GET /api/dreams` - List all dreams
- `GET /api/dreams/:id` - Get specific dream
- `POST /api/dreams` - Create new dream
- `PUT /api/dreams/:id` - Update dream
- `DELETE /api/dreams/:id` - Delete dream

### Wolf Pack (Funding)

- `GET /api/wolf-pack/status` - Wolf Pack status
- `GET /api/wolf-pack/leads` - Hot funding leads
- `GET /api/wolf-pack/opportunities` - Funding opportunities
- `POST /api/wolf-pack/analyze` - Analyze lead

### Shield Core (Security)

- `GET /api/shield/status` - Shield Core status
- `GET /api/shield/threats` - Recent threats
- `GET /api/shield/layers` - Active shield layers
- `POST /api/shield/detect` - Manually detect threat

### Spider Web Core (Events)

- `GET /api/spider-web/threads` - All threads
- `GET /api/spider-web/threads/:id` - Specific thread
- `GET /api/spider-web/signals` - Recent signals

### Dream State (Governance)

- `GET /api/dream-state/status` - Dream State status
- `GET /api/dream-state/passports` - List passports
- `GET /api/dream-state/departments` - Government departments
- `GET /api/dream-state/proposals` - Active proposals

### Vercel Management (Legacy - Disabled by Default)

- `GET /api/vercel/status` - Vercel Agent status
- `GET /api/vercel/projects` - List all Vercel projects
- `GET /api/vercel/project/:name` - Get specific project
- `GET /api/vercel/analyze` - Analyze cleanup opportunities
- `POST /api/vercel/cleanup` - Execute cleanup actions
- `POST /api/vercel/cleanup/auto` - Auto-analyze and cleanup
- **Note:** Requires `ENABLE_VERCEL_AGENT=true` to enable

### Voice (Twilio SMS)

- `GET /api/voice/status` - Voice system status
- `POST /api/voice/send` - Send SMS message

### Additional Routes (200+ total)

Routes are organized in `server/routes/` directory with 200+ route files covering:
- Agent operations
- Dream management
- Biomimetic systems
- Base mini-apps
- Infrastructure management
- Admin operations
- And more...

---

## Base Mini-Apps & Smart Contracts

### Smart Contracts (Deployed on Base)

**Core Contracts (5):**
1. **Dream Passport NFT** - `0x62805dBCc7fb37b62d9Ca92e14aFf63d1e1424CC`
2. **Dream State Governance** - `0x44a2E7ee89EEa63C6EAC6532c6B356be1655ff16`
3. **Dream Vault NFT** - `0x832876CDAaC6e7BAd9C4B953efce19AF0D89Fbd7`
4. **Bounty Escrow** - `0x21c4BD450a6689353aFfB3EDCA887aa9F908Fc2c`
5. **Badge NFT** - `0x6Ece1531C0547b366Fd10814Fae5963788d2c2a1`

**Mini-App Contracts (17):**
6. **DreamRemixRegistry** - `0x66Ef7DDb340537E22F567D60d6c22EDA2B8c3619`
7. **WhisperMessenger** - `0x1cBf5C4AB1aa0f1D0Db0fF17f978EC1e165E1002`
8. **SeasonalEventsRegistry** - `0xdf30a28fA5DbF392DD76Ed761852a31F772AcC27`
9. **NightmareRegistry** - `0x29f2E979E5E2ec0683B1D0ee660824eeb12B7AdF`
10. **MissionRegistry** - `0x73999460083aC079A199B10f1DE1f4A9cA3db837`
11. **RevenueSplitter** - `0x07ed77169aD71905aF3778b42760F3269a0D0C74`
12. **ProgressionRegistry** - `0xDa02C8383D42C9b0943d532fC9F95C27C9A8055B`
13. **DreamDriftersRegistry** - `0x3987902f05Dfca6197D08AcB694e48BE5Df8cE65`
14. **DreamTimeCapsule** - `0x891A71eB2D20692D22bF7106B16Ba48253826409`
15. **DreamDNASequencer** - `0xd9B140aFB0ef0b358f8342fe6381f6589d450A87`
16. **DreamPredictionMarket** - `0x036b043Ebb894f16639452fC35B7C379bbD05593`
17. **DreamShop** - `0xa1E35292c736a68B9CAB7b9e5c271575632F442d`
18. **TributeGate** - `0x318292412250E906951f849eB3446c00b7688a6B`
19. **WalletScoreRegistry** - `0x61A0523f068246E72a77e70f7B30AC2e4bfa87D5`
20. **GameRegistry** - `0xB38005e10E376D5D43699B45E7fc2f06A8465a5D` (used by 10 game apps)
21. **GameAchievementNFT** - `0x4AF7a82908C64e554584bD6A0F9145521F1913d6` (used by 10 game apps)
22. **CardForgeNFT** - `0x34e1079820b4c733bE7D67A5F980ea4c752DbD47`

**Total Contracts:** 20 deployed on Base mainnet (chain ID 8453)

### Frontend Mini-Apps (55 Total)

**Location:** `packages/base-mini-apps/frontend/`  
**Registry:** `packages/base-mini-apps/frontend/index.tsx`  
**Apps with Contracts:** 29  
**Frontend-Only Apps:** 26

**Apps with Smart Contracts (29):**
- **Identity & Governance (2):** passport-mint, governance
- **Creative & Social (5):** dream-vault, dream-remix, whisper-messenger, time-capsule, badge-board
- **Commerce & Bounties (3):** bounty-board, dream-shop-mini, tribute-gate-mini
- **Events & Missions (3):** seasonal-events, mission-center, nightmare-network
- **DeFi & Revenue (3):** revenue-sharing, prediction-market, wallet-score-dashboard
- **Utility & Progression (3):** progression-tracker, dna-sequencer, dream-drifters
- **Gaming (10):** All 10 game apps use GameRegistry
- **Creative Tools (1):** card-forge-pro

**Frontend-Only Apps (26):**
- **Government Offices (4):** api-keeper, api-keeper-office, jaggy-office, mycelium-office
- **Commerce & Social (3):** wolf-pack, social-hub, whale-pack
- **Treasury & Monitoring (3):** treasury, shield-monitor, shield-monitor-mini
- **Exploration & Dashboards (4):** dream-gallery, ecosystem-dashboard, network-explorer, agent-dashboard
- **Ops & Tools (8):** dreamscope-ops, dreamscope-ops-mini, onboarding, onboarding-wizard-mini, creator-studio, creator-studio-mini, social-ops-mini, wormhole-router-mini
- **Funding & Analytics (3):** wolf-pack-funding-hud, inbox-squared, coinsensei
- **Hub Components (2):** dreamnet-hub, dreamnet-hub-wrapper

**Documentation:**
- Complete mapping: `packages/base-mini-apps/CONTRACT_MAPPING.md`
- Audit report: `packages/base-mini-apps/CONTRACT_AUDIT_REPORT.md`
- Contract resolver: `packages/base-mini-apps/frontend/contractResolver.ts`

**Total:** 55 mini-apps (29 with contracts, 26 frontend-only)

---

## Infrastructure & Deployment

### Primary: Google Cloud Platform (GCP)

**Project:** `aqueous-tube-470317-m6`  
**Region:** `us-central1`  
**Domain:** `dreamnet.ink`

#### GKE Autopilot

**Cluster:** `autopilot-cluster-1`  
**Region:** `us-central1`  
**Type:** Autopilot (managed Kubernetes)

**Deployment:**
- **Script:** `pnpm deploy:gke` → `infrastructure/google/gke/deploy.ts`
- **Manifests:**
  - `infrastructure/google/gke/deployment.yaml` - API deployment
  - `infrastructure/google/gke/service.yaml` - LoadBalancer services
  - `infrastructure/google/gke/ingress.yaml` - Ingress configuration

**Image:** `gcr.io/aqueous-tube-470317-m6/dreamnet-api:latest`

**Resources:**
- **Replicas:** 3 (min) - 20 (max) via HPA
- **CPU:** 500m request, 2000m limit
- **Memory:** 1Gi request, 4Gi limit

#### Cloud Run

**Deployment:**
- **Script:** `pnpm deploy:gcp` → `infrastructure/google/deploy-all.ts`
- **Service:** `dreamnet-api`
- **Region:** `us-central1`
- **Port:** `8080`
- **Resources:** 2 CPU, 2Gi memory, 900s timeout

**Image:** Built via Cloud Build, pushed to GCR

#### Data Infrastructure

- **Cloud SQL/AlloyDB:** PostgreSQL (via `DATABASE_URL`)
- **Cloud Storage:** For file storage
- **Secret Manager:** For secrets management

### Alternative: AWS

**Deployment:**
- **Script:** `pnpm deploy:aws` → `infrastructure/aws/deploy-all.ts`
- **EKS:** `pnpm deploy:eks` → `infrastructure/aws/eks/deploy.ts`
- **RDS:** PostgreSQL via `infrastructure/aws/data/rds.yaml`

### Legacy/Optional

- **Vercel:** Frontend deployment (legacy, optional)
- **Railway:** Backend deployment (legacy, optional)
- **Neon:** Database (legacy, migrating to GCP)

### Docker

**Dockerfile:** Root `Dockerfile`
- **Base:** `node:20-slim`
- **Package Manager:** `pnpm@10.21.0`
- **Runtime:** Uses `tsx` to run TypeScript directly
- **Command:** `pnpm start:dev` (runs `tsx index.ts`)

---

## Environment Variables

### Required for Server Startup

- **`NODE_ENV`** - `development` | `production` | `test`
- **`PORT`** - HTTP server port (defaults to 3000, Cloud Run uses 8080)

### Required for Full Functionality

- **`DATABASE_URL`** - PostgreSQL connection string (optional - server can start without)
- **`GCP_PROJECT_ID`** - Google Cloud project ID (for GCP deployments)
- **`GCP_REGION`** - Google Cloud region (defaults to `us-central1`)

### Optional (Features May Be Limited)

- **`INIT_SUBSYSTEMS`** - Enable heavy subsystem initialization (default: disabled)
- **`INIT_HEAVY_SUBSYSTEMS`** - Enable all subsystems (default: disabled)
- **`ENABLE_VERCEL_AGENT`** - Enable Vercel Agent routes (default: disabled)
- **`OPENAI_API_KEY`** - For AI features
- **`ANTHROPIC_API_KEY`** - For Claude AI features
- **`ALLOWED_ORIGINS`** - CORS origins (defaults to `*`)
- **`OPERATOR_WALLETS`** - Admin wallet addresses
- **`TWILIO_ACCOUNT_SID`** - For SMS/voice features
- **`TWILIO_AUTH_TOKEN`** - For SMS/voice features
- **`STRIPE_SECRET_KEY`** - For payment processing
- **`DREAMNET_API_KEY`** - DreamNet API key

### Base Blockchain

- **`VITE_BASE_RPC_URL`** - Base mainnet RPC (default: `https://mainnet.base.org`)
- **`VITE_BASE_CHAIN_ID`** - Base chain ID (default: `8453`)
- **`VITE_SUBSCRIPTION_HUB_ADDRESS`** - Subscription Hub contract address
- **`VITE_SUBSCRIPTION_BADGE_ADDRESS`** - Subscription Badge contract address
- **`PRIVATE_KEY`** - Deployer wallet private key (for contract deployment)

### Zero-Touch Discovery

**Env Keeper Core** automatically discovers environment variables from:
- All `.env` files (recursive search)
- Process environment
- Vercel secrets (if configured)
- And applies them to `process.env` automatically

**No manual setup needed!** Just start the server and Env Keeper discovers everything.

---

## Key Scripts & Commands

### Development

- **`pnpm dev`** - Run all packages in parallel
- **`pnpm dev:app`** - Run server in development mode (`tsx server/index.ts`)
- **`pnpm build`** - Build all packages
- **`pnpm build:app`** - Build client + server
- **`pnpm start`** - Start production server (`node server/dist/index.js`)

### Deployment

- **`pnpm deploy:gke`** - Deploy to GKE Autopilot
- **`pnpm deploy:gcp`** - Deploy to Cloud Run
- **`pnpm deploy:data-gcp`** - Deploy data infrastructure (Cloud SQL, etc.)
- **`pnpm deploy:aws`** - Deploy to AWS
- **`pnpm deploy:eks`** - Deploy to AWS EKS
- **`pnpm deploy:base-mainnet`** - Deploy smart contracts to Base mainnet
- **`pnpm deploy:base-sepolia`** - Deploy smart contracts to Base Sepolia

### Infrastructure

- **`pnpm check:gcp-setup`** - Check GCP setup
- **`pnpm check:credits`** - Check cloud credits
- **`pnpm setup:dreamnet-gcp`** - Setup DreamNet GCP project
- **`pnpm enable:gcp-apis`** - Enable all required GCP APIs

### Utilities

- **`pnpm check`** - TypeScript type checking
- **`pnpm lint`** - Lint all packages
- **`pnpm test`** - Run tests
- **`pnpm clean`** - Clean build artifacts
- **`pnpm dreamnet`** - DreamNet CLI
- **`pnpm dreamnet:shell`** - DreamNet shell

---

## System Interconnections

### The Flow of Life

1. **Server Starts** (`server/index.ts`)
   - Express app created
   - Routes registered
   - Server listens on port

2. **Star Bridge Lungs Initializes** (in `server.listen()` callback)
   - Cross-chain monitoring begins
   - Breath cycles start (every 2 minutes)
   - Chain health metrics collected

3. **Optional Subsystems Initialize** (if `INIT_SUBSYSTEMS=true`)
   - Neural Mesh links subsystems
   - Dream State Core initializes
   - Shield Core starts monitoring
   - Spider Web Core begins event routing
   - All other subsystems start

4. **Event Flow**
   - External events → Spider Web Core (flies)
   - Spider Web → Threads → Orb Weaver
   - Threads → Target systems
   - Systems → Neural Mesh (pulses)
   - Neural Mesh → All connected systems

5. **Self-Healing**
   - Halo-Loop monitors health
   - DreamKeeper diagnoses issues
   - DeployKeeper manages deployments
   - Shield Core detects threats
   - Systems auto-repair

### Integration Points

- **Spider Web Core** ↔ **All operational events** (via `dreamnet-operational-bridge`)
- **Webhook Nervous Core** ↔ **External webhooks** (neurons, synapses, reflex arcs)
- **Event Wormholes** ↔ **Event routing** (through wormholes)
- **Dream Snail** ↔ **Privacy trails** (records all events)
- **Neural Mesh** ↔ **All subsystems** (synaptic connections)
- **Star Bridge Lungs** ↔ **All chains** (cross-chain monitoring)
- **Shield Core** ↔ **All requests** (threat detection)
- **Dream State** ↔ **All access** (governance and passports)

---

## Current State & Status

### ✅ Working

- Server startup (lightweight mode)
- Core routes (`/health`, `/ready`, `/api/agent`)
- Star Bridge Lungs initialization
- GKE deployment scripts
- Cloud Run deployment scripts
- Docker builds
- Base mini-apps frontend components
- Smart contracts deployed on Base
- 200+ API routes registered
- 100+ packages in monorepo

### ⚠️ Known Issues

- Vercel Agent disabled by default (requires `ENABLE_VERCEL_AGENT=true`)
- GitHub Actions workflows disabled (changed to `workflow_dispatch`)
- Some subsystems require `INIT_SUBSYSTEMS=true` to initialize
- Frontend build commented out in Dockerfile (server-only deployment)

### 🔧 Recent Fixes

- Fixed `DEPLOYKEEPER_CORE` cluster configuration
- Fixed GitHub Actions to use `pnpm` instead of `npm`
- Fixed Star Bridge Lungs initialization (moved to `server.listen()` callback)
- Fixed `CustomGPTFleetSystem` to handle missing `registry.json`
- Fixed `InstantWormhole` initialization order issues
- Fixed GKE deployment script (`require` → `import` for ESM)

### 📋 Deployment Status

**GKE:**
- Cluster: `autopilot-cluster-1` exists
- Deployment: Scripts ready, manifests configured
- Image: `gcr.io/aqueous-tube-470317-m6/dreamnet-api:latest`
- Status: Ready for deployment

**Cloud Run:**
- Service: `dreamnet-api`
- Scripts: Ready
- Status: Ready for deployment

**Base:**
- Contracts: 13+ contracts deployed
- Mini-Apps: 29 frontend components ready
- Status: ✅ Deployed and operational

---

## Quick Reference

### Start Server Locally
```bash
pnpm dev:app
```

### Deploy to GKE
```bash
pnpm deploy:gke
```

### Deploy to Cloud Run
```bash
pnpm deploy:gcp
```

### Check Health
```bash
curl http://localhost:3000/health
```

### Check Star Bridge
```bash
curl http://localhost:3000/api/star-bridge
```

### List Agents
```bash
curl http://localhost:3000/api/agents
```

---

## Notes

- **This is a living system** - it evolves and adapts
- **Biomimetic design** - systems mirror biological processes
- **Self-healing** - systems detect and fix issues automatically
- **Zero-touch** - many systems auto-discover configuration
- **Multi-agent** - 143+ agents orchestrated by DreamNet OS
- **Web3-native** - integrated with Base blockchain
- **Production-ready** - deployed on GCP with GKE/Cloud Run

---

**End of Map** 🗺️

This document serves as the complete reference for understanding DreamNet. If you get disconnected, start here to rebuild context.

