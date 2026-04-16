// routes/connector.ts

import express from 'express';
import { connectorBotV1, type ConnectorInput } from '../connector-export';

const router = express.Router();

// Add logging middleware for debugging
router.use((req, res, next) => {
  console.log(`[Connector-V1] ${req.method} ${req.path}`, req.body);
  next();
});

router.post('/', (req, res) => {
  const input: ConnectorInput = req.body;
  
  console.log('[Connector-V1] Processing input:', input);

  try {
    const result = connectorBotV1(input);
    console.log('[Connector-V1] Routing result:', result);
    
    return res.json({
      status: "success",
      routedTo: result.nextBot,
      instructions: result.instructions,
      fallbackOptions: result.fallbackOptions
    });
  } catch (err) {
    console.error("⚠️ ConnectorBot error:", err);
    return res.status(500).json({
      status: "error",
      message: "ConnectorBot encountered an error.",
      details: err instanceof Error ? err.message : String(err)
    });
  }
});

// Add GET endpoint for testing
router.get('/test', (req, res) => {
  res.json({
    status: "success",
    message: "Streamlined Connector V1 API is working",
    endpoints: {
      route: "POST /api/connector-v1/",
      test: "GET /api/connector-v1/test"
    }
  });
});

export default router;