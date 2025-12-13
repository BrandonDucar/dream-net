# Spider Web Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Spider Web Core provides a **signal routing and thread execution system** for DreamNet. It catches "flies" (events/messages), creates signal threads, executes actions across spider nodes, and learns patterns for optimal routing.

---

## Key Features

### Signal Threads
- Thread creation from flies
- Thread execution
- Thread dependencies
- Thread templates

### Fly Catching
- Multiple fly types (message, mention, transaction, webhook, metric, alert, social, API)
- Fly priority levels
- Sticky flies
- Fly processing

### Web Sensors
- Multiple sensor types (Twilio, Telegram, Twitter, webhook, blockchain, email, API, social, metric)
- Sensor configuration
- Catch rate tracking
- Active/inactive sensors

### Thread Templates
- Template matching
- Template application
- Template learning
- Success rate tracking

### Pattern Learning
- Thread patterns
- Fly patterns
- Pattern discovery
- Pattern optimization

---

## Architecture

### Components

1. **Spider Store** (`store/spiderStore.ts`)
   - Thread storage
   - Fly storage
   - Sensor storage
   - Template storage

2. **Fly Catcher** (`logic/flyCatcher.ts`)
   - Fly creation
   - Fly catching
   - Thread generation

3. **Thread Executor** (`logic/threadExecutor.ts`)
   - Thread execution
   - Execution plans
   - Result handling

4. **Thread Templates** (`logic/threadTemplates.ts`)
   - Template management
   - Template matching
   - Template application

5. **Funnel Web Spider** (`logic/funnelWebSpider.ts`)
   - Sensor management
   - Default sensors
   - Sensor activation

---

## API Reference

### Thread Management

#### `listThreads(): SignalThread[]`
Lists all threads.

#### `getThread(id: string): SignalThread | undefined`
Gets a thread by ID.

#### `addThread(thread: SignalThread): SignalThread`
Adds a thread.

#### `executeThread(threadId: string, context: SpiderWebContext): Promise<{ success: boolean; result?: Record<string, any>; error?: string }>`
Executes a thread.

**Example**:
```typescript
import { SpiderWebCore } from '@dreamnet/spider-web-core';

const result = await SpiderWebCore.executeThread('thread-123', {
  wolfPack: wolfPack,
  whale: whale,
  // ... other nodes
});

if (result.success) {
  console.log('Thread executed:', result.result);
} else {
  console.error('Thread failed:', result.error);
}
```

### Fly Management

#### `catchFly(fly: Fly): SignalThread | null`
Catches a fly and creates a thread.

#### `createFly(type: FlyType, source: string, payload: Record<string, any>, priority?: FlyPriority, sticky?: boolean): Fly`
Creates a fly.

**Example**:
```typescript
const fly = SpiderWebCore.createFly(
  'message',
  'telegram',
  { text: 'Hello', userId: 'user-123' },
  'high',
  false
);

const thread = SpiderWebCore.catchFly(fly);
if (thread) {
  console.log('Thread created:', thread.id);
}
```

#### `listFlies(): Fly[]`
Lists all flies.

#### `listUnprocessedFlies(): Fly[]`
Lists unprocessed flies.

### Sensor Management

#### `addSensor(sensor: WebSensor): WebSensor`
Adds a sensor.

#### `ensureDefaultSensors(): WebSensor[]`
Ensures default sensors exist.

### Template Management

#### `addTemplate(template: ThreadTemplate): ThreadTemplate`
Adds a thread template.

#### `findMatchingTemplate(thread: SignalThread): ThreadTemplate | undefined`
Finds matching template.

### Execution

#### `run(context: SpiderWebContext): Promise<SpiderWebStatus>`
Runs Spider Web cycle.

#### `status(): SpiderWebStatus`
Gets Spider Web status.

---

## Data Models

### SpiderNodeKind

```typescript
type SpiderNodeKind =
  | 'wolf'
  | 'whale'
  | 'orca'
  | 'dream-state'
  | 'os'
  | 'narrative'
  | 'data-vault'
  | 'economic-engine'
  | 'neural-mesh'
  | 'other';
```

### SignalKind

```typescript
type SignalKind =
  | 'wolf-win-story'
  | 'whale-hook-crosspost'
  | 'dream-state-decision'
  | 'status-broadcast'
  | 'data-ingest'
  | 'legal-review'
  | 'fly-caught'
  | 'message-response'
  | 'revenue-event'
  | 'engagement-event'
  | 'custom';
```

### SignalThread

```typescript
interface SignalThread {
  id: string;
  source: SpiderNodeRef;
  targets: SpiderNodeRef[];
  kind: SignalKind;
  payload?: Record<string, any>;
  status: SignalStatus;
  priority: ThreadPriority;
  createdAt: number;
  updatedAt: number;
  executedAt?: number;
  executionResult?: Record<string, any>;
  error?: string;
  dependsOn?: string[];
  triggers?: string[];
  responseThreadId?: string;
  parentThreadId?: string;
  templateId?: string;
  executable: boolean;
  executionPlan?: ExecutionPlan;
}
```

### Fly

```typescript
interface Fly {
  id: string;
  type: FlyType;
  source: string;
  payload: Record<string, any>;
  caughtAt: number;
  priority: FlyPriority;
  sticky: boolean;
  processed: boolean;
  threadId?: string;
  meta?: Record<string, any>;
}
```

### WebSensor

```typescript
interface WebSensor {
  id: string;
  type: SensorType;
  active: boolean;
  config: Record<string, any>;
  catchRate: number;
  lastCheckAt?: number;
  meta?: Record<string, any>;
}
```

---

## Thread Execution

### Execution Plan
- Step-by-step execution
- Target nodes
- Action parameters
- Rollback steps

### Execution Steps
- Action identification
- Target node selection
- Parameter passing
- Result collection

---

## Pattern Learning

### Thread Patterns
- Pattern discovery
- Success rate tracking
- Usage frequency
- Optimization recommendations

### Fly Patterns
- Common payload keys
- Typical thread kinds
- Frequency tracking
- Pattern recognition

---

## Integration Points

### DreamNet Systems
- **Wolf Pack**: Funding signals
- **Whale**: Social signals
- **Orca**: Communication signals
- **Dream State**: Governance signals
- **Neural Mesh**: Pattern learning

### External Systems
- **Twilio**: SMS/voice
- **Telegram**: Messaging
- **Twitter**: Social
- **Webhooks**: Events
- **Blockchain**: Transactions

---

## Usage Examples

### Create and Catch Fly

```typescript
const fly = SpiderWebCore.createFly(
  'webhook',
  'stripe',
  { event: 'payment.succeeded', amount: 100 },
  'high'
);

const thread = SpiderWebCore.catchFly(fly);
if (thread) {
  console.log(`Thread created: ${thread.id}`);
  console.log(`Kind: ${thread.kind}`);
  console.log(`Priority: ${thread.priority}`);
}
```

### Execute Thread

```typescript
const result = await SpiderWebCore.executeThread('thread-123', {
  wolfPack: wolfPack,
  whale: whale,
  orca: orca,
  dreamState: dreamState,
});

if (result.success) {
  console.log('Execution result:', result.result);
} else {
  console.error('Execution error:', result.error);
}
```

### Add Sensor

```typescript
const sensor = SpiderWebCore.addSensor({
  id: 'sensor-telegram',
  type: 'telegram',
  active: true,
  config: {
    botToken: 'token-123',
    chatId: 'chat-456',
  },
  catchRate: 0,
});
```

---

## Best Practices

1. **Thread Design**
   - Define clear execution plans
   - Set appropriate priorities
   - Handle dependencies
   - Track execution results

2. **Fly Management**
   - Use appropriate types
   - Set correct priorities
   - Mark sticky flies
   - Process promptly

3. **Pattern Learning**
   - Monitor patterns
   - Optimize templates
   - Track success rates
   - Improve routing

---

## Security Considerations

1. **Thread Security**
   - Validate execution plans
   - Secure thread data
   - Audit thread execution
   - Prevent manipulation

2. **Fly Security**
   - Validate fly data
   - Sanitize payloads
   - Secure fly sources
   - Audit fly processing

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

