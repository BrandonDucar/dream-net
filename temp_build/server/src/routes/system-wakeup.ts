import { Router } from 'express';

const router: Router = Router();

// System wakeup service is optional
let systemWakeupService: any = null;
try {
  const wakeupModule = require('../services/SystemWideWakeupService');
  systemWakeupService = wakeupModule.systemWakeupService;
} catch {
  console.warn("[System Wakeup Router] System wakeup service not available");
}

// Initiate system-wide wakeup
router.post('/wakeup', async (req, res) => {
  try {
    const result = await systemWakeupService.initiateSystemWideWakeup();
    res.json({
      success: true,
      message: 'System-wide wakeup initiated',
      ...result
    });
  } catch (error) {
    console.error('System wakeup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate system wakeup'
    });
  }
});

// Get system status
router.get('/status', (req, res) => {
  if (!systemWakeupService) {
    return res.status(503).json({ error: "System wakeup service not available" });
  }
  try {
    const status = systemWakeupService.getSystemStatus();
    res.json({
      success: true,
      systemStatus: status
    });
  } catch (error) {
    console.error('System status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get system status'
    });
  }
});

// Enter Sweet Spot Mode
router.post('/sweet-spot', async (req, res) => {
  if (!systemWakeupService) {
    return res.status(503).json({ error: "System wakeup service not available" });
  }
  try {
    await systemWakeupService.enterSweetSpotMode();
    res.json({
      success: true,
      message: 'Sweet Spot Lock Mode activated'
    });
  } catch (error) {
    console.error('Sweet spot mode error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to activate Sweet Spot Mode'
    });
  }
});

// System wakeup events (Server-Sent Events)
router.get('/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Listen to wakeup service events
  const eventHandlers = {
    wakeupInitiated: (data: any) => sendEvent('wakeupInitiated', data),
    sequenceStarted: (data: any) => sendEvent('sequenceStarted', data),
    sequenceCompleted: (data: any) => sendEvent('sequenceCompleted', data),
    componentWaking: (data: any) => sendEvent('componentWaking', data),
    componentActive: (data: any) => sendEvent('componentActive', data),
    integrationActivated: (data: any) => sendEvent('integrationActivated', data),
    sweetSpotOptimized: (data: any) => sendEvent('sweetSpotOptimized', data),
    sweetSpotModeActivated: (data: any) => sendEvent('sweetSpotModeActivated', data),
    systemWakeupComplete: (data: any) => sendEvent('systemWakeupComplete', data)
  };

  Object.entries(eventHandlers).forEach(([event, handler]) => {
    systemWakeupService.on(event, handler);
  });

  // Cleanup on client disconnect
  req.on('close', () => {
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      systemWakeupService.removeListener(event, handler);
    });
  });

  // Send initial status
  sendEvent('initialStatus', systemWakeupService.getSystemStatus());
});

export default router;