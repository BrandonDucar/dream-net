# Agent Registry Standard: The Sovereign Metadata Schema

To ensure scalability, security, and interoperability across the DreamNet Agent Empire, all agents must adhere to the following metadata and health check standard.

## 1. Metadata Schema (`agent.json`)

Every agent directory must contain an `agent.json` file at its root.

```json
{
  "id": "agent.handle.v1",
  "name": "Display Name",
  "owner": "team/organ-name",
  "capabilities": ["capability.one", "capability.two"],
  "inputs": {
    "param1": "type",
    "param2": "type"
  },
  "outputs": {
    "result": "type"
  },
  "trust_level": "sandbox | internal | partner | public",
  "risk_notes": "Security/Privacy considerations",
  "resources": {
    "secrets": ["REQUIRED_ENV_VAR"],
    "scopes": ["external.api.scope"]
  },
  "healthcheck": "https://.../health",
  "version": "1.0.0",
  "changelog": "Brief history of changes",
  "tags": ["social", "infra", "experimental", "stable"],
  "docs": "Relative or absolute link to documentation"
}
```

### Trust Tiers

- **sandbox**: No external side effects. Safe for untrusted execution.
- **internal**: Restricted to intra-DreamNet communication.
- **partner**: Vetted for third-party collaboration.
- **public**: Hardened for sovereign interaction on the open web.

## 2. Health Check Protocol

Agents must expose the following HTTP endpoints (or Nerve Bus equivalents):

- **Liveness (`GET /health/live`)**: Returns `200 OK` with basic versioning.

  ```json
  { "status": "live", "version": "1.0.0", "uptime": 12345 }
  ```

- **Readiness (`GET /health/ready`)**: Verifies internal dependencies (DB, Redis, API Keys).

  ```json
  { "status": "ready", "deps": { "memory": "ok", "mesh": "ok" } }
  ```

- **Canary (`POST /health/canary`)**: Performs a non-destructive end-to-end task.

  ```json
  { "ok": true, "latency_ms": 42 }
  ```

## 3. Versioning (SemVer)

- **MAJOR**: Breaking changes (API changes, required config updates).
- **MINOR**: New capabilities, backward-compatible.
- **PATCH**: Bugfixes and stability improvements.

## 4. Lifecycle Tags

- `stable`: Production-ready.
- `experimental`: Active development, high volatility.
- `deprecated`: Planned for removal.

---
*Standardized 2026-02-04 | Antigravity Orchestrator*
