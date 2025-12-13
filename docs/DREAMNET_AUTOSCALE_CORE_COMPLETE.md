# DreamNet Auto-Scale Core - Complete Documentation

**Package**: `@dreamnet/dreamnet-autoscale-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

DreamNet Auto-Scale Core provides **adaptive rate limiting and auto-scaling** based on metrics and rules. It automatically adjusts rate limits and scales resources based on performance metrics.

### Key Features

- **Scaling Rules**: Define scaling rules with thresholds
- **Automatic Evaluation**: Periodic evaluation of scaling rules
- **Metrics-Based**: Scale based on requests/sec, error rate, latency, cost
- **Spider Web Integration**: Bridge scaling decisions to Spider Web
- **Rate Limit Adjustment**: Automatically adjust rate limits

---

## API Reference

### Types

```typescript
export interface ScalingRule {
  id: string;
  clusterId: string;
  enabled: boolean;
  minLimit: number;
  maxLimit: number;
  scaleUpThreshold: number; // requests/sec
  scaleDownThreshold: number;
  cooldownMs: number;
  lastAdjustment?: number;
}

export interface ScalingMetrics {
  clusterId: string;
  requestsPerSecond: number;
  errorRate: number;
  averageLatency: number;
  p95Latency: number;
  costPerRequest: number;
  currentRateLimit: number;
  timestamp: number;
}

export interface ScalingDecision {
  action: "scale_up" | "scale_down" | "no_change";
  currentLimit: number;
  newLimit: number;
  reason: string;
}
```

### Main Export

#### `DreamNetAutoScaleCore`

**Methods**:
- **`registerRule(rule): void`**
- **`startScaling(ruleId): void`**
- **`stopScaling(ruleId): void`**
- **`evaluateScaling(ruleId): Promise<ScalingDecision | null>`**
- **`getAllRules(): ScalingRule[]`**
- **`getRule(ruleId): ScalingRule | undefined`**

---

**Status**: ✅ Implemented

