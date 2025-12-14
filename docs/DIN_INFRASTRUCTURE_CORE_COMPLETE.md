# DIN Infrastructure Core - Complete Documentation

**Package**: `@dreamnet/din-infrastructure-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

DIN Infrastructure Core provides **cryptoeconomic security** for DreamNet infrastructure, inspired by DIN's EigenLayer model. It enables node operator staking, performance monitoring, and slashing for misbehavior, downtime, or bad data.

### Key Features

- **Node Operator Staking**: Operators stake ETH/stETH to participate
- **Performance Monitoring**: Tracks success rate (>99%), latency (<250ms), throughput (13B+ requests/month)
- **Slashing**: Penalizes operators for violations (downtime, bad data, misbehavior)
- **Performance Scoring**: Calculates performance scores (0-100) for operators
- **RPC Routing**: Supports routing at scale (13B+ requests/month capability)

---

## Architecture

### How It Works

```
Operator Registration → Staking → Performance Monitoring → Violation Detection → Slashing
```

1. **Operator Registration**: Node operators register with wallet address
2. **Staking**: Operators stake ETH/stETH to participate
3. **Performance Monitoring**: System tracks performance metrics continuously
4. **Violation Detection**: Detects violations (downtime, bad data, misbehavior)
5. **Slashing**: Penalizes operators by slashing staked amount

### Why This Design

- **Cryptoeconomic Security**: Staking aligns operator incentives
- **Performance Guarantees**: Enforces >99% success rate and <250ms latency
- **Scalability**: Supports 13B+ requests/month routing capability
- **Accountability**: Slashing ensures operators maintain quality

---

## API Reference

### Types

```typescript
export interface NodeOperator {
  id: string;
  walletAddress: string;
  stakedAmount: bigint; // in wei
  performanceScore: number; // 0-100
  violations: Violation[];
  registeredAt: number;
  lastPerformanceCheck: number;
}

export interface Violation {
  type: 'downtime' | 'bad_data' | 'misbehavior' | 'performance_threshold';
  timestamp: number;
  durationMinutes?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface PerformanceMetrics {
  serviceId: string;
  successRate: number; // 0-100 (target: >99%)
  p95Latency: number; // ms (target: <250ms)
  p99Latency: number; // ms
  throughput: number; // requests/month (target: 13B+)
  uptime: number; // percentage (target: >99.9%)
  timestamp: number;
}

export interface StakingEvent {
  operatorId: string;
  type: 'stake' | 'unstake' | 'slash';
  amount: bigint;
  timestamp: number;
  reason?: string;
}

export interface DINInfrastructureStatus {
  totalOperators: number;
  totalStaked: bigint;
  activeOperators: number;
  slashedOperators: number;
  averagePerformanceScore: number;
  lastPerformanceCheck: number | null;
}
```

### Main Export

#### `DINInfrastructureCore`

Main API object with all DIN infrastructure methods.

**Methods**:

- **`registerOperator(operatorId: string, walletAddress: string, initialStake?: bigint): Promise<void>`**
  - Register a node operator
  - Optional initial stake amount

- **`stake(operatorId: string, amount: bigint): Promise<void>`**
  - Stake for an operator
  - Increases operator's staked amount

- **`unstake(operatorId: string, amount: bigint): Promise<void>`**
  - Unstake for an operator
  - Decreases operator's staked amount

- **`getOperator(operatorId: string): NodeOperator | undefined`**
  - Get operator details

- **`recordMetrics(operatorId: string, metrics: PerformanceMetrics): Promise<void>`**
  - Record performance metrics for an operator
  - Updates performance score

- **`getMetrics(operatorId: string, limit?: number): PerformanceMetrics[]`**
  - Get performance metrics for an operator
  - Optional limit for recent metrics

- **`status(): DINInfrastructureStatus`**
  - Get DIN infrastructure status

**Example**:
```typescript
import DINInfrastructureCore from "@dreamnet/din-infrastructure-core";

// Register operator
await DINInfrastructureCore.registerOperator(
  "operator-1",
  "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  1000000000000000000n // 1 ETH
);

// Stake additional amount
await DINInfrastructureCore.stake("operator-1", 500000000000000000n); // 0.5 ETH

// Record performance metrics
await DINInfrastructureCore.recordMetrics("operator-1", {
  serviceId: "rpc-service",
  successRate: 99.5,
  p95Latency: 200,
  p99Latency: 300,
  throughput: 13000000000, // 13B requests/month
  uptime: 99.95,
  timestamp: Date.now(),
});

// Get operator
const operator = DINInfrastructureCore.getOperator("operator-1");
console.log("Staked:", operator.stakedAmount);
console.log("Performance Score:", operator.performanceScore);

// Get status
const status = DINInfrastructureCore.status();
console.log("Total operators:", status.totalOperators);
console.log("Total staked:", status.totalStaked);
console.log("Average performance:", status.averagePerformanceScore);
```

---

## Integration Points

### Consumes

- **Performance Monitoring**: Metrics collection system
- **Staking System**: ETH/stETH staking mechanism
- **Slashing System**: Violation detection and slashing

### Produces

- **Operator Registry**: Registered operators and their status
- **Performance Scores**: Calculated performance scores
- **Staking Events**: Stake/unstake/slash events

---

## Usage Examples

### Register and Stake Operator

```typescript
import DINInfrastructureCore from "@dreamnet/din-infrastructure-core";

// Register operator with initial stake
await DINInfrastructureCore.registerOperator(
  "operator-1",
  "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  1000000000000000000n // 1 ETH initial stake
);

// Stake additional amount
await DINInfrastructureCore.stake("operator-1", 500000000000000000n); // 0.5 ETH
```

### Record Performance Metrics

```typescript
// Record metrics periodically
setInterval(async () => {
  await DINInfrastructureCore.recordMetrics("operator-1", {
    serviceId: "rpc-service",
    successRate: 99.5,
    p95Latency: 200,
    p99Latency: 300,
    throughput: 13000000000,
    uptime: 99.95,
    timestamp: Date.now(),
  });
}, 60000); // Every minute
```

### Get Operator Performance

```typescript
const operator = DINInfrastructureCore.getOperator("operator-1");
console.log("Performance Score:", operator.performanceScore);
console.log("Violations:", operator.violations.length);

// Get recent metrics
const metrics = DINInfrastructureCore.getMetrics("operator-1", 10);
metrics.forEach(m => {
  console.log(`Success Rate: ${m.successRate}%, Latency: ${m.p95Latency}ms`);
});
```

### Monitor Infrastructure Status

```typescript
const status = DINInfrastructureCore.status();
console.log("Total Operators:", status.totalOperators);
console.log("Total Staked:", status.totalStaked.toString());
console.log("Active Operators:", status.activeOperators);
console.log("Slashed Operators:", status.slashedOperators);
console.log("Average Performance:", status.averagePerformanceScore);
```

---

## Best Practices

1. **Performance Targets**: Maintain >99% success rate and <250ms latency
2. **Staking**: Stake sufficient amount to participate meaningfully
3. **Monitoring**: Record metrics regularly (every minute or less)
4. **Violation Prevention**: Avoid downtime, bad data, and misbehavior
5. **Performance Score**: Maintain high performance score (>90) to avoid slashing

---

## Security Considerations

- **Staking Security**: Secure staking keys and wallet addresses
- **Performance Validation**: Validate performance metrics before recording
- **Slashing Protection**: Monitor violations to avoid slashing
- **Operator Identity**: Verify operator identity before registration

---

## Related Systems

- **Star Bridge Lungs**: Chain metrics and performance
- **Resilience Early Warning**: Early warning for violations
- **HALO Loop**: Weak point detection and repair

---

**Status**: ✅ Implemented  
**Next**: Add slashing logic and violation detection

