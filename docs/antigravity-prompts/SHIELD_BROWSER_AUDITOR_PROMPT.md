# DreamNet Shield & Browser Auditor - Hardening & Integration Mission

## What We Just Did

**Repository Scan Completed:** Deep analysis of Shield Core and Browser Agent implementations revealed current state and critical security gaps.

### Key Findings:

1. **Shield Core Status:**
   - ✅ Fully implemented and operational
   - ✅ Control Core Middleware protecting 14+ routes
   - ✅ Threat detection, spikes, risk profiling all working
   - ✅ Events emitted to Event Fabric + Nerve Bus
   - ⚠️ Missing: Correlation IDs, standardized event envelopes, Spine wrapper

2. **Browser Agent Status:**
   - ✅ Lighthouse auditor implemented (`server/lighthouse-auditor.ts`)
   - ❌ **CRITICAL:** No governance middleware on routes
   - ❌ **CRITICAL:** No domain allowlist
   - ❌ **CRITICAL:** No internal IP blocking
   - ❌ **CRITICAL:** Can audit ANY URL including internal IPs (security risk)
   - ❌ No event emission
   - ❌ No risk profile updates

3. **Security Gaps Identified:**
   - Browser Agent routes unprotected (`/api/lighthouse/audit` line 1748)
   - No URL validation beyond basic `new URL()` check
   - Can access RFC1918 addresses (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
   - Can access loopback (127.0.0.1, localhost)
   - No audit logging of navigation attempts

## What We Think Should Happen Next

### Immediate Priority: Browser Agent Security Hardening

**Why Critical:** Browser Agent can be used to probe internal infrastructure, access localhost services, and bypass network security boundaries.

**Required Actions:**

1. **Domain Allowlist System** (High Priority)
   - Create `server/core/browser-agent/domainAllowlist.ts`
   - In-memory Set<string> of allowed domains
   - Default allowlist: `['dreamnet.ink', 'api.dreamnet.ink', 'vercel.app']`
   - Admin endpoints to manage allowlist
   - Check before every Lighthouse audit

2. **Internal IP Blocking** (High Priority)
   - Create `server/core/browser-agent/ipBlocking.ts`
   - DNS resolution + IP range checks
   - Block RFC1918, loopback, link-local
   - Fail-safe: If DNS fails, block by default

3. **Governance Middleware Attachment** (High Priority)
   - Wrap Lighthouse routes with `withGovernance({ clusterId: 'BROWSER_AGENT' })`
   - Add `controlCoreMiddleware` to route chain
   - Enforce tier/office/cabinet requirements
   - Track usage in risk profiles

4. **BrowserAgentWrapper Implementation** (Medium Priority)
   - Implement `spine/wrappers/BrowserAgentWrapper.ts`
   - Wrap `lighthouseAuditor.auditWebsite()`
   - Emit events: NavigationAttempted, NavigationBlocked, AuditCompleted, AuditFailed
   - Include correlation IDs
   - Delegate to domain allowlist + IP blocking

### Secondary Priority: Shield Core Spine Integration

**Why Important:** Connect existing Shield Core to Spine for unified observability and future policy enforcement.

**Required Actions:**

1. **ShieldCoreWrapper Implementation**
   - Implement `spine/wrappers/ShieldCoreWrapper.ts`
   - Wrap all Shield Core functions:
     - `detectThreat()` → emit "Security.ThreatDetected"
     - `fireSpike()` → emit "Security.MitigationApplied"
     - `updateRiskProfile()` → emit "Security.RiskProfileUpdated"
     - `setKillSwitch()` → emit "Security.KillSwitchActivated"
   - Generate correlation IDs for all operations
   - Connect to Spine Event Bus

2. **Correlation ID System**
   - Create `spine/utils/correlationId.ts`
   - Generate UUIDs for all security operations
   - Attach to all events
   - Enable traceability across systems

3. **Event Envelope Standardization**
   - Standardize event structure
   - Include: eventId, correlationId, timestamp, source, actor, target, severity, payload
   - Match Defense Event Taxonomy from Integration Map

## Your Mission: Hardening & Spine Wiring Plan

**Objective:** Design and implement security hardening for Browser Agent and Shield Core Spine integration, following the Shield–Spine Integration Map artifact.

### Phase 1: Browser Agent Hardening (IMMEDIATE)

**Tasks:**

1. **Design Domain Allowlist System**
   - Specify data structure (Set vs Map)
   - Define admin API endpoints
   - Plan persistence (in-memory first, DB later?)
   - Design default allowlist

2. **Design Internal IP Blocking**
   - Specify IP range checks (RFC1918, loopback, link-local)
   - Plan DNS resolution strategy
   - Design fail-safe behavior
   - Consider caching DNS results

3. **Design Governance Integration**
   - Specify middleware attachment points
   - Define cluster/office/cabinet requirements
   - Plan risk profile updates
   - Design audit logging

4. **Implement BrowserAgentWrapper**
   - Follow Integration Map wrapper design
   - Implement all methods from artifact
   - Connect to Spine Event Bus (when available)
   - Emit all events from Defense Event Taxonomy

### Phase 2: Shield Core Spine Integration

**Tasks:**

1. **Implement ShieldCoreWrapper**
   - Follow Integration Map wrapper design
   - Wrap all Shield Core functions
   - Generate correlation IDs
   - Emit events to Spine Event Bus

2. **Standardize Event Emission**
   - Implement event envelope format
   - Use Defense Event Taxonomy
   - Include correlation IDs
   - Connect to Spine Event Bus

3. **Integration Testing**
   - Test wrapper calls existing functions correctly
   - Test event emission
   - Test correlation ID tracking
   - Validate no behavior changes

### Phase 3: Policy Enforcement (Future)

**Tasks:**

1. **Guardrail Policy Implementation**
   - Implement policies from Guardrail Policy Spec
   - Connect to wrappers
   - Enforce decisions
   - Emit policy violation events

2. **DreamKeeper Integration**
   - Connect DreamKeeper to event bus
   - Consume security events
   - Apply policies
   - Generate alerts

## Implementation Strategy

### Browser Agent Hardening

**Approach:** Feature-flagged gradual rollout

1. **Week 1:** Implement allowlist + IP blocking (disabled by default)
2. **Week 2:** Add governance middleware (feature flag)
3. **Week 3:** Implement BrowserAgentWrapper (parallel to existing)
4. **Week 4:** Enable by default, monitor, iterate

**Risk Mitigation:**
- Feature flag: `ENABLE_BROWSER_AGENT_GOVERNANCE` (default: false)
- Fail-open initially (log warning, allow)
- Gradual tightening based on monitoring

### Shield Core Integration

**Approach:** Non-breaking wrapper pattern

1. **Week 1:** Implement ShieldCoreWrapper (calls existing functions)
2. **Week 2:** Add event emission (additive, doesn't break existing)
3. **Week 3:** Connect to Spine Event Bus (when available)
4. **Week 4:** Optional: Wire into middleware (feature flag)

**Risk Mitigation:**
- Wrapper calls existing functions - no behavior change
- Events are additive - doesn't break existing flows
- Can be disabled by not instantiating wrapper

## Deliverables Required

1. **Browser Agent Hardening Plan**
   - Domain allowlist design
   - IP blocking design
   - Governance integration plan
   - BrowserAgentWrapper implementation plan
   - Feature flag strategy
   - Rollback plan

2. **Shield Core Integration Plan**
   - ShieldCoreWrapper implementation plan
   - Event emission design
   - Correlation ID strategy
   - Integration testing plan

3. **Security Integration Strategy v1**
   - Update `docs/DREAMNET_SECURITY_OVERVIEW.md`
   - Update `docs/DREAMNET_BROWSER_GOVERNANCE.md`
   - Document hardening changes
   - Document integration approach

4. **Phase 1 Hardening Changes**
   - List specific code changes
   - File locations
   - Implementation details
   - Testing requirements

## Constraints

- **DO NOT** weaken existing security controls
- **DO NOT** break existing Lighthouse functionality
- **DO NOT** remove logging or checks
- Feature-flag all new governance
- Maintain backward compatibility

## Questions for You

1. **Priority:** Should Browser Agent hardening happen immediately, or can it wait for Spine Phase I?

2. **Scope:** Should you implement code changes or just design plans for Cursor to implement?

3. **Risk Tolerance:** Fail-open (log but allow) or fail-closed (block on uncertainty)?

4. **Timeline:** When do you need hardening complete? (Affects implementation depth)

## Artifacts Available

- **Integration Map:** Shield–Spine Integration Map artifact (provided)
- **Defense Event Taxonomy:** Defined in Integration Map
- **Guardrail Policy Spec:** Defined in Integration Map
- **Scan Report:** Repository scan findings
- **Current Code:** Shield Core and Browser Agent implementations

## Expected Output

1. **Browser Agent Hardening Plan** (detailed design + implementation steps)
2. **Shield Core Integration Plan** (wrapper design + event emission)
3. **Security Integration Strategy v1** (updated docs)
4. **Phase 1 Hardening Changes** (specific, implementable changes)
5. **Code Implementation** (if scope includes implementation)

---

**Status:** Ready to begin hardening mission. Browser Agent security gaps are critical and should be addressed immediately.

