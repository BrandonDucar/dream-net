"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFI_LAB_NODE = void 0;
exports.DEFI_LAB_NODE = {
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
