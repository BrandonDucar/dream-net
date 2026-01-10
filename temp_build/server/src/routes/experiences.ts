import { Router } from 'express';
import { experienceManager } from '../services/ExperienceManager';

const router = Router();

// Get overall experience status
router.get('/experiences/status', (req, res) => {
  try {
    const status = experienceManager.getExperienceStatus();
    
    res.json({
      success: true,
      status,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('🌐 [Experiences] Error getting status:', error);
    res.status(500).json({ success: false, error: 'Failed to get experience status' });
  }
});

// Web Experience Routes
router.get('/experiences/web', (req, res) => {
  try {
    const webExperience = experienceManager.getWebExperience();
    
    res.json({
      success: true,
      web_experience: webExperience,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('🌐 [Experiences] Error getting web experience:', error);
    res.status(500).json({ success: false, error: 'Failed to get web experience' });
  }
});

router.post('/experiences/web/health-check', async (req, res) => {
  try {
    const isHealthy = await experienceManager.performHealthCheck();
    const webExperience = experienceManager.getWebExperience();
    
    res.json({
      success: true,
      healthy: isHealthy,
      web_experience: webExperience,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('🌐 [Experiences] Error performing health check:', error);
    res.status(500).json({ success: false, error: 'Failed to perform health check' });
  }
});

router.put('/experiences/web/config', (req, res) => {
  try {
    const updates = req.body;
    experienceManager.updateWebConfig(updates);
    
    res.json({
      success: true,
      message: 'Web configuration updated',
      web_experience: experienceManager.getWebExperience(),
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('🌐 [Experiences] Error updating web config:', error);
    res.status(500).json({ success: false, error: 'Failed to update web configuration' });
  }
});

// OTT Experience Routes
router.get('/experiences/ott/channels', (req, res) => {
  try {
    const channels = experienceManager.getOTTChannels();
    
    res.json({
      success: true,
      channels,
      count: channels.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('📺 [Experiences] Error getting OTT channels:', error);
    res.status(500).json({ success: false, error: 'Failed to get OTT channels' });
  }
});

router.get('/experiences/ott/channels/:channelId', (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = experienceManager.getOTTChannel(channelId);
    
    if (!channel) {
      return res.status(404).json({ success: false, error: 'Channel not found' });
    }
    
    res.json({
      success: true,
      channel,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('📺 [Experiences] Error getting OTT channel:', error);
    res.status(500).json({ success: false, error: 'Failed to get OTT channel' });
  }
});

router.post('/experiences/ott/channels', (req, res) => {
  try {
    const channel = req.body;
    
    if (!channel.id || !channel.name || !channel.platform) {
      return res.status(400).json({ 
        success: false, 
        error: 'id, name, and platform are required' 
      });
    }

    experienceManager.addOTTChannel({
      ...channel,
      status: channel.status || 'active',
      content_count: channel.content_count || 0
    });
    
    res.json({
      success: true,
      message: 'OTT channel added successfully',
      channel,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('📺 [Experiences] Error adding OTT channel:', error);
    res.status(500).json({ success: false, error: 'Failed to add OTT channel' });
  }
});

router.post('/experiences/ott/publish', async (req, res) => {
  try {
    const { type, asset_id, channel_id, title, scheduled_time } = req.body;
    
    if (!type || !asset_id || !channel_id || !title) {
      return res.status(400).json({ 
        success: false, 
        error: 'type, asset_id, channel_id, and title are required' 
      });
    }

    if (type === 'scheduled' && !scheduled_time) {
      return res.status(400).json({ 
        success: false, 
        error: 'scheduled_time is required for scheduled publishing' 
      });
    }

    const publishId = await experienceManager.publishContent({
      type,
      asset_id,
      channel_id,
      title,
      scheduled_time
    });
    
    res.json({
      success: true,
      message: 'Content publishing initiated',
      publish_id: publishId,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('📺 [Experiences] Error publishing content:', error);
    res.status(500).json({ success: false, error: 'Failed to publish content' });
  }
});

router.get('/experiences/ott/publish/:publishId', (req, res) => {
  try {
    const { publishId } = req.params;
    const publishing = experienceManager.getPublishingStatus(publishId);
    
    if (!publishing) {
      return res.status(404).json({ success: false, error: 'Publishing record not found' });
    }
    
    res.json({
      success: true,
      publishing,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('📺 [Experiences] Error getting publishing status:', error);
    res.status(500).json({ success: false, error: 'Failed to get publishing status' });
  }
});

router.get('/experiences/ott/publishing', (req, res) => {
  try {
    const publishing = experienceManager.getAllPublishing();
    
    res.json({
      success: true,
      publishing,
      count: publishing.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('📺 [Experiences] Error getting all publishing:', error);
    res.status(500).json({ success: false, error: 'Failed to get publishing records' });
  }
});

// OTT Telemetry Routes
router.post('/experiences/ott/telemetry', (req, res) => {
  try {
    const telemetry = req.body;
    
    if (!telemetry.event_type || !telemetry.asset_id || !telemetry.channel_id || !telemetry.device_type) {
      return res.status(400).json({ 
        success: false, 
        error: 'event_type, asset_id, channel_id, and device_type are required' 
      });
    }

    const telemetryRecord = {
      ...telemetry,
      timestamp: telemetry.timestamp || new Date().toISOString()
    };

    experienceManager.recordTelemetry(telemetryRecord);
    
    res.json({
      success: true,
      message: 'Telemetry recorded',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('📊 [Experiences] Error recording telemetry:', error);
    res.status(500).json({ success: false, error: 'Failed to record telemetry' });
  }
});

router.get('/experiences/ott/telemetry/stats', (req, res) => {
  try {
    const { timeframe } = req.query;
    const validTimeframes = ['hour', 'day', 'week'];
    const selectedTimeframe = validTimeframes.includes(timeframe as string) 
      ? timeframe as any 
      : 'hour';
    
    const stats = experienceManager.getTelemetryStats(selectedTimeframe);
    
    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('📊 [Experiences] Error getting telemetry stats:', error);
    res.status(500).json({ success: false, error: 'Failed to get telemetry statistics' });
  }
});

// Desktop Experience Routes
router.get('/experiences/desktop/capabilities', (req, res) => {
  try {
    const capabilities = experienceManager.getDesktopCapabilities();
    
    res.json({
      success: true,
      capabilities,
      count: capabilities.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('💻 [Experiences] Error getting desktop capabilities:', error);
    res.status(500).json({ success: false, error: 'Failed to get desktop capabilities' });
  }
});

router.get('/experiences/desktop/capabilities/:platform', (req, res) => {
  try {
    const { platform } = req.params;
    
    if (!['windows', 'macos'].includes(platform)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Platform must be "windows" or "macos"' 
      });
    }

    const capability = experienceManager.getDesktopCapability(platform as any);
    
    if (!capability) {
      return res.status(404).json({ success: false, error: 'Platform capability not found' });
    }
    
    res.json({
      success: true,
      capability,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('💻 [Experiences] Error getting desktop capability:', error);
    res.status(500).json({ success: false, error: 'Failed to get desktop capability' });
  }
});

router.post('/experiences/desktop/deeplink', async (req, res) => {
  try {
    const { platform, url } = req.body;
    
    if (!platform || !url) {
      return res.status(400).json({ 
        success: false, 
        error: 'platform and url are required' 
      });
    }

    if (!['windows', 'macos'].includes(platform)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Platform must be "windows" or "macos"' 
      });
    }

    const success = await experienceManager.executeDeeplink(platform, url);
    
    res.json({
      success,
      message: success ? 'Deeplink executed successfully' : 'Deeplink execution failed',
      platform,
      url,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('💻 [Experiences] Error executing deeplink:', error);
    res.status(500).json({ success: false, error: 'Failed to execute deeplink' });
  }
});

router.post('/experiences/desktop/notification', async (req, res) => {
  try {
    const { platform, title, message, actionUrl } = req.body;
    
    if (!platform || !title || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'platform, title, and message are required' 
      });
    }

    if (!['windows', 'macos'].includes(platform)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Platform must be "windows" or "macos"' 
      });
    }

    const success = await experienceManager.sendDesktopNotification(platform, title, message, actionUrl);
    
    res.json({
      success,
      message: success ? 'Notification sent successfully' : 'Notification sending failed',
      platform,
      title,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('💻 [Experiences] Error sending notification:', error);
    res.status(500).json({ success: false, error: 'Failed to send notification' });
  }
});

router.post('/experiences/desktop/verify', async (req, res) => {
  try {
    const results = await experienceManager.verifyDesktopCapabilities();
    const capabilities = experienceManager.getDesktopCapabilities();
    
    res.json({
      success: true,
      verification_results: results,
      capabilities,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('💻 [Experiences] Error verifying capabilities:', error);
    res.status(500).json({ success: false, error: 'Failed to verify desktop capabilities' });
  }
});

export default router;