/**
 * DIN Infrastructure Core Types
 * Cryptoeconomic security for DreamNet infrastructure (inspired by DIN's EigenLayer model)
 */

export interface NodeOperator {
  id: string;
  walletAddress: string;
  stakedAmount: bigint; // in wei
  performanceScore: number; // 0-100
  violations: Violation[];
  registeredAt: number;
  lastPerformanceCheck: number;
}

export interface Violation {
  type: 'downtime' | 'bad_data' | 'misbehavior' | 'performance_threshold';
  timestamp: number;
  durationMinutes?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface PerformanceMetrics {
  serviceId: string;
  successRate: number; // 0-100 (target: >99%)
  p95Latency: number; // ms (target: <250ms)
  p99Latency: number; // ms
  throughput: number; // requests/month (target: 13B+)
  uptime: number; // percentage (target: >99.9%)
  timestamp: number;
}

export interface StakingEvent {
  operatorId: string;
  type: 'stake' | 'unstake' | 'slash';
  amount: bigint;
  timestamp: number;
  reason?: string;
}

export interface DINInfrastructureStatus {
  totalOperators: number;
  totalStaked: bigint;
  activeOperators: number;
  slashedOperators: number;
  averagePerformanceScore: number;
  lastPerformanceCheck: number | null;
}

