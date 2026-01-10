import type { ChainBreathMetrics } from '../types.js';
import { createGenericChainMetrics } from './genericAdapter.js';

export function getEthereumMetrics(): ChainBreathMetrics {
  // Placeholder: specialize later with real Ethereum telemetry
  // TODO: Integrate with Ethereum RPC endpoint for real-time gas prices and block data
  const metrics = createGenericChainMetrics("ethereum");
  return {
    ...metrics,
    gasPressure: 0.6, // assume higher pressure as default
    congestion: 0.5,
  };
}

