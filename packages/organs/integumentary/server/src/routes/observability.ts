/**
 * Observability Routes
 * Exposes system metrics for the Ops Dashboard
 */

import { Router } from 'express';
import { getMetricsStore } from '../middleware/metrics';
import { NERVE_BUS } from '../../spine/dreamnet-event-bus/index'; // Assuming we can import this, or mock if needed

const router = Router();

// Helper to calculate percentiles
function getPercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
}

// GET /api/observability/golden-signals
router.get('/golden-signals', (req, res) => {
    const metrics = getMetricsStore();
    const uptime = (Date.now() - metrics.startTime) / 1000;

    const p50 = getPercentile(metrics.latency.samples, 50);
    const p95 = getPercentile(metrics.latency.samples, 95);
    const p99 = getPercentile(metrics.latency.samples, 99);

    res.json({
        traffic: {
            total_requests: metrics.requests.total,
            rps: uptime > 0 ? metrics.requests.total / uptime : 0,
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
});

// GET /api/observability/watchdogs
router.get('/watchdogs', (req, res) => {
    // Mock queue depth for now since we don't have direct access to internal queue state of DreamEventBus easily
    // In a real implementation, we'd expose a method on DreamEventBus to get stats
    const queueDepth = 0; // TODO: Get from DreamEventBus

    // Mock AI latency
    const aiLatency = {
        p95: 0,
        samples: 0
    };

    res.json({
        queue_depth: queueDepth,
        ai_latency: aiLatency,
        circuit_breakers: {
            // TODO: Expose circuit breaker states
            db: 'closed',
            openai: 'closed',
            event_bus: 'closed'
        }
    });
});

export const createObservabilityRouter = () => router;
