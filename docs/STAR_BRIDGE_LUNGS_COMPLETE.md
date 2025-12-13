# Star Bridge Lungs - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Star Bridge Lungs provides **cross-chain bridge monitoring** for DreamNet. It tracks chain health metrics (gas pressure, liquidity pressure, congestion, reliability) and generates "breath snapshots" that recommend optimal cross-chain routes.

---

## Key Features

### Chain Metrics
- Gas pressure tracking
- Liquidity pressure tracking
- Congestion monitoring
- Reliability tracking

### Breath Snapshots
- Inhale/exhale directions
- Pressure score calculation
- Route recommendations
- Cross-chain optimization

### Chain Support
- Base, Ethereum, Solana, Polygon, Arbitrum, Avalanche, Near, Monad
- Chain-specific metrics
- Multi-chain monitoring

---

## Architecture

### Components

1. **Breath Scheduler** (`scheduler/breathScheduler.ts`)
   - Cycle execution
   - Metric collection
   - Snapshot generation

---

## API Reference

### Execution

#### `run(context: StarBridgeContext): StarBridgeStatus`
Runs Star Bridge cycle.

**Example**:
```typescript
import { StarBridgeLungs } from '@dreamnet/star-bridge-lungs';

const status = StarBridgeLungs.run({
  neuralMesh: neuralMesh,
  quantumAnticipation: qal,
  slugTimeMemory: slugTime,
  slimeRouter: slimeRouter,
});
```

### Status

#### `status(): StarBridgeStatus`
Gets Star Bridge status.

**Example**:
```typescript
const status = StarBridgeLungs.status();
console.log(`Chain metrics: ${status.chainMetrics.length}`);
console.log(`Last breaths: ${status.lastBreaths.length}`);
```

---

## Data Models

### ChainId

```typescript
type ChainId =
  | 'base'
  | 'ethereum'
  | 'solana'
  | 'polygon'
  | 'arbitrum'
  | 'avalanche'
  | 'near'
  | 'monad'
  | 'unknown';
```

### BreathDirection

```typescript
type BreathDirection = 'inhale' | 'exhale';
```

### ChainBreathMetrics

```typescript
interface ChainBreathMetrics {
  chain: ChainId;
  gasPressure: number; // 0–1 (heuristic)
  liquidityPressure: number; // 0–1 (USDC/bridge pressure)
  congestion: number; // 0–1
  reliability: number; // 0–1
  lastUpdatedAt: number;
}
```

### BreathSnapshot

```typescript
interface BreathSnapshot {
  id: string;
  fromChain: ChainId;
  toChain: ChainId;
  direction: BreathDirection;
  pressureScore: number; // 0–1
  recommended: boolean;
  meta?: Record<string, any>;
  createdAt: number;
}
```

### StarBridgeStatus

```typescript
interface StarBridgeStatus {
  lastRunAt: number | null;
  chainMetrics: ChainBreathMetrics[];
  lastBreaths: BreathSnapshot[];
}
```

---

## Chain Metrics

### Gas Pressure
- Gas price pressure
- Transaction cost pressure
- Network demand
- Cost efficiency

### Liquidity Pressure
- Bridge liquidity
- Token availability
- Cross-chain capacity
- Liquidity depth

### Congestion
- Network congestion
- Transaction backlog
- Throughput limits
- Capacity constraints

### Reliability
- Bridge reliability
- Success rate
- Uptime
- Stability

---

## Breath Snapshots

### Inhale
- Moving assets into chain
- Depositing liquidity
- Inbound transfers
- Chain entry

### Exhale
- Moving assets out of chain
- Withdrawing liquidity
- Outbound transfers
- Chain exit

### Pressure Score
- Composite score (0-1)
- Based on metrics
- Route optimization
- Recommendation threshold

---

## Integration Points

### DreamNet Systems
- **Neural Mesh**: Memory integration
- **Quantum Anticipation**: Predictive metrics
- **Slug Time Memory**: Historical metrics
- **Slime Router**: Route optimization

### External Systems
- **Bridge Protocols**: Bridge data
- **Chain APIs**: Chain metrics
- **Analytics**: Bridge analytics

---

## Usage Examples

### Run Star Bridge Cycle

```typescript
const status = StarBridgeLungs.run({
  neuralMesh: {
    remember: (data) => {
      console.log('Remembering:', data);
    },
  },
  quantumAnticipation: qal,
  slugTimeMemory: slugTime,
  slimeRouter: slimeRouter,
});

console.log(`Chain metrics: ${status.chainMetrics.length}`);
status.chainMetrics.forEach(metric => {
  console.log(`${metric.chain}: gas=${metric.gasPressure}, liquidity=${metric.liquidityPressure}`);
});
```

### Get Status

```typescript
const status = StarBridgeLungs.status();

status.lastBreaths.forEach(breath => {
  if (breath.recommended) {
    console.log(`Recommended: ${breath.fromChain} → ${breath.toChain} (${breath.direction})`);
    console.log(`Pressure score: ${breath.pressureScore}`);
  }
});
```

---

## Best Practices

1. **Metric Collection**
   - Collect regularly
   - Track all chains
   - Monitor trends
   - Update promptly

2. **Breath Snapshots**
   - Generate frequently
   - Use for routing
   - Consider pressure scores
   - Optimize routes

3. **Chain Monitoring**
   - Monitor all supported chains
   - Track reliability
   - Watch liquidity
   - Monitor congestion

---

## Security Considerations

1. **Metric Security**
   - Validate metrics
   - Protect metric data
   - Audit collection
   - Prevent manipulation

2. **Bridge Security**
   - Validate bridge data
   - Secure bridge connections
   - Audit bridge operations
   - Monitor bridge health

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

