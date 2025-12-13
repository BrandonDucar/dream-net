/**
 * Prediction Kernel - Pure Domain Functions
 * 
 * Pure TypeScript functions with no external dependencies.
 * These functions operate on domain types and compute business logic.
 */

import type {
  PredictionMarketState,
  PredictionDecision,
  PredictionPerformanceSnapshot,
} from './types';

/**
 * Compute implied odds from staking pools
 * Uses constant product AMM formula: odds = pool / totalPool
 */
export function computeImpliedOdds(
  state: PredictionMarketState
): { yes: number; no: number } {
  if (state.totalStaked === 0n) {
    return { yes: 0.5, no: 0.5 }; // Default to 50/50 if no stakes
  }
  
  const yesOdds = Number(state.yesPool) / Number(state.totalStaked);
  const noOdds = Number(state.noPool) / Number(state.totalStaked);
  
  return {
    yes: Math.max(0, Math.min(1, yesOdds)),
    no: Math.max(0, Math.min(1, noOdds)),
  };
}

/**
 * Compute payouts after market resolution
 * Winners get their stake back + proportional share of losing pool
 */
export function computePayoutsAfterResolution(
  state: PredictionMarketState,
  decisions: PredictionDecision[]
): Map<string, bigint> {
  const payouts = new Map<string, bigint>();
  
  if (!state.resolved || !state.actualOutcome) {
    return payouts; // No payouts if not resolved
  }
  
  const winningDecisions = decisions.filter(
    d => d.marketId === state.marketId && d.outcome === state.actualOutcome
  );
  
  if (winningDecisions.length === 0) {
    return payouts; // No winners
  }
  
  const winningPool = state.actualOutcome === 'yes' ? state.yesPool : state.noPool;
  const losingPool = state.actualOutcome === 'yes' ? state.noPool : state.yesPool;
  
  // Total stake from winners
  const totalWinningStake = winningDecisions.reduce(
    (sum, d) => sum + d.stakeAmount,
    0n
  );
  
  if (totalWinningStake === 0n) {
    return payouts; // No stakes to distribute
  }
  
  // Calculate payouts
  for (const decision of winningDecisions) {
    // User gets stake back + proportional share of losing pool
    const share = (decision.stakeAmount * losingPool) / totalWinningStake;
    const payout = decision.stakeAmount + share;
    payouts.set(decision.decisionId, payout);
  }
  
  return payouts;
}

/**
 * Compute performance score for an agent
 * Combines accuracy, confidence calibration, and financial performance
 */
export function computePerformanceScore(
  snapshot: PredictionPerformanceSnapshot
): number {
  // Weighted combination:
  // - 40% accuracy
  // - 30% confidence calibration
  // - 30% financial performance (normalized)
  
  const accuracyScore = snapshot.accuracy;
  
  // Confidence calibration: how well confidence matches accuracy
  const confidenceDiff = Math.abs(snapshot.avgConfidence - snapshot.accuracy);
  const calibrationScore = 1 - confidenceDiff;
  
  // Financial performance (normalize to 0-1, assume max profit = 10x staked)
  const profitRatio = snapshot.totalStaked > 0n
    ? Number(snapshot.netProfit) / Number(snapshot.totalStaked)
    : 0;
  const financialScore = Math.max(0, Math.min(1, (profitRatio + 1) / 11)); // Normalize -1 to 10
  
  const score = (
    accuracyScore * 0.4 +
    calibrationScore * 0.3 +
    financialScore * 0.3
  );
  
  return Math.max(0, Math.min(1, score));
}

/**
 * Determine if a market should be created from signals
 * Simple heuristic: if multiple agents have similar signals, create market
 */
export function shouldCreateMarketFromSignals(
  signals: Array<{ agentId: string; signal: string; strength: number }>,
  threshold: number = 0.7
): boolean {
  if (signals.length < 2) return false;
  
  // Group signals by similarity (simplified)
  const signalGroups = new Map<string, number>();
  for (const s of signals) {
    const key = s.signal.toLowerCase().trim();
    signalGroups.set(key, (signalGroups.get(key) || 0) + s.strength);
  }
  
  // Check if any signal group exceeds threshold
  const maxStrength = Math.max(...Array.from(signalGroups.values()));
  return maxStrength >= threshold;
