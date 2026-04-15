# @dreamnet/internal-ports

Internal Port System for DreamNet - Fiber-Optic Communication Channels

## Overview

The Internal Ports package provides a declarative system for internal DreamNet communication using fiber-optic channels. It enables high-speed, channelized routing between subsystems without direct coupling.

## Architecture

### Fibers

Fiber-optic laser channels for internal routing:

- **ALPHA** - Primary system channel (DreamNet Core, StarBridge)
- **BETA** - Security and defense channel (Shield Core, DreamVault)
- **GAMMA** - Mesh and network channel (Mesh Core, DreamShop)
- **OMEGA** - Event routing channel (Event Wormholes)

### Ports

Ports are endpoints connected to fiber channels:

- **Direction**: `in`, `out`, or `bidirectional`
- **Handler**: Async function that processes incoming packets
- **Fiber**: Channel the port is connected to

### Packets

Standardized packet format:

```typescript
{
  id: string;           // UUID
  type: string;         // Event type
  payload: any;         // Data
  metadata?: object;     // Optional metadata
  timestamp: number;    // Unix timestamp
}
```

## Usage

### Creating a Packet

```typescript
import { createPacket } from '@dreamnet/internal-ports';

const packet = createPacket('dream.created', {
  dreamId: 'dream-123',
  creator: '0x...'
});
```

### Registering a Port

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

### Looking Up Ports

```typescript
import { getPort, listPorts, getPortsByFiber } from '@dreamnet/internal-ports';

const port = getPort('dreamnet-core');
const allPorts = listPorts();
const alphaPorts = getPortsByFiber(FIBERS.ALPHA);
```

## Default Ports

The following ports are automatically registered on module load:

- `dreamnet-core` (ALPHA) - DreamNet Core operations
- `shield-core` (BETA) - Shield Core security
- `mesh-core` (GAMMA) - Mesh Core networking
- `event-wormhole` (OMEGA) - Event routing
- `dream-vault` (BETA) - DreamVault storage
- `dream-shop` (GAMMA) - DreamShop marketplace
- `star-bridge` (ALPHA) - StarBridge cross-chain

## Status

**Current State**: Declarative only - ports are registered but not wired into the running server.

**Future**: Ports will be connected to actual subsystem implementations for internal communication.

