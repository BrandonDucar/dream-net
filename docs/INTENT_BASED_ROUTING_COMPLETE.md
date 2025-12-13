# Intent-Based Routing - Complete Documentation

**Generated:** 2025-01-27  
**Status:** Complete Documentation & Implementation Plan

---

## Overview

Intent-Based Routing enables CoW Swap/OneFlow-style intent processing with MEV-aware execution. Users express high-level goals (intents) rather than raw transactions, and solvers optimize and execute them efficiently.

---

## Architecture

### Components

1. **Intent Processor** (`intentProcessor.ts`)
   - Parses user intents
   - Validates intent constraints
   - Routes to solvers

2. **Solver Matching** (`solver.ts`)
   - Finds matching solvers for intents
   - Optimizes execution paths
   - Selects best solver

3. **Cross-Chain Routing** (`routing.ts`)
   - Routes intents across chains
   - Optimizes gas costs
   - Handles bridge operations

4. **MEV Protection** (`mevProtection.ts`)
   - Detects MEV opportunities
   - Protects against front-running
   - Ensures fair execution

---

## Intent Types

### Swap Intent

**Definition**: Exchange token X for token Y

```typescript
interface SwapIntent {
  type: 'swap';
  fromToken: string;
  toToken: string;
  amount: bigint;
  constraints: {
    maxSlippage: number; // e.g., 0.5% (0.005)
    deadline: number; // timestamp
    preferredChains?: string[]; // ['base', 'ethereum']
  };
}
```

**Example**:
```typescript
{
  type: 'swap',
  fromToken: 'USDC',
  toToken: 'ETH',
  amount: ethers.parseUnits('1000', 6), // 1000 USDC
  constraints: {
    maxSlippage: 0.005, // 0.5%
    deadline: Date.now() + 3600000, // 1 hour
    preferredChains: ['base']
  }
}
```

### Bridge Intent

**Definition**: Move tokens from chain A to chain B

```typescript
interface BridgeIntent {
  type: 'bridge';
  token: string;
  amount: bigint;
  fromChain: string;
  toChain: string;
  constraints: {
    maxSlippage: number;
    deadline: number;
    preferredBridge?: string; // 'star-bridge', 'layerzero', etc.
  };
}
```

**Example**:
```typescript
{
  type: 'bridge',
  token: 'USDC',
  amount: ethers.parseUnits('1000', 6),
  fromChain: 'base',
  toChain: 'ethereum',
  constraints: {
    maxSlippage: 0.01, // 1%
    deadline: Date.now() + 7200000, // 2 hours
    preferredBridge: 'star-bridge'
  }
}
```

### Multi-Step Intent

**Definition**: Complex multi-step operation

```typescript
interface MultiStepIntent {
  type: 'multi-step';
  steps: IntentStep[];
  constraints: {
    maxTotalSlippage: number;
    deadline: number;
    atomic: boolean; // All steps must succeed or none
  };
}

interface IntentStep {
  type: 'swap' | 'bridge' | 'deposit' | 'withdraw' | 'yield';
  params: Record<string, any>;
}
```

**Example**:
```typescript
{
  type: 'multi-step',
  steps: [
    { type: 'swap', params: { from: 'USDC', to: 'ETH', amount: '1000' } },
    { type: 'bridge', params: { token: 'ETH', fromChain: 'base', toChain: 'ethereum' } },
    { type: 'deposit', params: { token: 'ETH', protocol: 'aave', amount: 'all' } }
  ],
  constraints: {
    maxTotalSlippage: 0.02, // 2%
    deadline: Date.now() + 10800000, // 3 hours
    atomic: true
  }
}
```

---

## Intent Processing Flow

```
User Submits Intent
    ↓
Intent Processor Validates
    ↓
Solver Matching Finds Candidates
    ↓
Solver Optimization (gas, slippage, MEV)
    ↓
Best Solver Selected
    ↓
MEV Protection Applied
    ↓
Intent Executed
    ↓
Result Returned to User
```

---

## Solver Matching

### Solver Types

1. **DEX Aggregators**
   - 1inch, 0x, Paraswap
   - Best for simple swaps

2. **Bridge Aggregators**
   - Socket, LI.FI, Stargate
   - Best for cross-chain transfers

3. **MEV Solvers**
   - Flashbots, Eden Network
   - Best for MEV-aware execution

4. **Custom Solvers**
   - DreamNet solvers
   - Optimized for DreamNet ecosystem

### Matching Algorithm

```typescript
function findMatchingSolvers(intent: Intent): Solver[] {
  const solvers: Solver[] = [];
  
  // Find solvers that can handle this intent type
  for (const solver of registeredSolvers) {
    if (solver.canHandle(intent.type)) {
      // Check if solver meets constraints
      if (solver.meetsConstraints(intent.constraints)) {
        solvers.push(solver);
      }
    }
  }
  
  // Sort by estimated execution cost (gas + fees)
  return solvers.sort((a, b) => {
    const costA = a.estimateCost(intent);
    const costB = b.estimateCost(intent);
    return costA - costB;
  });
}
```

---

## Cross-Chain Routing

### Integration with Star Bridge Lungs

- Uses Star Bridge Lungs for chain health monitoring
- Selects optimal chains based on gas prices
- Routes through most efficient bridges

### Routing Algorithm

```typescript
async function optimizeCrossChainRoute(
  intent: BridgeIntent,
  starBridge: StarBridgeLungs
): Promise<ExecutionPath> {
  // Get chain metrics from Star Bridge
  const chainMetrics = starBridge.status().chainMetrics;
  
  // Find optimal route
  const routes = findRoutes(intent.fromChain, intent.toChain, chainMetrics);
  
  // Score routes by:
  // - Gas cost
  // - Bridge fees
  // - Estimated time
  // - Reliability
  const scoredRoutes = routes.map(route => ({
    route,
    score: scoreRoute(route, chainMetrics),
  }));
  
  // Return best route
  return scoredRoutes.sort((a, b) => b.score - a.score)[0].route;
}
```

---

## MEV Protection

### MEV Detection

```typescript
function detectMEVOpportunity(intent: Intent, mempool: Transaction[]): MEVOpportunity | null {
  // Check for front-running opportunities
  const similarIntents = mempool.filter(tx => 
    isSimilarIntent(tx, intent)
  );
  
  if (similarIntents.length > 0) {
    return {
      type: 'front-running',
      risk: 'high',
      protection: 'use-private-mempool',
    };
  }
  
  // Check for sandwich attack opportunities
  if (intent.type === 'swap') {
    const sandwichRisk = detectSandwichRisk(intent, mempool);
    if (sandwichRisk) {
      return {
        type: 'sandwich',
        risk: 'medium',
        protection: 'use-flashbots',
      };
    }
  }
  
  return null;
}
```

### MEV Protection Strategies

1. **Private Mempool**
   - Submit to Flashbots or Eden Network
   - Avoids public mempool exposure

2. **Slippage Protection**
   - Dynamic slippage based on market conditions
   - Revert if slippage exceeds threshold

3. **Deadline Enforcement**
   - Strict deadline checking
   - Revert if deadline passed

4. **Atomic Execution**
   - All steps succeed or none
   - Prevents partial execution attacks

---

## Integration with DreamNet Systems

### Star Bridge Lungs

- Chain health monitoring
- Gas price tracking
- Bridge reliability metrics

### Slime-Mold Router

- Network topology optimization
- Path finding algorithms
- Traffic distribution

### Base Mini-Apps

- Intent submission from mini-apps
- Result callback handling
- Status tracking

### Nervous System Core

- Intent events published to message bus
- Execution status updates
- Error handling and alerts

---

## Implementation Plan

### Phase 6.1: Intent Processor
- [ ] Implement intent parsing
- [ ] Add intent validation
- [ ] Create intent registry

### Phase 6.2: Solver Matching
- [ ] Implement solver registry
- [ ] Add solver matching algorithm
- [ ] Create solver scoring system

### Phase 6.3: Cross-Chain Routing
- [ ] Integrate with Star Bridge Lungs
- [ ] Implement routing algorithm
- [ ] Add bridge selection logic

### Phase 6.4: MEV Protection
- [ ] Implement MEV detection
- [ ] Add private mempool integration
- [ ] Create protection strategies

### Phase 6.5: Integration
- [ ] Integrate with Star Bridge Lungs
- [ ] Integrate with Slime-Mold Router
- [ ] Integrate with Base Mini-Apps
- [ ] Integrate with Nervous System Core

---

## Success Criteria

- ✅ Intent processor handles all intent types
- ✅ Solver matching finds optimal solvers
- ✅ Cross-chain routing optimizes gas costs
- ✅ MEV protection prevents front-running
- ✅ Integration with all DreamNet systems
- ✅ End-to-end intent execution works

---

## Security Considerations

1. **Intent Validation**
   - Validate all constraints
   - Check deadline and slippage
   - Verify token addresses

2. **Solver Trust**
   - Reputation system for solvers
   - Slashing for bad execution
   - Performance tracking

3. **MEV Protection**
   - Private mempool for sensitive intents
   - Slippage protection
   - Atomic execution

---

## Next Steps

1. Implement intent processor
2. Create solver registry
3. Integrate with Star Bridge Lungs
4. Add MEV protection
5. Test end-to-end flow

