# Startup Sequence Core - Complete Documentation

**Package**: `@dreamnet/startup-sequence-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Startup Sequence Core provides **safe-by-default service initialization** with dependency DAG. It ensures services start in the correct order with health gates and gradual traffic opening.

### Key Features

- **Dependency DAG**: Build and validate dependency graphs
- **Idempotent Initialization**: Never double-initialize services
- **Health Gates**: Liveness and readiness checks
- **Gradual Traffic Opening**: 1% → 10% → 50% → 100% traffic phases
- **Topological Sorting**: Determine initialization order

---

## API Reference

### Types

```typescript
export interface ServiceNode {
  id: string;
  service: string;
  dependencies: string[];
  healthCheck: HealthCheck;
  initFunction: () => Promise<void>;
  trafficGrader?: TrafficGrader;
  priority?: number;
}

export interface DependencyDAG {
  nodes: ServiceNode[];
  edges: DependencyEdge[];
}

export interface TrafficPhase {
  percentage: number; // 1, 10, 50, 100
  duration: number; // ms
  healthThreshold: number; // 0-100
}

export interface StartupStatus {
  initializedServices: string[];
  pendingServices: string[];
  failedServices: string[];
  currentPhase: Record<string, number>;
  healthScores: Record<string, number>;
}
```

### Main Export

#### `StartupSequenceCore`

**Methods**:
- **`initialize(dag): Promise<void>`**
- **`buildDAG(nodes): DependencyDAG`**
- **`validateDAG(dag): boolean`**
- **`getInitOrder(dag): string[]`**
- **`isServiceReady(serviceId, dag): Promise<boolean>`**
- **`getStatus(dag): StartupStatus`**

---

**Status**: ✅ Implemented

