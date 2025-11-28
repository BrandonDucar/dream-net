/**
 * CCTP V1 Fallback - Fallback to CCTP V1 if V2 unavailable
 * 
 * Provides fallback mechanism to CCTP V1 for chains that don't support V2 yet.
 */

import type { CCTPV2Client } from './CCTPV2Client.js';
import type { CCTPV2TransferParams, CCTPV2TransferResult } from './CCTPV2Client.js';

/**
 * CCTP V1 Fallback - Fallback to V1
 */
export class CCTPV1Fallback {
  /**
   * Check if V2 is available for chain pair
   */
  isV2Available(sourceChain: string, targetChain: string): boolean {
    // Stub - Antigravity will implement chain support checking
    // V2 supported chains: Base, Ethereum, Avalanche, Polygon
    const v2SupportedChains = ['base', 'ethereum', 'avalanche', 'polygon'];
    return v2SupportedChains.includes(sourceChain.toLowerCase()) && 
           v2SupportedChains.includes(targetChain.toLowerCase());
  }

  /**
   * Fallback to V1 if V2 unavailable
   */
  async transferWithFallback(
    v2Client: CCTPV2Client,
    params: CCTPV2TransferParams
  ): Promise<CCTPV2TransferResult> {
    if (this.isV2Available(params.sourceChain, params.targetChain)) {
      return v2Client.transfer(params);
    }

    // Fallback to V1
    // Stub - Antigravity will implement V1 fallback
    throw new Error("Not implemented - Antigravity will implement CCTP V1 fallback");
  }
}

