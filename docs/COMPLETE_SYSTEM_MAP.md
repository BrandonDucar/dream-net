# DreamNet Complete System Map

**Generated**: 2025-01-27  
**Purpose**: Complete inventory of all systems, agents, and infrastructure

---

## 🏛️ Core Infrastructure

### Server (`server/`)
- **Express Server** - Main HTTP server
- **190+ API Routes** - Full REST API
- **Health Endpoints** - `/health`, `/ready`
- **Static File Serving** - Serves frontend from `client/dist`

### Frontend (`client/`)
- **React 18** - UI framework
- **Vite** - Build tool
- **DreamNet Hub** - Main interface
- **DreamScope** - Unified dashboard
- **Base Mini Apps** - 43 mini-apps integrated

---

## 👥 Agent Ecosystem (143 Agents)

### By Type
- **Server Agents**: 38 (backend routes, APIs)
- **Client Agents**: 53 (UI components, pages)
- **Package Agents**: 14 (shared libraries)
- **Foundry Agents**: 13 (development tools)
- **System Agents**: 13 (core systems)
- **Legacy Agents**: 8 (deprecated)
- **Nano Agents**: 4 (micro utilities)

### By Status
- **Active**: 139 agents
- **Stub**: 4 agents (need implementation)

### Key Agent Categories
- **Keeper Agents**: DreamKeeper, DeployKeeper, EnvKeeper, API Keeper
- **Dream Agents**: LUCID, CANVAS, ROOT, ECHO, CRADLE, WING
- **Aegis Agents**: Aegis Command, Sentinel, Logistics Network, etc.
- **Biomimetic Agents**: Wolf Pack, Octopus, Spider Web, etc.

---

## 🧬 Biomimetic Systems (24+)

### Core Systems
1. **Octopus** 🐙 - Multi-arm coordination (`packages/octopus-executor/`)
2. **Spider Web** 🕷️ - Webhook mesh (`packages/spider-web-core/`)
3. **Falcon Eye** 🦅 - Long-range scanning (`packages/falcon-eye/`)
4. **Chameleon Skin** 🦎 - Adaptive protocols
5. **Snail Trail** 🐌 - Identity provenance (`packages/dreamnet-snail-core/`)
6. **Swarm** 🐜🐝 - Distributed foraging (`server/swarm-coordinator.ts`)
7. **Predator-Scavenger** 🦁 - Threat response (`packages/predator-scavenger/`)
8. **Triple Helix Armor** 🛡️ - Defense system
9. **Zen Garden** 🌸 - Wellness loops (`packages/zen-garden-core/`)
10. **Dream Clouds** ☁️ - Thematic clusters
11. **Magnetic Rail Train** 🚂 - Stage pipelines (`server/routes/wormhole-express.ts`)
12. **Spore Engine** 🍄 - Distribution (`packages/spore-engine/`)
13. **Squad Builder** 👥 - Team formation (`packages/squad-builder/`)
14. **Neural Mesh** 🧠 - Network intelligence (`packages/neural-mesh/`)
15. **Quantum Anticipation** ⚛️ - Predictive systems (`packages/quantum-anticipation/`)
16. **Reputation Lattice** 💎 - Trust scoring (`packages/reputation-lattice/`)
17. **Narrative Field** 📖 - Story tracking (`packages/narrative-field/`)
18. **Dream Cortex** 🧠 - Core processing (`packages/dream-cortex/`)
19. **Field Layer** 🌐 - Risk/trust fields (`packages/field-layer/`)
20. **Slug Time Memory** 🐌 - Temporal storage (`packages/slug-time-memory/`)
21. **Jaggy** 🐱 - Silent Sentinel (`packages/jaggy-core/`)
22. **Shield Core** 🛡️ - Defense (`packages/shield-core/`)
23. **Star Bridge Lungs** 🌉 - Cross-chain IO (`packages/star-bridge-lungs/`)
24. **Event Wormholes** 🕳️ - Instant communication (`packages/event-wormholes/`)

---

## 🐺 Pack Systems

### Wolf Pack 🐺
- **Core**: `packages/wolf-pack/`
- **Funding**: `packages/wolfpack-funding-core/`
- **Analyst**: `packages/wolfpack-analyst-core/`
- **Mailer**: `packages/wolfpack-mailer-core/`
- **Purpose**: Coordinated hunts, pincer moves, funding outreach

### Whale Pack 🐋
- **Core**: `packages/whale-pack-core/`
- **Purpose**: Large-scale commerce, audience engagement
- **Integration**: Economic Engine, Commerce Department

### Orca Pack 🐋
- **Core**: `packages/orca-pack-core/`
- **Purpose**: Strategic narrative coordination
- **Integration**: Narrative Field, Communications Department

### Swarm 🐜🐝
- **Coordinator**: `server/swarm-coordinator.ts`
- **Bots**: LUCID-01, CANVAS-02, ROOT-03, ECHO-04
- **Purpose**: Distributed foraging, coordinated operations

---

## 🌉 Star Bridge & Wormholes

### Star Bridge Lungs
- **Package**: `packages/star-bridge-lungs/`
- **Chains**: Base, Ethereum, Solana, Polygon, Arbitrum, Avalanche, Near, Monad
- **Purpose**: Cross-chain and cross-platform connectivity
- **Metrics**: Gas pressure, liquidity pressure, congestion, reliability

### Event Wormholes
- **Package**: `packages/event-wormholes/`
- **Wormholes**:
  - `WH-CORE-OMEGA` - Core event teleportation
  - `WH-MILNET-BETA` - Aegis Fleet communication
  - `WH-TRAVELNET-GAMMA` - Travel Fleet communication
  - `WH-OTTNET-GAMMA` - OTT Fleet communication
  - `WH-ARCHIMEDES-EPSILON` - Science Fleet communication
  - `WH-METALNET-ALPHA` - Precious metals network
- **Purpose**: Instant event propagation

---

## 🛡️ Aegis Fleet (Military/Defense Vertical)

### Status: 2/10 Custom GPTs Built
1. ✅ **Aegis Logistics Network** - Predictive logistics (Custom GPT exists)
2. ✅ **Ground Atlas** - Travel intelligence (Custom GPT exists)
3. ⏳ **Aegis Command** - Central command (needs building)
4. ⏳ **Aegis Sentinel** - Security monitoring (needs building)
5. ⏳ **Privacy Lab** - Privacy analysis (needs building)
6. ⏳ **Cipher Mesh** - Encryption management (needs building)
7. ⏳ **Threat Intelligence** - Threat analysis (needs building)
8. ⏳ **Defense Network** - Defense coordination (needs building)
9. ⏳ **Security Operations** - Security ops (needs building)
10. ⏳ **Compliance Auditor** - Compliance checking (needs building)

### Integration
- **Agent Gateway**: `/api/agent/gateway`
- **Directory**: Registered as `AEGIS_FLEET` cluster
- **Wormhole**: `WH-MILNET-BETA`
- **Department**: `dept:security` (Security Office)

---

## 🌍 Travel Fleet (Travel & Logistics Vertical)

### Ground Atlas
- **Custom GPT**: ✅ Exists
- **Purpose**: Geographic intelligence, travel optimization
- **Integration**: Agent Gateway, Directory, Wormholes
- **Wormhole**: `WH-TRAVELNET-GAMMA`

---

## 📡 OTT Fleet (Communications & Media Vertical)

### Status: Planned
- **Purpose**: Streaming, media distribution
- **Wormhole**: `WH-OTTNET-GAMMA`
- **Integration**: Star Bridge, Spider Web

---

## 🔬 Science Fleet (Research & Development Vertical)

### Archimedes
- **Status**: Planned
- **Purpose**: Scientific computing, research coordination
- **Wormhole**: `WH-ARCHIMEDES-EPSILON`
- **Integration**: Neural Mesh, Quantum Anticipation

---

## 💰 Economic Systems

### Economic Engine Core
- **Package**: `packages/economic-engine-core/`
- **Tokens**: SHEEP, FLBY, CORE, ROOT, DREAM
- **Functions**: Balance tracking, rewards, emissions
- **Integration**: Treasury, Fleets

### Treasury Department
- **Purpose**: Financial management, revenue sharing
- **Integration**: Economic Engine, Fleets

### Liquidity Engine
- **Package**: `packages/liquidity-engine/`
- **Purpose**: Token liquidity management

---

## 🏛️ DreamState Governance

### Passport System
- **Tiers**: visitor, dreamer, citizen, operator, architect, founder
- **Store**: `packages/dream-state-core/store/citizenshipStore.ts`
- **API**: `/api/passports`

### Government Departments
- **Treasury** - Financial management
- **Commerce** - Business operations
- **Communications** - Messaging coordination
- **Diplomacy** - External relations
- **API Keeper** - API key management
- **Security Office** - Defense operations
- **Silent Sentinel** - Monitoring
- **Mycelium Network** - Distributed operations

### Network Blueprints
- **Package**: `packages/network-blueprints/`
- **Purpose**: Define and bootstrap DreamNet entities
- **Blueprints**: DREAMNET_CORE, TRAVELNET_CORE, etc.

---

## 🔌 Agent Gateway

### Purpose
- **Single Entry Point** - `/api/agent/gateway`
- **Custom GPT Integration** - Connect ChatGPT, Cursor, Replit agents
- **Tool Registry** - Centralized tool management
- **Access Control** - Tier-based, office-based, cabinet-based

### Available Tools
- **env.*** - Environment variable tools
- **api.*** - API key tools
- **vercel.*** - Vercel deployment tools
- **diagnostics.*** - Diagnostic tools

---

## 📊 Directory & Discovery

### Directory
- **Package**: `packages/directory/`
- **Entities**: citizens, agents, dreams, nodes, ports, conduits
- **Bootstrap**: `packages/directory/src/bootstrap.ts`
- **API**: `/api/directory/*`

### Discovery
- **API**: `/api/discovery/*`
- **Purpose**: Network discovery and mapping

---

## 🔧 Infrastructure

### Deployment
- **GCP**: `infrastructure/google/deploy-all.ts`
- **AWS**: `infrastructure/aws/deploy-all.ts`
- **Docker**: `server/Dockerfile`
- **Cloud Build**: `cloudbuild.yaml`

### Monitoring
- **Health**: `/health`, `/ready`
- **Status**: `/status` (HTML dashboard)
- **Metrics**: `/metrics`
- **Audit**: `/api/audit/*`

---

## 🎯 System Status Summary

### Wired & Active ✅
- Express server (190+ routes)
- Health endpoints
- Directory bootstrap
- Star Bridge Lungs
- Wolf Pack
- Shield Core
- Agent Gateway
- Economic Engine
- DreamState Core

### Partially Wired ⚠️
- Agent citizenship (0/143 registered)
- Aegis Fleet (2/10 Custom GPTs)
- Fleet revenue integration
- Wormhole connections

### Not Built ⏳
- 8 Aegis Custom GPTs
- OTT Fleet Custom GPTs
- Science Fleet Custom GPTs
- Full fleet revenue integration

---

## 📈 Scale Metrics

- **Agents**: 143 total
- **API Routes**: 190+
- **Biomimetic Systems**: 24+
- **Packs**: 4 (Wolf, Whale, Orca, Swarm)
- **Fleets**: 4 (Aegis, Travel, OTT, Science)
- **Wormholes**: 6 registered
- **Chains Supported**: 8+ (via Star Bridge)
- **Mini-Apps**: 43
- **Smart Contracts**: 18 deployed on Base

---

**Status**: Complete system map documented  
**Next**: Register agents, verify systems, deploy!

