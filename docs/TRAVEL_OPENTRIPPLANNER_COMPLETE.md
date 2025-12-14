# Travel OpenTripPlanner - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Travel OpenTripPlanner provides **multi-modal trip planning integration** for DreamNet's Travel vertical. It integrates with OpenTripPlanner for comprehensive trip planning across multiple transportation modes (walking, transit, bicycle, car), enabling users to plan optimal routes using public transportation and other modes.

---

## Key Features

### Trip Planning
- Multi-modal routing
- Public transit integration
- Walking directions
- Bicycle routing

### API Integration
- OpenTripPlanner API integration
- Route optimization
- Itinerary generation
- Error handling

---

## Architecture

### Components

1. **OpenTripPlanner Client** (`OpenTripPlannerClient.ts`)
   - API client wrapper
   - Trip planning operations
   - Route optimization

---

## API Reference

### Initialization

#### `new OpenTripPlannerClient(config: OpenTripPlannerConfig): OpenTripPlannerClient`
Creates OpenTripPlanner client instance.

**Example**:
```typescript
import { OpenTripPlannerClient } from '@dreamnet/travel-opentripplanner';

const client = new OpenTripPlannerClient({
  apiUrl: 'https://otp.example.com/otp',
  routerId: 'default',
});
```

### Trip Planning

#### `planTrip(request: TripPlanRequest): Promise<TripPlan | null>`
Plans a trip.

**Example**:
```typescript
const trip = await client.planTrip({
  from: {
    lat: 40.7128,
    lon: -74.0060,
    name: 'New York',
  },
  to: {
    lat: 34.0522,
    lon: -118.2437,
    name: 'Los Angeles',
  },
  date: '2025-01-27',
  time: '10:00',
  arriveBy: false,
  modes: ['WALK', 'TRANSIT'],
  maxWalkDistance: 1000,
});

if (trip) {
  console.log(`Found ${trip.plan.itineraries.length} itineraries`);
}
```

---

## Data Models

### OpenTripPlannerConfig

```typescript
interface OpenTripPlannerConfig {
  apiUrl: string;
  routerId?: string;
}
```

### TripPlanRequest

```typescript
interface TripPlanRequest {
  from: {
    lat: number;
    lon: number;
    name?: string;
  };
  to: {
    lat: number;
    lon: number;
    name?: string;
  };
  date?: string;
  time?: string;
  arriveBy?: boolean;
  modes?: string[];
  maxWalkDistance?: number;
}
```

### TripPlan

```typescript
interface TripPlan {
  plan: {
    from: {
      name: string;
      lat: number;
      lon: number;
    };
    to: {
      name: string;
      lat: number;
      lon: number;
    };
    itineraries: Itinerary[];
  };
}
```

### Itinerary

```typescript
interface Itinerary {
  duration: number;
  startTime: number;
  endTime: number;
  walkTime: number;
  transitTime: number;
  waitingTime: number;
  walkDistance: number;
  legs: Leg[];
}
```

### Leg

```typescript
interface Leg {
  mode: "WALK" | "TRANSIT" | "BICYCLE" | "CAR" | "BUS" | "RAIL" | "SUBWAY" | "TRAM";
  from: {
    name: string;
    lat: number;
    lon: number;
    departureTime?: number;
  };
  to: {
    name: string;
    lat: number;
    lon: number;
    arrivalTime?: number;
  };
  distance?: number;
  duration?: number;
  route?: {
    shortName?: string;
    longName?: string;
  };
  trip?: {
    tripHeadsign?: string;
  };
}
```

---

## Transportation Modes

### Walk
Walking directions.

### Transit
Public transportation (bus, rail, subway, tram).

### Bicycle
Bicycle routing.

### Car
Car routing (if available).

---

## Integration Points

### DreamNet Systems
- **Travel Vertical**: Travel planning
- **DreamNet Geofence Core**: Location services
- **Market Data Core**: Location data
- **Social Hub Core**: Travel sharing

---

## Usage Examples

### Plan Trip

```typescript
const client = new OpenTripPlannerClient({
  apiUrl: 'https://otp.example.com/otp',
});

const trip = await client.planTrip({
  from: { lat: 40.7128, lon: -74.0060 },
  to: { lat: 34.0522, lon: -118.2437 },
  modes: ['WALK', 'TRANSIT'],
});
```

---

## Best Practices

1. **Trip Planning**
   - Use appropriate modes
   - Set realistic constraints
   - Consider multiple options
   - Cache routes

2. **API Management**
   - Handle rate limits
   - Cache responses
   - Monitor performance
   - Handle errors gracefully

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

