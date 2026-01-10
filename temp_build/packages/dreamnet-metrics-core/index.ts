/**
 * DreamNet Metrics Core
 * Performance monitoring and metrics collection
 */

import { metricsStore } from "./store/metricsStore";
import type { RequestMetric, ClusterMetrics, PerformanceSnapshot, MetricQuery } from "./types";

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

export * from "./types";
export default DreamNetMetricsCore;

