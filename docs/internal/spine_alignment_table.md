# Spine Alignment Table

**Date:** 2025-11-27
**Status:** Scaffolding Verified

## Purpose
Maps existing DreamNet subsystems to their **scaffolded** Spine wrappers.

## Alignment Matrix

| Subsystem | Current Entry Point | Spine Wrapper | Status | Integration Complexity |
|-----------|---------------------|---------------|--------|------------------------|
| **Shield Core** | `controlCoreMiddleware.ts` | `ShieldCoreWrapper.ts` | 🟡 Stubbed | Medium (Middleware integration) |
| **Browser Agent** | `lighthouse-auditor.ts` | `BrowserAgentWrapper.ts` | 🟡 Stubbed | Low (Direct function wrap) |
| **Deployment Core** | `getDeploymentManager()` | `DeploymentWrapper.ts` | 🟡 Stubbed | Low (Direct function wrap) |
| **DreamKeeper** | `DreamKeeperAgent.run()` | `DreamKeeperWrapper.ts` | 🟡 Stubbed | Low (Event publishing) |
| **Free Tier** | `DreamNetCostCore` | `FreeTierWrapper.ts` | 🟡 Stubbed | High (Unwired subsystem) |
| **Mini Apps** | *Unknown* | `MiniAppWrapper.ts` | 🟡 Stubbed | Unknown |

## Detailed Analysis

### 1. Shield Core
- **Current:** Middleware in `packages/dreamnet-control-core`.
- **Wrapper:** `ShieldCoreWrapper` currently only emits `SECURITY_THREAT_EVALUATED`.
- **Plan:** Update wrapper to call `ShieldCore.evaluate()`, then inject wrapper into middleware.

### 2. Browser Agent
- **Current:** `LighthouseAuditor` class in `server/lighthouse-auditor.ts`.
- **Wrapper:** `BrowserAgentWrapper` exists.
- **Plan:** Wrapper should accept URL, call `LighthouseAuditor`, and emit `AUDIT_COMPLETE` event.

### 3. Deployment Core
- **Current:** `DeploymentManager` in `packages/deployment-core`.
- **Wrapper:** `DeploymentWrapper` exists.
- **Plan:** Wrapper calls `deploy()`, emits `DEPLOYMENT_STARTED` and `DEPLOYMENT_COMPLETE`.

### 4. DreamKeeper
- **Current:** Standalone agent.
- **Wrapper:** `DreamKeeperWrapper` exists.
- **Plan:** Wrapper runs health checks and emits `HEALTH_CHECK_RESULT`.

## Missing Links

1.  **GPTAgentRegistry:** Referenced in plans but missing from codebase.
2.  **Cost Governor:** Free Tier Governor is unwired; `FreeTierWrapper` needs a working subsystem to wrap.
