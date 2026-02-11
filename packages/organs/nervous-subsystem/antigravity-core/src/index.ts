import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 7003;

// Swarm state
const swarmState = {
  agents: new Map(),
  tasks: new Map(),
  metrics: {
    totalAgents: 0,
    activeAgents: 0,
    completedTasks: 0,
    failedTasks: 0
  }
};

// Middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ALIVE',
    service: 'Antigravity',
    uptime: process.uptime(),
    mode: 'orchestration',
    swarm: {
      totalAgents: swarmState.agents.size,
      activeTasks: swarmState.tasks.size,
      metrics: swarmState.metrics
    }
  });
});

// Register agent
app.post('/agent/register', (req, res) => {
  const { agentId, capabilities, metadata } = req.body;

  swarmState.agents.set(agentId, {
    id: agentId,
    capabilities,
    metadata,
    status: 'ready',
    tasks: [],
    registeredAt: Date.now(),
    lastHeartbeat: Date.now()
  });

  swarmState.metrics.totalAgents = swarmState.agents.size;
  swarmState.metrics.activeAgents += 1;

  console.log(`[Antigravity] Registered agent ${agentId} with capabilities:`, capabilities);

  res.json({
    success: true,
    agentId,
    swarmSize: swarmState.agents.size,
    timestamp: Date.now()
  });
});

// Agent heartbeat
app.post('/agent/:agentId/heartbeat', (req, res) => {
  const { agentId } = req.params;
  const agent = swarmState.agents.get(agentId);

  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  agent.lastHeartbeat = Date.now();
  agent.status = 'ready';

  res.json({
    success: true,
    agentId,
    timestamp: Date.now()
  });
});

// Assign task to agent
app.post('/task/assign', (req, res) => {
  const { taskId, agentId, task } = req.body;

  const agent = swarmState.agents.get(agentId);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  const taskRecord = {
    id: taskId,
    agentId,
    task,
    status: 'assigned',
    assignedAt: Date.now()
  };

  swarmState.tasks.set(taskId, taskRecord);
  agent.tasks.push(taskId);
  agent.status = 'busy';

  console.log(`[Antigravity] Assigned task ${taskId} to agent ${agentId}`);

  res.json({
    success: true,
    taskId,
    agentId,
    timestamp: Date.now()
  });
});

// Get swarm status
app.get('/swarm/status', (req, res) => {
  const agents = Array.from(swarmState.agents.values());
  const tasks = Array.from(swarmState.tasks.values());

  res.json({
    success: true,
    swarm: {
      agents,
      tasks,
      metrics: swarmState.metrics
    },
    timestamp: Date.now()
  });
});

// Coordinate swarm action
app.post('/swarm/coordinate', (req, res) => {
  const { action, parameters } = req.body;

  console.log(`[Antigravity] Coordinating swarm action: ${action}`);

  // Handle high-order extraction tasks
  if (action === 'DIU_AOI_INCOMING') {
    broadcastUpdate('aoi_detected', { title: parameters.title, priority: 'HIGH' });
  }

  broadcastUpdate('swarm_action', { action, parameters });

  res.json({
    success: true,
    action,
    timestamp: Date.now()
  });
});

// WebSocket for real-time swarm coordination
wss.on('connection', (ws) => {
  console.log('[Antigravity] New swarm connection');

  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    console.log('[Antigravity] Received:', msg);

    // Broadcast swarm updates
    ws.send(JSON.stringify({
      type: 'swarm_update',
      activeAgents: swarmState.metrics.activeAgents,
      activeTasks: swarmState.tasks.size,
      metrics: swarmState.metrics,
      timestamp: Date.now()
    }));
  });

  ws.on('close', () => {
    console.log('[Antigravity] Swarm connection closed');
  });
});

server.listen(PORT, () => {
  console.log(`🌌 [Antigravity] Orchestration engine active on port ${PORT}`);
  console.log(`   - Register Agent: http://localhost:${PORT}/agent/register`);
  console.log(`   - Assign Task: http://localhost:${PORT}/task/assign`);
  console.log(`   - Swarm Status: http://localhost:${PORT}/swarm/status`);
  console.log(`   - WebSocket: ws://localhost:${PORT}`);
});
