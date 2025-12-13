# Stablecoin Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation (Partial Implementation)

---

## Overview

Stablecoin Core provides **stablecoin infrastructure** for DreamNet, including CCTP V2 integration for cross-chain USDC transfers, Chainlink Proof of Reserve (PoR) verification, circuit breaker protection, and reserve monitoring. Designed for compliant, secure stablecoin operations.

---

## Key Features

### Cross-Chain Transfers
- CCTP V2 integration (Circle)
- Cross-chain USDC transfers
- Attestation-based transfers
- Zero-slippage transfers

### Reserve Verification
- Chainlink PoR integration
- Reserve amount verification
- Stale data detection
- Reserve monitoring

### Circuit Breaker
- Circuit breaker pattern
- Reserve threshold protection
- Automatic halt on breaches
- Cooldown management

### Reserve Monitoring
- Continuous monitoring
- Threshold breach alerts
- Reserve drop detection
- Alert handlers

---

## Architecture

### Components

1. **CCTP V2 Client** (`CCTPV2Client.ts`)
   - Cross-chain transfer initiation
   - Transfer status checking
   - Transfer completion

2. **CCTP V2 Hooks** (`CCTPV2Hooks.ts`)
   - Event handling
   - Transfer hooks
   - Event types

3. **Chainlink PoR** (`ChainlinkPoR.ts`)
   - PoR data retrieval
   - Reserve verification
   - Stale data detection

4. **Circuit Breaker** (`CircuitBreaker.ts`)
   - Circuit breaker logic
   - Reserve threshold checking
   - State management

5. **Reserve Monitor** (`ReserveMonitor.ts`)
   - Continuous monitoring
   - Alert generation
   - Threshold tracking

6. **CCTP V1 Fallback** (`CCTPV1Fallback.ts`)
   - V1 protocol fallback
   - Legacy support

---

## API Reference

### CCTP V2 Client

#### `CCTPV2Client`
CCTP V2 client for cross-chain transfers.

**Example**:
```typescript
import { CCTPV2Client } from '@dreamnet/stablecoin-core';

const client = new CCTPV2Client(provider, cctpV2Address, signer);

// Initiate transfer
const result = await client.transfer({
  sourceChain: 'base',
  targetChain: 'ethereum',
  amount: BigInt('1000000000'), // 1000 USDC (6 decimals)
  recipient: '0x...',
  sender: '0x...',
});
```

#### `transfer(params: CCTPV2TransferParams): Promise<CCTPV2TransferResult>`
Initiates cross-chain transfer.

**Example**:
```typescript
const result = await client.transfer({
  sourceChain: 'base',
  targetChain: 'ethereum',
  amount: BigInt('1000000000'),
  recipient: '0x...',
  sender: '0x...',
});
```

#### `checkTransferStatus(sourceTxHash: string): Promise<CCTPV2TransferResult>`
Checks transfer status.

**Example**:
```typescript
const status = await client.checkTransferStatus('0x...');
```

### Chainlink PoR

#### `ChainlinkPoR`
Chainlink Proof of Reserve integration.

**Example**:
```typescript
import { ChainlinkPoR } from '@dreamnet/stablecoin-core';

const por = new ChainlinkPoR(provider, feedAddress);

// Get latest PoR data
const porData = await por.getLatestPoR();

// Verify reserves
const hasReserves = await por.verifyReserves(BigInt('1000000000'));

// Check if stale
const isStale = await por.isStale();
```

#### `getLatestPoR(): Promise<PoRData>`
Gets latest PoR data.

**Example**:
```typescript
const porData = await por.getLatestPoR();
```

#### `verifyReserves(expectedAmount: bigint): Promise<boolean>`
Verifies reserve amount.

**Example**:
```typescript
const hasReserves = await por.verifyReserves(BigInt('1000000000'));
```

### Circuit Breaker

#### `CircuitBreaker`
Circuit breaker for reserve protection.

**Example**:
```typescript
import { CircuitBreaker } from '@dreamnet/stablecoin-core';

const breaker = new CircuitBreaker(por, {
  reserveThreshold: BigInt('1000000000000'), // 1M USDC
  cooldownMs: 3600000, // 1 hour
  maxFailures: 3,
});

// Check if transfer allowed
const allowed = await breaker.checkTransfer(BigInt('1000000000'));
if (!allowed) {
  console.log('Circuit breaker open - transfers halted');
}
```

#### `checkTransfer(transferAmount: bigint): Promise<boolean>`
Checks if transfer is allowed.

**Example**:
```typescript
const allowed = await breaker.checkTransfer(amount);
```

#### `getState(): CircuitBreakerState`
Gets current circuit breaker state.

**Example**:
```typescript
const state = breaker.getState();
// Returns: 'closed' | 'open' | 'half-open'
```

### Reserve Monitor

#### `ReserveMonitor`
Continuous reserve monitoring.

**Example**:
```typescript
import { ReserveMonitor } from '@dreamnet/stablecoin-core';

const monitor = new ReserveMonitor(por, breaker);

// Register alert handler
monitor.onAlert((alert) => {
  console.log(`Alert: ${alert.type} - ${alert.message}`);
});

// Start monitoring
monitor.start(60000); // Check every minute
```

#### `start(intervalMs: number): void`
Starts monitoring.

**Example**:
```typescript
monitor.start(60000);
```

#### `onAlert(handler: ReserveAlertHandler): void`
Registers alert handler.

**Example**:
```typescript
monitor.onAlert((alert) => {
  // Handle alert
});
```

---

## Data Models

### CCTPV2TransferParams

```typescript
interface CCTPV2TransferParams {
  sourceChain: string;
  targetChain: string;
  amount: bigint;
  recipient: string;
  sender: string;
}
```

### CCTPV2TransferResult

```typescript
interface CCTPV2TransferResult {
  sourceTxHash: string;
  attestationHash?: string;
  targetTxHash?: string;
  status: 'pending' | 'attesting' | 'completed' | 'failed';
}
```

### PoRData

```typescript
interface PoRData {
  reserveAmount: bigint;
  lastUpdate: number;
  chainId: number;
  feedAddress: string;
}
```

### CircuitBreakerConfig

```typescript
interface CircuitBreakerConfig {
  reserveThreshold: bigint;
  cooldownMs: number;
  maxFailures: number;
}
```

### ReserveAlert

```typescript
interface ReserveAlert {
  type: 'threshold_breach' | 'stale_data' | 'reserve_drop';
  severity: 'warning' | 'critical';
  message: string;
  timestamp: number;
}
```

---

## CCTP V2 Transfer Flow

### Transfer Process
1. **Initiate**: Burn USDC on source chain
2. **Attest**: Get attestation from Circle
3. **Complete**: Mint USDC on target chain

### Status Tracking
- **Pending**: Transfer initiated
- **Attesting**: Waiting for attestation
- **Completed**: Transfer completed
- **Failed**: Transfer failed

---

## Circuit Breaker States

### Closed
- Normal operation
- Transfers allowed
- Monitoring active

### Open
- Circuit breaker triggered
- Transfers halted
- Cooldown period active

### Half-Open
- Testing recovery
- Limited transfers
- Monitoring closely

---

## Reserve Monitoring

### Monitoring Checks
- Reserve threshold breaches
- Stale data detection
- Reserve drop detection (>5% drop)

### Alert Types
- **Threshold Breach**: Reserve below threshold
- **Stale Data**: PoR data outdated
- **Reserve Drop**: Significant reserve decrease

---

## Integration Points

### DreamNet Systems
- **Chain Abstraction Core**: Cross-chain operations
- **DreamNet Audit Core**: Transfer audit logging
- **DreamNet Alerts Core**: Alert notifications
- **Economic Engine Core**: Economic tracking

### External Systems
- **Circle CCTP**: Cross-chain protocol
- **Chainlink**: PoR feeds
- **Blockchain**: On-chain operations

---

## Usage Examples

### Cross-Chain Transfer

```typescript
const result = await client.transfer({
  sourceChain: 'base',
  targetChain: 'ethereum',
  amount: BigInt('1000000000'),
  recipient: '0x...',
  sender: '0x...',
});
```

### Monitor Reserves

```typescript
monitor.onAlert((alert) => {
  console.log(`Alert: ${alert.message}`);
});
monitor.start(60000);
```

### Use Circuit Breaker

```typescript
const allowed = await breaker.checkTransfer(amount);
if (!allowed) {
  console.log('Transfers halted');
}
```

---

## Best Practices

1. **Transfer Management**
   - Verify reserves before transfer
   - Monitor transfer status
   - Handle failures gracefully
   - Track all transfers

2. **Reserve Monitoring**
   - Monitor continuously
   - Set appropriate thresholds
   - Handle alerts promptly
   - Track reserve trends

---

## Security Considerations

1. **Transfer Security**
   - Verify reserves
   - Use circuit breaker
   - Monitor transfers
   - Audit all operations

2. **Reserve Security**
   - Verify PoR data
   - Check for stale data
   - Monitor reserve drops
   - Alert on breaches

---

**Status**: ✅ Complete Documentation (Partial Implementation)  
**Last Updated**: 2025-01-27  
**Note**: Full implementation pending Antigravity integration for CCTP V2

