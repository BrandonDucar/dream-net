import { Router } from 'express';
import { eventSystem } from '../services/EventSystem';

const router = Router();

// Get events with filtering
router.get('/events', (req, res) => {
  try {
    const { type, owner, limit, since } = req.query;
    
    const filter: any = {};
    if (type) filter.type = type as string;
    if (owner) filter.owner = owner as string;
    if (limit) filter.limit = parseInt(limit as string);
    if (since) filter.since = since as string;

    const events = eventSystem.getEvents(filter);
    
    res.json({
      success: true,
      events,
      count: events.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('📧 [Events] Error getting events:', error);
    res.status(500).json({ success: false, error: 'Failed to get events' });
  }
});

// Get event statistics
router.get('/events/stats', (req, res) => {
  try {
    const stats = eventSystem.getEventStats();
    
    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('📧 [Events] Error getting stats:', error);
    res.status(500).json({ success: false, error: 'Failed to get event stats' });
  }
});

// Emit deployment success event
router.post('/events/deploy/green', (req, res) => {
  try {
    const { deployment_id, url } = req.body;
    
    if (!deployment_id || !url) {
      return res.status(400).json({ 
        success: false, 
        error: 'deployment_id and url are required' 
      });
    }

    eventSystem.emitDeployGreen(deployment_id, url);
    
    res.json({
      success: true,
      message: 'Deploy green event emitted',
      event: { deployment_id, url }
    });
  } catch (error: any) {
    console.error('📧 [Events] Error emitting deploy green:', error);
    res.status(500).json({ success: false, error: 'Failed to emit deploy green event' });
  }
});

// Emit deployment rollback event
router.post('/events/deploy/rollback', (req, res) => {
  try {
    const { deployment_id, reason, rollback_version } = req.body;
    
    if (!deployment_id || !reason) {
      return res.status(400).json({ 
        success: false, 
        error: 'deployment_id and reason are required' 
      });
    }

    eventSystem.emitDeployFailedRollback(deployment_id, reason, rollback_version);
    
    res.json({
      success: true,
      message: 'Deploy rollback event emitted',
      event: { deployment_id, reason, rollback_version }
    });
  } catch (error: any) {
    console.error('📧 [Events] Error emitting deploy rollback:', error);
    res.status(500).json({ success: false, error: 'Failed to emit deploy rollback event' });
  }
});

// Emit synthetic monitoring success
router.post('/events/synthetic/ok', (req, res) => {
  try {
    const { check_id, endpoint, response_time_ms, status_code } = req.body;
    
    if (!check_id || !endpoint || !response_time_ms || !status_code) {
      return res.status(400).json({ 
        success: false, 
        error: 'check_id, endpoint, response_time_ms, and status_code are required' 
      });
    }

    eventSystem.emitSyntheticOk(check_id, endpoint, response_time_ms, status_code);
    
    res.json({
      success: true,
      message: 'Synthetic OK event emitted',
      event: { check_id, endpoint, response_time_ms, status_code }
    });
  } catch (error: any) {
    console.error('📧 [Events] Error emitting synthetic OK:', error);
    res.status(500).json({ success: false, error: 'Failed to emit synthetic OK event' });
  }
});

// Emit lead capture event
router.post('/events/lead/captured', (req, res) => {
  try {
    const { source, lead_data, utm } = req.body;
    
    if (!source || !lead_data) {
      return res.status(400).json({ 
        success: false, 
        error: 'source and lead_data are required' 
      });
    }

    eventSystem.emitLeadCaptured(source, lead_data, utm);
    
    res.json({
      success: true,
      message: 'Lead captured event emitted',
      event: { source, lead_data, utm }
    });
  } catch (error: any) {
    console.error('📧 [Events] Error emitting lead captured:', error);
    res.status(500).json({ success: false, error: 'Failed to emit lead captured event' });
  }
});

// Emit metals price tick
router.post('/events/metals/price-tick', (req, res) => {
  try {
    const { symbol, price, change, change_percent } = req.body;
    
    if (!symbol || price === undefined || change === undefined || change_percent === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'symbol, price, change, and change_percent are required' 
      });
    }

    eventSystem.emitMetalsPriceTick(symbol, price, change, change_percent);
    
    res.json({
      success: true,
      message: 'Metals price tick event emitted',
      event: { symbol, price, change, change_percent }
    });
  } catch (error: any) {
    console.error('📧 [Events] Error emitting metals price tick:', error);
    res.status(500).json({ success: false, error: 'Failed to emit metals price tick event' });
  }
});

// Emit metals alert
router.post('/events/metals/alert', (req, res) => {
  try {
    const { symbol, rule, dir, price, threshold, user_id } = req.body;
    
    if (!symbol || !rule || !dir || price === undefined || threshold === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'symbol, rule, dir, price, and threshold are required' 
      });
    }

    if (!['up', 'down'].includes(dir)) {
      return res.status(400).json({ 
        success: false, 
        error: 'dir must be "up" or "down"' 
      });
    }

    eventSystem.emitMetalsAlert(symbol, rule, dir, price, threshold, user_id);
    
    res.json({
      success: true,
      message: 'Metals alert event emitted',
      event: { symbol, rule, dir, price, threshold, user_id }
    });
  } catch (error: any) {
    console.error('📧 [Events] Error emitting metals alert:', error);
    res.status(500).json({ success: false, error: 'Failed to emit metals alert event' });
  }
});

// Emit OTT publish event
router.post('/events/ott/publish', (req, res) => {
  try {
    const { asset_id, channel, title, duration_seconds, platforms } = req.body;
    
    if (!asset_id || !channel || !title || !duration_seconds || !Array.isArray(platforms)) {
      return res.status(400).json({ 
        success: false, 
        error: 'asset_id, channel, title, duration_seconds, and platforms array are required' 
      });
    }

    eventSystem.emitOTTPublish(asset_id, channel, title, duration_seconds, platforms);
    
    res.json({
      success: true,
      message: 'OTT publish event emitted',
      event: { asset_id, channel, title, duration_seconds, platforms }
    });
  } catch (error: any) {
    console.error('📧 [Events] Error emitting OTT publish:', error);
    res.status(500).json({ success: false, error: 'Failed to emit OTT publish event' });
  }
});

// Emit operations paused event
router.post('/events/ops/paused', (req, res) => {
  try {
    const { reason, initiated_by, affected_services, estimated_duration } = req.body;
    
    if (!reason || !initiated_by || !Array.isArray(affected_services)) {
      return res.status(400).json({ 
        success: false, 
        error: 'reason, initiated_by, and affected_services array are required' 
      });
    }

    eventSystem.emitOpsPaused(reason, initiated_by, affected_services, estimated_duration);
    
    res.json({
      success: true,
      message: 'Operations paused event emitted',
      event: { reason, initiated_by, affected_services, estimated_duration }
    });
  } catch (error: any) {
    console.error('📧 [Events] Error emitting ops paused:', error);
    res.status(500).json({ success: false, error: 'Failed to emit ops paused event' });
  }
});

// Emit operations resumed event
router.post('/events/ops/resumed', (req, res) => {
  try {
    const { initiated_by, affected_services } = req.body;
    
    if (!initiated_by || !Array.isArray(affected_services)) {
      return res.status(400).json({ 
        success: false, 
        error: 'initiated_by and affected_services array are required' 
      });
    }

    eventSystem.emitOpsResumed(initiated_by, affected_services);
    
    res.json({
      success: true,
      message: 'Operations resumed event emitted',
      event: { initiated_by, affected_services }
    });
  } catch (error: any) {
    console.error('📧 [Events] Error emitting ops resumed:', error);
    res.status(500).json({ success: false, error: 'Failed to emit ops resumed event' });
  }
});

// Get events by business owner
router.get('/events/owner/:owner', (req, res) => {
  try {
    const { owner } = req.params;
    const { limit, since } = req.query;
    
    if (!['Eric', 'Sutton', 'Dan', 'Brandon'].includes(owner)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid owner. Must be Eric, Sutton, Dan, or Brandon' 
      });
    }

    const filter: any = { owner };
    if (limit) filter.limit = parseInt(limit as string);
    if (since) filter.since = since as string;

    const events = eventSystem.getEvents(filter);
    
    res.json({
      success: true,
      owner,
      events,
      count: events.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error(`📧 [Events] Error getting events for owner:`, error);
    res.status(500).json({ success: false, error: 'Failed to get owner events' });
  }
});

// Clear all events (admin only)
router.delete('/events', (req, res) => {
  try {
    eventSystem.clearEvents();
    
    console.log('📧 [Events] All events cleared');
    
    res.json({
      success: true,
      message: 'All events cleared',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('📧 [Events] Error clearing events:', error);
    res.status(500).json({ success: false, error: 'Failed to clear events' });
  }
});

export default router;