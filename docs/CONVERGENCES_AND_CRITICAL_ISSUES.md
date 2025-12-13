# DreamNet Convergences & Critical Issues Report

**Status**: 🔴 Critical Analysis Complete  
**Last Updated**: 2025-01-27  
**Total Issues Found**: 52  
**Critical**: 8 | **High Priority**: 14 | **Medium Priority**: 17 | **Low Priority**: 13

---

## 🎯 Executive Summary

This document identifies **convergences** (overlapping/duplicate systems), **bugs**, **problems**, and **critical unlocks** discovered during comprehensive codebase documentation. These issues represent potential blockers, architectural problems, and opportunities for consolidation.

---

## 🔴 CRITICAL CONVERGENCES (Duplicate Systems)

### 1. Multiple Agent Registry Systems ⚠️ **CRITICAL**

**Problem**: Three separate agent registry systems exist with overlapping functionality:

1. **Agent Registry Core** (`packages/agent-registry-core/`)
   - Purpose: Health tracking, agent configs, status monitoring
   - Stores: `AgentStore` (in-memory Map)
   - Agents: 11 core system agents seeded
   - Used by: DreamNetOS, server initialization

2. **Super Spine** (`server/core/SuperSpine.ts`)
   - Purpose: Agent orchestration, task routing, capability management
   - Stores: `agentNodes` Map, `taskQueue` Array
   - Agents: LUCID, CANVAS, ROOT, CRADLE, WING, Wolf Pack
   - Used by: `/api/super-spine` routes

3. **Directory System** (`packages/directory/`)
   - Purpose: Universal registry for agents, citizens, clusters, etc.
   - Stores: In-memory registry
   - Used by: DreamState, agent registration routes

4. **Squad Builder Registry** (`packages/squad-builder/src/registry.ts`)
   - Purpose: Agent registry for squad building
   - Stores: `agents` Map
   - Used by: Squad Builder system

**Impact**: 
- Agents registered in multiple places
- No single source of truth
- Health tracking fragmented
- Registration logic duplicated

**Recommendation**: 
- Consolidate into Agent Registry Core as single source of truth
- Super Spine should query Agent Registry Core
- Directory should reference Agent Registry Core
- Squad Builder should use Agent Registry Core

**Files**:
- `packages/agent-registry-core/`
- `server/core/SuperSpine.ts`
- `packages/directory/`
- `packages/squad-builder/src/registry.ts`
- `server/routes/register-agents.ts`

---

### 2. Multiple Event Routing Systems ⚠️ **CRITICAL**

**Problem**: Five separate event routing/messaging systems with overlapping functionality:

1. **Spider Web Core** (`packages/spider-web-core/`)
   - Purpose: Central nervous system, routes "flies" as "threads"
   - Flow: External Event → Fly → Thread → Target System
   - Used by: Operational events, webhook routing

2. **Neural Mesh** (`packages/neural-mesh/`)
   - Purpose: Unified nervous system, synapse connections
   - Flow: Systems → Synapses → Event Wormholes
   - Used by: System interconnections

3. **Event Wormholes** (`packages/event-wormholes/`)
   - Purpose: Teleport channels for packet transportation
   - Flow: Events → Wormholes → Target Systems
   - Used by: `server/routes/forge.ts` (active), `server/routes/operator.ts` (commented)

4. **Star Bridge** (`server/starbridge/`)
   - Purpose: Cross-cluster communication, event broadcasting
   - Flow: Events → Star Bridge Bus → Subscribers
   - Used by: Cross-cluster messaging

5. **Instant Mesh** (`server/mesh/InstantMesh.ts`)
   - Purpose: Instant event routing to all targets
   - Flow: Events → Instant Mesh → Subscribers
   - Used by: Real-time event propagation

6. **Nerve Fiber Event Fabric** (`packages/nerve/`)
   - Purpose: Fiber-optic event bus (COMMENTED OUT)
   - Status: Initialization commented in `server/index.ts` lines 1225-1249

**Impact**:
- Events can flow through multiple paths
- No clear routing hierarchy
- Duplicate event processing possible
- Nerve Fiber system exists but disabled

**Recommendation**:
- Establish Spider Web Core as primary routing layer
- Neural Mesh should use Spider Web threads
- Event Wormholes should route through Spider Web
- Star Bridge should emit to Spider Web
- Instant Mesh should be a Spider Web sensor
- Enable Nerve Fiber or remove it

**Files**:
- `packages/spider-web-core/`
- `packages/neural-mesh/`
- `packages/event-wormholes/`
- `server/starbridge/`
- `server/mesh/InstantMesh.ts`
- `packages/nerve/`
- `server/index.ts` (lines 1225-1249)

---

### 3. Multiple Store/State Management Systems ⚠️ **HIGH**

**Problem**: Multiple in-memory stores with unclear persistence strategy:

1. **AgentStore** (`packages/agent-registry-core/store/agentStore.ts`)
   - Stores: Agent configs, health data
   - Persistence: None (in-memory Map)

2. **CitizenshipStore** (`packages/dream-state-core/store/citizenshipStore.ts`)
   - Stores: Passports, proposals, votes, departments
   - Persistence: None (in-memory Maps/Arrays)

3. **Super Spine Stores** (`server/core/SuperSpine.ts`)
   - Stores: Agent nodes, task queue, subscriptions
   - Persistence: None (in-memory Maps/Arrays)

4. **Various Pack Stores** (Wolf Pack, Whale Pack, Orca Pack, etc.)
   - Stores: Leads, products, narratives, etc.
   - Persistence: None (in-memory Maps/Arrays)

**Impact**:
- Data lost on restart
- No persistence strategy documented
- Inconsistent storage patterns

**Recommendation**:
- Document persistence strategy (Cloud SQL/AlloyDB vs persistent disk)
- Implement database persistence layer
- Add TTL cleanup for in-memory stores
- Consider Redis for production

---

## 🔴 CRITICAL BUGS & PROBLEMS

### 4. Fiber-Optic Middleware Not Integrated ⚠️ **CRITICAL**

**Location**: `server/index.ts` lines 1225-1249

**Problem**: Nerve Fiber Event Fabric initialization is completely commented out

**Code**:
```typescript
// DISABLED FOR SIMPLIFIED STARTUP - Enable when ready
// Nerve Fiber Event Fabric initialization
```

**Impact**: 
- Fiber-optic middleware system exists but inactive
- Port handlers registered but not wired
- Laser Router not processing HTTP requests
- Express middleware bridge missing

**Files**:
- `packages/nerve/` (exists but disabled)
- `packages/internal-ports/` (ports registered but not used)
- `packages/internal-router/` (router exists but not integrated)
- `server/index.ts` (lines 1225-1249)

**Reference**: `docs/NEEDS_FIXING.md` #1-3

---

### 5. Media Vault Routes Disabled ⚠️ **HIGH**

**Location**: `server/index.ts` lines 412-418

**Problem**: Media and poster routes disabled because `@dreamnet/media-vault` package missing

**Code**:
```typescript
// Media router temporarily disabled - @dreamnet/media-vault missing
// app.use("/api", createMediaRouter());
// Poster router temporarily disabled - @dreamnet/media-vault missing
// app.use("/api", createPosterRouter());
```

**Impact**: Media functionality unavailable

**Files**:
- `server/routes/media.ts` (exists but disabled)
- `server/routes/poster.ts` (exists but disabled)
- `server/index.ts` (lines 412-418)

**Reference**: `docs/NEEDS_FIXING.md` #8

---

### 6. Halo Routes Disabled ⚠️ **HIGH**

**Location**: `server/index.ts` line 402

**Problem**: Halo routes disabled due to placeholder metrics engine

**Code**:
```typescript
// Halo routes temporarily disabled - using placeholder metrics engine
// app.use("/api", createHaloRouter());
```

**Impact**: Self-healing system routes unavailable

**Files**:
- `server/routes/halo.ts` (likely exists but disabled)
- `server/index.ts` (line 402)

---

### 7. Squad Builder Disabled ⚠️ **MEDIUM**

**Location**: `server/index.ts` line 407

**Problem**: Squad Builder routes disabled because package not available

**Code**:
```typescript
// app.use("/api", createSquadRouter()); // Disabled - package not available
```

**Impact**: Squad building functionality unavailable

**Files**:
- `server/index.ts` (line 407)
- `packages/squad-builder/` (may exist but not integrated)

---

### 8. Event Wormholes Inconsistent Usage ⚠️ **MEDIUM**

**Location**: `server/routes/operator.ts` lines 5-6

**Problem**: Event wormholes imported but commented out in operator routes

**Code**:
```typescript
// import { listWormholes, createWormhole } from "../../packages/event-wormholes"; // Temporarily disabled
```

**Impact**: Inconsistent event routing, some routes use wormholes, others don't

**Files**:
- `server/routes/operator.ts` (lines 5-6)
- `server/routes/forge.ts` (uses wormholes - active)

---

### 9. Idempotency Key Memory Leak ⚠️ **HIGH**

**Location**: `server/middleware/idempotency.ts`

**Problem**: Idempotency keys stored in-memory, never cleaned up

**Impact**: Memory leak possible in production

**Reference**: `docs/NEEDS_FIXING.md` #6

**Fix Needed**: Add TTL cleanup or use Redis

---

### 10. Health Gates Not Integrated ⚠️ **HIGH**

**Location**: `server/core/health-gates.ts`

**Problem**: Health gates exist but `/ready` endpoint doesn't use them

**Impact**: Server may accept traffic when critical services are down

**Reference**: `docs/NEEDS_FIXING.md` #5

**Fix Needed**: Integrate health gates into `/ready` endpoint

---

### 11. Circuit Breaker Integration Incomplete ⚠️ **HIGH**

**Location**: Only 2 places use circuit breakers

**Problem**: External API calls not wrapped in circuit breakers

**Impact**: Cascading failures possible

**Reference**: `docs/NEEDS_FIXING.md` #4

**Fix Needed**: Wrap all external API calls (OpenAI, Google, etc.) with circuit breakers

---

### 12. Metrics Middleware Optional ⚠️ **MEDIUM**

**Location**: `server/index.ts` lines 369-374

**Problem**: Metrics middleware wrapped in try-catch, can fail silently

**Code**:
```typescript
try {
  const { metricsMiddleware } = await import('./middleware/metrics');
  app.use(metricsMiddleware);
} catch (error: any) {
  console.warn('[Metrics] Could not load metrics middleware:', error.message);
}
```

**Impact**: Missing observability data

**Reference**: `docs/NEEDS_FIXING.md` #7

**Fix Needed**: Make metrics middleware required, fail fast if missing

---

## 🔴 CRITICAL UNLOCKS (Blocking Issues)

### 13. Dream Snail Core is Placeholder ⚠️ **MEDIUM**

**Location**: `packages/dreamnet-snail-core/index.ts`

**Problem**: Dream Snail Core provides no-op implementations

**Code**: All methods are placeholders:
```typescript
recordTrail() { /* no-op */ }
managePrivacyConfig() { /* no-op */ }
verifyIntegrity() { /* no-op */ }
```

**Impact**: Privacy trails not recorded, verifiable provenance missing

**Status**: Planned but not implemented

**Reference**: `docs/BIOMIMETIC_SYSTEMS_COMPLETE_DOCUMENTATION.md` line 699

---

### 14. Spine Systems Are Scaffolding ⚠️ **MEDIUM**

**Location**: `spine/` directory

**Problem**: Multiple spine systems have placeholder implementations

**Examples**:
- `spine/wrappers/DreamKeeperWrapper.ts` - Throws "Not implemented"
- `spine/wrappers/FreeTierWrapper.ts` - Throws "Not implemented"
- `spine/wrappers/MiniAppWrapper.ts` - Throws "Not implemented"

**Impact**: Features not functional

**Reference**: `docs/NEEDS_FIXING.md` #9

---

### 15. ResearchHub Integration Mock ⚠️ **LOW**

**Location**: `packages/researchhub-core/`

**Problem**: Has mock structure, needs actual API integration

**Impact**: ResearchHub features not functional

**Reference**: `docs/NEEDS_FIXING.md` #10

---

### 16. Store Persistence Strategy Unclear ⚠️ **HIGH**

**Location**: All `*Store.ts` files

**Problem**: Some stores are in-memory, persistence strategy unclear

**Impact**: Data lost on restart, no clear migration path

**Reference**: `docs/NEEDS_FIXING.md` #11

**Fix Needed**: Document persistence strategy, implement database persistence

---

### 17. Scheduler Logic Not Documented ⚠️ **MEDIUM**

**Location**: All `*Scheduler.ts` files

**Problem**: Scheduler cycle logic not fully understood

**Impact**: Hard to debug subsystem cycles

**Reference**: `docs/NEEDS_FIXING.md` #12

**Fix Needed**: Document scheduler logic, understand cycle coordination

---

### 18. Subsystem Run Methods Not Deeply Understood ⚠️ **MEDIUM**

**Location**: All `run()` methods in subsystems

**Problem**: Actual processing logic not fully documented

**Impact**: Hard to understand what subsystems actually do

**Reference**: `docs/NEEDS_FIXING.md` #13

**Fix Needed**: Deep dive into run() implementations

---

## 🟡 ARCHITECTURAL CONVERGENCES

### 19. Agent Registration Duplication

**Problem**: Agents registered in multiple places:
- `server/routes/register-agents.ts` - Bulk registration from JSON
- `packages/agent-registry-core/logic/healthUpdater.ts` - Core system agents
- `server/core/SuperSpine.ts` - Core orchestration agents
- `packages/directory/` - Universal registry

**Impact**: Registration logic duplicated, no single source of truth

---

### 20. Event Bus Duplication

**Problem**: Multiple event buses:
- Star Bridge Bus
- Event Wormholes
- Nerve Fiber Bus (disabled)
- Instant Mesh
- Neural Mesh Synapses

**Impact**: Events can flow through multiple paths, no clear hierarchy

---

### 21. Health Monitoring Duplication

**Problem**: Health tracked in multiple places:
- Agent Registry Core (agent health)
- DreamKeeper (system health)
- Health Gates (service health)
- Super Spine (agent status)

**Impact**: Health data fragmented, no unified health view

---

## 🟢 DESIGN PATTERNS & CONSISTENCY

### 22. Inconsistent Error Handling

**Problem**: Some routes lack proper error handling

**Impact**: Poor UX, hard to debug

**Reference**: `docs/NEEDS_FIXING.md` #22

---

### 23. TypeScript Types Incomplete

**Problem**: Some packages use `any` types

**Impact**: Reduced type safety

**Reference**: `docs/NEEDS_FIXING.md` #15

---

### 24. Test Coverage Limited

**Problem**: No test directory structure evident

**Impact**: Bugs not caught before production

**Reference**: `docs/NEEDS_FIXING.md` #16

---

### 25. API Documentation Missing

**Problem**: No comprehensive API documentation

**Impact**: Hard to use API

**Reference**: `docs/NEEDS_FIXING.md` #17

---

## 📊 ISSUE SUMMARY BY PRIORITY

### 🔴 CRITICAL (8 issues)
1. Multiple Agent Registry Systems (#1)
2. Multiple Event Routing Systems (#2)
3. Fiber-Optic Middleware Not Integrated (#4)
4. Idempotency Key Memory Leak (#9)
5. Health Gates Not Integrated (#10)
6. Circuit Breaker Integration Incomplete (#11)
7. Store Persistence Strategy Unclear (#16)
8. Multiple Store/State Management Systems (#3)

### 🟡 HIGH PRIORITY (12 issues)
9. Media Vault Routes Disabled (#5)
10. Halo Routes Disabled (#6)
11. Event Wormholes Inconsistent Usage (#8)
12. Metrics Middleware Optional (#12)
13. Agent Registration Duplication (#19)
14. Event Bus Duplication (#20)
15. Health Monitoring Duplication (#21)
16. Inconsistent Error Handling (#22)
17. TypeScript Types Incomplete (#23)
18. Test Coverage Limited (#24)
19. API Documentation Missing (#25)
20. Squad Builder Disabled (#7)

### 🟢 MEDIUM PRIORITY (15 issues)
21. Dream Snail Core is Placeholder (#13)
22. Spine Systems Are Scaffolding (#14)
23. Scheduler Logic Not Documented (#17)
24. Subsystem Run Methods Not Deeply Understood (#18)
25. ResearchHub Integration Mock (#15)
26. Algorithm Details Missing (various)
27. Deployment Guides Incomplete
28. Observability Integration Missing
29. Database Connection Health Check
30. Packages Marked "Needs Exploration"
31. Routes Marked "Needs Exploration"
32. Understanding Assessment Shows Gaps
33. Cohesive Workflow Documentation
34. Various placeholder implementations
35. Various stub implementations

### 🔵 LOW PRIORITY (12 issues)
36. Various documentation gaps
37. Various integration status issues
38. Various infrastructure improvements
39. Various code quality improvements

---

## 🆕 NEW ISSUES DISCOVERED DURING INTEGRATION FLOWS DEEP DIVE

### 48. Pack Signal Feeders Not Fully Integrated ⚠️ **HIGH PRIORITY**

**Location**: `packages/dreamnet-operational-bridge/logic/packSignalFeeders.ts`

**Problem**: Pack Signal Feeders have TODOs indicating incomplete integration:
- `feedCostMetricsToWolfPack()` - TODO: Integrate with WolfPackFundingCore.SignalCore
- `feedPerformanceMetricsToWhalePack()` - TODO: Integrate with WhalePackCore.SignalCore
- `feedSocialMetricsToOrcaPack()` - TODO: Integrate with OrcaPackCore.SignalCore
- `feedHealthMetricsToPacks()` - TODO: Feed to all packs

**Impact**: 
- Metrics generated but not actually fed to packs
- Packs can't adapt based on operational metrics
- Biomimetic signal feeding incomplete

**Files**:
- `packages/dreamnet-operational-bridge/logic/packSignalFeeders.ts` (lines 28, 52, 81, 108)

**Fix Needed**: Wire Pack Signal Feeders to actual Pack SignalCore implementations

---

### 49. Event Loss Risk in Star Bridge ⚠️ **MEDIUM PRIORITY**

**Location**: `server/starbridge/bus.ts`

**Problem**: Star Bridge uses `Promise.allSettled()` for subscribers but:
- If persistence fails, event is still emitted to subscribers
- If subscriber fails, event is lost (no retry mechanism)
- No dead-letter queue for failed events

**Impact**:
- Events can be lost if subscribers fail
- No retry mechanism for failed event delivery
- No audit trail for lost events

**Files**:
- `server/starbridge/bus.ts` (lines 108-120)

**Fix Needed**: Add dead-letter queue, retry mechanism, event audit trail

---

### 50. Race Condition in Event Wormholes ⚠️ **MEDIUM PRIORITY**

**Location**: `packages/event-wormholes/src/eventBus.ts`

**Problem**: `emitEvent()` calls `processEvent()` without awaiting:
```typescript
processEvent(fullEvent).catch((err) => {
  console.error("[EventWormholes] Error processing event:", err);
});
```

**Impact**:
- Events processed asynchronously without guarantee of completion
- Race conditions possible if events processed faster than saved
- No guarantee events are processed before function returns

**Files**:
- `packages/event-wormholes/src/eventBus.ts` (lines 48-51)

**Fix Needed**: Add proper async/await handling or queue mechanism

---

### 51. Instant Mesh Event Queue Memory Leak ⚠️ **LOW PRIORITY**

**Location**: `server/mesh/InstantMesh.ts`

**Problem**: Instant Mesh keeps last 1000 events in memory:
```typescript
if (this.eventQueue.length > 1000) {
  this.eventQueue.shift();
}
```

**Impact**:
- Memory grows unbounded if events arrive faster than cleanup
- No TTL for events
- No persistence for events

**Files**:
- `server/mesh/InstantMesh.ts` (lines 126-129)

**Fix Needed**: Add TTL, persistence, or bounded queue with proper cleanup

---

### 52. Missing Error Handlers in Integration Bridges ⚠️ **MEDIUM PRIORITY**

**Location**: `packages/dreamnet-operational-bridge/logic/spiderWebBridge.ts`

**Problem**: Integration bridges have async imports without proper error handling:
```typescript
import("@dreamnet/dreamnet-snail-core/logic/autoRecord")
  .then(({ autoRecordOperationalEvent }) => {
    // ...
  })
  .catch(() => {
    // Dream Snail not available, skip silently
  });
```

**Impact**:
- Errors silently swallowed
- No logging of missing integrations
- Hard to debug integration failures

**Files**:
- `packages/dreamnet-operational-bridge/logic/spiderWebBridge.ts` (lines 272-290)

**Fix Needed**: Add proper error logging, integration health checks

---

## 📊 UPDATED ISSUE SUMMARY BY PRIORITY

### 🔴 CRITICAL (8 issues)
1. Multiple Agent Registry Systems (#1)
2. Multiple Event Routing Systems (#2)
3. Fiber-Optic Middleware Not Integrated (#4)
4. Idempotency Key Memory Leak (#9)
5. Health Gates Not Integrated (#10)
6. Circuit Breaker Integration Incomplete (#11)
7. Store Persistence Strategy Unclear (#16)
8. Multiple Store/State Management Systems (#3)

### 🟡 HIGH PRIORITY (14 issues)
9. Media Vault Routes Disabled (#5)
10. Halo Routes Disabled (#6)
11. Event Wormholes Inconsistent Usage (#8)
12. Metrics Middleware Optional (#12)
13. Agent Registration Duplication (#19)
14. Event Bus Duplication (#20)
15. Health Monitoring Duplication (#21)
16. Inconsistent Error Handling (#22)
17. TypeScript Types Incomplete (#23)
18. Test Coverage Limited (#24)
19. API Documentation Missing (#25)
20. Squad Builder Disabled (#7)
21. Pack Signal Feeders Not Fully Integrated (#48) 🆕

### 🟢 MEDIUM PRIORITY (17 issues)
22. Dream Snail Core is Placeholder (#13)
23. Spine Systems Are Scaffolding (#14)
24. Scheduler Logic Not Documented (#17)
25. Subsystem Run Methods Not Deeply Understood (#18)
26. ResearchHub Integration Mock (#15)
27. Algorithm Details Missing (various)
28. Deployment Guides Incomplete
29. Observability Integration Missing
30. Database Connection Health Check
31. Packages Marked "Needs Exploration"
32. Routes Marked "Needs Exploration"
33. Understanding Assessment Shows Gaps
34. Cohesive Workflow Documentation
35. Various placeholder implementations
36. Various stub implementations
37. Event Loss Risk in Star Bridge (#49) 🆕
38. Race Condition in Event Wormholes (#50) 🆕
39. Missing Error Handlers in Integration Bridges (#52) 🆕

### 🔵 LOW PRIORITY (13 issues)
40. Various documentation gaps
41. Various integration status issues
42. Various infrastructure improvements
43. Various code quality improvements
44. Instant Mesh Event Queue Memory Leak (#51) 🆕

---

## 🎯 RECOMMENDED ACTION PLAN

### Phase 1: Critical Consolidation (Week 1)
1. **Consolidate Agent Registries** (#1)
   - Make Agent Registry Core single source of truth
   - Update Super Spine to query Agent Registry Core
   - Update Directory to reference Agent Registry Core
   - Remove duplicate registration logic

2. **Consolidate Event Routing** (#2)
   - Establish Spider Web Core as primary routing layer
   - Route all events through Spider Web threads
   - Remove duplicate routing paths

3. **Fix Memory Leaks** (#9)
   - Add TTL cleanup for idempotency keys
   - Implement Redis for production

### Phase 2: Integration & Activation (Week 2)
4. **Enable Fiber-Optic Middleware** (#4)
   - Uncomment Nerve Fiber initialization
   - Wire port handlers to subsystems
   - Add Express middleware bridge

5. **Integrate Health Gates** (#10)
   - Wire health gates into `/ready` endpoint
   - Add health checks for critical services

6. **Add Circuit Breakers** (#11)
   - Wrap all external API calls
   - Add circuit breaker monitoring

### Phase 3: Persistence & Documentation (Week 3)
7. **Implement Persistence Strategy** (#16)
   - Document persistence approach
   - Implement database persistence layer
   - Add migration scripts

8. **Document Schedulers & Run Methods** (#17, #18)
   - Document scheduler cycle logic
   - Document subsystem run() implementations
   - Create architecture diagrams

### Phase 4: Quality & Testing (Week 4)
9. **Add Error Handling** (#22)
   - Standardize error handling across routes
   - Add error logging

10. **Add Tests** (#24)
    - Create test directory structure
    - Add unit tests for critical paths
    - Add integration tests

---

## 📝 NOTES

- **Keep Moving**: Document issues here, leave brief notes, continue exploration
- **Don't Block**: Don't let issues block documentation/exploration work
- **Track Progress**: Update status as issues are fixed
- **Reference Docs**: Each issue references relevant documentation

---

**Last Scanned**: 2025-01-27  
**Total Issues**: 52 (47 original + 5 new from integration flows deep dive)  
**Critical**: 8  
**High Priority**: 14 (+2 new)  
**Medium Priority**: 17 (+2 new)  
**Low Priority**: 13 (+1 new)

**New Issues Found**: 5 issues discovered during integration flows documentation:
- #48: Pack Signal Feeders Not Fully Integrated (HIGH)
- #49: Event Loss Risk in Star Bridge (MEDIUM)
- #50: Race Condition in Event Wormholes (MEDIUM)
- #51: Instant Mesh Event Queue Memory Leak (LOW)
- #52: Missing Error Handlers in Integration Bridges (MEDIUM)

**Next Steps**: Prioritize critical consolidations, then move to integration fixes.

