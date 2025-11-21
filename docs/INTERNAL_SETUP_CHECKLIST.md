# Internal Setup Checklist - Complete Before Deployment

**Goal**: Get everything wired internally before deploying to GCP/AWS  
**Status**: Pre-deployment internal setup

---

## 🎯 Phase 1: Agent Citizenship (CRITICAL)

### Register All 143 Agents
- [ ] **Run agent registration**: `pnpm register:agents` OR POST `/api/register-agents`
- [ ] **Verify**: Check `/api/register-agents/status`
- [ ] **Expected**: 143 agents registered, 143 passports issued, 143 citizens created

**What this does**:
- Registers all agents in Directory
- Issues passports (with appropriate tiers)
- Creates citizen entries
- Makes agents discoverable

**Why first**: Agents are "first citizens" - everything else depends on them

---

## 🏛️ Phase 2: DreamState Government Setup

### Initialize Government Departments
- [ ] **Treasury Department** - Financial management
- [ ] **Commerce Department** - Business operations
- [ ] **Communications Department** - Messaging coordination
- [ ] **Diplomacy Department** - External relations
- [ ] **API Keeper** - API key management
- [ ] **Security Office** - Defense operations
- [ ] **Silent Sentinel** - Monitoring
- [ ] **Mycelium Network** - Distributed operations

**How to check**: `/api/dream-state/status` should show departments

### Assign Agents to Departments
- [ ] **Aegis agents** → Security Office
- [ ] **Keeper agents** → API Keeper / EnvKeeper / DeployKeeper
- [ ] **Economic agents** → Treasury Department
- [ ] **Social agents** → Communications Department

---

## 🌉 Phase 3: Star Bridge & Wormholes

### Star Bridge Setup
- [ ] **Verify Star Bridge Lungs** is initialized
- [ ] **Check chain connections**: Base, Ethereum, Solana, Polygon, etc.
- [ ] **Test cross-chain operations** (if applicable)

**Status check**: `/api/star-bridge/status`

### Wormholes Setup
- [ ] **Verify wormholes registered**:
  - `WH-CORE-OMEGA` (Core)
  - `WH-MILNET-BETA` (Aegis Fleet)
  - `WH-TRAVELNET-GAMMA` (Travel Fleet)
  - `WH-OTTNET-GAMMA` (OTT Fleet)
  - `WH-ARCHIMEDES-EPSILON` (Science Fleet)
- [ ] **Test wormhole communication**

**Status check**: Check `packages/event-wormholes/src/index.ts` - should auto-register

---

## 🐺 Phase 4: Pack Systems

### Wolf Pack
- [ ] **Verify Wolf Pack initialized**
- [ ] **Check target tracking**
- [ ] **Verify funding core** (`wolfpack-funding-core`)

**Status check**: `/api/wolf-pack/status`

### Whale Pack
- [ ] **Verify Whale Pack initialized**
- [ ] **Check product management**
- [ ] **Verify audience targeting**

**Status check**: `/api/whale-pack/status`

### Orca Pack
- [ ] **Verify Orca Pack initialized**
- [ ] **Check narrative coordination**

**Status check**: `/api/orca-pack/status`

### Swarm
- [ ] **Verify Swarm coordinator initialized**
- [ ] **Check swarm bot agents** (LUCID, CANVAS, ROOT, ECHO)

**Status check**: `/api/swarm/status`

---

## 🛡️ Phase 5: Aegis Fleet Setup

### Register Aegis Systems
- [ ] **Aegis Command** (needs to be built)
- [ ] **Aegis Sentinel** (needs to be built)
- [ ] **Aegis Logistics Network** (✅ exists - Custom GPT)
- [ ] **Ground Atlas** (✅ exists - Custom GPT)
- [ ] **Privacy Lab** (needs to be built)
- [ ] **Cipher Mesh** (needs to be built)
- [ ] **Threat Intelligence** (needs to be built)
- [ ] **Defense Network** (needs to be built)
- [ ] **Security Operations** (needs to be built)
- [ ] **Compliance Auditor** (needs to be built)

**Current status**: 2/10 Custom GPTs exist, 8 more

### Integrate Existing Custom GPTs
- [ ] **Ground Atlas** → Register in Directory, issue passport
- [ ] **Integration**: Connect to `/api/agent/gateway`

- [ ] **Aegis Logistics Network** → Register in Directory, issue passport

**Integration**: Connect to `/api/agent/gateway`

---

## 💰 Phase 6: Economic Engine Setup

### Token Configuration
- [ ] **Verify tokens configured**: SHEEP, FLBY, CORE, ROOT, DREAM
- [ ] **Check emission rules**
- [ ] **Verify balance tracking**

**Status check**: `/api/economic-engine/status`

### Treasury Setup
- [ ] **Initialize Treasury Department**
- [ ] **Set up revenue tracking**
- [ ] **Configure revenue sharing**

**Status check**: `/api/treasury/status`

### Fleet Revenue Integration
- [ ] **Add fleet reward sources** (Aegis, Travel, OTT, Science)
- [ ] **Create fleet emission rules**
- [ ] **Connect to Treasury**

---

## 🕷️ Phase 7: Core Systems Verification

### Spider Web (Webhooks)
- [ ] **Verify webhook nervous core initialized**
- [ ] **Check webhook registration**
- [ ] **Test webhook delivery**

**Status check**: `/api/webhooks/status`

### Octopus (Multi-arm Coordination)
- [ ] **Verify Octopus executor initialized**
- [ ] **Check arm coordination**
- [ ] **Test context handoff**

**Status check**: `/api/octopus/status`

### Shield Core (Defense)
- [ ] **Verify Shield Core initialized**
- [ ] **Check threat detection**
- [ ] **Test defense activation**

**Status check**: `/api/shield/status`

### Jaggy (Silent Sentinel)
- [ ] **Verify Jaggy core initialized**
- [ ] **Check observability**
- [ ] **Test reconnaissance**

**Status check**: `/api/jaggy/status`

---

## 📊 Phase 8: Directory & Discovery

### Directory Bootstrap
- [ ] **Verify Directory initialized**
- [ ] **Check core nodes registered**:
  - WOLF_PACK
  - OCTOPUS
  - SPIDER_WEB
  - JAGGY
  - SHIELD_CORE
  - DREAM_STATE
  - STAR_BRIDGE
  - etc.
- [ ] **Verify ports registered**
- [ ] **Verify conduits registered**

**Status check**: `/api/directory/status`

### Discovery System
- [ ] **Verify discovery system initialized**
- [ ] **Test entity lookup**
- [ ] **Test search functionality**

**Status check**: `/api/discovery/status`

---

## 🔧 Phase 9: Environment & Configuration

### Environment Variables
- [ ] **Verify all env vars set** (check `ENVIRONMENT_MANIFEST.md`)
- [ ] **Database connection** (DATABASE_URL)
- [ ] **API keys** (OpenAI, Anthropic, Stripe, etc.)
- [ ] **Blockchain RPC URLs** (Base, etc.)
- [ ] **External service credentials**

**Check**: `server/config/env.ts` should load without errors

### Governor Configuration
- [ ] **Set governor mode** (`canary` initially)
- [ ] **Set QPS limits** (start conservative: 2)
- [ ] **Set concurrency limits** (start conservative: 5)
- [ ] **Set queue limits** (start conservative: 20)

**Check**: `client/src/governor/config.ts`

---

## 🧪 Phase 10: Health Checks

### Server Health
- [ ] **`/health` endpoint** - Should return 200
- [ ] **`/ready` endpoint** - Should return 200 when subsystems initialized
- [ ] **All routes load** - No 500 errors

**Test**: `curl http://localhost:3000/health`

### Subsystem Health
- [ ] **DreamKeeper** - Health monitoring active
- [ ] **DeployKeeper** - Deployment tracking active
- [ ] **EnvKeeper** - Environment discovery active
- [ ] **API Keeper** - API key tracking active

**Test**: Check `/api/ops/health` or `/api/dreamkeeper/status`

---

## 📋 Pre-Deployment Verification

### Final Checks
- [ ] **All 143 agents registered** ✅
- [ ] **Government departments initialized** ✅
- [ ] **Star Bridge & Wormholes active** ✅
- [ ] **Packs initialized** ✅
- [ ] **Aegis Fleet integrated** (at least 2 Custom GPTs) ✅
- [ ] **Economic Engine configured** ✅
- [ ] **Core systems verified** ✅
- [ ] **Directory bootstrapped** ✅
- [ ] **Environment variables set** ✅
- [ ] **Health checks passing** ✅

### Deployment Readiness
- [ ] **Frontend builds successfully**: `pnpm build:client`
- [ ] **Backend builds successfully**: `pnpm build:app`
- [ ] **Docker image builds**: `docker build -t dreamnet .`
- [ ] **No critical errors in logs**
- [ ] **All tests passing** (if applicable)

---

## 🚀 Next: Deployment Setup

Once internal setup is complete, we'll:
1. **Configure domains** (dreamnet.ink, dreamnet.live)
2. **Set up GCP/AWS** (similar to Vercel)
3. **Deploy** (one command: `pnpm deploy:gcp` or `pnpm deploy:aws`)
4. **Point domains** to deployed services

**Deployment Process**:
- **GCP**: Deploy → Get URL → Point domain → Done (like Vercel)
- **AWS**: Deploy → Get URL → Point domain → Done (like Vercel)

---

## 📝 Notes

- **Vercel comparison**: Yes, it's similar! Deploy → Get URL → Point domain → Live
- **Domains**: We'll configure dreamnet.ink and dreamnet.live after deployment
- **aethersafe**: Can stay in Replit or migrate later
- **dadfi.org**: Can point to new deployment or keep separate

---

**Status**: Ready to start internal setup!  
**Next**: Run `pnpm register:agents` to begin Phase 1

