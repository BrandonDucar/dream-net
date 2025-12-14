# Event Wormholes - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Event Wormholes provides **teleportation channels for packet transportation** across clusters, nodes, or external transports. It integrates with the internal-router to route packets through fiber-optic channels, enabling efficient cross-cluster communication.

---

## Key Features

### Wormhole Endpoints
- Bidirectional communication
- Directional communication (in/out)
- Fiber channel routing
- Remote endpoint hints

### Packet Buffering
- Configurable buffer limits
- Drop policies (oldest/newest)
- Metrics tracking
- Buffer management

### Event Processing
- Event matching
- Wormhole routing
- Task creation
- HALO Loop integration

---

## Architecture

### Components

1. **Wormhole Registry** (`src/wormholes.ts`)
   - Wormhole registration
   - Buffer management
   - Statistics tracking

2. **Dispatcher** (`src/dispatcher.ts`)
   - Packet routing
   - Buffer flushing
   - Router integration

3. **Wormhole Engine** (`src/wormholeEngine.ts`)
   - Event processing
   - Task creation
   - HALO Loop triggers

4. **Slime Mold Router** (`src/slimeRouter.ts`)
   - Optimal path finding
   - Network topology
   - Adaptive routing

---

## API Reference

### Wormhole Management

#### `registerWormhole(endpoint: WormholeEndpoint): void`
Registers a wormhole endpoint.

**Example**:
```typescript
import { registerWormhole, FIBERS } from '@dreamnet/event-wormholes';

registerWormhole({
  id: 'WH-CUSTOM-ALPHA',
  label: 'Custom Alpha Wormhole',
  direction: 'bidirectional',
  fiber: FIBERS.ALPHA,
  remoteHint: {
    region: 'us-east',
    cluster: 'custom-cluster',
  },
});
```

#### `getWormhole(wormholeId: WormholeId): WormholeEndpoint | undefined`
Gets a wormhole by ID.

#### `listWormholes(): WormholeEndpoint[]`
Lists all registered wormholes.

### Packet Operations

#### `sendThroughWormhole(wormholeId: WormholeId, packet: DreamPacket): Promise<WormholeResult>`
Sends a packet through a wormhole (enqueues to buffer).

**Example**:
```typescript
import { sendThroughWormhole } from '@dreamnet/event-wormholes';
import { createPacket } from '@dreamnet/internal-ports';

const packet = createPacket('wormhole.event', {
  event: 'teleport',
  data: { foo: 'bar' },
});

const result = await sendThroughWormhole('WH-CORE-OMEGA', packet);
// { ok: true }
```

#### `flushWormhole(wormholeId: WormholeId): Promise<void>`
Flushes buffered packets from a wormhole.

#### `flushAllWormholes(): Promise<void>`
Flushes all wormholes.

### Statistics

#### `getWormholeStats(wormholeId: WormholeId): WormholeStats | undefined`
Gets statistics for a wormhole.

#### `getBufferedCount(wormholeId: WormholeId): number`
Gets buffered packet count.

---

## Data Models

### WormholeEndpoint

```typescript
interface WormholeEndpoint {
  id: WormholeId;
  label: string;
  direction: 'in' | 'out' | 'bidirectional';
  fiber: string;
  remoteHint?: RemoteHint;
}
```

### WormholeConfig

```typescript
interface WormholeConfig {
  bufferLimit: number;
  dropPolicy: 'drop-oldest' | 'drop-newest';
  enableMetrics: boolean;
}
```

### WormholeStats

```typescript
interface WormholeStats {
  buffered: number;
  enqueued: number;
  dropped: number;
}
```

### RemoteHint

```typescript
interface RemoteHint {
  region?: string;
  cluster?: string;
  url?: string;
}
```

---

## Default Wormholes

### Core Omega Wormhole
- **ID**: `WH-CORE-OMEGA`
- **Fiber**: OMEGA
- **Purpose**: Primary event teleportation channel

### TravelNet Gamma Wormhole
- **ID**: `WH-TRAVELNET-GAMMA`
- **Fiber**: GAMMA
- **Purpose**: Travel network teleportation

### MILNET Beta Wormhole
- **ID**: `WH-MILNET-BETA`
- **Fiber**: BETA
- **Purpose**: Military/defense network

### OTTNET Gamma Wormhole
- **ID**: `WH-OTTNET-GAMMA`
- **Fiber**: GAMMA
- **Purpose**: Streaming/media network

### METALNET Alpha Wormhole
- **ID**: `WH-METALNET-ALPHA`
- **Fiber**: ALPHA
- **Purpose**: Precious metals network

### Archimedes Epsilon Wormhole
- **ID**: `WH-ARCHIMEDES-EPSILON`
- **Fiber**: EPSILON
- **Purpose**: Science/research network

---

## Fiber Channels

- **ALPHA**: High-priority channels
- **BETA**: Secure channels
- **GAMMA**: Standard channels
- **OMEGA**: Core channels
- **EPSILON**: Research/science channels

---

## Event Processing

### Event Matching
- Match events to wormholes
- Filter by event type
- Filter by severity
- Route to matching wormholes

### Task Creation
- Create suggested tasks from events
- Require approval
- Link to events
- Track task status

### HALO Loop Integration
- Trigger HALO Loop for critical events
- Error event handling
- Self-healing triggers
- Recovery actions

---

## Integration Points

### DreamNet Systems
- **Internal Router**: Packet routing
- **Internal Ports**: Packet creation
- **HALO Loop**: Self-healing
- **Event Bus**: Event emission

### External Systems
- **WebSocket**: Real-time transport
- **HTTP**: REST transport
- **Message Queue**: Queue transport

---

## Usage Examples

### Register Custom Wormhole

```typescript
import { registerWormhole, FIBERS } from '@dreamnet/event-wormholes';

registerWormhole({
  id: 'WH-MY-CLUSTER',
  label: 'My Cluster Wormhole',
  direction: 'bidirectional',
  fiber: FIBERS.GAMMA,
  remoteHint: {
    region: 'us-west',
    cluster: 'my-cluster',
    url: 'https://my-cluster.example.com',
  },
});
```

### Send Packet Through Wormhole

```typescript
import { sendThroughWormhole, flushWormhole } from '@dreamnet/event-wormholes';
import { createPacket } from '@dreamnet/internal-ports';

const packet = createPacket('wormhole.event', {
  event: 'data-sync',
  data: { userId: 'user-123', data: { ... } },
});

// Enqueue packet
const result = await sendThroughWormhole('WH-CORE-OMEGA', packet);

// Flush wormhole to route packets
await flushWormhole('WH-CORE-OMEGA');
```

### Get Wormhole Statistics

```typescript
import { getWormholeStats } from '@dreamnet/event-wormholes';

const stats = getWormholeStats('WH-CORE-OMEGA');
console.log(`Buffered: ${stats?.buffered}`);
console.log(`Enqueued: ${stats?.enqueued}`);
console.log(`Dropped: ${stats?.dropped}`);
```

---

## Best Practices

1. **Wormhole Design**
   - Use appropriate fiber channels
   - Set clear labels
   - Define remote hints
   - Document purpose

2. **Buffer Management**
   - Set appropriate buffer limits
   - Choose drop policy
   - Monitor statistics
   - Flush regularly

3. **Event Routing**
   - Match events carefully
   - Use appropriate wormholes
   - Monitor routing
   - Handle errors

---

## Security Considerations

1. **Packet Security**
   - Validate packets
   - Sanitize data
   - Encrypt sensitive data
   - Audit routing

2. **Wormhole Security**
   - Authenticate wormholes
   - Validate remote hints
   - Monitor access
   - Prevent abuse

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

