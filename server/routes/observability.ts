/**
 * Observability Routes
 * 
 * Golden signals: Traffic, Errors, Latency, Saturation
 * Watchdogs: Process health, queue depth, DLQ rate, p99 for AI calls
 */

import { Router } from 'express';
import { getCircuitBreakerRegistry } from '../core/circuit-breaker';
import { getTrafficShaping } from '../core/traffic-shaping';
import { getHealthGates } from '../core/health-gates';
import { getStartupDAG } from '../core/startup-dag';

const router = Router();

/**
 * GET /api/observability/golden-signals
 * Golden signals: Traffic, Errors, Latency, Saturation
 */
router.get('/golden-signals', async (_req, res) => {
  try {
    const { getGoldenSignals } = await import('../middleware/metrics');
    const signals = getGoldenSignals();
    
    res.json(signals);
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to get golden signals',
      message: error.message,
    });
  }
});

/**
 * GET /api/observability/watchdogs
 * Watchdogs: Process health, queue depth, DLQ rate, p99 for AI calls
 */
router.get('/watchdogs', async (_req, res) => {
  try {
    const watchdogs = {
      processHealth: {
        eventLoopDelay: 0, // TODO: Implement event loop monitoring
        heartbeat: Date.now(),
        memory: process.memoryUsage(),
        uptime: process.uptime(),
      },
      queueDepth: {
        perAgent: {}, // TODO: Get from event bus
        total: 0,
      },
      dlqRate: {
        messagesPerMinute: 0, // TODO: Get from dead letter queue
        totalMessages: 0,
      },
      aiCallLatency: {
        p99: 0, // TODO: Track OpenAI API calls
        average: 0,
        totalCalls: 0,
      },
      timestamp: Date.now(),
    };

    res.json(watchdogs);
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to get watchdogs',
      message: error.message,
    });
  }
});

/**
 * GET /api/observability/circuit-breakers
 * Circuit breaker status
 */
router.get('/circuit-breakers', (_req, res) => {
  try {
    const registry = getCircuitBreakerRegistry();
    const breakers = registry.getAll();

    res.json({
      breakers: breakers.map((b) => ({
        name: b.name,
        state: b.state,
        failureCount: b.failureCount,
      })),
      timestamp: Date.now(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to get circuit breakers',
      message: error.message,
    });
  }
});

/**
 * GET /api/observability/rollouts
 * Traffic shaping / rollout status
 */
router.get('/rollouts', (_req, res) => {
  try {
    const shaping = getTrafficShaping();
    const rollouts = shaping.getAllRollouts();

    res.json({
      rollouts,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to get rollouts',
      message: error.message,
    });
  }
});

/**
 * GET /api/observability/health-gates
 * Health gates status
 */
router.get('/health-gates', async (_req, res) => {
  try {
    const gates = getHealthGates();
    const readiness = await gates.getReadiness();

    res.json({
      ready: readiness.ready,
      criticalReady: readiness.criticalReady,
      gates: readiness.gates,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to get health gates',
      message: error.message,
    });
  }
});

/**
 * GET /api/observability/startup-dag
 * Startup DAG status
 */
router.get('/startup-dag', (_req, res) => {
  try {
    const dag = getStartupDAG();
    const status = dag.getStatus();

    res.json({
      ...status,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to get startup DAG status',
      message: error.message,
    });
  }
});

/**
 * GET /api/observability/summary
 * Complete observability summary
 */
router.get('/summary', async (_req, res) => {
  try {
    const [goldenSignals, watchdogs, circuitBreakers, rollouts, healthGates, startupDAG] =
      await Promise.all([
        fetch('/api/observability/golden-signals').then((r) => r.json()).catch(() => ({})),
        fetch('/api/observability/watchdogs').then((r) => r.json()).catch(() => ({})),
        fetch('/api/observability/circuit-breakers').then((r) => r.json()).catch(() => ({})),
        fetch('/api/observability/rollouts').then((r) => r.json()).catch(() => ({})),
        fetch('/api/observability/health-gates').then((r) => r.json()).catch(() => ({})),
        fetch('/api/observability/startup-dag').then((r) => r.json()).catch(() => ({})),
      ]);

    res.json({
      goldenSignals,
      watchdogs,
      circuitBreakers,
      rollouts,
      healthGates,
      startupDAG,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to get observability summary',
      message: error.message,
    });
  }
});

export default router;

