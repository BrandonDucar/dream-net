# DreamNet Cartographer - Registry & Spine Mapping Mission

## What We Just Did

**Repository Scan Completed:** Comprehensive analysis revealed current state of agents, registries, subsystems, and Spine scaffolding.

### Key Findings:

1. **Spine Status:** ✅ **Phase I COMPLETE**
   - ✅ Event Bus implemented (`spine/dreamnet-event-bus/DreamEventBus.ts`)
   - ✅ ShieldCoreWrapper implemented and connected (`spine/wrappers/ShieldCoreWrapper.ts`)
   - ✅ BrowserAgentWrapper implemented and connected (`spine/wrappers/BrowserAgentWrapper.ts`)
   - ✅ DeploymentWrapper implemented and connected (`spine/wrappers/DeploymentWrapper.ts`)
   - ✅ Event Bus initialized globally in `server/index.ts`
   - ✅ All wrappers emit events with correlation IDs
   - ⚠️ RouteTable and Agent Interop Registry still stubs (Phase II)

2. **Existing Agent Registries:**
   - `server/core/SuperSpine.ts` - Agent node registry (lines 73-312)
   - `server/gpt-agents/GPTAgentRegistry.ts` - GPT agent registry
   - `packages/agent-registry-core/` - Core registry package
   - Multiple agent systems scattered across packages/

3. **Shield Core Entry Points:**
   - `packages/dreamnet-control-core/controlCoreMiddleware.ts` - Main middleware (lines 115-669)
   - `packages/shield-core/logic/threatDetector.ts` - Threat detection
   - `packages/shield-core/logic/offensiveSpike.ts` - Spike firing
   - `packages/shield-core/src/risk.ts` - Risk profiling
   - ✅ `spine/wrappers/ShieldCoreWrapper.ts` - Wrapper with Event Bus integration
   - Used by 14+ route files via `withGovernance()`
   - ✅ All Shield operations emit events to Event Bus

4. **Browser Agent Entry Points:**
   - `server/lighthouse-auditor.ts` - Lighthouse auditor (lines 60-116)
   - `server/routes.ts:1748` - `/api/lighthouse/audit` route
   - ✅ `spine/wrappers/BrowserAgentWrapper.ts` - Wrapper with Event Bus integration
   - ✅ `server/core/browser-agent/domainAllowlist.ts` - Domain allowlist system
   - ✅ `server/core/browser-agent/ipBlocking.ts` - Internal IP blocking
   - ✅ Governance middleware attached to routes
   - ✅ All audits emit events to Event Bus

5. **Deployment Core:**
   - `packages/deployment-core/` - Multi-provider deployment
   - Vercel, Cloud Run, Railway integrations
   - ✅ `spine/wrappers/DeploymentWrapper.ts` - Wrapper with Event Bus integration
   - ✅ All deployments emit events to Event Bus

6. **19 New Integration Packages:**
   - All packages created in `packages/*/`
   - All integrated into DreamNet OS (`server/core/dreamnet-os.ts`)
   - All initialized in `server/index.ts` → `initOptionalSubsystems`
   - Available via `dreamNetOS.packageName` throughout system
   - See `docs/ALL_INTEGRATIONS_COMPLETE.md` for full list

## What We Think Should Happen Next

### Your Mission: Registry-Spine Topology Map

**Objective:** Map all existing agents, registries, and subsystems to show where Spine wrappers will attach.

**Deliverables Needed:**

1. **Registry-Spine Topology Map**
   - Which agents exist and where (SuperSpine, GPTAgentRegistry, etc.)
   - Which subsystems they belong to (Shield, Browser Agent, Deployment, etc.)
   - Where Spine wrappers intend to attach
   - Current vs. planned architecture diagram

2. **Spine Alignment Table**
   - For each subsystem (ShieldCore, BrowserAgentCore, FreeTierGovernor, DeploymentCore):
     - Current entry points (files/functions)
     - Intended Spine wrapper (`ShieldCoreWrapper`, `BrowserAgentWrapper`, etc.)
     - Missing links or mismatches
     - Integration complexity (Low/Medium/High)

3. **Registry-Spine Dependency Report**
   - SAFE points to attach Spine later (no cycles, clear boundaries)
   - RED zones where attaching would cause cycles or confusion
   - Import dependency graph
   - Risk assessment for each integration point

4. **Phase 2 Attach Plan**
   - List 3-5 low-risk, high-value attachment points
   - Sequence for gradual integration
   - Feature flag strategy
   - Rollback plan

## Specific Areas to Map

### 1. Agent Registry Landscape

**Current Registries Found:**
- `SuperSpine` - Agent node registry with access control
- `GPTAgentRegistry` - GPT agent management
- `AgentRegistryCore` - Core registry package
- Various agent systems in `packages/*`

**Questions:**
- How do these relate to Spine's `AgentInteropRegistry`?
- Should Spine registry replace or wrap existing registries?
- What's the migration path?

### 2. Shield Core Integration Points

**Current Flow:**
```
HTTP Request → identityResolverMiddleware → withGovernance() → controlCoreMiddleware → Route Handler
```

**Planned Flow (from Integration Map):**
```
HTTP Request → identityResolverMiddleware → withGovernance() → controlCoreMiddleware → ShieldCoreWrapper.checkRequest() → Route Handler
```

**Questions:**
- Where exactly should ShieldCoreWrapper attach?
- Should it wrap middleware or sit between middleware and handler?
- How to avoid double governance checks?

### 3. Browser Agent Integration Points

**Current Flow:**
```
HTTP Request → Route Handler → lighthouseAuditor.auditWebsite(url)
```

**Planned Flow:**
```
HTTP Request → withGovernance() → controlCoreMiddleware → Route Handler → BrowserAgentWrapper.auditWebsite() → lighthouseAuditor.auditWebsite()
```

**Questions:**
- Where should domain allowlist check happen?
- Should governance be on route or inside wrapper?
- How to handle Spider Web API integrations separately?

### 4. Deployment Core Integration

**Current State:**
- `packages/deployment-core/` exists
- Multi-provider support (Vercel, Cloud Run, Railway)
- Not connected to Spine yet

**Questions:**
- How should DeploymentWrapper attach?
- Should it wrap deployment functions or API routes?
- What events should deployments emit?

## Your Tasks

1. **Scan & Document:**
   - Map all agent registries and their purposes
   - Map all subsystem entry points
   - Identify wrapper attachment points
   - Document current vs. planned architecture

2. **Dependency Analysis:**
   - Build import dependency graph
   - Identify circular dependency risks
   - Find safe integration boundaries
   - Flag risky attachment points

3. **Alignment Table:**
   - For each subsystem, show:
     - Current implementation location
     - Planned wrapper location
     - Integration approach
     - Risk level

4. **Phase 2 Plan:**
   - Prioritize integration points
   - Sequence implementation
   - Define feature flag strategy
   - Plan rollback procedures

## Constraints

- **DO NOT** modify runtime code yet
- **DO NOT** import Spine into client/server yet
- This is mapping and planning only
- Focus on safe integration paths

## Artifacts to Reference

- **Integration Map:** Shield–Spine Integration Map artifact (provided)
- **Scan Report:** Repository scan findings
- **Spine Scaffolding:** `/spine/` directory structure
- **Existing Code:** Shield Core, Browser Agent, Deployment Core implementations

## Questions for You

1. **Scope:** Should you map ALL agents/registries or focus on Shield + Browser + Deployment first?

2. **Detail Level:** How deep should dependency analysis go? (File-level? Function-level?)

3. **Timeline:** When do you need Phase 2 Attach Plan ready? (Affects depth of analysis)

## Expected Output

1. **Registry-Spine Topology Map** (markdown + ASCII diagram)
2. **Spine Alignment Table** (structured table)
3. **Registry-Spine Dependency Report** (with risk ratings)
4. **Phase 2 Attach Plan** (prioritized, sequenced)
5. **Updated Documentation:**
   - `docs/AGENT_REGISTRY_OVERVIEW.md`
   - `docs/SPINE_OVERVIEW.md`
   - `docs/DEPLOYMENT_CORE_OVERVIEW.md` (if needed)

---

**Status:** Ready to begin mapping mission. Awaiting your confirmation on scope and priorities.

