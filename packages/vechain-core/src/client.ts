/**
 * VeChain Client Setup
 * Initialize VeChain Thor client for mainnet/testnet
 */

import type { VeChainNetwork, VeChainConfig } from './types.js';

const VECHAIN_RPC_URLS = {
  mainnet: 'https://mainnet.vechain.org',
  testnet: 'https://testnet.vechain.org',
} as const;

/**
 * VeChain RPC Client (simplified - will use fetch for now)
 * TODO: Add thor-devkit when package is installed
 */
export interface VeChainClient {
  getBestBlock(): Promise<any>;
  getAccount(address: string): Promise<any>;
  getBalance(address: string): Promise<string>;
}

/**
 * Create VeChain client (simplified implementation)
 */
export function createVeChainClient(
  network: VeChainNetwork = 'mainnet',
  customRpcUrl?: string
): VeChainClient {
  const rpcUrl = customRpcUrl || VECHAIN_RPC_URLS[network];
  
  return {
    async getBestBlock() {
      const response = await fetch(`${rpcUrl}/blocks/best`);
      return response.json();
    },
    async getAccount(address: string) {
      const response = await fetch(`${rpcUrl}/accounts/${address}`);
      return response.json();
    },
    async getBalance(address: string) {
      const account = await this.getAccount(address);
      return account.balance || '0';
    },
  };
}

/**
 * Get VeChain configuration from environment
 */
export function getVeChainConfig(): VeChainConfig {
  const network = (process.env.VECHAIN_NETWORK || 'mainnet') as VeChainNetwork;
  const rpcUrl =
    process.env.VECHAIN_MAINNET_RPC_URL ||
    process.env.VECHAIN_TESTNET_RPC_URL ||
    VECHAIN_RPC_URLS[network];
  // Primary VeChain wallet (accessible)
  const walletAddress = process.env.VECHAIN_WALLET_ADDRESS || '0x73d4c431ed1fc2126cca2597d9ace1b14de8474e';

  return {
    network,
    rpcUrl,
    walletAddress,
  };
}

/**
 * Initialize VeChain client from environment
 */
export function initVeChainClient(): ThorClient {
  const config = getVeChainConfig();
  return createVeChainClient(config.network, config.rpcUrl);
}

