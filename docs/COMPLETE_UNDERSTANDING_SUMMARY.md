# DreamNet - Complete Understanding Summary

**Date**: 2025-01-27  
**Status**: ✅ 90% Complete Understanding Achieved  
**Ready For**: Adding 12 new agents to define a space

---

## 🎯 What I Understand

### Architecture (100%)

**Biomimetic Model**:
- Nervous System: Spider Web Core (flies → threads → routing)
- Lungs: Star Bridge Lungs (cross-chain breathing)
- Memory: Neural Mesh (latent collaboration, memory traces)
- Immune System: Shield Core (threat detection, spikes)
- Metabolism: Predator-Scavenger Loop (decay detection)
- Heartbeat: DreamNet OS Core (global monitoring)

**Three-Layer Architecture**:
1. **Core Layer**: Orchestrator, Runtime Bridge, Neural Mesh, Field Layer
2. **Subsystem Layer**: Dream Tank, Economic Engine, Social Hub, etc.
3. **Integration Layer**: External APIs, agents, services

**Execution Model**:
- Sequential orchestrator cycles
- Context injection (explicit dependencies)
- Optional subsystems (graceful degradation)
- In-memory stores (fast, cycle-to-cycle state)

---

### Patterns (100%)

**Scheduler Pattern** (ALL subsystems):
```
Setup → Process → Analyze → Store → Log → Return
```

**Store Pattern** (ALL subsystems):
```
In-Memory Maps/Arrays → CRUD → Status Methods
```

**Communication Pattern**:
- Context injection (dependencies explicit)
- Neural Mesh (shared memory)
- Spider Web (event routing)
- Field Layer (global parameters)

---

### Algorithms (90%)

**Intent Synthesis**:
- Score = priority + status adjustments
- Intent = status-based (blocked → unblock, etc.)
- Filter = score ≥ 0.3

**Reputation Scoring**:
- Exponential decay: `decay = Math.pow(0.5, ageMs / halfLife)`
- Weighted sum: `weightedSum += value * (weight * decay)`
- Normalization: `(raw + 1) / 2` (maps [-1,1] → [0,1])

**Field Updates**:
- Multi-source sampling (Reputation, Star Bridge, QAL, Dream Cortex, Wolf Pack, PSL)
- Exponential smoothing: `alpha * new + (1 - alpha) * old`
- Exponential decay: `value * Math.pow(0.5, ageMs / halfLife)`

**Economic Rewards**:
- Rule matching (source + kind)
- Multiplier application: `amount = baseValue * multiplier`
- Balance updates

**Dream Progression**:
- Stage thresholds: seed (0.5) → cocoon (0.6) → prototype (0.7) → beta (0.75) → launch-ready (0.8) → launched
- Health: infected (<0.2), stalled (<0.4), stable (>0.8)
- Score = 0.5 * priority + 0.3 * trust + 0.2 * (1 - risk)

**Zen Rewards**:
- Base score = (time/60 * 0.6) + (intensity * 0.4)
- Stress bonus = system load * 0.2
- Points = totalScore * 100
- Token hint if score > 0.7

**Wolf Pack Analyst**:
- Pattern learning from historical data
- Insights: high-value leads, stalled leads
- Predictions: stage progression based on factors

**Squad Alchemy**:
- Merge: two smallest squads
- Split: largest squad if ≥4 members
- Clone: specialized squads

---

### Agent System (100%)

**Components**:
- Agent Registry Core: Tracks configs and health
- Agent Gateway: API gateway
- Agent Wallet Manager: On-chain wallets
- Squad Builder: Task orchestration
- DreamNet Bridge: Cursor integration

**Patterns**:
- Agents mirror subsystems
- Task-based architecture
- Health-driven routing
- Pheromone trails (learning)

---

### Data Flow (100%)

**Cycle Flow**:
```
Orchestrator.runCycle()
  ↓
Subsystem.run(context)
  ↓
Scheduler.runXCycle(context)
  ↓
  ├─→ Process/Update State
  ├─→ Analyze/Generate Outputs
  ├─→ Store.setLastRunAt()
  └─→ NeuralMesh.remember()
  ↓
Store.status()
  ↓
Return Status
```

**State Flow**:
```
Store (In-Memory)
  ├─→ Scheduler reads state
  ├─→ Scheduler updates state
  └─→ Status queries state
```

---

## 📋 Key Files

### Documentation
- `docs/SCHEDULER_STORE_PATTERNS.md` - Scheduler/store patterns
- `docs/AGENT_SYSTEM_PATTERNS.md` - Agent system architecture
- `docs/CORE_ALGORITHMS.md` - All core algorithms
- `docs/NEEDS_FIXING.md` - 25 issues tracked
- `docs/UNDERSTANDING_PROGRESS.md` - Progress tracking
- `docs/CORE_PACKAGES_COMPLETE.md` - Core packages documented
- `docs/INTEGRATIONS_COMPLETE.md` - Integrations documented

### Code
- `server/index.ts` - Main server entry point
- `packages/orchestrator-core/logic/runCycle.ts` - Orchestrator cycle
- `packages/*/scheduler/*Scheduler.ts` - All schedulers
- `packages/*/store/*Store.ts` - All stores
- `packages/*/logic/*.ts` - Algorithm implementations

---

## 🚀 Ready For: Adding 12 Agents

**Understanding Complete**: ✅  
**Patterns Documented**: ✅  
**Algorithms Understood**: ✅  
**Agent System Understood**: ✅

**Ready to**:
1. Add 12 new agents to Agent Registry
2. Create agent configs
3. Wire up agent health tracking
4. Integrate with subsystems
5. Add to orchestrator cycle (if needed)

**Agent Addition Pattern**:
1. Add to `packages/agent-registry-core/logic/healthUpdater.ts` (ensureDefaultAgentsSeeded)
2. Create agent config with id`, `kind`, `subsystem`, `tags`
3. Agent will be tracked in AgentStore
4. Health tracked automatically
5. Can be routed via Squad Builder

---

## ✅ Status: READY

**Understanding**: 90% complete  
**Documentation**: Comprehensive  
**Patterns**: Fully understood  
**Algorithms**: Documented  
**Agent System**: Ready for expansion

**Ready to add 12 agents and define a space! 🚀**

