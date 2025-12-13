# DreamNet Agents - Complete Documentation

**Date**: 2025-01-27  
**Status**: ✅ Comprehensive Agent System Documentation  
**Total Agents**: 12 CultureCoiner/MemeEngine + 11+ Core DreamNet Agents

---

## 🎯 Vision: CultureCoiner + MemeEngine Stack

**The Big Idea**: Meme coins are evolving into **culturecoins** powered by **meme engines**. DreamNet is positioning itself as the infrastructure layer that enables this evolution.

**Why This Matters**:
- Meme coins are becoming cultural movements, not just tokens
- AI-powered engines can generate, optimize, and distribute cultural content at scale
- DreamNet's biomimetic architecture is perfect for managing complex, evolving cultural ecosystems

---

## 📋 Agent Architecture Overview

### Two Agent Systems

1. **CultureCoiner/MemeEngine Agents** (`/agents/`)
   - New modular system for culturecoin operations
   - Unified interface via `AgentRegistry`
   - HTTP API endpoint: `/api/agents`
   - UI Dashboard: `/agents-dashboard`

2. **DreamNet Core Agents** (`packages/agent-registry-core/`, `server/core/agents/`)
   - Existing biomimetic agent system
   - Integrated with orchestrator cycles
   - Health tracking via `AgentRegistryCore`
   - Part of DreamNet OS heartbeat

---

## 🚀 CultureCoiner/MemeEngine Agents (12 Agents)

### System Architecture

**Location**: `/agents/<AgentName>/`  
**Pattern**: Each agent has:
- `types.ts` - TypeScript interfaces for tasks/outputs
- `service.ts` - Core business logic (pure functions)
- `index.ts` - Agent interface implementation

**Registry**: `/core/AgentRegistry.ts`
- Singleton registry
- Lazy initialization
- Context injection (env vars, logger)

**API**: `/server/routes/agents.ts` (to be created)
- `POST /api/agents` - Unified endpoint
- Body: `{ agent: string, task: string, data?: any }`

---

### 1. MemeForge Agent

**WHAT**: Creates memes, captions, and platform-optimized content

**WHERE**: `/agents/MemeForge/`

**HOW**:
```typescript
// Tasks:
- create_2panel: { topic, style? } → { top, bottom, variations[] }
- caption: { topic, tone?, length? } → { captions[], recommended }
- platform_variants: { text, platforms[] } → { [platform]: text }
```

**WHY**:
- Memes are the atomic unit of culturecoin content
- Different platforms need different formats (Twitter 280, Farcaster 320, etc.)
- Style variations (classic, edgy, wholesome, meta) target different audiences

**Algorithm**:
- Template-based generation (no external APIs yet)
- Platform-specific length limits
- Style-specific templates for top/bottom panels
- Variation generation for A/B testing

**Integration Points**:
- Can be called from backend code
- Can be called via HTTP API
- Can be orchestrated by CultureOps
- Output can feed into PulseCaster for distribution

---

### 2. RemixEngine Agent

**WHAT**: Remixes and transforms text content

**WHERE**: `/agents/RemixEngine/`

**HOW**:
```typescript
// Tasks:
- remix: { text, style? } → { variations[] }
- shorten: { text, targetLength? } → { text, originalLength, newLength }
- expand: { text, lore? } → { text, lore? }
```

**WHY**:
- Content needs to be adapted for different contexts
- Short-form platforms need compression
- Long-form platforms need expansion
- Remixing creates variations for testing

**Algorithm**:
- Word replacement patterns (based → good, cringe → bad, etc.)
- Filler word removal for compression
- Contextual expansion with lore integration
- Style-based transformations (edgy, safe, surreal)

**Integration Points**:
- Can remix MemeForge output
- Can shorten/expand for PulseCaster
- Can feed into CultureScore for evaluation

---

### 3. CultureScore Agent

**WHAT**: Scores content for cultural resonance and virality potential

**WHERE**: `/agents/CultureScore/`

**HOW**:
```typescript
// Tasks:
- score: { text, platform? } → { originalityScore, viralityPotential, culturalResonance, overallScore, suggestions[] }
- analyze: { text, context? } → { sentiment, themes[], culturalMarkers[], recommendations[] }
```

**WHY**:
- Not all content is created equal
- Cultural resonance determines long-term value
- Virality potential determines short-term reach
- Scoring enables optimization loops

**Algorithm**:
- **Originality**: Buzzword detection, uniqueness heuristics
- **Virality**: Engagement triggers (questions, exclamations, emojis, mentions)
- **Cultural Resonance**: Cultural marker detection (culture, community, vibe, web3, degen, etc.)
- **Overall Score**: Weighted average (30% originality, 40% virality, 30% resonance)

**Integration Points**:
- Can score MemeForge output
- Can score RemixEngine variations
- Can inform MemeEngineCore pipeline decisions
- Can feed into MarketFlow for trend analysis

---

### 4. MemeEngineCore Agent

**WHAT**: Core orchestration engine for meme generation pipeline

**WHERE**: `/agents/MemeEngineCore/`

**HOW**:
```typescript
// Tasks:
- generate: { topic, style?, platforms[] } → { memes[], recommended }
- pipeline: { steps[], input } → { results[] }
```

**WHY**:
- Meme generation is a pipeline, not a single step
- Different platforms need different optimizations
- Orchestration enables complex workflows
- Pipeline pattern enables extensibility

**Algorithm**:
- Multi-platform generation (one meme per platform)
- Scoring-based recommendation (highest score wins)
- Pipeline step execution (remix → score → optimize)
- Error handling per step

**Integration Points**:
- Orchestrates MemeForge, RemixEngine, CultureScore
- Can be called by CultureOps for complex workflows
- Output feeds into PulseCaster for distribution

---

### 5. PulseCaster Agent

**WHAT**: Casts content across platforms and channels

**WHERE**: `/agents/PulseCaster/`

**HOW**:
```typescript
// Tasks:
- cast: { content, platforms[], schedule? } → { results[] }
- analyze: { platform, content } → { optimized, recommendations[] }
```

**WHY**:
- Content needs to reach multiple platforms
- Each platform has different constraints
- Optimization improves engagement
- Scheduling enables timing strategies

**Algorithm**:
- Platform-specific length limits (Twitter 280, Farcaster 320, etc.)
- Optimization recommendations (hashtags, mentions, length)
- Mock posting (will integrate with real APIs)
- Error handling per platform

**Integration Points**:
- Receives content from MemeEngineCore
- Can cast MemeForge output directly
- Can be scheduled by CultureOps
- Can feed analytics back to CultureScore

---

### 6. LoreSmith Agent

**WHAT**: Creates and weaves narrative lore for culturecoins

**WHERE**: `/agents/LoreSmith/`

**HOW**:
```typescript
// Tasks:
- create: { topic, style? } → { lore, characters?, themes[] }
- expand: { lore, depth? } → { lore, expanded[] }
- weave: { elements[], theme } → { narrative, connections[] }
```

**WHY**:
- Culturecoins need narratives, not just memes
- Lore creates emotional connection
- Narrative weaving connects disparate elements
- Expansion enables depth

**Algorithm**:
- Style-based lore templates (epic, mystical, modern, meta)
- Character generation (DreamKeepers, Collective, Architects)
- Theme extraction (transformation, collective consciousness, cultural evolution)
- Connection generation (influences, emerges from, transforms into)

**Integration Points**:
- Can create lore for CultureMint tokens
- Can expand RemixEngine output
- Can weave elements from multiple sources
- Feeds into VisionSmith for visual narratives

---

### 7. CultureMint Agent

**WHAT**: Mints culturecoins and manages token creation

**WHERE**: `/agents/CultureMint/`

**HOW**:
```typescript
// Tasks:
- mint: { name, symbol, supply?, metadata? } → { tokenAddress, transactionHash, metadata }
- deploy: { contract, network? } → { contractAddress, network, status }
```

**WHY**:
- Culturecoins need tokens
- Token creation should be automated
- Metadata links tokens to culture
- Deployment needs to be trackable

**Algorithm**:
- Mock token address generation (will integrate with real contracts)
- Transaction hash generation
- Metadata aggregation
- Network-specific deployment

**Integration Points**:
- Can mint tokens for new culturecoins
- Can deploy contracts for custom functionality
- Integrates with DreamNet's token infrastructure
- Can feed into MarketFlow for tracking

---

### 8. CultureGuardian Agent

**WHAT**: Protects and moderates culturecoin content and communities

**WHERE**: `/agents/CultureGuardian/`

**HOW**:
```typescript
// Tasks:
- moderate: { content, type? } → { safe, flags[], reason? }
- protect: { community, rules[] } → { status, violations[] }
```

**WHY**:
- Communities need protection
- Content moderation prevents harm
- Rule enforcement maintains culture
- Safety enables growth

**Algorithm**:
- Pattern-based flagging (harmful language, spam/scam, NSFW)
- Rule violation analysis
- Community health monitoring
- Safety scoring

**Integration Points**:
- Can moderate PulseCaster output before posting
- Can protect CultureMint communities
- Can feed into DreamNet's Shield Core
- Can inform CultureOps decisions

---

### 9. MarketFlow Agent

**WHAT**: Analyzes market trends and flow for culturecoins

**WHERE**: `/agents/MarketFlow/`

**HOW**:
```typescript
// Tasks:
- analyze: { token, timeframe? } → { trends[], sentiment }
- predict: { token, horizon? } → { predictions[] }
```

**WHY**:
- Market data informs decisions
- Trends reveal opportunities
- Sentiment predicts movement
- Predictions enable planning

**Algorithm**:
- Trend generation (volume, price, holders)
- Sentiment determination (bullish/bearish/neutral based on trends)
- Prediction generation (price, volume with confidence scores)
- Timeframe-based analysis

**Integration Points**:
- Can analyze CultureMint tokens
- Can predict market movements
- Can feed into DreamNet's Economic Engine
- Can inform CultureOps strategies

---

### 10. VisionSmith Agent

**WHAT**: Creates visual content and image generation prompts

**WHERE**: `/agents/VisionSmith/`

**HOW**:
```typescript
// Tasks:
- generate: { prompt, style? } → { imageUrl, prompt, metadata }
- enhance: { image, enhancements[] } → { enhanced, applied[] }
```

**WHY**:
- Visual content drives engagement
- Image generation needs optimization
- Enhancement improves quality
- Style consistency builds brand

**Algorithm**:
- Prompt enhancement (style prefixes, quality tags)
- Placeholder image URL generation (will integrate with real APIs)
- Enhancement application (upscale, color correct, effects, optimize)
- Metadata tracking

**Integration Points**:
- Can generate visuals for MemeForge memes
- Can enhance LoreSmith narratives
- Can feed into PulseCaster for visual posts
- Can integrate with DreamNet's media infrastructure

---

### 11. SoundWave Agent

**WHAT**: Creates audio content and sound generation

**WHERE**: `/agents/SoundWave/`

**HOW**:
```typescript
// Tasks:
- generate: { prompt, duration?, style? } → { audioUrl, prompt, duration }
- remix: { audio, style? } → { remixedUrl, style }
```

**WHY**:
- Audio content is emerging
- Sound generation enables multimedia
- Remixing creates variations
- Style consistency builds brand

**Algorithm**:
- Placeholder audio URL generation (will integrate with real APIs)
- Duration-based generation
- Style-based remixing (electronic, ambient, etc.)
- Metadata tracking

**Integration Points**:
- Can generate audio for culturecoins
- Can remix existing audio
- Can feed into PulseCaster for audio posts
- Can integrate with DreamNet's media infrastructure

---

### 12. CultureOps Agent

**WHAT**: Orchestrates and coordinates culturecoin operations

**WHERE**: `/agents/CultureOps/`

**HOW**:
```typescript
// Tasks:
- orchestrate: { agents[], workflow[] } → { results[] }
- coordinate: { operation, resources } → { status, resources }
```

**WHY**:
- Complex workflows need orchestration
- Multiple agents need coordination
- Resource management enables efficiency
- Operations need tracking

**Algorithm**:
- Agent orchestration (sequential execution)
- Workflow step execution
- Resource coordination
- Result aggregation

**Integration Points**:
- Orchestrates all other CultureCoiner/MemeEngine agents
- Can coordinate with DreamNet Core agents
- Can manage complex workflows
- Can feed into DreamNet's orchestrator

---

## 🧠 DreamNet Core Agents (11+ Agents)

### System Architecture

**Location**: `packages/agent-registry-core/`, `server/core/agents/`  
**Pattern**: Integrated with DreamNet OS, orchestrator cycles, health tracking

**Registry**: `AgentRegistryCore`
- Config management (`AgentConfig`)
- Health tracking (`AgentHealth`)
- Scheduler integration (`runAgentRegistryCycle`)

---

### 1. DreamOps Agent

**WHAT**: Main orchestrator for DreamNet operations

**WHERE**: `packages/agent-registry-core/logic/healthUpdater.ts` (registered)

**HOW**:
- Registered in `ensureDefaultAgentsSeeded()`
- Kind: `infra`
- Subsystem: `DreamNet OS`
- Tags: `["orchestration", "devops"]`

**WHY**:
- Central coordination point
- System-wide orchestration
- DevOps automation
- Health monitoring

**Integration Points**:
- Part of DreamNet OS heartbeat
- Coordinates with all subsystems
- Monitors system health
- Triggers recovery actions

---

### 2. DeployKeeper Agent

**WHAT**: Manages deployments and CI/CD integrity

**WHERE**: `server/core/agents/deploykeeper.ts`

**HOW**:
- Monitors deployment status
- Validates CI/CD pipelines
- Tracks deployment health
- Triggers rollbacks if needed

**WHY**:
- Deployments need monitoring
- CI/CD integrity prevents issues
- Health tracking enables recovery
- Automation reduces manual work

**Integration Points**:
- Integrates with Vercel, Railway, Cloud Run
- Monitors deployment endpoints
- Feeds into DreamNet OS alerts
- Can trigger auto-recovery

---

### 3. EnvKeeper Agent

**WHAT**: Environment variable hygiene and security

**WHERE**: `server/core/agents/envkeeper.ts`

**HOW**:
- Validates environment variables
- Checks for missing/secrets
- Monitors env consistency
- Alerts on changes

**WHY**:
- Environment variables are critical
- Security requires validation
- Consistency prevents issues
- Monitoring enables detection

**Integration Points**:
- Integrates with DreamNet's env system
- Feeds into Shield Core for security
- Monitors for leaks
- Can trigger alerts

---

### 4. WolfPack Agent

**WHAT**: Predatory anomaly-hunting subsystem

**WHERE**: `packages/agent-registry-core/logic/healthUpdater.ts` (registered)

**HOW**:
- Registered in `ensureDefaultAgentsSeeded()`
- Kind: `swarm`
- Subsystem: `WolfPack`
- Tags: `["swarm", "risk"]`

**WHY**:
- Anomalies need detection
- Swarm behavior enables coverage
- Risk assessment informs decisions
- Predatory pattern mimics nature

**Integration Points**:
- Integrates with WolfPack Funding Core
- Feeds into Field Layer (risk fields)
- Can trigger Shield Core responses
- Monitors for threats

---

### 5. SwarmPatrol Agent

**WHAT**: Micro-agent repair patrol

**WHERE**: `packages/agent-registry-core/logic/healthUpdater.ts` (registered)

**HOW**:
- Registered in `ensureDefaultAgentsSeeded()`
- Kind: `swarm`
- Subsystem: `Halo-Loop`
- Tags: `["repair", "infra"]`

**WHY**:
- Micro-agents need repair
- Patrol pattern enables coverage
- Self-healing reduces manual work
- Infrastructure health is critical

**Integration Points**:
- Integrates with Halo-Loop
- Monitors agent health
- Triggers repair actions
- Feeds into DreamNet OS

---

### 6. FieldLayer Agent

**WHAT**: Global parameter fields (risk, trust, liquidity)

**WHERE**: `packages/agent-registry-core/logic/healthUpdater.ts` (registered)

**HOW**:
- Registered in `ensureDefaultAgentsSeeded()`
- Kind: `economy`
- Subsystem: `FieldLayer`
- Tags: `["risk", "trust", "fields"]`

**WHY**:
- Global parameters influence behavior
- Fields enable loose coupling
- Decay ensures freshness
- Sampling enables access

**Integration Points**:
- Integrates with Field Layer Core
- Feeds into Reputation Lattice
- Informs agent scoring
- Updates from multiple sources

---

### 7. EconomicEngine Agent

**WHAT**: Rewards and token simulation layer

**WHERE**: `packages/agent-registry-core/logic/healthUpdater.ts` (registered)

**HOW**:
- Registered in `ensureDefaultAgentsSeeded()`
- Kind: `economy`
- Subsystem: `EconomicEngineCore`
- Tags: `["rewards", "simulation"]`

**WHY**:
- Rewards drive engagement
- Token simulation enables testing
- Economic rules need enforcement
- Balance tracking enables fairness

**Integration Points**:
- Integrates with Economic Engine Core
- Manages token balances
- Applies emission rules
- Feeds into DreamNet economy

---

### 8. ZenGarden Agent

**WHAT**: Ritual and activity tracking

**WHERE**: `packages/agent-registry-core/logic/healthUpdater.ts` (registered)

**HOW**:
- Registered in `ensureDefaultAgentsSeeded()`
- Kind: `wellness`
- Subsystem: `ZenGardenCore`
- Tags: `["zen", "wellness"]`

**WHY**:
- Wellness drives sustainability
- Rituals create meaning
- Activity tracking enables rewards
- Zen state enables clarity

**Integration Points**:
- Integrates with Zen Garden Core
- Tracks user activities
- Computes rewards
- Feeds into Economic Engine

---

### 9. DreamTank Agent

**WHAT**: Dream incubation and progression

**WHERE**: `packages/agent-registry-core/logic/healthUpdater.ts` (registered)

**HOW**:
- Registered in `ensureDefaultAgentsSeeded()`
- Kind: `governance`
- Subsystem: `DreamTankCore`
- Tags: `["incubator", "dreams"]`

**WHY**:
- Dreams need incubation
- Progression enables growth
- Evaluation informs decisions
- Stages enable structure

**Integration Points**:
- Integrates with Dream Tank Core
- Manages dream lifecycle
- Evaluates progress
- Feeds into Dream Cortex

---

### 10. SocialHub Agent

**WHAT**: Social feed and posts layer

**WHERE**: `packages/agent-registry-core/logic/healthUpdater.ts` (registered)

**HOW**:
- Registered in `ensureDefaultAgentsSeeded()`
- Kind: `social`
- Subsystem: `SocialHubCore`
- Tags: `["social", "feed"]`

**WHY**:
- Social interaction drives engagement
- Feed enables discovery
- Posts create content
- Engagement metrics inform decisions

**Integration Points**:
- Integrates with Social Hub Core
- Manages social feed
- Tracks engagement
- Feeds into Narrative Field

---

### 11. WolfPackFunding Agent

**WHAT**: Funding discovery and outreach automation

**WHERE**: `packages/agent-registry-core/logic/healthUpdater.ts` (registered)

**HOW**:
- Registered in `ensureDefaultAgentsSeeded()`
- Kind: `economy`
- Subsystem: `WolfPackFundingCore`
- Tags: `["funding", "outreach", "email"]`

**WHY**:
- Funding enables growth
- Discovery finds opportunities
- Outreach automates communication
- Email enables scale

**Integration Points**:
- Integrates with Wolf Pack Funding Core
- Discovers funding leads
- Automates outreach
- Tracks conversions

---

## 🔄 How Agents Work Together

### CultureCoiner/MemeEngine Flow

```
User Request
  ↓
CultureOps.orchestrate()
  ↓
MemeEngineCore.generate()
  ├─→ MemeForge.create_2panel()
  ├─→ RemixEngine.remix()
  ├─→ CultureScore.score()
  └─→ VisionSmith.generate()
  ↓
PulseCaster.cast()
  ├─→ Twitter
  ├─→ Farcaster
  └─→ Telegram
  ↓
MarketFlow.analyze()
  ↓
CultureGuardian.moderate()
  ↓
Results
```

### DreamNet Core Flow

```
Orchestrator Cycle
  ↓
AgentRegistryCore.run()
  ├─→ DreamOps (orchestration)
  ├─→ DeployKeeper (deployments)
  ├─→ EnvKeeper (environment)
  ├─→ WolfPack (anomalies)
  ├─→ SwarmPatrol (repair)
  ├─→ FieldLayer (fields)
  ├─→ EconomicEngine (rewards)
  ├─→ ZenGarden (wellness)
  ├─→ DreamTank (dreams)
  ├─→ SocialHub (social)
  └─→ WolfPackFunding (funding)
  ↓
Health Tracking
  ↓
Neural Mesh (memory)
  ↓
Narrative Field (logging)
```

### Cross-System Integration

```
CultureCoiner/MemeEngine Agents
  ↓ (can call)
DreamNet Core Agents
  ↓ (via AgentRegistry)
HTTP API (/api/agents)
  ↓ (can trigger)
Orchestrator Cycles
  ↓ (feeds into)
Neural Mesh / Narrative Field
```

---

## 🎯 Why This Architecture Works

### 1. Modularity
- Each agent is self-contained
- Clear interfaces enable composition
- Easy to add new agents
- Easy to test agents independently

### 2. Scalability
- Agents can be distributed
- Registry enables discovery
- Health tracking enables monitoring
- Orchestration enables coordination

### 3. Extensibility
- New agents can be added easily
- Pipeline pattern enables workflows
- Integration points are clear
- Context injection enables flexibility

### 4. Observability
- Health tracking built-in
- Logs enable debugging
- Metrics enable optimization
- Status endpoints enable monitoring

### 5. Biomimetic Design
- Swarm patterns (WolfPack, SwarmPatrol)
- Nervous system (Spider Web Core)
- Memory (Neural Mesh)
- Metabolism (Predator-Scavenger Loop)

---

## 📊 Agent Status Summary

### CultureCoiner/MemeEngine Agents: 12 ✅
- MemeForge ✅
- RemixEngine ✅
- CultureScore ✅
- MemeEngineCore ✅
- PulseCaster ✅
- LoreSmith ✅
- CultureMint ✅
- CultureGuardian ✅
- MarketFlow ✅
- VisionSmith ✅
- SoundWave ✅
- CultureOps ✅

### DreamNet Core Agents: 11+ ✅
- DreamOps ✅
- DeployKeeper ✅
- EnvKeeper ✅
- WolfPack ✅
- SwarmPatrol ✅
- FieldLayer ✅
- EconomicEngine ✅
- ZenGarden ✅
- DreamTank ✅
- SocialHub ✅
- WolfPackFunding ✅

---

## 🚀 Next Steps

1. **API Integration**: Create `/server/routes/agents.ts` endpoint
2. **UI Dashboard**: Create `/client/src/pages/agents-dashboard.tsx`
3. **Server Integration**: Wire `AgentRegistry.initAgents()` into server startup
4. **Testing**: Test all agents end-to-end
5. **Documentation**: Add per-agent usage examples
6. **Monitoring**: Add metrics and observability
7. **Integration**: Connect to real APIs (OpenAI, image generation, etc.)

---

## 🎉 Conclusion

DreamNet now has **two powerful agent systems**:

1. **CultureCoiner/MemeEngine**: 12 agents for culturecoin operations
2. **DreamNet Core**: 11+ agents for system operations

Together, they enable DreamNet to **own and define the culturecoin space** by providing:
- Content generation (memes, lore, visuals, audio)
- Content optimization (scoring, remixing, platform adaptation)
- Content distribution (multi-platform casting)
- Content protection (moderation, community safety)
- Market intelligence (trends, predictions)
- Token operations (minting, deployment)
- System operations (orchestration, health, repair)

**This is the infrastructure layer for the culturecoin revolution.** 🚀


