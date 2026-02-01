# @dreamnet/event-wormholes

Event Wormholes - Teleport Channels for Packet Transportation

## Overview

Event Wormholes provide teleportation channels for moving packets across clusters, nodes, or external transports. They integrate with the internal-router to route packets through fiber-optic channels.

## Architecture

### Wormholes

Wormholes are endpoints that:
- Buffer packets for teleportation
- Connect to fiber channels (ALPHA, BETA, GAMMA, OMEGA)
- Support directional communication (in, out, bidirectional)
- Apply configurable buffer limits and drop policies

### Buffering

Packets are buffered per wormhole:
- Configurable buffer limit (default: 100 packets)
- Drop policies: "drop-oldest" or "drop-newest"
- Metrics tracking (enqueued, dropped, buffered counts)

### Dispatcher

The dispatcher bridges wormholes with the internal-router:
- `sendThroughWormhole()` - Enqueue packet to wormhole buffer
- `flushWormhole()` - Route buffered packets through router
- `flushAllWormholes()` - Flush all wormholes

## Usage

### Basic Wormhole Usage

```typescript
import { createPacket } from '@dreamnet/internal-ports';
import { sendThroughWormhole, flushWormhole } from '@dreamnet/event-wormholes';

// Create a packet
const packet = createPacket('wormhole.event', {
  event: 'teleport',
  data: { foo: 'bar' }
});

// Send through wormhole (enqueues to buffer)
const result = await sendThroughWormhole('WH-CORE-OMEGA', packet);
// Result: { ok: true }

// Later, flush the wormhole (routes buffered packets)
await flushWormhole('WH-CORE-OMEGA');
// Packets are routed via internal-router to event-wormhole port
```

### Registering Custom Wormholes

```typescript
import { registerWormhole, FIBERS } from '@dreamnet/event-wormholes';

registerWormhole({
  id: 'WH-CUSTOM-ALPHA',
  label: 'Custom Alpha Wormhole',
  direction: 'bidirectional',
  fiber: FIBERS.ALPHA,
  remoteHint: {
    region: 'us-east',
    cluster: 'production'
  }
});
```

### Configuration

```typescript
import { configureWormholes } from '@dreamnet/event-wormholes';

configureWormholes({
  bufferLimit: 200,
  dropPolicy: 'drop-newest',
  enableMetrics: true
});
```

### Metrics

```typescript
import { getWormholeStats } from '@dreamnet/event-wormholes';

const stats = getWormholeStats();
// {
//   'WH-CORE-OMEGA': {
//     buffered: 5,
//     enqueued: 42,
//     dropped: 2
//   }
// }
```

## Example

```typescript
import { createPacket } from '@dreamnet/internal-ports';
import { sendThroughWormhole, flushWormhole } from '@dreamnet/event-wormholes';

// 1. Create a packet
const packet = createPacket('wormhole.event', { foo: 'bar' });

// 2. Send through wormhole (buffers the packet)
await sendThroughWormhole('WH-CORE-OMEGA', packet);

// 3. Flush wormhole (routes buffered packets)
await flushWormhole('WH-CORE-OMEGA');

// The packet will be:
// - Routed via internal-router using OMEGA fiber
// - Matched to route: omega:wormhole.event
// - Delivered to event-wormhole port handler
// - Handler logs: "[Port Handler] Received packet type: wormhole.event (id: <uuid>)"
// - Returns: { ok: true }
```

## Default Wormhole

The following wormhole is automatically registered:

- **WH-CORE-OMEGA** (Core Omega Wormhole)
  - Direction: bidirectional
  - Fiber: OMEGA
  - Purpose: Primary event teleportation channel

## Status

**Current State**: In-memory teleportation system - buffers packets and routes them via internal-router.

**Future**: Will be integrated with external transports (HTTP, queues, WebSockets) for cross-cluster communication.

