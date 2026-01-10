# Registry-Spine Dependency Report

**Date:** 2025-11-27
**Scope:** Import analysis and circular dependency risk

## Executive Summary

✅ **Current State: SAFE**
- Spine wrappers are stubs.
- They import `DreamEventBus` but **DO NOT** import any Core packages yet.
- Zero circular dependencies exist.

⚠️ **Phase 2 Risk: HIGH**
- Connecting wrappers to cores introduces circular dependency risks.

## 1. Import Graph

### Current (Safe)
```
spine/wrappers/ShieldCoreWrapper.ts
  └─> spine/dreamnet-event-bus/DreamEventBus.ts
```

### Planned (Safe)
```
spine/wrappers/ShieldCoreWrapper.ts
  ├─> spine/dreamnet-event-bus/DreamEventBus.ts
  └─> packages/shield-core (or control-core)
```

### Forbidden (Dangerous)
```
packages/shield-core/index.ts
  └─> spine/wrappers/ShieldCoreWrapper.ts  ❌ CYCLE!
```

## 2. Integration Rules

1.  **One-Way Flow:** Wrappers import Cores. Cores **NEVER** import Wrappers.
2.  **Injection:** If a Core needs to emit events, pass the Event Bus (or Wrapper) as a dependency at runtime/initialization. Do not statically import it.
3.  **Middleware:** Spine wrappers should wrap middleware, not be imported *by* middleware.

## 3. Risk Assessment

| Integration Point | Risk Level | Mitigation |
|-------------------|------------|------------|
| **Shield Core** | Medium | Use dependency injection in `controlCoreMiddleware`. |
| **Browser Agent** | Low | `LighthouseAuditor` is a leaf node; easy to wrap. |
| **Deployment** | Low | `DeploymentManager` is a leaf node; easy to wrap. |
| **DreamKeeper** | Low | Agent is standalone; easy to wrap. |

## 4. Safe Attachment Points

- **Server Initialization (`server/index.ts`):** Safe to import both Spine and Cores here to wire them together.
- **Route Handlers:** Safe to use Wrappers inside route handlers (instead of raw Cores).
