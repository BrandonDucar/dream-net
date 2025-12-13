/**
 * Type definitions for Latent Collaboration System
 */

export interface LatentVector {
  vector: number[];
  dimension: number;
  model?: string;
}

export interface LatentRepresentation {
  id: string;
  agentId: string;
  latentVector: LatentVector;
  originalThought: string;
  timestamp: Date;
  metadata?: LatentMetadata;
}

export interface LatentMetadata {
  task?: string;
  context?: Record<string, any>;
  relatedAgents?: string[];
  onchainContext?: {
    chain?: string;
    walletAddress?: string;
    tokenAddress?: string;
    amount?: string;
  };
}

export interface LatentThought {
  id: string;
  agentId: string;
  thought: string;
  latentVector: LatentVector;
  similarity?: number;
  timestamp: Date;
  metadata?: LatentMetadata;
}

export interface LatentMemory {
  id: string;
  agentId: string;
  latentRep: number[];
  originalThought: string;
  timestamp: Date;
  metadata?: LatentMetadata;
}

export interface ReasoningResult {
  plan: string;
  steps: ReasoningStep[];
  agents: string[];
  confidence: number;
}

export interface ReasoningStep {
  step: number;
  agentId: string;
  thought: string;
  latentVector: LatentVector;
}

export interface ReasoningChain {
  steps: ReasoningStep[];
  finalPlan: string;
  agents: string[];
}

export interface SharedContext {
  agents: string[];
  task: string;
  latentThoughts: LatentThought[];
  sharedPlan?: string;
}

export interface OnchainReasoningResult {
  plan: string;
  transactionPlan?: TransactionPlan;
  agents: string[];
  wallets: AgentWalletInfo[];
}

export interface TransactionPlan {
  operations: TransactionOperation[];
  estimatedGas?: string;
  requiredApprovals?: number;
}

export interface TransactionOperation {
  agentId: string;
  walletAddress: string;
  operation: string;
  params: Record<string, any>;
}

export interface AgentWalletInfo {
  agentId: string;
  address: string;
  chain: string;
  balance?: string;
}

