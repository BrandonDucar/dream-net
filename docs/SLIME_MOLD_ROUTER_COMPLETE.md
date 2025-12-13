# Slime-Mold Router Complete Documentation

## Overview

Slime-Mold Router is DreamNet's biomimetic network topology optimization system. It uses a slime-mold algorithm to grow efficient networks between services, minimizing latency and cost while maintaining reliability.

**Package**: `@dreamnet/event-wormholes`  
**Location**: `packages/event-wormholes/src/slimeRouter.ts`

**Tier**: Tier II (Core Biomimetic)

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Concepts](#core-concepts)
3. [Slime-Mold Algorithm](#slime-mold-algorithm)
4. [Network Topology](#network-topology)
5. [Usage Examples](#usage-examples)
6. [Integration Points](#integration-points)

---

## Architecture Overview

### Purpose

Slime-Mold Router provides:
- **Network Topology Optimization** - Optimizes network structure using biomimetic algorithms
- **Efficient Path Finding** - Grows efficient paths between services
- **Cost/Latency Minimization** - Minimizes latency and cost while maintaining reliability
- **Dynamic Adaptation** - Adapts to traffic patterns and network conditions

### System Flow

```
Wormholes (Event Routes)
    ↓
Initialize Topology from Wormholes
    ↓
Events Arrive (Traffic/Nutrients)
    ↓
Run Slime-Mold Optimization
    ↓
1. Calculate Traffic from Events
2. Iterate: Strengthen Efficient Edges, Decay Unused
3. Prune Weak Edges
    ↓
Get Optimal Routes for Events
```

### Design Philosophy

- **Biomimetic**: Inspired by slime-mold growth patterns
- **Traffic-Driven**: Network grows based on actual traffic (nutrients)
- **Efficiency-Focused**: Optimizes for latency and cost
- **Reliability-Aware**: Maintains minimum reliability threshold

---

## Core Concepts

### Network Node

**NetworkNode** - Represents a service, endpoint, agent, or external system:

```typescript
interface NetworkNode {
  id: string;                    // Node ID
  type: "service" | "endpoint" | "agent" | "external";
  latency: number;               // ms
  costPerGB: number;             // $/GB
  reliability: number;           // 0.0 to 1.0
  capacity: number;             // requests/sec
}
```

**Example**:
```typescript
{
  id: "api:user-created",
  type: "service",
  latency: 50,
  costPerGB: 0.01,
  reliability: 0.99,
  capacity: 1000
}
```

### Network Edge

**NetworkEdge** - Represents a connection between nodes:

```typescript
interface NetworkEdge {
  from: string;                  // Source node ID
  to: string;                   // Target node ID
  traffic: number;               // requests/sec
  latency: number;               // ms
  cost: number;                  // $/hour
  strength: number;              // 0.0 to 1.0 (slime-mold strength)
}
```

**Example**:
```typescript
{
  from: "api:user-created",
  to: "agent:notification-handler",
  traffic: 100,
  latency: 80,
  cost: 0.001,
  strength: 0.7
}
```

### Network Topology

**NetworkTopology** - Complete network structure:

```typescript
interface NetworkTopology {
  nodes: Map<string, NetworkNode>;
  edges: Map<string, NetworkEdge>;  // key: "from->to"
}
```

---

## Slime-Mold Algorithm

### Algorithm Parameters

- **MIN_RELIABILITY**: 0.95 (Don't optimize below this)
- **ITERATIONS**: 10 (Slime-mold iterations per optimization)
- **GROWTH_RATE**: 0.1 (How fast edges grow)
- **DECAY_RATE**: 0.05 (How fast unused edges decay)

### Optimization Process

1. **Initialize Topology**: Extract nodes and edges from wormholes
2. **Calculate Traffic**: Count events per source (nutrients)
3. **Iterate**: Run slime-mold growth iterations
4. **Prune**: Remove weak edges below threshold

### Growth Logic

**Efficiency Calculation**:
```typescript
const efficiency = 1 / (edge.latency + edge.cost * 1000);
```

**Growth** (for edges with traffic):
```typescript
if (edge.traffic > 0 && toNode.reliability >= MIN_RELIABILITY) {
  edge.strength = Math.min(1.0, 
    edge.strength + GROWTH_RATE * efficiency * (edge.traffic / 100)
  );
}
```

**Decay** (for unused edges):
```typescript
if (edge.traffic === 0) {
  edge.strength = Math.max(0, edge.strength - DECAY_RATE);
}
```

### Pruning Logic

Edges with strength < 0.1 are removed:

```typescript
if (edge.strength < 0.1) {
  topology.edges.delete(edgeKey);
}
```

---

## Network Topology

### Initialization

Topology initialized from wormholes:

```typescript
initializeFromWormholes(wormholes: WormholeModel[]): void {
  for (const wormhole of wormholes) {
    const fromId = `${wormhole.from.sourceType}:${wormhole.from.eventType}`;
    const toId = `${wormhole.to.targetAgentRole}:${wormhole.to.actionType}`;

    // Add nodes
    if (!this.topology.nodes.has(fromId)) {
      this.topology.nodes.set(fromId, {
        id: fromId,
        type: "service",
        latency: 50,
        costPerGB: 0.01,
        reliability: 0.99,
        capacity: 1000,
      });
    }

    // Add edge
    const edgeKey = `${fromId}->${toId}`;
    if (!this.topology.edges.has(edgeKey)) {
      this.topology.edges.set(edgeKey, {
        from: fromId,
        to: toId,
        traffic: 0,
        latency: 80,
        cost: 0.001,
        strength: 0.5, // Initial strength
      });
    }
  }
}
```

### Optimization

Optimize topology based on events:

```typescript
optimize(events: EventModel[]): void {
  // Calculate traffic (nutrients) from events
  const trafficMap = new Map<string, number>();
  for (const event of events) {
    const fromId = `${event.sourceType}:${event.eventType}`;
    trafficMap.set(fromId, (trafficMap.get(fromId) || 0) + 1);
  }

  // Update edge traffic
  for (const [edgeKey, edge] of this.topology.edges.entries()) {
    const fromTraffic = trafficMap.get(edge.from) || 0;
    edge.traffic = fromTraffic;
  }

  // Run iterations
  for (let i = 0; i < ITERATIONS; i++) {
    this.iterate();
  }

  // Prune weak edges
  this.prune();
}
```

---

## Usage Examples

### Example 1: Initialize Router

```typescript
import { slimeMoldRouter } from '@dreamnet/event-wormholes/src/slimeRouter';
import { listWormholes } from '@dreamnet/event-wormholes/src/wormholeRegistry';

// Initialize topology from wormholes
const wormholes = listWormholes();
slimeMoldRouter.initializeFromWormholes(wormholes);
```

### Example 2: Optimize Topology

```typescript
import { slimeMoldRouter } from '@dreamnet/event-wormholes/src/slimeRouter';

// Optimize based on recent events
const events = [
  { sourceType: "api", eventType: "user-created" },
  { sourceType: "api", eventType: "user-updated" },
  // ... more events
];

slimeMoldRouter.optimize(events);
```

### Example 3: Get Optimal Route

```typescript
import { slimeMoldRouter } from '@dreamnet/event-wormholes/src/slimeRouter';

// Get optimal route for an event
const event = {
  sourceType: "api",
  eventType: "user-created"
};

const route = slimeMoldRouter.getOptimalRoute(event);
console.log(`Optimal route: ${route.join(" -> ")}`);
```

### Example 4: Get Topology Statistics

```typescript
import { slimeMoldRouter } from '@dreamnet/event-wormholes/src/slimeRouter';

// Get topology statistics
const stats = slimeMoldRouter.getStats();

console.log(`Nodes: ${stats.nodeCount}`);
console.log(`Edges: ${stats.edgeCount}`);
console.log(`Avg Latency: ${stats.avgLatency}ms`);
console.log(`Avg Cost: $${stats.avgCost}/hour`);
console.log(`Avg Reliability: ${stats.avgReliability}`);
```

---

## Integration Points

### Halo-Loop Integration

**Location**: `packages/halo-loop/haloEngine.ts`

Halo-Loop uses Slime-Mold Router for network optimization:

```typescript
// In Halo-Loop cycle:
let slimeRouter = null;
try {
  const slimeModule = await import("@dreamnet/event-wormholes/src/slimeRouter");
  if (slimeModule?.slimeMoldRouter) {
    slimeRouter = slimeModule.slimeMoldRouter;
  }
} catch {
  // Router not available
}

// Use router in context
const context = {
  // ... other systems
  slimeRouter,
};
```

### Star Bridge Lungs Integration

**Location**: `packages/star-bridge-lungs/scheduler/breathScheduler.ts`

Star Bridge Lungs sets preferred chains via Slime-Mold Router:

```typescript
// In Star Bridge breath cycle:
if (ctx.slimeRouter?.setPreferredChains && breaths.length) {
  const preferredPairs = breaths.map(b => ({
    from: b.sourceChain,
    to: b.targetChain,
  }));
  ctx.slimeRouter.setPreferredChains(preferredPairs);
}
```

### Quantum Anticipation Layer Integration

**Location**: `packages/quantum-anticipation/scheduler/qalScheduler.ts`

QAL adjusts Slime-Mold Router for routing bottlenecks:

```typescript
// In QAL cycle:
if (ctx.slimeRouter && predictions.some((p) => p.type === "routing-bottleneck")) {
  const routingPredictions = predictions.filter((p) => p.type === "routing-bottleneck");
  for (const pred of routingPredictions) {
    // TODO: Adjust slime-mold topology to avoid bottlenecks
    console.log("[QAL] Adjusting slime-mold router for bottleneck:", pred.id);
  }
}
```

---

## Route Selection

### Optimal Route Calculation

Routes scored by:
- **Strength**: Edge strength (0.0 to 1.0)
- **Latency**: Inverse latency (lower is better)
- **Reliability**: Node reliability (0.0 to 1.0)

**Score Formula**:
```typescript
const score = edge.strength * (1 / edge.latency) * (toNode?.reliability || 0.5);
```

**Route Selection**:
```typescript
getOptimalRoute(event: EventModel): string[] {
  const fromId = `${event.sourceType}:${event.eventType}`;
  const routes: Array<{ path: string[]; score: number }> = [];

  // Find all edges from source
  for (const [edgeKey, edge] of this.topology.edges.entries()) {
    if (edge.from === fromId) {
      const toNode = this.topology.nodes.get(edge.to);
      const score = edge.strength * (1 / edge.latency) * (toNode?.reliability || 0.5);
      routes.push({
        path: [edge.from, edge.to],
        score,
      });
    }
  }

  // Sort by score and return best
  routes.sort((a, b) => b.score - a.score);
  return routes[0]?.path || [];
}
```

---

## Summary

Slime-Mold Router provides biomimetic network topology optimization:

- **Biomimetic Algorithm** - Slime-mold growth patterns ✅
- **Traffic-Driven Growth** - Network grows based on actual traffic ✅
- **Efficiency Optimization** - Minimizes latency and cost ✅
- **Reliability Maintenance** - Maintains minimum reliability threshold ✅
- **Dynamic Adaptation** - Adapts to traffic patterns ✅
- **Route Selection** - Finds optimal routes based on strength, latency, reliability ✅
- **Integration** - Integrates with Halo-Loop, Star Bridge, QAL ✅

**Status**: ✅ Implemented

**Usage**: Optimizes network topology, finds efficient routes, adapts to traffic patterns.

**Design**: Biomimetic system that grows efficient networks like slime-mold, optimizing for latency, cost, and reliability.
