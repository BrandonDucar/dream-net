# DreamNet Complete Codebase Documentation

**Status**: In Progress (25% explored, 75% remaining)  
**Last Updated**: 2025-01-27  
**Goal**: 100% documentation of WHY, WHERE, WHAT, HOW

---

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Server Architecture](#server-architecture)
3. [Package Ecosystem](#package-ecosystem)
4. [Spine Systems](#spine-systems)
5. [Client Architecture](#client-architecture)
6. [Data Flow & Integration](#data-flow--integration)
7. [Design Decisions & Rationale](#design-decisions--rationale)

---

## System Architecture Overview

### The Vision: Biomimetic Digital Organism

DreamNet is architected as a **living, breathing biomimetic digital organism** - not just software, but a complete ecosystem modeled after biological systems. Every component has a biological metaphor that explains WHY it exists and HOW it works.

### Core Principles

1. **Biomimetic Design**: Every system mirrors biological functions
2. **Resilience First**: Circuit breakers, health gates, graceful degradation
3. **Observability**: Golden signals, trace IDs, comprehensive metrics
4. **Security**: Multi-layer shield system, zero-trust, threat prediction
5. **Autonomy**: Self-healing, self-optimizing, self-governing

---

## Server Architecture

### Entry Point: `server/index.ts`

**WHY**: Single entry point ensures predictable startup sequence and clear initialization order.

**WHAT**: Express.js server that:
1. Creates HTTP server immediately (for Cloud Run compatibility)
2. Sets up middleware chain (trace → metrics → idempotency → tier → control → routes)
3. Registers all route handlers
4. Initializes optional subsystems asynchronously
5. Starts reliability system (if enabled)

**HOW**: 
- Server created synchronously (line ~150)
- Middleware registered in order (lines ~200-250)
- Routes registered via `app.use("/api", createXRouter())` (lines ~300-800)
- Optional subsystems initialized after server listening (lines ~1200+)
- Reliability system initialized via `dag-loader.ts` (lines ~1300+)

**WHERE**: `server/index.ts` (main orchestration file)

### Middleware Chain

**WHY**: Order matters - each middleware depends on the previous one's output.

**WHAT**: Request flows through:
1. **Trace ID Middleware** (`server/middleware/traceId.ts`)
   - Generates unique trace ID for every request
   - WHY: Enables request tracing across distributed systems
   - HOW: Creates UUID, attaches to `req.traceId`

2. **Metrics Middleware** (`server/middleware/metrics.ts`)
   - Collects golden signals (traffic, errors, latency)
   - WHY: Observability - need to know system health
   - HOW: Tracks request count, error count, response times (p50/p95/p99)

3. **Idempotency Middleware** (`server/middleware/idempotency.ts`)
   - Prevents duplicate requests
   - WHY: Network retries can cause duplicate operations
   - HOW: Checks `Idempotency-Key` header, caches responses

4. **Tier Resolver Middleware** (`server/middleware/tierResolver.ts`)
   - Resolves user tier (free, pro, enterprise)
   - WHY: Different access levels for different users
   - HOW: Checks wallet address, API key, or session

5. **Control Core Middleware** (`packages/dreamnet-control-core/controlCoreMiddleware.ts`)
   - Kill switches, rate limiting, tier enforcement
   - WHY: Safety - need to shut down system quickly if needed
   - HOW: Checks global kill switch, tier limits, rate limits

6. **Auto SEO Middleware** (`server/middleware/autoSEORequestMiddleware.ts`)
   - SEO optimization for requests
   - WHY: Better search engine visibility
   - HOW: Adds meta tags, structured data

**WHERE**: `server/index.ts` lines ~200-250

### Route Handlers

**WHY**: RESTful API endpoints for frontend and external integrations.

**WHAT**: 200+ route files organized by domain:
- `/api/agents` - Agent management
- `/api/dreams` - Dream CRUD operations
- `/api/wallets` - Wallet operations
- `/api/agent-wallets` - Agent wallet management
- `/api/gpt-agents` - GPT agent integration
- `/api/chatgpt-agent` - ChatGPT agent mode
- `/api/forge` - Card forge operations
- `/api/operator` - Operator commands
- `/api/ports/ops` - Port operations
- `/api/nerve` - Nerve fabric stats
- `/api/observability` - Golden signals, health gates, circuit breakers
- `/api/latent-sessions` - Latent collaboration sessions
- `/api/prediction` - Prediction kernel (future)
- `/api/health` - Health checks
- `/api/status` - System status

**HOW**: Each route file exports a router created with `express.Router()`, registered in `server/index.ts` via `app.use("/api", createXRouter())`.

**WHERE**: `server/routes/*.ts` (200+ files)

### Reliability System

**WHY**: Production systems need predictable startup, health monitoring, and graceful degradation.

**WHAT**: Comprehensive reliability patterns:
1. **Dependency DAG** (`server/core/startup-dag.ts`)
   - Ensures services start in correct order
   - WHY: Database must start before services that use it
   - HOW: Topological sort of service dependencies

2. **Health Gates** (`server/core/health-gates.ts`)
   - Blocks traffic until critical services are ready
   - WHY: Prevents serving requests to broken systems
   - HOW: Runs health checks, requires N consecutive passes

3. **Circuit Breakers** (`server/core/circuit-breaker.ts`)
   - Prevents cascading failures
   - WHY: If OpenAI API is down, don't keep calling it
   - HOW: Tracks failures, opens circuit after threshold, half-open after timeout

4. **Traffic Shaping** (`server/core/traffic-shaping.ts`)
   - Gradual rollouts and user allow/deny lists
   - WHY: Test new features safely before full rollout
   - HOW: Percentage-based routing, deterministic hashing

5. **Feature Flags** (`server/config/feature-flags.yaml`, `server/services/IntegrationFlagsService.ts`)
   - Runtime feature toggles
   - WHY: Enable/disable features without deployment
   - HOW: YAML config + service that checks flags, supports brownout mode

6. **Metrics Collection** (`server/middleware/metrics.ts`)
   - Golden signals (traffic, errors, latency, saturation)
   - WHY: Need to know system health
   - HOW: Middleware tracks every request, exposes via `/api/observability/golden-signals`

7. **Idempotent Initialization** (`server/core/migrations.ts`, `server/core/queue-init.ts`)
   - Safe, repeatable startup operations
   - WHY: Can restart server without breaking things
   - HOW: Checks if already initialized before running

**WHERE**: `server/core/*.ts`, `server/config/feature-flags.yaml`, `deploy/graph.json`

---

## Package Ecosystem

### Core Biomimetic Systems

#### Neural Mesh (`packages/neural-mesh/`)

**WHY**: Distributed memory network - agents need to share context without direct communication.

**WHAT**: 
- `link()` - Creates synaptic connections between subsystems
- `pulse()` - Sends events through mesh (converts to synaptic spikes)
- `remember()` - Stores long-term memory traces
- `storeLatent()` - Stores latent representations for agent collaboration
- `retrieveLatent()` - Finds similar latent representations

**HOW**: 
- Synapses built via `synapseBuilder.ts` - creates connections between systems
- Pulses routed via `meshPulse.ts` - converts events to spikes, routes through synapses
- Memory stored via `meshMemory.ts` - long-term storage
- Latent memory via `latentMemory.ts` - vector storage for agent collaboration

**WHERE**: `packages/neural-mesh/src/`

**INTEGRATION**: Used by orchestrator to link subsystems, used by latent collaboration to store agent thoughts.

#### Spider Web Core (`packages/spider-web-core/`)

**WHY**: Nervous system - routes all events through threads (signal pathways).

**WHAT**:
- **Flies** = External events (webhooks, messages, signals)
- **Threads** = Signal pathways that route events to targets
- **Sensors** = Funnel Web spiders that catch flies
- **Orb Weaver** = Routes and executes threads

**HOW**:
1. External event arrives → **Fly** created (`flyCatcher.ts`)
2. **Funnel Web** sensor catches the fly
3. Fly → **Thread** conversion (signal pathway)
4. **Orb Weaver** routes thread to target systems (`threadExecutor.ts`)
5. Thread executes → Creates response threads
6. Patterns learned → Future routing optimized

**WHERE**: `packages/spider-web-core/src/`

**INTEGRATION**: All operational events flow through Spider Web threads (`dreamnet-operational-bridge`).

#### Shield Core (`packages/shield-core/`)

**WHY**: Immune system - protects against threats, detects anomalies, fires defensive spikes.

**WHAT**:
- Multi-phase shield system (cellular, cross-chain)
- Threat detection (`threatDetector.ts`)
- Offensive spikes (`offensiveSpike.ts`, `advancedSpikes.ts`)
- Cellular shields (`cellularShield.ts`) - shields propagate via wormholes
- Cross-chain shields (`crossChainShield.ts`) - protects across blockchains
- AI threat detection (`aiThreatDetector.ts`)
- Zero-trust verification (`zeroTrust.ts`)
- Threat prediction (`threatPredictor.ts`)
- Risk profiling (`risk.ts`)

**HOW**:
- Shield cycles run via `shieldScheduler.ts`
- Threats detected → analyzed → spikes fired if needed
- Cellular shields propagate via event wormholes
- Cross-chain shields sync across blockchains
- AI analyzes patterns to predict threats

**WHERE**: `packages/shield-core/src/`

**INTEGRATION**: Wrapped by `spine/wrappers/ShieldCoreWrapper.ts` for event emission.

#### Star Bridge Lungs (`packages/star-bridge-lungs/`)

**WHY**: Lungs - monitors cross-chain health, routes value flows.

**WHAT**:
- **Breathing** = Cross-chain monitoring and routing preferences
- **Inhale** = Value flowing toward target chain
- **Exhale** = Value flowing away from source chain
- **Breath Snapshots** = Chain health metrics (gas pressure, congestion, reliability)
- **Breath Cycles** = Runs every 2 minutes, monitors Base, Ethereum, Solana, Polygon, Arbitrum, Avalanche, Near, Monad

**HOW**:
- `breathScheduler.ts` runs cycles every 2 minutes
- Collects chain metrics (gas, liquidity, congestion, reliability)
- Calculates routing preferences
- Emits breath events

**WHERE**: `packages/star-bridge-lungs/`

**INTEGRATION**: Runs independently, emits events to event bus.

#### Slug-Time Memory (`packages/slug-time-memory/`)

**WHY**: Temporal memory - tracks trends over time, remembers patterns.

**WHAT**: (Pending exploration)

**HOW**: (Pending exploration)

**WHERE**: `packages/slug-time-memory/`

#### Predator-Scavenger (`packages/predator-scavenger/`)

**WHY**: Metabolic cleanup - removes dead resources, recycles memory.

**WHAT**: (Pending exploration)

**HOW**: (Pending exploration)

**WHERE**: `packages/predator-scavenger/`

#### Dream Cortex (`packages/dream-cortex/`)

**WHY**: Decision making - global intent engine, manages dream priorities.

**WHAT**:
- Dream registry (`dreamRegistry.ts`) - stores all dreams
- Dream status management (pending, approved, rejected, evolved)
- Dream priority management (low, medium, high, critical)
- Cortex scheduler (`cortexScheduler.ts`) - runs decision cycles

**HOW**:
- Dreams stored in `DreamRegistry` (in-memory store)
- Status and priority updated via `setDreamStatus()`, `setDreamPriority()`
- Cortex cycles run via `cortexScheduler.ts` - makes decisions about dream evolution

**WHERE**: `packages/dream-cortex/`

**INTEGRATION**: Used by orchestrator to manage dream lifecycle.

#### Reputation Lattice (`packages/reputation-lattice/`)

**WHY**: Trust system - tracks reputation across network.

**WHAT**: (Pending exploration)

**HOW**: (Pending exploration)

**WHERE**: `packages/reputation-lattice/`

#### Narrative Field (`packages/narrative-field/`)

**WHY**: Story stream - weaves narratives from events.

**WHAT**: (Pending exploration)

**HOW**: (Pending exploration)

**WHERE**: `packages/narrative-field/`

#### Identity Grid (`packages/identity-grid/`)

**WHY**: Identity layer - manages user identities and permissions.

**WHAT**: (Pending exploration)

**HOW**: (Pending exploration)

**WHERE**: `packages/identity-grid/`

#### Dream State Core (`packages/dream-state-core/`)

**WHY**: Governance - top-level authority for DreamNet.

**WHAT**: (Pending exploration)

**HOW**: (Pending exploration)

**WHERE**: `packages/dream-state-core/`

#### Field Layer (`packages/field-layer/`)

**WHY**: Global parameter fields - shared state across system.

**WHAT**:
- Field store (`fieldStore.ts`) - stores field samples
- Field scheduler (`fieldScheduler.ts`) - runs field cycles
- Field sampling - gets values at specific points

**HOW**:
- Fields configured via `configure()`
- Samples stored via `sample()` - stores value at point
- All samples retrieved via `allSamples()`

**WHERE**: `packages/field-layer/`

**INTEGRATION**: Used by orchestrator to share global state.

#### Halo Loop (`packages/halo-loop/`)

**WHY**: Self-healing system - analyzes and repairs issues automatically.

**WHAT**:
- Halo engine (`haloEngine.ts`) - core analyzer & repair coordinator
- Analyzers: Agent health, squad efficiency, endpoint health, env consistency, repo integrity, graft, swarm patrol
- Strategies: Revive agents, repair endpoints, sync env, optimize squads, improve code quality, repair grafts
- Triggers: Time-based, request volume, error rate, deploy, event wormholes

**HOW**:
- Triggers registered via `registerHaloLoop()`
- Time trigger runs periodically
- Request volume trigger fires on high traffic
- Error rate trigger fires on high errors
- Deploy trigger fires on deployments
- Event wormhole trigger fires on events
- Engine analyzes issues and applies repair strategies

**WHERE**: `packages/halo-loop/`

**INTEGRATION**: Runs independently, triggered by various events.

#### Dream Snail Core (`packages/dreamnet-snail-core/`)

**WHY**: Privacy layer - Know-All Win-All privacy trails.

**WHAT**: (Currently placeholder)
- Records privacy trails
- Verifies trail integrity
- Provides privacy config

**HOW**: (Currently no-op placeholder)

**WHERE**: `packages/dreamnet-snail-core/`

**INTEGRATION**: Should record all events as privacy trails.

#### Jaggy Core (`packages/jaggy-core/`)

**WHY**: Silent sentinel - watches, hunts, implements webhooks silently.

**WHAT**:
- Hunter (`jaggyHunter.ts`) - hunts webhooks, implements discovery, watches mesh
- Sentinel (`jaggySentinel.ts`) - watches events, prowls territories, alerts
- Territories - marks areas to watch
- Memory - remembers patterns
- Fame - tracks reputation

**HOW**:
- Jaggy watches events silently
- Hunts for webhook opportunities
- Implements discoveries automatically
- Prowls territories for threats
- Alerts on anomalies

**WHERE**: `packages/jaggy-core/`

**INTEGRATION**: Runs independently, watches mesh events.

#### Webhook Nervous Core (`packages/webhook-nervous-core/`)

**WHY**: Biomimetic webhook management - neurons, synapses, reflex arcs.

**WHAT**:
- Nervous System: Neurons (webhook endpoints), Synapses (connections), Reflex Arcs (automatic responses)
- Immune System: Antibodies (webhook validators), Antigens (threats), Memory Cells (learned patterns)
- Mycelium Network: Hyphae (webhook paths), Mycelia (networks), Optimal Path Finding
- Ant Colony: Pheromone Trails (successful paths), Ants (webhook requests), Trail Following

**HOW**:
- Neurons created for webhook endpoints
- Synapses connect neurons
- Reflex arcs trigger automatic responses
- Antibodies validate webhooks
- Mycelium finds optimal paths
- Ants follow pheromone trails

**WHERE**: `packages/webhook-nervous-core/`

**INTEGRATION**: Manages all webhook processing.

#### Quantum Anticipation (`packages/quantum-anticipation/`)

**WHY**: Prediction layer - anticipates future events.

**WHAT**: (Pending exploration)

**HOW**: (Pending exploration)

**WHERE**: `packages/quantum-anticipation/`

#### Squad Alchemy (`packages/squad-alchemy/`)

**WHY**: Squad optimization - improves agent team efficiency.

**WHAT**: (Pending exploration)

**HOW**: (Pending exploration)

**WHERE**: `packages/squad-alchemy/`

#### Directory (`packages/directory/`)

**WHY**: Directory service - registry of all entities.

**WHAT**: (Pending exploration)

**HOW**: (Pending exploration)

**WHERE**: `packages/directory/`

---

### Agent & Pack Systems

#### Wolf Pack (`packages/wolf-pack/`)

**WHY**: Offensive agents - funding discovery, grant hunting, partner outreach.

**WHAT**:
- Wolf pack engine (`wolfPackEngine.ts`) - runs pack cycles
- Target tracker (`targetTracker.ts`) - tracks funding targets
- Signals and strikes - pack actions

**HOW**:
- Pack cycles run via `runWolfPackCycle()`
- Targets tracked via `TargetTracker`
- Signals emitted for pack coordination
- Strikes executed on targets

**WHERE**: `packages/wolf-pack/`

**INTEGRATION**: Used by orchestrator for funding operations.

#### Wolf Pack Funding Core (`packages/wolfpack-funding-core/`)

**WHY**: Funding discovery automation - finds grants, drafts emails, sends follow-ups.

**WHAT**:
- Funding store (`fundingStore.ts`) - stores leads, queue, grant drafts
- Funding scheduler (`fundingScheduler.ts`) - runs funding cycles
- Email draft engine (`emailDraftEngine.ts`) - generates basic email drafts
- Enhanced email draft engine (`emailDraftEngineEnhanced.ts`) - uses Inbox² for intelligent drafts
- Grant draft engine (`grantDraftEngine.ts`) - generates grant proposals
- Follow-up draft engine (`followUpDraftEngine.ts`) - generates follow-up emails

**HOW**:
- Leads upserted via `upsertLead()`
- Email drafts generated via `generateEmailDraftForLead()` or `generateEmailDraftWithInboxSquared()`
- Grant drafts generated via grant draft engine
- Follow-ups generated via follow-up engine
- Queue managed via `listQueue()`, `updateQueueItemStatus()`

**WHERE**: `packages/wolfpack-funding-core/`

**INTEGRATION**: Used by Wolf Pack for funding operations.

#### Whale Pack Core (`packages/whale-pack-core/`)

**WHY**: Commerce agents - product strategy, audience analysis, commerce optimization.

**WHAT**: (Pending exploration)

**HOW**: (Pending exploration)

**WHERE**: `packages/whale-pack-core/`

#### Orca Pack Core (`packages/orca-pack-core/`)

**WHY**: Communication agents - content strategy, theme generation, narrative weaving.

**WHAT**: (Pending exploration)

**HOW**: (Pending exploration)

**WHERE**: `packages/orca-pack-core/`

#### Octopus Executor (`packages/octopus-executor/`)

**WHY**: Multi-arm executor - 8-arm parallel task execution.

**WHAT**: (Pending exploration)

**HOW**: (Pending exploration)

**WHERE**: `packages/octopus-executor/`

#### Orchestrator Core (`packages/orchestrator-core/`)

**WHY**: Agent orchestration - coordinates all subsystems in correct order.

**WHAT**:
- `runCycle()` - executes subsystems in order:
  1. Citadel (strategic planning)
  2. Latent Collaboration (agent memory sharing)
  3. FieldLayer (global parameters)
  4. (More subsystems...)

**HOW**:
- Context passed to each subsystem
- Subsystems run sequentially
- Results aggregated

**WHERE**: `packages/orchestrator-core/logic/runCycle.ts`

**INTEGRATION**: Called by Runtime Bridge Core.

#### Runtime Bridge Core (`packages/runtime-bridge-core/`)

**WHY**: Bridge between runtime and orchestrator - manages cycle execution.

**WHAT**:
- `initRuntimeContext()` - initializes context with all subsystems
- `runRuntimeCycleOnce()` - runs single orchestrator cycle
- `startRuntimeLoop()` - starts continuous cycle loop

**HOW**:
- Context initialized with all subsystem instances
- Cycles run via orchestrator
- Results stored in context

**WHERE**: `packages/runtime-bridge-core/logic/runtimeHarness.ts`

**INTEGRATION**: Called by server to start orchestrator cycles.

#### Agent Wallet Manager (`packages/agent-wallet-manager/`)

**WHY**: Secure wallet management for agents - separate from user wallets.

**WHAT**:
- Creates wallets for agents (deterministic from mnemonic or random)
- Manages wallet balances
- Provides public interface (no private keys exposed)

**HOW**:
- Wallets created via `getOrCreateWallet()`
- Private keys stored internally (never exposed)
- Public interface returned (address, balance, label)
- Mnemonic from env (never logged)

**WHERE**: `packages/agent-wallet-manager/index.ts`

**INTEGRATION**: Used by agents that need wallets for on-chain operations.

#### Citadel Core (`packages/citadel-core/`)

**WHY**: Strategic command center - orchestrates 8 Vertex AI agents.

**WHAT**:
- Agent 1: Generate snapshot (no dependencies)
- Agent 2: Drone Dome Scanner (depends on Agent 1)
- Agent 3: Event Fabric Builder (depends on Agents 1, 2)
- Agent 4: DreamKeeper Architect (depends on Agents 1, 2, 3)
- Agents 5-8: (Future)

**HOW**:
- Agents run sequentially
- Dependencies validated before running
- Errors tracked per agent
- Status recorded

**WHERE**: `packages/citadel-core/index.ts`

**INTEGRATION**: Called by orchestrator as first subsystem.

#### Agent Registry Core (`packages/agent-registry-core/`)

**WHY**: Agent registry - tracks all agents in system.

**WHAT**: (Pending exploration)

**HOW**: (Pending exploration)

**WHERE**: `packages/agent-registry-core/`

---

### Economic & Token Systems

#### Dream Token (`packages/dream-token/`)

**WHY**: DREAM token - ERC20 token on Base mainnet.

**WHAT**: (Pending exploration)

**HOW**: (Pending exploration)

**WHERE**: `packages/dream-token/`

#### Economic Engine Core (`packages/economic-engine-core/`)

**WHY**: Economic engine - manages token balances, rewards, emissions.

**WHAT**:
- Token configs - defines tokens (DREAM, SHEEP, etc.)
- Emission rules - defines how rewards are emitted
- Balance records - tracks balances per identity
- Raw reward events - records reward events
- Applied rewards - tracks applied emissions

**HOW**:
- Configs seeded via `ensureDefaultConfigSeeded()`
- Rewards recorded via `recordRawReward()`
- Emissions applied via `applyEmissionForReward()`
- Balances queried via `getBalance()`

**WHERE**: `packages/economic-engine-core/`

**INTEGRATION**: Used by rewards engine, liquidity engine, dream shop.

#### Rewards Engine (`packages/rewards-engine/`)

**WHY**: Rewards system - calculates and distributes rewards.

**WHAT**: (Pending exploration)

**HOW**: (Pending exploration)

**WHERE**: `packages/rewards-engine/`

#### Liquidity Engine (`packages/liquidity-engine/`)

**WHY**: Liquidity pools - manages DEX liquidity.

**WHAT**: (Pending exploration)

**HOW**: (Pending exploration)

**WHERE**: `packages/liquidity-engine/`

#### Dream Vault (`packages/dream-vault/`)

**WHY**: Token vault - central repository for all vault items.

**WHAT**:
- Vault store (`vaultStore.ts`) - stores vault items
- Vault scheduler (`vaultScheduler.ts`) - runs vault cycles
- Vault search (`vaultSearch.ts`) - searches vault items

**HOW**:
- Items upserted via `upsertItem()`
- Items queried via `getItem()`, `listAll()`
- Search via `search()` - queries by kind, tags, metadata

**WHERE**: `packages/dream-vault/`

**INTEGRATION**: Used by dream shop, dream tank.

#### Dream Shop (`packages/dream-shop/`)

**WHY**: Marketplace - buy/sell offers.

**WHAT**:
- Shop store (`shopStore.ts`) - stores offers
- Shop scheduler (`shopScheduler.ts`) - runs shop cycles
- Shop recommender (`shopRecommender.ts`) - recommends offers

**HOW**:
- Offers upserted via `upsertOffer()`
- Offers queried via `getOffer()`, `listOffers()`
- Recommendations computed via `recommend()`

**WHERE**: `packages/dream-shop/`

**INTEGRATION**: Uses economic engine for pricing.

#### Dream Bet Core (`packages/dreambet-core/`)

**WHY**: Gaming/betting - prediction markets, games.

**WHAT**: (Pending exploration)

**HOW**: (Pending exploration)

**WHERE**: `packages/dreambet-core/`

#### Dream Tank Core (`packages/dream-tank-core/`)

**WHY**: Incubator - incubates new dreams.

**WHAT**: (Pending exploration)

**HOW**: (Pending exploration)

**WHERE**: `packages/dream-tank-core/`

---

### Integration & Bridge Systems

#### Internal Ports (`packages/internal-ports/`)

**WHY**: Port system - defines endpoints for internal communication.

**WHAT**:
- Fiber channels: ALPHA, BETA, GAMMA, OMEGA
- Port registry - registers ports for subsystems
- Packet format - defines packet structure

**HOW**:
- Ports registered via `registerPort()`
- Packets created via `createPacket()`
- Ports queried via registry

**WHERE**: `packages/internal-ports/src/`

**INTEGRATION**: Used by internal router, event wormholes, system inspector.

#### Internal Router (`packages/internal-router/`)

**WHY**: Laser router - routes packets to ports.

**WHAT**:
- Router config - defines routing rules
- Route registration - registers routes
- Packet routing - routes packets to handlers

**HOW**:
- Router configured via `configureRouter()`
- Routes registered via `registerRoute()`
- Packets routed via `routePacket()`

**WHERE**: `packages/internal-router/src/`

**INTEGRATION**: Routes packets from ports to handlers.

#### Event Wormholes (`packages/event-wormholes/`)

**WHY**: Teleportation channels - instant packet transportation.

**WHAT**:
- Wormhole endpoints - defines wormhole destinations
- Packet buffering - buffers packets for transmission
- Dispatcher - dispatches packets through wormholes

**HOW**:
- Wormholes registered via `registerWormhole()`
- Packets sent via `sendThroughWormhole()`
- Packets flushed via `flushWormhole()`

**WHERE**: `packages/event-wormholes/src/`

**INTEGRATION**: Used by shield core (cellular shields), spider web (event routing).

#### Nerve Fabric (`packages/nerve/`)

**WHY**: Event bus - pro-grade event bus with backpressure and priorities.

**WHAT**:
- Nerve bus (`bus.ts`) - in-memory event bus
- Subscribers (`subscribers.ts`) - default subscribers (Shield Core, Jaggy, DreamScope)
- Initialization (`init.ts`) - initializes nerve fabric

**HOW**:
- Bus created via `createInMemoryNerveBus()`
- Events published via `publish()`
- Subscribers registered via `subscribe()`

**WHERE**: `packages/nerve/src/`

**INTEGRATION**: Used by shield core, jaggy core, dreamscope UI.

#### Port Governor (`packages/port-governor/`)

**WHY**: Port governance - manages port access and permissions.

**WHAT**: (Pending exploration)

**HOW**: (Pending exploration)

**WHERE**: `packages/port-governor/`

#### DreamNet Bridge (`packages/dreamnet-bridge/`)

**WHY**: Bridge system - bridges DreamNet to external systems.

**WHAT**: (Pending exploration)

**HOW**: (Pending exploration)

**WHERE**: `packages/dreamnet-bridge/`

#### Tag Bridge Core (`packages/tag-bridge-core/`)

**WHY**: Tag bridge - bridges tags across systems.

**WHAT**: (Pending exploration)

**HOW**: (Pending exploration)

**WHERE**: `packages/tag-bridge-core/`

---

### Latent Collaboration

#### Latent Collaboration (`packages/latent-collaboration/`)

**WHY**: Agents share context via compressed latent representations - reduces overhead.

**WHAT**:
- `encodeToLatent()` - encodes thoughts to latent vectors
- `decodeFromLatent()` - decodes latent vectors to thoughts
- `logLatentSession()` - logs latent sessions to database
- `findSimilarLatent()` - finds similar latent thoughts

**HOW**:
- Uses OpenAI embeddings (or hash-based fallback)
- Stores latent vectors in database
- Queries similar vectors via cosine similarity

**WHERE**: `packages/latent-collaboration/src/`

**INTEGRATION**: Used by orchestrator, neural mesh, dreamscope UI.

---

### Prediction Kernel

#### Prediction Core (`packages/prediction-core/`)

**WHY**: Prediction markets - models prediction markets, events, outcomes.

**WHAT**:
- Types (`types.ts`) - defines market types, outcomes, decisions
- Model (`model.ts`) - pure domain functions:
  - `computeImpliedOdds()` - calculates odds from pool sizes
  - `computePayoutsAfterResolution()` - calculates payouts
  - `computePerformanceScore()` - calculates agent performance

**HOW**:
- Markets created with yes/no pools
- Decisions made with stake amounts
- Markets resolved with actual outcomes
- Payouts calculated based on pool sizes

**WHERE**: `packages/prediction-core/src/`

**INTEGRATION**: (Future) Will integrate with orchestrator, on-chain contracts.

---

### Base Mini Apps

#### Base Mini Apps (`packages/base-mini-apps/`)

**WHY**: Mini-app ecosystem - Base blockchain mini-apps.

**WHAT**:
- Mini app store (`miniAppStore.ts`) - stores mini-app definitions
- Mini app factory (`miniAppFactory.ts`) - creates mini-apps
- Default mini-apps - creates default set of mini-apps

**HOW**:
- Mini-apps created via `createMiniApp()`
- Mini-apps deployed via `deployMiniApp()`
- Mini-apps queried via `getMiniApp()`, `listMiniApps()`

**WHERE**: `packages/base-mini-apps/`

**INTEGRATION**: Used by client for mini-app launcher.

---

### Control Core

#### DreamNet Control Core (`packages/dreamnet-control-core/`)

**WHY**: Control plane - kill switches, rate limiting, tier enforcement.

**WHAT**:
- Global kill switch - shuts down entire system
- Tier system - free, pro, enterprise tiers
- Rate limiting - per-tier rate limits
- Control middleware - enforces controls

**HOW**:
- Kill switch set via `setGlobalKillSwitch()`
- Tiers resolved via `tierResolver.ts`
- Rate limits enforced via middleware
- Controls checked on every request

**WHERE**: `packages/dreamnet-control-core/`

**INTEGRATION**: Used by middleware chain, shield core.

---

## Spine Systems

### Dream Event Bus (`spine/dreamnet-event-bus/`)

**WHY**: In-memory pub/sub - simple event bus for agent communication.

**WHAT**:
- `DreamEventBus` class - in-memory event bus
- `publish()` - publishes events
- `subscribe()` - subscribes to events
- `getEnvelope()` - retrieves event by ID

**HOW**:
- Handlers stored in Map by event type
- Events published to all subscribers
- Wildcard subscribers ("*") receive all events

**WHERE**: `spine/dreamnet-event-bus/DreamEventBus.ts`

**INTEGRATION**: Used by agent interop registry, wrappers.

### Agent Interop Registry (`spine/agent-interop/`)

**WHY**: Agent provider registry - manages agent providers and interop.

**WHAT**:
- `AgentInteropRegistry` class - manages providers
- `registerProvider()` - registers provider
- `getProvider()` - gets provider by ID
- `supportsCapability()` - finds providers by capability

**HOW**:
- Providers stored in Map by ID
- Events emitted on registration/removal
- Capabilities searched via provider capabilities array

**WHERE**: `spine/agent-interop/AgentInteropRegistry.ts`

**INTEGRATION**: Used by agent gateway, MCP bridge.

### Agent BGP (`spine/bgp-for-agents/`)

**WHY**: Border Gateway Protocol for agents - routes agent requests.

**WHAT**:
- Types only - no implementation yet
- Agent prefixes - identifies capabilities
- Agent routes - routing entries
- Route announcements - advertisements

**HOW**: (Pending implementation by Antigravity)

**WHERE**: `spine/bgp-for-agents/`

**INTEGRATION**: (Future) Will route agent requests.

### OS Linker (`spine/dreamnet-os-linker/`)

**WHY**: Links processes to OS runtime - process management.

**WHAT**:
- Empty stub - Antigravity will implement
- Process registration
- Environment binding
- Capability mapping

**HOW**: (Pending implementation by Antigravity)

**WHERE**: `spine/dreamnet-os-linker/OSLinker.ts`

**INTEGRATION**: (Future) Will link processes to OS.

### MCP Bridge (`spine/dreamnet-mcp-bridge/`)

**WHY**: MCP (Model Context Protocol) bridge - bridges DreamNet to MCP providers.

**WHAT**:
- Empty stub - Antigravity will implement
- Provider registration
- Tool execution
- Session management

**HOW**: (Pending implementation by Antigravity)

**WHERE**: `spine/dreamnet-mcp-bridge/MCPBridge.ts`

**INTEGRATION**: (Future) Will bridge to MCP providers.

### Wrappers (`spine/wrappers/`)

**WHY**: Wraps subsystems with event emission - adds observability.

**WHAT**:
- `ShieldCoreWrapper` - wraps Shield Core
- `BrowserAgentWrapper` - wraps Browser Agent
- `DeploymentWrapper` - wraps Deployment
- `DreamKeeperWrapper` - wraps DreamKeeper
- `FreeTierWrapper` - wraps Free Tier
- `MiniAppWrapper` - wraps Mini Apps

**HOW**:
- Wrappers call subsystem functions
- Emit events to event bus
- Add correlation IDs
- Provide governance (allowlists, blocking)

**WHERE**: `spine/wrappers/`

**INTEGRATION**: Used by server to wrap subsystems.

---

## Client Architecture

### Entry Point: `client/src/main.tsx`

**WHY**: Single entry point for React app.

**WHAT**: Renders `<App />` component.

**HOW**: Uses `createRoot()` from React 18.

**WHERE**: `client/src/main.tsx`

### Main App: `client/src/App.tsx`

**WHY**: Root component - handles routing and authentication.

**WHAT**:
- Route definitions (136+ routes)
- Authentication provider
- Error boundaries
- Theme provider
- Command palette

**HOW**:
- Routes defined via `wouter` (`Switch`, `Route`)
- Auth handled via `AuthProvider`
- Errors caught via `ErrorBoundary`
- Theme via `DreamNetThemeProvider`

**WHERE**: `client/src/App.tsx`

### Pages (136+ files)

**WHY**: Page components - one per route.

**WHAT**: Examples:
- `dashboard.tsx` - Main dashboard
- `dreams.tsx` - Dreams list
- `wallets.tsx` - Wallets list
- `agents.tsx` - Agents list
- `dreamscope-ui.tsx` - DreamScope UI

**HOW**: Each page component renders UI for that route.

**WHERE**: `client/src/pages/*.tsx`

### Components (100+ files)

**WHY**: Reusable UI components.

**WHAT**: Examples:
- `DreamFeed.tsx` - Dream feed component
- `DreamForm.tsx` - Dream creation form
- `AgentPanel.tsx` - Agent status panel
- `WalletConnector.tsx` - Wallet connection component
- `latent-sessions-panel.tsx` - Latent sessions display

**HOW**: Components use React hooks, fetch data via API clients.

**WHERE**: `client/src/components/*.tsx`

### API Clients (`client/src/api/`)

**WHY**: Type-safe API clients - abstracts HTTP calls.

**WHAT**:
- `dreams.ts` - Dream API client
- `wallets.ts` - Wallet API client
- `bridge.ts` - Bridge API client
- `baseMiniApps.ts` - Mini-apps API client

**HOW**: Functions that call fetch, return typed responses.

**WHERE**: `client/src/api/*.ts`

### Hooks (`client/src/hooks/`)

**WHY**: Reusable React hooks - data fetching, state management.

**WHAT**:
- `useDreams.ts` - Dream data hook
- `useWallets.ts` - Wallet data hook

**HOW**: Uses React Query (`@tanstack/react-query`) for data fetching.

**WHERE**: `client/src/hooks/*.ts`

### Contexts (`client/src/contexts/`)

**WHY**: React contexts - shared state.

**WHAT**:
- `auth-context.tsx` - Authentication context
- `DreamNetThemeContext.tsx` - Theme context

**HOW**: Provides context values to components.

**WHERE**: `client/src/contexts/*.tsx`

---

## Data Flow & Integration

### Request Flow

1. **Request arrives** → Express server (`server/index.ts`)
2. **Trace ID generated** → `traceIdMiddleware`
3. **Metrics collected** → `metricsMiddleware`
4. **Idempotency checked** → `idempotencyMiddleware`
5. **Tier resolved** → `tierResolverMiddleware`
6. **Control checks** → `controlCoreMiddleware` (kill switch, rate limits)
7. **Route handler** → Specific route handler (`server/routes/*.ts`)
8. **Subsystem called** → Package function called
9. **Response returned** → JSON response

### Agent Cycle Flow

1. **Runtime Bridge** → `runtimeHarness.ts` starts cycle
2. **Orchestrator** → `runCycle.ts` executes subsystems:
   - Citadel (strategic planning)
   - Latent Collaboration (memory sharing)
   - FieldLayer (global parameters)
   - (More subsystems...)
3. **Subsystems** → Each subsystem runs its cycle
4. **Results** → Aggregated and stored

### Event Flow

1. **Event created** → Subsystem creates event
2. **Event published** → Published to event bus (`DreamEventBus`)
3. **Subscribers notified** → All subscribers receive event
4. **Actions taken** → Subscribers react to event

### Latent Collaboration Flow

1. **Agent thinks** → Agent generates thought
2. **Thought encoded** → `encodeToLatent()` converts to vector
3. **Vector stored** → Stored in database (`latent_sessions` table)
4. **Other agents query** → `retrieveLatent()` finds similar thoughts
5. **Context shared** → Agents share context without direct communication

---

## Design Decisions & Rationale

### Why Biomimetic?

**Decision**: Model system after biological organisms.

**Rationale**:
- Biological systems are proven resilient
- Metaphors make system understandable
- Natural separation of concerns
- Self-healing capabilities

**Examples**:
- Nervous system (Spider Web) routes events
- Immune system (Shield Core) protects against threats
- Lungs (Star Bridge) monitor cross-chain health
- Memory (Neural Mesh) stores long-term knowledge

### Why Reliability System?

**Decision**: Comprehensive reliability patterns (DAG, health gates, circuit breakers).

**Rationale**:
- Production systems need predictable startup
- Health monitoring prevents serving broken systems
- Circuit breakers prevent cascading failures
- Feature flags enable safe rollouts

**Examples**:
- DAG ensures database starts before services
- Health gates block traffic until ready
- Circuit breakers protect external APIs
- Feature flags enable gradual rollouts

### Why Latent Collaboration?

**Decision**: Agents share context via compressed latent representations.

**Rationale**:
- Reduces communication overhead
- Enables asynchronous collaboration
- Preserves privacy (compressed representations)
- Scales to many agents

**Examples**:
- Wolf Pack finds grant → stores in latent session
- CoinSensei reads latent session → adjusts portfolio
- All without direct agent-to-agent communication

### Why Fiber-Optic Middleware?

**Decision**: Internal communication via ports, routers, wormholes.

**Rationale**:
- High-speed internal communication
- Teleportation channels for instant routing
- Port-based architecture for modularity
- Laser router for efficient packet routing

**Examples**:
- Ports define endpoints
- Router routes packets
- Wormholes teleport packets instantly
- Nerve fabric orchestrates everything

### Why Spine Systems?

**Decision**: Separate spine layer for agent interop and event bus.

**Rationale**:
- Clean separation of concerns
- Agent interop registry for provider management
- Event bus for pub/sub communication
- Wrappers add observability

**Examples**:
- Agent Interop Registry manages providers
- Event Bus enables pub/sub
- Wrappers emit events for observability

---

## Next Steps

1. Continue exploring remaining packages (75% remaining)
2. Continue exploring client pages/components (95% remaining)
3. Continue exploring server routes (90% remaining)
4. Explore infrastructure (0% explored)
5. Explore contracts (0% explored)
6. Explore scripts (0% explored)
7. Complete documentation with WHY, WHERE, WHAT, HOW for everything

---

**This document will be continuously updated as exploration progresses.**

