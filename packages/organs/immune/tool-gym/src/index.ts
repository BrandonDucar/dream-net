import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 7001;

// Middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ALIVE', 
    service: 'ToolGym',
    uptime: process.uptime(),
    mode: 'training'
  });
});

// Benchmark endpoint
app.post('/benchmark', (req, res) => {
  const { agentId, task } = req.body;
  console.log(`[ToolGym] Benchmarking agent ${agentId} on task: ${task}`);
  
  res.json({
    success: true,
    agentId,
    task,
    score: Math.random() * 100,
    latency: Math.random() * 1000,
    timestamp: Date.now()
  });
});

// Training endpoint
app.post('/train', (req, res) => {
  const { agentId, curriculum } = req.body;
  console.log(`[ToolGym] Training agent ${agentId} with curriculum: ${curriculum}`);
  
  res.json({
    success: true,
    agentId,
    curriculum,
    progress: 0,
    estimatedTime: 3600,
    timestamp: Date.now()
  });
});

// WebSocket for real-time training updates
wss.on('connection', (ws) => {
  console.log('[ToolGym] New training session connected');
  
  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    console.log('[ToolGym] Received:', msg);
    
    // Echo back with training metrics
    ws.send(JSON.stringify({
      type: 'training_update',
      progress: Math.random() * 100,
      metrics: {
        accuracy: Math.random(),
        speed: Math.random() * 1000,
        resourceUsage: Math.random()
      },
      timestamp: Date.now()
    }));
  });
  
  ws.on('close', () => {
    console.log('[ToolGym] Training session ended');
  });
});

server.listen(PORT, () => {
  console.log(`🏋️ [ToolGym] Training environment active on port ${PORT}`);
  console.log(`   - Benchmarking: http://localhost:${PORT}/benchmark`);
  console.log(`   - Training: http://localhost:${PORT}/train`);
  console.log(`   - WebSocket: ws://localhost:${PORT}`);
});
