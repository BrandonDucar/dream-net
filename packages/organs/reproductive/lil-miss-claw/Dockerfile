FROM node:20-alpine

WORKDIR /app

# Install dependencies
RUN npm install express redis axios curl

# Create the application
RUN cat > index.js << 'EOF'
const express = require('express');
const redis = require('redis');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 7005;

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

const agent = {
  id: process.env.AGENT_ID || 'lil-miss-claw',
  name: process.env.AGENT_NAME || 'Lil Miss Claw',
  role: 'designer',
  port: port,
  capabilities: ['design', 'treasury', 'branding', 'creative', 'financial'],
  status: 'ready'
};

redisClient.on('error', (err) => console.log('Redis Error', err));
redisClient.connect().catch(console.error);

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', agent: agent.id });
});

app.get('/status', (req, res) => {
  res.json({ agent, uptime: process.uptime(), timestamp: new Date().toISOString() });
});

async function registerWithAntigravity() {
  try {
    const url = process.env.ANTIGRAVITY_URL || 'http://antigravity:7003';
    await axios.post(`${url}/agents/register`, {
      id: agent.id,
      name: agent.name,
      role: agent.role,
      port: port,
      capabilities: agent.capabilities,
      url: `http://lil-miss-claw:${port}`
    });
    console.log(`✅ ${agent.name} registered with Antigravity`);
  } catch (error) {
    console.error(`⚠️ Failed to register:`, error.message);
    setTimeout(registerWithAntigravity, 5000);
  }
}

async function sendHeartbeat() {
  try {
    const url = process.env.ANTIGRAVITY_URL || 'http://antigravity:7003';
    await axios.post(`${url}/agents/${agent.id}/heartbeat`, {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    // Silent
  }
}

app.post('/tasks/design', async (req, res) => {
  const { taskId, design_type, parameters } = req.body;
  const result = { taskId, status: 'completed', result: { design_type, parameters, timestamp: new Date().toISOString() } };
  await redisClient.hSet(`task:${taskId}`, 'result', JSON.stringify(result));
  res.json(result);
});

app.post('/tasks/treasury', async (req, res) => {
  const { taskId, operation, amount } = req.body;
  const result = { taskId, status: 'completed', result: { operation, amount, timestamp: new Date().toISOString() } };
  await redisClient.hSet(`task:${taskId}`, 'result', JSON.stringify(result));
  res.json(result);
});

app.get('/tasks/:taskId', async (req, res) => {
  const taskData = await redisClient.hGetAll(`task:${req.params.taskId}`);
  res.json(taskData || { error: 'Task not found' });
});

app.listen(port, () => {
  console.log(`\n🎨 ${agent.name} running on port ${port}`);
  console.log(`📡 Capabilities: ${agent.capabilities.join(', ')}`);
  registerWithAntigravity();
  setInterval(sendHeartbeat, process.env.HEARTBEAT_INTERVAL || 30000);
});

process.on('SIGTERM', async () => {
  console.log(`\n👋 ${agent.name} shutting down...`);
  await redisClient.quit();
  process.exit(0);
});
EOF

# Expose port
EXPOSE 7005

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=10s \
  CMD wget --quiet --tries=1 --spider http://localhost:7005/health || exit 1

# Start the application
CMD ["node", "index.js"]
