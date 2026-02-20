import express, { Request, Response } from 'express';
import Redis from 'ioredis';
import * as prometheus from 'prom-client';
import axios from 'axios';

const app = express();
const redis = new Redis(process.env.REDIS_URL || 'redis://nerve:6379');
const PORT = process.env.PORT || 7011;

// Prometheus metrics
const agentHealthGauge = new prometheus.Gauge({
  name: 'dreamnet_agent_health',
  help: 'Health status of each agent (1=healthy, 0=unhealthy)',
  labelNames: ['agentId', 'agentName', 'type']
});

const agentHeartbeatCounter = new prometheus.Counter({
  name: 'dreamnet_agent_heartbeats_total',
  help: 'Total heartbeats received from agents',
  labelNames: ['agentId']
});

const agentTasksCompleted = new prometheus.Counter({
  name: 'dreamnet_agent_tasks_completed_total',
  help: 'Total tasks completed by each agent',
  labelNames: ['agentId', 'type']
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'agent-health-monitor',
    uptime: process.uptime()
  });
});

// Prometheus metrics endpoint
app.get('/metrics', async (req: Request, res: Response) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});

// Register agent health check
app.post('/agents/:agentId/health', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const { status, metrics } = req.body;

    console.log(`💓 [Health] Agent ${agentId}: ${status}`);

    // Update Redis
    await redis.hset(
      `agent:health:${agentId}`,
      'status', status,
      'lastHeartbeat', new Date().toISOString(),
      'metrics', JSON.stringify(metrics)
    );

    // Update Prometheus
    agentHealthGauge.set({ agentId }, status === 'healthy' ? 1 : 0);
    agentHeartbeatCounter.inc({ agentId });

    // Check for alerts
    if (status !== 'healthy') {
      await triggerAlert(agentId, status);
    }

    res.json({ received: true, timestamp: new Date().toISOString() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent health
app.get('/agents/:agentId/health', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const health = await redis.hgetall(`agent:health:${agentId}`);

    if (!health.status) {
      return res.status(404).json({ error: 'No health data for agent' });
    }

    res.json({
      agentId,
      ...health,
      metrics: JSON.parse(health.metrics || '{}')
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get swarm health summary
app.get('/swarm/health', async (req: Request, res: Response) => {
  try {
    const keys = await redis.keys('agent:health:*');
    const agents = [];

    let healthy = 0;
    let unhealthy = 0;

    for (const key of keys) {
      const health = await redis.hgetall(key);
      agents.push(health);

      if (health.status === 'healthy') healthy++;
      else unhealthy++;
    }

    res.json({
      totalAgents: agents.length,
      healthy,
      unhealthy,
      healthRate: agents.length > 0 ? (healthy / agents.length * 100).toFixed(2) + '%' : 'N/A',
      agents
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Record task completion
app.post('/agents/:agentId/task-completed', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const { taskId, result } = req.body;

    agentTasksCompleted.inc({ agentId });

    console.log(`✅ [Task] Agent ${agentId} completed task ${taskId}`);

    res.json({ recorded: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

async function triggerAlert(agentId: string, status: string) {
  try {
    console.log(`🚨 [Alert] Agent ${agentId} is ${status}`);

    // Store alert in Redis
    await redis.lpush(
      'alerts',
      JSON.stringify({
        agentId,
        status,
        timestamp: new Date().toISOString(),
        severity: status === 'dead' ? 'critical' : 'warning'
      })
    );

    // Keep last 1000 alerts
    await redis.ltrim('alerts', 0, 999);

    // TODO: Send to Slack/Discord/PagerDuty if configured
  } catch (error: any) {
    console.error(`❌ [Alert] Error triggering alert:`, error.message);
  }
}

// Monitoring loop - check agent heartbeats
setInterval(async () => {
  try {
    const keys = await redis.keys('agent:health:*');

    for (const key of keys) {
      const health = await redis.hgetall(key);
      const lastHeartbeat = new Date(health.lastHeartbeat || 0).getTime();
      const now = Date.now();
      const agentId = key.replace('agent:health:', '');

      // If no heartbeat for 60 seconds, mark unhealthy
      if (now - lastHeartbeat > 60000) {
        console.warn(`⚠️ [Monitor] No heartbeat from ${agentId} for 60s`);
        await triggerAlert(agentId, 'no-heartbeat');
      }
    }
  } catch (error) {
    console.error('Monitor loop error:', error);
  }
}, 30000); // Check every 30 seconds

// Start server
app.listen(PORT, () => {
  console.log(`🚀 [Agent Health Monitor] Online on port ${PORT}`);
  console.log(`🚀 POST /agents/:agentId/health - Record agent health`);
  console.log(`🚀 GET /swarm/health - Get swarm health summary`);
  console.log(`🚀 GET /metrics - Prometheus metrics`);
});

export default app;
