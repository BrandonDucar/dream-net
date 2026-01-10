# DreamNet Security Overview

**Last Updated**: 2025-11-26  
**Version**: 1.0  
**Status**: Initial Security Audit Complete

---

## Executive Summary

DreamNet implements a multi-layered security architecture centered around **Shield Core** (defensive systems) and **Browser Agent Core** (governed browser automation). This document provides a high-level overview of security responsibilities, protections, and known limitations.

---

## 1. Shield Core Responsibilities

### 1.1 Overview

Shield Core is DreamNet's primary defensive system, implementing a biomimetic, multi-phase shield architecture with threat detection, offensive spikes, and adaptive learning.

**Location**: `packages/shield-core/`

### 1.2 Core Responsibilities

#### A. Perimeter Defense
- **Control Core Middleware**: Enforces tier-based access control, rate limiting, and feature flags
- **Threat Detection**: Identifies 10 threat types (intrusion, malware, ddos, exploit, data-exfiltration, unauthorized-access, api-abuse, spam, phishing, unknown)
- **Offensive Spikes**: Active defense mechanisms (counter-attack, honeypot, rate-limit, block, redirect, trace)

#### B. Internal Defense
- **Cellular Shields**: Per-agent/service shield protection
- **Cross-Chain Shields**: Blockchain-specific threat detection
- **Wormhole Propagation**: Shield updates distributed across cells

#### C. Data Defense
- **Risk Profiling**: Tracks caller behavior and assigns risk scores (0-1 scale)
- **Frequency Rotation**: Prevents pattern detection attacks
- **Shield Learning**: Learns from threat patterns for predictive defense

### 1.3 Shield Phases

Shield Core operates across 6 phases, each with unique frequencies and modulators:

1. **Alpha**: Base layer (1000 Hz)
2. **Beta**: Secondary layer (2000 Hz)
3. **Gamma**: Tertiary layer (3000 Hz)
4. **Delta**: Quaternary layer (4000 Hz)
5. **Epsilon**: Quinary layer (5000 Hz)
6. **Omega**: Master phase (10000 Hz)
7. **Cellular**: Per-cell shields (variable frequency)

---

## 2. Browser Agent Constraints

### 2.1 Overview

Browser Agent Core provides governed browser automation for website auditing and analysis. Currently implemented via Lighthouse Auditor.

**Location**: `server/lighthouse-auditor.ts`

### 2.2 Allowed Capabilities

#### Current Implementation (Lighthouse Auditor)
- **Website Auditing**: Performance, accessibility, SEO, best practices analysis
- **Headless Chrome**: Automated browser without GUI
- **Metrics Collection**: Core Web Vitals, Lighthouse scores, optimization opportunities

#### Explicitly NOT Allowed
- ❌ Arbitrary JavaScript execution
- ❌ Shell command execution
- ❌ File system access (beyond Chrome's normal operation)
- ❌ Network scanning
- ❌ Credential harvesting

### 2.3 Domain Allowlists / Policies

**Current Status**: ⚠️ **NOT IMPLEMENTED**

**Planned Implementation**:
- Whitelist of allowed domains
- Internal IP blocking (RFC1918, link-local, loopback)
- URL scheme validation (http/https only)
- DNS rebinding protection

**See**: `docs/DREAMNET_BROWSER_GOVERNANCE.md` for detailed policies

### 2.4 Credential-Handling Pattern

**Lighthouse Auditor**:
- ✅ No credentials used (public website auditing only)
- ✅ Runs with server process permissions
- ⚠️ Can access anything server can access (SSRF risk)

**Spider Web Core** (API integrations):
- ✅ Credentials loaded from environment variables
- ✅ Not logged or exposed in responses
- ⚠️ No credential rotation mechanism
- ⚠️ No credential expiry checks

### 2.5 Logging & Audit Expectations

**Current Status**: ⚠️ **PARTIAL**

**Implemented**:
- ✅ Control Core decisions logged to Event Fabric
- ✅ Request decisions published to Nerve Bus
- ✅ Console logging for debugging

**Not Implemented**:
- ❌ Browser action audit logging (Lighthouse visits not logged)
- ❌ Persistent audit log (in-memory only)
- ❌ External SIEM integration

**Planned**:
- Browser action events to Nerve Bus
- Persistent append-only audit log
- Caller identity correlation

---

## 3. Data Integrity Core Role

### 3.1 Overview

Data Integrity Core ensures the authenticity and integrity of data flowing through DreamNet, with a focus on on-chain verification.

**Location**: `packages/data-integrity-core/` (planned)

### 3.2 Current Implementation

**Risk Profiling** (`packages/shield-core/src/risk.ts`):
- Tracks caller risk scores (0-1 scale)
- Risk levels: low, medium, high, critical
- Factors: failures, high-risk tool usage, recent activity

**Event Fabric** (`packages/dreamnet-control-core/eventFabric.ts`):
- Immutable event stream (in-memory)
- All control decisions emitted
- Observable by monitoring systems

**Nerve Bus** (`packages/nerve/src/bus.js`):
- Central event bus for request decisions
- Publishes allow/deny/throttle events
- Includes risk scores and cost estimates

### 3.3 On-Chain Hashes (Planned)

**Future Implementation**:
- Audit log hashes stored on blockchain
- Batch verification (e.g., every 100 entries)
- Tamper-proof audit trail
- Aligns with DreamNet's blockchain focus

---

## 4. What Is Protected

### 4.1 Fully Protected

✅ **API Endpoints with Governance**:
- All routes with `withGovernance()` middleware
- Tier-based access control
- Rate limiting (dual-limit: tier + cluster)
- Office/Cabinet requirements

✅ **Shield Core Operations**:
- Threat detection and analysis
- Offensive spike firing
- Shield configuration (requires SHIELD_COMMANDER office)

✅ **Control Core**:
- Global kill switch (emergency shutdown)
- Cluster enable/disable
- Feature flag enforcement
- Policy engine evaluation

### 4.2 Partially Protected

⚠️ **Spider Web API Integrations**:
- Credentials in environment variables (not hardcoded)
- No credential rotation
- No expiry checks

⚠️ **Risk Profiles**:
- In-memory only (lost on restart)
- No persistent storage

⚠️ **Audit Logs**:
- Event Fabric and Nerve Bus in-memory
- No persistent storage
- No external SIEM integration

### 4.3 Not Protected Yet

❌ **Lighthouse Endpoints**:
- No governance middleware
- No domain allowlist
- No audit logging
- **CRITICAL SECURITY GAP**

❌ **Internal IP Ranges**:
- Lighthouse can visit internal IPs
- No RFC1918 blocking
- No link-local blocking
- **SSRF RISK**

❌ **Credential Rotation**:
- No automatic rotation
- No expiry enforcement
- No notification before expiry

---

## 5. Explicit Non-Protections

### 5.1 Out of Scope (By Design)

The following are **intentionally not protected** and are the responsibility of external systems or users:

1. **Client-Side Security**:
   - DreamNet focuses on server-side security
   - Client applications must implement their own security

2. **Physical Security**:
   - Server physical access is not in scope
   - Assumes secure hosting environment

3. **Social Engineering**:
   - User education and awareness is not in scope
   - Assumes users follow security best practices

4. **Third-Party Services**:
   - Security of external APIs (Twilio, Telegram, Twitter) is their responsibility
   - DreamNet only protects credential handling

### 5.2 Known Limitations

1. **In-Memory State**:
   - Risk profiles, rate limits, and audit logs are in-memory
   - Lost on server restart
   - Not suitable for distributed deployments (yet)

2. **Single-Server Architecture**:
   - Rate limiting is per-server
   - No distributed coordination
   - Can be bypassed with multiple servers

3. **No WAF/CDN**:
   - No DDoS protection at network layer
   - No bot detection
   - Relies on application-level rate limiting

---

## 6. Security Roadmap

### 6.1 Immediate Priorities (P0)

1. **Add Governance to Lighthouse Endpoints**
   - Implement `withGovernance()` middleware
   - Require BROWSER_OPERATOR office
   - Add aggressive rate limiting

2. **Implement Domain Allowlist**
   - Whitelist allowed domains
   - Block internal IPs
   - Validate URL schemes

3. **Add Browser Audit Logging**
   - Log all Lighthouse requests to Nerve Bus
   - Include caller identity, URL, timestamp

### 6.2 High Priority (P1)

1. **Credential Rotation**
   - API key expiry (30-90 days)
   - Spider Web credential rotation
   - Expiry notifications

2. **API Key Scoping**
   - Limit keys to specific clusters
   - Limit to specific operations
   - Least-privilege principle

3. **Persistent Audit Log**
   - Append-only storage
   - Log integrity verification
   - External SIEM integration

### 6.3 Medium Priority (P2)

1. **IP-Based Rate Limiting**
2. **Distributed Rate Limiting (Redis)**
3. **Persist Risk Profiles to Database**
4. **Threat Signature Verification**

### 6.4 Future Enhancements (P3)

1. **Blockchain-Based Audit Trail**
2. **Multi-Factor Authentication (MFA)**
3. **CDN/WAF Layer (Cloudflare)**

---

## 7. Incident Response

### 7.1 Global Kill Switch

**Purpose**: Emergency shutdown of all non-GodVault traffic

**Activation**:
```typescript
import { setGlobalKillSwitch } from '@dreamnet/dreamnet-control-core/controlCoreMiddleware';

setGlobalKillSwitch(true);  // Enable kill switch
setGlobalKillSwitch(false); // Disable kill switch
```

**Effect**:
- Blocks all API requests except GodVault
- Returns 503 Service Unavailable
- Logs all bypass attempts

### 7.2 Cluster Disable

**Purpose**: Disable specific cluster (e.g., WOLF_PACK, BROWSER_AGENT)

**Configuration**: `packages/dreamnet-control-core/clusters.ts`

```typescript
export const CLUSTERS: Record<ClusterId, ClusterConfig> = {
  BROWSER_AGENT: {
    enabled: false,  // Disable cluster
    // ... other config
  },
};
```

### 7.3 Threat Response

**Automatic**:
- Critical/extreme threats → counter-attack spike
- High threats → block spike
- Medium threats → rate-limit spike (if suspicious type)
- Low threats → trace spike (logging only)

**Manual**:
```typescript
import { ShieldCore } from '@dreamnet/shield-core';

// Detect threat
const threat = ShieldCore.detectThreat('intrusion', 'critical', '192.168.1.100', 'api-endpoint');

// Fire spike
const spike = ShieldCore.fireSpikeAtThreat(threat);

// Block threat
ShieldCore.blockThreat(threat.id);
```

---

## 8. Compliance & Auditing

### 8.1 Audit Trail

**Current**:
- Event Fabric (in-memory)
- Nerve Bus (in-memory)
- Console logs

**Planned**:
- Persistent append-only log
- External SIEM integration
- Blockchain-based verification

### 8.2 Data Retention

**Current**: No formal retention policy (in-memory only)

**Recommended**:
- Audit logs: 90 days minimum
- Risk profiles: 90 days
- Threat history: 365 days
- Shield metrics: 30 days

### 8.3 Access Control

**Tiers**: FREE, PRO, PREMIUM, GOD_MODE

**Offices** (DreamState governance):
- FOUNDER
- SHIELD_COMMANDER
- BROWSER_OPERATOR (planned)

**Cabinets**:
- SHIELD_CABINET

---

## 9. Contact & Escalation

**Security Issues**: Report to GodVault administrators

**Emergency**: Use Global Kill Switch

**Questions**: See `docs/DREAMNET_BROWSER_GOVERNANCE.md` for browser-specific policies

---

## 10. Spine Integration & Future Architecture

### 10.1 Interop Spine Architecture

DreamNet is evolving towards a **Spine-based architecture** where core systems (Shield, Browser, Agent Registry) sit on top of a unified interoperability layer.

**Key Components**:
1.  **Wrappers**: Standardized interfaces for each core system (e.g., `ShieldCoreWrapper`, `BrowserAgentWrapper`).
2.  **Event Bus**: Central nervous system for all security and operational events.
3.  **DreamKeeper**: Future policy engine and governance enforcer.

### 10.2 Event-Driven Security

Security will transition from direct function calls to an **event-driven model**:

1.  **Emission**: Systems emit standardized events (e.g., `Security.ThreatDetected`, `Browser.NavigationBlocked`).
2.  **Routing**: The Event Bus routes events to subscribers (Audit Log, Monitoring, DreamKeeper).
3.  **Reaction**: Subscribers react to events (e.g., DreamKeeper blocks an agent based on a threat event).

**Event Taxonomy**:
-   **Security Events**: `Security.*` (Threats, Spikes, Risk)
-   **Browser Events**: `Browser.*` (Navigation, Audits, Policy)
-   **Agent Events**: `Agent.*` (Lifecycle, Governance)

### 10.3 Integration Roadmap

1.  **Phase 1 (Design)**: Define wrappers and event taxonomy (Complete).
2.  **Phase 2 (Wrappers)**: Implement wrappers alongside existing code (No runtime impact).
3.  **Phase 3 (Wiring)**: Wire wrappers into the request flow (Feature flagged).
4.  **Phase 4 (Migration)**: Full migration to Spine-based architecture.

---

**End of DreamNet Security Overview**
