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
  isConnected: boolean;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
}

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
  isConnected: boolean;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
}

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
  isConnected: boolean;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
}

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
  isConnected: boolean;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
}

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
  isConnected: boolean;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
}

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
  isConnected: boolean;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
}

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
  isConnected: boolean;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
}

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
  isConnected: boolean;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
}

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
  isConnected: boolean;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
}

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
  isConnected: boolean;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
}

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
  isConnected: boolean;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
}

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
  isConnected: boolean;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
}

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
  category: 'defi' | 'nft' | 'social' | 'gaming' | 'utility' | 'other' | 'analysis' | 'monitoring' | 'management';
  requiresWallet: boolean;
  requiresToken?: string; // Token contract address if required
  version: string;
  agentId?: string; // Linked agent ID
}
