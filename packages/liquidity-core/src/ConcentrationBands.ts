/**
 * Concentration Bands - Band calculation for liquidity seeding
 * 
 * Calculates optimal liquidity bands above/below mid price.
 */

export interface ConcentrationBand {
  offsetPercent: number;
  amount: bigint;
}

/**
 * Concentration Bands - Calculates liquidity bands
 */
export class ConcentrationBands {
  /**
   * Calculate bands for pre-seeding
   */
  calculateBands(
    midPrice: bigint,
    isStablePair: boolean,
    totalAmount: bigint
  ): ConcentrationBand[] {
    const bands: ConcentrationBand[] = [];

    if (isStablePair) {
      // Tight bands for stables: ±0.6%, ±1.2%
      bands.push({ offsetPercent: 0.006, amount: totalAmount / BigInt(4) });
      bands.push({ offsetPercent: 0.012, amount: totalAmount / BigInt(4) });
    } else {
      // Wider bands for volatile pairs: ±0.6%, ±1.2%, ±2.5%
      bands.push({ offsetPercent: 0.006, amount: totalAmount / BigInt(5) });
      bands.push({ offsetPercent: 0.012, amount: totalAmount / BigInt(5) });
      bands.push({ offsetPercent: 0.025, amount: totalAmount / BigInt(5) });
    }

    return bands;
  }

  /**
   * Calculate price at offset
   */
  calculatePriceAtOffset(midPrice: bigint, offsetPercent: number): bigint {
    const multiplier = BigInt(Math.floor((1 + offsetPercent) * 1000000));
    return (midPrice * multiplier) / BigInt(1000000);
  }
}

