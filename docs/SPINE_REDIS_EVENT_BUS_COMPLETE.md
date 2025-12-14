# Spine Redis Event Bus - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Spine Redis Event Bus provides **persistent and distributed event bus** using Redis pub/sub. It extends DreamEventBus with Redis persistence, distributed pub/sub, and event retrieval capabilities, enabling scalable event distribution across multiple instances.

---

## Key Features

### Redis Integration
- Redis pub/sub
- Event persistence
- Distributed events
- Event retrieval

### Event Bus Extension
- Extends DreamEventBus
- Local handler support
- Redis forwarding
- Event deduplication

### Configuration
- Redis connection options
- Channel prefixing
- Persistence toggle
- Pub/sub toggle

---

## Architecture

### Components

1. **Redis Event Bus** (`RedisEventBus.ts`)
   - Redis integration
   - Event persistence
   - Pub/sub distribution
   - Event retrieval

---

## API Reference

### Initialization

#### `new RedisEventBus(config?: RedisEventBusConfig): RedisEventBus`
Creates Redis Event Bus instance.

**Example**:
```typescript
import { RedisEventBus } from '@dreamnet/spine-redis-event-bus';

const bus = new RedisEventBus({
  redisUrl: 'redis://localhost:6379',
  channelPrefix: 'dreamnet:events:',
  enablePersistence: true,
  enablePubSub: true,
});

await bus.connect();
```

#### `connect(): Promise<void>`
Connects to Redis.

**Example**:
```typescript
await bus.connect();
```

### Event Operations

#### `publish(event: EventEnvelope): void`
Publishes event with Redis persistence and pub/sub.

**Example**:
```typescript
bus.publish({
  id: 'event-123',
  type: 'dream.created',
  payload: { dreamId: 'dream-123' },
  timestamp: Date.now(),
});
```

#### `getEventFromRedis(eventId: string): Promise<EventEnvelope | null>`
Gets event from Redis persistence.

**Example**:
```typescript
const event = await bus.getEventFromRedis('event-123');
if (event) {
  console.log(`Event: ${event.type}`);
}
```

---

## Data Models

### RedisEventBusConfig

```typescript
interface RedisEventBusConfig {
  redisUrl?: string;
  redisHost?: string;
  redisPort?: number;
  redisPassword?: string;
  channelPrefix?: string;
  enablePersistence?: boolean;
  enablePubSub?: boolean;
}
```

---

## Redis Configuration

### Connection Options
- **redisUrl**: Full Redis URL
- **redisHost**: Redis host (default: localhost)
- **redisPort**: Redis port (default: 6379)
- **redisPassword**: Redis password

### Features
- **enablePersistence**: Enable event persistence (default: true)
- **enablePubSub**: Enable pub/sub distribution (default: true)
- **channelPrefix**: Channel prefix (default: "dreamnet:events:")

---

## Event Persistence

### Storage
- Events stored in Redis with TTL (24 hours)
- Key format: `{channelPrefix}event:{eventId}`
- JSON serialization
- Automatic expiration

### Retrieval
- Get event by ID
- Fallback to local storage
- Error handling
- Null handling

---

## Pub/Sub Distribution

### Channels
- Channel format: `{channelPrefix}{eventType}`
- Pattern subscription: `{channelPrefix}*`
- Message format: JSON serialized event

### Deduplication
- Source tracking
- Avoid loops
- Instance identification
- Message filtering

---

## Integration Points

### DreamNet Systems
- **Event Wormholes**: Event forwarding
- **Nerve**: Event bus integration
- **Internal Router**: Event routing
- **DreamNet OS Core**: System events

### External Systems
- **Redis**: Redis server
- **Redis Cluster**: Redis cluster support

---

## Usage Examples

### Create and Connect

```typescript
const bus = new RedisEventBus({
  redisUrl: process.env.REDIS_URL,
});
await bus.connect();
```

### Publish Event

```typescript
bus.publish({
  id: 'event-123',
  type: 'dream.created',
  payload: { dreamId: 'dream-123' },
  timestamp: Date.now(),
});
```

### Retrieve Event

```typescript
const event = await bus.getEventFromRedis('event-123');
```

---

## Best Practices

1. **Redis Management**
   - Use connection pooling
   - Handle reconnections
   - Monitor Redis health
   - Set appropriate TTLs

2. **Event Distribution**
   - Use appropriate channels
   - Avoid event loops
   - Monitor pub/sub
   - Handle failures gracefully

---

## Security Considerations

1. **Redis Security**
   - Secure Redis connections
   - Use authentication
   - Encrypt in transit
   - Control access

2. **Event Security**
   - Validate event data
   - Sanitize payloads
   - Control event types
   - Monitor event flow

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

