/**
 * Circuit Breaker - Circuit breaker for reserve monitoring
 * 
 * Implements circuit breaker pattern to halt transfers if reserves drop below threshold.
 */

import type { ChainlinkPoR } from './ChainlinkPoR.js';

export interface CircuitBreakerConfig {
  reserveThreshold: bigint;
  cooldownMs: number;
  maxFailures: number;
}

export type CircuitBreakerState = 'closed' | 'open' | 'half-open';

/**
 * Circuit Breaker - Circuit breaker for reserves
 */
export class CircuitBreaker {
  private por: ChainlinkPoR;
  private config: CircuitBreakerConfig;
  private state: CircuitBreakerState = 'closed';
  private failureCount: number = 0;
  private lastFailureTime: number = 0;

  constructor(por: ChainlinkPoR, config: CircuitBreakerConfig) {
    this.por = por;
    this.config = config;
  }

  /**
   * Check if transfer is allowed
   */
  async checkTransfer(transferAmount: bigint): Promise<boolean> {
    // If circuit is open, check cooldown
    if (this.state === 'open') {
      const cooldownElapsed = Date.now() - this.lastFailureTime >= this.config.cooldownMs;
      if (cooldownElapsed) {
        this.state = 'half-open';
      } else {
        return false;
      }
    }

    // Verify reserves
    const hasReserves = await this.por.verifyReserves(transferAmount);
    
    if (!hasReserves) {
      this.failureCount++;
      this.lastFailureTime = Date.now();
      
      if (this.failureCount >= this.config.maxFailures) {
        this.state = 'open';
      }
      
      return false;
    }

    // Reset on success
    if (this.state === 'half-open') {
      this.state = 'closed';
      this.failureCount = 0;
    }

    return true;
  }

  /**
   * Get current state
   */
  getState(): CircuitBreakerState {
    return this.state;
  }

  /**
   * Manually reset circuit breaker
   */
  reset(): void {
    this.state = 'closed';
    this.failureCount = 0;
    this.lastFailureTime = 0;
  }
}

