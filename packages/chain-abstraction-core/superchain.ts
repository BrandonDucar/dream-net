/**
 * Superchain Abstraction
 * 
 * Treats chains as fungible resources
 * Automatic chain selection based on gas/latency/reliability
 */

import { StarBridgeLungs } from '@dreamnet/star-bridge-lungs';
import type { ChainId, ChainBreathMetrics } from '@dreamnet/star-bridge-lungs/types';
import type { ChainScore } from './types';

/**
 * Select optimal chain for an operation
 */
export function selectOptimalChain(
  preferredChains?: ChainId[],
  intent?: any
): ChainId {
  const starBridgeStatus = StarBridgeLungs.status();
  const chainMetrics = starBridgeStatus.chainMetrics ?? [];
  
  // Filter to preferred chains if specified
  let candidates = chainMetrics;
  if (preferredChains && preferredChains.length > 0) {
    candidates = chainMetrics.filter(m => preferredChains.includes(m.chain));
  }
  
  if (candidates.length === 0) {
    // Fallback to all chains
    candidates = chainMetrics;
  }
  
  // Score chains
  const scoredChains: ChainScore[] = candidates.map(chain => ({
    chain: chain.chain,
    score: calculateChainScore(chain),
    factors: {
      gasPrice: chain.gasPressure,
      latency: chain.congestion,
      reliability: chain.reliability,
    },
  }));
  
  // Sort by score (highest first)
  scoredChains.sort((a, b) => b.score - a.score);
  
  // Return best chain
  return scoredChains[0]?.chain ?? 'base'; // Default to Base
}

/**
 * Calculate chain score (0-100)
 * Higher score = better chain
 */
function calculateChainScore(chain: ChainBreathMetrics): number {
  // Gas score (inverse - lower gas = higher score)
  const gasScore = (1 - chain.gasPressure) * 0.4;
  
  // Latency score (inverse - lower latency = higher score)
  const latencyScore = (1 - chain.congestion) * 0.3;
  
  // Reliability score (direct - higher reliability = higher score)
  const reliabilityScore = chain.reliability * 0.3;
  
  const totalScore = (gasScore + latencyScore + reliabilityScore) * 100;
  
  return Math.max(0, Math.min(100, totalScore));
}

/**
 * Get chain scores for all chains
 */
export function getAllChainScores(): ChainScore[] {
  const starBridgeStatus = StarBridgeLungs.status();
  const chainMetrics = starBridgeStatus.chainMetrics ?? [];
  
  return chainMetrics.map(chain => ({
    chain: chain.chain,
    score: calculateChainScore(chain),
    factors: {
      gasPrice: chain.gasPressure,
      latency: chain.congestion,
      reliability: chain.reliability,
    },
  })).sort((a, b) => b.score - a.score);
}

