/**
 * Intent Router Core
 * 
 * CoW Swap/OneFlow-style intent processing with MEV-aware execution
 * 
 * Features:
 * - Intent parsing and validation
 * - Solver matching and optimization
 * - Cross-chain routing
 * - MEV protection
 */

export { processIntent } from './intentProcessor';
export { registerSolver, findMatchingSolvers, getSolver, getAllSolvers } from './solver';
export { optimizeExecution } from './routing';
export { executeWithMEVProtection, detectMEVOpportunity } from './mevProtection';
export type {
  Intent,
  IntentType,
  SwapIntent,
  BridgeIntent,
  MultiStepIntent,
  IntentStep,
  Solver,
  IntentExecution,
  ExecutionStep,
  MEVOpportunity,
  IntentRouterStatus,
} from './types';

import { processIntent } from './intentProcessor';
import { getAllSolvers } from './solver';

const intentHistory: import('./types').IntentExecution[] = [];

export const IntentRouterCore = {
  /**
   * Process an intent
   */
  async processIntent(intent: import('./types').Intent) {
    const execution = await processIntent(intent);
    intentHistory.push(execution);
    return execution;
  },

  /**
   * Get intent execution by ID
   */
  getExecution(intentId: string): import('./types').IntentExecution | undefined {
    return intentHistory.find(e => e.intentId === intentId);
  },

  /**
   * Get all registered solvers
   */
  getSolvers() {
    return getAllSolvers();
  },

  /**
   * Get status
   */
  status(): import('./types').IntentRouterStatus {
    const active = intentHistory.filter(e => e.status === 'executing' || e.status === 'pending');
    const completed = intentHistory.filter(e => e.status === 'completed');
    const failed = intentHistory.filter(e => e.status === 'failed');
    
    return {
      totalIntents: intentHistory.length,
      activeIntents: active.length,
      completedIntents: completed.length,
      failedIntents: failed.length,
      registeredSolvers: getAllSolvers().length,
    };
  },
};

export default IntentRouterCore;

