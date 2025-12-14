# Intent Router Core - Complete Documentation

**Package**: `@dreamnet/intent-router-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Intent Router Core provides **CoW Swap/OneFlow-style intent processing** with MEV-aware execution. It enables users to express high-level intents (swap, bridge, multi-step) and automatically routes them to optimal solvers with MEV protection.

### Key Features

- **Intent Processing**: Parse and validate swap, bridge, and multi-step intents
- **Solver Matching**: Find optimal solvers for intents
- **MEV Protection**: Detect and protect against MEV opportunities
- **Cross-Chain Routing**: Route intents across multiple chains
- **Execution Tracking**: Track intent execution status and results

---

## API Reference

### Types

```typescript
export type IntentType = 'swap' | 'bridge' | 'multi-step';

export interface SwapIntent {
  type: 'swap';
  fromToken: string;
  toToken: string;
  amount: bigint;
  constraints: {
    maxSlippage: number; // e.g., 0.005 (0.5%)
    deadline: number; // timestamp
    preferredChains?: string[];
  };
}

export interface BridgeIntent {
  type: 'bridge';
  token: string;
  amount: bigint;
  fromChain: string;
  toChain: string;
  constraints: {
    maxSlippage: number;
    deadline: number;
    preferredBridge?: string;
  };
}

export interface MultiStepIntent {
  type: 'multi-step';
  steps: IntentStep[];
  constraints: {
    maxTotalSlippage: number;
    deadline: number;
    atomic: boolean; // All steps must succeed or none
  };
}

export interface Solver {
  id: string;
  name: string;
  canHandle: (intentType: IntentType) => boolean;
  meetsConstraints: (constraints: any) => boolean;
  estimateCost: (intent: Intent) => Promise<number>;
  execute: (intent: Intent) => Promise<IntentExecution>;
}

export interface IntentExecution {
  intentId: string;
  solverId: string;
  executionPath: ExecutionStep[];
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  gasUsed?: bigint;
  totalCost?: bigint;
}
```

### Main Export

#### `IntentRouterCore`

**Methods**:
- **`processIntent(intent: Intent): Promise<IntentExecution>`**
- **`getExecution(intentId: string): IntentExecution | undefined`**
- **`getSolvers(): Solver[]`**
- **`status(): IntentRouterStatus`**

---

**Status**: ✅ Implemented

