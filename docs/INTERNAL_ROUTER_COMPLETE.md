# Internal Router - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Internal Router (Laser Router) provides **high-speed packet routing** for DreamNet's internal fiber-optic communication system. It routes packets to appropriate port handlers based on fiber channels and packet types, enabling decoupled communication between subsystems.

---

## Key Features

### Packet Routing
- Fiber-based routing
- Type-based routing
- Port handler dispatch
- Fallback routing

### Router Configuration
- Default fiber channel
- Fallback routing
- Strict mode
- Route management

### Metrics
- Route count tracking
- Route statistics
- Performance monitoring

---

## Architecture

### Components

1. **Router** (`router.ts`)
   - Route registration
   - Packet routing
   - Route lookup
   - Configuration

2. **Metrics** (`metrics.ts`)
   - Route counting
   - Statistics tracking
   - Performance metrics

3. **Types** (`types.ts`)
   - Route definitions
   - Configuration types
   - Result types

---

## API Reference

### Configuration

#### `configureRouter(config: RouterConfig): void`
Configures the router.

**Example**:
```typescript
import { configureRouter, FIBERS } from '@dreamnet/internal-router';

configureRouter({
  defaultFiber: FIBERS.ALPHA,
  allowFallback: true,
  strict: false,
});
```

#### `getRouterConfig(): RouterConfig`
Gets current router configuration.

### Route Management

#### `registerRoute(route: RouteEntry): void`
Registers a route.

**Example**:
```typescript
import { registerRoute, FIBERS } from '@dreamnet/internal-router';

registerRoute({
  key: {
    fiber: FIBERS.ALPHA,
    type: 'dreamnet.event',
  },
  target: {
    portId: 'dreamnet-core',
  },
  description: 'DreamNet Core system events',
});
```

#### `unregisterRoute(fiber: string, type: string): boolean`
Unregisters a route.

#### `getRoute(fiber: string, type: string): RouteEntry | undefined`
Gets a route.

#### `listRoutes(): RouteEntry[]`
Lists all routes.

#### `hasRoute(fiber: string, type: string): boolean`
Checks if a route exists.

#### `clearRoutes(): void`
Clears all routes.

### Packet Routing

#### `routePacket(packet: DreamPacket, options?: { fiber?: string }): Promise<any>`
Routes a packet to the appropriate port handler.

**Example**:
```typescript
import { routePacket, FIBERS } from '@dreamnet/internal-router';
import { createPacket } from '@dreamnet/internal-ports';

const packet = createPacket('dreamnet.event', {
  event: 'dream.created',
  dreamId: 'dream-123',
});

const result = await routePacket(packet, { fiber: FIBERS.ALPHA });
// Result: { ok: true } (from DreamNet Core port handler)
```

### Metrics

#### `incrementRouteCount(fiber: string, type: string): void`
Increments route count.

#### `getRouteStats(): Record<string, number>`
Gets route statistics.

#### `getRouteCount(fiber: string, type: string): number`
Gets route count.

#### `resetMetrics(): void`
Resets metrics.

---

## Data Models

### RouterConfig

```typescript
interface RouterConfig {
  defaultFiber?: string;
  allowFallback?: boolean;
  strict?: boolean;
}
```

### RouteKey

```typescript
interface RouteKey {
  fiber: string;
  type: string;
}
```

### RouteTarget

```typescript
interface RouteTarget {
  portId: string;
}
```

### RouteEntry

```typescript
interface RouteEntry {
  key: RouteKey;
  target: RouteTarget;
  description?: string;
}
```

---

## Default Routes

### ALPHA Fiber
- `dreamnet.event` → `dreamnet-core` port
- `metalnet.event` → `metalnet-core` port

### BETA Fiber
- `shield.event` → `shield-core` port
- `milnet.event` → `milnet-core` port

### GAMMA Fiber
- `mesh.event` → `mesh-core` port
- `travelnet.event` → `travelnet-core` port
- `ottnet.event` → `ottnet-core` port

### OMEGA Fiber
- `wormhole.event` → `event-wormhole` port

---

## Routing Flow

1. **Packet Creation**
   - Create packet with type and payload
   - Optionally specify fiber in metadata

2. **Route Lookup**
   - Determine effective fiber (options > default > metadata)
   - Look up route by fiber + type

3. **Fallback Routing**
   - If route not found and fallback enabled
   - Try default fiber route

4. **Port Handler**
   - Find port by portId
   - Call port handler with packet
   - Return handler result

5. **Error Handling**
   - Strict mode: throw errors
   - Non-strict: return error response

---

## Integration Points

### DreamNet Systems
- **Internal Ports**: Port handlers
- **Event Wormholes**: Cross-system events
- **Spider Web**: Signal routing
- **Neural Mesh**: Communication patterns

### External Systems
- **Monitoring**: Route metrics
- **Analytics**: Routing analytics
- **Dashboards**: Route visualization

---

## Usage Examples

### Basic Routing

```typescript
import { routePacket, FIBERS } from '@dreamnet/internal-router';
import { createPacket } from '@dreamnet/internal-ports';

const packet = createPacket('dreamnet.event', {
  event: 'dream.created',
  dreamId: 'dream-123',
});

const result = await routePacket(packet, { fiber: FIBERS.ALPHA });
```

### Custom Route

```typescript
import { registerRoute, FIBERS } from '@dreamnet/internal-router';

registerRoute({
  key: {
    fiber: FIBERS.BETA,
    type: 'custom.event',
  },
  target: {
    portId: 'my-custom-port',
  },
  description: 'Custom event routing',
});
```

### Router Configuration

```typescript
import { configureRouter, FIBERS } from '@dreamnet/internal-router';

configureRouter({
  defaultFiber: FIBERS.ALPHA,
  allowFallback: true,
  strict: false,
});
```

### Route Statistics

```typescript
import { getRouteStats } from '@dreamnet/internal-router';

const stats = getRouteStats();
// { 'alpha:dreamnet.event': 42, ... }
```

---

## Best Practices

1. **Route Design**
   - Use clear fiber channels
   - Use descriptive packet types
   - Document routes
   - Group related routes

2. **Routing**
   - Specify fiber explicitly
   - Handle errors gracefully
   - Monitor route metrics
   - Optimize routing paths

3. **Configuration**
   - Set appropriate defaults
   - Enable fallback when needed
   - Use strict mode in production
   - Monitor router performance

---

## Security Considerations

1. **Route Security**
   - Validate routes
   - Protect route configuration
   - Audit route changes
   - Secure packet routing

2. **Packet Security**
   - Validate packet data
   - Sanitize payloads
   - Secure packet transmission
   - Prevent route hijacking

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

