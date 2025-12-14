# Travel Valhalla - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Travel Valhalla provides **advanced routing engine integration** for DreamNet's Travel vertical. It integrates with Valhalla routing engine for sophisticated route planning, optimization, and multi-modal routing (auto, pedestrian, bicycle, bus, taxi).

---

## Key Features

### Routing
- Route calculation
- Multi-modal routing
- Route optimization (TSP)
- Turn-by-turn directions

### API Integration
- Valhalla API integration
- Route request handling
- Route response parsing
- Error handling

---

## Architecture

### Components

1. **Valhalla Router** (`ValhallaRouter.ts`)
   - API client wrapper
   - Route operations
   - Optimization algorithms

---

## API Reference

### Initialization

#### `new ValhallaRouter(config: ValhallaConfig): ValhallaRouter`
Creates Valhalla router instance.

**Example**:
```typescript
import { ValhallaRouter } from '@dreamnet/travel-valhalla';

const router = new ValhallaRouter({
  apiUrl: 'https://valhalla.example.com',
});
```

### Route Operations

#### `getRoute(request: RouteRequest): Promise<Route | null>`
Gets route between locations.

**Example**:
```typescript
const route = await router.getRoute({
  locations: [
    { lat: 40.7128, lon: -74.0060 }, // NYC
    { lat: 34.0522, lon: -118.2437 }, // LA
  ],
  costing: 'auto',
  directionsOptions: {
    units: 'kilometers',
    language: 'en',
  },
});

if (route) {
  console.log(`Distance: ${route.distance}m, Time: ${route.time}s`);
}
```

#### `getOptimizedRoute(locations: Array<{ lat: number; lon: number }>, costing?: RouteRequest["costing"]): Promise<Route | null>`
Gets optimized route (TSP).

**Example**:
```typescript
const route = await router.getOptimizedRoute([
  { lat: 40.7128, lon: -74.0060 },
  { lat: 34.0522, lon: -118.2437 },
  { lat: 41.8781, lon: -87.6298 },
], 'auto');
```

---

## Data Models

### ValhallaConfig

```typescript
interface ValhallaConfig {
  apiUrl: string;
}
```

### RouteRequest

```typescript
interface RouteRequest {
  locations: Array<{ lat: number; lon: number }>;
  costing: "auto" | "pedestrian" | "bicycle" | "bus" | "taxi";
  directionsOptions?: {
    units?: "kilometers" | "miles";
    language?: string;
  };
}
```

### Route

```typescript
interface Route {
  shape: string; // Encoded polyline
  distance: number; // meters
  time: number; // seconds
  legs: Array<{
    distance: number;
    time: number;
    maneuvers: Array<{
      type: number;
      instruction: string;
      distance: number;
      time: number;
    }>;
  }>;
}
```

---

## Costing Types

### Auto
Standard car routing.

### Pedestrian
Walking routes.

### Bicycle
Bicycle routes.

### Bus
Public transit routes.

### Taxi
Taxi routing.

---

## Integration Points

### DreamNet Systems
- **Travel Vertical**: Travel planning
- **DreamNet Geofence Core**: Location services
- **Market Data Core**: Location data
- **Social Hub Core**: Travel sharing

---

## Usage Examples

### Get Route

```typescript
const router = new ValhallaRouter({
  apiUrl: 'https://valhalla.example.com',
});

const route = await router.getRoute({
  locations: [
    { lat: 40.7128, lon: -74.0060 },
    { lat: 34.0522, lon: -118.2437 },
  ],
  costing: 'auto',
});
```

---

## Best Practices

1. **Route Planning**
   - Use appropriate costing
   - Consider multiple options
   - Cache routes
   - Handle errors

2. **Optimization**
   - Use TSP for multiple stops
   - Consider constraints
   - Monitor performance
   - Validate results

---

## Security Considerations

1. **API Security**
   - Secure API endpoints
   - Validate inputs
   - Rate limit requests
   - Monitor usage

2. **Location Privacy**
   - Protect user locations
   - Anonymize data
   - Control access
   - Audit usage

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

