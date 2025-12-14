/**
 * DIN Operator Store
 * Stores node operator data
 */

import type { NodeOperator, DINInfrastructureStatus } from '../types';

class DINOperatorStore {
  private operators: Map<string, NodeOperator> = new Map();
  
  /**
   * Add an operator
   */
  addOperator(operator: NodeOperator): void {
    this.operators.set(operator.id, operator);
  }
  
  /**
   * Update an operator
   */
  updateOperator(operator: NodeOperator): void {
    this.operators.set(operator.id, operator);
  }
  
  /**
   * Get an operator
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
   * Get active operators (performance score > 50)
   */
  getActiveOperators(): NodeOperator[] {
    return Array.from(this.operators.values()).filter(
      op => op.performanceScore > 50 && op.stakedAmount > 0n
    );
  }
  
  /**
   * Get slashed operators (has violations)
   */
  getSlashedOperators(): NodeOperator[] {
    return Array.from(this.operators.values()).filter(
      op => op.violations.length > 0
    );
  }
  
  /**
   * Get status
   */
  status(): DINInfrastructureStatus {
    const operators = Array.from(this.operators.values());
    const activeOperators = this.getActiveOperators();
    const slashedOperators = this.getSlashedOperators();
    
    const totalStaked = operators.reduce(
      (sum, op) => sum + op.stakedAmount,
      0n
    );
    
    const averagePerformanceScore = operators.length > 0
      ? operators.reduce((sum, op) => sum + op.performanceScore, 0) / operators.length
      : 0;
    
    const lastPerformanceCheck = operators.length > 0
      ? Math.max(...operators.map(op => op.lastPerformanceCheck))
      : null;
    
    return {
      totalOperators: operators.length,
      totalStaked,
      activeOperators: activeOperators.length,
      slashedOperators: slashedOperators.length,
      averagePerformanceScore,
      lastPerformanceCheck,
    };
  }
}

export const DINOperatorStore = new DINOperatorStore();

