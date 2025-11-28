/**
 * Reserve Monitor - Continuous reserve monitoring
 * 
 * Monitors USDC reserves continuously and triggers alerts if thresholds breached.
 */

import type { ChainlinkPoR } from './ChainlinkPoR.js';
import type { CircuitBreaker } from './CircuitBreaker.js';

export interface ReserveAlert {
  type: 'threshold_breach' | 'stale_data' | 'reserve_drop';
  severity: 'warning' | 'critical';
  message: string;
  timestamp: number;
}

export type ReserveAlertHandler = (alert: ReserveAlert) => void | Promise<void>;

/**
 * Reserve Monitor - Continuous reserve monitoring
 */
export class ReserveMonitor {
  private por: ChainlinkPoR;
  private circuitBreaker: CircuitBreaker;
  private alertHandlers: ReserveAlertHandler[] = [];
  private monitoringInterval?: NodeJS.Timeout;
  private lastReserveAmount: bigint = BigInt(0);

  constructor(por: ChainlinkPoR, circuitBreaker: CircuitBreaker) {
    this.por = por;
    this.circuitBreaker = circuitBreaker;
  }

  /**
   * Register alert handler
   */
  onAlert(handler: ReserveAlertHandler): void {
    this.alertHandlers.push(handler);
  }

  /**
   * Start monitoring
   */
  start(intervalMs: number = 60000): void {
    if (this.monitoringInterval) {
      return; // Already monitoring
    }

    this.monitoringInterval = setInterval(async () => {
      await this.checkReserves();
    }, intervalMs);

    // Initial check
    this.checkReserves();
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
  }

  /**
   * Check reserves
   */
  private async checkReserves(): Promise<void> {
    try {
      const porData = await this.por.getLatestPoR();

      // Check for stale data
      const isStale = await this.por.isStale();
      if (isStale) {
        await this.emitAlert({
          type: 'stale_data',
          severity: 'warning',
          message: 'PoR data is stale',
          timestamp: Date.now(),
        });
      }

      // Check for reserve drop
      if (this.lastReserveAmount > BigInt(0) && porData.reserveAmount < this.lastReserveAmount) {
        const dropPercent = Number((this.lastReserveAmount - porData.reserveAmount) * BigInt(100) / this.lastReserveAmount);
        if (dropPercent > 5) { // >5% drop
          await this.emitAlert({
            type: 'reserve_drop',
            severity: dropPercent > 10 ? 'critical' : 'warning',
            message: `Reserve dropped by ${dropPercent.toFixed(2)}%`,
            timestamp: Date.now(),
          });
        }
      }

      this.lastReserveAmount = porData.reserveAmount;
    } catch (error: any) {
      await this.emitAlert({
        type: 'threshold_breach',
        severity: 'critical',
        message: `Reserve check failed: ${error.message}`,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Emit alert
   */
  private async emitAlert(alert: ReserveAlert): Promise<void> {
    await Promise.all(this.alertHandlers.map(h => h(alert)));
  }
}

