/**
 * DIN Performance Monitoring
 * 
 * Tracks operator performance metrics:
 * - Success rate (target: >99%)
 * - Latency (target: <250ms p95)
 * - Throughput (target: 13B+ requests/month)
 * - Uptime (target: >99.9%)
 */

import { DreamNetMetricsCore } from '@dreamnet/dreamnet-metrics-core';
import { nervousMessageBus } from '@dreamnet/nervous-system-core/messageBus';
import type { NodeOperator, PerformanceMetrics } from './types';
import { dinStaking } from './staking';
import { dinSlashing } from './slashing';

export class DINPerformanceMonitor {
  private performanceHistory: Map<string, PerformanceMetrics[]> = new Map();
  private readonly SUCCESS_RATE_THRESHOLD = 99;
  private readonly LATENCY_THRESHOLD = 250; // ms
  private readonly THROUGHPUT_THRESHOLD = 13_000_000_000; // 13B requests/month
  private readonly UPTIME_THRESHOLD = 99.9;
  
  /**
   * Calculate performance score (0-100)
   */
  calculatePerformanceScore(metrics: PerformanceMetrics): number {
    // Success rate component (40%)
    const successRateScore = metrics.successRate;
    
    // Latency component (30%)
    // Score decreases linearly from 100 at 250ms to 0 at 500ms
    const latencyScore = Math.max(0, 100 - ((metrics.p95Latency - this.LATENCY_THRESHOLD) / 10));
    
    // Throughput component (20%)
    // Score increases linearly from 0 at 0 to 100 at 13B+
    const throughputScore = Math.min(100, (metrics.throughput / this.THROUGHPUT_THRESHOLD) * 100);
    
    // Uptime component (10%)
    const uptimeScore = metrics.uptime;
    
    // Weighted average
    const score = 
      (successRateScore * 0.4) +
      (latencyScore * 0.3) +
      (throughputScore * 0.2) +
      (uptimeScore * 0.1);
    
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Record performance metrics for an operator
   */
  async recordMetrics(operatorId: string, metrics: PerformanceMetrics): Promise<void> {
    // Store metrics
    if (!this.performanceHistory.has(operatorId)) {
      this.performanceHistory.set(operatorId, []);
    }
    const history = this.performanceHistory.get(operatorId)!;
    history.push(metrics);
    
    // Keep only last 1000 metrics
    if (history.length > 1000) {
      history.shift();
    }
    
    // Calculate performance score
    const score = this.calculatePerformanceScore(metrics);
    
    // Update operator
    const operator = dinStaking.getOperator(operatorId);
    if (operator) {
      operator.performanceScore = score;
      operator.lastPerformanceCheck = Date.now();
    }
    
    // Check for violations
    this.checkViolations(operatorId, metrics, score);
    
    // Publish telemetry
    nervousMessageBus.publish({
      id: `performance-${operatorId}-${Date.now()}`,
      ts: Date.now(),
      role: 'sensor',
      topic: 'telemetry',
      key: `operator:${operatorId}`,
      payload: {
        operatorId,
        metrics,
        score,
      },
    });
  }
  
  /**
   * Check for performance violations
   */
  private checkViolations(
    operatorId: string,
    metrics: PerformanceMetrics,
    score: number
  ): void {
    const violations: Array<{ type: string; severity: string; description: string }> = [];
    
    // Success rate violation
    if (metrics.successRate < this.SUCCESS_RATE_THRESHOLD) {
      violations.push({
        type: 'performance_threshold',
        severity: metrics.successRate < 95 ? 'critical' : 'high',
        description: `Success rate ${metrics.successRate.toFixed(2)}% below threshold ${this.SUCCESS_RATE_THRESHOLD}%`,
      });
    }
    
    // Latency violation
    if (metrics.p95Latency > this.LATENCY_THRESHOLD) {
      violations.push({
        type: 'performance_threshold',
        severity: metrics.p95Latency > 500 ? 'critical' : 'high',
        description: `p95 latency ${metrics.p95Latency}ms above threshold ${this.LATENCY_THRESHOLD}ms`,
      });
    }
    
    // Throughput violation
    if (metrics.throughput < this.THROUGHPUT_THRESHOLD) {
      violations.push({
        type: 'performance_threshold',
        severity: 'medium',
        description: `Throughput ${metrics.throughput} below threshold ${this.THROUGHPUT_THRESHOLD}`,
      });
    }
    
    // Uptime violation
    if (metrics.uptime < this.UPTIME_THRESHOLD) {
      violations.push({
        type: 'downtime',
        severity: metrics.uptime < 99 ? 'critical' : 'high',
        description: `Uptime ${metrics.uptime.toFixed(2)}% below threshold ${this.UPTIME_THRESHOLD}%`,
      });
    }
    
    // Record violations
    for (const violation of violations) {
      dinSlashing.recordViolation(operatorId, {
        type: violation.type as any,
        timestamp: Date.now(),
        severity: violation.severity as any,
        description: violation.description,
      });
    }
  }
  
  /**
   * Get performance metrics for an operator
   */
  getMetrics(operatorId: string, limit?: number): PerformanceMetrics[] {
    const history = this.performanceHistory.get(operatorId) ?? [];
    return limit ? history.slice(-limit) : [...history];
  }
  
  /**
   * Get latest metrics for an operator
   */
  getLatestMetrics(operatorId: string): PerformanceMetrics | null {
    const history = this.performanceHistory.get(operatorId);
    return history && history.length > 0 ? history[history.length - 1] : null;
  }
}

export const dinPerformanceMonitor = new DINPerformanceMonitor();

