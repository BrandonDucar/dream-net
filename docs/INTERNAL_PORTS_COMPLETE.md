# Internal Ports - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Internal Ports provides **fiber-optic communication channels** for DreamNet's internal communication system. It enables high-speed, channelized routing between subsystems without direct coupling, using a declarative port-based architecture.

---

## Key Features

### Fiber Channels
- ALPHA: Primary system channel
- BETA: Security and defense channel
- GAMMA: Mesh and network channel
- OMEGA: Event routing channel

### Port Management
- Port registration
- Port lookup
- Port filtering
- Port inspection

### Packet System
- Standardized packet format
- Packet creation
- Packet validation
- Packet routing

---

## Architecture

### Components

1. **Fibers** (`fibers.ts`)
   - Fiber channel definitions
   - Fiber validation
   - Fiber utilities

2. **Ports** (`ports.ts`)
   - Port creation
   - Port validation
   - Port interface

3. **Packets** (`packets.ts`)
   - Packet creation
   - Packet validation
   - Packet format

4. **Registry** (`registry.ts`)
   - Port registration
   - Port lookup
   - Port management

5. **Inspector** (`inspector.ts`)
   - Port snapshots
   - Route snapshots
   - Wormhole snapshots

---

## API Reference

### Fibers

#### `FIBERS`
Fiber channel constants.

**Example**:
```typescript
import { FIBERS } from '@dreamnet/internal-ports';

const alpha = FIBERS.ALPHA; // 'alpha'
const beta = FIBERS.BETA;   // 'beta'
const gamma = FIBERS.GAMMA; // 'gamma'
const omega = FIBERS.OMEGA; // 'omega'
```

#### `getAllFibers(): string[]`
Gets all fiber channels.

#### `isValidFiber(fiber: string): boolean`
Validates a fiber channel.

### Packets

#### `createPacket(type: string, payload: any, metadata?: Record<string, any>): DreamPacket`
Creates a packet.

**Example**:
```typescript
import { createPacket } from '@dreamnet/internal-ports';

const packet = createPacket('dream.created', {
  dreamId: 'dream-123',
  creator: '0x...',
}, {
  fiber: 'alpha',
  priority: 'high',
});
```

#### `isValidPacket(packet: any): boolean`
Validates a packet.

### Ports

#### `createPort(id: string, label: string, direction: 'in' | 'out' | 'bidirectional', fiber: FiberChannel, handler: PortHandler): DreamPort`
Creates a port.

**Example**:
```typescript
import { createPort, FIBERS } from '@dreamnet/internal-ports';

const port = createPort(
  'my-port',
  'My Port',
  'bidirectional',
  FIBERS.ALPHA,
  async (packet) => {
    console.log('Received:', packet.type);
    return { ok: true };
  }
);
```

#### `isValidPort(port: any): boolean`
Validates a port.

### Registry

#### `registerPort(port: DreamPort): void`
Registers a port.

**Example**:
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

#### `getPort(id: string): DreamPort | undefined`
Gets a port by ID.

#### `listPorts(): DreamPort[]`
Lists all ports.

#### `hasPort(id: string): boolean`
Checks if a port exists.

#### `unregisterPort(id: string): boolean`
Unregisters a port.

#### `clearPorts(): void`
Clears all ports.

#### `getPortsByFiber(fiber: string): DreamPort[]`
Gets ports by fiber channel.

#### `getPortsByDirection(direction: 'in' | 'out' | 'bidirectional'): DreamPort[]`
Gets ports by direction.

#### `getRegistryStats(): RegistryStats`
Gets registry statistics.

### Inspector

#### `getPortsSnapshot(): PortSnapshot[]`
Gets ports snapshot.

#### `getRoutesSnapshot(): RouteSnapshot[]`
Gets routes snapshot.

#### `getWormholesSnapshot(): WormholeSnapshot[]`
Gets wormholes snapshot.

---

## Data Models

### FiberChannel

```typescript
type FiberChannel = 'alpha' | 'beta' | 'gamma' | 'omega';
```

### DreamPacket

```typescript
interface DreamPacket {
  id: string;           // UUID
  type: string;         // Event type
  payload: any;         // Data
  metadata?: object;    // Optional metadata
  timestamp: number;     // Unix timestamp
}
```

### DreamPort

```typescript
interface DreamPort {
  id: string;
  label: string;
  direction: 'in' | 'out' | 'bidirectional';
  fiber: FiberChannel;
  handler: (packet: DreamPacket) => Promise<any>;
}
```

---

## Fiber Channels

### ALPHA - Primary System Channel
- DreamNet Core
- StarBridge
- METALNET Core
- Core system operations

### BETA - Security and Defense Channel
- Shield Core
- DreamVault
- MILNET Core
- Security operations

### GAMMA - Mesh and Network Channel
- Mesh Core
- DreamShop
- TravelNet Core
- OTTNET Core
- Network operations

### OMEGA - Event Routing Channel
- Event Wormholes
- Cross-system events
- Event propagation

---

## Default Ports

### ALPHA Fiber
- `dreamnet-core`: DreamNet Core
- `star-bridge`: StarBridge
- `metalnet-core`: METALNET Core

### BETA Fiber
- `shield-core`: Shield Core
- `dream-vault`: DreamVault
- `milnet-core`: MILNET Core

### GAMMA Fiber
- `mesh-core`: Mesh Core
- `dream-shop`: DreamShop
- `travelnet-core`: TravelNet Core
- `ottnet-core`: OTTNET Core

### OMEGA Fiber
- `event-wormhole`: Event Wormholes

---

## Usage Examples

### Create Packet

```typescript
import { createPacket } from '@dreamnet/internal-ports';

const packet = createPacket('dream.created', {
  dreamId: 'dream-123',
  creator: '0x...',
});
```

### Register Port

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

### Look Up Ports

```typescript
import { getPort, listPorts, getPortsByFiber, FIBERS } from '@dreamnet/internal-ports';

const port = getPort('dreamnet-core');
const allPorts = listPorts();
const alphaPorts = getPortsByFiber(FIBERS.ALPHA);
```

### Port Snapshot

```typescript
import { getPortsSnapshot } from '@dreamnet/internal-ports';

const snapshot = getPortsSnapshot();
snapshot.forEach(port => {
  console.log(`${port.id}: ${port.label} (${port.fiber})`);
});
```

---

## Best Practices

1. **Port Design**
   - Use clear port IDs
   - Use descriptive labels
   - Choose appropriate direction
   - Select correct fiber channel

2. **Packet Design**
   - Use clear packet types
   - Include necessary payload
   - Add metadata when needed
   - Validate packet data

3. **Handler Design**
   - Handle errors gracefully
   - Return consistent results
   - Log important events
   - Validate packet data

---

## Security Considerations

1. **Port Security**
   - Validate port data
   - Protect port handlers
   - Audit port registration
   - Secure port access

2. **Packet Security**
   - Validate packet data
   - Sanitize payloads
   - Secure packet transmission
   - Prevent packet injection

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

