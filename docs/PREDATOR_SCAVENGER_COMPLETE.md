# Predator Scavenger Loop - Complete Documentation

**Package**: `@dreamnet/predator-scavenger`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Predator Scavenger Loop (PSL) provides **decay detection and cleanup** for DreamNet. It detects decaying routes, events, services, agents, and configs, then quarantines or reclaims them.

### Key Features

- **Decay Detection**: Detect decaying entities (routes, events, services, agents, configs)
- **Predator Actions**: Quarantine and flag decaying entities
- **Scavenger Actions**: Reclaim and recycle resources
- **Severity Scoring**: Score decay severity (0-1)
- **Automatic Cleanup**: Automatic cleanup of decayed entities

---

## API Reference

### Types

```typescript
export interface DecaySignal {
  id: string;
  targetType: "route" | "event" | "service" | "agent" | "config" | "generic";
  targetId: string;
  severity: number; // 0–1
  detectedAt: number;
  meta?: Record<string, any>;
}

export interface PredatorAction {
  signalId: string;
  targetId: string;
  quarantined: boolean;
  flagged: boolean;
  meta?: Record<string, any>;
}

export interface ScavengerAction {
  sourceId: string;
  reclaimed: boolean;
  recycled: boolean;
  meta?: Record<string, any>;
}

export interface PSLStatus {
  lastRunAt: number | null;
  decaySignals: DecaySignal[];
  predatorActions: PredatorAction[];
  scavengerActions: ScavengerAction[];
}
```

### Main Export

#### `PredatorScavengerLoop`

**Methods**:
- **`run(context: PSLContext): PSLStatus`**
- **`status(): PSLStatus`**

---

**Status**: ✅ Implemented

