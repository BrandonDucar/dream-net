/**
 * DreamNet Metrics Core
 * Performance monitoring and metrics collection
 */

import { metricsStore } from './store/metricsStore.js';
import type { RequestMetric, ClusterMetrics, PerformanceSnapshot, MetricQuery } from './types.js';

export const DreamNetMetricsCore = {
  recordMetric(metric: RequestMetric): void {
    metricsStore.recordMetric(metric);
  },

  getMetrics(query?: MetricQuery): RequestMetric[] {
    return metricsStore.getMetrics(query?.clusterId, query?.startTime, query?.endTime);
  },

  getClusterMetrics(clusterId: string, windowMs?: number): ClusterMetrics {
    return metricsStore.getClusterMetrics(clusterId, windowMs);
  },

  getPerformanceSnapshot(): PerformanceSnapshot {
    return metricsStore.getPerformanceSnapshot();
  },

  clear(): void {
    metricsStore.clear();
  },
};

export * from './types.js';
export default DreamNetMetricsCore;

