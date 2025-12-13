# Guardian Framework Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Guardian Framework Core provides **3-layer defense, stability, logistics, and intelligence system** for DreamNet. It implements a biomimetic defense architecture with shield layers, drone dome rings, and Aegis Fleet strategic command.

---

## Key Features

### Layer 1: DreamNet Shields
- Ground Armor shield
- Containment shield
- Dream Fabric Stability shield
- Integrity tracking
- Threat blocking

### Layer 2: Golden Drone Dome
- 3-ring swarm architecture
- Personal agent drones
- Ring-based positioning
- Telemetry collection
- Threat detection

### Layer 3: Aegis Fleet
- Strategic command nodes
- Analysis nodes
- Coordination nodes
- Stabilization actions
- Realm stability monitoring

---

## Architecture

### Components

1. **Guardian Framework** (`GuardianFramework.ts`)
   - Framework initialization
   - Status management
   - Shield layer management
   - Drone coordination

2. **Drone** (`Drone.ts`)
   - Personal drone management
   - Position tracking
   - Capability management
   - Telemetry collection

3. **Types** (`types.ts`)
   - Framework type definitions
   - Status types
   - Drone types

---

## API Reference

### Initialization

#### `initialize(agentIds: Array<{ id: string; name: string }>): Promise<void>`
Initializes Guardian Framework with agents.

**Example**:
```typescript
import { GuardianFramework } from '@dreamnet/guardian-framework-core';

const guardian = new GuardianFramework();
await guardian.initialize([
  { id: 'agent-1', name: 'Agent One' },
  { id: 'agent-2', name: 'Agent Two' },
]);
```

### Status

#### `getStatus(): GuardianStatus | null`
Gets Guardian Framework status.

**Example**:
```typescript
const status = guardian.getStatus();
if (status) {
  console.log(`Shield Integrity: ${status.shields.overallIntegrity * 100}%`);
  console.log(`Total Drones: ${status.droneDome.totalDrones}`);
  console.log(`Threat Level: ${status.threatLevel}`);
}
```

---

## Data Models

### PersonalDrone

```typescript
interface PersonalDrone {
  id: string;
  agentId: string;
  agentName: string;
  status: "active" | "idle" | "scanning" | "assisting" | "offline";
  position: {
    ring: 1 | 2 | 3;
    angle: number;
    distance: number;
  };
  capabilities: {
    follow: boolean;
    observe: boolean;
    scanAhead: boolean;
    scanBehind: boolean;
    longRangeScan: boolean;
    taskAssistance: boolean;
  };
  telemetry: {
    lastScan: number;
    threatsDetected: number;
    anomaliesFound: number;
    tasksAssisted: number;
    lastUpdate: number;
  };
}
```

### ShieldLayerStatus

```typescript
interface ShieldLayerStatus {
  layer: "ground-armor" | "containment" | "dream-fabric-stability";
  integrity: number; // 0-1
  strength: number; // 0-1
  threatsBlocked: number;
  lastBreach?: number;
  active: boolean;
}
```

### GuardianStatus

```typescript
interface GuardianStatus {
  shields: {
    groundArmor: ShieldLayerStatus;
    containment: ShieldLayerStatus;
    dreamFabricStability: ShieldLayerStatus;
    overallIntegrity: number;
  };
  droneDome: {
    ring1: DroneDomeRing;
    ring2: DroneDomeRing;
    ring3: DroneDomeRing;
    totalDrones: number;
    activeDrones: number;
    threatsDetected: number;
    anomaliesFound: number;
  };
  aegisFleet: AegisFleetStatus;
  threatLevel: "low" | "medium" | "high" | "critical";
  lastUpdate: number;
}
```

---

## Shield Layers

### Ground Armor
- Primary defense layer
- Physical protection
- High integrity
- Threat blocking

### Containment
- Secondary defense layer
- Threat containment
- Isolation protection
- Breach prevention

### Dream Fabric Stability
- Tertiary defense layer
- System stability
- Fabric protection
- Continuity assurance

---

## Drone Dome Rings

### Ring 1: Inner Ring
- Core telemetry
- 40% of drones
- Close-range scanning
- High priority monitoring

### Ring 2: Middle Ring
- Logistics & data collection
- 40% of drones
- Medium-range scanning
- Data gathering

### Ring 3: Outer Ring
- Perimeter defense
- 20% of drones
- Long-range scanning
- Early warning

---

## Integration Points

### DreamNet Systems
- **Shield Core**: Shield layer integration
- **Agent Registry**: Agent discovery
- **DreamNet OS Core**: System health

### External Systems
- **Monitoring**: Defense dashboards
- **Alerting**: Threat alerts
- **Analytics**: Defense analytics

---

## Usage Examples

### Initialize Framework

```typescript
const guardian = new GuardianFramework();
await guardian.initialize([
  { id: 'agent-1', name: 'Agent One' },
  { id: 'agent-2', name: 'Agent Two' },
  { id: 'agent-3', name: 'Agent Three' },
]);
```

### Get Status

```typescript
const status = guardian.getStatus();
if (status) {
  console.log(`Shield Integrity: ${status.shields.overallIntegrity * 100}%`);
  console.log(`Ring 1 Drones: ${status.droneDome.ring1.telemetry.totalDrones}`);
  console.log(`Ring 2 Drones: ${status.droneDome.ring2.telemetry.totalDrones}`);
  console.log(`Ring 3 Drones: ${status.droneDome.ring3.telemetry.totalDrones}`);
  console.log(`Threat Level: ${status.threatLevel}`);
}
```

---

## Best Practices

1. **Initialization**
   - Initialize with all agents
   - Distribute drones evenly
   - Monitor shield integrity
   - Track threat levels

2. **Monitoring**
   - Check status regularly
   - Monitor shield layers
   - Track drone telemetry
   - Watch threat levels

---

## Security Considerations

1. **Defense Security**
   - Maintain shield integrity
   - Monitor threat levels
   - Update shield layers
   - Protect drone dome

2. **System Security**
   - Secure initialization
   - Protect status data
   - Audit defense actions
   - Prevent tampering

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

