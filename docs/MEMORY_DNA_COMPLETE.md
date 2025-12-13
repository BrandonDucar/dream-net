# Memory DNA - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Memory DNA provides **memory and trait management** for DreamNet entities. It tracks entity traits, derives child memories, computes resonance insights, and maintains memory records for agents, dreams, and other entities.

---

## Key Features

### Memory Management
- Memory records
- Trait tracking
- Child memory derivation
- Memory persistence

### Trait System
- Entity traits
- Trait updates
- Trait inheritance
- Trait evolution

### Resonance Engine
- Resonance computation
- Insight generation
- Snapshot creation
- Insight storage

### Entity Types
- Agents
- Dreams
- Services
- Other entities

---

## Architecture

### Components

1. **DNA Engine** (`dnaEngine.ts`)
   - Trait updates
   - Memory derivation
   - Record management

2. **Resonance Engine** (`resonanceEngine.ts`)
   - Resonance computation
   - Insight generation
   - Snapshot creation

3. **DNA Store** (`dnaStore.ts`)
   - Memory storage
   - Record retrieval
   - Data persistence

---

## API Reference

### Trait Updates

#### `updateTraitsFromEvent(event: Event): Promise<void>`
Updates traits from event.

**Example**:
```typescript
import { updateTraitsFromEvent } from '@dreamnet/memory-dna';

await updateTraitsFromEvent({
  id: 'event-123',
  timestamp: new Date().toISOString(),
  sourceType: 'agent',
  eventType: 'agent.success',
  severity: 'info',
  payload: { agentId: 'agent-123' },
  handled: false,
});
```

#### `updateTraitsFromTaskResult(result: TaskResult): Promise<void>`
Updates traits from task result.

**Example**:
```typescript
import { updateTraitsFromTaskResult } from '@dreamnet/memory-dna';

await updateTraitsFromTaskResult({
  taskId: 'task-123',
  success: true,
  result: { data: 'result' },
});
```

### Memory Derivation

#### `deriveChildMemory(parentId: string, childType: EntityType, metadata?: Record<string, any>): Promise<MemoryRecord>`
Derives child memory from parent.

**Example**:
```typescript
import { deriveChildMemory } from '@dreamnet/memory-dna';

const childMemory = await deriveChildMemory(
  'parent-123',
  'agent',
  { name: 'child-agent' }
);
```

### Memory Queries

#### `getMemoryRecord(entityId: string, entityType: EntityType): Promise<MemoryRecord | null>`
Gets memory record.

**Example**:
```typescript
import { getMemoryRecord } from '@dreamnet/memory-dna';

const record = await getMemoryRecord('agent-123', 'agent');
if (record) {
  console.log(`Traits: ${record.traits.length}`);
}
```

#### `listMemoryRecords(entityType?: EntityType): Promise<MemoryRecord[]>`
Lists memory records.

**Example**:
```typescript
import { listMemoryRecords } from '@dreamnet/memory-dna';

const records = await listMemoryRecords('agent');
console.log(`Total agent records: ${records.length}`);
```

### Resonance

#### `computeResonanceSnapshot(): Promise<ResonanceInsight[]>`
Computes resonance snapshot.

**Example**:
```typescript
import { computeResonanceSnapshot } from '@dreamnet/memory-dna';

const insights = await computeResonanceSnapshot();
insights.forEach(insight => {
  console.log(`${insight.entityId}: ${insight.resonanceScore}`);
});
```

#### `getRecentInsights(limit?: number): Promise<ResonanceInsight[]>`
Gets recent resonance insights.

**Example**:
```typescript
import { getRecentInsights } from '@dreamnet/memory-dna';

const insights = await getRecentInsights(10);
insights.forEach(insight => {
  console.log(`Insight: ${insight.entityId}`);
});
```

---

## Data Models

### MemoryRecord

```typescript
interface MemoryRecord {
  entityId: string;
  entityType: EntityType;
  traits: Trait[];
  createdAt: string;
  updatedAt: string;
  parentId?: string;
  metadata?: Record<string, any>;
}
```

### Trait

```typescript
interface Trait {
  name: string;
  value: any;
  source: string;
  timestamp: string;
  confidence?: number;
}
```

### ResonanceInsight

```typescript
interface ResonanceInsight {
  entityId: string;
  entityType: EntityType;
  resonanceScore: number;
  relatedEntities: string[];
  insights: string[];
  timestamp: string;
}
```

### EntityType

```typescript
type EntityType = "agent" | "dream" | "service" | "other";
```

---

## Trait System

### Trait Sources
- Events
- Task results
- User interactions
- System observations

### Trait Updates
- Automatic updates
- Event-driven
- Confidence scoring
- Source tracking

### Trait Inheritance
- Parent-child relationships
- Trait propagation
- Evolution tracking
- Memory derivation

---

## Resonance Engine

### Resonance Computation
- Entity relationships
- Trait similarity
- Interaction patterns
- Resonance scoring

### Insight Generation
- Pattern recognition
- Relationship insights
- Anomaly detection
- Recommendations

---

## Integration Points

### DreamNet Systems
- **Graft Engine**: Trait updates from grafts
- **Event Wormholes**: Event-driven updates
- **Agent Registry Core**: Agent memory
- **Dream Cortex**: Dream memory

### External Systems
- **Storage Systems**: Memory persistence
- **Analytics**: Resonance analysis

---

## Usage Examples

### Update Traits from Event

```typescript
await updateTraitsFromEvent({
  id: 'event-123',
  timestamp: new Date().toISOString(),
  sourceType: 'agent',
  eventType: 'agent.success',
  severity: 'info',
  payload: { agentId: 'agent-123' },
  handled: false,
});
```

### Derive Child Memory

```typescript
const childMemory = await deriveChildMemory(
  'parent-123',
  'agent',
  { name: 'child' }
);
```

### Compute Resonance

```typescript
const insights = await computeResonanceSnapshot();
```

---

## Best Practices

1. **Memory Management**
   - Update traits regularly
   - Track trait sources
   - Maintain parent-child relationships
   - Monitor memory growth

2. **Resonance**
   - Compute resonance periodically
   - Store insights
   - Analyze patterns
   - Generate recommendations

---

## Security Considerations

1. **Memory Security**
   - Protect memory data
   - Validate entity IDs
   - Secure trait updates
   - Audit memory changes

2. **Resonance Security**
   - Protect insights
   - Validate computations
   - Secure storage
   - Monitor access

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

