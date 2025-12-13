/**
 * Mint DREAM Tokens to Agent Wallets
 * 
 * This script mints DREAM tokens from the deployed contract to agent wallets.
 * Requires:
 * - DREAM token contract deployed at 0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77
 * - Owner wallet with minting permissions
 * - Agent wallet addresses from AgentWalletManager
 */

import { ethers } from 'ethers';
import { getAgentWalletManager } from '@dreamnet/agent-wallet-manager';

// DREAM Token Contract Address (Base Mainnet)
const DREAM_TOKEN_ADDRESS = process.env.DREAM_TOKEN_ADDRESS || '0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77';

// ERC20 ABI (minimal - just mint function)
const ERC20_MINT_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

/**
 * Mint DREAM tokens to an agent wallet
 */
export async function mintDreamToAgent(
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
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    
    // Get owner wallet (from env - this should be the deployer)
    const ownerPrivateKey = process.env.PRIVATE_KEY;
    if (!ownerPrivateKey) {
      throw new Error('PRIVATE_KEY environment variable not set. This should be the owner wallet private key.');
    }
    
    const ownerWallet = new ethers.Wallet(ownerPrivateKey, provider);
    
    // Connect to DREAM token contract
    const dreamToken = new ethers.Contract(
      DREAM_TOKEN_ADDRESS,
      ERC20_MINT_ABI,
      ownerWallet
    );
    
    // Check if caller is owner
    const contractOwner = await dreamToken.owner();
    if (contractOwner.toLowerCase() !== ownerWallet.address.toLowerCase()) {
      throw new Error(`Wallet ${ownerWallet.address} is not the contract owner. Owner is ${contractOwner}`);
    }
    
    // Convert amount to wei (assuming 18 decimals)
    const amountWei = ethers.parseUnits(amount, 18);
    
    // Mint tokens
    console.log(`🪙 Minting ${amount} DREAM to agent ${agentId} at ${agentWallet.address}...`);
    const tx = await dreamToken.mint(agentWallet.address, amountWei);
    
    console.log(`⏳ Transaction sent: ${tx.hash}`);
    const receipt = await tx.wait();
    
    console.log(`✅ Mint successful! Block: ${receipt.blockNumber}`);
    
    // Verify balance
    const balance = await dreamToken.balanceOf(agentWallet.address);
    const balanceFormatted = ethers.formatUnits(balance, 18);
    console.log(`💰 Agent ${agentId} now has ${balanceFormatted} DREAM`);
    
    return {
      success: true,
      txHash: tx.hash,
    };
  } catch (error: any) {
    console.error(`❌ Failed to mint DREAM to agent ${agentId}:`, error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Mint DREAM tokens to multiple agents
 */
export async function mintDreamToAgents(
  agents: Array<{ agentId: string; amount: string }>,
  chain: string = 'base'
): Promise<Array<{ agentId: string; success: boolean; txHash?: string; error?: string }>> {
  const results = [];
  
  for (const agent of agents) {
    const result = await mintDreamToAgent(agent.agentId, agent.amount, chain);
    results.push({
      agentId: agent.agentId,
      ...result,
    });
    
    // Small delay between mints to avoid rate limiting
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
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    
    const dreamToken = new ethers.Contract(
      DREAM_TOKEN_ADDRESS,
      ERC20_MINT_ABI,
      provider
    );
    
    const balance = await dreamToken.balanceOf(agentWallet.address);
    return ethers.formatUnits(balance, 18);
  } catch (error: any) {
    console.error(`Failed to get balance for agent ${agentId}:`, error.message);
    return '0';
  }
}


