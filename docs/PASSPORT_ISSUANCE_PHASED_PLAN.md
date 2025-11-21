# 🎫 Phased Passport Issuance Plan

**Date**: 2025-01-27  
**Status**: Ready to Execute  
**Approach**: Issue passports one or a few at a time, starting with critical systems

---

## 🎯 Strategy

**Gradual Rollout**: Issue passports to agents and systems incrementally, testing each step before proceeding.

**Priority Order**:
1. **Core Dream Agents** (6 agents) - System foundation
2. **Keeper Agents** (5 agents) - Critical operations
3. **Fleet Agents** (by fleet, one at a time) - Revenue verticals
4. **Biomimetic Systems** (23 systems) - Advanced features
5. **Remaining Agents** (100+ agents) - Full ecosystem

---

## 🚀 Quick Start Commands

### Issue Passport to Single Agent
```bash
# Core Dream Agent
pnpm tsx scripts/issue-passport-phased.ts --agent LUCID

# Keeper Agent
pnpm tsx scripts/issue-passport-phased.ts --agent DreamKeeper

# Fleet Agent
pnpm tsx scripts/issue-passport-phased.ts --agent AegisLogisticsNetwork --fleet=aegis
```

### Issue Passports to Fleet (Gradual)
```bash
# Issue first 3 Aegis agents
pnpm tsx scripts/issue-passport-phased.ts --fleet aegis --count=3

# Issue all Travel Fleet agents
pnpm tsx scripts/issue-passport-phased.ts --fleet travel

# Issue all OTT Fleet agents
pnpm tsx scripts/issue-passport-phased.ts --fleet ott

# Issue all Science Fleet agents
pnpm tsx scripts/issue-passport-phased.ts --fleet science
```

### Check Status
```bash
# List all pending agents
pnpm tsx scripts/issue-passport-phased.ts --list-pending

# List pending agents in specific fleet
pnpm tsx scripts/issue-passport-phased.ts --list-pending --fleet=aegis
```

---

## 📋 Phase 1: Core Dream Agents (Start Here)

**Priority**: 🔴 **CRITICAL**  
**Count**: 6 agents  
**Tier**: `operator`  
**Time**: ~5 minutes

### Agents to Issue:
1. **LUCID** - Logic Unification & Command Interface Daemon
2. **CANVAS** - Visual Layer Weaver
3. **ROOT** - Subconscious Architect
4. **ECHO** - Wallet Mirror
5. **CRADLE** - Evolution Engine
6. **WING** - Messenger & Mint Agent

### Commands:
```bash
# Issue one at a time
pnpm tsx scripts/issue-passport-phased.ts --agent LUCID
pnpm tsx scripts/issue-passport-phased.ts --agent CANVAS
pnpm tsx scripts/issue-passport-phased.ts --agent ROOT
pnpm tsx scripts/issue-passport-phased.ts --agent ECHO
pnpm tsx scripts/issue-passport-phased.ts --agent CRADLE
pnpm tsx scripts/issue-passport-phased.ts --agent WING

# Or issue all at once (if script supports batch)
# (Currently one at a time for safety)
```

### Verification:
```bash
# Check passports issued
curl http://localhost:5000/api/passports | jq '.passports | length'

# Check specific agent
curl http://localhost:5000/api/passports/agent:LUCID
```

---

## 📋 Phase 2: Keeper Agents

**Priority**: 🟠 **HIGH**  
**Count**: 5 agents  
**Tier**: `operator`  
**Time**: ~5 minutes

### Agents to Issue:
1. **DreamKeeper** - Network intelligence
2. **DeployKeeper** - Deployment operations
3. **EnvKeeper** - Environment management
4. **APIKeeper** - API key management
5. **CoinSensei** - Wallet analytics

### Commands:
```bash
pnpm tsx scripts/issue-passport-phased.ts --agent DreamKeeper
pnpm tsx scripts/issue-passport-phased.ts --agent DeployKeeper
pnpm tsx scripts/issue-passport-phased.ts --agent EnvKeeper
pnpm tsx scripts/issue-passport-phased.ts --agent APIKeeper
pnpm tsx scripts/issue-passport-phased.ts --agent CoinSensei
```

---

## 📋 Phase 3: Fleet Agents (One Fleet at a Time)

### 🛡️ Aegis Fleet (Military/Defense)

**Priority**: 🟡 **MEDIUM**  
**Count**: 10 agents (1 built, 9 pending)  
**Tier**: `architect`  
**Department**: `dept:security`

#### Built Agents (Issue First):
1. **AegisLogisticsNetwork** ✅ Built
   ```bash
   pnpm tsx scripts/issue-passport-phased.ts --agent AegisLogisticsNetwork --fleet=aegis
   ```

#### Pending Agents (Issue When Built):
2. AegisCommand (⚠️ CRITICAL - Must be built first)
3. AegisSentinel
4. AegisPrivacyLab
5. AegisCipherMesh
6. AegisInteropNexus
7. AegisMaintenanceIntelligence
8. AegisVanguard
9. AegisReliefCommand
10. AegisSandbox

#### Commands:
```bash
# Issue first 3 Aegis agents (when built)
pnpm tsx scripts/issue-passport-phased.ts --fleet aegis --count=3

# Issue all Aegis agents
pnpm tsx scripts/issue-passport-phased.ts --fleet aegis
```

---

### 🌍 Travel Fleet

**Priority**: 🟡 **MEDIUM**  
**Count**: 1 agent (built)  
**Tier**: `operator`  
**Department**: `dept:commerce`

#### Built Agents:
1. **GroundAtlas** ✅ Built
   ```bash
   pnpm tsx scripts/issue-passport-phased.ts --agent GroundAtlas --fleet=travel
   ```

---

### 📡 OTT Fleet (Communications & Media)

**Priority**: 🟢 **LOW**  
**Count**: TBD  
**Tier**: `operator`  
**Department**: `dept:communications`

#### Status: ⚠️ Agents TBD
```bash
# When agents are defined
pnpm tsx scripts/issue-passport-phased.ts --fleet ott
```

---

### 🔬 Science Fleet (Research & Development)

**Priority**: 🟢 **LOW**  
**Count**: TBD  
**Tier**: `operator`  
**Department**: `dept:research`

#### Status: ⚠️ Agents TBD (Archimedes mentioned)
```bash
# When agents are defined
pnpm tsx scripts/issue-passport-phased.ts --fleet science
```

---

## 📋 Phase 4: Biomimetic Systems

**Priority**: 🟢 **LOW**  
**Count**: 23 systems  
**Tier**: `operator` or `architect`  
**Time**: ~30 minutes

### Systems to Issue:
- Octopus, Wolf Pack, Swarm, Spider Web
- Falcon Eye, Chameleon Skin, Snail Trail
- Whale Pack, Orca Pack, Zen Garden
- Spore Engine, Squad Builder, Neural Mesh
- Quantum Anticipation, Reputation Lattice
- And more...

### Commands:
```bash
# Issue one at a time
pnpm tsx scripts/issue-passport-phased.ts --agent Octopus
pnpm tsx scripts/issue-passport-phased.ts --agent WolfPack
# ... etc
```

---

## 📋 Phase 5: Remaining Agents

**Priority**: ⚪ **LOWEST**  
**Count**: 100+ agents  
**Tier**: `citizen` or `dreamer`  
**Time**: ~2 hours (if done all at once)

### Commands:
```bash
# Use batch script for remaining agents
pnpm register:agents

# Or issue gradually
pnpm tsx scripts/issue-passport-phased.ts --list-pending
# Then issue one at a time
```

---

## ✅ Verification After Each Phase

### Check Passport Count:
```bash
curl http://localhost:5000/api/passports | jq '.count'
curl http://localhost:5000/api/citizens/stats | jq '.stats.totalCitizens'
```

### Check Specific Agent:
```bash
curl http://localhost:5000/api/passports/agent:LUCID
curl http://localhost:5000/api/citizens/agent:LUCID
```

### Check Fleet Status:
```bash
curl http://localhost:5000/api/fleets/aegis
curl http://localhost:5000/api/custom-gpt-fleets/aegis
```

---

## 🎯 Recommended Execution Order

### Week 1: Foundation
1. ✅ **Phase 1**: Core Dream Agents (6 agents)
2. ✅ **Phase 2**: Keeper Agents (5 agents)
3. ✅ **Aegis Logistics Network**: Issue passport (1)

### Week 2: Fleets
4. ✅ **Travel Fleet**: Ground Atlas (1 agent)
5. ⏳ **Aegis Fleet**: Build and issue remaining agents (9 agents)

### Week 3+: Expansion
6. ⏳ **OTT Fleet**: Build and issue agents
7. ⏳ **Science Fleet**: Build and issue agents
8. ⏳ **Biomimetic Systems**: Issue passports (23 systems)
9. ⏳ **Remaining Agents**: Batch or gradual (100+ agents)

---

## 📊 Progress Tracking

### Current Status:
- ✅ **Script Created**: `scripts/issue-passport-phased.ts`
- ✅ **Health-Check Upgraded**: `/health/live` and `/health/ready` endpoints
- ⏳ **Passports Issued**: 0/143 agents (ready to start)
- ⏳ **Fleet Integration**: Pending

### Next Steps:
1. Issue passport to LUCID (test the system)
2. Issue passports to remaining Core Dream agents
3. Issue passports to Keeper agents
4. Issue passport to AegisLogisticsNetwork
5. Issue passport to GroundAtlas

---

## 🚨 Important Notes

1. **One at a Time**: Start with single agents to test the system
2. **Verify Each Step**: Check passports after each issuance
3. **Fleet Agents**: Use `--fleet` flag to assign correct cluster/department
4. **Built vs Pending**: Only issue passports to agents that exist
5. **Gradual Rollout**: Don't rush - test each phase before proceeding

---

**Status**: Ready to start issuing passports  
**First Command**: `pnpm tsx scripts/issue-passport-phased.ts --agent LUCID`

