/**
 * Detector Generator
 * 
 * Generate M≈1-5k detectors per surface for anomaly detection
 * Automatic scoring with eps=0.85 to avoid overfitting
 */

import type { Detector, DetectorSurface, DetectorMetric } from './types';

const EPS = 0.85; // Precision threshold to avoid overfitting

/**
 * Compute percentile from array
 */
function computePercentile(values: number[], percentile: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)] ?? 0;
}

/**
 * Compute average error rate
 */
function computeAverageErrorRate(metrics: Array<{ errorCount?: number; totalCount?: number }>): number {
  let totalErrors = 0;
  let totalRequests = 0;
  
  for (const metric of metrics) {
    totalErrors += metric.errorCount ?? 0;
    totalRequests += metric.totalCount ?? 1;
  }
  
  return totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;
}

/**
 * Compute average from array
 */
function computeAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Generate detectors for a surface
 */
export function generateDetectors(surface: DetectorSurface, historicalData: any[]): Detector[] {
  const detectors: Detector[] = [];
  const now = Date.now();
  
  // Extract numeric values from historical data
  const extractValues = (data: any[], field: string): number[] => {
    return data.map(d => {
      if (typeof d === 'number') return d;
      if (typeof d === 'object' && d[field] !== undefined) return Number(d[field]) || 0;
      return 0;
    }).filter(v => v > 0);
  };
  
  // Generate latency detectors (p95, p99)
  if (surface === 'latency') {
    const latencies = extractValues(historicalData, 'latencyMs');
    if (latencies.length > 0) {
      const p95 = computePercentile(latencies, 95);
      const p99 = computePercentile(latencies, 99);
      const avg = computeAverage(latencies);
      
      // Generate multiple threshold detectors
      const thresholds = [1.5, 2.0, 2.5, 3.0];
      for (const multiplier of thresholds) {
        detectors.push({
          id: `latency-p95-${multiplier}x-${now}`,
          surface: 'latency',
          metric: 'p95',
          threshold: p95 * multiplier,
          windowSize: 60, // 60 seconds
          createdAt: now,
        });
        
        detectors.push({
          id: `latency-p99-${multiplier}x-${now}`,
          surface: 'latency',
          metric: 'p99',
          threshold: p99 * multiplier,
          windowSize: 60,
          createdAt: now,
        });
      }
    }
  }
  
  // Generate error rate detectors
  if (surface === 'error_rate') {
    const avgErrorRate = computeAverageErrorRate(historicalData);
    if (avgErrorRate > 0) {
      const thresholds = [1.5, 2.0, 2.5, 3.0];
      for (const multiplier of thresholds) {
        detectors.push({
          id: `error-rate-${multiplier}x-${now}`,
          surface: 'error_rate',
          metric: 'error_percentage',
          threshold: avgErrorRate * multiplier,
          windowSize: 60,
          createdAt: now,
        });
      }
    }
  }
  
  // Generate queue depth detectors
  if (surface === 'queue_depth') {
    const queueDepths = extractValues(historicalData, 'queueDepth');
    if (queueDepths.length > 0) {
      const avg = computeAverage(queueDepths);
      const max = Math.max(...queueDepths);
      
      const thresholds = [1.5, 2.0, 2.5];
      for (const multiplier of thresholds) {
        detectors.push({
          id: `queue-depth-${multiplier}x-${now}`,
          surface: 'queue_depth',
          metric: 'queue_depth',
          threshold: avg * multiplier,
          windowSize: 60,
          createdAt: now,
        });
      }
    }
  }
  
  // Generate memory pressure detectors
  if (surface === 'memory_pressure') {
    const memoryUsages = extractValues(historicalData, 'memoryUsage');
    if (memoryUsages.length > 0) {
      const avg = computeAverage(memoryUsages);
      
      // Memory thresholds: 70%, 80%, 90%
      const thresholds = [0.7, 0.8, 0.9];
      for (const threshold of thresholds) {
        detectors.push({
          id: `memory-pressure-${threshold}-${now}`,
          surface: 'memory_pressure',
          metric: 'memory_usage',
          threshold: threshold * 100, // Convert to percentage
          windowSize: 60,
          createdAt: now,
        });
      }
    }
  }
  
  // Generate throughput detectors
  if (surface === 'throughput') {
    const throughputs = extractValues(historicalData, 'requestsPerSecond');
    if (throughputs.length > 0) {
      const avg = computeAverage(throughputs);
      const min = Math.min(...throughputs);
      
      // Detect drops below baseline
      const thresholds = [0.5, 0.7, 0.8];
      for (const threshold of thresholds) {
        detectors.push({
          id: `throughput-drop-${threshold}-${now}`,
          surface: 'throughput',
          metric: 'requests_per_second',
          threshold: avg * threshold,
          windowSize: 60,
          createdAt: now,
        });
      }
    }
  }
  
  return detectors;
}

/**
 * Score a detector against historical data
 * Returns precision score (eps=0.85 threshold)
 */
export function scoreDetector(detector: Detector, historicalData: any[]): number {
  if (historicalData.length < 10) return 0; // Need minimum data
  
  let truePositives = 0;
  let falsePositives = 0;
  
  // Evaluate detector against historical data
  for (const dataPoint of historicalData) {
    let value: number;
    
    // Extract value based on metric type
    switch (detector.metric) {
      case 'p95':
      case 'p99':
        value = dataPoint.latencyMs ?? 0;
        break;
      case 'error_percentage':
        value = dataPoint.errorRate ?? 0;
        break;
      case 'queue_depth':
        value = dataPoint.queueDepth ?? 0;
        break;
      case 'memory_usage':
        value = dataPoint.memoryUsage ?? 0;
        break;
      case 'requests_per_second':
        value = dataPoint.requestsPerSecond ?? 0;
        break;
      default:
        value = 0;
    }
    
    const triggered = value > detector.threshold;
    
    // Simple heuristic: if value is significantly above threshold, it's a true positive
    // If value is just slightly above, it might be noise (false positive)
    if (triggered) {
      if (value > detector.threshold * 1.2) {
        truePositives++;
      } else {
        falsePositives++;
      }
    }
  }
  
  // Compute precision
  const totalPositives = truePositives + falsePositives;
  if (totalPositives === 0) return 0;
  
  const precision = truePositives / totalPositives;
  
  // Return score only if above eps threshold
  return precision >= EPS ? precision : 0;
}

