#!/usr/bin/env tsx
/**
 * Script to mint DREAM tokens to agent wallets
 * 
 * Usage:
 *   tsx scripts/mint-dream-to-agents.ts <agentId> <amount>
 *   tsx scripts/mint-dream-to-agents.ts --all 1000  # Mint 1000 to all agents
 * 
 * Environment variables required:
 *   PRIVATE_KEY - Owner wallet private key (contract deployer)
 *   BASE_MAINNET_RPC_URL - Base RPC URL (optional, defaults to public)
 *   DREAM_TOKEN_ADDRESS - Token contract address (optional, uses default)
 */

import { transferDreamToAgent, transferDreamToAgents, getAgentDreamBalance, getYourDreamBalance } from '../packages/dream-token/transferToAgents';
import { getAgentWalletManager } from '@dreamnet/agent-wallet-manager';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Usage:
  tsx scripts/mint-dream-to-agents.ts <agentId> <amount>
  tsx scripts/mint-dream-to-agents.ts --all <amount>
  tsx scripts/mint-dream-to-agents.ts --balance <agentId>
  
Examples:
  tsx scripts/mint-dream-to-agents.ts Citadel 10000
  tsx scripts/mint-dream-to-agents.ts --all 1000
  tsx scripts/mint-dream-to-agents.ts --balance Citadel
    `);
    process.exit(1);
  }
  
  if (args[0] === '--balance') {
    // Check balance
    const agentId = args[1];
    if (!agentId) {
      // Check your balance
      const yourBalance = await getYourDreamBalance();
      console.log(`💰 Your wallet has ${yourBalance} DREAM`);
      return;
    }
    
    const balance = await getAgentDreamBalance(agentId);
    console.log(`💰 Agent ${agentId} has ${balance} DREAM`);
    return;
  }
  
  if (args[0] === '--all') {
    // Mint to all agents
    const amount = args[1];
    if (!amount) {
      console.error('Error: Amount required');
      process.exit(1);
    }
    
    console.log(`💸 Transferring ${amount} DREAM to all agents...`);
    
    // Get all agent wallets
    const walletManager = getAgentWalletManager();
    const allWallets = walletManager.getAllWallets();
    
    const agents = allWallets.map(w => ({
      agentId: w.agentId,
      amount: amount,
    }));
    
    if (agents.length === 0) {
      console.log('⚠️  No agent wallets found. Create some agent wallets first.');
      return;
    }
    
    console.log(`📋 Found ${agents.length} agent wallets`);
    const results = await transferDreamToAgents(agents);
    
    console.log('\n📊 Results:');
    results.forEach(r => {
      if (r.success) {
        console.log(`  ✅ ${r.agentId}: ${r.txHash}`);
      } else {
        console.log(`  ❌ ${r.agentId}: ${r.error}`);
      }
    });
    
    return;
  }
  
  // Mint to single agent
  const agentId = args[0];
  const amount = args[1];
  
  if (!agentId || !amount) {
    console.error('Error: Agent ID and amount required');
    process.exit(1);
  }
  
  console.log(`💸 Transferring ${amount} DREAM to agent ${agentId}...`);
  const result = await transferDreamToAgent(agentId, amount);
  
  if (result.success) {
    console.log(`✅ Success! Transaction: ${result.txHash}`);
  } else {
    console.error(`❌ Failed: ${result.error}`);
    process.exit(1);
  }
}

main().catch(console.error);

