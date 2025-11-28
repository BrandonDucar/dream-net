/**
 * Metrics Collection with Cardinality Caps
 * 
 * Provides metrics collection utilities with bucketing and cardinality management.
 */

import { metrics, ValueType } from '@opentelemetry/api';

const meter = metrics.getMeter('dreamnet');

/**
 * Create a histogram metric with p95/p99 views
 */
export function createLatencyHistogram(name: string, description: string) {
  return meter.createHistogram(name, {
    description,
    valueType: ValueType.DOUBLE,
    unit: 'ms',
  });
}

/**
 * Create a counter metric
 */
export function createCounter(name: string, description: string) {
  return meter.createCounter(name, {
    description,
    valueType: ValueType.INT,
  });
}

/**
 * Bucket user IDs to prevent cardinality explosion
 */
export function bucketUserId(userId: string): string {
  // Simple bucketing: use first 8 chars + tier
  // In production, use actual user tier from database
  return `user_${userId.substring(0, 8)}_tier_free`;
}

/**
 * Bucket wallet age
 */
export function bucketWalletAge(ageDays: number): string {
  if (ageDays < 7) return 'wallet_age_0-7d';
  if (ageDays < 30) return 'wallet_age_7-30d';
  if (ageDays < 90) return 'wallet_age_30-90d';
  return 'wallet_age_90d+';
}

/**
 * DreamNet business metrics
 */
export const dreamnetMetrics = {
  conversionRate: createCounter(
    'custom.googleapis.com/dreamnet/conversion_rate',
    'Dream creation to deployment conversion rate'
  ),
  toolFailures: createCounter(
    'custom.googleapis.com/dreamnet/tool_failures',
    'Agent tool failure count'
  ),
  apiLatency: createLatencyHistogram(
    'custom.googleapis.com/dreamnet/api_latency',
    'API endpoint latency'
  ),
};

export { meter };

