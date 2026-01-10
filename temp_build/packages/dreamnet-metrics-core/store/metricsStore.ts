/**
 * Metrics Store
 * Stores and aggregates performance metrics
 */

import type { RequestMetric, ClusterMetrics, PerformanceSnapshot } from "../types";

class MetricsStore {
  private metrics: RequestMetric[] = [];
  private maxMetrics = 10000; // Keep last 10k metrics

  recordMetric(metric: RequestMetric): void {
    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  getMetrics(clusterId?: string, startTime?: number, endTime?: number): RequestMetric[] {
    let filtered = this.metrics;

    if (clusterId) {
      filtered = filtered.filter((m) => m.clusterId === clusterId);
    }

    if (startTime) {
      filtered = filtered.filter((m) => m.timestamp >= startTime);
    }

    if (endTime) {
      filtered = filtered.filter((m) => m.timestamp <= endTime);
    }

    return filtered;
  }

  getClusterMetrics(clusterId: string, windowMs: number = 60000): ClusterMetrics {
    const now = Date.now();
    const windowStart = now - windowMs;
    const clusterMetrics = this.metrics.filter(
      (m) => m.clusterId === clusterId && m.timestamp >= windowStart
    );

    if (clusterMetrics.length === 0) {
      return {
        clusterId,
        requestCount: 0,
        errorCount: 0,
        averageLatency: 0,
        p50Latency: 0,
        p95Latency: 0,
        p99Latency: 0,
        requestsPerSecond: 0,
        errorsPerSecond: 0,
        lastUpdatedAt: now,
      };
    }

    const latencies = clusterMetrics.map((m) => m.latencyMs).sort((a, b) => a - b);
    const errors = clusterMetrics.filter((m) => m.statusCode >= 400);
    const durationSeconds = windowMs / 1000;

    return {
      clusterId,
      requestCount: clusterMetrics.length,
      errorCount: errors.length,
      averageLatency: latencies.reduce((sum, l) => sum + l, 0) / latencies.length,
      p50Latency: this.percentile(latencies, 50),
      p95Latency: this.percentile(latencies, 95),
      p99Latency: this.percentile(latencies, 99),
      requestsPerSecond: clusterMetrics.length / durationSeconds,
      errorsPerSecond: errors.length / durationSeconds,
      lastUpdatedAt: now,
    };
  }

  getPerformanceSnapshot(): PerformanceSnapshot {
    const now = Date.now();
    const windowMs = 60000; // Last minute
    const windowStart = now - windowMs;
    const recentMetrics = this.metrics.filter((m) => m.timestamp >= windowStart);

    const clusters: Record<string, ClusterMetrics> = {};
    const clusterIds = new Set(recentMetrics.map((m) => m.clusterId).filter(Boolean));

    for (const clusterId of clusterIds) {
      if (clusterId) {
        clusters[clusterId] = this.getClusterMetrics(clusterId, windowMs);
      }
    }

    const allLatencies = recentMetrics.map((m) => m.latencyMs);
    const allErrors = recentMetrics.filter((m) => m.statusCode >= 400);
    const durationSeconds = windowMs / 1000;

    return {
      timestamp: now,
      clusters,
      global: {
        totalRequests: recentMetrics.length,
        totalErrors: allErrors.length,
        averageLatency: allLatencies.length > 0 ? allLatencies.reduce((sum, l) => sum + l, 0) / allLatencies.length : 0,
        requestsPerSecond: recentMetrics.length / durationSeconds,
      },
    };
  }

  private percentile(sortedArray: number[], percentile: number): number {
    if (sortedArray.length === 0) return 0;
    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
    return sortedArray[Math.max(0, index)];
  }

  clear(): void {
    this.metrics = [];
  }
}

export const metricsStore = new MetricsStore();

