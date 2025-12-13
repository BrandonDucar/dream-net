/**
 * Solver Matching
 * 
 * Finds and matches solvers for intents
 */

import type { Intent, Solver, IntentType } from './types';

const registeredSolvers: Solver[] = [];

/**
 * Register a solver
 */
export function registerSolver(solver: Solver): void {
  registeredSolvers.push(solver);
}

/**
 * Find matching solvers for an intent
 */
export function findMatchingSolvers(intent: Intent): Solver[] {
  const solvers: Solver[] = [];
  
  // Find solvers that can handle this intent type
  for (const solver of registeredSolvers) {
    if (solver.canHandle(intent.type)) {
      // Check if solver meets constraints
      if (solver.meetsConstraints(intent.constraints)) {
        solvers.push(solver);
      }
    }
  }
  
  // Sort by estimated cost (gas + fees)
  return solvers.sort(async (a, b) => {
    const costA = await a.estimateCost(intent);
    const costB = await b.estimateCost(intent);
    return costA - costB;
  });
}

/**
 * Get solver by ID
 */
export function getSolver(solverId: string): Solver | undefined {
  return registeredSolvers.find(s => s.id === solverId);
}

/**
 * Get all registered solvers
 */
export function getAllSolvers(): Solver[] {
  return [...registeredSolvers];
}

