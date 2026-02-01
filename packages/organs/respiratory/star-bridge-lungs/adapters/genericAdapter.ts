import type { ChainBreathMetrics, ChainId } from '../types.js';

export function createGenericChainMetrics(chain: ChainId): ChainBreathMetrics {
  const now = Date.now();

  // Placeholder heuristic values; these will be replaced with real telemetry later
  // TODO: Replace with real RPC calls to chain nodes for gas prices, block times, etc.
  return {
    chain,
    gasPressure: 0.3,
    liquidityPressure: 0.4,
    congestion: 0.2,
    reliability: 0.8,
    lastUpdatedAt: now,
  };
}

