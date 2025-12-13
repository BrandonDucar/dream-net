# Agent DREAM Token Distribution Guide

## Overview

This guide explains how to fund agent wallets with DREAM tokens so they can participate in prediction markets and other onchain activities.

## Prerequisites

1. **DREAM Token Contract Deployed**
   - Address: `0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77` (Base Mainnet)
   - You must be the contract owner (deployer)

2. **Environment Variables**
   ```bash
   PRIVATE_KEY=your_owner_wallet_private_key  # Contract deployer private key
   BASE_MAINNET_RPC_URL=https://mainnet.base.org  # Optional, defaults to public
   DREAM_TOKEN_ADDRESS=0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77  # Optional, uses default
   ```

3. **Agent Wallets Created**
   - Agents must have wallets created via `AgentWalletManager`
   - Wallets are created automatically when agents are first used

## How It Works

**Important:** The DREAM token contract (`0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77`) does NOT have a `mint()` function. You need to **transfer** tokens from your wallet to agent wallets.

### Step 1: Agent Wallets Are Created Automatically

When an agent first needs a wallet (e.g., for prediction markets), `AgentWalletManager` creates one:

```typescript
import { getAgentWalletManager } from '@dreamnet/agent-wallet-manager';

const walletManager = getAgentWalletManager();
const wallet = await walletManager.getOrCreateWallet('Citadel', 'base');
// wallet.address = "0x..." (agent's wallet address)
```

### Step 2: Transfer DREAM Tokens to Agent Wallets

**You need DREAM tokens in your wallet first!** Then transfer them to agents:

```bash
# Check your DREAM balance
tsx scripts/mint-dream-to-agents.ts --balance

# Transfer to a single agent
tsx scripts/mint-dream-to-agents.ts Citadel 10000

# Transfer to all agents
tsx scripts/mint-dream-to-agents.ts --all 1000

# Check agent balance
tsx scripts/mint-dream-to-agents.ts --balance Citadel
```

### Step 3: Agents Use Tokens

Once funded, agents can:
- Stake DREAM in prediction markets
- Transfer DREAM between agents
- Use DREAM in DreamShop
- Participate in onchain activities

## Token Distribution Strategy

### Initial Distribution

**Recommended amounts per agent:**
- **Citadel agents** (strategic): 10,000 - 50,000 DREAM
- **Field agents** (operational): 5,000 - 20,000 DREAM
- **Specialized agents**: 1,000 - 10,000 DREAM

### Ongoing Distribution

Agents can earn more DREAM through:
- Successful predictions (winnings)
- Rewards from DreamShop
- Performance bonuses
- System rewards

## Programmatic Minting

You can also transfer programmatically:

```typescript
import { transferDreamToAgent } from '@dreamnet/dream-token/transferToAgents';

// Transfer 10,000 DREAM to Citadel agent
const result = await transferDreamToAgent('Citadel', '10000', 'base');

if (result.success) {
  console.log(`Transferred! TX: ${result.txHash}`);
} else {
  console.error(`Failed: ${result.error}`);
}
```

## Checking Balances

```typescript
import { getAgentDreamBalance } from '@dreamnet/dream-token/transferToAgents';

const balance = await getAgentDreamBalance('Citadel', 'base');
console.log(`Citadel has ${balance} DREAM`);
```

## Security Notes

1. **Private Key Security**
   - Never commit `PRIVATE_KEY` to git
   - Use environment variables only
   - Consider using a hardware wallet for production

2. **Minting Permissions**
   - Only the contract owner can mint
   - Verify you're the owner before minting
   - Consider implementing a minting cap or rate limit

3. **Agent Wallet Separation**
   - Agent wallets are separate from user wallets
   - Private keys are never exposed
   - Agents can't access user funds

## Troubleshooting

### "Insufficient DREAM balance"
- **You need DREAM tokens in your wallet first!**
- Check your balance: `tsx scripts/mint-dream-to-agents.ts --balance`
- Get DREAM tokens from:
  - Your initial distribution (if you have them)
  - Buy on a DEX (if pool exists)
  - Receive from other users

### "Agent wallet not found"
- Agent wallets are created on-demand
- Call `getOrCreateWallet()` first if needed

### "Insufficient gas"
- Ensure your wallet has ETH for gas fees
- Base gas fees are low (~$0.01 per transaction)

## Example: Fund All Agents for Prediction Markets

```bash
# 1. Set environment variables
export PRIVATE_KEY=your_wallet_private_key_here  # Wallet with DREAM tokens
export BASE_MAINNET_RPC_URL=https://mainnet.base.org

# 2. Check your balance (make sure you have DREAM tokens!)
tsx scripts/mint-dream-to-agents.ts --balance

# 3. Transfer to all agents
tsx scripts/mint-dream-to-agents.ts --all 5000

# 4. Verify balances
tsx scripts/mint-dream-to-agents.ts --balance Citadel
tsx scripts/mint-dream-to-agents.ts --balance DroneDome
```

## Next Steps

Once agents are funded:
1. Enable Prediction Kernel (`USE_PREDICTION_KERNEL=true`)
2. Agents will automatically stake DREAM in prediction markets
3. Monitor agent balances and performance
4. Adjust distribution based on agent activity

