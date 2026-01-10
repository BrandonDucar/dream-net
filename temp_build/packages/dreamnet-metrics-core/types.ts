/**
 * DreamNet Metrics Core Types
 * Performance monitoring and metrics collection
 */

export interface RequestMetric {
  traceId: string;
  method: string;
  path: string;
  clusterId?: string;
  statusCode: number;
  latencyMs: number;
  timestamp: number;
  error?: string;
}

export interface ClusterMetrics {
  clusterId: string;
  requestCount: number;
  errorCount: number;
  averageLatency: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  requestsPerSecond: number;
  errorsPerSecond: number;
  lastUpdatedAt: number;
}

export interface PerformanceSnapshot {
  timestamp: number;
  clusters: Record<string, ClusterMetrics>;
  global: {
    totalRequests: number;
    totalErrors: number;
    averageLatency: number;
    requestsPerSecond: number;
  };
}

export interface MetricQuery {
  clusterId?: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

