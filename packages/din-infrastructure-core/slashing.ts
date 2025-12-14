/**
 * DIN Slashing Logic
 * 
 * Slashes operator stakes for misbehavior, downtime, bad data, or performance violations
 */

import { ethers } from 'ethers';
import type { NodeOperator, Violation } from './types';
import { dinStaking } from './staking';
import { DINOperatorStore } from './store/operatorStore';

export class DINSlashing {
  /**
   * Calculate slash amount for violations
   */
  calculateSlash(operator: NodeOperator, violations: Violation[]): bigint {
    let slashAmount = 0n;
    
    for (const violation of violations) {
      switch (violation.type) {
        case 'downtime':
          // 1% per minute of downtime
          const downtimeMinutes = violation.durationMinutes ?? 0;
          slashAmount += BigInt(downtimeMinutes) * (operator.stakedAmount / 100n);
          break;
          
        case 'bad_data':
          // 5% per bad data event
          slashAmount += operator.stakedAmount / 20n;
          break;
          
        case 'misbehavior':
          // 10% per misbehavior
          slashAmount += operator.stakedAmount / 10n;
          break;
          
        case 'performance_threshold':
          // 2% per hour below threshold
          const hoursBelow = Math.ceil((violation.durationMinutes ?? 0) / 60);
          slashAmount += BigInt(hoursBelow) * (operator.stakedAmount / 50n);
          break;
      }
    }
    
    // Max 50% slash
    const maxSlash = operator.stakedAmount / 2n;
    return slashAmount > maxSlash ? maxSlash : slashAmount;
  }
  
  /**
   * Slash an operator's stake
   */
  async slash(
    operatorId: string,
    violations: Violation[],
    reason?: string
  ): Promise<bigint> {
    const operator = dinStaking.getOperator(operatorId);
    if (!operator) {
      throw new Error(`Operator ${operatorId} not found`);
    }
    
    const slashAmount = this.calculateSlash(operator, violations);
    
    if (slashAmount === 0n) {
      return 0n;
    }
    
    // Update operator stake
    operator.stakedAmount -= slashAmount;
    operator.violations.push(...violations);
    
    // Update in store
    DINOperatorStore.updateOperator(operator);
    
    // In production, this would interact with on-chain contract
    // For now, just log
    console.log(
      `[DIN] Slashed operator ${operatorId}: ${ethers.formatEther(slashAmount)} ETH ` +
      `(reason: ${reason ?? violations.map(v => v.type).join(', ')})`
    );
    
    return slashAmount;
  }
  
  /**
   * Record a violation (doesn't slash immediately)
   */
  recordViolation(operatorId: string, violation: Violation): void {
    const operator = dinStaking.getOperator(operatorId);
    if (!operator) {
      console.warn(`[DIN] Cannot record violation for unknown operator: ${operatorId}`);
      return;
    }
    
    operator.violations.push(violation);
    DINOperatorStore.updateOperator(operator);
    
    // Auto-slash for critical violations
    if (violation.severity === 'critical') {
      this.slash(operatorId, [violation], violation.description).catch(err => {
        console.error(`[DIN] Auto-slash failed for ${operatorId}:`, err);
      });
    }
  }
  
  /**
   * Get violations for an operator
   */
  getViolations(operatorId: string, since?: number): Violation[] {
    const operator = dinStaking.getOperator(operatorId);
    if (!operator) return [];
    
    if (since) {
      return operator.violations.filter(v => v.timestamp >= since);
    }
    
    return [...operator.violations];
  }
}

export const dinSlashing = new DINSlashing();

