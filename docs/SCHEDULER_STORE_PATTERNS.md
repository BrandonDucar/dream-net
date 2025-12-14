# DreamNet Scheduler & Store Patterns

**Last Updated**: 2025-01-27  
**Status**: ✅ Patterns Documented

---

## Overview

DreamNet subsystems follow consistent patterns for schedulers (cycle orchestration) and stores (state management). Understanding these patterns is key to understanding how the system works.

---

## Scheduler Pattern

### Standard Cycle Structure

All schedulers follow this pattern:

```typescript
export function runXCycle(ctx: XContext): XStatus {
  const now = Date.now();
  
  // 1. Setup/Ensure defaults
  ensureDefaults();
  
  // 2. Process/Update state
  processUpdates(ctx);
  
  // 3. Analyze/Generate outputs
  const outputs = analyze(ctx);
  
  // 4. Store state
  XStore.setLastRunAt(now);
  
  // 5. Optional: Log to Neural Mesh
  if (ctx.neuralMesh?.remember) {
    ctx.neuralMesh.remember({ /* summary */ });
  }
  
  // 6. Return status
  return XStore.status();
}
```

### Scheduler Examples

#### 1. DreamNet OS Scheduler (Complex Aggregation)

**HOW**:
1. Builds OS snapshot (aggregates all subsystem statuses)
2. Analyzes heartbeat for alerts (failures, degradation, recovery)
3. Generates recovery actions for failed subsystems
4. Auto-detects and fixes integration gaps
5. Stores snapshot in OSStore
6. Writes summary to Neural Mesh

**WHY**: Central monitoring system needs to aggregate everything

**PATTERN**: Build → Analyze → Generate → Store → Log → Return

---

#### 2. Spider Web Scheduler (Multi-Phase Processing)

**HOW**:
1. Ensures default sensors and templates exist
2. **Head Spider**: Reads packs & creates threads
3. **Funnel Web Spider**: Catches flies from sensors
4. **Silk Binder Spider**: Generates legal/compliance insights
5. **Orb Weaver**: Routes and executes threads
6. **Pattern Learning**: Learns from completed threads and flies
7. Stores last run time

**WHY**: Event-driven nervous system needs multiple processing phases

**PATTERN**: Setup → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Store → Return

---

#### 3. Field Layer Scheduler (Update from Sources)

**HOW**:
1. Applies decay to all fields
2. Updates fields from Reputation Lattice
3. Updates fields from Star Bridge Lungs
4. Updates fields from Quantum Anticipation Layer
5. Updates fields from Dream Cortex
6. Updates fields from Wolf Pack & Predator-Scavenger Loop
7. Stores last run time
8. Logs to Neural Mesh

**WHY**: Global parameter fields need to sample from multiple sources

**PATTERN**: Decay → Update Source 1 → Update Source 2 → ... → Store → Log → Return

---

#### 4. Dream Cortex Scheduler (Synthesis)

**HOW**:
1. Synthesizes directives from context
2. Stores directives
3. Logs to Neural Mesh
4. Returns status

**WHY**: Intent engine needs to synthesize directives from context

**PATTERN**: Synthesize → Store → Log → Return

---

#### 5. Economic Engine Scheduler (Simple Cycle)

**HOW**:
1. Ensures economic config exists
2. Sets last run time
3. Logs to Neural Mesh
4. Returns status

**WHY**: Economic engine operates on queued rewards (not polled)

**PATTERN**: Ensure Config → Store → Log → Return

---

#### 6. Dream Tank Scheduler (Progression)

**HOW**:
1. Runs progression & evaluations
2. Updates last run timestamp
3. Sends narrative entries (if dreams exist)
4. Logs to Neural Mesh
5. Returns status

**WHY**: Incubator needs to progress dreams through stages

**PATTERN**: Process → Store → Generate Outputs → Log → Return

---

## Store Pattern

### Standard Store Structure

All stores follow this pattern:

```typescript
// Module-level state
const items: Map<string, ItemType> = new Map();
let lastRunAt: number | null = null;

export const XStore = {
  // CRUD operations
  upsert(item: ItemType): ItemType {
    items.set(item.id, item);
    return item;
  },
  
  get(id: string): ItemType | undefined {
    return items.get(id);
  },
  
  list(): ItemType[] {
    return Array.from(items.values());
  },
  
  // Status tracking
  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },
  
  // Status query
  status(): XStatus {
    return {
      lastRunAt,
      count: items.size,
      // ... other metrics
    };
  },
};
```

### Store Examples

#### 1. OSStore (Simple Snapshot Storage)

**HOW**:
- Stores last snapshot and last run time
- Returns status with snapshot or default

**WHY**: OS needs to track system-wide snapshot

**PATTERN**: Simple getter/setter for snapshot

---

#### 2. SpiderStore (Complex Multi-Entity Store)

**HOW**:
- Stores threads, flies, sensors, templates, patterns
- Tracks daily fly count
- Provides query methods (by status, by priority, etc.)

**WHY**: Nervous system needs to track multiple entity types

**PATTERN**: Multiple Maps + Query Methods

---

#### 3. EconStore (Balance & Reward Tracking)

**HOW**:
- Stores token configs, balances, raw rewards, emission rules, applied rewards
- Uses composite keys for balances (`identityId:token`)
- Provides balance adjustment methods

**WHY**: Economic engine needs to track tokens, balances, and rewards

**PATTERN**: Multiple Maps + Composite Keys + Adjustment Methods

---

#### 4. TankStore (Dream & Milestone Tracking)

**HOW**:
- Stores dreams, milestones, evaluations
- Provides upsert with merging logic
- Returns sample dreams in status

**WHY**: Incubator needs to track dreams and their progression

**PATTERN**: Multiple Maps + Upsert Merging + Sample Returns

---

#### 5. FieldStore (Field Sample Storage)

**HOW**:
- Stores field samples in Map with composite keys (`field:kind:id`)
- Applies smoothing when updating samples
- Provides config for decay and smoothing

**WHY**: Field layer needs to store and smooth field values

**PATTERN**: Composite Keys + Smoothing Logic + Config

---

#### 6. DreamRegistry (Simple Dream Storage)

**HOW**:
- Stores dreams in Map
- Provides status updates and priority changes
- Returns sample in status

**WHY**: Dream Cortex needs simple dream storage

**PATTERN**: Simple Map + Status Updates

---

## Common Patterns

### 1. In-Memory Storage

**ALL stores use in-memory Maps/Arrays**:
- Fast access
- No I/O overhead
- Lost on restart (by design)

**WHY**: 
- Cycle-to-cycle state doesn't need persistence
- Database persistence is separate concern
- Simple = fast

---

### 2. Composite Keys

**Many stores use composite keys**:
- `identityId:token` (balances)
- `field:kind:id` (field samples)
- `dreamId:milestoneId` (milestones)

**WHY**: 
- Enables efficient lookups
- Prevents key collisions
- Supports hierarchical data

---

### 3. Upsert with Merging

**Many stores provide upsert methods**:
- Merge existing data with new data
- Preserve timestamps (createdAt)
- Update timestamps (updatedAt)

**WHY**: 
- Idempotent operations
- Preserves history
- Handles partial updates

---

### 4. Status Methods

**All stores provide status() method**:
- Returns last run time
- Returns counts/metrics
- Returns samples (for large datasets)

**WHY**: 
- Enables monitoring
- Provides observability
- Supports debugging

---

### 5. Neural Mesh Integration

**Many schedulers log to Neural Mesh**:
- Stores cycle summaries
- Enables long-term memory
- Supports pattern learning

**WHY**: 
- Long-term memory
- Pattern recognition
- System learning

---

## Data Flow

### Cycle Flow

```
Orchestrator.runCycle()
  ↓
Subsystem.run(context)
  ↓
Scheduler.runXCycle(context)
  ↓
  ├─→ Process/Update State
  ├─→ Analyze/Generate Outputs
  ├─→ Store.setLastRunAt()
  └─→ NeuralMesh.remember()
  ↓
Store.status()
  ↓
Return Status
```

### State Flow

```
Store (In-Memory)
  ├─→ Scheduler reads state
  ├─→ Scheduler updates state
  └─→ Status queries state
```

---

## Key Insights

### 1. Schedulers Orchestrate, Stores Manage

- **Schedulers**: Orchestrate cycles, call logic, coordinate
- **Stores**: Manage state, provide CRUD, track metrics

### 2. Simple = Fast

- In-memory storage = fast access
- Simple patterns = easy to understand
- No I/O = no bottlenecks

### 3. Optional Integration

- Neural Mesh integration is optional
- Subsystems gracefully degrade
- Missing subsystems don't break cycles

### 4. Consistent Patterns

- All schedulers follow similar structure
- All stores follow similar structure
- Predictable = maintainable

---

## What's Missing

### 1. Database Persistence

**ISSUE**: All stores are in-memory, data lost on restart

**DIRECTION**: Add optional database persistence layer
- Keep in-memory for speed
- Add database sync for persistence
- Make it optional (feature flag)

### 2. Concurrency Handling

**ISSUE**: No locking or concurrency control

**DIRECTION**: Add locking for critical operations
- Use async locks for Map updates
- Prevent race conditions
- Handle concurrent cycles

### 3. State Synchronization

**ISSUE**: No state sync between instances

**DIRECTION**: Add state sync mechanism
- Use event bus for state changes
- Sync between instances
- Handle conflicts

---

## Summary

**Schedulers**: Orchestrate cycles, follow consistent patterns  
**Stores**: Manage state, use in-memory Maps/Arrays  
**Patterns**: Simple, fast, consistent  
**Integration**: Optional, graceful degradation  
**Missing**: Persistence, concurrency, sync

**Understanding these patterns is key to understanding DreamNet's architecture.**

