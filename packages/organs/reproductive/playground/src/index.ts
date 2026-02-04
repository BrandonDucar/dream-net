import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 7002;

// In-memory sandbox state
const sandboxes = new Map();

// Middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ALIVE', 
    service: 'Playground',
    uptime: process.uptime(),
    mode: 'experimentation',
    activeSandboxes: sandboxes.size
  });
});

// Create sandbox
app.post('/sandbox/create', (req, res) => {
  const { agentId, config } = req.body;
  const sandboxId = `sandbox_${Date.now()}`;
  
  sandboxes.set(sandboxId, {
    agentId,
    config,
    createdAt: Date.now(),
    status: 'active',
    experiments: []
  });
  
  console.log(`[Playground] Created sandbox ${sandboxId} for agent ${agentId}`);
  
  res.json({
    success: true,
    sandboxId,
    agentId,
    timestamp: Date.now()
  });
});

// Run experiment
app.post('/sandbox/:sandboxId/experiment', (req, res) => {
  const { sandboxId } = req.params;
  const { experimentType, parameters } = req.body;
  
  const sandbox = sandboxes.get(sandboxId);
  if (!sandbox) {
    return res.status(404).json({ error: 'Sandbox not found' });
  }
  
  const experimentId = `exp_${Date.now()}`;
  const experiment = {
    id: experimentId,
    type: experimentType,
    parameters,
    startTime: Date.now(),
    status: 'running'
  };
  
  sandbox.experiments.push(experiment);
  
  console.log(`[Playground] Running experiment ${experimentId} in ${sandboxId}`);
  
  res.json({
    success: true,
    experimentId,
    sandboxId,
    estimatedDuration: 5000,
    timestamp: Date.now()
  });
});

// Get sandbox status
app.get('/sandbox/:sandboxId', (req, res) => {
  const { sandboxId } = req.params;
  const sandbox = sandboxes.get(sandboxId);
  
  if (!sandbox) {
    return res.status(404).json({ error: 'Sandbox not found' });
  }
  
  res.json({
    success: true,
    sandbox,
    timestamp: Date.now()
  });
});

// List all sandboxes
app.get('/sandboxes', (req, res) => {
  const allSandboxes = Array.from(sandboxes.entries()).map(([id, data]) => ({
    id,
    ...data
  }));
  
  res.json({
    success: true,
    count: allSandboxes.length,
    sandboxes: allSandboxes,
    timestamp: Date.now()
  });
});

// Delete sandbox
app.delete('/sandbox/:sandboxId', (req, res) => {
  const { sandboxId } = req.params;
  const deleted = sandboxes.delete(sandboxId);
  
  if (deleted) {
    console.log(`[Playground] Deleted sandbox ${sandboxId}`);
    res.json({ success: true, sandboxId });
  } else {
    res.status(404).json({ error: 'Sandbox not found' });
  }
});

// WebSocket for real-time experiment updates
wss.on('connection', (ws) => {
  console.log('[Playground] New experiment connection');
  
  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    console.log('[Playground] Received:', msg);
    
    // Echo back with experiment results
    ws.send(JSON.stringify({
      type: 'experiment_update',
      experimentId: msg.experimentId,
      progress: Math.random() * 100,
      results: {
        success: Math.random() > 0.2,
        metrics: {
          performance: Math.random(),
          accuracy: Math.random(),
          resourceUsage: Math.random()
        }
      },
      timestamp: Date.now()
    }));
  });
  
  ws.on('close', () => {
    console.log('[Playground] Experiment connection closed');
  });
});

server.listen(PORT, () => {
  console.log(`🧪 [Playground] Experimentation environment active on port ${PORT}`);
  console.log(`   - Create Sandbox: http://localhost:${PORT}/sandbox/create`);
  console.log(`   - Run Experiment: http://localhost:${PORT}/sandbox/:id/experiment`);
  console.log(`   - WebSocket: ws://localhost:${PORT}`);
});
