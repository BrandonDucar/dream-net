/**
 * Intent Router Core Types
 * CoW Swap/OneFlow-style intent processing with MEV-aware execution
 */

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

export interface IntentStep {
  type: 'swap' | 'bridge' | 'deposit' | 'withdraw' | 'yield';
  params: Record<string, any>;
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

export type Intent = SwapIntent | BridgeIntent | MultiStepIntent;

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

export interface ExecutionStep {
  type: string;
  chain: string;
  transactionHash?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface MEVOpportunity {
  type: 'front-running' | 'sandwich' | 'back-running';
  risk: 'low' | 'medium' | 'high';
  protection: 'use-private-mempool' | 'use-flashbots' | 'increase-slippage';
}

export interface IntentRouterStatus {
  totalIntents: number;
  activeIntents: number;
  completedIntents: number;
  failedIntents: number;
  registeredSolvers: number;
}

