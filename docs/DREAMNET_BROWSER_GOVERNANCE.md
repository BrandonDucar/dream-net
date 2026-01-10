# DreamNet Browser Governance

**Last Updated**: 2025-11-26  
**Version**: 1.0  
**Status**: Initial Policy Definition

---

## 1. Governance Philosophy

Browser automation in DreamNet is treated as a **high-risk capability** equivalent to executing arbitrary code. It must be strictly governed, monitored, and restricted to specific, authorized missions.

**Core Principles**:
1.  **Zero Trust**: No browser action is trusted by default. Every request must be authenticated, authorized, and validated.
2.  **Least Privilege**: Agents only get access to the specific domains and actions required for their mission.
3.  **Total Observability**: Every URL visited, action taken, and resource consumed must be logged and auditable.
4.  **Defense in Depth**: Multiple layers of protection (middleware, allowlists, sandbox, network) ensure security even if one layer fails.

---

## 2. Allowed Use Cases

The **ONLY** authorized use cases for browser automation (Lighthouse Auditor) are:

1.  **Website Performance Auditing**: Analyzing public websites for performance, accessibility, and SEO metrics.
2.  **DreamNet Ecosystem Validation**: Verifying the health and status of DreamNet-hosted properties (e.g., `dreamnet.ink`).
3.  **Public Data Verification**: Verifying public data on authorized domains (e.g., GitHub, Twitter/X for sentiment analysis - *future*).

**Explicitly Prohibited**:
-   ❌ Accessing internal networks (Intranet, VPN, Localhost).
-   ❌ Accessing cloud metadata services (AWS/GCP/Azure instance metadata).
-   ❌ Credential harvesting or phishing.
-   ❌ Automated interaction (clicking, typing) on unauthorized domains.
-   ❌ Downloading files or executing downloaded content.

---

## 3. Domain Allowlist Policy

All browser automation MUST enforce a strict domain allowlist.

### 3.1 Blocked Categories (Global Deny)

The following are **ALWAYS BLOCKED** at the network and application level:

*   **RFC1918 Private Ranges**: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`
*   **Loopback**: `127.0.0.0/8`, `::1`
*   **Link-Local**: `169.254.0.0/16`, `fe80::/10`
*   **Cloud Metadata**: `169.254.169.254` (AWS/GCP/Azure)
*   **Internal DNS**: `*.local`, `*.internal`, `*.dreamnet-internal`

### 3.2 Allowed Domains (Whitelist)

Access is restricted to the following domains (and their subdomains):

*   `dreamnet.ink` (Official DreamNet domain)
*   `github.com` (Code repositories)
*   `twitter.com` / `x.com` (Social sentiment)
*   `vercel.app` (Deployments)
*   `google.com` (Search verification)
*   `example.com` (Testing)

*Any domain not explicitly on the allowlist is **DENIED** by default.*

---

## 4. Operational Guardrails

### 4.1 Authentication & Authorization

*   **Middleware**: All browser endpoints MUST use `withGovernance()` middleware.
*   **Cluster**: Must target `BROWSER_AGENT` cluster.
*   **Office**: Caller must hold `BROWSER_OPERATOR` or `SHIELD_COMMANDER` office.
*   **Tier**: Caller must be `PRO` tier or higher (no `FREE` tier access to browser).

### 4.2 Resource Limits

To prevent resource exhaustion (DoS):

*   **Concurrency**: Max **3** concurrent Chrome instances per server.
*   **Timeout**: Hard timeout of **30 seconds** per audit.
*   **Rate Limit**:
    *   `PRO`: 5 requests / minute
    *   `PREMIUM`: 20 requests / minute
    *   `GOD_MODE`: 100 requests / minute

### 4.3 Sandbox & Isolation

*   **Containerization**: Browser MUST run in an isolated container (Docker).
*   **User**: Browser process MUST run as a non-root user (`lighthouse` or `chrome`).
*   **Sandbox**: Chrome sandbox SHOULD be enabled (`--no-sandbox` is discouraged and requires documented exception).
*   **Network**: Container network access SHOULD be restricted to outbound HTTP/HTTPS only (no inbound).

---

## 5. Audit & Logging Requirements

Every browser session must generate an immutable audit trail event published to the **Nerve Bus**.

**Required Log Fields**:
*   `traceId`: Unique request identifier.
*   `callerId`: Identity of the agent/user initiating the request.
*   `missionId`: (Optional) ID of the high-level mission.
*   `targetUrl`: The exact URL requested.
*   `resolvedIp`: The IP address the URL resolved to (for DNS rebinding checks).
*   `timestamp`: Start and end time.
*   `status`: `SUCCESS`, `FAILURE`, or `BLOCKED`.
*   `riskScore`: Calculated risk of the operation.

---

## 6. Incident Response

### 6.1 Violation Handling

If a request violates governance policies (e.g., blocked domain, internal IP):

1.  **Block**: The request is immediately blocked.
2.  **Log**: A `SECURITY_VIOLATION` event is logged to Nerve Bus.
3.  **Spike**: Shield Core may fire a `block` or `rate-limit` spike against the caller.
4.  **Risk Score**: Caller's risk score is increased (+0.2).

### 6.2 Emergency Shutdown

In case of a browser-based exploit or runaway automation:

1.  **Cluster Disable**: Disable `BROWSER_AGENT` cluster in Control Core.
    *   *Effect*: All new browser requests are rejected (503).
2.  **Global Kill Switch**: Enable Global Kill Switch if threat is systemic.
    *   *Effect*: All API traffic stopped.

---

## 7. Configuration Management

Governance policies are defined in code and configuration, NOT dynamically adjustable by agents.

*   **Allowlists**: Stored in `server/config/browser-allowlist.json` (or similar).
*   **Middleware**: Hardcoded in `server/routes.ts`.
*   **Changes**: Require code review and deployment (no runtime updates by agents).

---

## 8. Spine Integration

### 8.1 BrowserAgentWrapper

The **BrowserAgentWrapper** (`/spine/wrappers/BrowserAgentWrapper.ts`) serves as the single governed entry point for all browser automation.

**Responsibilities**:
1.  **Intercept**: Intercepts all calls to `lighthouseAuditor`.
2.  **Validate**: Enforces domain allowlist and internal IP blocking.
3.  **Emit**: Emits standardized events to the Event Bus.
4.  **Execute**: Calls the underlying browser agent if validation passes.

### 8.2 Event Emission

All browser actions emit events to the **DreamNet Event Bus**:

*   `Browser.NavigationAttempted`: Before any check.
*   `Browser.NavigationAllowed`: After allowlist pass.
*   `Browser.NavigationBlocked`: If blocked (Critical).
*   `Browser.AuditCompleted`: On success.
*   `Browser.AuditFailed`: On failure.

### 8.3 Local vs. Spine Governance

*   **Local Logic** (`server/lighthouse-auditor.ts`):
    *   Handles Chrome launching, Lighthouse execution, and metric parsing.
    *   *Should not contain complex policy logic.*

*   **Spine Governance** (`wrappers/BrowserAgentWrapper.ts`):
    *   Handles allowlists, policy enforcement, and audit logging.
    *   *Source of truth for security.*

---

**End of Browser Governance Policy**
