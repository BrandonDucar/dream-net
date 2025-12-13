/**
 * DIN Infrastructure Core
 * 
 * Cryptoeconomic security for DreamNet infrastructure (inspired by DIN's EigenLayer model)
 * 
 * Features:
 * - Node operator staking (ETH/stETH)
 * - Performance monitoring (>99% success rate, <250ms latency)
 * - Slashing for misbehavior/downtime/bad data
 * - RPC routing at scale (13B+ requests/month capability)
 */

export { dinStaking } from './staking';
export { dinSlashing } from './slashing';
export { dinPerformanceMonitor } from './performance';
export { DINOperatorStore } from './store/operatorStore';
export type {
  NodeOperator,
  Violation,
  PerformanceMetrics,
  StakingEvent,
  DINInfrastructureStatus,
} from './types';

import { dinStaking } from './staking';
import { dinPerformanceMonitor } from './performance';
import { DINOperatorStore } from './store/operatorStore';

export const DINInfrastructureCore = {
  /**
   * Register a node operator
   */
  async registerOperator(
    operatorId: string,
    walletAddress: string,
    initialStake?: bigint
  ) {
    return dinStaking.registerOperator(operatorId, walletAddress, initialStake);
  },

  /**
   * Stake for an operator
   */
  async stake(operatorId: string, amount: bigint) {
    return dinStaking.stake(operatorId, amount);
  },

  /**
   * Unstake for an operator
   */
  async unstake(operatorId: string, amount: bigint) {
    return dinStaking.unstake(operatorId, amount);
  },

  /**
   * Get operator
   */
  getOperator(operatorId: string) {
    return dinStaking.getOperator(operatorId);
  },

  /**
   * Record performance metrics
   */
  async recordMetrics(operatorId: string, metrics: import('./types').PerformanceMetrics) {
    return dinPerformanceMonitor.recordMetrics(operatorId, metrics);
  },

  /**
   * Get performance metrics
   */
  getMetrics(operatorId: string, limit?: number) {
    return dinPerformanceMonitor.getMetrics(operatorId, limit);
  },

  /**
   * Get status
   */
  status(): import('./types').DINInfrastructureStatus {
    return DINOperatorStore.status();
  },
};

export default DINInfrastructureCore;

