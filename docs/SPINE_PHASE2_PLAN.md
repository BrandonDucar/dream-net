# Spine Construction Phase II Plan

**Date:** 2025-11-28
**Status:** Planning
**Prerequisite:** Phase I Complete (Event Bus + Wrappers)

## Goal
Implement the core routing and registry logic for the Interop Spine.

## 1. BGP-for-Agents (RouteTable)

**Location:** `spine/bgp-for-agents/`

### Components
- **`RouteTable.ts`**: In-memory storage of routes.
    - `addRoute(prefix, nextHop, metric)`
    - `removeRoute(prefix)`
    - `findBestRoute(destination)`
- **`RouteAnnouncements.ts`**: Logic for broadcasting route changes.
    - Emits `ROUTE_ANNOUNCED` / `ROUTE_WITHDRAWN` events.
- **`RoutingStrategies.ts`**:
    - `LongestPrefixMatch`: Standard BGP-style matching.
    - `LowestMetric`: For load balancing/cost optimization.

### Integration
- **Wrappers** will register themselves as "Next Hops" in the RouteTable.
- **Example:** `ShieldCoreWrapper` announces route `system.security.*`.

## 2. Agent Interop Registry

**Location:** `spine/agent-interop/`

### Components
- **`Registry.ts`**: Central directory of active agents and their capabilities.
    - `registerAgent(id, capabilities, endpoint)`
    - `lookupAgent(id)`
    - `findAgentsByCapability(capability)`
- **`CapabilityMap.ts`**: Index of `Capability -> Agent[]`.

### Integration
- **SuperSpine** will sync its agent list to this Registry.
- **GPTAgentRegistry** (when found/created) will sync here.

## 3. Implementation Steps

1.  **Implement `RouteTable`:** Basic CRUD + Best Path selection.
2.  **Implement `Registry`:** Basic Map-based storage.
3.  **Connect Wrappers:** Update existing wrappers to *register* themselves on startup.
4.  **Verify Routing:** Test that a message sent to `system.security.threat` is routed to `ShieldCoreWrapper`.

## Success Criteria
- [ ] `RouteTable` can store and retrieve routes.
- [ ] `Registry` can store and retrieve agent metadata.
- [ ] Wrappers automatically register routes on initialization.
- [ ] Event Bus successfully carries cross-agent messages via routes.
