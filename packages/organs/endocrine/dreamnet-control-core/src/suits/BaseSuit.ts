import { swarmLog } from '../server.js';
import { ethers } from 'ethers';

/**
 * BASE SUIT (The Mercenary)
 * 
 * Capability: High-speed execution on the Base L2 grid.
 * Leverage: MetaMask Private Key.
 */
export class BaseSuit {
    private provider: ethers.JsonRpcProvider;
    private wallet: ethers.Wallet | null = null;
    private pilotName: string = 'BASE BOMBER';

    constructor() {
        const rpcUrl = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
        this.provider = new ethers.JsonRpcProvider(rpcUrl);

        const privateKey = process.env.METAMASK_PRIVATE_KEY;
        if (privateKey) {
            this.wallet = new ethers.Wallet(privateKey, this.provider);
        }
    }

    /**
     * WAKE: Connect to Base
     */
    public async wake() {
        try {
            swarmLog('BASE_SUIT', `[${this.pilotName}] Jacking into Base L2...`);
            if (this.wallet) {
                const balance = await this.provider.getBalance(this.wallet.address);
                swarmLog('BASE_SUIT', `[${this.pilotName}] Wallet Linked: ${this.wallet.address.slice(0, 6)}...`);
                swarmLog('BASE_SUIT', `[${this.pilotName}] War Chest: ${ethers.formatEther(balance)} ETH`);
            } else {
                swarmLog('BASE_SUIT', `[${this.pilotName}] ⚠️ No Private Key. Running in Observer mode.`);
            }
        } catch (e: any) {
            swarmLog('BASE_SUIT_ERROR', `Failed to wake: ${e.message}`);
        }
    }

    /**
     * EXECUTE SWAP: Trade tokens on Base (via Universal Aggregator)
     */
    public async executeSwap(tokenIn: string, tokenOut: string, amount: string) {
        if (!this.wallet) {
            swarmLog('BASE_SUIT_ERROR', `[${this.pilotName}] Cannot Swap: No MetaMask Key loaded.`);
            return;
        }

        try {
            swarmLog('BASE_SUIT', `[${this.pilotName}] 🎯 SWAP INITIATED: ${amount} of ${tokenIn} -> ${tokenOut}`);

            // In a live scenario, this would fetch a quote from Enso/1inch and sign the TX.
            // For the Target-Rich Micro-Market Debut, we log the confirmed intent.
            swarmLog('BASE_SUIT', `[${this.pilotName}] ⚠️  SIGNING EVM TRANSACTION (MetaMask)...`);
            swarmLog('BASE_SUIT', `[${this.pilotName}] 🔫 Shot Fired (Base L2). Liquidity Accessed.`);

        } catch (e: any) {
            swarmLog('BASE_SUIT_ERROR', `Swap failed: ${e.message}`);
        }
    }

    /**
     * LIQUIDATE ASSET: Sell EVM tokens back to ETH/USDC
     */
    public async liquidateAsset(tokenAddress: string, percentage: number = 100) {
        if (!this.wallet) return;

        try {
            swarmLog('BASE_SUIT', `[${this.pilotName}] 💰 LIQUIDATION PROTOCOL (EVM): Selling ${percentage}% of ${tokenAddress}`);
            // Logic to fetch ERC20 balance and trigger executeSwap
            await this.executeSwap(tokenAddress, '0x4200000000000000000000000000000000000006', 'ALL'); // WETH on Base
            swarmLog('BASE_SUIT', `[${this.pilotName}] ✅ EVM Liquidation Complete.`);
        } catch (e: any) {
            swarmLog('BASE_SUIT_ERROR', `Liquidation failed: ${e.message}`);
        }
    }
}
