import type { ChainBreathMetrics } from '../types.js';
import { createGenericChainMetrics } from './genericAdapter.js';

export function getSolanaMetrics(): ChainBreathMetrics {
  // Placeholder: specialize later with real Solana telemetry
  // TODO: Integrate with Solana RPC endpoint for real-time transaction fees and network congestion
  const metrics = createGenericChainMetrics("solana");
  return {
    ...metrics,
    gasPressure: 0.2,
    liquidityPressure: 0.5,
  };
}

