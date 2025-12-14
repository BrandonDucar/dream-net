/**
 * Wallet Collaboration - Onchain agent collaboration using wallets
 */

import { getAgentWalletManager } from '@dreamnet/agent-wallet-manager';
import type {
  OnchainReasoningResult,
  TransactionPlan,
  TransactionOperation,
  AgentWalletInfo,
} from './types';
import { sendLatentThought, collaborativeReasoning } from './agentBridge';

/**
 * Collaborative onchain reasoning
 */
export async function collaborativeOnchainReasoning(
  agents: string[],
  task: string,
  onchainContext: {
    chain: string;
    tokenAddress?: string;
    amount?: string;
  },
  neuralMesh?: any
): Promise<OnchainReasoningResult> {
  // Get agent wallets
  const walletManager = getAgentWalletManager();
  const agentWallets: AgentWalletInfo[] = [];
  
  for (const agentId of agents) {
    try {
      const wallet = await walletManager.getOrCreateWallet(
        agentId,
        onchainContext.chain
      );
      
      agentWallets.push({
        agentId,
        address: wallet.address,
        chain: wallet.chain,
      });
    } catch (error) {
      console.warn(`[WalletCollaboration] Failed to get wallet for ${agentId}:`, error);
    }
  }
  
  // Generate latent thoughts with wallet context
  const latentThoughts = await Promise.all(
    agents.map(async (agentId, idx) => {
      const wallet = agentWallets[idx];
      if (!wallet) {
        return null;
      }
      
      const thought = `Agent ${agentId} (${wallet.address}) reasoning about onchain task: ${task}`;
      return await sendLatentThought(agentId, thought, agents, {
        task,
        onchainContext: {
          chain: wallet.chain,
          walletAddress: wallet.address,
          tokenAddress: onchainContext.tokenAddress,
          amount: onchainContext.amount,
        },
      });
    })
  );
  
  // Filter out nulls
  const validThoughts = latentThoughts.filter((t) => t !== null) as any[];
  
  // Collaborative reasoning
  const reasoningResult = await collaborativeReasoning(agents, task, neuralMesh);
  
  // Generate transaction plan if applicable
  let transactionPlan: TransactionPlan | undefined;
  if (onchainContext.tokenAddress || onchainContext.amount) {
    transactionPlan = await planMultiAgentTransaction(
      agents,
      task,
      {
        chain: onchainContext.chain,
        tokenAddress: onchainContext.tokenAddress,
        amount: onchainContext.amount,
      },
      agentWallets
    );
  }
  
  return {
    plan: reasoningResult.plan,
    transactionPlan,
    agents,
    wallets: agentWallets,
  };
}

/**
 * Multi-agent transaction planning
 */
export async function planMultiAgentTransaction(
  agents: string[],
  operation: string,
  params: Record<string, any>,
  agentWallets: AgentWalletInfo[]
): Promise<TransactionPlan> {
  const operations: TransactionOperation[] = [];
  
  // Create transaction operations for each agent
  for (let i = 0; i < agents.length; i++) {
    const agentId = agents[i];
    const wallet = agentWallets[i];
    
    if (!wallet) continue;
    
    operations.push({
      agentId,
      walletAddress: wallet.address,
      operation,
      params: {
        ...params,
        agentId,
      },
    });
  }
  
  return {
    operations,
    estimatedGas: '0', // Placeholder
    requiredApprovals: Math.ceil(agents.length / 2), // Simple majority
  };
}

