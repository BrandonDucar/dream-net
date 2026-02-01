# @dreamnet/internal-router

Laser Router - High-Speed Packet Routing System for DreamNet

## Overview

The Laser Router provides intelligent packet routing for DreamNet's internal fiber-optic communication system. It routes packets to appropriate port handlers based on fiber channels and packet types.

## Architecture

### Routing Table

Routes are keyed by:
- **Fiber Channel** (ALPHA, BETA, GAMMA, OMEGA)
- **Packet Type** (e.g., 'dreamnet.event', 'shield.event')

### Router Configuration

- **defaultFiber**: Default channel when fiber not specified
- **allowFallback**: Attempt fallback routing using defaultFiber
- **strict**: Throw errors vs soft-fail on missing routes/ports

## Usage

### Basic Routing

```typescript
import { createPacket } from '@dreamnet/internal-ports';
import { routePacket, FIBERS } from '@dreamnet/internal-router';

// Create a packet
const packet = createPacket('dreamnet.event', {
  event: 'dream.created',
  dreamId: 'dream-123'
});

// Route the packet
const result = await routePacket(packet, { fiber: FIBERS.ALPHA });
// Result: { ok: true } (from DreamNet Core port handler)
```

### Registering Custom Routes

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

### Router Configuration

```typescript
import { configureRouter, FIBERS } from '@dreamnet/internal-router';

configureRouter({
  defaultFiber: FIBERS.ALPHA,
  allowFallback: true,
  strict: false
});
```

### Metrics

```typescript
import { getRouteStats } from '@dreamnet/internal-router';

const stats = getRouteStats();
// { 'alpha:dreamnet.event': { count: 42 }, ... }
```

## Default Routes

The following routes are automatically registered:

- `alpha:dreamnet.event` → `dreamnet-core` port
- `beta:shield.event` → `shield-core` port
- `gamma:mesh.event` → `mesh-core` port
- `omega:wormhole.event` → `event-wormhole` port

## Example

```typescript
import { createPacket } from '@dreamnet/internal-ports';
import { routePacket, FIBERS } from '@dreamnet/internal-router';

// Create a packet
const packet = createPacket('dreamnet.event', { foo: 'bar' });

// Route it through ALPHA fiber
const result = await routePacket(packet, { fiber: FIBERS.ALPHA });

// The default DreamNet Core port handler will:
// 1. Log: "[Port Handler] Received packet type: dreamnet.event (id: <uuid>)"
// 2. Return: { ok: true }
```

## Status

**Current State**: Declarative routing system - routes packets to registered ports.

**Future**: Will be integrated into DreamNet subsystems for internal communication.

