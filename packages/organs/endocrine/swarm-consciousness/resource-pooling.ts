// SwarmConsciousnessEngine - Resource Pooling

import { Agent, OpportunityProposal, ResourcePool, SwarmConfig } from './types';

export class ResourcePooling {
  private pools: Map<string, ResourcePool> = new Map();
  private config: SwarmConfig;

  constructor(config: SwarmConfig) {
    this.config = config;
  }

  /**
   * Create a new resource pool for an opportunity
   */
  createPool(opportunityId: string, totalRequired: number, deadline: Date): ResourcePool {
    const pool: ResourcePool = {
      opportunityId,
      totalRequired,
      totalCommitted: 0,
      contributors: new Map(),
      status: 'forming',
      createdAt: new Date(),
      deadline,
    };

    this.pools.set(opportunityId, pool);
    console.log(`[SWARM] Resource pool created: ${opportunityId} needs $${totalRequired}`);
    return pool;
  }

  /**
   * Agent commits funds to a pool
   */
  commitFunds(
    opportunityId: string,
    agentId: string,
    amount: number,
    agentTreasury: number
  ): { success: boolean; message: string; pool?: ResourcePool } {
    const pool = this.pools.get(opportunityId);
    if (!pool) {
      return { success: false, message: `Pool not found for opportunity ${opportunityId}` };
    }

    // Check if agent is trying to commit more than their max allowance
    const maxAllowance = (agentTreasury * this.config.maxPoolPercentagePerAgent) / 100;
    const alreadyCommitted = pool.contributors.get(agentId) || 0;
    const newTotal = alreadyCommitted + amount;

    if (newTotal > maxAllowance) {
      return {
        success: false,
        message: `Agent ${agentId} exceeds max pool commitment. Max: $${maxAllowance}, trying: $${newTotal}`,
      };
    }

    if (amount > (agentTreasury - alreadyCommitted)) {
      return {
        success: false,
        message: `Agent ${agentId} insufficient treasury balance. Available: $${agentTreasury - alreadyCommitted}, requesting: $${amount}`,
      };
    }

    // Update pool
    pool.contributors.set(agentId, newTotal);
    pool.totalCommitted += amount;

    // Check if pool is now complete
    if (pool.totalCommitted >= pool.totalRequired) {
      pool.status = 'complete';
      console.log(`[SWARM] Resource pool COMPLETE: ${opportunityId} ($${pool.totalCommitted}/$${pool.totalRequired})`);
    } else {
      pool.status = 'active';
    }

    console.log(`[SWARM] Agent ${agentId} committed $${amount} to pool ${opportunityId} (Total: $${pool.totalCommitted}/$${pool.totalRequired})`);

    return { success: true, message: 'Funds committed successfully', pool };
  }

  /**
   * Get pool status
   */
  getPoolStatus(opportunityId: string): ResourcePool | undefined {
    return this.pools.get(opportunityId);
  }

  /**
   * Calculate how much an agent can contribute based on treasury
   */
  calculateMaxContribution(agentTreasury: number, alreadyCommitted: number = 0): number {
    const maxAllowance = (agentTreasury * this.config.maxPoolPercentagePerAgent) / 100;
    return Math.max(0, maxAllowance - alreadyCommitted);
  }

  /**
   * Get all active pools
   */
  getActivePools(): ResourcePool[] {
    return Array.from(this.pools.values()).filter(p => p.status === 'active' || p.status === 'forming');
  }

  /**
   * Get pool contributors
   */
  getContributors(opportunityId: string): Array<{ agentId: string; amount: number }> {
    const pool = this.pools.get(opportunityId);
    if (!pool) return [];

    return Array.from(pool.contributors.entries()).map(([agentId, amount]) => ({
      agentId,
      amount,
    }));
  }

  /**
   * Calculate agent's share in pool (for revenue distribution)
   */
  calculateAgentShare(opportunityId: string, agentId: string, totalRevenue: number): number {
    const pool = this.pools.get(opportunityId);
    if (!pool) return 0;

    const agentCommitment = pool.contributors.get(agentId) || 0;
    if (pool.totalCommitted === 0) return 0;

    return (agentCommitment / pool.totalCommitted) * totalRevenue;
  }

  /**
   * Close a pool after execution
   */
  closePool(opportunityId: string): void {
    const pool = this.pools.get(opportunityId);
    if (pool) {
      pool.status = 'failed'; // or 'complete' depending on outcome
      console.log(`[SWARM] Resource pool closed: ${opportunityId}`);
    }
  }

  /**
   * Get pooling statistics
   */
  getPoolingStats(): {
    totalPools: number;
    activePools: number;
    totalCommitted: number;
    totalRequired: number;
    completionRate: number;
  } {
    const allPools = Array.from(this.pools.values());
    const activePools = allPools.filter(p => p.status === 'active' || p.status === 'forming');
    
    const totalCommitted = allPools.reduce((sum, p) => sum + p.totalCommitted, 0);
    const totalRequired = allPools.reduce((sum, p) => sum + p.totalRequired, 0);
    const completionRate = totalRequired > 0 ? (totalCommitted / totalRequired) * 100 : 0;

    return {
      totalPools: allPools.length,
      activePools: activePools.length,
      totalCommitted,
      totalRequired,
      completionRate: Math.round(completionRate * 100) / 100,
    };
  }
}
