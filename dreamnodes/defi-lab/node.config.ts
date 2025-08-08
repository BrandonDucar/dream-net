import type { DreamNodeConfig } from '../types/DreamNode';

export const DEFI_LAB_NODE: DreamNodeConfig = {
  id: 'defi-lab',
  name: 'My DeFi Lab',
  token: 'DEFI',
  creator: '0xyourwallet',
  createdAt: Date.now(),
  isolation: true,
  trustBoundary: 70,
  usageCount: 0,
  inboxEnabled: true,
  mintEnabled: true,
  public: true,
  agentVisibility: ['LUCID', 'CANVAS', 'ROOT'],
  allowedAccess: ['defi-analytics', 'liquidity-pool', 'yield-farming', 'swap'],
  description: 'Advanced DeFi laboratory for liquidity management and yield optimization',
  version: '1.0.0'
};