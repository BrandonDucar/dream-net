/**
 * Transfer DREAM Tokens to Agent Wallets
 * 
 * Since the DREAM token contract doesn't have a mint function,
 * we transfer tokens from your wallet to agent wallets.
 * 
 * Requires:
 * - DREAM tokens in your wallet
 * - Agent wallet addresses from AgentWalletManager
 */

import { ethers } from 'ethers';
import { getAgentWalletManager } from '@dreamnet/agent-wallet-manager';

// DREAM Token Contract Address (Base Mainnet)
const DREAM_TOKEN_ADDRESS = process.env.DREAM_TOKEN_ADDRESS || '0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77';

// ERC20 ABI (transfer function)
const ERC20_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

/**
 * Transfer DREAM tokens to an agent wallet
 */
export async function transferDreamToAgent(
  agentId: string,
  amount: string, // Amount in DREAM (e.g., "1000" = 1000 DREAM)
  chain: string = 'base'
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    // Get agent wallet
    const walletManager = getAgentWalletManager();
    const agentWallet = await walletManager.getOrCreateWallet(agentId, chain);
    
    // Get RPC URL
    const rpcUrl = process.env.BASE_MAINNET_RPC_URL || 'https://mainnet.base.org';
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    
    // Get sender wallet (from env - this should be your wallet with DREAM tokens)
    const senderPrivateKey = process.env.PRIVATE_KEY;
    if (!senderPrivateKey) {
      throw new Error('PRIVATE_KEY environment variable not set. This should be your wallet private key with DREAM tokens.');
    }
    
    const senderWallet = new ethers.Wallet(senderPrivateKey, provider);
    
    // Check sender balance
    const dreamToken = new ethers.Contract(DREAM_TOKEN_ADDRESS, ERC20_ABI, provider);
    const senderBalance = await dreamToken.balanceOf(senderWallet.address);
    const amountWei = ethers.utils.parseUnits(amount, 18);
    
    if (senderBalance.lt(amountWei)) {
      const balanceFormatted = ethers.utils.formatUnits(senderBalance, 18);
      throw new Error(`Insufficient DREAM balance. You have ${balanceFormatted} DREAM, need ${amount}`);
    }
    
    // Connect contract to sender wallet
    const tokenWithSigner = dreamToken.connect(senderWallet);
    
    // Transfer tokens
    console.log(`💸 Transferring ${amount} DREAM to agent ${agentId} at ${agentWallet.address}...`);
    console.log(`   From: ${senderWallet.address}`);
    
    const tx = await tokenWithSigner.transfer(agentWallet.address, amountWei);
    
    console.log(`⏳ Transaction sent: ${tx.hash}`);
    const receipt = await tx.wait();
    
    console.log(`✅ Transfer successful! Block: ${receipt.blockNumber}`);
    
    // Verify balance
    const agentBalance = await dreamToken.balanceOf(agentWallet.address);
    const balanceFormatted = ethers.utils.formatUnits(agentBalance, 18);
    console.log(`💰 Agent ${agentId} now has ${balanceFormatted} DREAM`);
    
    return {
      success: true,
      txHash: tx.hash,
    };
  } catch (error: any) {
    console.error(`❌ Failed to transfer DREAM to agent ${agentId}:`, error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Transfer DREAM tokens to multiple agents
 */
export async function transferDreamToAgents(
  agents: Array<{ agentId: string; amount: string }>,
  chain: string = 'base'
): Promise<Array<{ agentId: string; success: boolean; txHash?: string; error?: string }>> {
  const results = [];
  
  for (const agent of agents) {
    const result = await transferDreamToAgent(agent.agentId, agent.amount, chain);
    results.push({
      agentId: agent.agentId,
      ...result,
    });
    
    // Small delay between transfers to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
}

/**
 * Get agent's DREAM balance
 */
export async function getAgentDreamBalance(
  agentId: string,
  chain: string = 'base'
): Promise<string> {
  try {
    const walletManager = getAgentWalletManager();
    const agentWallet = await walletManager.getOrCreateWallet(agentId, chain);
    
    const rpcUrl = process.env.BASE_MAINNET_RPC_URL || 'https://mainnet.base.org';
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    
    const dreamToken = new ethers.Contract(DREAM_TOKEN_ADDRESS, ERC20_ABI, provider);
    
    const balance = await dreamToken.balanceOf(agentWallet.address);
    return ethers.utils.formatUnits(balance, 18);
  } catch (error: any) {
    console.error(`Failed to get balance for agent ${agentId}:`, error.message);
    return '0';
  }
}

/**
 * Check your wallet's DREAM balance
 */
export async function getYourDreamBalance(): Promise<string> {
  try {
    const senderPrivateKey = process.env.PRIVATE_KEY;
    if (!senderPrivateKey) {
      throw new Error('PRIVATE_KEY not set');
    }
    
    const rpcUrl = process.env.BASE_MAINNET_RPC_URL || 'https://mainnet.base.org';
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const senderWallet = new ethers.Wallet(senderPrivateKey, provider);
    
    const dreamToken = new ethers.Contract(DREAM_TOKEN_ADDRESS, ERC20_ABI, provider);
    const balance = await dreamToken.balanceOf(senderWallet.address);
    
    return ethers.utils.formatUnits(balance, 18);
  } catch (error: any) {
    console.error(`Failed to get your balance:`, error.message);
    return '0';
  }
}


