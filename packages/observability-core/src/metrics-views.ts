/**
 * Metric Views and Aggregations
 * 
 * Defines views for p95/p99 latency and other aggregations.
 */

import { View } from '@opentelemetry/sdk-metrics';

/**
 * Create p95/p99 latency view
 */
export function createLatencyView(metricName: string): View {
  return {
    name: `${metricName}_p95_p99`,
    description: `p95 and p99 latency for ${metricName}`,
    instrumentName: metricName,
    aggregation: {
      // Histogram aggregation with p95/p99
    },
  };
}

/**
 * Standard metric views for DreamNet
 */
export const dreamnetViews: View[] = [
  {
    name: 'dreamnet_api_latency_p95_p99',
    description: 'p95 and p99 latency for API endpoints',
    instrumentName: 'custom.googleapis.com/dreamnet/api_latency',
    // Aggregation configured in SDK
  },
];

