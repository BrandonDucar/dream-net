# Nerve - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Nerve provides **pro-grade event bus** for DreamNet's nervous system. It features backpressure handling, priority-based queuing, pluggable transports, and comprehensive statistics. Acts as the central event fabric for DreamNet's biomimetic nervous system.

---

## Key Features

### Event Bus
- Priority-based queuing
- Backpressure handling
- Channel-based routing
- Event sampling
- Queue management

### Pluggable Transports
- External transport support
- Custom transport integration
- Transport registration
- Event forwarding

### Statistics
- Event tracking
- Channel statistics
- Priority statistics
- Queue monitoring
- Drop tracking

---

## Architecture

### Components

1. **Nerve Bus** (`bus.ts`)
   - Event bus implementation
   - Queue management
   - Transport integration
   - Statistics tracking

2. **Nerve Factory** (`factory.ts`)
   - Bus creation
   - Configuration
   - Default setup

3. **Nerve Subscribers** (`subscribers.ts`)
   - Subscriber management
   - Event handling
   - Subscription tracking

4. **Nerve Types** (`types.ts`)
   - Type definitions
   - Event types
   - Channel types
   - Priority types

---

## API Reference

### Bus Operations

#### `publish(event: NerveEvent): void`
Publishes an event to the bus.

**Example**:
```typescript
import { createNerveBus } from '@dreamnet/nerve';

const bus = createNerveBus();

bus.publish({
  id: 'event-123',
  channel: 'system',
  kind: 'alert',
  priority: 'high',
  payload: { message: 'Alert' },
  timestamp: Date.now(),
});
```

#### `subscribe(channelId: NerveChannelId, subscriber: NerveSubscriber): () => void`
Subscribes to events on a specific channel.

**Example**:
```typescript
const unsubscribe = bus.subscribe('system', (event) => {
  console.log('Received event:', event);
});

// Later...
unsubscribe();
```

#### `subscribeAll(subscriber: NerveSubscriber): () => void`
Subscribes to all events across all channels.

**Example**:
```typescript
const unsubscribe = bus.subscribeAll((event) => {
  console.log('All events:', event);
});
```

### Transport Operations

#### `registerTransport(transport: NerveTransport): void`
Registers a transport for external event routing.

**Example**:
```typescript
bus.registerTransport({
  name: 'kafka',
  send: async (event) => {
    await kafkaProducer.send(event);
  },
});
```

### Statistics

#### `getStats(): NerveBusStats`
Gets bus statistics.

**Example**:
```typescript
const stats = bus.getStats();
console.log(`Published: ${stats.published}`);
console.log(`Dropped: ${stats.dropped}`);
console.log(`Queue size: ${stats.queueSize}`);
```

---

## Data Models

### NerveEvent

```typescript
interface NerveEvent {
  id: string;
  channel: NerveChannelId;
  kind: string;
  priority: NervePriority;
  payload: any;
  timestamp: number;
  sampleRate?: number;
}
```

### NerveChannelId

```typescript
type NerveChannelId = string;
```

### NervePriority

```typescript
type NervePriority = 'low' | 'medium' | 'high' | 'critical';
```

### NerveBusStats

```typescript
interface NerveBusStats {
  published: number;
  dropped: number;
  byChannel: Record<string, number>;
  byKind: Record<string, number>;
  byPriority: Record<string, number>;
  queueSize: number;
}
```

---

## Queue Management

### Priority Tiers
- **Critical**: Highest priority
- **High**: High priority
- **Medium**: Normal priority
- **Low**: Low priority

### Drop Policies
- **drop_oldest**: Drop oldest events
- **drop_lowest_priority**: Drop lowest priority events
- **block**: Block until space available

### Queue Size
- Configurable max queue size
- Per-priority tier limits
- Backpressure handling

---

## Event Sampling

### Sample Rate
- Default sample rate (0-1)
- Per-event sample rate
- Reduces event volume
- Maintains observability

---

## Integration Points

### DreamNet Systems
- **Nervous System Core**: Central event bus
- **Event Wormholes**: Event forwarding
- **Internal Router**: Event routing
- **DreamNet OS Core**: System events

---

## Usage Examples

### Create Bus

```typescript
const bus = createNerveBus({
  maxQueueSize: 1000,
  dropPolicy: 'drop_oldest',
  defaultSampleRate: 0.1,
});
```

### Publish Event

```typescript
bus.publish({
  id: 'event-123',
  channel: 'system',
  kind: 'alert',
  priority: 'high',
  payload: { message: 'Alert' },
  timestamp: Date.now(),
});
```

### Subscribe to Events

```typescript
bus.subscribe('system', (event) => {
  console.log('System event:', event);
});
```

---

## Best Practices

1. **Event Publishing**
   - Use appropriate priorities
   - Set sample rates
   - Include timestamps
   - Structure payloads

2. **Subscriptions**
   - Subscribe to specific channels
   - Handle errors gracefully
   - Unsubscribe when done
   - Monitor performance

---

## Security Considerations

1. **Event Security**
   - Validate event data
   - Sanitize payloads
   - Control access
   - Monitor events

2. **Transport Security**
   - Secure transport connections
   - Validate transport data
   - Monitor transport usage
   - Audit transport access

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

