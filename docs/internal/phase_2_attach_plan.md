# Phase 2 Attach Plan - Spine Integration

**Date:** 2025-11-27
**Status:** Ready for Execution
**Prerequisite:** Spine Scaffolding (✅ Complete)

## Overview
Connect the stubbed Spine wrappers to their actual subsystems.

## Sequence

### 1. Browser Agent (Low Risk)
**Target:** `spine/wrappers/BrowserAgentWrapper.ts`
**Action:**
1. Import `LighthouseAuditor` from `server/lighthouse-auditor.ts`.
2. Implement `auditUrl(url)` method in wrapper.
3. Call `LighthouseAuditor.auditWebsite(url)`.
4. Publish `AUDIT_COMPLETE` event.

### 2. Deployment Core (Low Risk)
**Target:** `spine/wrappers/DeploymentWrapper.ts`
**Action:**
1. Import `getDeploymentManager` from `packages/deployment-core`.
2. Implement `deploy(config)` method.
3. Call `manager.deploy()`.
4. Publish `DEPLOYMENT_COMPLETE` event.

### 3. DreamKeeper (Low Risk)
**Target:** `spine/wrappers/DreamKeeperWrapper.ts`
**Action:**
1. Import `DreamKeeperAgent` from `server/core/agents/dreamkeeper.ts`.
2. Implement `runHealthCheck()`.
3. Call `DreamKeeperAgent.run()`.
4. Publish `HEALTH_CHECK` event.

### 4. Shield Core (Medium Risk)
**Target:** `spine/wrappers/ShieldCoreWrapper.ts`
**Action:**
1. Import `ShieldCore` (or relevant logic from `control-core`).
2. Implement `evaluate(req)` method.
3. **CRITICAL:** Do not modify `controlCoreMiddleware` yet. Just implement the wrapper logic.

## Feature Flag Strategy
- Use `useSpineWrapper` flag in `server/config`.
- If true, routes use Wrapper.
- If false, routes use direct Core calls.

## Rollback Plan
- Revert to `useSpineWrapper = false`.
- Wrappers are separate files; they don't pollute Core logic.
