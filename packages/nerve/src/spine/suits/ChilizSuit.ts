
import { ethers } from 'ethers';

/**
 * @title ChilizSuit
 * @notice The "Arena" interface for DreamNet.
 * Hardened for Mainnet readiness and Spicy Testnet fallback.
 */
export class ChilizSuit {
    private provider: ethers.JsonRpcProvider;
    private wallet: ethers.Wallet | null = null;
    private rpcUrl: string;
    private isMainnet: boolean;

    constructor(preferMainnet: boolean = false) {
        this.isMainnet = preferMainnet;
        this.rpcUrl = preferMainnet
            ? (process.env.CHILIZ_RPC_URL || 'https://rpc.chiliz.com')
            : (process.env.CHILIZ_SPICY_RPC_URL || 'https://spicy-rpc.chiliz.com');

        this.provider = new ethers.JsonRpcProvider(this.rpcUrl);

        const key = process.env.METAMASK_PRIVATE_KEY || process.env.PHANTOM_PRIVATE_KEY;
        if (key) {
            this.wallet = new ethers.Wallet(key, this.provider);
            console.log(`[ChilizSuit] 🌶️ ${this.isMainnet ? 'MAINNET' : 'TESTNET'} Active. Wallet: ${this.wallet.address}`);
        } else {
            console.warn("[ChilizSuit] Operational in Read-Only Mode (No Private Key)");
        }
    }

    /**
     * Estimated Gas for a standard transfer or contract call.
     */
    public async estimatePower(): Promise<bigint> {
        try {
            const feeData = await this.provider.getFeeData();
            return feeData.gasPrice || 0n;
        } catch (error: any) {
            console.error(`[ChilizSuit] Power Estimation Failed: ${error.message}`);
            return 0n;
        }
    }

    /**
     * Resilient Transaction Pulse
     */
    public async pulseTransaction(to: string, amount: string): Promise<string> {
        if (!this.wallet) throw new Error("VAULT_LOCKED: No Private Key provided.");

        try {
            const tx = await this.wallet.sendTransaction({
                to,
                value: ethers.parseEther(amount),
                gasLimit: 21000n // Basic transfer
            });

            console.log(`[ChilizSuit] ⚡ Pulse Transmitted: ${tx.hash}`);
            return tx.hash;
        } catch (error: any) {
            console.error(`[ChilizSuit] Pulse Failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get the CHZ balance (Gas)
     */
    public async getGasBalance(): Promise<string> {
        if (!this.wallet) return "0.0";
        try {
            const balance = await this.provider.getBalance(this.wallet.address);
            return ethers.formatEther(balance);
        } catch (error: any) {
            console.error(`[ChilizSuit] Balance Fetch Failed: ${error.message}`);
            return "0.0";
        }
    }

    public async checkConnection(): Promise<boolean> {
        try {
            const network = await this.provider.getNetwork();
            console.log(`[ChilizSuit] Uplink Confirmed. Chain ID: ${network.chainId}`);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Switch connectivity between Mainnet and Testnet dynamically.
     */
    public switchArena(mainnet: boolean) {
        this.isMainnet = mainnet;
        this.rpcUrl = mainnet
            ? (process.env.CHILIZ_RPC_URL || 'https://rpc.chiliz.com')
            : (process.env.CHILIZ_SPICY_RPC_URL || 'https://spicy-rpc.chiliz.com');
        this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
        if (this.wallet) {
            this.wallet = new ethers.Wallet(this.wallet.privateKey, this.provider);
        }
        console.log(`[ChilizSuit] Switched to ${mainnet ? 'MAINNET' : 'TESTNET'}`);
    }
}
