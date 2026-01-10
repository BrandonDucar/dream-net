/**
 * Agent Wallet Manager
 * Creates and manages wallets for AI agents that need them
 *
 * SECURITY BOUNDARY:
 * - HARD SEPARATION from user wallets (CoinSensei)
 * - User wallets = public addresses only (read-only)
 * - Agent wallets = system wallets for infra/testing
 *
 * WARNING: This is for testnet/sandbox use unless explicitly marked 'production-safe'
 * - Mnemonic comes ONLY from environment variables
 * - NEVER logged, NEVER returned in API responses
 * - NO endpoints that export private keys or mnemonics
 * - Private keys stored in memory only (encrypt at rest in production)
 */
import { Wallet, HDNodeWallet } from 'ethers';
export * from './src/OctopusController.js';
export class AgentWalletManager {
    wallets = new Map();
    mnemonic; // Master mnemonic - NEVER logged, NEVER exposed
    constructor(mnemonic) {
        // SECURITY: Mnemonic should come from env, never from user input
        if (mnemonic && process.env.NODE_ENV === 'production') {
            console.warn('[SECURITY] AgentWalletManager: Mnemonic provided in production - ensure from env only');
        }
        this.mnemonic = mnemonic;
    }
    /**
     * Create or retrieve a wallet for an agent
     * Returns PUBLIC interface only (no private keys)
     */
    async getOrCreateWallet(agentId, chain = 'ethereum', label) {
        const key = `${agentId}-${chain}`;
        let wallet;
        if (this.wallets.has(key)) {
            wallet = this.wallets.get(key);
        }
        else {
            wallet = await this.createWallet(agentId, chain, label);
            this.wallets.set(key, wallet);
        }
        // Return public interface only (no private key)
        return this.toPublic(wallet);
    }
    /**
     * Create a new wallet for an agent
     * INTERNAL USE ONLY - returns internal structure with private key
     */
    async createWallet(agentId, chain, label) {
        let wallet;
        if (this.mnemonic) {
            // Deterministic wallet generation from mnemonic
            // Must specify "m" path to get the master node, otherwise it defaults to first account
            const hdNode = HDNodeWallet.fromPhrase(this.mnemonic, undefined, "m");
            // Use agentId hash as derivation path
            const path = `m/44'/60'/0'/0/${this.hashAgentId(agentId)}`;
            wallet = hdNode.derivePath(path);
        }
        else {
            // Random wallet generation
            wallet = Wallet.createRandom();
        }
        const internalWallet = {
            agentId,
            address: wallet.address,
            privateKey: wallet.privateKey, // NEVER expose this
            chain,
            createdAt: new Date(),
            label: label || `${agentId} ${chain} wallet`,
        };
        // SECURITY: Never log private keys
        if (process.env.NODE_ENV === 'development') {
            console.log(`[AgentWallet] Created wallet for ${agentId} on ${chain}: ${wallet.address}`);
        }
        return internalWallet;
    }
    /**
     * Convert internal wallet to public interface (removes private key)
     */
    toPublic(wallet) {
        return {
            agentId: wallet.agentId,
            address: wallet.address,
            chain: wallet.chain,
            createdAt: wallet.createdAt,
            balance: wallet.balance,
            label: wallet.label,
        };
    }
    /**
     * Get wallet balance
     * Returns balance for agent wallet (uses internal structure)
     */
    async getBalance(agentId, chain, provider) {
        const key = `${agentId}-${chain}`;
        const wallet = this.wallets.get(key);
        if (!wallet) {
            // Create wallet if doesn't exist
            await this.getOrCreateWallet(agentId, chain);
            const newWallet = this.wallets.get(key);
            if (!newWallet) {
                throw new Error(`Failed to create wallet for ${agentId} on ${chain}`);
            }
            const balance = await provider.getBalance(newWallet.address);
            return balance.toString();
        }
        const balance = await provider.getBalance(wallet.address);
        return balance.toString();
    }
    /**
     * List all wallets for an agent
     * Returns PUBLIC interface only (no private keys)
     */
    getAgentWallets(agentId) {
        return Array.from(this.wallets.values())
            .filter(w => w.agentId === agentId)
            .map(w => this.toPublic(w));
    }
    /**
     * List all wallets
     * Returns PUBLIC interface only (no private keys)
     */
    getAllWallets() {
        return Array.from(this.wallets.values()).map(w => this.toPublic(w));
    }
    /**
     * Hash agent ID to number for derivation path
     */
    hashAgentId(agentId) {
        let hash = 0;
        for (let i = 0; i < agentId.length; i++) {
            const char = agentId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash) % 2147483647; // Max safe integer for derivation
    }
    /**
     * Export wallet PUBLIC data only (for backup)
     * NEVER exports private keys or mnemonics
     */
    exportWallet(agentId, chain) {
        const key = `${agentId}-${chain}`;
        const wallet = this.wallets.get(key);
        return wallet ? this.toPublic(wallet) : null;
    }
    /**
     * Import wallet (internal use only)
     * SECURITY: Only used for internal operations, never from user input
     */
    importWallet(wallet) {
        // SECURITY: Validate that private key is not logged
        if (process.env.NODE_ENV === 'development') {
            console.log(`[AgentWallet] Importing wallet for ${wallet.agentId} on ${wallet.chain}`);
        }
        const key = `${wallet.agentId}-${wallet.chain}`;
        this.wallets.set(key, wallet);
    }
    /**
     * Get private key (INTERNAL USE ONLY - for signing transactions)
     * SECURITY: Never expose via API, only for internal agent operations
     */
    getPrivateKey(agentId, chain) {
        const key = `${agentId}-${chain}`;
        const wallet = this.wallets.get(key);
        return wallet?.privateKey || null;
    }
}
// Singleton instance
let walletManagerInstance = null;
export function getAgentWalletManager(mnemonic) {
    if (!walletManagerInstance) {
        walletManagerInstance = new AgentWalletManager(mnemonic);
    }
    return walletManagerInstance;
}
//# sourceMappingURL=index.js.map