/**
 * Agent Wallet Manager
 * Creates and manages wallets for AI agents that need them
 */

import { Wallet, HDNodeWallet, randomBytes } from 'ethers';
import type { JsonRpcProvider } from 'ethers';

export interface AgentWallet {
  agentId: string;
  address: string;
  privateKey: string; // Encrypted in production
  chain: string;
  createdAt: Date;
  balance?: string;
  label?: string;
}

export class AgentWalletManager {
  private wallets: Map<string, AgentWallet> = new Map();
  private mnemonic?: string; // Master mnemonic for deterministic wallet generation

  constructor(mnemonic?: string) {
    this.mnemonic = mnemonic;
  }

  /**
   * Create or retrieve a wallet for an agent
   */
  async getOrCreateWallet(
    agentId: string,
    chain: string = 'ethereum',
    label?: string
  ): Promise<AgentWallet> {
    const key = `${agentId}-${chain}`;
    
    if (this.wallets.has(key)) {
      return this.wallets.get(key)!;
    }

    const wallet = await this.createWallet(agentId, chain, label);
    this.wallets.set(key, wallet);
    
    return wallet;
  }

  /**
   * Create a new wallet for an agent
   */
  private async createWallet(
    agentId: string,
    chain: string,
    label?: string
  ): Promise<AgentWallet> {
    let wallet: HDNodeWallet | Wallet;

    if (this.mnemonic) {
      // Deterministic wallet generation from mnemonic
      const hdNode = HDNodeWallet.fromPhrase(this.mnemonic);
      // Use agentId hash as derivation path
      const path = `m/44'/60'/0'/0/${this.hashAgentId(agentId)}`;
      wallet = hdNode.derivePath(path);
    } else {
      // Random wallet generation
      wallet = Wallet.createRandom();
    }

    return {
      agentId,
      address: wallet.address,
      privateKey: wallet.privateKey,
      chain,
      createdAt: new Date(),
      label: label || `${agentId} ${chain} wallet`,
    };
  }

  /**
   * Get wallet balance
   */
  async getBalance(
    agentId: string,
    chain: string,
    provider: JsonRpcProvider
  ): Promise<string> {
    const wallet = await this.getOrCreateWallet(agentId, chain);
    const balance = await provider.getBalance(wallet.address);
    return balance.toString();
  }

  /**
   * List all wallets for an agent
   */
  getAgentWallets(agentId: string): AgentWallet[] {
    return Array.from(this.wallets.values()).filter(w => w.agentId === agentId);
  }

  /**
   * List all wallets
   */
  getAllWallets(): AgentWallet[] {
    return Array.from(this.wallets.values());
  }

  /**
   * Hash agent ID to number for derivation path
   */
  private hashAgentId(agentId: string): number {
    let hash = 0;
    for (let i = 0; i < agentId.length; i++) {
      const char = agentId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 2147483647; // Max safe integer for derivation
  }

  /**
   * Export wallet (for backup - encrypt in production)
   */
  exportWallet(agentId: string, chain: string): AgentWallet | null {
    const key = `${agentId}-${chain}`;
    return this.wallets.get(key) || null;
  }

  /**
   * Import wallet
   */
  importWallet(wallet: AgentWallet): void {
    const key = `${wallet.agentId}-${wallet.chain}`;
    this.wallets.set(key, wallet);
  }
}

// Singleton instance
let walletManagerInstance: AgentWalletManager | null = null;

export function getAgentWalletManager(mnemonic?: string): AgentWalletManager {
  if (!walletManagerInstance) {
    walletManagerInstance = new AgentWalletManager(mnemonic);
  }
  return walletManagerInstance;
}

