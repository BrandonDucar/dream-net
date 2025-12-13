# DreamNet Complete Codebase Exploration & Documentation

**Status**: In Progress (6% explored, 94% remaining)  
**Last Updated**: 2025-01-27  
**Goal**: Document 100% of DreamNet codebase

---

## Exploration Status

### ✅ Explored & Documented (6%)

#### Server Architecture (COMPLETE)
- ✅ `server/index.ts` - Main server entry point
- ✅ `server/core/` - Core systems (13 files)
  - ✅ `dreamnet-os.ts` - DreamNet OS core
  - ✅ `SuperBrain.ts` - Autonomous orchestration
  - ✅ `SuperSpine.ts` - Agent orchestration backbone
  - ✅ `DriveEngine.ts` - Pack motivation system
  - ✅ `BrainIntegration.ts` - Brain integration hooks
  - ✅ `BiomimeticIntegration.ts` - Biomimetic system hooks
  - ✅ `shield-spine-integration.ts` - Shield ↔ Spine integration
  - ✅ `types.ts` - Core types
  - ✅ `agents/` - Core agents (13 files)
- ✅ `server/middleware/` - Middleware chain (13 files)
  - ✅ `traceId.ts` - Trace ID generation
  - ✅ `idempotency.ts` - Idempotency handling
  - ✅ `tierResolver.ts` - Tier resolution
  - ✅ `metrics.ts` - Golden signals collection
- ✅ `server/routes/` - Route handlers (200+ files)
  - ✅ `health.ts` - Health checks
  - ✅ `status.ts` - Status endpoints
- ✅ `server/services/` - Services (14 files)
  - ✅ `IntegrationFlagsService.ts` - Feature flags
- ✅ `server/config/` - Configuration
  - ✅ `env.ts` - Environment variables
- ✅ `server/db.ts` - Database connection
- ✅ `server/core/` - Reliability system
  - ✅ `startup-dag.ts` - Dependency DAG
  - ✅ `health-gates.ts` - Health gates
  - ✅ `circuit-breaker.ts` - Circuit breakers
  - ✅ `dag-loader.ts` - DAG loader
  - ✅ `traffic-shaping.ts` - Traffic shaping
  - ✅ `migrations.ts` - Database migrations
  - ✅ `queue-init.ts` - Queue initialization

#### Documentation Created
- ✅ `docs/COMPLETE_SYSTEM_MAP.md` - Complete system architecture
- ✅ `docs/SERVER_BLUEPRINT.md` - Server blueprint
- ✅ `docs/CODEBASE_EXPLORATION_STATUS.md` - Exploration status
- ✅ `docs/COHESIVE_WORKFLOW_IMPLEMENTATION.md` - Workflow documentation

---

### ⏳ Partially Explored (10%)

#### Packages (140+ packages, ~5% explored)
- ✅ `packages/orchestrator-core/` - Agent orchestration
- ✅ `packages/runtime-bridge-core/` - Runtime bridge
- ✅ `packages/latent-collaboration/` - Latent collaboration
- ✅ `packages/prediction-core/` - Prediction kernel
- ✅ `packages/dreamnet-control-core/` - Control core
- ✅ `packages/neural-mesh/` - Neural mesh (index only)
- ✅ `packages/spider-web-core/` - Spider web (index only)
- ✅ `packages/shield-core/` - Shield core (index only)
- ⏳ `packages/wolf-pack/` - Wolf pack (structure known, details pending)
- ⏳ `packages/wolfpack-funding-core/` - Funding core (pending)
- ⏳ `packages/wolfpack-analyst-core/` - Analyst core (pending)
- ⏳ `packages/wolfpack-mailer-core/` - Mailer core (pending)
- ⏳ `packages/whale-pack-core/` - Whale pack (pending)
- ⏳ `packages/orca-pack-core/` - Orca pack (pending)
- ⏳ `packages/octopus-executor/` - Octopus executor (pending)
- ⏳ `packages/star-bridge-lungs/` - Star bridge (pending)
- ⏳ `packages/slug-time-memory/` - Slug time memory (pending)
- ⏳ `packages/predator-scavenger/` - Predator scavenger (pending)
- ⏳ `packages/dream-cortex/` - Dream cortex (pending)
- ⏳ `packages/reputation-lattice/` - Reputation lattice (pending)
- ⏳ `packages/narrative-field/` - Narrative field (pending)
- ⏳ `packages/identity-grid/` - Identity grid (pending)
- ⏳ `packages/dream-vault/` - Dream vault (pending)
- ⏳ `packages/dream-shop/` - Dream shop (pending)
- ⏳ `packages/field-layer/` - Field layer (pending)
- ⏳ `packages/dreambet-core/` - Dream bet core (pending)
- ⏳ `packages/zen-garden-core/` - Zen garden (pending)
- ⏳ `packages/civic-panel-core/` - Civic panel (pending)
- ⏳ `packages/dream-tank-core/` - Dream tank (pending)
- ⏳ `packages/liquidity-engine/` - Liquidity engine (pending)
- ⏳ `packages/social-hub-core/` - Social hub (pending)
- ⏳ `packages/init-ritual-core/` - Init ritual (pending)
- ⏳ `packages/economic-engine-core/` - Economic engine (pending)
- ⏳ `packages/agent-registry-core/` - Agent registry (pending)
- ⏳ `packages/dreamnet-os-core/` - DreamNet OS core (pending)
- ⏳ `packages/quantum-anticipation/` - Quantum anticipation (pending)
- ⏳ `packages/squad-alchemy/` - Squad alchemy (pending)
- ⏳ `packages/halo-loop/` - Halo loop (pending)
- ⏳ `packages/dreamnet-snail-core/` - Dream snail (pending)
- ⏳ `packages/jaggy-core/` - Jaggy core (pending)
- ⏳ `packages/webhook-nervous-core/` - Webhook nervous (pending)
- ⏳ `packages/spider-web-core/` - Spider web (pending)
- ⏳ `packages/internal-ports/` - Internal ports (pending)
- ⏳ `packages/internal-router/` - Internal router (pending)
- ⏳ `packages/event-wormholes/` - Event wormholes (pending)
- ⏳ `packages/nerve/` - Nerve fabric (pending)
- ⏳ `packages/port-governor/` - Port governor (pending)
- ⏳ `packages/agent-wallet-manager/` - Agent wallet manager (pending)
- ⏳ `packages/dream-token/` - Dream token (pending)
- ⏳ `packages/base-mini-apps/` - Base mini apps (pending)
- ⏳ `packages/citadel-core/` - Citadel core (pending)
- ⏳ `packages/guardian-framework-core/` - Guardian framework (pending)
- ⏳ `packages/coinsensei-core/` - Coin sensei (pending)
- ⏳ `packages/browser-agent-core/` - Browser agent (pending)
- ⏳ `packages/competitive-intelligence-core/` - Competitive intelligence (pending)
- ⏳ `packages/market-data-core/` - Market data (pending)
- ⏳ `packages/data-integrity-core/` - Data integrity (pending)
- ⏳ `packages/inbox-squared-core/` - Inbox squared (pending)
- ⏳ `packages/dreamnet-vercel-agent/` - Vercel agent (pending)
- ⏳ `packages/dreamnet-voice-twilio/` - Voice Twilio (pending)
- ⏳ `packages/api-keeper-core/` - API keeper (pending)
- ⏳ `packages/env-keeper-core/` - Env keeper (pending)
- ⏳ `packages/ai-seo-core/` - AI SEO (pending)
- ⏳ `packages/deployment-core/` - Deployment core (pending)
- ⏳ `packages/domain-issuance-core/` - Domain issuance (pending)
- ⏳ `packages/governance/` - Governance (pending)
- ⏳ `packages/governance-aragon/` - Aragon governance (pending)
- ⏳ `packages/governance-snapshot/` - Snapshot governance (pending)
- ⏳ `packages/social-lens/` - Lens protocol (pending)
- ⏳ `packages/social-farcaster/` - Farcaster (pending)
- ⏳ `packages/social-media-poster/` - Social media poster (pending)
- ⏳ `packages/media-vault/` - Media vault (pending)
- ⏳ `packages/media-jellyfin/` - Jellyfin (pending)
- ⏳ `packages/media-peertube/` - PeerTube (pending)
- ⏳ `packages/research-researchhub/` - ResearchHub (pending)
- ⏳ `packages/research-desci/` - DeSci (pending)
- ⏳ `packages/travel-opentripplanner/` - OpenTripPlanner (pending)
- ⏳ `packages/travel-valhalla/` - Valhalla (pending)
- ⏳ `packages/security-ghidra/` - Ghidra (pending)
- ⏳ `packages/security-metasploit/` - Metasploit (pending)
- ⏳ `packages/music-musicgen/` - MusicGen (pending)
- ⏳ `packages/music-musiclm/` - MusicLM (pending)
- ⏳ `packages/chat-matrix/` - Matrix (pending)
- ⏳ `packages/chat-rocketchat/` - RocketChat (pending)
- ⏳ `packages/agent-langchain/` - LangChain (pending)
- ⏳ `packages/agent-crewai/` - CrewAI (pending)
- ⏳ `packages/agent-superagi/` - SuperAGI (pending)
- ⏳ `packages/agent-gateway/` - Agent gateway (pending)
- ⏳ `packages/mcp-backbone/` - MCP backbone (pending)
- ⏳ `packages/mcp-gateway/` - MCP gateway (pending)
- ⏳ `packages/mcp-servers/` - MCP servers (pending)
- ⏳ `packages/observability-core/` - Observability (pending)
- ⏳ `packages/observability-prometheus/` - Prometheus (pending)
- ⏳ `packages/sentry-core/` - Sentry (pending)
- ⏳ `packages/algolia-core/` - Algolia (pending)
- ⏳ `packages/cloudinary-core/` - Cloudinary (pending)
- ⏳ `packages/contentful-core/` - Contentful (pending)
- ⏳ `packages/resend-core/` - Resend (pending)
- ⏳ `packages/upstash-redis-core/` - Upstash Redis (pending)
- ⏳ `packages/jamsocket-core/` - Jamsocket (pending)
- ⏳ `packages/sync-yjs-core/` - Yjs sync (pending)
- ⏳ `packages/sync-automerge-core/` - Automerge sync (pending)
- ⏳ `packages/sync-replicache-core/` - Replicache sync (pending)
- ⏳ `packages/sync-dreamnet-core/` - DreamNet sync (pending)
- ⏳ `packages/railgun-integration/` - Railgun (pending)
- ⏳ `packages/kaspa-integration/` - Kaspa (pending)
- ⏳ `packages/vechain-core/` - VeChain (pending)
- ⏳ `packages/stablecoin-core/` - Stablecoin (pending)
- ⏳ `packages/liquidity-core/` - Liquidity core (pending)
- ⏳ `packages/rewards-engine/` - Rewards engine (pending)
- ⏳ `packages/orders/` - Orders (pending)
- ⏳ `packages/metrics-engine/` - Metrics engine (pending)
- ⏳ `packages/memory-dna/` - Memory DNA (pending)
- ⏳ `packages/graft-engine/` - Graft engine (pending)
- ⏳ `packages/spore-engine/` - Spore engine (pending)
- ⏳ `packages/squad-builder/` - Squad builder (pending)
- ⏳ `packages/network-blueprints/` - Network blueprints (pending)
- ⏳ `packages/dreamops-constellation/` - DreamOps constellation (pending)
- ⏳ `packages/dreamnet-world/` - DreamNet world (pending)
- ⏳ `packages/dreamnet-bridge/` - DreamNet bridge (pending)
- ⏳ `packages/tag-bridge-core/` - Tag bridge (pending)
- ⏳ `packages/dreamnet-cost-core/` - Cost core (pending)
- ⏳ `packages/dreamnet-cost-economic-bridge/` - Cost economic bridge (pending)
- ⏳ `packages/dreamnet-health-core/` - Health core (pending)
- ⏳ `packages/dreamnet-shield-health-bridge/` - Shield health bridge (pending)
- ⏳ `packages/dreamnet-rbac-core/` - RBAC core (pending)
- ⏳ `packages/dreamnet-scheduler-core/` - Scheduler core (pending)
- ⏳ `packages/dreamnet-autoscale-core/` - Autoscale core (pending)
- ⏳ `packages/dreamnet-incident-core/` - Incident core (pending)
- ⏳ `packages/dreamnet-metrics-core/` - Metrics core (pending)
- ⏳ `packages/dreamnet-alerts-core/` - Alerts core (pending)
- ⏳ `packages/dreamnet-audit-core/` - Audit core (pending)
- ⏳ `packages/dreamnet-operational-bridge/` - Operational bridge (pending)
- ⏳ `packages/dreamnet-identity-passport-bridge/` - Identity passport bridge (pending)
- ⏳ `packages/dreamnet-geofence-core/` - Geofence core (pending)
- ⏳ `packages/dreamnet-video-brand-core/` - Video brand core (pending)
- ⏳ `packages/dream-state-core/` - Dream state (pending)
- ⏳ `packages/dreamstate/` - Dreamstate (pending)
- ⏳ `packages/directory/` - Directory (pending)
- ⏳ `packages/ops-sentinel/` - Ops sentinel (pending)
- ⏳ `packages/signalgrid-core/` - Signal grid (pending)
- ⏳ `packages/namecheap-api-core/` - Namecheap API (pending)
- ⏳ `packages/website-ai-designer/` - Website AI designer (pending)
- ⏳ `packages/cursor-dreamnet-client/` - Cursor client (pending)
- ⏳ `packages/dreamnet-agent-client/` - Agent client (pending)
- ⏳ `packages/utils/` - Utils (pending)
- ⏳ `packages/alive-mode/` - Alive mode (pending)
- ⏳ `packages/card-forge-pro/` - Card forge (pending)
- ⏳ `packages/dark-fabric/` - Dark fabric (pending)
- ⏳ `packages/api-validation-core/` - API validation (pending)
- ⏳ `packages/spine-redis-event-bus/` - Spine Redis event bus (pending)

#### Spine Systems (7 systems, ~30% explored)
- ✅ `spine/index.ts` - Spine entry point (pending read)
- ✅ `spine/dreamnet-event-bus/` - Event bus (pending read)
- ✅ `spine/dreamnet-os-linker/` - OS linker (pending read)
- ✅ `spine/agent-interop/` - Agent interop (pending read)
- ✅ `spine/bgp-for-agents/` - Agent BGP (pending read)
- ⏳ `spine/dreamnet-mcp-bridge/` - MCP bridge (pending)
- ⏳ `spine/wrappers/` - System wrappers (pending)
- ⏳ `spine/agent-protocols/` - Agent protocols (pending)

#### Client Architecture (~5% explored)
- ✅ `client/src/App.tsx` - Main app component (partial)
- ✅ `client/src/main.tsx` - Entry point
- ⏳ `client/src/pages/` - 136 page files (pending)
- ⏳ `client/src/components/` - 100+ components (pending)
- ⏳ `client/src/miniapps/` - Mini-apps (pending)
- ⏳ `client/src/api/` - API clients (pending)
- ⏳ `client/src/hooks/` - React hooks (pending)
- ⏳ `client/src/contexts/` - React contexts (pending)
- ⏳ `client/src/utils/` - Utilities (pending)

#### Apps (6 apps, 0% explored)
- ⏳ `apps/hub/` - DreamHub backend
- ⏳ `apps/dreamos/` - DreamOS core
- ⏳ `apps/api-forge/` - API forge tool
- ⏳ `apps/sitebuilder/` - Site builder
- ⏳ `apps/seo/` - SEO service
- ⏳ `apps/admin-dashboard/` - Admin dashboard

#### Services (5 services, 0% explored)
- ⏳ `services/web/` - Web service
- ⏳ `services/router/` - Router service
- ⏳ `services/dreamkeeper/` - DreamKeeper service
- ⏳ `services/api/` - API service
- ⏳ `services/agents/` - Agents service

#### Infrastructure (0% explored)
- ⏳ `infrastructure/google/` - GCP deployment
- ⏳ `infrastructure/aws/` - AWS deployment
- ⏳ `deploy/` - Deployment configs

#### Contracts (0% explored)
- ⏳ `contracts/` - Solidity smart contracts

#### Scripts (0% explored)
- ⏳ `scripts/` - Utility scripts (100+ files)

---

## Package Categories

### Core Biomimetic Systems (20 packages)
1. `neural-mesh` - Distributed memory network
2. `spider-web-core` - Nervous system (event routing)
3. `shield-core` - Immune system (security)
4. `star-bridge-lungs` - Lungs (cross-chain)
5. `slug-time-memory` - Temporal memory
6. `predator-scavenger` - Metabolic cleanup
7. `dream-cortex` - Decision making
8. `reputation-lattice` - Trust system
9. `narrative-field` - Story stream
10. `identity-grid` - Identity layer
11. `halo-loop` - Self-healing
12. `dreamnet-snail-core` - Privacy layer
13. `jaggy-core` - Silent sentinel
14. `webhook-nervous-core` - Webhook nervous system
15. `quantum-anticipation` - Prediction layer
16. `squad-alchemy` - Squad optimization
17. `field-layer` - Global parameters
18. `dream-state-core` - Governance
19. `dreamstate` - State management
20. `directory` - Directory service

### Agent & Pack Systems (15 packages)
1. `wolf-pack` - Offensive agents
2. `wolfpack-funding-core` - Funding discovery
3. `wolfpack-analyst-core` - Analysis agents
4. `wolfpack-mailer-core` - Email agents
5. `whale-pack-core` - Commerce agents
6. `orca-pack-core` - Communication agents
7. `octopus-executor` - Multi-arm executor
8. `orchestrator-core` - Agent orchestration
9. `runtime-bridge-core` - Runtime bridge
10. `agent-registry-core` - Agent registry
11. `agent-wallet-manager` - Wallet management
12. `citadel-core` - Strategic command
13. `guardian-framework-core` - Guardian framework
14. `squad-builder` - Squad builder
15. `agent-gateway` - Agent gateway

### Economic & Token Systems (10 packages)
1. `dream-token` - DREAM token
2. `economic-engine-core` - Economic engine
3. `rewards-engine` - Rewards system
4. `liquidity-engine` - Liquidity pools
5. `liquidity-core` - Liquidity client
6. `dream-vault` - Token vault
7. `dream-shop` - Marketplace
8. `dreambet-core` - Gaming/betting
9. `dream-tank-core` - Incubator
10. `stablecoin-core` - Stablecoin

### Social & Identity Systems (8 packages)
1. `social-hub-core` - Social feed
2. `zen-garden-core` - Engagement rituals
3. `init-ritual-core` - Onboarding
4. `social-lens` - Lens protocol
5. `social-farcaster` - Farcaster
6. `social-media-poster` - Social posting
7. `identity-grid` - Identity layer (duplicate)
8. `reputation-lattice` - Reputation (duplicate)

### Integration & Bridge Systems (25 packages)
1. `dreamnet-bridge` - Bridge system
2. `tag-bridge-core` - Tag bridge
3. `event-wormholes` - Event routing
4. `internal-router` - Internal routing
5. `internal-ports` - Port system
6. `port-governor` - Port governance
7. `nerve` - Nerve fabric
8. `mcp-backbone` - MCP backbone
9. `mcp-gateway` - MCP gateway
10. `mcp-servers/` - MCP servers
11. `dreamnet-operational-bridge` - Operational bridge
12. `dreamnet-cost-economic-bridge` - Cost economic bridge
13. `dreamnet-shield-health-bridge` - Shield health bridge
14. `dreamnet-identity-passport-bridge` - Identity passport bridge
15. `railgun-integration` - Railgun
16. `kaspa-integration` - Kaspa
17. `vechain-core` - VeChain
18. `coinsensei-core` - Coin analysis
19. `inbox-squared-core` - Email integration
20. `dreamnet-voice-twilio` - Voice integration
21. `dreamnet-vercel-agent` - Vercel agent
22. `browser-agent-core` - Browser automation
23. `competitive-intelligence-core` - Competitive intelligence
24. `market-data-core` - Market data
25. `data-integrity-core` - Data integrity

### External Service Integrations (20 packages)
1. `agent-langchain` - LangChain
2. `agent-crewai` - CrewAI
3. `agent-superagi` - SuperAGI
4. `governance-aragon` - Aragon governance
5. `governance-snapshot` - Snapshot governance
6. `media-jellyfin` - Jellyfin
7. `media-peertube` - PeerTube
8. `research-researchhub` - ResearchHub
9. `research-desci` - DeSci
10. `travel-opentripplanner` - OpenTripPlanner
11. `travel-valhalla` - Valhalla
12. `security-ghidra` - Ghidra
13. `security-metasploit` - Metasploit
14. `music-musicgen` - MusicGen
15. `music-musiclm` - MusicLM
16. `chat-matrix` - Matrix
17. `chat-rocketchat` - RocketChat
18. `algolia-core` - Algolia
19. `cloudinary-core` - Cloudinary
20. `contentful-core` - Contentful

### Infrastructure & Operations (15 packages)
1. `api-keeper-core` - API keeper
2. `env-keeper-core` - Env keeper
3. `ai-seo-core` - AI SEO
4. `deployment-core` - Deployment
5. `domain-issuance-core` - Domain issuance
6. `observability-core` - Observability
7. `observability-prometheus` - Prometheus
8. `sentry-core` - Sentry
9. `resend-core` - Resend
10. `upstash-redis-core` - Upstash Redis
11. `jamsocket-core` - Jamsocket
12. `namecheap-api-core` - Namecheap API
13. `ops-sentinel` - Ops sentinel
14. `signalgrid-core` - Signal grid
15. `dreamnet-geofence-core` - Geofence

### Sync & Collaboration (5 packages)
1. `sync-yjs-core` - Yjs sync
2. `sync-automerge-core` - Automerge sync
3. `sync-replicache-core` - Replicache sync
4. `sync-dreamnet-core` - DreamNet sync
5. `latent-collaboration` - Latent collaboration

### Core DreamNet Systems (10 packages)
1. `dreamnet-os-core` - DreamNet OS
2. `dreamnet-control-core` - Control core
3. `dreamnet-cost-core` - Cost core
4. `dreamnet-health-core` - Health core
5. `dreamnet-rbac-core` - RBAC core
6. `dreamnet-scheduler-core` - Scheduler core
7. `dreamnet-autoscale-core` - Autoscale core
8. `dreamnet-incident-core` - Incident core
9. `dreamnet-metrics-core` - Metrics core
10. `dreamnet-alerts-core` - Alerts core

### Mini-Apps & UI (5 packages)
1. `base-mini-apps` - Base mini apps
2. `website-ai-designer` - Website designer
3. `cursor-dreamnet-client` - Cursor client
4. `dreamnet-agent-client` - Agent client
5. `card-forge-pro` - Card forge

### Utilities & Misc (10 packages)
1. `utils` - Utilities
2. `alive-mode` - Alive mode
3. `dark-fabric` - Dark fabric
4. `api-validation-core` - API validation
5. `spine-redis-event-bus` - Spine Redis event bus
6. `memory-dna` - Memory DNA
7. `graft-engine` - Graft engine
8. `spore-engine` - Spore engine
9. `network-blueprints` - Network blueprints
10. `dreamops-constellation` - DreamOps constellation

---

## Next Steps

1. **Continue Package Exploration** - Read and document all 140+ packages
2. **Spine Systems Deep Dive** - Complete exploration of all spine systems
3. **Client Architecture** - Map all pages, components, and flows
4. **Apps Documentation** - Document all 6 apps
5. **Services Documentation** - Document all 5 services
6. **Infrastructure Documentation** - Document deployment configs
7. **Contracts Documentation** - Document smart contracts
8. **Scripts Documentation** - Document utility scripts

---

## Exploration Methodology

1. **Read** - Read key files in each package/system
2. **Map** - Map dependencies and relationships
3. **Document** - Document purpose, architecture, and integration points
4. **Verify** - Verify understanding with codebase search
5. **Update** - Update exploration status

---

**This document will be continuously updated as exploration progresses.**

