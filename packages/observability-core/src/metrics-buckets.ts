/**
 * Metric Bucketing Utilities
 * 
 * Prevents cardinality explosion by bucketing high-cardinality attributes.
 */

/**
 * Bucket user tier
 */
export function bucketUserTier(tier: string): string {
  const normalized = tier.toLowerCase();
  if (normalized.includes('premium') || normalized.includes('pro')) {
    return 'tier_premium';
  }
  if (normalized.includes('enterprise')) {
    return 'tier_enterprise';
  }
  return 'tier_free';
}

/**
 * Bucket request size
 */
export function bucketRequestSize(sizeBytes: number): string {
  if (sizeBytes < 1024) return 'size_0-1kb';
  if (sizeBytes < 10240) return 'size_1-10kb';
  if (sizeBytes < 102400) return 'size_10-100kb';
  if (sizeBytes < 1048576) return 'size_100kb-1mb';
  return 'size_1mb+';
}

/**
 * Bucket response time
 */
export function bucketResponseTime(ms: number): string {
  if (ms < 100) return 'latency_0-100ms';
  if (ms < 500) return 'latency_100-500ms';
  if (ms < 1000) return 'latency_500ms-1s';
  if (ms < 5000) return 'latency_1-5s';
  return 'latency_5s+';
}

/**
 * Bucket error codes
 */
export function bucketErrorCode(code: number): string {
  if (code >= 400 && code < 500) return 'error_4xx';
  if (code >= 500) return 'error_5xx';
  return 'error_other';
}

