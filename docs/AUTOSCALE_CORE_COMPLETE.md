# DreamNet Auto-Scale Core - Complete Documentation

**Package**: `@dreamnet/dreamnet-autoscale-core`  
**Status**: ✅ Complete  
**Last Updated**: 2025-01-27

---

## Overview

DreamNet Auto-Scale Core provides **adaptive rate limiting and auto-scaling** capabilities for DreamNet clusters. It monitors metrics (requests per second, error rates, latency, cost) and automatically adjusts rate limits to optimize performance and cost.

### Key Features

- **Adaptive Scaling**: Automatically adjusts rate limits based on real-time metrics
- **Multi-Metric Evaluation**: Considers requests/sec, error rates, latency, and cost
- **Cooldown Protection**: Prevents rapid oscillation with configurable cooldown periods
- **Cost-Aware**: Can scale down when cost thresholds are exceeded
- **Integration**: Bridges scaling decisions to Spider Web for operational visibility

---

## Architecture

### How It Works

```
Metrics Collection → Rule Evaluation → Scaling Decision → Rate Limit Update → Spider Web Bridge
```

1. **Metrics Collection**: Pulls metrics from `DreamNetMetricsCore` (requests/sec, errors, latency)
2. **Rule Evaluation**: `ScalingEngine` evaluates rules against current metrics
3. **Decision Making**: Determines if scaling up/down is needed based on thresholds
4. **Rate Limit Update**: Updates rate limits via `DreamNetControlCore`
5. **Operational Bridge**: Publishes scaling events to Spider Web for monitoring

### Why This Design

- **Decoupled**: Uses existing metrics and control systems, doesn't duplicate functionality
- **Rule-Based**: Flexible rules allow per-cluster customization
- **Cooldown**: Prevents thrashing by requiring time between adjustments
- **Cost-Aware**: Can optimize for cost, not just performance
- **Observable**: All decisions are bridged to Spider Web for operational visibility

---

## API Reference

### Types

```typescript
export interface ScalingMetrics {
  clusterId: string;
  requestsPerSecond: number;
  errorRate: number; // errors / requests
  averageLatency: number; // ms
  p95Latency: number; // ms
  costPerRequest: number; // USD
  currentRateLimit: number; // requests/min
  timestamp: number;
}

export interface ScalingRule {
  id: string;
  clusterId: string;
  enabled: boolean;
  minRateLimit: number; // Floor
  maxRateLimit: number; // Ceiling
  scaleUpThreshold: {
    requestsPerSecond?: number;
    errorRate?: number; // Lower is better
    latency?: number; // Lower is better
  };
  scaleDownThreshold: {
    requestsPerSecond?: number;
    errorRate?: number; // Higher triggers scale-down
    latency?: number; // Higher triggers scale-down
  };
  costThreshold?: number; // Max USD/hour
  adjustmentStep: number; // How much to adjust by
  cooldownMs: number; // Wait before next adjustment
  lastAdjustment?: number;
}

export interface ScalingDecision {
  clusterId: string;
  action: "scale_up" | "scale_down" | "no_change";
  currentLimit: number;
  newLimit: number;
  reason: string;
  metrics: ScalingMetrics;
}
```

### Functions

#### `registerRule(rule: ScalingRule): void`

Register a scaling rule for a cluster.

**Example**:
```typescript
DreamNetAutoScaleCore.registerRule({
  id: "api-cluster-scaling",
  clusterId: "api",
  enabled: true,
  minRateLimit: 100,
  maxRateLimit: 10000,
  scaleUpThreshold: {
    requestsPerSecond: 500,
    latency: 200, // Scale up if latency < 200ms
  },
  scaleDownThreshold: {
    requestsPerSecond: 100,
    latency: 500, // Scale down if latency > 500ms
  },
  costThreshold: 10, // Max $10/hour
  adjustmentStep: 100,
  cooldownMs: 60000, // 1 minute cooldown
});
```

#### `startScaling(ruleId: string): void`

Start automatic scaling for a rule. Evaluates immediately, then every 60 seconds.

**Example**:
```typescript
DreamNetAutoScaleCore.startScaling("api-cluster-scaling");
```

#### `stopScaling(ruleId: string): void`

Stop automatic scaling for a rule.

**Example**:
```typescript
DreamNetAutoScaleCore.stopScaling("api-cluster-scaling");
```

#### `evaluateScaling(ruleId: string): Promise<ScalingDecision | null>`

Manually evaluate scaling for a rule. Returns decision or null if no change needed.

**Example**:
```typescript
const decision = await DreamNetAutoScaleCore.evaluateScaling("api-cluster-scaling");
if (decision?.action === "scale_up") {
  console.log(`Scaling up: ${decision.currentLimit} → ${decision.newLimit}`);
}
```

#### `getAllRules(): ScalingRule[]`

Get all registered scaling rules.

#### `getRule(ruleId: string): ScalingRule | undefined`

Get a specific scaling rule.

---

## Integration Points

### Consumes

- **DreamNetMetricsCore**: Pulls cluster metrics (requests/sec, errors, latency)
- **DreamNetControlCore**: Updates rate limits

### Produces

- **Spider Web Events**: 
  - `auto_scaling_decision`: When a scaling decision is made
  - `auto_scaling_applied`: When scaling is applied

### Integration Pattern

```typescript
// Metrics flow
DreamNetMetricsCore.getClusterMetrics(clusterId) 
  → ScalingEngine.evaluateRule(rule, metrics)
  → ScalingDecision
  → DreamNetControlCore.updateRateLimit()
  → bridgeToSpiderWeb({ type: "auto_scaling_applied" })
```

---

## Usage Examples

### Basic Setup

```typescript
import { DreamNetAutoScaleCore } from "@dreamnet/dreamnet-autoscale-core";

// Register rule
DreamNetAutoScaleCore.registerRule({
  id: "api-scaling",
  clusterId: "api",
  enabled: true,
  minRateLimit: 100,
  maxRateLimit: 5000,
  scaleUpThreshold: { requestsPerSecond: 800 },
  scaleDownThreshold: { requestsPerSecond: 200 },
  adjustmentStep: 200,
  cooldownMs: 120000, // 2 minutes
});

// Start automatic scaling
DreamNetAutoScaleCore.startScaling("api-scaling");
```

### Cost-Aware Scaling

```typescript
DreamNetAutoScaleCore.registerRule({
  id: "cost-aware-scaling",
  clusterId: "api",
  enabled: true,
  minRateLimit: 500,
  maxRateLimit: 10000,
  scaleUpThreshold: { requestsPerSecond: 1000 },
  scaleDownThreshold: { requestsPerSecond: 500 },
  costThreshold: 5, // Max $5/hour
  adjustmentStep: 500,
  cooldownMs: 300000, // 5 minutes
});
```

### Latency-Based Scaling

```typescript
DreamNetAutoScaleCore.registerRule({
  id: "latency-scaling",
  clusterId: "api",
  enabled: true,
  minRateLimit: 100,
  maxRateLimit: 5000,
  scaleUpThreshold: { latency: 150 }, // Scale up if latency < 150ms
  scaleDownThreshold: { latency: 300 }, // Scale down if latency > 300ms
  adjustmentStep: 100,
  cooldownMs: 60000,
});
```

---

## Best Practices

1. **Set Reasonable Bounds**: Always set `minRateLimit` and `maxRateLimit` to prevent runaway scaling
2. **Use Cooldowns**: Set `cooldownMs` to prevent rapid oscillation (recommend 1-5 minutes)
3. **Monitor Decisions**: Check Spider Web events to understand scaling behavior
4. **Cost Thresholds**: Set `costThreshold` to prevent unexpected costs
5. **Gradual Adjustments**: Use smaller `adjustmentStep` values for smoother scaling

---

## Security Considerations

- **Rate Limit Changes**: Scaling decisions modify rate limits, which affects system capacity
- **Cost Control**: Cost thresholds prevent runaway costs but may impact performance
- **Audit Trail**: All scaling decisions should be logged (via Audit Core)

---

## Related Systems

- **DreamNet Control Core**: Manages rate limits
- **DreamNet Metrics Core**: Provides metrics
- **Spider Web Core**: Receives scaling events
- **DreamNet Operational Bridge**: Bridges events to Spider Web

---

**Status**: ✅ Complete  
**Next**: Continue with RBAC Core documentation
