# Alive Mode - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Alive Mode provides **system health checking and boot sequence monitoring** for DreamNet. It checks the health of all subsystems, determines system phase (booting, operational, degraded, error), and provides status snapshots for monitoring.

---

## Key Features

### System Health Checking
- Subsystem health checks
- Boot sequence monitoring
- Phase determination
- Status snapshots

### Subsystem Monitoring
- Squad Builder status
- HALO Loop status
- API Forge status
- Graft Engine status
- Spore Engine status
- Event Wormholes status
- Memory DNA status
- Dark Fabric status
- DreamScope status

### Phase Detection
- **Booting**: System starting up
- **Operational**: All systems healthy
- **Degraded**: Some systems unhealthy
- **Error**: Critical systems failed

---

## Architecture

### Components

1. **Alive Engine** (`aliveEngine.ts`)
   - Boot sequence execution
   - Subsystem checking
   - Phase determination
   - Status caching

2. **Subsystem Checkers**
   - Individual subsystem checks
   - Health validation
   - Error handling
   - Status reporting

---

## API Reference

### Boot Sequence

#### `runBootSequence(): Promise<AliveStatus>`
Runs boot sequence and checks all subsystems.

**Example**:
```typescript
import { runBootSequence } from '@dreamnet/alive-mode';

const status = await runBootSequence();
console.log(`Alive: ${status.alive}`);
console.log(`Phase: ${status.phase}`);
console.log(`Subsystems:`, status.subsystems);
```

### Status Retrieval

#### `getStatus(): Promise<AliveStatus>`
Gets current system status.

**Example**:
```typescript
import { getStatus } from '@dreamnet/alive-mode';

const status = await getStatus();
if (status.alive) {
  console.log('System is alive');
} else {
  console.log(`System phase: ${status.phase}`);
}
```

---

## Data Models

### AliveStatus

```typescript
interface AliveStatus {
  alive: boolean;
  phase: AlivePhase;
  timestamp: string;
  subsystems: {
    squadBuilder?: AliveSubsystemStatus;
    halo?: AliveSubsystemStatus;
    apiForge?: AliveSubsystemStatus;
    graftEngine?: AliveSubsystemStatus;
    sporeEngine?: AliveSubsystemStatus;
    eventWormholes?: AliveSubsystemStatus;
    memoryDna?: AliveSubsystemStatus;
    darkFabric?: AliveSubsystemStatus;
    dreamScope?: AliveSubsystemStatus;
  };
}
```

### AliveSubsystemStatus

```typescript
interface AliveSubsystemStatus {
  ok: boolean;
  details?: string;
  error?: string;
}
```

### AlivePhase

```typescript
type AlivePhase = "booting" | "operational" | "degraded" | "error";
```

---

## Subsystem Checks

### Squad Builder
- Checks `/api/squad/agents`
- Agent registry health
- Squad management status

### HALO Loop
- Checks `/api/halo/status`
- Self-healing system health
- Halo cycle status

### API Forge
- Checks `/api/forge/collections`
- API collection management
- Forge system health

### Graft Engine
- Checks `/api/graft`
- Graft system health
- Plugin management status

### Spore Engine
- Advisory status
- Integration pending
- Future system

### Event Wormholes
- Observational mode
- Nominal status
- Event routing health

### Memory DNA
- Checks `/api/dna/agent`
- Memory system health
- Trait management status

### Dark Fabric
- Phase 1 advisory
- Future system
- Integration pending

### DreamScope
- UI reachable
- Frontend status
- Advisory status

---

## Phase Determination Logic

### Error Phase
- Core systems failed (squadBuilder, apiForge, halo)
- System not operational
- Critical failures

### Degraded Phase
- Some subsystems failed
- Non-critical failures
- Partial functionality

### Operational Phase
- All subsystems healthy
- Full functionality
- System ready

### Booting Phase
- System starting up
- Initial checks
- Boot sequence running

---

## Integration Points

### DreamNet Systems
- **Squad Alchemy**: Squad Builder check
- **HALO Loop**: HALO status check
- **API Keeper Core**: API Forge check
- **Graft Engine**: Graft system check
- **Event Wormholes**: Wormhole check
- **Memory DNA**: DNA system check

### External Systems
- **Health Endpoints**: Subsystem health APIs
- **Monitoring Systems**: Status monitoring

---

## Usage Examples

### Run Boot Sequence

```typescript
const status = await runBootSequence();
if (status.alive) {
  console.log('System is operational');
} else {
  console.log(`System phase: ${status.phase}`);
  Object.entries(status.subsystems).forEach(([name, subsystem]) => {
    if (!subsystem.ok) {
      console.error(`${name}: ${subsystem.error}`);
    }
  });
}
```

### Get Status

```typescript
const status = await getStatus();
console.log(`Alive: ${status.alive}`);
console.log(`Phase: ${status.phase}`);
```

---

## Best Practices

1. **Health Checking**
   - Run boot sequence on startup
   - Monitor subsystem health
   - Handle failures gracefully
   - Cache status appropriately

2. **Phase Management**
   - Determine phase accurately
   - Handle degraded states
   - Monitor critical systems
   - Alert on errors

---

## Security Considerations

1. **Health Endpoint Security**
   - Secure health endpoints
   - Validate responses
   - Handle timeouts
   - Monitor access

2. **Status Security**
   - Protect status data
   - Validate subsystems
   - Audit health checks
   - Monitor failures

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

