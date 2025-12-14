# Nervous System Core

Modular architecture connecting Citadel, Drone Dome, Shared Memory, and Message Bus.

## Architecture Model

- **DreamNet OS** = Body (runtime + I/O + scheduling)
- **Citadel** = Prefrontal cortex (planning/orchestration)
- **Drone Dome** = Sensory cortex + radar (world scanning + telemetry)
- **Shared Memory** = Hippocampus (short/mid-term state, vectors, caches)
- **Message Bus** = Spinal cord (reflex lanes + reliable delivery)

## Components

### Message Bus
Topic-based routing on top of Nerve Bus, with correlation IDs, TTL, and role-based filtering.

### Shared Memory
Three-layer memory system:
- **KV**: Key-value storage with TTL
- **Doc**: Document storage with query
- **Vec**: Vector storage (uses Neural Mesh)

### Citadel Integration
Enhances Citadel Core with message bus integration for task.plan → task.exec flow.

### Drone Dome Integration
Enhances Drone Dome Scanner with message bus integration for intel.snapshot publishing.

## Usage

```typescript
import { NervousSystemCore, nervousMessageBus, sharedMemory } from '@dreamnet/nervous-system-core';

// Publish a message
nervousMessageBus.publish({
  id: 'msg-123',
  ts: Date.now(),
  role: 'sensor',
  topic: 'telemetry',
  payload: { metrics: {...} },
});

// Subscribe to messages
nervousMessageBus.subscribe('telemetry', (msg) => {
  console.log('Received telemetry:', msg.payload);
});

// Use shared memory
await sharedMemory.kv.put('key', 'value', 300); // 5min TTL
const value = await sharedMemory.kv.get('key');

await sharedMemory.doc.upsert('doc-1', { name: 'test' });
const doc = await sharedMemory.doc.read('doc-1');
```

## Integration

- Enhances `@dreamnet/nerve` (Nerve Bus)
- Uses `@dreamnet/neural-mesh` for vector storage
- Enhances `@dreamnet/citadel-core` with message bus
- Integrates with `@dreamnet/spider-web-core` for event routing

