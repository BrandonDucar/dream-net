/**
 * TWAP Executor - Time-weighted average price execution
 * 
 * Breaks large orders into time slices with randomized intervals.
 */

export interface TWAPConfig {
  totalAmount: bigint;
  numClips: number;
  durationMs: number;
  slippageTolerance: number;
}

export interface TWAPClip {
  amount: bigint;
  executeAt: number;
  slippageTolerance: number;
}

/**
 * TWAP Executor - Executes orders in time-weighted slices
 */
export class TWAPExecutor {
  /**
   * Generate TWAP clips
   */
  generateClips(config: TWAPConfig): TWAPClip[] {
    const clips: TWAPClip[] = [];
    const clipAmount = config.totalAmount / BigInt(config.numClips);
    const baseInterval = config.durationMs / config.numClips;
    const now = Date.now();

    for (let i = 0; i < config.numClips; i++) {
      // Randomize interval (±20%)
      const randomFactor = 0.8 + Math.random() * 0.4;
      const interval = baseInterval * randomFactor;
      const executeAt = now + (interval * i);

      // Increase slippage tolerance later in schedule
      const slippageMultiplier = 1 + (i / config.numClips) * 0.5;
      const slippage = config.slippageTolerance * slippageMultiplier;

      clips.push({
        amount: clipAmount,
        executeAt,
        slippageTolerance: slippage,
      });
    }

    return clips.sort((a, b) => a.executeAt - b.executeAt);
  }

  /**
   * Execute a TWAP clip
   */
  async executeClip(clip: TWAPClip, executeFn: (amount: bigint, slippage: number) => Promise<string>): Promise<string> {
    // Wait until execution time
    const waitTime = clip.executeAt - Date.now();
    if (waitTime > 0) {
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    return executeFn(clip.amount, clip.slippageTolerance);
  }
}

