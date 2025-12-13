# Safe Startup Sequence - Complete Documentation

**Generated:** 2025-01-27  
**Status:** Complete Documentation & Implementation Plan

---

## Overview

Safe Startup Sequence provides safe-by-default service initialization with dependency DAG (Directed Acyclic Graph), health gates, and gradual traffic opening. This ensures services start in the correct order and only accept traffic when ready.

---

## Architecture

### Components

1. **Dependency DAG Builder** (`dagBuilder.ts`)
   - Builds dependency graph from service definitions
   - Validates DAG (no cycles)
   - Topological sorting for initialization order

2. **Initialization Orchestrator** (`initOrchestrator.ts`)
   - Executes initialization in dependency order
   - Idempotent initialization (never double-do work)
   - Error handling and rollback

3. **Health Gates** (`healthGates.ts`)
   - Liveness checks (service is running)
   - Readiness checks (service can accept traffic)
   - Dependency checks (dependencies are healthy)

4. **Traffic Grader** (`trafficGrader.ts`)
   - Gradual traffic opening (1% → 10% → 50% → 100%)
   - Canary deployment support
   - Rollback on health degradation

---

## Dependency DAG

### DreamNet Dependency Order

```
Level 0 (No Dependencies):
├── Database (Neon/Postgres)
└── Queues/Streams (Kafka/PubSub)

Level 1 (Depends on Level 0):
├── DreamNet Control Core
├── Identity Grid
└── Directory

Level 2 (Depends on Level 1):
├── DreamNet OS Core
├── Citadel Core
├── Nervous System Core
└── Registry Proofs Core

Level 3 (Depends on Level 2):
├── Detector Generator Core
├── Resilience Early-Warning
├── DIN Infrastructure Core
└── Intent Router Core

Level 4 (Depends on Level 3):
├── Chain Abstraction Core
├── Star Bridge Lungs
└── Slime-Mold Router

Level 5 (Depends on Level 4):
├── Orchestrator Core
├── Agent Registry Core
└── Super Spine

Level 6 (Depends on Level 5):
├── APIs (DreamHub, Agent Gateway)
└── Frontends (Mini-Apps)
```

### DAG Definition

```typescript
interface ServiceNode {
  id: string;
  service: string;
  dependencies: string[]; // IDs of dependent services
  healthCheck: HealthCheck;
  initFunction: () => Promise<void>;
  trafficGrader?: TrafficGrader;
}

interface DependencyEdge[];
}

interface DependencyEdge {
  from: string; // Service ID
  to: string;   // Service ID
  type: 'required' | 'optional';
}
```

---

## Health Gates

### Liveness Check

**Definition**: Service is running and responding

```typescript
interface LivenessCheck {
  type: 'http' | 'tcp' | 'process' | 'custom';
  endpoint?: string; // For HTTP checks
  port?: number;     // For TCP checks
  timeout: number;   // ms
  interval: number;  // ms
}

async function checkLiveness(service: ServiceNode): Promise<boolean> {
  switch (service.healthCheck.liveness.type) {
    case 'http':
      return await httpHealthCheck(service.healthCheck.liveness.endpoint!);
    case 'tcp':
      return await tcpHealthCheck(service.healthCheck.liveness.port!);
    case 'process':
      return await processHealthCheck(service.id);
    default:
      return true;
  }
}
```

### Readiness Check

**Definition**: Service can accept traffic

```typescript
interface ReadinessCheck {
  checks: Array<{
    type: 'dependency' | 'database' | 'queue' | 'custom';
    name: string;
    check: () => Promise<boolean>;
  }>;
  allRequired: boolean; // All checks must pass, or just one
}

async function checkReadiness(service: ServiceNode): Promise<boolean> {
  const checks = service.healthCheck.readiness.checks;
  const results = await Promise.all(checks.map(c => c.check()));
  
  if (service.healthCheck.readiness.allRequired) {
    return results.every(r => r === true);
  } else {
    return results.some(r => r === true);
  }
}
```

---

## Traffic Grader

### Gradual Traffic Opening

```
Phase 1: 1% Traffic (Canary)
    ↓ (Health checks pass for 5 minutes)
Phase 2: 10% Traffic
    ↓ (Health checks pass for 5 minutes)
Phase 3: 50% Traffic
    ↓ (Health checks pass for 10 minutes)
Phase 4: 100% Traffic (Full)
```

### Traffic Grading Logic

```typescript
interface TrafficPhase {
  percentage: number;
  duration: number; // ms
  healthThreshold: number; // Minimum health score
}

async function gradeTraffic(
  service: ServiceNode,
  currentPhase: number
): Promise<number> {
  // Check health metrics
  const healthScore = await getHealthScore(service);
  
  // Check if ready for next phase
  const phases = service.trafficGrader?.phases ?? [];
  const currentPhaseConfig = phases[currentPhase];
  
  if (!currentPhaseConfig) {
    return 100; // Full traffic
  }
  
  // Check if health threshold met
  if (healthScore < currentPhaseConfig.healthThreshold) {
    // Rollback to previous phase
    return phases[Math.max(0, currentPhase - 1)]?.percentage ?? 0;
  }
  
  // Check if duration met
  const phaseStartTime = getPhaseStartTime(service.id);
  if (Date.now() - phaseStartTime < currentPhaseConfig.duration) {
    return currentPhaseConfig.percentage;
  }
  
  // Advance to next phase
  return phases[Math.min(phases.length - 1, currentPhase + 1)]?.percentage ?? 100;
}
```

---

## Initialization Flow

```
1. Load Dependency DAG
    ↓
2. Validate DAG (no cycles)
    ↓
3. Topological Sort (dependency order)
    ↓
4. Initialize Services in Order
    ↓
5. Health Gate Check (liveness + readiness)
    ↓
6. Traffic Grader (gradual opening)
    ↓
7. Service Ready
```

---

## Integration with DreamNet

### Current Startup Flow

DreamNet currently uses:
- `INIT_SUBSYSTEMS` flag for optional subsystems
- Dynamic imports with try/catch
- Manual initialization order

### Enhanced Startup Flow

With Safe Startup Sequence:
- Dependency DAG defines order
- Health gates ensure readiness
- Traffic grader opens gradually
- Automatic rollback on failure

---

## Implementation Plan

### Phase 8.1: DAG Builder
- [ ] Create DAG definition format
- [ ] Implement DAG builder
- [ ] Add cycle detection
- [ ] Topological sorting

### Phase 8.2: Health Gates
- [ ] Implement liveness checks
- [ ] Implement readiness checks
- [ ] Add dependency checks
- [ ] Create health check registry

### Phase 8.3: Traffic Grader
- [ ] Implement gradual opening
- [ ] Add canary support
- [ ] Create rollback logic
- [ ] Add health monitoring

### Phase 8.4: Initialization Orchestrator
- [ ] Implement initialization order
- [ ] Add idempotency
- [ ] Error handling
- [ ] Rollback mechanism

### Phase 8.5: Integration
- [ ] Integrate with server/index.ts
- [ ] Create DreamNet DAG definition
- [ ] Add health checks for all services
- [ ] Test end-to-end startup

---

## Success Criteria

- ✅ Dependency DAG built and validated
- ✅ Services initialize in correct order
- ✅ Health gates ensure readiness
- ✅ Traffic opens gradually (1% → 100%)
- ✅ Automatic rollback on failure
- ✅ Integration with DreamNet startup

---

## Next Steps

1. Build dependency DAG
2. Implement health gates
3. Create traffic grader
4. Integrate with server startup
5. Test safe startup sequence

