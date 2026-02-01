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
  route?: string; // Added route as it is used in registry
  category: 'defi' | 'nft' | 'social' | 'gaming' | 'utility' | 'other' | 'analysis' | 'monitoring' | 'management';
  requiresWallet: boolean;
  version: string;
  isConnected?: boolean;
  chainId?: number | null;
  agentId?: string;
  connect?: () => Promise<void>;
  disconnect?: () => void;
  switchToBase?: () => Promise<void>;
}

export interface MiniAppContext {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
}

export interface MiniAppProps {
  config: MiniAppConfig;
  context: MiniAppContext;
}

export interface TokenBalance {
  symbol: string;
  balance: string;
  decimals: number;
}
