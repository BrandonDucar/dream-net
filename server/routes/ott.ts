import { Router } from 'express';
import { ottService } from '../services/OTTService';
import { auditTrail } from '../services/AuditTrailService';

const router = Router();

// ==================== OTT PUBLISHING ENDPOINTS ====================
// Over-The-Top media publishing and analytics system

// Publish content to OTT platforms
router.post('/api/ott/publish', async (req, res) => {
  try {
    const clientId = req.headers['x-client-id'] as string || 'unknown';
    const publishRequest = req.body;

    // Validate request
    if (!publishRequest || typeof publishRequest !== 'object') {
      return res.status(400).json({ 
        error: 'Invalid request body',
        required: ['asset_id', 'channel']
      });
    }

    const result = await ottService.publish(publishRequest, clientId);
    
    res.json(result);

  } catch (error: any) {
    console.error('📺 [OTT] Publish endpoint error:', error.message);
    res.status(400).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Record OTT metrics and analytics
router.post('/api/ott/metrics', async (req, res) => {
  try {
    const clientId = req.headers['x-client-id'] as string || 'unknown';
    const metricData = req.body;

    // Validate request
    if (!metricData || typeof metricData !== 'object') {
      return res.status(400).json({ 
        error: 'Invalid request body',
        required: ['event', 'asset_id', 'ts']
      });
    }

    const result = await ottService.recordMetric(metricData, clientId);
    
    res.json(result);

  } catch (error: any) {
    console.error('📺 [OTT] Metrics endpoint error:', error.message);
    res.status(400).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get OTT configuration
router.get('/api/ott/config', (req, res) => {
  try {
    const config = ottService.getConfig();
    
    res.json({
      ok: true,
      config,
      supported_events: ['playback_start', 'complete', 'dwell'],
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('📺 [OTT] Config endpoint error:', error.message);
    res.status(500).json({ error: 'Failed to get OTT configuration' });
  }
});

// Get OTT analytics and statistics
router.get('/api/ott/stats', async (req, res) => {
  try {
    const stats = await ottService.getStats();
    
    res.json({
      ok: true,
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('📺 [OTT] Stats endpoint error:', error.message);
    res.status(500).json({ error: 'Failed to get OTT statistics' });
  }
});

// Cleanup old OTT events (admin protected)
router.post('/api/ott/cleanup', (req, res) => {
  try {
    const adminToken = req.headers['x-admin-token'] as string;
    
    if (!adminToken || adminToken !== (process.env.ADMIN_TOKEN || 'dreamnet_admin_2025')) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const retentionDays = req.body?.retention_days || 30;
    const cleanedCount = ottService.cleanup(retentionDays);
    
    console.log(`📺 [OTT] Manual cleanup performed by admin - ${cleanedCount} events removed`);
    
    res.json({
      ok: true,
      cleaned_events: cleanedCount,
      retention_days: retentionDays,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('📺 [OTT] Cleanup endpoint error:', error.message);
    res.status(500).json({ error: 'Failed to cleanup OTT events' });
  }
});

// Desktop application update information endpoint
router.get('/api/desktop/update/info', (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    res.json({
      latest: "1.0.0",
      notes: "Initial GA",
      url: `${baseUrl}/downloads/desktop/dreamnet-1.0.0.exe`
    });
    
    console.log('🖥️ [Desktop] Update info requested - serving v1.0.0 download URL');
    
  } catch (error: any) {
    console.error('🖥️ [Desktop] Update info error:', error.message);
    res.status(500).json({ error: 'Failed to get desktop update info' });
  }
});

export default router;