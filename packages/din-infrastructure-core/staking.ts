/**
 * DIN Staking Mechanism
 * 
 * Node operator staking (ETH/stETH via EigenLayer-style mechanism)
 * Handles staking, unstaking, and stake tracking
 */

import { ethers } from 'ethers';
import type { NodeOperator, StakingEvent } from './types';
import { DINOperatorStore } from './store/operatorStore';

export class DINStaking {
  private operators: Map<string, NodeOperator> = new Map();
  private stakingEvents: StakingEvent[] = [];
  private minStake = ethers.parseEther('1'); // 1 ETH minimum
  
  /**
   * Register a new node operator
   */
  async registerOperator(
    operatorId: string,
    walletAddress: string,
    initialStake?: bigint
  ): Promise<NodeOperator> {
    if (this.operators.has(operatorId)) {
      throw new Error(`Operator ${operatorId} already registered`);
    }
    
    const operator: NodeOperator = {
      id: operatorId,
      walletAddress,
      stakedAmount: initialStake ?? 0n,
      performanceScore: 100, // Start at 100
      violations: [],
      registeredAt: Date.now(),
      lastPerformanceCheck: Date.now(),
    };
    
    this.operators.set(operatorId, operator);
    DINOperatorStore.addOperator(operator);
    
    // If initial stake provided, stake it
    if (initialStake && initialStake >= this.minStake) {
      await this.stake(operatorId, initialStake);
    }
    
    return operator;
  }
  
  /**
   * Stake ETH/stETH for an operator
   */
  async stake(operatorId: string, amount: bigint): Promise<void> {
    const operator = this.operators.get(operatorId);
    if (!operator) {
      throw new Error(`Operator ${operatorId} not found`);
    }
    
    if (amount < this.minStake) {
      throw new Error(`Stake amount ${ethers.formatEther(amount)} ETH below minimum ${ethers.formatEther(this.minStake)} ETH`);
    }
    
    // In production, this would interact with EigenLayer-style contract
    // For now, just update in-memory state
    operator.stakedAmount += amount;
    this.operators.set(operatorId, operator);
    DINOperatorStore.updateOperator(operator);
    
    // Record staking event
    const event: StakingEvent = {
      operatorId,
      type: 'stake',
      amount,
      timestamp: Date.now(),
    };
    this.stakingEvents.push(event);
    
    console.log(`[DIN] Operator ${operatorId} staked ${ethers.formatEther(amount)} ETH`);
  }
  
  /**
   * Unstake ETH/stETH for an operator
   */
  async unstake(operatorId: string, amount: bigint): Promise<void> {
    const operator = this.operators.get(operatorId);
    if (!operator) {
      throw new Error(`Operator ${operatorId} not found`);
    }
    
    if (amount > operator.stakedAmount) {
      throw new Error(`Unstake amount ${ethers.formatEther(amount)} ETH exceeds staked amount ${ethers.formatEther(operator.stakedAmount)} ETH`);
    }
    
    // In production, this would interact with EigenLayer-style contract
    // For now, just update in-memory state
    operator.stakedAmount -= amount;
    this.operators.set(operatorId, operator);
    DINOperatorStore.updateOperator(operator);
    
    // Record unstaking event
    const event: StakingEvent = {
      operatorId,
      type: 'unstake',
      amount,
      timestamp: Date.now(),
    };
    this.stakingEvents.push(event);
    
    console.log(`[DIN] Operator ${operatorId} unstaked ${ethers.formatEther(amount)} ETH`);
  }
  
  /**
   * Get operator by ID
   */
  getOperator(operatorId: string): NodeOperator | undefined {
    return this.operators.get(operatorId);
  }
  
  /**
   * Get all operators
   */
  getAllOperators(): NodeOperator[] {
    return Array.from(this.operators.values());
  }
  
  /**
   * Get staking events
   */
  getStakingEvents(operatorId?: string): StakingEvent[] {
    if (operatorId) {
      return this.stakingEvents.filter(e => e.operatorId === operatorId);
    }
    return [...this.stakingEvents];
  }
  
  /**
   * Get total staked amount
   */
  getTotalStaked(): bigint {
    return Array.from(this.operators.values()).reduce(
      (sum, op) => sum + op.stakedAmount,
      0n
    );
  }
}

export const dinStaking = new DINStaking();

