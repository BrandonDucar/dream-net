# Resilience Early Warning - Complete Documentation

**Package**: `@dreamnet/resilience-early-warning`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Resilience Early Warning detects **critical slowing down** (variance + AC1) before failures. It computes variance and lag-1 autocorrelation over rolling windows, calculates resilience indices, and triggers guardrails automatically.

### Key Features

- **Variance Calculation**: Compute variance (σ²) over rolling windows
- **Autocorrelation**: Calculate lag-1 autocorrelation (AC1)
- **Resilience Index**: Calculate resilience index (0-100)
- **Z-Score Gating**: Z-score calculation against trailing baselines
- **Guardrail Triggers**: Automatic autoscale, rate-limit, brownout triggers

---

## API Reference

### Types

```typescript
export interface ResilienceSignal {
  serviceId: string;
  metric: string;
  variance: number; // σ²
  ac1: number; // lag-1 autocorrelation
  resilienceIndex: number; // 0-100
  timestamp: number;
}

export interface ResilienceAlert {
  id: string;
  serviceId: string;
  resilienceIndex: number;
  severity: 'warning' | 'critical';
  message: string;
  timestamp: number;
  consecutiveWindows: number;
}
```

### Main Export

#### `ResilienceEarlyWarning`

**Methods**:
- **`computeSignals(serviceId, metrics): Promise<ResilienceSignal>`**
- **`getResilienceIndex(serviceId): number | null`**
- **`getActiveAlerts(): ResilienceAlert[]`**
- **`status(): ResilienceEarlyWarningStatus`**

---

**Status**: ✅ Implemented

