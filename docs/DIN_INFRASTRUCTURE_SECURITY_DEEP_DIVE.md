# DIN Infrastructure Security - Deep Dive

**Generated:** 2025-01-27  
**Status:** Documentation & Implementation Plan

---

## Overview

DIN Infrastructure Security brings cryptoeconomic security to DreamNet infrastructure, inspired by DIN's EigenLayer model. This system enables node operators to stake ETH/stETH, monitors their performance, and slashes stakes for misbehavior, downtime, or bad data.

---

## Architecture

### Components

1. **Staking Mechanism** - Node operators stake ETH/stETH
2. **Performance Monitoring** - Tracks success rate, latency, throughput
3. **Slashing Logic** - Slashes stakes for violations
4. **On-Chain Registry** - Smart contract for operator registration and staking

### Integration Points

- **Star Bridge Lungs** - Cross-chain RPC routing performance
- **DreamNet Control Core** - Kill-switches and circuit breakers
- **Agent Wallet Manager** - Node operator wallets
- **DreamNet Metrics Core** - Performance metrics collection
- **Nervous System Core** - Message bus for alerts

---

## Staking Mechanism

### Node Operator Registration

Operators register by:
1. Providing wallet address
2. Staking minimum amount (e.g., 1 ETH)
3. Passing initial performance checks

### Staking Tiers

- **Tier 1**: 1-10 ETH (Basic operator)
- **Tier 2**: 10-100 ETH (Standard operator)
- **Tier 3**: 100+ ETH (Premium operator)

Higher tiers get:
- Higher routing priority
- Lower slashing risk
- Better performance thresholds

### Staking Flow

```
Operator Registers
    ↓
Stakes ETH/stETH
    ↓
Performance Monitoring Begins
    ↓
Success Rate > 99% && Latency < 250ms
    ↓
Operator Active
    ↓
[Violation Detected]
    ↓
Slashing Logic Executes
    ↓
Stake Reduced
```

---

## Performance Monitoring

### Key Metrics

1. **Success Rate** (Target: >99%)
   - Percentage of successful requests
   - Calculated over rolling 24-hour window
   - Failure threshold: <99% for 1 hour

2. **Latency** (Target: <250ms p95)
   - p95 latency in milliseconds
   - Calculated over rolling 1-hour window
   - Failure threshold: >250ms for 30 minutes

3. **Throughput** (Target: 13B+ requests/month)
   - Total requests per month
   - Calculated monthly
   - Failure threshold: <10B requests/month

4. **Uptime** (Target: >99.9%)
   - Percentage of time service is available
   - Calculated over rolling 7-day window
   - Failure threshold: <99.9% for 1 day

### Performance Score

```
Performance Score = 
  (Success Rate * 0.4) +
  (Latency Score * 0.3) +
  (Throughput Score * 0.2) +
  (Uptime * 0.1)

Where:
  Latency Score = max(0, 100 - ((p95Latency - 250) / 10))
  Throughput Score = min(100, (throughput / 13B) * 100)
```

---

## Slashing Logic

### Violation Types

1. **Downtime**
   - Service unavailable for >1 hour
   - Slash: 1% per minute of downtime
   - Max: 50% of stake

2. **Bad Data**
   - Returning incorrect data or errors
   - Slash: 5% per incident
   - Max: 50% of stake

3. **Misbehavior**
   - Malicious behavior detected
   - Slash: 10% per incident
   - Max: 50% of stake

4. **Performance Threshold**
   - Success rate <99% for >1 hour
   - Latency >250ms for >30 minutes
   - Slash: 2% per hour below threshold
   - Max: 50% of stake

### Slashing Calculation

```typescript
function calculateSlash(operator: NodeOperator, violations: Violation[]): bigint {
  let slashAmount = 0n;
  
  for (const violation of violations) {
    switch (violation.type) {
      case 'downtime':
        slashAmount += BigInt(violation.durationMinutes ?? 0) * (operator.stakedAmount / 100n); // 1% per minute
        break;
      case 'bad_data':
        slashAmount += operator.stakedAmount / 20n; // 5%
        break;
      case 'misbehavior':
        slashAmount += operator.stakedAmount / 10n; // 10%
        break;
      case 'performance_threshold':
        slashAmount += operator.stakedAmount / 50n; // 2%
        break;
    }
  }
  
  // Max 50% slash
  const maxSlash = operator.stakedAmount / 2n;
  return slashAmount > maxSlash ? maxSlash : slashAmount;
}
```

---

## On-Chain Registry Contract

### DreamNet Operator Registry (DINRegistry.sol)

**Features**:
- Operator registration
- Staking/unstaking
- Slashing
- Performance score tracking
- Operator status (active/inactive/slashed)

**Functions**:
```solidity
function registerOperator(address operator, uint256 minStake) external;
function stake(address operator) external payable;
function unstake(address operator, uint256 amount) external;
function slash(address operator, uint256 amount, string memory reason) external onlyGovernance;
function updatePerformanceScore(address operator, uint256 score) external onlyPerformanceMonitor;
function getOperator(address operator) external view returns (OperatorInfo memory);
```

---

## Integration with DreamNet Systems

### Star Bridge Lungs

- Monitors cross-chain RPC routing performance
- Reports metrics to DIN Infrastructure Core
- Triggers slashing for poor routing performance

### DreamNet Control Core

- Uses operator performance scores for routing decisions
- Prefers operators with higher performance scores
- Circuit breakers for operators with low scores

### Agent Wallet Manager

- Manages node operator wallets
- Handles staking/unstaking transactions
- Tracks operator balances

### DreamNet Metrics Core

- Collects performance metrics
- Calculates success rate, latency, throughput
- Reports to DIN Infrastructure Core

### Nervous System Core

- Publishes operator alerts
- Subscribes to performance metrics
- Triggers slashing events

---

## Implementation Plan

### Phase 4.1: Core Staking Logic
- [ ] Implement `staking.ts` - Staking mechanism
- [ ] Implement `slashing.ts` - Slashing logic
- [ ] Implement `performance.ts` - Performance monitoring

### Phase 4.2: On-Chain Contract
- [ ] Deploy `DINRegistry.sol` to Base testnet
- [ ] Implement contract integration
- [ ] Test staking/unstaking

### Phase 4.3: Integration
- [ ] Integrate with Star Bridge Lungs
- [ ] Integrate with DreamNet Control Core
- [ ] Integrate with Agent Wallet Manager
- [ ] Integrate with DreamNet Metrics Core
- [ ] Integrate with Nervous System Core

### Phase 4.4: Testing
- [ ] Unit tests for staking logic
- [ ] Unit tests for slashing logic
- [ ] Integration tests with Star Bridge
- [ ] End-to-end tests with contract

---

## Success Criteria

- ✅ Node operators can stake ETH/stETH
- ✅ Performance monitoring tracks all key metrics
- ✅ Slashing executes automatically for violations
- ✅ On-chain registry deployed and operational
- ✅ Integration with all DreamNet systems complete
- ✅ Performance targets met (>99% success, <250ms latency)

---

## Security Considerations

1. **Slashing Protection**
   - Maximum 50% slash per violation
   - Cooldown period between slashes
   - Governance approval for large slashes

2. **Performance Monitoring**
   - Multiple data sources for verification
   - Grace period for temporary issues
   - Appeal process for operators

3. **Staking Security**
   - Minimum stake requirements
   - Unstaking delay (e.g., 7 days)
   - Emergency pause mechanism

---

## Next Steps

1. Implement core staking/slashing logic
2. Deploy DINRegistry.sol contract
3. Integrate with Star Bridge Lungs
4. Set up performance monitoring
5. Test end-to-end flow

