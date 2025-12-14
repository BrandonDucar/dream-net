/**
 * Intent Processor
 * 
 * Processes user intents and routes them to solvers
 */

import type { Intent, Solver, IntentExecution } from './types';
import { findMatchingSolvers } from './solver';
import { optimizeExecution } from './routing';
import { executeWithMEVProtection } from './mevProtection';

let intentCounter = 0;

function generateIntentId(): string {
  intentCounter++;
  return `intent-${Date.now()}-${intentCounter}`;
}

/**
 * Process an intent
 */
export async function processIntent(intent: Intent): Promise<IntentExecution> {
  const intentId = generateIntentId();
  
  // Validate intent
  if (!validateIntent(intent)) {
    return {
      intentId,
      solverId: '',
      executionPath: [],
      status: 'failed',
      error: 'Invalid intent',
    };
  }
  
  // Find matching solvers
  const solvers = findMatchingSolvers(intent);
  
  if (solvers.length === 0) {
    return {
      intentId,
      solverId: '',
      executionPath: [],
      status: 'failed',
      error: 'No matching solvers found',
    };
  }
  
  // Optimize execution path
  const executionPath = await optimizeExecution(intent, solvers);
  
  // Select best solver
  const bestSolver = solvers[0]; // Already sorted by cost
  
  // Execute with MEV protection
  return executeWithMEVProtection(intentId, intent, bestSolver, executionPath);
}

/**
 * Validate intent
 */
function validateIntent(intent: Intent): boolean {
  // Check deadline
  if (intent.constraints.deadline && Date.now() > intent.constraints.deadline) {
    return false;
  }
  
  // Validate intent-specific constraints
  switch (intent.type) {
    case 'swap':
      return validateSwapIntent(intent);
    case 'bridge':
      return validateBridgeIntent(intent);
    case 'multi-step':
      return validateMultiStepIntent(intent);
    default:
      return false;
  }
}

function validateSwapIntent(intent: any): boolean {
  return (
    intent.fromToken &&
    intent.toToken &&
    intent.amount > 0n &&
    intent.constraints.maxSlippage >= 0 &&
    intent.constraints.maxSlippage <= 1
  );
}

function validateBridgeIntent(intent: any): boolean {
  return (
    intent.token &&
    intent.amount > 0n &&
    intent.fromChain &&
    intent.toChain &&
    intent.fromChain !== intent.toChain
  );
}

function validateMultiStepIntent(intent: any): boolean {
  return (
    intent.steps &&
    intent.steps.length > 0 &&
    intent.constraints.maxTotalSlippage >= 0 &&
    intent.constraints.maxTotalSlippage <= 1
  );
}

