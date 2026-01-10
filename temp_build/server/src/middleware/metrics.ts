/**
 * Metrics Collection Middleware
 * Tracks golden signals: Traffic, Errors, Latency, Saturation
 */

import { Request, Response, NextFunction } from 'express';

interface MetricsStore {
    requests: {
        total: number;
        byEndpoint: Record<string, number>;
    };
    errors: {
        total: number;
        byEndpoint: Record<string, number>;
    };
    latency: {
        samples: number[]; // Keep last 1000 samples for p95 calculation
    };
    startTime: number;
}

const metrics: MetricsStore = {
    requests: { total: 0, byEndpoint: {} },
    errors: { total: 0, byEndpoint: {} },
    latency: { samples: [] },
    startTime: Date.now()
};

// Middleware to track metrics
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const endpoint = req.path;

    // Track request
    metrics.requests.total++;
    metrics.requests.byEndpoint[endpoint] = (metrics.requests.byEndpoint[endpoint] || 0) + 1;

    // Intercept response finish to track latency and errors
    res.on('finish', () => {
        const duration = Date.now() - start;

        // Track latency (keep last 1000 samples)
        metrics.latency.samples.push(duration);
        if (metrics.latency.samples.length > 1000) {
            metrics.latency.samples.shift();
        }

        // Track errors
        if (res.statusCode >= 400) {
            metrics.errors.total++;
            metrics.errors.byEndpoint[endpoint] = (metrics.errors.byEndpoint[endpoint] || 0) + 1;
        }
    });

    next();
};

// Helper to calculate percentiles
function getPercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
}

// Helper to get raw metrics data
export const getMetricsStore = () => metrics;

// Endpoint handler to expose metrics
export const getMetrics = (req: Request, res: Response) => {
    const uptime = (Date.now() - metrics.startTime) / 1000;
    const p50 = getPercentile(metrics.latency.samples, 50);
    const p95 = getPercentile(metrics.latency.samples, 95);
    const p99 = getPercentile(metrics.latency.samples, 99);

    res.json({
        uptime,
        traffic: {
            total_requests: metrics.requests.total,
            rps: metrics.requests.total / uptime,
            by_endpoint: metrics.requests.byEndpoint
        },
        errors: {
            total_errors: metrics.errors.total,
            error_rate: metrics.requests.total > 0 ? metrics.errors.total / metrics.requests.total : 0,
            by_endpoint: metrics.errors.byEndpoint
        },
        latency: {
            p50,
            p95,
            p99,
            samples_count: metrics.latency.samples.length
        },
        saturation: {
            memory: process.memoryUsage(),
            cpu: process.cpuUsage()
        }
    });
};
