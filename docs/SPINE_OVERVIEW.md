# DreamNet Interop Spine Overview

**Status:** ✅ **Phase I Complete** (Event Bus + Wrappers)
**Last Updated:** 2025-11-28

## Introduction

The **Interop Spine** is DreamNet's central nervous system. Phase I construction is complete, establishing the Event Bus and core wrappers.

> [!NOTE]
> **Current State:**
> - **Event Bus:** Active (`dreamnet-event-bus`)
> - **Wrappers:** Integrated (`ShieldCore`, `BrowserAgent`, `DeploymentCore`)
> - **Scaffolding:** Ready for Phase II (RouteTable, Registry)

## New Integration Packages

The following 19 packages have been integrated into the DreamNet ecosystem to support the Spine:

1.  `dreamnet-alerts-core`
2.  `dreamnet-audit-core`
3.  `dreamnet-autoscale-core`
4.  `dreamnet-bridge`
5.  `dreamnet-control-core`
6.  `dreamnet-cost-core`
7.  `dreamnet-cost-economic-bridge`
8.  `dreamnet-health-core`
9.  `dreamnet-identity-passport-bridge`
10. `dreamnet-incident-core`
11. `dreamnet-metrics-core`
12. `dreamnet-operational-bridge`
13. `dreamnet-os-core`
14. `dreamnet-rbac-core`
15. `dreamnet-scheduler-core`
16. `dreamnet-shield-health-bridge`
17. `dreamnet-snail-core`
18. `dreamnet-vercel-agent`
19. `dreamnet-voice-twilio`

## Architecture Vision

[... rest of file ...]

### Core Components

```
┌─────────────────────────────────────────────┐
│           Interop Spine                     │
│  ┌─────────────────────────────────────┐   │
│  │        Event Bus (Pub/Sub)          │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │    BGP-for-Agents (Routing)         │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │      Agent Interop Registry         │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │         OS Linker (Hooks)           │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │         MCP Bridge                  │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
         │
         ├─> Wrappers
         │   ├─> AgentRegistryWrapper (SuperSpine)
         │   ├─> DeploymentWrapper (Deployment Core)
         │   ├─> ShieldWrapper (Shield Core)
         │   ├─> CostGovernorWrapper (Cost Core)
         │   └─> DreamKeeperWrapper (DreamKeeper)
         │
         └─> Subsystems
             ├─> SuperSpine
             ├─> Agent Registry Core
             ├─> Deployment Core
             ├─> Shield Core
             └─> Cost Governor
```

## Planned Components

### 1. Event Bus
**Purpose:** Pub/sub messaging between agents and subsystems.

**Example:**
```typescript
// Publish
spine.publish('deployment.complete', {
  platform: 'vercel',
  url: 'https://app.vercel.app'
});

// Subscribe
spine.on('deployment.complete', (event) => {
  console.log(`Deployed to ${event.url}`);
});
```

### 2. BGP-for-Agents
**Purpose:** Dynamic routing and service discovery.

**Example:**
```typescript
// Register a service
spine.registerService('deployment', {
  handler: deploymentManager,
  priority: 10
});

// Route a request
const service = spine.route('deployment');
await service.deploy(config);
```

### 3. Agent Interop Registry
**Purpose:** Unified registry combining SuperSpine and Agent Registry Core.

**Example:**
```typescript
// Query agents
const agents = spine.registry.findAgents({ capability: 'code' });
// Returns: [LUCID, CANVAS, ROOT, CRADLE]
```

### 4. OS Linker
**Purpose:** Hooks into DreamNet OS lifecycle events.

**Example:**
```typescript
spine.onBoot(() => {
  console.log('DreamNet OS booting...');
});

spine.onShutdown(() => {
  console.log('Graceful shutdown...');
});
```

### 5. MCP Bridge
**Purpose:** Integration with Model Context Protocol for AI agents.

**Example:**
```typescript
// Expose DreamNet tools to MCP
spine.mcp.registerTool('deploy', {
  description: 'Deploy to a platform',
  handler: deploymentManager.deploy
});
```

## Wrapper Pattern

Wrappers sit between the Spine and existing subsystems, providing a clean integration layer.

### Example: Deployment Wrapper

```typescript
// packages/spine/wrappers/DeploymentWrapper.ts
import { getDeploymentManager } from '@dreamnet/deployment-core';

export class DeploymentWrapper {
  constructor(private spine: InteropSpine) {}

  async deploy(config: DeploymentConfig) {
    // Call existing deployment core
    const manager = getDeploymentManager();
    const result = await manager.deploy(config);

    // Publish event to Spine
    this.spine.publish('deployment.complete', result);

    return result;
  }
}
```

## Integration with Existing Systems

### SuperSpine
**Current:** Standalone orchestrator in `server/core/SuperSpine.ts`
**Future:** Wrapped by `AgentRegistryWrapper`, publishes events to Spine

### Deployment Core
**Current:** Standalone manager in `packages/deployment-core`
**Future:** Wrapped by `DeploymentWrapper`, publishes deployment events

### Shield Core
**Current:** Standalone security layer
**Future:** Wrapped by `ShieldWrapper`, publishes violation events

### Cost Governor
**Current:** Unwired (not called by server)
**Future:** Wrapped by `CostGovernorWrapper`, publishes cost alerts

## Implementation Roadmap

### Phase 1: Scaffold (Not Started)
- [ ] Create `packages/spine` package
- [ ] Implement basic Event Bus
- [ ] Define wrapper interfaces

### Phase 2: Wrappers (Planned)
- [ ] Create `AgentRegistryWrapper`
- [ ] Create `DeploymentWrapper`
- [ ] Create `ShieldWrapper`
- [ ] Create `CostGovernorWrapper`

### Phase 3: Advanced Features (Future)
- [ ] Implement BGP-for-Agents
- [ ] Implement MCP Bridge
- [ ] Implement OS Linker

## Dependency Safety

> [!IMPORTANT]
> **Avoid Circular Dependencies**

**Rule:** Core packages NEVER import Spine. Only Spine imports cores.

```
✅ ALLOWED:
  spine → deployment-core
  spine → shield-core

❌ FORBIDDEN:
  deployment-core → spine
  shield-core → spine
```

See [Registry-Spine Dependency Report](file:///c:/Users/brand/OneDrive/Documents/GitHub/dream-net/docs/internal/registry_spine_dependency_report.md) for full analysis.

## Related Documentation

- [Agent Registry Overview](file:///c:/Users/brand/OneDrive/Documents/GitHub/dream-net/docs/AGENT_REGISTRY_OVERVIEW.md)
- [Deployment Core Overview](file:///c:/Users/brand/OneDrive/Documents/GitHub/dream-net/docs/DEPLOYMENT_CORE_OVERVIEW.md)
- [Registry-Spine Topology Map](file:///c:/Users/brand/OneDrive/Documents/GitHub/dream-net/docs/internal/registry_spine_topology.md)
- [Spine Alignment Table](file:///c:/Users/brand/OneDrive/Documents/GitHub/dream-net/docs/internal/spine_alignment_table.md)
