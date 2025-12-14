# Pheromone Store (Ant-Trail Scheduler) Complete Documentation

## Overview

Pheromone Store is DreamNet's ant colony optimization system for routing and task assignment. It stores and manages pheromone trails that represent successful paths, enabling agents to bias routing decisions toward paths with higher success rates.

**Package**: `@dreamnet/halo-loop`  
**Location**: `packages/halo-loop/stores/pheromoneStore.ts`

**Tier**: Tier II (Core Biomimetic)

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Concepts](#core-concepts)
3. [Pheromone Trails](#pheromone-trails)
4. [Path Building](#path-building)
5. [Evaporation](#evaporation)
6. [Usage Examples](#usage-examples)
7. [Integration Points](#integration-points)

---

## Architecture Overview

### Purpose

Pheromone Store provides:
- **Success-Based Routing** - Routes tasks based on historical success rates
- **Pheromone Trails** - Stores trails representing successful paths
- **Automatic Decay** - Evaporates old trails to prevent lock-in
- **Path Context** - Builds paths from time, region, provider, agent, endpoint

### System Flow

```
Task/Request Arrives
    ↓
Build Path from Context (time, region, provider, agent)
    ↓
Get Pheromone Strength for Path
    ↓
Route Task to Agent with Highest Strength
    ↓
Task Completes (Success/Failure)
    ↓
Deposit Pheromone (Strengthen on Success, Weaken on Failure)
    ↓
Evaporate Old Trails (Nightly Job)
```

### Design Philosophy

- **Ant Colony Optimization**: Inspired by ant foraging behavior
- **Success Reinforcement**: Successful paths get stronger
- **Failure Penalty**: Failed paths get weaker
- **Temporal Decay**: Old trails evaporate naturally

---

## Core Concepts

### Pheromone Trail

**PheromoneTrail** - Represents a successful path:

```typescript
interface PheromoneTrail {
  path: string;                  // e.g., "time:14:00:region:us-east-1:provider:vercel"
  strength: number;              // 0.0 to 1.0
  successCount: number;           // Number of successes
  failureCount: number;           // Number of failures
  lastSuccess: string;            // ISO timestamp
  lastFailure: string;            // ISO timestamp
  createdAt: string;              // ISO timestamp
  updatedAt: string;              // ISO timestamp
}
```

**Example**:
```typescript
{
  path: "time:14:00:region:us-east-1:provider:vercel:agent:halo-loop",
  strength: 0.85,
  successCount: 120,
  failureCount: 5,
  lastSuccess: "2024-01-15T14:30:00.000Z",
  lastFailure: "2024-01-14T10:15:00.000Z",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-15T14:30:00.000Z"
}
```

### Path Format

Paths are built from context components:

```
time:{time}:region:{region}:provider:{provider}:agent:{agent}:endpoint:{endpoint}
```

**Components**:
- **time**: "14:00" or "morning" | "afternoon" | "evening"
- **region**: "us-east-1", "eu-west-1", etc.
- **provider**: "vercel", "neon", "github", etc.
- **agent**: Agent ID
- **endpoint**: API endpoint

**Example Paths**:
- `"time:14:00:region:us-east-1:provider:vercel"`
- `"time:morning:agent:halo-loop"`
- `"region:eu-west-1:provider:neon:endpoint:/api/users"`

---

## Pheromone Trails

### Deposit Pheromone

**On Success**:
- Increment `successCount`
- Update `lastSuccess`
- Increase `strength` (up to 1.0)

**On Failure**:
- Increment `failureCount`
- Update `lastFailure`
- Decrease `strength` (down to 0)

**Implementation**:
```typescript
export function depositPheromone(
  path: string,
  success: boolean = true,
  strength: number = 0.1
): void {
  const store = loadStore();
  const now = new Date().toISOString();

  const existing = store.get(path);
  if (existing) {
    if (success) {
      existing.successCount++;
      existing.lastSuccess = now;
      existing.strength = Math.min(1.0, existing.strength + strength);
    } else {
      existing.failureCount++;
      existing.lastFailure = now;
      existing.strength = Math.max(0, existing.strength - strength * 0.5);
    }
    existing.updatedAt = now;
  } else {
    store.set(path, {
      path,
      strength: success ? strength : 0,
      successCount: success ? 1 : 0,
      failureCount: success ? 0 : 1,
      lastSuccess: success ? now : "",
      lastFailure: success ? "" : now,
      createdAt: now,
      updatedAt: now,
    });
  }

  saveStore(store);
}
```

### Get Pheromone Strength

```typescript
export function getPheromoneStrength(path: string): number {
  const store = loadStore();
  const trail = store.get(path);
  return trail?.strength || 0;
}
```

### Get Top Paths

```typescript
export function getTopPaths(limit: number = 10): PheromoneTrail[] {
  const store = loadStore();
  return Array.from(store.values())
    .sort((a, b) => b.strength - a.strength)
    .slice(0, limit);
}
```

---

## Path Building

### Build Path from Context

```typescript
export function buildPath(context: {
  time?: string;        // "14:00" or "morning" | "afternoon" | "evening"
  region?: string;      // "us-east-1", "eu-west-1", etc.
  provider?: string;    // "vercel", "neon", "github", etc.
  agent?: string;       // Agent ID
  endpoint?: string;    // API endpoint
}): string {
  const parts: string[] = [];

  if (context.time) parts.push(`time:${context.time}`);
  if (context.region) parts.push(`region:${context.region}`);
  if (context.provider) parts.push(`provider:${context.provider}`);
  if (context.agent) parts.push(`agent:${context.agent}`);
  if (context.endpoint) parts.push(`endpoint:${context.endpoint}`);

  return parts.join(":");
}
```

### Example Usage

```typescript
import { buildPath } from '@dreamnet/halo-loop/stores/pheromoneStore';

// Build path from context
const path = buildPath({
  time: "14:00",
  region: "us-east-1",
  provider: "vercel",
  agent: "halo-loop"
});

// Result: "time:14:00:region:us-east-1:provider:vercel:agent:halo-loop"
```

---

## Evaporation

### Evaporation Process

Pheromones evaporate over time to prevent lock-in:

- **EVAPORATION_RATE**: 0.1 (10% per day)
- **MIN_STRENGTH**: 0.01 (Minimum strength before removal)

**Implementation**:
```typescript
export function evaporatePheromones(): number {
  const store = loadStore();
  const now = Date.now();
  let removed = 0;

  for (const [path, trail] of store.entries()) {
    // Calculate age in days
    const updatedAt = new Date(trail.updatedAt).getTime();
    const ageDays = (now - updatedAt) / (1000 * 60 * 60 * 24);

    // Apply evaporation
    trail.strength = trail.strength * Math.pow(1 - EVAPORATION_RATE, ageDays);

    // Remove if below minimum
    if (trail.strength < MIN_STRENGTH) {
      store.delete(path);
      removed++;
    } else {
      trail.updatedAt = new Date().toISOString();
    }
  }

  saveStore(store);
  return removed;
}
```

### Evaporation Schedule

Evaporation typically runs as a nightly job:

```typescript
// Nightly evaporation job
setInterval(() => {
  const removed = evaporatePheromones();
  console.log(`Evaporated ${removed} weak pheromone trails`);
}, 24 * 60 * 60 * 1000); // Every 24 hours
```

---

## Usage Examples

### Example 1: Deposit Pheromone on Success

```typescript
import { depositPheromone, buildPath } from '@dreamnet/halo-loop/stores/pheromoneStore';

// Build path from context
const path = buildPath({
  time: "14:00",
  region: "us-east-1",
  provider: "vercel",
  agent: "halo-loop"
});

// Deposit pheromone on success
depositPheromone(path, true, 0.1);
```

### Example 2: Deposit Pheromone on Failure

```typescript
import { depositPheromone, buildPath } from '@dreamnet/halo-loop/stores/pheromoneStore';

// Build path
const path = buildPath({
  time: "14:00",
  region: "us-east-1",
  provider: "vercel",
  agent: "halo-loop"
});

// Deposit pheromone on failure (weakens trail)
depositPheromone(path, false, 0.1);
```

### Example 3: Get Pheromone Strength

```typescript
import { getPheromoneStrength, buildPath } from '@dreamnet/halo-loop/stores/pheromoneStore';

// Build path
const path = buildPath({
  time: "14:00",
  region: "us-east-1",
  provider: "vercel",
  agent: "halo-loop"
});

// Get strength
const strength = getPheromoneStrength(path);
console.log(`Pheromone strength: ${strength}`); // 0.0 to 1.0
```

### Example 4: Route with Pheromones

```typescript
import { routeWithPheromones } from '@dreamnet/squad-builder/src/pheromoneRouter';

// Route task using pheromone trails
const agent = routeWithPheromones(
  task,
  availableAgents,
  baseRouter  // Fallback router
);

if (agent) {
  console.log(`Routed to agent: ${agent.id}`);
}
```

### Example 5: Get Top Paths

```typescript
import { getTopPaths } from '@dreamnet/halo-loop/stores/pheromoneStore';

// Get top 10 paths by strength
const topPaths = getTopPaths(10);

topPaths.forEach(trail => {
  console.log(`${trail.path}: ${trail.strength} (${trail.successCount} successes)`);
});
```

### Example 6: Evaporate Pheromones

```typescript
import { evaporatePheromones } from '@dreamnet/halo-loop/stores/pheromoneStore';

// Evaporate old trails
const removed = evaporatePheromones();
console.log(`Removed ${removed} weak trails`);
```

---

## Integration Points

### Squad-Builder Integration

**Location**: `packages/squad-builder/src/pheromoneRouter.ts`

Squad-Builder uses pheromone trails for task routing:

```typescript
export function routeWithPheromones(
  task: TaskModel,
  availableAgents: AgentModel[],
  baseRouter: (task: TaskModel, agents: AgentModel[]) => AgentModel | null
): AgentModel | null {
  // Build candidate paths
  const candidates = availableAgents.map((agent) => {
    const path = buildPath({
      agent: agent.id,
      time: getTimeOfDay(),
      provider: inferProvider(agent),
    });

    const strength = getPheromoneStrength(path);

    return {
      agent,
      path,
      strength,
      baseMatch: agent.id === baseAgent.id,
    };
  });

  // Sort by strength (highest first), but boost base match
  candidates.sort((a, b) => {
    const aScore = a.strength + (a.baseMatch ? 0.2 : 0);
    const bScore = b.strength + (b.baseMatch ? 0.2 : 0);
    return bScore - aScore;
  });

  // Return top candidate
  return candidates[0]?.agent || baseAgent;
}
```

### Neural Mesh Integration

**Location**: `packages/neural-mesh/meshMemory.ts`

Neural Mesh integrates with Pheromone Store:

```typescript
// In meshMemory.store():
if (trace.path && trace.success !== undefined) {
  loadPheromoneStore().then(() => {
    if (depositPheromone && buildPath) {
      try {
        const path = typeof trace.path === "string" 
          ? trace.path 
          : buildPath(trace.path);
        depositPheromone(path, trace.success, trace.strength || 0.1);
      } catch {
        // Pheromone store might not be available
      }
    }
  }).catch(() => {
    // Ignore errors
  });
}
```

### Quantum Anticipation Layer Integration

**Location**: `packages/quantum-anticipation/scheduler/qalScheduler.ts`

QAL pre-lays pheromone trails for anticipated workload:

```typescript
// In QAL cycle:
if (ctx.pheromoneStore && predictions.some((p) => p.type === "workload-spike")) {
  // Pre-lay pheromone trails for anticipated workload
  const workloadPredictions = predictions.filter((p) => p.type === "workload-spike");
  for (const pred of workloadPredictions) {
    // TODO: Determine optimal paths and pre-deposit pheromones
    console.log("[QAL] Pre-laying pheromone trail for workload spike:", pred.id);
  }
}
```

### Webhook Nervous Core Integration

**Location**: `packages/webhook-nervous-core/logic/antColony.ts`

Webhook Nervous Core uses ant colony logic with pheromone trails:

```typescript
// Create pheromone trail
export function createPheromoneTrail(
  path: string[],
  successRate: number = 1.0,
  latency: number = 0
): PheromoneTrail {
  const trail: PheromoneTrail = {
    id: nextTrailId(),
    path,
    strength: 1.0,
    successRate,
    latency,
    lastUsed: Date.now(),
    evaporationRate: 0.0001, // Decay per ms
    createdAt: Date.now(),
  };

  pheromoneTrails.set(trail.id, trail);
  return trail;
}
```

---

## Storage

### File-Based Storage

Pheromone trails stored in JSON file:

**Location**: `packages/halo-loop/store/pheromoneStore.json`

**Format**:
```json
{
  "time:14:00:region:us-east-1:provider:vercel": {
    "path": "time:14:00:region:us-east-1:provider:vercel",
    "strength": 0.85,
    "successCount": 120,
    "failureCount": 5,
    "lastSuccess": "2024-01-15T14:30:00.000Z",
    "lastFailure": "2024-01-14T10:15:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T14:30:00.000Z"
  }
}
```

### Load/Save Operations

**Load Store**:
```typescript
function loadStore(): Map<string, PheromoneTrail> {
  ensureStoreDir();
  if (!existsSync(STORE_PATH)) {
    return new Map();
  }

  try {
    const content = readFileSync(STORE_PATH, "utf-8");
    const data = JSON.parse(content);
    const map = new Map<string, PheromoneTrail>();

    for (const [path, trail] of Object.entries(data)) {
      map.set(path, trail as PheromoneTrail);
    }

    return map;
  } catch (error) {
    console.warn("[PheromoneStore] Failed to load store, starting fresh:", error);
    return new Map();
  }
}
```

**Save Store**:
```typescript
function saveStore(store: Map<string, PheromoneTrail>): void {
  ensureStoreDir();
  const data: Record<string, PheromoneTrail> = {};
  for (const [path, trail] of store.entries()) {
    data[path] = trail;
  }
  writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
}
```

---

## Summary

Pheromone Store provides ant colony optimization for routing and task assignment:

- **Success-Based Routing** - Routes based on historical success rates ✅
- **Pheromone Trails** - Stores trails representing successful paths ✅
- **Automatic Decay** - Evaporates old trails to prevent lock-in ✅
- **Path Context** - Builds paths from time, region, provider, agent ✅
- **File-Based Storage** - Persistent storage in JSON file ✅
- **Integration** - Integrates with Squad-Builder, Neural Mesh, QAL, Webhook Nervous Core ✅

**Status**: ✅ Implemented

**Usage**: Routes tasks based on pheromone strength, deposits pheromones on success/failure, evaporates old trails.

**Design**: Ant colony optimization system that reinforces successful paths and penalizes failed paths, with automatic decay to prevent lock-in.
