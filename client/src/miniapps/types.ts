/**
 * Mini App Types
 * Types and interfaces for Base mini apps
 */

import { ethers } from 'ethers';

export interface MiniAppConfig {
  id: string;
  name: string;
  description: string;
  icon?: string;
  route: string;
  category: 'defi' | 'nft' | 'social' | 'gaming' | 'utility' | 'other';
  requiresWallet: boolean;
  requiresToken?: string; // Token contract address if required
  version: string;
}

export interface MiniAppContext {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
}

export interface MiniAppProps {
  config: MiniAppConfig;
  context: MiniAppContext;
}

export interface TokenBalance {
  address: string;
  symbol: string;
  decimals: number;
  balance: string;
  formatted: string;
}

