const express = require('express');
const redis = require('redis');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 7005;

// Initialize Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Agent configuration
const agent = {
  id: process.env.AGENT_ID || 'lil-miss-claw',
  name: process.env.AGENT_NAME || 'Lil Miss Claw',
  role: 'designer',
  port: port,
  capabilities: ['design', 'treasury', 'branding', 'creative', 'financial'],
  status: 'ready'
};

// Connect to Redis
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect().catch(console.error);

// Middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', agent: agent.id });
});

// Status endpoint
app.get('/status', (req, res) => {
  res.json({
    agent: agent,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Register with Antigravity
async function registerWithAntigravity() {
  try {
    const antigravityUrl = process.env.ANTIGRAVITY_URL || 'http://antigravity:7003';
    await axios.post(`${antigravityUrl}/agents/register`, {
      id: agent.id,
      name: agent.name,
      role: agent.role,
      port: port,
      capabilities: agent.capabilities,
      url: `http://lil-miss-claw:${port}`
    });
    console.log(`✅ ${agent.name} registered with Antigravity`);
  } catch (error) {
    console.error(`⚠️ Failed to register with Antigravity:`, error.message);
    // Retry after delay
    setTimeout(registerWithAntigravity, 5000);
  }
}

// Heartbeat to Antigravity
async function sendHeartbeat() {
  try {
    const antigravityUrl = process.env.ANTIGRAVITY_URL || 'http://antigravity:7003';
    await axios.post(`${antigravityUrl}/agents/${agent.id}/heartbeat`, {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    console.error(`⚠️ Heartbeat failed:`, error.message);
  }
}

// Design task handler
app.post('/tasks/design', async (req, res) => {
  try {
    const { taskId, design_type, parameters } = req.body;
    
    // Process design task
    const result = {
      taskId,
      status: 'completed',
      result: {
        design_type,
        parameters,
        timestamp: new Date().toISOString()
      }
    };

    // Store in Redis
    await redisClient.hSet(`task:${taskId}`, 'result', JSON.stringify(result));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Treasury task handler
app.post('/tasks/treasury', async (req, res) => {
  try {
    const { taskId, operation, amount } = req.body;
    
    // Process treasury task
    const result = {
      taskId,
      status: 'completed',
      result: {
        operation,
        amount,
        timestamp: new Date().toISOString()
      }
    };

    // Store in Redis
    await redisClient.hSet(`task:${taskId}`, 'result', JSON.stringify(result));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get task
app.get('/tasks/:taskId', async (req, res) => {
  try {
    const taskData = await redisClient.hGetAll(`task:${req.params.taskId}`);
    res.json(taskData || { error: 'Task not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`\n🎨 ${agent.name} (Agent ${agent.id}) running on port ${port}`);
  console.log(`📡 Capabilities: ${agent.capabilities.join(', ')}`);
  console.log(`🌐 Role: ${agent.role}\n`);
  
  // Register and start heartbeat
  registerWithAntigravity();
  setInterval(sendHeartbeat, process.env.HEARTBEAT_INTERVAL || 30000);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log(`\n👋 ${agent.name} shutting down gracefully...`);
  await redisClient.quit();
  process.exit(0);
});
