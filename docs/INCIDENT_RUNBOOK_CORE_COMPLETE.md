# Incident Runbook Core - Complete Documentation

**Package**: `@dreamnet/incident-runbook-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Incident Runbook Core provides **P0/P1/P2 incident procedures** with hotkeys and pre-baked commands. It enables rapid incident response with golden signals monitoring, incident classification, and automated remediation commands.

### Key Features

- **Hotkey Commands**: SAFE_MODE, WRITE_DRAIN, feature flags
- **Pre-Baked Commands**: Rollback, rotate keys, quarantine, drain DLQ
- **Incident Classification**: Automatic P0/P1/P2 classification
- **Golden Signals**: Monitor latency, errors, traffic, saturation
- **Response Times**: Severity-based response time targets

---

## API Reference

### Types

```typescript
export type IncidentSeverity = 'P0' | 'P1' | 'P2';

export interface GoldenSignals {
  latency: { p50: number; p95: number; p99: number };
  errors: { rate: number; count: number };
  traffic: { requestsPerSecond: number; changePercent: number };
  saturation: { cpu: number; memory: number };
}

export interface HotkeyCommand {
  id: string;
  name: string;
  description: string;
  execute: () => Promise<void>;
  severity: IncidentSeverity[];
}

export interface PreBakedCommand {
  id: string;
  name: string;
  description: string;
  execute: (params: Record<string, any>) => Promise<void>;
  severity: IncidentSeverity[];
}
```

### Main Export

#### `IncidentRunbookCore`

**Methods**:
- **`getHotkeyCommands(): HotkeyCommand[]`**
- **`getPreBakedCommands(): PreBakedCommand[]`**
- **`classifyIncident(goldenSignals: GoldenSignals): IncidentSeverity`**
- **`getResponseTime(severity: IncidentSeverity): number`**

---

**Status**: ✅ Implemented

