// SwarmConsciousnessEngine - Treasury Management

import { TreasuryTransaction, SwarmTreasuryStatus, SwarmConfig } from './types';

export class TreasuryManagement {
  private balance: number = 0;
  private transactions: TreasuryTransaction[] = [];
  private config: SwarmConfig;
  private reserves: number = 0;
  private activeCommitments: number = 0;

  constructor(initialFunds: number, config: SwarmConfig) {
    this.balance = initialFunds;
    this.reserves = (initialFunds * config.minReservePercentage) / 100;
    this.config = config;

    // Record initial deposit
    this.recordTransaction('deposit', initialFunds, undefined, undefined, 'Initial swarm treasury deposit');
  }

  /**
   * Record a transaction
   */
  private recordTransaction(
    type: 'deposit' | 'withdrawal' | 'distribution' | 'reserve',
    amount: number,
    agentId?: string,
    opportunityId?: string,
    description: string = ''
  ): TreasuryTransaction {
    const transaction: TreasuryTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type,
      amount,
      agentId,
      opportunityId,
      description,
      balance: this.balance,
    };

    this.transactions.push(transaction);
    return transaction;
  }

  /**
   * Deposit funds into treasury (from grant wins, payments, etc)
   */
  depositFunds(amount: number, source: string): { success: boolean; message: string; newBalance: number } {
    if (amount <= 0) {
      return { success: false, message: 'Deposit amount must be positive', newBalance: this.balance };
    }

    this.balance += amount;
    this.recordTransaction('deposit', amount, undefined, undefined, `Deposit from ${source}`);

    // Update reserves if balance increased
    const minReserve = (this.balance * this.config.minReservePercentage) / 100;
    if (this.reserves < minReserve) {
      this.reserves = minReserve;
    }

    console.log(`[TREASURY] Deposited $${amount} (New balance: $${this.balance})`);
    return { success: true, message: 'Funds deposited successfully', newBalance: this.balance };
  }

  /**
   * Commit funds to an opportunity (pools)
   */
  commitFunds(opportunityId: string, amount: number): { success: boolean; message: string } {
    const availableFunds = this.balance - this.reserves - this.activeCommitments;

    if (amount > availableFunds) {
      return {
        success: false,
        message: `Insufficient available funds. Available: $${availableFunds}, requesting: $${amount}`,
      };
    }

    this.activeCommitments += amount;
    this.recordTransaction('reserve', amount, undefined, opportunityId, `Commitment to opportunity ${opportunityId}`);

    console.log(`[TREASURY] Committed $${amount} to opportunity ${opportunityId}`);
    return { success: true, message: 'Funds committed successfully' };
  }

  /**
   * Release committed funds (opportunity failed)
   */
  releaseFunds(opportunityId: string, amount: number): void {
    this.activeCommitments = Math.max(0, this.activeCommitments - amount);
    this.recordTransaction('withdrawal', amount, undefined, opportunityId, `Release from opportunity ${opportunityId}`);

    console.log(`[TREASURY] Released $${amount} from opportunity ${opportunityId}`);
  }

  /**
   * Distribute revenue from opportunity to agents
   */
  distributeFundsToAgents(
    opportunityId: string,
    totalRevenue: number,
    distributions: Map<string, number>
  ): { success: boolean; message: string; distributions: Array<{ agentId: string; amount: number }> } {
    let totalDistributed = 0;
    const distributionRecords: Array<{ agentId: string; amount: number }> = [];

    distributions.forEach((amount, agentId) => {
      if (amount <= 0) return;

      totalDistributed += amount;
      distributionRecords.push({ agentId, amount });

      this.recordTransaction('distribution', amount, agentId, opportunityId, `Revenue distribution from ${opportunityId}`);
    });

    // Update treasury
    this.balance -= totalDistributed;
    this.activeCommitments = Math.max(0, this.activeCommitments - totalRevenue);

    console.log(`[TREASURY] Distributed $${totalDistributed} from opportunity ${opportunityId} to ${distributions.size} agents`);

    return {
      success: true,
      message: `Distributed $${totalDistributed}`,
      distributions: distributionRecords,
    };
  }

  /**
   * Get treasury status
   */
  getStatus(): SwarmTreasuryStatus {
    const recentTransactions = this.transactions.slice(-10);

    return {
      totalFunds: this.balance,
      activeCommitments: this.activeCommitments,
      reserves: this.reserves,
      availableFunds: this.balance - this.reserves - this.activeCommitments,
      recentTransactions,
      lastUpdated: new Date(),
    };
  }

  /**
   * Get transaction history
   */
  getTransactionHistory(limit: number = 50): TreasuryTransaction[] {
    return this.transactions.slice(-limit).reverse();
  }

  /**
   * Get treasury analytics
   */
  getAnalytics(): {
    totalDeposits: number;
    totalDistributions: number;
    netIncome: number;
    averageTransactionSize: number;
    transactionCount: number;
  } {
    const deposits = this.transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0);
    const distributions = this.transactions.filter(t => t.type === 'distribution').reduce((sum, t) => sum + t.amount, 0);

    return {
      totalDeposits: deposits,
      totalDistributions: distributions,
      netIncome: deposits - distributions,
      averageTransactionSize: this.transactions.length > 0 ? this.balance / this.transactions.length : 0,
      transactionCount: this.transactions.length,
    };
  }

  /**
   * Validate treasury health
   */
  validateHealth(): {
    isHealthy: boolean;
    warnings: string[];
    status: 'optimal' | 'good' | 'warning' | 'critical';
  } {
    const warnings: string[] = [];
    const availableFunds = this.balance - this.reserves - this.activeCommitments;
    const availablePercentage = (availableFunds / this.balance) * 100;

    if (availablePercentage < 10) {
      warnings.push('Available funds critically low (<10%)');
    } else if (availablePercentage < 20) {
      warnings.push('Available funds low (<20%)');
    }

    if (this.activeCommitments > this.balance * 0.5) {
      warnings.push('High active commitments (>50% of balance)');
    }

    let status: 'optimal' | 'good' | 'warning' | 'critical' = 'optimal';
    if (warnings.length === 0 && availablePercentage > 40) {
      status = 'optimal';
    } else if (warnings.length === 0) {
      status = 'good';
    } else if (warnings.length === 1) {
      status = 'warning';
    } else {
      status = 'critical';
    }

    return {
      isHealthy: warnings.length === 0,
      warnings,
      status,
    };
  }
}
