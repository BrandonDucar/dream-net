/**
 * Cross-Chain Intent Routing
 * 
 * Optimizes execution paths across chains using Star Bridge Lungs
 */

import { StarBridgeLungs } from '@dreamnet/star-bridge-lungs';
import type { Intent, Solver, ExecutionStep } from './types';

/**
 * Optimize execution path for an intent
 */
export async function optimizeExecution(
  intent: Intent,
  solvers: Solver[]
): Promise<ExecutionStep[]> {
  const executionPath: ExecutionStep[] = [];
  
  // Get chain metrics from Star Bridge Lungs
  const starBridgeStatus = StarBridgeLungs.status();
  const chainMetrics = starBridgeStatus.chainMetrics ?? [];
  
  // Handle different intent types
  switch (intent.type) {
    case 'swap':
      return optimizeSwapExecution(intent, solvers, chainMetrics);
      
    case 'bridge':
      return optimizeBridgeExecution(intent, solvers, chainMetrics);
      
    case 'multi-step':
      return optimizeMultiStepExecution(intent, solvers, chainMetrics);
      
    default:
      return [];
  }
}

/**
 * Optimize swap execution
 */
async function optimizeSwapExecution(
  intent: any,
  solvers: Solver[],
  chainMetrics: any[]
): Promise<ExecutionStep[]> {
  // Find best chain based on gas prices
  const preferredChains = intent.constraints.preferredChains ?? ['base'];
  
  let bestChain = preferredChains[0];
  let bestGasPrice = Infinity;
  
  for (const chain of preferredChains) {
    const metric = chainMetrics.find(m => m.chain === chain);
    if (metric && metric.gasPrice < bestGasPrice) {
      bestGasPrice = metric.gasPrice;
      bestChain = chain;
    }
  }
  
  return [{
    type: 'swap',
    chain: bestChain,
    status: 'pending',
  }];
}

/**
 * Optimize bridge execution
 */
async function optimizeBridgeExecution(
  intent: any,
  solvers: Solver[],
  chainMetrics: any[]
): Promise<ExecutionStep[]> {
  const steps: ExecutionStep[] = [];
  
  // Step 1: Bridge from source chain
  steps.push({
    type: 'bridge',
    chain: intent.fromChain,
    status: 'pending',
  });
  
  // Step 2: Receive on destination chain
  steps.push({
    type: 'receive',
    chain: intent.toChain,
    status: 'pending',
  });
  
  return steps;
}

/**
 * Optimize multi-step execution
 */
async function optimizeMultiStepExecution(
  intent: any,
  solvers: Solver[],
  chainMetrics: any[]
): Promise<ExecutionStep[]> {
  const steps: ExecutionStep[] = [];
  
  for (const step of intent.steps) {
    switch (step.type) {
      case 'swap':
        const swapSteps = await optimizeSwapExecution(
          { type: 'swap', constraints: intent.constraints, ...step.params },
          solvers,
          chainMetrics
        );
        steps.push(...swapSteps);
        break;
        
      case 'bridge':
        const bridgeSteps = await optimizeBridgeExecution(
          { type: 'bridge', constraints: intent.constraints, ...step.params },
          solvers,
          chainMetrics
        );
        steps.push(...bridgeSteps);
        break;
        
      default:
        steps.push({
          type: step.type,
          chain: 'base', // Default chain
          status: 'pending',
        });
    }
  }
  
  return steps;
}

