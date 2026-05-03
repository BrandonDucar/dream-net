#!/usr/bin/env node
import http from 'http';
import redis from 'redis';

const PORT = process.env.MONITOR_PORT || 3300;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = redis.createClient({ url: REDIS_URL });
redisClient.connect().catch(console.error);

// ClawdChat metrics scraper
async function fetchClawdChatMetrics() {
  try {
    const response = await fetch('http://clawdchat-mcp:8094/metrics');
    if (!response.ok) return null;
    return await response.text();
  } catch (err) {
    console.error('[ClawdChat Scraper] Failed to fetch metrics:', err);
    return null;
  }
}

async function fetchClawdChatHealth() {
  try {
    const response = await fetch('http://clawdchat-mcp:8094/health');
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.error('[ClawdChat Scraper] Failed to fetch health:', err);
    return null;
  }
}

// Store metrics in Redis for alerting
async function storeMetricsToRedis(health: any) {
  try {
    if (!health) return;
    
    await redisClient.hSet('clawdchat:health', {
      status: health.status,
      uptime: health.uptime.toString(),
      total_requests: health.total_requests.toString(),
      successful_requests: health.successful_requests.toString(),
      failed_requests: health.failed_requests.toString(),
      success_rate: (health.success_rate || 0).toString(),
      credential_rotations: health.credential_rotations.toString(),
      timestamp: health.timestamp,
    });
    
    // Set expiry
    await redisClient.expire('clawdchat:health', 300);
  } catch (err) {
    console.error('[Metrics Store] Failed to store metrics:', err);
  }
}

// Check for alerts
async function checkAlerts(health: any) {
  const alerts: any[] = [];
  
  if (!health || health.status !== 'healthy') {
    alerts.push({
      level: 'CRITICAL',
      service: 'clawdchat-mcp',
      message: 'Service unhealthy',
      timestamp: new Date().toISOString(),
    });
  }
  
  if (health && health.success_rate < 95) {
    alerts.push({
      level: 'WARNING',
      service: 'clawdchat-mcp',
      message: `Low success rate: ${health.success_rate}%`,
      timestamp: new Date().toISOString(),
    });
  }
  
  if (health && health.failed_requests > 10) {
    alerts.push({
      level: 'WARNING',
      service: 'clawdchat-mcp',
      message: `High failure count: ${health.failed_requests}`,
      timestamp: new Date().toISOString(),
    });
  }
  
  if (alerts.length > 0) {
    for (const alert of alerts) {
      await redisClient.lPush('clawdchat:alerts', JSON.stringify(alert));
      console.log(`🚨 [Alert] ${alert.level}: ${alert.message}`);
    }
    await redisClient.lTrim('clawdchat:alerts', 0, 99);
  }
}

// Start periodic scraping
setInterval(async () => {
  const health = await fetchClawdChatHealth();
  await storeMetricsToRedis(health);
  await checkAlerts(health);
}, 30000); // Every 30 seconds

// HTTP Server
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', service: 'dream-monitor' }));
  } else if (req.url === '/clawdchat/health') {
    const health = await fetchClawdChatHealth();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(health || { error: 'unavailable' }));
  } else if (req.url === '/clawdchat/metrics') {
    const metrics = await fetchClawdChatMetrics();
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(metrics || '# Metrics unavailable');
  } else if (req.url === '/clawdchat/alerts') {
    const alerts = await redisClient.lRange('clawdchat:alerts', 0, 9);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(alerts.map(a => JSON.parse(a))));
  } else if (req.url === '/clawdchat/credential-audit') {
    const audit = await redisClient.lRange('clawdchat:credential:audit', 0, 49);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(audit.map(a => JSON.parse(a))));
  } else if (req.url === '/clawdchat/credential-stats') {
    const stats = await redisClient.hGetAll('clawdchat:credential:stats');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stats));
  } else if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>DreamNet Monitor - ClawdChat</title>
        <style>
          body { font-family: monospace; background: #000; color: #0f0; padding: 20px; }
          .endpoint { margin: 10px 0; padding: 10px; background: #111; border-left: 3px solid #0f0; }
          a { color: #0f0; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>🦀 DreamNet Monitor</h1>
        <h2>ClawdChat MCP Endpoints</h2>
        <div class="endpoint"><a href="/clawdchat/health">/clawdchat/health</a> - Service health status</div>
        <div class="endpoint"><a href="/clawdchat/metrics">/clawdchat/metrics</a> - Prometheus metrics</div>
        <div class="endpoint"><a href="/clawdchat/alerts">/clawdchat/alerts</a> - Recent alerts</div>
        <div class="endpoint"><a href="/clawdchat/credential-audit">/clawdchat/credential-audit</a> - Credential rotation audit trail</div>
        <div class="endpoint"><a href="/clawdchat/credential-stats">/clawdchat/credential-stats</a> - Credential usage stats</div>
        <h2>Status</h2>
        <p>Monitor scraping: Active (30s interval)</p>
        <p>Alert threshold: Success rate < 95% or > 10 failures</p>
      </body>
      </html>
    `);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`📊 DreamNet Monitor running on http://0.0.0.0:${PORT}`);
  console.log(`   ClawdChat Health: http://localhost:${PORT}/clawdchat/health`);
  console.log(`   ClawdChat Metrics: http://localhost:${PORT}/clawdchat/metrics`);
  console.log(`   ClawdChat Alerts: http://localhost:${PORT}/clawdchat/alerts`);
  console.log(`   Credential Audit: http://localhost:${PORT}/clawdchat/credential-audit`);
  console.log(`   Credential Stats: http://localhost:${PORT}/clawdchat/credential-stats`);
});

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down DreamNet Monitor');
  redisClient.quit();
  server.close();
});
