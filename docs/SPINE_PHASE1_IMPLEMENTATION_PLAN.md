# Spine Construction Phase I Implementation Plan

**Goal:** Create the `@dreamnet/spine` package from scratch and implement core in-memory behavior for BGP, Event Bus, and Interop Registry.

## User Review Required
> [!IMPORTANT]
> This plan creates a new top-level directory `/spine/` and modifies `pnpm-workspace.yaml` and `tsconfig.json`. These are structural changes.

## Proposed Changes

### Scaffolding
#### [NEW] `/spine/` Directory Structure
- `agent-protocols/`
- `agent-interop/`
- `bgp-for-agents/`
- `dreamnet-os-linker/`
- `dreamnet-event-bus/`
- `dreamnet-mcp-bridge/`
- `wrappers/`
- `docs/`
- `tests/`

#### [NEW] `spine/package.json`
- Name: `@dreamnet/spine`
- Version: `0.0.1`
- Private: `true`

#### [NEW] `spine/tsconfig.json`
- Extends: `../tsconfig.base.json`

#### [MODIFY] `pnpm-workspace.yaml`
- Add `"spine"` to `packages` list.

#### [MODIFY] `tsconfig.json` (Root)
- Add `"spine/**/*"` to `include` array.

### Core Components (In-Memory Implementation)

#### [NEW] `spine/dreamnet-event-bus/DreamEventBus.ts`
- `publish(event)`
- `subscribe(type, handler)`
- `EventEnvelope` interface

#### [NEW] `spine/bgp-for-agents/`
- `RouteTable.ts`: `addRoute`, `removeRoute`, `findNextHop`
- `RouteAnnouncements.ts`: `announceRoute`, `withdrawRoute` (emits events)
- `RoutingStrategies.ts`: `firstMatch`, `longestPrefixMatch`

#### [NEW] `spine/agent-interop/Registry.ts`
- `registerProvider`, `getProvider`, `listProviders`
- In-memory map storage.

#### [NEW] `spine/dreamnet-os-linker/`
- `RuntimeContext.ts`: Environment, identity, capabilities.
- `CapabilitiesMap.ts`: Aggregates provider capabilities.

#### [NEW] `spine/dreamnet-mcp-bridge/ToolRegistry.ts`
- `registerTool`, `listTools`
- `SessionContext` interface.

#### [NEW] `spine/wrappers/`
- `ShieldCoreWrapper.ts`
- `BrowserAgentWrapper.ts`
- `FreeTierWrapper.ts`
- `DeploymentWrapper.ts`
- `DreamKeeperWrapper.ts`
- All wrappers emit events to the Event Bus.

## Verification Plan

### Automated Tests
1.  **Build Verification:**
    ```bash
    pnpm install --no-frozen-lockfile
    cd client && pnpm build
    ```
    *Success Criteria:* Build completes without errors.

2.  **Spine Smoke Test:**
    - Create `spine/tests/smoke-test.ts`.
    - Script will:
        - Instantiate `DreamEventBus`.
        - Register a route in `RouteTable`.
        - Announce a route (check event emission).
        - Register a provider in `Registry`.
    - Run with `npx tsx spine/tests/smoke-test.ts`.
    *Success Criteria:* Script exits with code 0 and logs success messages.

### Manual Verification
- Inspect `pnpm-lock.yaml` to ensure `@dreamnet/spine` is linked.
