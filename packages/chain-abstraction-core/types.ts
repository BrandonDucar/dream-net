/**
 * Chain Abstraction Core Types
 * Superchain/CCT compatibility for cross-chain operations
 */

import type { ChainId } from '@dreamnet/star-bridge-lungs/types';

export interface CCTToken {
  symbol: string;
  chains: ChainId[];
  totalSupply: Record<ChainId, bigint>;
  bridgeable: boolean;
  nativeChain?: ChainId;
  decimals: number;
}

export interface CCTTransfer {
  token: string;
  amount: bigint;
  from: ChainId;
  to: ChainId;
  recipient: string;
  constraints: {
    maxSlippage?: number;
    deadline?: number;
    preferredBridge?: string;
  };
}

export interface ChainScore {
  chain: ChainId;
  score: number; // 0-100
  factors: {
    gasPrice: number;
    latency: number;
    reliability: number;
  };
}

export interface CCIPMessage {
  messageId: string;
  sourceChain: ChainId;
  destinationChain: ChainId;
  token: string;
  amount: bigint;
  recipient: string;
  status: 'pending' | 'delivered' | 'failed';
  timestamp: number;
}

export interface ChainAbstractionStatus {
  supportedChains: ChainId[];
  cctTokens: string[];
  totalTransfers: number;
  activeTransfers: number;
  averageTransferTime: number; // ms
}

