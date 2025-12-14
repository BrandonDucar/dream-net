# Fiber-Optic Middleware System Complete Documentation

## Overview

The Fiber-Optic Middleware System provides high-speed, channelized internal communication for DreamNet subsystems. It uses a biomimetic "nervous system" architecture with fiber-optic channels, ports, routers, wormholes, and a central event fabric.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Internal Ports System](#internal-ports-system)
3. [Laser Router](#laser-router)
4. [Event Wormholes](#event-wormholes)
5. [Nerve Fiber Event Fabric](#nerve-fiber-event-fabric)
6. [Integration Status](#integration-status)
7. [Usage Examples](#usage-examples)
8. [Gap Analysis](#gap-analysis)
9. [Activation Plan](#activation-plan)

---

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Fiber-Optic Middleware                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │   Fibers     │───▶│    Ports     │───▶│   Handlers   │   │
│  │  (Channels)  │    │  (Endpoints)│    │  (Functions)  │   │
│  └──────────────┘    └──────────────┘    └──────────────┘   │
│         │                    │                    │          │
│         ▼                    ▼                    ▼          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │    Router    │───▶│  Wormholes   │───▶│  Nerve Bus   │   │
│  │  (Routing)   │    │ (Teleport)   │    │  (Events)    │   │
│  └──────────────┘    └──────────────┘    └──────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Fiber Channels

Four primary fiber-optic channels for internal routing:

- **ALPHA** - Primary system channel (DreamNet Core, StarBridge, METALNET)
- **BETA** - Security and defense channel (Shield Core, DreamVault, MILNET)
- **GAMMA** - Mesh and network channel (Mesh Core, DreamShop, TravelNet, OTTNET)
- **OMEGA** - Event routing channel (Event Wormholes)

### Data Flow

1. **Packet Creation** → Create a `DreamPacket` with type and payload
2. **Fiber Selection** → Choose appropriate fiber channel (ALPHA/BETA/GAMMA/OMEGA)
3. **Routing** → Laser Router matches fiber + type → port
4. **Port Handler** → Handler function processes the packet
5. **Wormhole (Optional)** → Buffer and teleport across clusters
6. **Nerve Bus** → Emit events to subscribers

---

## Internal Ports System

**Package**: `@dreamnet/internal-ports`  
**Location**: `packages/internal-ports/`

### Purpose

Provides declarative port-based communication endpoints for DreamNet subsystems. Ports are endpoints connected to fiber channels that process incoming packets.

### Core Concepts

#### Fibers

Fiber-optic laser channels for internal routing:

```typescript
export const FIBERS = {
  ALPHA: 'alpha',   // Primary system channel
  BETA: 'beta',     // Security and defense channel
  GAMMA: 'gamma',   // Mesh and network channel
  OMEGA: 'omega'    // Event routing channel
};
```

#### Packets

Standardized packet format for internal communication:

```typescript
interface DreamPacket {
  id: string;           // UUID
  type: string;         // Event type (e.g., 'dream.created')
  payload: any;         // Data
  metadata?: object;     // Optional metadata
  timestamp: number;    // Unix timestamp
}
```

#### Ports

Ports are endpoints connected to fiber channels:

```typescript
interface DreamPort {
  id: string;                    // Unique port identifier
  label: string;                  // Human-readable label
  direction: 'in' | 'out' | 'bidirectional';
  fiber: FiberChannel;            // ALPHA, BETA, GAMMA, or OMEGA
  handler: (packet: DreamPacket) => Promise<any>;
}
```

### Default Ports

The following ports are automatically registered on module load:

| Port ID | Label | Fiber | Purpose |
|---------|-------|-------|---------|
| `dreamnet-core` | DreamNet Core | ALPHA | Core operations |
| `shield-core` | Shield Core | BETA | Security |
| `mesh-core` | Mesh Core | GAMMA | Networking |
| `event-wormhole` | Event Wormhole | OMEGA | Event routing |
| `dream-vault` | DreamVault | BETA | Storage |
| `dream-shop` | DreamShop | GAMMA | Marketplace |
| `star-bridge` | StarBridge | ALPHA | Cross-chain |
| `travelnet-core` | TravelNet Core | GAMMA | Travel network |
| `milnet-core` | MILNET Core | BETA | Defense network |
| `ottnet-core` | OTTNET Core | GAMMA | Media/streaming |
| `metalnet-core` | METALNET Core | ALPHA | Precious metals |

### API

#### Creating a Packet

```typescript
import { createPacket } from '@dreamnet/internal-ports';

const packet = createPacket('dream.created', {
  dreamId: 'dream-123',
  creator: '0x...'
});
```

#### Registering a Port

```typescript
import { registerPort, createPort, FIBERS } from '@dreamnet/internal-ports';

registerPort(createPort(
  'my-port',
  'My Port',
  'bidirectional',
  FIBERS.ALPHA,
  async (packet) => {
    console.log('Received:', packet.type);
    return { ok: true };
  }
));
```

#### Looking Up Ports

```typescript
import { getPort, listPorts, getPortsByFiber } from '@dreamnet/internal-ports';

const port = getPort('dreamnet-core');
const allPorts = listPorts();
const alphaPorts = getPortsByFiber(FIBERS.ALPHA);
```

### Status

**Current State**: ✅ Declarative system - ports are registered but not wired to actual subsystems.

**Usage**: Used by `server/system/inspector.ts` and `server/system/graph.ts` for system inspection.

**Future**: Ports will be connected to actual subsystem implementations for internal communication.

---

## Laser Router

**Package**: `@dreamnet/internal-router`  
**Location**: `packages/internal-router/`

### Purpose

Provides intelligent packet routing for DreamNet's internal fiber-optic communication system. Routes packets to appropriate port handlers based on fiber channels and packet types.

### Core Concepts

#### Routing Table

Routes are keyed by:
- **Fiber Channel** (ALPHA, BETA, GAMMA, OMEGA)
- **Packet Type** (e.g., 'dreamnet.event', 'shield.event')

Route format: `${fiber}:${type}` → `portId`

#### Router Configuration

```typescript
interface RouterConfig {
  defaultFiber?: FiberChannel;    // Default channel when not specified
  allowFallback?: boolean;        // Attempt fallback routing
  strict?: boolean;               // Throw errors vs soft-fail
}
```

### Default Routes

The following routes are automatically registered:

| Route Key | Target Port | Description |
|-----------|-------------|-------------|
| `alpha:dreamnet.event` | `dreamnet-core` | DreamNet Core events |
| `beta:shield.event` | `shield-core` | Shield Core security events |
| `gamma:mesh.event` | `mesh-core` | Mesh Core network events |
| `omega:wormhole.event` | `event-wormhole` | Event Wormhole events |
| `gamma:travelnet.event` | `travelnet-core` | TravelNet events |
| `beta:milnet.event` | `milnet-core` | MILNET events |
| `gamma:ottnet.event` | `ottnet-core` | OTTNET events |
| `alpha:metalnet.event` | `metalnet-core` | METALNET events |

### API

#### Basic Routing

```typescript
import { createPacket } from '@dreamnet/internal-ports';
import { routePacket, FIBERS } from '@dreamnet/internal-router';

const packet = createPacket('dreamnet.event', {
  event: 'dream.created',
  dreamId: 'dream-123'
});

const result = await routePacket(packet, { fiber: FIBERS.ALPHA });
// Result: { ok: true } (from DreamNet Core port handler)
```

#### Registering Custom Routes

```typescript
import { registerRoute, FIBERS } from '@dreamnet/internal-router';

registerRoute({
  key: {
    fiber: FIBERS.BETA,
    type: 'custom.event'
  },
  target: {
    portId: 'my-custom-port'
  },
  description: 'Custom event routing'
});
```

#### Router Configuration

```typescript
import { configureRouter, FIBERS } from '@dreamnet/internal-router';

configureRouter({
  defaultFiber: FIBERS.ALPHA,
  allowFallback: true,
  strict: false
});
```

#### Metrics

```typescript
import { getRouteStats } from '@dreamnet/internal-router';

const stats = getRouteStats();
// { 'alpha:dreamnet.event': { count: 42 }, ... }
```

### Status

**Current State**: ✅ Declarative routing system - routes packets to registered ports.

**Usage**: Used by Event Wormholes dispatcher for routing buffered packets.

**Future**: Will be integrated into DreamNet subsystems for internal communication.

---

## Event Wormholes

**Package**: `@dreamnet/event-wormholes`  
**Location**: `packages/event-wormholes/`

### Purpose

Provides teleportation channels for moving packets across clusters, nodes, or external transports. Integrates with the internal-router to route packets through fiber-optic channels.

### Core Concepts

#### Wormholes

Wormholes are endpoints that:
- Buffer packets for teleportation
- Connect to fiber channels (ALPHA, BETA, GAMMA, OMEGA)
- Support directional communication (in, out, bidirectional)
- Apply configurable buffer limits and drop policies

#### Buffering

Packets are buffered per wormhole:
- Configurable buffer limit (default: 100 packets)
- Drop policies: "drop-oldest" or "drop-newest"
- Metrics tracking (enqueued, dropped, buffered counts)

#### Dispatcher

The dispatcher bridges wormholes with the internal-router:
- `sendThroughWormhole()` - Enqueue packet to wormhole buffer
- `flushWormhole()` - Route buffered packets through router
- `flushAllWormholes()` - Flush all wormholes

### Default Wormholes

The following wormholes are automatically registered:

| Wormhole ID | Label | Fiber | Purpose |
|-------------|-------|-------|---------|
| `WH-CORE-OMEGA` | Core Omega Wormhole | OMEGA | Primary event teleportation |
| `WH-TRAVELNET-GAMMA` | TravelNet Gamma Wormhole | GAMMA | Travel network teleportation |
| `WH-MILNET-BETA` | MILNET Beta Wormhole | BETA | Defense network teleportation |
| `WH-OTTNET-GAMMA` | OTTNET Gamma Wormhole | GAMMA | Media/streaming teleportation |
| `WH-METALNET-ALPHA` | METALNET Alpha Wormhole | ALPHA | Precious metals teleportation |
| `WH-ARCHIMEDES-EPSILON` | Archimedes Epsilon Wormhole | EPSILON | Research/science teleportation |

### API

#### Basic Wormhole Usage

```typescript
import { createPacket } from '@dreamnet/internal-ports';
import { sendThroughWormhole, flushWormhole } from '@dreamnet/event-wormholes';

const packet = createPacket('wormhole.event', {
  event: 'teleport',
  data: { foo: 'bar' }
});

// Send through wormhole (enqueues to buffer)
await sendThroughWormhole('WH-CORE-OMEGA', packet);

// Later, flush the wormhole (routes buffered packets)
await flushWormhole('WH-CORE-OMEGA');
```

#### Registering Custom Wormholes

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

#### Configuration

```typescript
import { configureWormholes } from '@dreamnet/event-wormholes';

configureWormholes({
  bufferLimit: 200,
  dropPolicy: 'drop-newest',
  enableMetrics: true
});
```

#### Metrics

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

### Status

**Current State**: ✅ In-memory teleportation system - buffers packets and routes them via internal-router.

**Usage**: Used by `server/routes/forge.ts` for emitting events.

**Future**: Will be integrated with external transports (HTTP, queues, WebSockets) for cross-cluster communication.

---

## Nerve Fiber Event Fabric

**Package**: `@dreamnet/nerve`  
**Location**: `packages/nerve/`

### Purpose

Central event bus for DreamNet's nervous system. Provides pro-grade event bus with backpressure, priorities, and pluggable transports.

### Core Concepts

#### Nerve Events

Events published to the Nerve Bus:

```typescript
interface NerveEvent {
  id: string;                    // UUID
  channelId: NerveChannelId;     // Channel identifier
  kind: string;                  // Event kind
  priority: NervePriority;       // 1-5 (5 = highest)
  context: {
    traceId?: string;
    sampled?: boolean;
    [key: string]: unknown;
  };
  payload: Record<string, unknown>;
  timestamp: number;
}
```

#### Channels

Event channels for categorization:
- `HTTP_REQUEST` - HTTP request events
- `SHIELD_EVENT` - Security events
- `DREAM_SCOPE` - DreamScope events
- `API_KEEPER` - API events
- Custom channels

#### Priorities

Priority levels (1-5, 5 = highest):
- **5** - Critical (immediate processing)
- **4** - High (urgent)
- **3** - Medium (normal)
- **2** - Low (deferred)
- **1** - Background (lowest)

#### Queue Management

- Maximum queue size: 10,000 events (configurable)
- Drop policy: "drop_lowest_priority" (configurable)
- Default sample rate: 0.1 (10% sampling)

### API

#### Publishing Events

```typescript
import { NERVE_BUS } from '@dreamnet/nerve/bus';
import { createNerveEvent } from '@dreamnet/nerve/factory';

const event = createNerveEvent({
  channelId: 'HTTP_REQUEST',
  kind: 'REQUEST_DECISION',
  priority: 3,
  context: {
    traceId: 'trace-123',
    tierId: 'STANDARD',
  },
  payload: {
    method: 'POST',
    path: '/api/dreams',
  },
});

NERVE_BUS.publish(event);
```

#### Subscribing to Events

```typescript
import { NERVE_BUS } from '@dreamnet/nerve/bus';

// Subscribe to specific channel
const unsubscribe = NERVE_BUS.subscribe('HTTP_REQUEST', (event) => {
  console.log('HTTP request event:', event);
});

// Subscribe to all events
const unsubscribeAll = NERVE_BUS.subscribeAll((event) => {
  console.log('Any event:', event);
});
```

#### Registering Transports

```typescript
import { NERVE_BUS } from '@dreamnet/nerve/bus';

NERVE_BUS.registerTransport({
  name: 'external-api',
  send: async (event) => {
    // Send to external API
    await fetch('https://api.example.com/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  },
});
```

#### Getting Statistics

```typescript
import { NERVE_BUS } from '@dreamnet/nerve/bus';

const stats = NERVE_BUS.getStats();
// {
//   published: 1000,
//   dropped: 5,
//   byChannel: { 'HTTP_REQUEST': 500, ... },
//   byKind: { 'REQUEST_DECISION': 300, ... },
//   byPriority: { '3': 400, ... },
//   queueSize: 10
// }
```

### Status

**Current State**: ⚠️ **COMMENTED OUT** - Nerve Fabric initialization is disabled in `server/index.ts` (lines 1225-1249).

**Usage**: Used by:
- `server/routes/nerve.ts` - Nerve stats endpoint
- `server/routes/env-keeper.ts` - Environment events
- `server/routes/ports-ops.ts` - Port operations
- `server/middleware/autoSEO.ts` - SEO events
- `packages/agent-gateway/src/executor.ts` - Tool execution events

**Future**: Enable Nerve Fabric initialization and wire to subsystems.

---

## Integration Status

### Component Status

| Component | Status | Integration | Notes |
|-----------|--------|-------------|-------|
| **Internal Ports** | ✅ Working | ⚠️ Partial | Used by inspector/graph, not wired to subsystems |
| **Laser Router** | ✅ Working | ❌ Not Active | Routes registered but not used in request flow |
| **Event Wormholes** | ✅ Working | ⚠️ Partial | Used by forge.ts, commented out in operator.ts |
| **Nerve Fabric** | ✅ Working | ❌ Disabled | Initialization commented out in server/index.ts |

### Server Integration Points

#### Active Usage

1. **`server/system/inspector.ts`**
   - Uses `getPortsSnapshot()`, `getRoutesSnapshot()`, `getWormholesSnapshot()`
   - Provides system inspection API

2. **`server/system/graph.ts`**
   - Uses internal-ports for system graph generation

3. **`server/routes/forge.ts`**
   - Uses `emitEvent()` from event-wormholes
   - Emits events for API failures

4. **`server/routes/nerve.ts`**
   - Uses `NERVE_BUS` for stats endpoint
   - Provides Nerve Bus statistics API

#### Commented Out / Disabled

1. **`server/index.ts` (lines 1225-1249)**
   - Nerve Fabric initialization is commented out
   - Would initialize fabric and register subscribers

2. **`server/routes/operator.ts`**
   - Wormhole imports are commented out
   - Would use wormholes for operator events

### Missing Connections

1. **Express Middleware Integration**
   - No middleware to convert HTTP requests → Packets → Ports
   - No automatic packet creation from requests

2. **Subsystem Wiring**
   - Ports registered but handlers are placeholders
   - Actual subsystems not connected to ports

3. **Request Flow**
   - No Request → Packet → Router → Port → Handler flow
   - Express routes bypass fiber-optic system

4. **Event Bus Integration**
   - Nerve Bus not initialized
   - Events not flowing through Nerve Fabric

---

## Usage Examples

### Example 1: Creating and Routing a Packet

```typescript
import { createPacket } from '@dreamnet/internal-ports';
import { routePacket, FIBERS } from '@dreamnet/internal-router';

// Create a packet
const packet = createPacket('dreamnet.event', {
  event: 'dream.created',
  dreamId: 'dream-123',
  creator: '0x...'
});

// Route through ALPHA fiber
const result = await routePacket(packet, { fiber: FIBERS.ALPHA });
// Routes to dreamnet-core port handler
```

### Example 2: Using Wormholes for Teleportation

```typescript
import { createPacket } from '@dreamnet/internal-ports';
import { sendThroughWormhole, flushWormhole } from '@dreamnet/event-wormholes';

// Create packet
const packet = createPacket('wormhole.event', {
  event: 'teleport',
  data: { foo: 'bar' }
});

// Buffer in wormhole
await sendThroughWormhole('WH-CORE-OMEGA', packet);

// Later, flush (routes through router)
await flushWormhole('WH-CORE-OMEGA');
```

### Example 3: Publishing to Nerve Bus

```typescript
import { NERVE_BUS } from '@dreamnet/nerve/bus';
import { createNerveEvent } from '@dreamnet/nerve/factory';

// Create event
const event = createNerveEvent({
  channelId: 'HTTP_REQUEST',
  kind: 'REQUEST_DECISION',
  priority: 3,
  context: { traceId: 'trace-123' },
  payload: { method: 'POST', path: '/api/dreams' },
});

// Publish
NERVE_BUS.publish(event);
```

### Example 4: Custom Port Registration

```typescript
import { registerPort, createPort, FIBERS } from '@dreamnet/internal-ports';

registerPort(createPort(
  'my-custom-port',
  'My Custom Port',
  'bidirectional',
  FIBERS.ALPHA,
  async (packet) => {
    // Custom handler logic
    console.log('Custom port received:', packet.type);
    
    // Process packet
    const result = await processPacket(packet);
    
    return { ok: true, result };
  }
));
```

---

## Gap Analysis

### What's Working

✅ **Port Registration** - Ports are registered and can be looked up  
✅ **Packet Creation** - Packets can be created with proper format  
✅ **Router Lookup** - Router can find routes and ports  
✅ **Wormhole Buffering** - Wormholes can buffer packets  
✅ **Nerve Bus** - Event bus is functional (when initialized)

### What's Disabled

❌ **Nerve Fabric Initialization** - Commented out in server/index.ts  
❌ **Wormhole Usage** - Commented out in operator.ts  
❌ **Request → Packet Flow** - No Express middleware integration

### What's Missing

🔴 **Port Handler Wiring** - Ports have placeholder handlers, not connected to subsystems  
🔴 **Express Middleware** - No middleware to convert requests to packets  
🔴 **Subsystem Integration** - Subsystems don't use ports for communication  
🔴 **Event Flow** - Events don't flow through Nerve Fabric  
🔴 **Metrics/Observability** - Limited metrics and observability

---

## Activation Plan

### Phase 1: Enable Nerve Fabric

**Goal**: Enable Nerve Fabric initialization and basic event flow.

**Steps**:
1. Uncomment Nerve Fabric initialization in `server/index.ts` (lines 1225-1249)
2. Verify subscribers are registered correctly
3. Test event publishing and subscription
4. Monitor Nerve Bus stats

**Files to Modify**:
- `server/index.ts`

### Phase 2: Wire Port Handlers

**Goal**: Connect actual subsystem implementations to port handlers.

**Steps**:
1. Identify subsystems that should use ports (DreamNet Core, Shield Core, etc.)
2. Replace placeholder handlers with actual subsystem calls
3. Test packet routing to subsystems
4. Verify handler responses

**Files to Modify**:
- `packages/internal-ports/src/index.ts` (default port handlers)

### Phase 3: Express Middleware Integration

**Goal**: Convert HTTP requests to packets and route through fiber-optic system.

**Steps**:
1. Create Express middleware to convert requests → packets
2. Route packets through Laser Router
3. Return handler responses as HTTP responses
4. Test request flow

**Files to Create**:
- `server/middleware/fiber-optic.ts`

**Files to Modify**:
- `server/index.ts` (add middleware)

### Phase 4: Subsystem Integration

**Goal**: Integrate subsystems to use ports for internal communication.

**Steps**:
1. Identify internal communication points in subsystems
2. Replace direct calls with packet-based communication
3. Test subsystem-to-subsystem communication
4. Monitor performance

**Subsystems to Integrate**:
- DreamNet Core
- Shield Core
- Mesh Core
- DreamVault
- DreamShop
- StarBridge

### Phase 5: External Transport Integration

**Goal**: Connect wormholes to external transports for cross-cluster communication.

**Steps**:
1. Implement HTTP transport for wormholes
2. Implement WebSocket transport for real-time events
3. Implement queue transport (Redis/RabbitMQ)
4. Test cross-cluster communication

**Files to Create**:
- `packages/event-wormholes/src/transports/http.ts`
- `packages/event-wormholes/src/transports/websocket.ts`
- `packages/event-wormholes/src/transports/queue.ts`

### Phase 6: Metrics and Observability

**Goal**: Add comprehensive metrics and observability.

**Steps**:
1. Add metrics collection for packet routing
2. Add metrics for wormhole buffering
3. Add metrics for Nerve Bus events
4. Create dashboard for monitoring

**Files to Create**:
- `packages/internal-router/src/observability.ts`
- `packages/event-wormholes/src/observability.ts`
- `server/routes/fiber-optic-metrics.ts`

---

## Summary

The Fiber-Optic Middleware System provides a comprehensive internal communication infrastructure for DreamNet:

- **Internal Ports** - Declarative port-based endpoints ✅
- **Laser Router** - Intelligent packet routing ✅
- **Event Wormholes** - Teleportation channels ✅
- **Nerve Fabric** - Central event bus ✅

**Current State**: Components are implemented but not fully integrated into the running server. Ports are registered but not wired to subsystems. Nerve Fabric initialization is disabled.

**Next Steps**: Follow the activation plan to enable and integrate the system, starting with Nerve Fabric initialization and port handler wiring.

