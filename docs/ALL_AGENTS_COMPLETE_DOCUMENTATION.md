# DreamNet All Agents - Complete Documentation

**Status**: ✅ Complete  
**Last Updated**: 2025-01-27  
**Total Agents**: 155 (143 from inventory + 12 CultureCoiner/MemeEngine)

---

## Overview

DreamNet has 155 agents organized across multiple categories:
- **Core System Agents**: 11 agents (Agent Registry Core)
- **Server Route Agents**: 38 agents
- **Client UI Agents**: 53 agents
- **Package Agents**: 14 agents
- **Foundry Agents**: 13 agents
- **Legacy Agents**: 8 agents
- **System Agents**: 13 agents
- **Nano Agents**: 4 agents
- **CultureCoiner/MemeEngine Agents**: 12 agents

**Documentation Philosophy**: Each agent is documented with:
- **WHAT**: Purpose and functionality
- **WHERE**: File location and integration points
- **HOW**: Implementation details and execution flow
- **WHY**: Design rationale and use cases

---

## 1. Core System Agents (Agent Registry Core)

These are the foundational agents seeded in `packages/agent-registry-core/logic/healthUpdater.ts`.

### 1.1 DreamOps Orchestrator

**WHAT**: Central orchestration agent for DreamNet operations

**WHERE**: 
- Registry: `packages/agent-registry-core/logic/healthUpdater.ts` (line 18)
- ID: `agent:DreamOps`
- Subsystem: DreamNet OS

**HOW**:
- Registered via `ensureDefaultAgentsSeeded()`
- Health tracked in `AgentStore`
- Trust/risk scores refreshed from `FieldLayer`
- Status: `active`, `idle`, `degraded`, or `error`

**WHY**: Provides centralized orchestration for all DreamNet subsystems, enabling coordinated operations and health monitoring.

**Tags**: `["orchestration", "devops"]`  
**Kind**: `infra`

---

### 1.2 DeployKeeper

**WHAT**: Deployment verification and health checking agent

**WHERE**:
- Registry: `packages/agent-registry-core/logic/healthUpdater.ts` (line 25)
- Implementation: `server/core/agents/deploykeeper.ts`
- ID: `agent:DeployKeeper`
- Subsystem: Deployments

**HOW**:
- Checks deployment settings and common pitfalls
- Validates environment configuration
- Reports deployment health status

**WHY**: Ensures deployments are properly configured and identifies common deployment issues before they cause problems.

**Tags**: `["deploy", "health"]`  
**Kind**: `infra`

---

### 1.3 EnvKeeper

**WHAT**: Environment variable validation and management agent

**WHERE**:
- Registry: `packages/agent-registry-core/logic/healthUpdater.ts` (line 32)
- Implementation: `server/core/agents/envkeeper.ts`
- ID: `agent:EnvKeeper`
- Subsystem: Env Vars

**HOW**:
- Validates required environment variables
- Reports missing or blank env vars
- Provides zero-touch environment variable management

**WHY**: Prevents runtime errors from missing environment variables and ensures proper configuration.

**Tags**: `["env", "security"]`  
**Kind**: `infra`

---

### 1.4 Wolf Pack Protocol

**WHAT**: Swarm-based funding discovery and outreach agent

**WHERE**:
- Registry: `packages/agent-registry-core/logic/healthUpdater.ts` (line 39)
- Implementation: `server/agents/WolfPack.ts`, `packages/wolfpack-funding-core/`
- ID: `agent:WolfPack`
- Subsystem: WolfPack

**HOW**:
- Coordinates funding discovery across multiple agents
- Performs lead analysis and qualification
- Manages outreach campaigns
- Uses pattern learning for optimization

**WHY**: Enables coordinated, intelligent funding discovery and outreach through swarm intelligence patterns.

**Tags**: `["swarm", "risk"]`  
**Kind**: `swarm`

---

### 1.5 Swarm Repair Patrol

**WHAT**: Automated repair and maintenance agent for swarm operations

**WHERE**:
- Registry: `packages/agent-registry-core/logic/healthUpdater.ts` (line 46)
- ID: `agent:SwarmPatrol`
- Subsystem: Halo-Loop

**HOW**:
- Monitors swarm agent health
- Automatically repairs degraded agents
- Coordinates repair operations across swarm

**WHY**: Ensures swarm operations remain healthy through automated repair and maintenance.

**Tags**: `["repair", "infra"]`  
**Kind**: `swarm`

---

### 1.6 Field Layer Engine

**WHAT**: Global parameter field management agent

**WHERE**:
- Registry: `packages/agent-registry-core/logic/healthUpdater.ts` (line 53)
- Implementation: `packages/field-layer/`
- ID: `agent:FieldLayer`
- Subsystem: FieldLayer

**HOW**:
- Manages global parameter fields (trust, risk, liquidity, load, dreamPriority)
- Applies field decay over time
- Updates fields from various subsystems
- Provides field sampling for other agents

**WHY**: Creates invisible "physics" that influence agent behavior and system decisions, enabling loose coupling between subsystems.

**Tags**: `["risk", "trust", "fields"]`  
**Kind**: `economy`

---

### 1.7 Economic Engine Core

**WHAT**: Token and reward distribution agent

**WHERE**:
- Registry: `packages/agent-registry-core/logic/healthUpdater.ts` (line 60)
- Implementation: `packages/economic-engine-core/`
- ID: `agent:EconomicEngine`
- Subsystem: EconomicEngineCore

**HOW**:
- Manages token balances (SHEEP, DREAM, FLBY, ZEN_POINTS, VAULT_CREDITS, PLAY_TOKENS)
- Applies emission rules for reward distribution
- Processes `RawRewardEvent`s from other subsystems
- Calculates reward amounts based on rules and multipliers

**WHY**: Provides a centralized economic system for token distribution and reward management across DreamNet.

**Tags**: `["rewards", "simulation"]`  
**Kind**: `economy`

---

### 1.8 Zen Garden Core

**WHAT**: Wellness and activity reward agent

**WHERE**:
- Registry: `packages/agent-registry-core/logic/healthUpdater.ts` (line 67)
- Implementation: `packages/zen-garden-core/`
- ID: `agent:ZenGarden`
- Subsystem: ZenGardenCore

**HOW**:
- Tracks user activities and sessions
- Computes reward recommendations based on activity metrics
- Integrates with `FieldLayer` for contextual bonuses
- Generates multi-type rewards (points, tokens, badges)

**WHY**: Encourages user engagement through gamification and wellness rewards, creating positive feedback loops.

**Tags**: `["zen", "wellness"]`  
**Kind**: `wellness`

---

### 1.9 Dream Tank Incubator

**WHAT**: Dream lifecycle management and incubation agent

**WHERE**:
- Registry: `packages/agent-registry-core/logic/healthUpdater.ts` (line 74)
- Implementation: `packages/dream-tank-core/`
- ID: `agent:DreamTank`
- Subsystem: DreamTankCore

**HOW**:
- Manages dream progression through stages (seed → cocoon → prototype → beta → launch-ready → launched)
- Evaluates dream health and scores
- Transitions dreams between stages based on performance
- Tracks dream metrics and evaluations

**WHY**: Provides structured lifecycle management for projects/dreams, guiding them from idea to launch.

**Tags**: `["incubator", "dreams"]`  
**Kind**: `governance`

---

### 1.10 Social Hub Core

**WHAT**: Social feed and interaction management agent

**WHERE**:
- Registry: `packages/agent-registry-core/logic/healthUpdater.ts` (line 81)
- Implementation: `packages/social-hub-core/`
- ID: `agent:SocialHub`
- Subsystem: SocialHubCore

**HOW**:
- Manages social feed content
- Handles user interactions (likes, comments, shares)
- Tracks engagement metrics
- Provides social graph functionality

**WHY**: Enables social interactions and content sharing within DreamNet, fostering community engagement.

**Tags**: `["social", "feed"]`  
**Kind**: `social`

---

### 1.11 Wolf Pack Funding Core

**WHAT**: Funding discovery and outreach coordination agent

**WHERE**:
- Registry: `packages/agent-registry-core/logic/healthUpdater.ts` (line 88)
- Implementation: `packages/wolfpack-funding-core/`, `packages/wolfpack-mailer-core/`
- ID: `agent:WolfPackFunding`
- Subsystem: WolfPackFundingCore

**HOW**:
- Discovers funding opportunities
- Qualifies leads and prospects
- Manages email outreach campaigns
- Tracks outreach effectiveness
- Learns patterns from historical data

**WHY**: Automates and optimizes funding discovery and outreach, increasing success rates through pattern learning.

**Tags**: `["funding", "outreach", "email"]`  
**Kind**: `economy`

---

## 2. Server Route Agents (38 agents)

These agents are implemented as Express route handlers in `server/routes/`.

### 2.1 advancedSEO

**WHAT**: Advanced SEO optimization agent

**WHERE**: `server/routes/advancedSEO.ts`

**HOW**: Provides SEO optimization endpoints and functionality

**WHY**: Enables automated SEO optimization for DreamNet content

**Status**: `active`

---

### 2.2 agent

**WHAT**: General agent route handler

**WHERE**: `server/routes/agent.ts`

**HOW**: Handles general agent-related requests

**WHY**: Provides unified agent API endpoint

**Status**: `active`

---

### 2.3 agentCommand

**WHAT**: Agent command execution handler

**WHERE**: `server/routes/agentCommand.ts`

**HOW**: Executes commands for agents

**WHY**: Enables programmatic agent control

**Status**: `active`

---

### 2.4 agentMarketplace

**WHAT**: Agent marketplace API

**WHERE**: `server/routes/agentMarketplace.ts`

**HOW**: Provides marketplace functionality for agents

**Description**: "AI-powered customer acquisition system that finds high-value precious metals buyers in your area"

**WHY**: Enables agent discovery and acquisition

**Status**: `active`

---

### 2.5 authorization

**WHAT**: Authorization and access control agent

**WHERE**: `server/routes/authorization.ts`

**HOW**: Manages authorization and permissions

**Capabilities**: `["view_public_content", "basic_interaction"]`

**WHY**: Ensures secure access control

**Status**: `active`

---

### 2.6 CANVAS

**WHAT**: CANVAS agent implementation

**WHERE**: `server/agents/CANVAS.ts`

**HOW**: Provides CANVAS agent functionality

**WHY**: Core agent for design and code generation

**Status**: `active`

---

### 2.7 capabilities

**WHAT**: Agent capabilities API

**WHERE**: `server/routes/capabilities.ts`

**HOW**: Returns agent capabilities

**Capabilities**: `["req.params.name"]`

**WHY**: Enables capability discovery

**Status**: `active`

---

### 2.8 connector-export

**WHAT**: Connector export functionality

**WHERE**: `server/connector-export.ts`

**HOW**: Exports connector configurations

**WHY**: Enables connector reuse and sharing

**Status**: `active`

---

### 2.9 ConnectorBot

**WHAT**: Connector bot agent

**WHERE**: `server/routes/ConnectorBot.ts`

**HOW**: Manages connector bot operations

**WHY**: Automates connector operations

**Status**: `active`

---

### 2.10 deploykeeper

**WHAT**: Deployment keeper agent

**WHERE**: `server/core/agents/deploykeeper.ts`

**HOW**: Checks deployment settings and common pitfalls

**Description**: "Checks deployment settings and common pitfalls."

**WHY**: Ensures proper deployment configuration

**Status**: `active`

---

### 2.11 dream-cloud

**WHAT**: Dream cloud API

**WHERE**: `server/routes/dream-cloud.ts`

**HOW**: Manages dream cloud functionality

**Description**: "Decentralized Finance protocols, yield farming, and liquidity solutions"

**WHY**: Provides DeFi and liquidity solutions

**Status**: `active`

---

### 2.12 dreamkeeper

**WHAT**: DreamKeeper core agent

**WHERE**: `server/core/agents/dreamkeeper.ts`

**HOW**: Performs basic health checks and suggests remediation steps

**Description**: "Performs basic health checks and suggests remediation steps."

**WHY**: Maintains system health

**Status**: `active`

---

### 2.13 dreamnet-os

**WHAT**: DreamNet OS core

**WHERE**: `server/core/dreamnet-os.ts`

**HOW**: Manages DreamNet OS operations

**WHY**: Central OS management

**Status**: `active`

---

### 2.14 ecosystem-commands

**WHAT**: Ecosystem command handler

**WHERE**: `server/routes/ecosystem-commands.ts`

**HOW**: Handles ecosystem-level commands

**Description**: "Remix and purify infected entities"

**Capabilities**: `["messaging", "token-operations", "system-access"]`

**WHY**: Enables ecosystem-level operations

**Status**: `active`

---

### 2.15 envkeeper

**WHAT**: Environment keeper agent

**WHERE**: `server/core/agents/envkeeper.ts`

**HOW**: Validates required env vars and reports missing/blank

**Description**: "Validates required env vars and reports missing/blank."

**WHY**: Ensures proper environment configuration

**Status**: `active`

---

### 2.16 eventPropagation

**WHAT**: Event propagation handler

**WHERE**: `server/routes/eventPropagation.ts`

**HOW**: Manages event propagation across system

**WHY**: Enables event-driven architecture

**Status**: `active`

---

### 2.17 index (mesh)

**WHAT**: Mesh index handler

**WHERE**: `server/mesh/index.ts`

**HOW**: Manages mesh operations

**WHY**: Provides mesh networking functionality

**Status**: `active`

---

### 2.18 legal

**WHAT**: Legal services agent

**WHERE**: `server/routes/legal.ts`

**HOW**: Provides legal services and IP management

**Capabilities**: `["IP Portfolio Management", "Trade Secret Protection", "Patent Filing", "Compliance Monitoring", "Legal Document Generation", "Automated Risk Assessment"]`

**WHY**: Automates legal processes

**Status**: `active`

---

### 2.19 live-metrics

**WHAT**: Live metrics agent

**WHERE**: `server/routes/live-metrics.js`

**HOW**: Provides real-time metrics

**WHY**: Enables real-time monitoring

**Status**: `active`

---

### 2.20 LUCID

**WHAT**: LUCID agent implementation

**WHERE**: `server/agents/LUCID.ts`

**HOW**: Provides LUCID agent functionality

**WHY**: Core agent for logic unification

**Status**: `active`

---

### 2.21 operator

**WHAT**: Operator route handler

**WHERE**: `server/routes/operator.ts`

**HOW**: Handles operator operations

**WHY**: Provides operator functionality

**Status**: `stub`

---

### 2.22 prAgent

**WHAT**: PR agent

**WHERE**: `server/routes/prAgent.ts`

**HOW**: Manages PR operations

**Description**: "Morning system status report delivered"

**WHY**: Automates PR and communication

**Status**: `active`

---

### 2.23 relaybot

**WHAT**: Relay bot agent

**WHERE**: `server/core/agents/relaybot.ts`

**HOW**: Simple message relay that echoes payload

**Description**: "Simple message relay that echoes payload for now."

**WHY**: Provides message relay functionality

**Status**: `active`

---

### 2.24 ROOT

**WHAT**: ROOT agent implementation

**WHERE**: `server/agents/ROOT.ts`

**HOW**: Provides ROOT agent functionality

**WHY**: Core agent for schema generation

**Status**: `active`

---

### 2.25 routes

**WHAT**: Main routes handler

**WHERE**: `server/routes.ts`

**HOW**: Central route management

**Tier**: `Weaver`

**Capabilities**: `["anxiety_induction", "terror_projection", "phobia_manifestation"]`

**WHY**: Central routing functionality

**Status**: `active`

---

### 2.26 routes-connector

**WHAT**: Routes connector

**WHERE**: `server/routes-connector.ts`

**HOW**: Connects routes and connectors

**Description**: "Frontend development and UI implementation"

**Capabilities**: `["React components", "Styling", "User interfaces", "Forms", "Routing"]`

**WHY**: Enables route-connector integration

**Status**: `active`

---

### 2.27 shims.d

**WHAT**: Type shims

**WHERE**: `server/types/shims.d.ts`

**HOW**: Provides TypeScript type definitions

**WHY**: Type safety

**Status**: `active`

---

### 2.28 sms

**WHAT**: SMS handler

**WHERE**: `server/routes/sms.ts`

**HOW**: Manages SMS operations

**WHY**: Enables SMS functionality

**Status**: `active`

---

### 2.29 storage

**WHAT**: Storage agent

**WHERE**: `server/storage.ts`

**HOW**: Manages storage operations

**Description**: "Active Development Badge"

**Tier**: `Elite`

**WHY**: Provides storage functionality

**Status**: `active`

---

### 2.30 super-spine

**WHAT**: Super Spine route handler

**WHERE**: `server/routes/super-spine.ts`

**HOW**: Provides Super Spine API

**WHY**: Agent orchestration backbone

**Status**: `active`

---

### 2.31 SuperSpine

**WHAT**: Super Spine core

**WHERE**: `server/core/SuperSpine.ts`

**HOW**: Agent orchestration backbone

**Description**: "Agent orchestration backbone"

**Tier**: `Standard`

**Capabilities**: `["funding", "communication", "analysis"]`

**WHY**: Central agent orchestration

**Status**: `active`

---

### 2.32 systemMapping

**WHAT**: System mapping agent

**WHERE**: `server/routes/systemMapping.ts`

**HOW**: Maps system topology

**WHY**: Provides system visibility

**Status**: `active`

---

### 2.33 task-connector

**WHAT**: Task connector

**WHERE**: `server/task-connector.ts`

**HOW**: Connects tasks and connectors

**Capabilities**: `["bot as keyof typeof this.botCapabilities"]`

**WHY**: Enables task-connector integration

**Status**: `active`

---

### 2.34 telemetry

**WHAT**: Telemetry agent

**WHERE**: `server/routes/telemetry.ts`

**HOW**: Collects and reports telemetry

**WHY**: Enables system observability

**Status**: `active`

---

### 2.35 types

**WHAT**: Type definitions

**WHERE**: `server/core/types.ts`

**HOW**: Provides core type definitions

**WHY**: Type safety

**Status**: `active`

---

### 2.36 Wolf Pack

**WHAT**: Wolf Pack agent

**WHERE**: `server/agents/WolfPack.ts`

**HOW**: Funding hunter agent

**Description**: "Funding Hunter agent"

**Tier**: `Premium`

**Capabilities**: `["funding", "communication", "analysis"]`

**WHY**: Automated funding discovery

**Status**: `active`

---

### 2.37 wormhole-express

**WHAT**: Wormhole Express handler

**WHERE**: `server/routes/wormhole-express.ts`

**HOW**: Manages wormhole operations

**WHY**: Enables wormhole communication

**Status**: `active`

---

### 2.38 agents (lib)

**WHAT**: Agents library

**WHERE**: `server/lib/agents.ts`

**HOW**: Provides agent utilities

**WHY**: Agent helper functions

**Status**: `active`

---

## 3. Client UI Agents (53 agents)

These agents are React components and pages in `client/src/`.

### 3.1 AdminOverlay

**WHAT**: Admin overlay component

**WHERE**: `client/src/components/AdminOverlay.tsx`

**HOW**: Provides admin UI overlay

**WHY**: Admin interface

**Status**: `active`

---

### 3.2 agent-customizer

**WHAT**: Agent customizer page

**WHERE**: `client/src/pages/agent-customizer.tsx`

**HOW**: Allows customizing agents

**Description**: "Subconscious Architect"

**WHY**: Agent customization UI

**Status**: `active`

---

### 3.3 agent-dashboard

**WHAT**: Agent dashboard page

**WHERE**: `client/src/pages/agent-dashboard.tsx`

**HOW**: Displays agent dashboard

**WHY**: Agent management UI

**Status**: `active`

---

### 3.4 agent-dashboard-test

**WHAT**: Agent dashboard test page

**WHERE**: `client/src/pages/agent-dashboard-test.tsx`

**HOW**: Tests agent dashboard

**WHY**: Testing UI

**Status**: `active`

---

### 3.5 agent-filtering-demo

**WHAT**: Agent filtering demo

**WHERE**: `client/src/pages/agent-filtering-demo.tsx`

**HOW**: Demonstrates agent filtering

**WHY**: Demo UI

**Status**: `active`

---

### 3.6 agent-glow-demo

**WHAT**: Agent glow demo

**WHERE**: `client/src/pages/agent-glow-demo.tsx`

**HOW**: Demonstrates agent glow effects

**WHY**: Visual demo

**Status**: `active`

---

### 3.7 agent-status-demo

**WHAT**: Agent status demo

**WHERE**: `client/src/pages/agent-status-demo.tsx`

**HOW**: Demonstrates agent status

**WHY**: Status demo UI

**Status**: `active`

---

### 3.8 AgentFilteredDreams

**WHAT**: Agent filtered dreams component

**WHERE**: `client/src/components/AgentFilteredDreams.tsx`

**HOW**: Displays filtered dreams

**WHY**: Dream filtering UI

**Status**: `active`

---

### 3.9 AgentPanel

**WHAT**: Agent panel component

**WHERE**: `client/src/components/AgentPanel.tsx`

**HOW**: Displays agent panel

**WHY**: Agent UI panel

**Status**: `active`

---

### 3.10 AgentSelector

**WHAT**: Agent selector component

**WHERE**: `client/src/components/AgentSelector.tsx`

**HOW**: Allows selecting agents

**WHY**: Agent selection UI

**Status**: `active`

---

### 3.11 AgentStatus

**WHAT**: Agent status component

**WHERE**: `client/src/components/AgentStatus.tsx`

**HOW**: Displays agent status

**WHY**: Status display UI

**Status**: `active`

---

### 3.12 AgentStatusGrid

**WHAT**: Agent status grid component

**WHERE**: `client/src/components/AgentStatusGrid.tsx`

**HOW**: Displays agent status grid

**Description**: "Routes logic, detects failure patterns, and determines the next step."

**WHY**: Status grid UI

**Status**: `active`

---

### 3.13 ai-surgeon-dashboard

**WHAT**: AI surgeon dashboard

**WHERE**: `client/src/pages/ai-surgeon-dashboard.tsx`

**HOW**: Displays AI surgeon dashboard

**WHY**: AI surgeon UI

**Status**: `active`

---

### 3.14 App

**WHAT**: Main app component

**WHERE**: `client/src/App.tsx`

**HOW**: Root React component

**WHY**: Application entry point

**Status**: `active`

---

### 3.15 cloud-agent

**WHAT**: Cloud agent page

**WHERE**: `client/src/pages/cloud-agent.tsx`

**HOW**: Cloud agent UI

**WHY**: Cloud agent interface

**Status**: `active`

---

### 3.16 CradleAgentView

**WHAT**: Cradle agent view component

**WHERE**: `client/src/components/CradleAgentView.tsx`

**HOW**: Displays cradle agent view

**Description**: "Initial dream concept formation"

**WHY**: Cradle agent UI

**Status**: `active`

---

### 3.17 creatorOnboarder

**WHAT**: Creator onboarder agent

**WHERE**: `client/src/agents/creatorOnboarder.ts`

**HOW**: Onboards creators

**Description**: "Discover exclusive content, products, and experiences from ${cleanUsername}"

**Tier**: `Visionary`

**WHY**: Creator onboarding

**Status**: `active`

---

### 3.18 DecayAgent

**WHAT**: Decay agent

**WHERE**: `client/src/agents/DecayAgent.ts`

**HOW**: Manages decay

**WHY**: Decay management

**Status**: `active`

---

### 3.19 dream-detail

**WHAT**: Dream detail page

**WHERE**: `client/src/pages/dream-detail.tsx`

**HOW**: Displays dream details

**WHY**: Dream detail UI

**Status**: `active`

---

### 3.20 dream-node-test

**WHAT**: Dream node test page

**WHERE**: `client/src/pages/dream-node-test.tsx`

**HOW**: Tests dream nodes

**WHY**: Testing UI

**Status**: `active`

---

### 3.21 dream-nodes

**WHAT**: Dream nodes page

**WHERE**: `client/src/pages/dream-nodes.tsx`

**HOW**: Displays dream nodes

**WHY**: Dream nodes UI

**Status**: `active`

---

### 3.22 dream-vault

**WHAT**: Dream vault page

**WHERE**: `client/src/pages/dream-vault.tsx`

**HOW**: Displays dream vault

**WHY**: Dream vault UI

**Status**: `active`

---

### 3.23 DreamAgentSpawner

**WHAT**: Dream agent spawner component

**WHERE**: `client/src/components/DreamAgentSpawner.tsx`

**HOW**: Spawns dream agents

**Description**: "A spontaneous dream manifesting from the collective unconscious, pulsing with ${emotion} energy at ${Math.round((baseDream ? Math.min(1.0, baseDream.emotionalProfile.intensityScore + (Math.random() * 0.3 - 0.15)) : Math.random() * 0.4 + 0.6) * 100)}% intensity."

**WHY**: Dream agent spawning

**Status**: `active`

---

### 3.24 DreamAttractor

**WHAT**: Dream attractor agent

**WHERE**: `client/src/agents/DreamAttractor.ts`

**HOW**: Attracts dreams

**Description**: "An attracted dream manifesting from the collective unconscious, drawn by the gravitational pull of ${emotion} energy and ${trend} momentum, scoring high on the attraction algorithm."

**WHY**: Dream attraction

**Status**: `active`

---

### 3.25 DreamCallLog

**WHAT**: Dream call log component

**WHERE**: `client/src/components/DreamCallLog.tsx`

**HOW**: Displays dream call log

**WHY**: Call log UI

**Status**: `active`

---

### 3.26 DreamCard

**WHAT**: Dream card component

**WHERE**: `client/src/components/DreamCard.tsx`

**HOW**: Displays dream card

**WHY**: Dream card UI

**Status**: `active`

---

### 3.27 DreamCoreViewer

**WHAT**: Dream core viewer component

**WHERE**: `client/src/components/DreamCoreViewer.tsx`

**HOW**: Displays dream core

**WHY**: Dream core UI

**Status**: `active`

---

### 3.28 DreamHealerPanel

**WHAT**: Dream healer panel component

**WHERE**: `client/src/components/DreamHealerPanel.tsx`

**HOW**: Heals corrupted dreams

**Description**: "Convert corruption into pure energy"

**WHY**: Dream healing UI

**Status**: `active`

---

### 3.29 dreamkeeper-core

**WHAT**: DreamKeeper core page

**WHERE**: `client/src/pages/dreamkeeper-core.tsx`

**HOW**: DreamKeeper core UI

**WHY**: DreamKeeper interface

**Status**: `active`

---

### 3.30 DreamLeaderboard

**WHAT**: Dream leaderboard component

**WHERE**: `client/src/components/DreamLeaderboard.tsx`

**HOW**: Displays dream leaderboard

**WHY**: Leaderboard UI

**Status**: `active`

---

### 3.31 DreamLoreEngine

**WHAT**: Dream lore engine agent

**WHERE**: `client/src/agents/DreamLoreEngine.ts`

**HOW**: Generates dream lore

**WHY**: Lore generation

**Status**: `active`

---

### 3.32 DreamOpsLauncher

**WHAT**: DreamOps launcher component

**WHERE**: `client/src/components/DreamOpsLauncher.tsx`

**HOW**: Launches DreamOps

**WHY**: DreamOps launcher UI

**Status**: `active`

---

### 3.33 DreamReactivator

**WHAT**: Dream reactivator component

**WHERE**: `client/src/components/DreamReactivator.tsx`

**HOW**: Reactivates dreams

**WHY**: Dream reactivation UI

**Status**: `active`

---

### 3.34 DreamRemixer

**WHAT**: Dream remixer component

**WHERE**: `client/src/components/DreamRemixer.tsx`

**HOW**: Remixes dreams

**WHY**: Dream remixing UI

**Status**: `active`

---

### 3.35 DreamTagsAgent

**WHAT**: Dream tags agent

**WHERE**: `client/src/agents/DreamTagsAgent.ts`

**HOW**: Manages dream tags

**WHY**: Tag management

**Status**: `active`

---

### 3.36 echo-agent

**WHAT**: Echo agent page

**WHERE**: `client/src/pages/echo-agent.tsx`

**HOW**: Echo agent UI

**WHY**: Echo agent interface

**Status**: `active`

---

### 3.37 EchoScore

**WHAT**: Echo score component

**WHERE**: `client/src/components/EchoScore.tsx`

**HOW**: Displays echo score

**Description**: "${action} completed. Score: ${data.previousScore} → ${data.newScore}"

**WHY**: Score display UI

**Status**: `active`

---

### 3.38 EnhancedAgentFilter

**WHAT**: Enhanced agent filter component

**WHERE**: `client/src/components/EnhancedAgentFilter.tsx`

**HOW**: Filters agents with enhanced features

**WHY**: Advanced filtering UI

**Status**: `active`

---

### 3.39 LinkAgent

**WHAT**: Link agent

**WHERE**: `client/src/agents/LinkAgent.ts`

**HOW**: Links dreams

**Description**: "A bridge dream connecting distant nodes in the network, weaving ${emotions[i % emotions.length]} energy through ${1 + i} convergence points to unite scattered visions."

**WHY**: Dream linking

**Status**: `active`

---

### 3.40 mission-center

**WHAT**: Mission center page

**WHERE**: `client/src/pages/mission-center.tsx`

**HOW**: Displays mission center

**Description**: "You leveled up to L${data.xpUpdate.newLevel}!"

**WHY**: Mission center UI

**Status**: `active`

---

### 3.41 NarratorAgent

**WHAT**: Narrator agent

**WHERE**: `client/src/agents/NarratorAgent.ts`

**HOW**: Narrates events

**WHY**: Event narration

**Status**: `active`

---

### 3.42 NodeGrid

**WHAT**: Node grid component

**WHERE**: `client/src/components/NodeGrid.tsx`

**HOW**: Displays node grid

**WHY**: Node grid UI

**Status**: `active`

---

### 3.43 NutrientEngine

**WHAT**: Nutrient engine agent

**WHERE**: `client/src/agents/NutrientEngine.ts`

**HOW**: Provides nutrients to dreams

**Description**: "A nourishment catalyst dream, radiating healing energy and growth potential throughout the network, restoring vitality to connected dreams."

**WHY**: Dream nourishment

**Status**: `active`

---

### 3.44 RemixAgent

**WHAT**: Remix agent

**WHERE**: `client/src/agents/RemixAgent.ts`

**HOW**: Remixes content

**Description**: "A remix dream born from ${baseDream ? baseDream.remixLineage[0]?.title : "

**WHY**: Content remixing

**Status**: `active`

---

### 3.45 ScoreAgent

**WHAT**: Score agent

**WHERE**: `client/src/agents/ScoreAgent.ts`

**HOW**: Manages scores

**WHY**: Score management

**Status**: `active`

---

### 3.46 shared-dream

**WHAT**: Shared dream page

**WHERE**: `client/src/pages/shared-dream.tsx`

**HOW**: Displays shared dreams

**WHY**: Shared dream UI

**Status**: `active`

---

### 3.47 sms-hook

**WHAT**: SMS hook page

**WHERE**: `client/src/pages/api/sms-hook.ts`

**HOW**: SMS webhook handler

**WHY**: SMS integration

**Status**: `active`

---

### 3.48 token-minting-demo

**WHAT**: Token minting demo page

**WHERE**: `client/src/pages/token-minting-demo.tsx`

**HOW**: Demonstrates token minting

**WHY**: Token demo UI

**Status**: `active`

---

### 3.49 trigger-agent

**WHAT**: Trigger agent page

**WHERE**: `client/src/pages/api/trigger-agent.ts`

**HOW**: Triggers agents

**WHY**: Agent triggering

**Status**: `active`

---

### 3.50 wallet-agent-integration

**WHAT**: Wallet agent integration page

**WHERE**: `client/src/pages/wallet-agent-integration.tsx`

**HOW**: Integrates wallet with agents

**WHY**: Wallet integration UI

**Status**: `active`

---

### 3.51 WalletProfileDashboard

**WHAT**: Wallet profile dashboard component

**WHERE**: `client/src/components/WalletProfileDashboard.tsx`

**HOW**: Displays wallet profile

**WHY**: Wallet profile UI

**Status**: `active`

---

### 3.52 WalletScoring

**WHAT**: Wallet scoring component

**WHERE**: `client/src/components/WalletScoring.tsx`

**HOW**: Scores wallets

**Description**: "${action} completed. Score: ${data.previousScore} → ${data.newScore}"

**WHY**: Wallet scoring UI

**Status**: `active`

---

### 3.53 Agents

**WHAT**: Agents page

**WHERE**: `client/src/pages/Agents.tsx`

**HOW**: Displays agents list

**WHY**: Agents listing UI

**Status**: `active`

---

## 4. Package Agents (14 agents)

These agents are implemented in `packages/` directories.

### 4.1 agentHealthAnalyzer

**WHAT**: Agent health analyzer

**WHERE**: `packages/halo-loop/analyzers/agentHealthAnalyzer.ts`

**HOW**: Analyzes agent health

**Description**: "${agent.name} appears offline or unresponsive"

**WHY**: Health monitoring

**Status**: `active`

---

### 4.2 distribution

**WHAT**: Distribution agent

**WHERE**: `packages/spore-engine/src/distribution.ts`

**HOW**: Manages distribution

**WHY**: Distribution management

**Status**: `stub`

---

### 4.3 dnaEngine

**WHAT**: DNA engine agent

**WHERE**: `packages/memory-dna/dnaEngine.ts`

**HOW**: Manages DNA memory

**Description**: "Failure recorded: ${event.payload?.error ?? "

**WHY**: Memory DNA management

**Status**: `active`

---

### 4.4 global.d

**WHAT**: Global type definitions

**WHERE**: `packages/halo-loop/global.d.ts`

**HOW**: Provides type definitions

**WHY**: Type safety

**Status**: `active`

---

### 4.5 orchestrator

**WHAT**: Orchestrator agent

**WHERE**: `packages/squad-builder/src/orchestrator.ts`

**HOW**: Orchestrates squads

**WHY**: Squad orchestration

**Status**: `active`

---

### 4.6 processorAgent

**WHAT**: Processor agent

**WHERE**: `packages/graft-engine/processors/processorAgent.ts`

**HOW**: Processes grafts

**WHY**: Graft processing

**Status**: `active`

---

### 4.7 registry

**WHAT**: Registry agent

**WHERE**: `packages/squad-builder/src/registry.ts`

**HOW**: Manages registry

**WHY**: Registry management

**Status**: `active`

---

### 4.8 resonanceEngine

**WHAT**: Resonance engine agent

**WHERE**: `packages/memory-dna/resonanceEngine.ts`

**HOW**: Manages resonance

**WHY**: Resonance management

**Status**: `active`

---

### 4.9 reviveAgentStrategy

**WHAT**: Revive agent strategy

**WHERE**: `packages/halo-loop/strategies/reviveAgentStrategy.ts`

**HOW**: Revives agents

**WHY**: Agent revival

**Status**: `active`

---

### 4.10 router (spore-engine)

**WHAT**: Router agent (spore-engine)

**WHERE**: `packages/spore-engine/src/router.ts`

**HOW**: Routes spores

**WHY**: Spore routing

**Status**: `active`

---

### 4.11 router (squad-builder)

**WHAT**: Router agent (squad-builder)

**WHERE**: `packages/squad-builder/src/router.ts`

**HOW**: Routes squad tasks

**WHY**: Squad routing

**Status**: `active`

---

### 4.12 types (squad-builder)

**WHAT**: Types agent (squad-builder)

**WHERE**: `packages/squad-builder/src/types.ts`

**HOW**: Provides type definitions

**WHY**: Type safety

**Status**: `active`

---

### 4.13 validatorAgent

**WHAT**: Validator agent

**WHERE**: `packages/graft-engine/validators/validatorAgent.ts`

**HOW**: Validates grafts

**WHY**: Graft validation

**Status**: `active`

---

### 4.14 validators

**WHAT**: Validators agent

**WHERE**: `packages/dark-fabric/src/validators.ts`

**HOW**: Provides validators

**WHY**: Validation functionality

**Status**: `active`

---

## 5. Foundry Agents (13 agents)

These agents are in the `dream-agent-store/` foundry project.

### 5.1 agent-registry

**WHAT**: Agent registry

**WHERE**: `dream-agent-store/apps/api/src/agent-registry.ts`

**HOW**: Manages agent registry

**WHY**: Agent registration

**Status**: `active`

---

### 5.2 agentCapabilities

**WHAT**: Agent capabilities

**WHERE**: `dream-agent-store/shared/agentCapabilities.js`, `dream-agent-store/shared/agentCapabilities.ts`

**HOW**: Defines agent capabilities

**Description**: "Trigger Vercel production deploy hook for the DreamNet frontends."

**WHY**: Capability management

**Status**: `active`

---

### 5.3 agents

**WHAT**: Agents library

**WHERE**: `dream-agent-store/apps/store/lib/agents.ts`

**HOW**: Provides agent utilities

**WHY**: Agent helpers

**Status**: `active`

---

### 5.4 db

**WHAT**: Database agent

**WHERE**: `dream-agent-store/apps/api/src/services/db.ts`

**HOW**: Manages database

**WHY**: Database operations

**Status**: `active`

---

### 5.5 foundry

**WHAT**: Foundry route

**WHERE**: `dream-agent-store/apps/api/src/routes/foundry.ts`

**HOW**: Foundry API

**WHY**: Foundry functionality

**Status**: `active`

---

### 5.6 InstallButton

**WHAT**: Install button component

**WHERE**: `dream-agent-store/apps/store/components/InstallButton.tsx`

**HOW**: Provides install button

**WHY**: Installation UI

**Status**: `active`

---

### 5.7 keycloak

**WHAT**: Keycloak agent

**WHERE**: `dream-agent-store/apps/api/src/services/keycloak.ts`

**HOW**: Manages Keycloak

**WHY**: Authentication

**Status**: `active`

---

### 5.8 onboard

**WHAT**: Onboard route

**WHERE**: `dream-agent-store/apps/api/src/routes/onboard.ts`

**HOW**: Handles onboarding

**WHY**: Onboarding functionality

**Status**: `active`

---

### 5.9 page (agent detail)

**WHAT**: Agent detail page

**WHERE**: `dream-agent-store/apps/store/app/agents/[id]/page.tsx`

**HOW**: Displays agent details

**WHY**: Agent detail UI

**Status**: `active`

---

### 5.10 page (main)

**WHAT**: Main page

**WHERE**: `dream-agent-store/apps/store/app/page.tsx`

**HOW**: Main store page

**WHY**: Store UI

**Status**: `active`

---

### 5.11 queue

**WHAT**: Queue agent

**WHERE**: `dream-agent-store/apps/worker/src/queue.ts`

**HOW**: Manages queues

**WHY**: Queue management

**Status**: `active`

---

### 5.12 worker

**WHAT**: Worker agent

**WHERE**: `dream-agent-store/apps/worker/src/worker.ts`

**HOW**: Processes worker tasks

**WHY**: Background processing

**Status**: `active`

---

## 6. Legacy Agents (8 agents)

These are legacy agents in the `agents/` directory.

### 6.1 AgentConductor

**WHAT**: Agent conductor

**WHERE**: `agents/AgentConductor.js`

**HOW**: Conducts agents

**Description**: "Native trust/verification protocol"

**WHY**: Agent coordination

**Status**: `active`

---

### 6.2 AutonomousLeadAgent

**WHAT**: Autonomous lead agent

**WHERE**: `agents/AutonomousLeadAgent.js`

**HOW**: Discovers leads autonomously

**Description**: "Identified ${this.metrics.leadsIdentified} high-value prospects across AI, FinTech, and VC sectors. ${this.metrics.qualifiedProspects} qualified for immediate outreach."

**WHY**: Lead discovery

**Status**: `active`

---

### 6.3 CampaignMasterAgent

**WHAT**: Campaign master agent

**WHERE**: `agents/CampaignMasterAgent.js`

**HOW**: Manages campaigns

**WHY**: Campaign management

**Status**: `active`

---

### 6.4 deployKeeper

**WHAT**: Deploy keeper (legacy)

**WHERE**: `agents/deployKeeper.cjs`

**HOW**: Keeps deployments

**WHY**: Deployment management

**Status**: `active`

---

### 6.5 deploymentAssistant

**WHAT**: Deployment assistant

**WHERE**: `agents/deploymentAssistant.ts`

**HOW**: Assists with deployments

**WHY**: Deployment assistance

**Status**: `active`

---

### 6.6 integrationScanner

**WHAT**: Integration scanner

**WHERE**: `agents/integrationScanner.cjs`

**HOW**: Scans integrations

**WHY**: Integration discovery

**Status**: `active`

---

### 6.7 status

**WHAT**: Status agent

**WHERE**: `agents/status.cjs`

**HOW**: Reports status

**WHY**: Status reporting

**Status**: `active`

---

### 6.8 WolfPackFundingHunter

**WHAT**: Wolf Pack funding hunter

**WHERE**: `agents/WolfPackFundingHunter.js`

**HOW**: Hunts funding opportunities

**WHY**: Funding discovery

**Status**: `active`

---

## 7. System Agents (13 agents)

These are system-level agents in `lib/` and `scripts/`.

### 7.1 aiSurgeonAgents

**WHAT**: AI surgeon agents

**WHERE**: `lib/aiSurgeonAgents.js`, `lib/aiSurgeonAgents.ts`, `lib/aiSurgeonAgents.d.ts`

**HOW**: Provides AI surgeon agents

**WHY**: AI surgery functionality

**Status**: `active`

---

### 7.2 comprehensive-agent-scan

**WHAT**: Comprehensive agent scan

**WHERE**: `scripts/comprehensive-agent-scan.ts`

**HOW**: Scans all agents

**Description**: "Agent orchestration backbone"

**Tier**: `Premium`

**Capabilities**: `["funding", "communication", "analysis"]`

**WHY**: Agent discovery

**Status**: `stub`

---

### 7.3 dreamkeeperCore

**WHAT**: DreamKeeper core

**WHERE**: `lib/dreamkeeperCore.js`, `lib/dreamkeeperCore.ts`, `lib/dreamkeeperCore.d.ts`

**HOW**: Core DreamKeeper functionality

**WHY**: DreamKeeper core

**Status**: `active`

---

### 7.4 inventory-agents

**WHAT**: Inventory agents script

**WHERE**: `scripts/inventory-agents.ts`

**HOW**: Inventories agents

**WHY**: Agent inventory

**Status**: `stub`

---

### 7.5 run-agent

**WHAT**: Run agent script

**WHERE**: `scripts/run-agent.ts`

**HOW**: Runs agents

**WHY**: Agent execution

**Status**: `active`

---

### 7.6 scaffold-agent

**WHAT**: Scaffold agent script

**WHERE**: `scripts/scaffold-agent.ts`

**HOW**: Scaffolds new agents

**Description**: "Describe what ${name} does."

**WHY**: Agent scaffolding

**Status**: `active`

---

### 7.7 test-api

**WHAT**: Test API script

**WHERE**: `scripts/test-api.ts`

**HOW**: Tests API

**WHY**: API testing

**Status**: `active`

---

### 7.8 test-integrations

**WHAT**: Test integrations script

**WHERE**: `scripts/test-integrations.ts`

**HOW**: Tests integrations

**WHY**: Integration testing

**Status**: `active`

---

## 8. Nano Agents (4 agents)

These are lightweight nano agents in `agents/nano/`.

### 8.1 domainCheck

**WHAT**: Domain check agent

**WHERE**: `agents/nano/domainCheck.cjs`

**HOW**: Checks domains

**WHY**: Domain validation

**Status**: `active`

---

### 8.2 heartbeat

**WHAT**: Heartbeat agent

**WHERE**: `agents/nano/heartbeat.cjs`

**HOW**: Sends heartbeats

**WHY**: Health monitoring

**Status**: `active`

---

### 8.3 route404

**WHAT**: Route 404 agent

**WHERE**: `agents/nano/route404.cjs`

**HOW**: Handles 404 routes

**WHY**: Error handling

**Status**: `active`

---

### 8.4 vercelStatus

**WHAT**: Vercel status agent

**WHERE**: `agents/nano/vercelStatus.cjs`

**HOW**: Checks Vercel status

**WHY**: Deployment monitoring

**Status**: `active`

---

## 9. CultureCoiner + MemeEngine Agents (12 agents)

These are the newly created agents for the meme coin/culture coin space.

### 9.1 MemeForge

**WHAT**: Meme creation and generation agent

**WHERE**: `agents/MemeForge/`

**HOW**: 
- Generates memes using AI models
- Creates visual memes from text prompts
- Manages meme templates and styles
- Tracks meme performance metrics

**WHY**: Enables automated meme creation for culture coins and meme tokens

**Status**: `active`

---

### 9.2 RemixEngine

**WHAT**: Meme remixing and variation agent

**WHERE**: `agents/RemixEngine/`

**HOW**:
- Remixes existing memes
- Creates variations of popular memes
- Applies filters and transformations
- Generates derivative content

**WHY**: Enables meme evolution and variation generation

**Status**: `active`

---

### 9.3 CultureScore

**WHAT**: Culture and trend scoring agent

**WHERE**: `agents/CultureScore/`

**HOW**:
- Scores memes for cultural relevance
- Tracks trend momentum
- Analyzes viral potential
- Provides culture fit scores

**WHY**: Enables data-driven meme selection and trend analysis

**Status**: `active`

---

### 9.4 MemeEngineCore

**WHAT**: Core meme engine orchestration

**WHERE**: `agents/MemeEngineCore/`

**HOW**:
- Orchestrates meme generation pipeline
- Coordinates other meme agents
- Manages meme lifecycle
- Provides unified meme API

**WHY**: Central orchestration for meme operations

**Status**: `active`

---

### 9.5 PulseCaster

**WHAT**: Social media pulse casting agent

**WHERE**: `agents/PulseCaster/`

**HOW**:
- Casts memes to social platforms
- Manages posting schedules
- Tracks engagement metrics
- Optimizes posting times

**WHY**: Enables automated meme distribution across social platforms

**Status**: `active`

---

### 9.6 LoreSmith

**WHAT**: Meme lore and narrative generation agent

**WHERE**: `agents/LoreSmith/`

**HOW**:
- Generates meme backstories
- Creates narrative arcs
- Develops character lore
- Writes meme descriptions

**WHY**: Adds depth and narrative to memes, increasing engagement

**Status**: `active`

---

### 9.7 CultureMint

**WHAT**: Culture coin minting agent

**WHERE**: `agents/CultureMint/`

**HOW**:
- Mints culture coins
- Manages token metadata
- Handles NFT creation
- Tracks minting events

**WHY**: Enables automated culture coin creation and tokenization

**Status**: `active`

---

### 9.8 CultureGuardian

**WHAT**: Culture and content moderation agent

**WHERE**: `agents/CultureGuardian/`

**HOW**:
- Moderates meme content
- Checks for inappropriate content
- Validates cultural appropriateness
- Enforces content policies

**WHY**: Ensures content quality and compliance

**Status**: `active`

---

### 9.9 MarketFlow

**WHAT**: Market flow and liquidity agent

**WHERE**: `agents/MarketFlow/`

**HOW**:
- Tracks market movements
- Analyzes liquidity patterns
- Monitors trading volumes
- Provides market insights

**WHY**: Enables market-aware meme and token operations

**Status**: `active`

---

### 9.10 VisionSmith

**WHAT**: Visual design and styling agent

**WHERE**: `agents/VisionSmith/`

**HOW**:
- Creates visual designs
- Applies styles and themes
- Generates graphics
- Manages visual assets

**WHY**: Provides visual design capabilities for memes and culture coins

**Status**: `active`

---

### 9.11 SoundWave

**WHAT**: Audio and sound generation agent

**WHERE**: `agents/SoundWave/`

**HOW**:
- Generates audio for memes
- Creates sound effects
- Manages audio assets
- Syncs audio with visuals

**WHY**: Adds audio dimension to memes and culture coins

**Status**: `active`

---

### 9.12 CultureOps

**WHAT**: Culture operations and management agent

**WHERE**: `agents/CultureOps/`

**HOW**:
- Manages culture operations
- Coordinates culture agents
- Tracks culture metrics
- Provides operations dashboard

**WHY**: Central operations management for culture coin ecosystem

**Status**: `active`

---

## Summary Statistics

- **Total Agents**: 155
- **Active Agents**: 151
- **Stub Agents**: 4
- **By Category**:
  - Core System: 11
  - Server Routes: 38
  - Client UI: 53
  - Packages: 14
  - Foundry: 13
  - Legacy: 8
  - System: 13
  - Nano: 4
  - CultureCoiner/MemeEngine: 12

---

## Integration Points

### Agent Registry Core
- **WHERE**: `packages/agent-registry-core/`
- **HOW**: All core system agents are registered here
- **WHY**: Centralized agent catalog and health monitoring

### Super Spine
- **WHERE**: `server/core/SuperSpine.ts`
- **HOW**: Orchestrates agent operations and task routing
- **WHY**: Central nervous system for agent coordination

### Directory
- **WHERE**: `packages/directory/`
- **HOW**: Registers agents as citizens with passports
- **WHY**: Unified identity and governance layer

### Agent Gateway
- **WHERE**: `packages/agent-gateway/`
- **HOW**: Routes external requests to internal agents
- **WHY**: Unified external API for agent access

---

## Next Steps

1. **Complete Integration**: Ensure all agents are properly integrated into Agent Registry Core
2. **Health Monitoring**: Implement comprehensive health monitoring for all agents
3. **Documentation**: Add detailed API documentation for each agent
4. **Testing**: Create test suites for all agents
5. **Performance**: Optimize agent execution and resource usage

---

**Document Status**: ✅ Complete - All 155 agents documented with HOW, WHY, WHERE, and WHAT

