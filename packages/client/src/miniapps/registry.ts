/**
 * Mini App Registry
 * Central registry for all Base mini apps
 */

import React from 'react';
import { MiniAppConfig } from './types.js';
import TokenBalanceApp from './template/TokenBalanceApp.js';
import SimpleSwapApp from './template/SimpleSwapApp.js';
import SubscriptionApp from './subscriptions/SubscriptionApp.js';
import ShadowProbeApp from './shadow/ShadowProbeApp.js';

// Import your mini apps here
export const MINI_APPS: MiniAppConfig[] = [
  {
    id: 'token-balance',
    name: 'Token Balance',
    description: 'View your token balances on Base L2',
    route: '/miniapps/token-balance',
    category: 'utility',
    requiresWallet: true,
    version: '1.0.0',
  },
  {
    id: 'simple-swap',
    name: 'Simple Swap',
    description: 'Transfer tokens on Base L2',
    route: '/miniapps/simple-swap',
    category: 'defi',
    requiresWallet: true,
    version: '1.0.0',
  },
  {
    id: 'subscription-hub',
    name: 'Subscription Hub',
    description: 'Launch on-chain subscription tiers with NFT badges',
    route: '/miniapps/subscription-hub',
    category: 'social',
    requiresWallet: true,
    version: '0.1.0',
  },
  {
    id: 'shadow-probe',
    name: 'Shadow Probe',
    description: 'Diagnostic diagnostic probe for the spaces between commits',
    route: '/miniapps/shadow-probe',
    category: 'utility',
    requiresWallet: true,
    version: '1.0.0',
  },
];

// Component mapping
export const MINI_APP_COMPONENTS: Record<string, React.ComponentType<any>> = {
  'token-balance': TokenBalanceApp,
  'simple-swap': SimpleSwapApp,
  'subscription-hub': SubscriptionApp,
  'shadow-probe': ShadowProbeApp,
  // Add more components here
};

/**
 * Get mini app by ID
 */
export function getMiniApp(id: string): MiniAppConfig | undefined {
  return MINI_APPS.find((app) => app.id === id);
}

/**
 * Get mini app component
 */
export function getMiniAppComponent(id: string): React.ComponentType<any> | undefined {
  return MINI_APP_COMPONENTS[id];
}

/**
 * Get mini apps by category
 */
export function getMiniAppsByCategory(category: MiniAppConfig['category']): MiniAppConfig[] {
  return MINI_APPS.filter((app) => app.category === category);
}

