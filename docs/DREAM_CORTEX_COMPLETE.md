# Dream Cortex - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Dream Cortex provides **dream management and cognitive processing** for DreamNet. It manages dream nodes (projects/ideas), tracks their status and priority, generates directives for dream optimization, and maintains the dream registry.

---

## Key Features

### Dream Management
- Dream node creation and updates
- Status tracking (idle, incubating, active, blocked, completed, infected)
- Priority management (low, normal, high, critical)
- Dependency tracking

### Dream Directives
- Stabilize directives
- Accelerate directives
- Unblock directives
- Monitor directives
- Deprecate directives

### Dream Scoring
- Automatic score calculation
- Priority-based scoring
- Status-based scoring
- Dependency-based scoring

---

## Architecture

### Components

1. **Dream Registry** (`store/dreamRegistry.ts`)
   - Dream storage
   - Dream retrieval
   - Status management

2. **Cortex Scheduler** (`scheduler/cortexScheduler.ts`)
   - Cortex cycle execution
   - Directive generation
   - Score calculation

---

## API Reference

### Dream Management

#### `upsertDream(dream: Partial<DreamNode> & { id: string; name: string }): DreamNode`
Creates or updates a dream.

**Example**:
```typescript
import { DreamCortex } from '@dreamnet/dream-cortex';

const dream = DreamCortex.upsertDream({
  id: 'dream-123',
  name: 'Optimize API Gateway',
  description: 'Improve API gateway performance',
  status: 'active',
  priority: 'high',
  tags: ['infra', 'performance'],
  dependencies: ['dream-456'],
});
```

#### `setDreamStatus(id: string, status: DreamStatus): DreamNode`
Sets dream status.

#### `setDreamPriority(id: string, priority: DreamPriority): DreamNode`
Sets dream priority.

#### `listDreams(): DreamNode[]`
Lists all dreams.

### Execution

#### `run(context: CortexContext): CortexStatus`
Runs Cortex cycle.

#### `status(): CortexStatus`
Gets Cortex status.

---

## Data Models

### DreamStatus

```typescript
type DreamStatus =
  | 'idle'
  | 'incubating'
  | 'active'
  | 'blocked'
  | 'completed'
  | 'infected';
```

### DreamPriority

```typescript
type DreamPriority =
  | 'low'
  | 'normal'
  | 'high'
  | 'critical';
```

### DreamNode

```typescript
interface DreamNode {
  id: string;
  name: string;
  description?: string;
  status: DreamStatus;
  priority: DreamPriority;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  score?: number; // 0–1, calculated by cortex
  dependencies?: string[]; // other DreamNode ids
}
```

### CortexDirective

```typescript
interface CortexDirective {
  id: string;
  dreamId: string;
  intent: 'stabilize' | 'accelerate' | 'unblock' | 'monitor' | 'deprecate';
  confidence: number; // 0–1
  reason: string;
  createdAt: number;
  meta?: Record<string, any>;
}
```

### CortexStatus

```typescript
interface CortexStatus {
  lastRunAt: number | null;
  dreamCount: number;
  directiveCount: number;
  lastDirectives: CortexDirective[];
}
```

---

## Dream Statuses

### Idle
- Not started
- Waiting for activation
- Low priority

### Incubating
- In development
- Early stage
- Building momentum

### Active
- Currently active
- In progress
- High priority

### Blocked
- Blocked by dependencies
- Waiting for resources
- Needs attention

### Completed
- Successfully completed
- Finished
- Archived

### Infected
- Has issues
- Needs fixing
- Critical problems

---

## Dream Priorities

### Low
- Nice to have
- Low urgency
- Background work

### Normal
- Standard priority
- Regular work
- Balanced focus

### High
- Important
- Urgent
- Focus area

### Critical
- Critical importance
- Highest urgency
- Immediate attention

---

## Dream Directives

### Stabilize
- Stabilize unstable dreams
- Fix issues
- Improve reliability

### Accelerate
- Speed up progress
- Remove bottlenecks
- Increase resources

### Unblock
- Remove blockers
- Resolve dependencies
- Free up resources

### Monitor
- Watch closely
- Track progress
- Monitor health

### Deprecate
- Mark for deprecation
- Phase out
- Archive

---

## Integration Points

### DreamNet Systems
- **Neural Mesh**: Dream patterns
- **Quantum Anticipation**: Predictive directives
- **Slug Time**: Dream metrics
- **Wolf Pack**: Dream health
- **Star Bridge**: Cross-chain dreams

### External Systems
- **Project Management**: Dream tracking
- **Analytics**: Dream analytics
- **Dashboards**: Dream visualization

---

## Usage Examples

### Create Dream

```typescript
const dream = DreamCortex.upsertDream({
  id: 'dream-api-optimization',
  name: 'API Gateway Optimization',
  description: 'Optimize API gateway for better performance',
  status: 'active',
  priority: 'high',
  tags: ['infra', 'performance', 'api'],
  dependencies: ['dream-database-optimization'],
});
```

### Update Dream Status

```typescript
DreamCortex.setDreamStatus('dream-api-optimization', 'blocked');
```

### Update Dream Priority

```typescript
DreamCortex.setDreamPriority('dream-api-optimization', 'critical');
```

### List Dreams

```typescript
const dreams = DreamCortex.listDreams();
dreams.forEach(dream => {
  console.log(`${dream.name}: ${dream.status} (${dream.priority})`);
  if (dream.score) {
    console.log(`Score: ${dream.score}`);
  }
});
```

### Run Cortex Cycle

```typescript
const status = DreamCortex.run({
  neuralMesh: neuralMesh,
  quantumAnticipation: qal,
  slugTime: slugTime,
  wolfPack: wolfPack,
  starBridge: starBridge,
});

console.log(`Dreams: ${status.dreamCount}`);
console.log(`Directives: ${status.directiveCount}`);
status.lastDirectives.forEach(directive => {
  console.log(`Directive: ${directive.intent} for ${directive.dreamId}`);
  console.log(`Reason: ${directive.reason}`);
  console.log(`Confidence: ${directive.confidence}`);
});
```

---

## Best Practices

1. **Dream Management**
   - Use clear names
   - Add descriptions
   - Set appropriate priorities
   - Track dependencies

2. **Status Management**
   - Update status regularly
   - Track progress
   - Resolve blockers
   - Complete dreams

3. **Directive Usage**
   - Follow directives
   - Act on recommendations
   - Track directive outcomes
   - Improve dream health

---

## Security Considerations

1. **Dream Security**
   - Validate dream data
   - Protect dream information
   - Audit dream changes
   - Prevent manipulation

2. **Directive Security**
   - Validate directives
   - Secure directive execution
   - Audit directive generation
   - Prevent abuse

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27
