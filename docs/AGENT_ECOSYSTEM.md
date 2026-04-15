# DreamNet Agent Ecosystem - Complete Documentation

## 🏭 Agent Foundry System

The **Agent Foundry** is DreamNet's agent manufacturing system. It allows creation, customization, and deployment of agents.

### Location
- **API**: `dream-agent-store/apps/api/src/routes/foundry.ts`
- **Templates**: `dream-agent-store/apps/api/src/seeds/foundryTemplates.ts`
- **UI**: `dream-agent-store/apps/store/app/foundry/page.tsx`

### How It Works
1. **Templates**: Pre-built agent templates for common use cases
2. **Customization**: Configure agents with specific capabilities
3. **Deployment**: Deploy agents to the Super Spine registry
4. **Marketplace**: Agents can be shared and installed by others

### Foundry API
- `GET /api/foundry/templates` - List available templates
- `POST /api/foundry/requests` - Request custom agent creation
- `GET /api/foundry/requests/:id` - Get request status

---

## 🤖 Agent Inventory

### Core Agents (Server)

1. **LUCID** - Logic Unification & Command Interface Daemon
   - Location: `server/agents/LUCID.ts`
   - Tier: Standard
   - Capabilities: code, analysis
   - Status: ✅ Active

2. **CANVAS** - Visual Layer Weaver
   - Location: `server/agents/CANVAS.ts`
   - Tier: Standard
   - Capabilities: design, code
   - Status: ✅ Active

3. **ROOT** - Subconscious Architect
   - Location: `server/agents/ROOT.ts`
   - Tier: Standard (requires Trust Score > 60)
   - Capabilities: code, analysis
   - Status: ✅ Active

4. **ECHO** - Wallet Mirror
   - Location: `server/agents/ECHO.ts`
   - Tier: Standard
   - Capabilities: analysis
   - Status: ✅ Active

5. **Wolf Pack** - Funding Hunter 🆕
   - Location: `server/agents/WolfPack.ts`
   - Tier: Premium (100 DREAM/month)
   - Capabilities: funding, communication, analysis
   - Status: ✅ Active

### Client-Side Agents

1. **ScoreAgent** - `client/src/agents/ScoreAgent.ts`
2. **RemixAgent** - `client/src/agents/RemixAgent.ts`
3. **NarratorAgent** - `client/src/agents/NarratorAgent.ts`
4. **DecayAgent** - `client/src/agents/DecayAgent.ts`
5. **LinkAgent** - `client/src/agents/LinkAgent.ts`
6. **DreamTagsAgent** - `client/src/agents/DreamTagsAgent.ts`
7. **DreamLoreEngine** - `client/src/agents/DreamLoreEngine.ts`
8. **DreamAttractor** - `client/src/agents/DreamAttractor.ts`
9. **NutrientEngine** - `client/src/agents/NutrientEngine.ts`
10. **creatorOnboarder** - `client/src/agents/creatorOnboarder.ts`

### Legacy Agents (agents/)

1. **AgentConductor** - `agents/AgentConductor.js`
   - Primary conductor for repos, CI/CD, workflow handoffs

2. **AutonomousLeadAgent** - `agents/AutonomousLeadAgent.js`
   - Cross-platform messaging dispatcher

3. **CampaignMasterAgent** - `agents/CampaignMasterAgent.js`
   - Social media campaign management

4. **deployKeeper** - `agents/deployKeeper.cjs`
   - Validates deploys, DNS, routing, health endpoints

5. **integrationScanner** - `agents/integrationScanner.cjs`
   - Audits GitHub/Vercel integrations

6. **deploymentAssistant** - `agents/deploymentAssistant.ts`
   - Multi-step deployment helper

7. **WolfPackFundingHunter** - `agents/WolfPackFundingHunter.js`
   - Legacy version (new TypeScript version in `server/agents/WolfPack.ts`)

### Nano Agents (agents/nano/)

1. **domainCheck** - `agents/nano/domainCheck.cjs`
2. **heartbeat** - `agents/nano/heartbeat.cjs`
3. **route404** - `agents/nano/route404.cjs`
4. **vercelStatus** - `agents/nano/vercelStatus.cjs`

### Package Agents

1. **processorAgent** - `packages/graft-engine/processors/processorAgent.ts`
2. **validatorAgent** - `packages/graft-engine/validators/validatorAgent.ts`
3. **agentHealthAnalyzer** - `packages/halo-loop/analyzers/agentHealthAnalyzer.ts`
4. **reviveAgentStrategy** - `packages/halo-loop/strategies/reviveAgentStrategy.ts`

### System Agents

1. **AI Surgeon** - `lib/aiSurgeonAgents.ts`
   - Automated maintenance and issue resolution

2. **DreamKeeper** - Referenced in docs, core monitoring agent

3. **EnvKeeper** - Environment management (missing, needs rebuild)

---

## 🌿 Biomimetic Systems (24-25 Systems)

### Documented Systems (from `docs/biomimicry.md`)

1. **Swarm (Ants & Bees)**
   - Distributed foraging, division of labor
   - Implementation: `server/routes/**`, `server/jobs/watchdog.ts`, `agents/WolfPackFundingHunter.js`
   - Status: ✅ Active

2. **Octopus Brain & Arms**
   - Central brain with semi-autonomous arms
   - Implementation: `agents/AutonomousLeadAgent.js`, `agents/AgentConductor.js`, `server/orchestration-script.ts`
   - Status: ✅ Active

3. **Chameleon Skin**
   - Adaptive skins, protocol negotiation
   - Implementation: `server/task-connector.ts`, `server/routes-connector.ts`, `agents/CampaignMasterAgent.js`
   - Status: ✅ Active

4. **Wolf Pack**
   - Coordinated hunts and pincer moves
   - Implementation: `agents/WolfPackFundingHunter.js`, `agents/deployKeeper.cjs`
   - Status: ✅ Active

5. **Falcon Eye**
   - Long-range scanning and telemetry
   - Implementation: `server/starbridge/*.ts`, Watchdog jobs
   - Status: ✅ Active

6. **Dream Snail Trail**
   - Identity + provenance with verifiable trails
   - Implementation: Triple Helix organism, `trust/` merkle + hash modules, `dreamnodes/` registries
   - Status: ⚠️ Partial (some modules missing)

7. **Zen Garden**
   - Wellness and engagement loops
   - Implementation: `server/routes/garden/**`, `dreamnodes/flutterbye`
   - Status: ✅ Active

8. **Dream Clouds**
   - Thematic clusters (DeSci, DeFi, gaming, memes, etc.)
   - Implementation: `data/` seeds, `apps/*` mini-apps, `client/src/pages` dashboards
   - Status: ✅ Active

9. **Magnetic Rail Train & ChronoLock**
   - Stage-gated pipelines with checkpoints
   - Implementation: `server/magnetic-rail/scheduler.ts`, `server/chronocache/service.ts`
   - Status: ✅ Active

10. **Triple Helix Armor**
    - Immune system and defense spikes
    - Implementation: `server/services/armoredTripleHelixOrganism.ts` (legacy, needs recovery), `server/watchdog/service.ts`
    - Status: ⚠️ Partial

### Additional Systems (Found in Codebase)

11. **Swarm Coordinator**
    - Location: `server/swarm-coordinator.ts`
    - Coordinated bot architecture
    - Status: ✅ Active

12. **Star Bridge**
    - Location: `server/starbridge/*.ts`
    - Telemetry and event logging
    - Status: ✅ Active

13. **Halo Loop**
    - Location: `packages/halo-loop/`
    - Self-healing and optimization
    - Status: ✅ Active

14. **Event Wormholes**
    - Location: `packages/event-wormholes/`
    - Cross-system event routing
    - Status: ✅ Active

15. **Graft Engine**
    - Location: `packages/graft-engine/`
    - System integration and grafting
    - Status: ✅ Active

16. **Spore Engine**
    - Location: `packages/spore-engine/`
    - Content lineage and distribution
    - Status: ✅ Active

17. **Memory DNA**
    - Location: `packages/memory-dna/`
    - System memory and traits
    - Status: ✅ Active

18. **Dark Fabric**
    - Location: `packages/dark-fabric/`
    - Sandbox and validation
    - Status: ✅ Active

19. **Squad Builder**
    - Location: `packages/squad-builder/`
    - Agent team orchestration
    - Status: ✅ Active

20. **Alive Mode**
    - Location: `packages/alive-mode/`
    - System vitality tracking
    - Status: ✅ Active

21. **Media Vault**
    - Location: `packages/media-vault/`
    - Media ingestion and management
    - Status: ✅ Active

22. **Rewards Engine**
    - Location: `packages/rewards-engine/`
    - Token rewards and gamification
    - Status: ✅ Active

23. **Metrics Engine**
    - Location: `packages/metrics-engine/`
    - System metrics and analytics
    - Status: ✅ Active

24. **Dream Token Layer**
    - Location: `packages/dream-token/`
    - On-chain token management
    - Status: ✅ Active

25. **Super Spine** 🆕
    - Location: `server/core/SuperSpine.ts`
    - Agent orchestration backbone
    - Status: ✅ Active

---

## 📊 System Status

### Total Count
- **Agents**: 130+ (need full inventory scan)
- **Biomimetic Systems**: 25 documented
- **Foundry Templates**: Multiple (check `foundryTemplates.ts`)

### By Status
- ✅ **Active**: Most core systems
- ⚠️ **Partial**: Some systems need completion
- ❌ **Missing**: EnvKeeper, some Triple Helix modules

---

## 🔧 Next Steps

1. **Complete Inventory Scan**
   - Run full codebase scan for all agents
   - Document all 130+ agents
   - Create agent registry

2. **Documentation**
   - Create individual docs for each agent
   - Document all biomimetic systems
   - Create usage guides

3. **Foundry Enhancement**
   - Add more templates
   - Improve agent customization
   - Build agent marketplace UI

4. **Super Spine Integration**
   - Register all agents in Super Spine
   - Set up access control
   - Enable paid features

5. **Biomimetic System Completion**
   - Recover missing modules
   - Complete partial systems
   - Add telemetry dashboards

---

## 📝 Notes

- Many agents are in legacy JavaScript files
- Some systems reference modules that need recovery
- The foundry system exists but needs UI completion
- Super Spine is the new orchestration layer
- Paid features system is ready for integration

---

**Last Updated**: Generated automatically
**Next Update**: After full inventory scan

