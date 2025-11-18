import { Router } from 'express';

const router: Router = Router();

// SLA service is optional
let slaService: any = null;
try {
  const slaModule = require('../services/SLAService');
  slaService = slaModule.slaService;
} catch {
  console.warn("[SLA Router] SLA service not available");
}

// Get SLA status and metrics
router.get('/api/sla/status', (req, res) => {
  try {
    const status = slaService.getSLAStatus();
    res.json(status);
  } catch (error: any) {
    console.error('📊 [SLA] Status endpoint error:', error.message);
    res.status(500).json({ error: 'Failed to get SLA status' });
  }
});

// Get SLA configuration
router.get('/api/sla/config', (req, res) => {
  try {
    const config = slaService.getConfiguration();
    res.json({
      ok: true,
      config,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('📊 [SLA] Config endpoint error:', error.message);
    res.status(500).json({ error: 'Failed to get SLA configuration' });
  }
});

// Record a custom metric (for testing or manual monitoring)
router.post('/api/sla/metric', (req, res) => {
  if (!slaService) {
    return res.status(503).json({ error: "SLA service not available" });
  }
  try {
    const { metric_name, value, unit } = req.body;
    
    if (!metric_name || value === undefined) {
      return res.status(400).json({ error: 'Missing required fields: metric_name and value' });
    }

    slaService.recordMetric(metric_name, parseFloat(value), unit || '');
    
    res.json({
      ok: true,
      recorded: { metric_name, value, unit },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('📊 [SLA] Metric recording error:', error.message);
    res.status(500).json({ error: 'Failed to record metric' });
  }
});

// Acknowledge an alert
router.post('/api/sla/acknowledge', (req, res) => {
  if (!slaService) {
    return res.status(503).json({ error: "SLA service not available" });
  }
  try {
    const { alert_id } = req.body;
    
    if (!alert_id) {
      return res.status(400).json({ error: 'Missing required field: alert_id' });
    }

    const acknowledged = slaService.acknowledgeAlert(alert_id);
    
    if (acknowledged) {
      res.json({
        ok: true,
        alert_id,
        status: 'acknowledged',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(404).json({ error: 'Alert not found' });
    }
  } catch (error: any) {
    console.error('📊 [SLA] Acknowledge error:', error.message);
    res.status(500).json({ error: 'Failed to acknowledge alert' });
  }
});

// Simulate a failure (admin protected, for testing)
router.post('/api/sla/simulate', (req, res) => {
  if (!slaService) {
    return res.status(503).json({ error: "SLA service not available" });
  }
  try {
    const adminToken = req.headers['x-admin-token'] as string;
    
    if (!adminToken || adminToken !== (process.env.ADMIN_TOKEN || 'dreamnet_admin_2025')) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { metric_name, value } = req.body;
    
    if (!metric_name || value === undefined) {
      return res.status(400).json({ error: 'Missing required fields: metric_name and value' });
    }

    slaService.simulateFailure(metric_name, parseFloat(value));
    
    console.log(`🧪 [SLA] Admin simulated failure: ${metric_name} = ${value}`);
    
    res.json({
      ok: true,
      simulated: { metric_name, value },
      message: 'Failure simulation triggered',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('📊 [SLA] Simulation error:', error.message);
    res.status(500).json({ error: 'Failed to simulate failure' });
  }
});

export default router;