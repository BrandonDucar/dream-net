/**
 * Metrics Collection Middleware
 * 
 * Tracks golden signals: Traffic, Errors, Latency, Saturation
 */

import { Request, Response, NextFunction } from 'express';

interface RequestMetrics {
  count: number;
  errors: {
    total: number;
    status4xx: number;
    status5xx: number;
  };
  latency: number[]; // Samples for p50/p95/p99 calculation
  startTime: number;
  // Time-windowed tracking for better RPS calculation
  recentRequests: Array<{ timestamp: number }>;
}

// In-memory metrics store (per endpoint)
const metrics = new Map<string, RequestMetrics>();

// Keep only last 10,000 samples per endpoint
const MAX_SAMPLES = 10000;

/**
 * Initialize metrics for an endpoint
 */
function initMetrics(endpoint: string): RequestMetrics {
  return {
    count: 0,
    errors: {
      total: 0,
      status4xx: 0,
      status5xx: 0,
    },
    latency: [],
    startTime: Date.now(),
    recentRequests: [],
  };
}

/**
 * Get metrics for an endpoint
 */
function getMetrics(endpoint: string): RequestMetrics {
  if (!metrics.has(endpoint)) {
    metrics.set(endpoint, initMetrics(endpoint));
  }
  return metrics.get(endpoint)!;
}

/**
 * Calculate percentile from sorted array
 */
function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const index = Math.floor(sorted.length * p);
  return sorted[Math.min(index, sorted.length - 1)];
}

/**
 * Clean up old request timestamps (keep last 60 seconds)
 */
function cleanupOldRequests(endpointMetrics: RequestMetrics): void {
  const now = Date.now();
  const cutoff = now - 60000; // 60 seconds ago
  
  endpointMetrics.recentRequests = endpointMetrics.recentRequests.filter(
    req => req.timestamp > cutoff
  );
}

/**
 * Metrics collection middleware
 */
export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const endpoint = req.path || req.url;
  const startTime = Date.now();
  
  // Track response
  res.on('finish', () => {
    const latency = Date.now() - startTime;
    const endpointMetrics = getMetrics(endpoint);
    const now = Date.now();
    
    endpointMetrics.count++;
    
    // Track request timestamp for RPS calculation
    endpointMetrics.recentRequests.push({ timestamp: now });
    cleanupOldRequests(endpointMetrics);
    
    // Track errors
    if (res.statusCode >= 400) {
      endpointMetrics.errors.total++;
      if (res.statusCode >= 400 && res.statusCode < 500) {
        endpointMetrics.errors.status4xx++;
      } else if (res.statusCode >= 500) {
        endpointMetrics.errors.status5xx++;
      }
    }
    
    // Track latency
    endpointMetrics.latency.push(latency);
    
    // Keep only last N samples
    if (endpointMetrics.latency.length > MAX_SAMPLES) {
      endpointMetrics.latency.shift();
    }
  });
  
  next();
}

/**
 * Get golden signals for all endpoints
 */
export function getGoldenSignals(): {
  traffic: {
    requestsPerSecond: number;
    activeConnections: number;
    timestamp: number;
  };
  errors: {
    errorRate: number;
    status4xx: number;
    status5xx: number;
    timestamp: number;
  };
  latency: {
    p50: number;
    p95: number;
    p99: number;
    timestamp: number;
  };
  saturation: {
    cpu: NodeJS.CpuUsage;
    memory: NodeJS.MemoryUsage;
    queueDepth: number;
    timestamp: number;
  };
} {
  // Aggregate all endpoints
  let totalRequests = 0;
  let totalErrors = 0;
  let total4xx = 0;
  let total5xx = 0;
  const allLatencies: number[] = [];
  
  for (const [endpoint, endpointMetrics] of metrics.entries()) {
    totalRequests += endpointMetrics.count;
    totalErrors += endpointMetrics.errors.total;
    total4xx += endpointMetrics.errors.status4xx;
    total5xx += endpointMetrics.errors.status5xx;
    allLatencies.push(...endpointMetrics.latency);
  }
  
  // Calculate requests per second (last 60 seconds) - improved calculation
  const now = Date.now();
  const windowStart = now - 60000; // 60 seconds ago
  
  // Count requests in the last 60 seconds across all endpoints
  let requestsInWindow = 0;
  for (const endpointMetrics of metrics.values()) {
    cleanupOldRequests(endpointMetrics);
    requestsInWindow += endpointMetrics.recentRequests.length;
  }
  
  const requestsPerSecond = requestsInWindow / 60; // Actual RPS based on time window
  
  // Calculate error rate
  const errorRate = totalRequests > 0 ? totalErrors / totalRequests : 0;
  
  // Calculate latency percentiles
  const sortedLatencies = [...allLatencies].sort((a, b) => a - b);
  const p50 = percentile(sortedLatencies, 0.5);
  const p95 = percentile(sortedLatencies, 0.95);
  const p99 = percentile(sortedLatencies, 0.99);
  
  return {
    traffic: {
      requestsPerSecond,
      activeConnections: 0, // TODO: Track active connections
      timestamp: now,
    },
    errors: {
      errorRate,
      status4xx: total4xx,
      status5xx: total5xx,
      timestamp: now,
    },
    latency: {
      p50,
      p95,
      p99,
      timestamp: now,
    },
    saturation: {
      cpu: process.cpuUsage(),
      memory: process.memoryUsage(),
      queueDepth: 0, // TODO: Get from event bus
      timestamp: now,
    },
  };
}

/**
 * Get metrics for a specific endpoint
 */
export function getEndpointMetrics(endpoint: string): {
  count: number;
  errorRate: number;
  status4xx: number;
  status5xx: number;
  p50: number;
  p95: number;
  p99: number;
} | null {
  const endpointMetrics = metrics.get(endpoint);
  if (!endpointMetrics || endpointMetrics.count === 0) {
    return null;
  }
  
  const sortedLatencies = [...endpointMetrics.latency].sort((a, b) => a - b);
  const errorRate = endpointMetrics.count > 0 
    ? endpointMetrics.errors.total / endpointMetrics.count 
    : 0;
  
  return {
    count: endpointMetrics.count,
    errorRate,
    status4xx: endpointMetrics.errors.status4xx,
    status5xx: endpointMetrics.errors.status5xx,
    p50: percentile(sortedLatencies, 0.5),
    p95: percentile(sortedLatencies, 0.95),
    p99: percentile(sortedLatencies, 0.99),
  };
}

/**
 * Reset metrics (useful for testing)
 */
export function resetMetrics(): void {
  metrics.clear();
}

