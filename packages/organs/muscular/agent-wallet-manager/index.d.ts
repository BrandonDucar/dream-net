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
import type { JsonRpcProvider } from 'ethers';
export * from './src/OctopusController.js';
/**
 * Agent Wallet (INTERNAL USE ONLY)
 * NEVER exposed to CoinSensei or user-facing APIs
 */
interface AgentWalletInternal {
    agentId: string;
    address: string;
    privateKey: string;
    chain: string;
    createdAt: Date;
    balance?: string;
    label?: string;
}
/**
 * Agent Wallet (PUBLIC - Safe to return)
 * No private keys or sensitive data
 */
export interface AgentWalletPublic {
    agentId: string;
    address: string;
    chain: string;
    createdAt: Date;
    balance?: string;
    label?: string;
}
export declare class AgentWalletManager {
    private wallets;
    private mnemonic?;
    constructor(mnemonic?: string);
    /**
     * Create or retrieve a wallet for an agent
     * Returns PUBLIC interface only (no private keys)
     */
    getOrCreateWallet(agentId: string, chain?: string, label?: string): Promise<AgentWalletPublic>;
    /**
     * Create a new wallet for an agent
     * INTERNAL USE ONLY - returns internal structure with private key
     */
    private createWallet;
    /**
     * Convert internal wallet to public interface (removes private key)
     */
    private toPublic;
    /**
     * Get wallet balance
     * Returns balance for agent wallet (uses internal structure)
     */
    getBalance(agentId: string, chain: string, provider: JsonRpcProvider): Promise<string>;
    /**
     * List all wallets for an agent
     * Returns PUBLIC interface only (no private keys)
     */
    getAgentWallets(agentId: string): AgentWalletPublic[];
    /**
     * List all wallets
     * Returns PUBLIC interface only (no private keys)
     */
    getAllWallets(): AgentWalletPublic[];
    /**
     * Hash agent ID to number for derivation path
     */
    private hashAgentId;
    /**
     * Export wallet PUBLIC data only (for backup)
     * NEVER exports private keys or mnemonics
     */
    exportWallet(agentId: string, chain: string): AgentWalletPublic | null;
    /**
     * Import wallet (internal use only)
     * SECURITY: Only used for internal operations, never from user input
     */
    importWallet(wallet: AgentWalletInternal): void;
    /**
     * Get private key (INTERNAL USE ONLY - for signing transactions)
     * SECURITY: Never expose via API, only for internal agent operations
     */
    getPrivateKey(agentId: string, chain: string): string | null;
}
export declare function getAgentWalletManager(mnemonic?: string): AgentWalletManager;
//# sourceMappingURL=index.d.ts.map