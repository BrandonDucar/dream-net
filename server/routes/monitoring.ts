// Eye in the Sky - Server Routes for Video Monitoring
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'monitoring-data', 'videos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    cb(null, `${timestamp}_${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video and image files allowed'));
    }
  }
});

// Store monitoring events in memory (within sweet spot)
let monitoringEvents: any[] = [];
let monitoringStats = {
  totalVideos: 0,
  totalScreenshots: 0,
  totalEvents: 0,
  storageUsed: 0
};

// Upload video recording
router.post('/upload-video', upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const event = {
      id: `video_${Date.now()}`,
      timestamp: new Date(),
      type: 'video_upload',
      context: req.body.context || 'unknown',
      filename: req.file.filename,
      size: req.file.size,
      path: req.file.path
    };

    monitoringEvents.push(event);
    monitoringStats.totalVideos++;
    monitoringStats.totalEvents++;
    monitoringStats.storageUsed += req.file.size;

    console.log(`👁️ [EyeInTheSky] Video uploaded: ${req.file.filename}`);

    res.json({ 
      success: true, 
      eventId: event.id,
      message: 'Video uploaded successfully'
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ error: 'Video upload failed' });
  }
});

// Upload screenshot
router.post('/upload-screenshot', (req, res) => {
  try {
    const { screenshot, context, metadata } = req.body;
    
    if (!screenshot) {
      return res.status(400).json({ error: 'No screenshot data provided' });
    }

    // Save screenshot to disk
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = `screenshot_${timestamp}.jpg`;
    const screenshotDir = path.join(process.cwd(), 'monitoring-data', 'screenshots');
    
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    // Remove data URL prefix and save
    const base64Data = screenshot.replace(/^data:image\/\w+;base64,/, '');
    const filepath = path.join(screenshotDir, filename);
    fs.writeFileSync(filepath, base64Data, 'base64');

    const event = {
      id: `screenshot_${Date.now()}`,
      timestamp: new Date(),
      type: 'screenshot_upload',
      context: context || 'unknown',
      filename: filename,
      path: filepath,
      metadata: metadata || {}
    };

    monitoringEvents.push(event);
    monitoringStats.totalScreenshots++;
    monitoringStats.totalEvents++;

    res.json({ 
      success: true, 
      eventId: event.id,
      message: 'Screenshot saved successfully'
    });
  } catch (error) {
    console.error('Screenshot upload error:', error);
    res.status(500).json({ error: 'Screenshot upload failed' });
  }
});

// Log monitoring event
router.post('/log-event', (req, res) => {
  try {
    const event = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...req.body
    };

    monitoringEvents.push(event);
    monitoringStats.totalEvents++;

    // Keep only last 1000 events to stay within sweet spot
    if (monitoringEvents.length > 1000) {
      monitoringEvents = monitoringEvents.slice(-1000);
    }

    res.json({ 
      success: true, 
      eventId: event.id 
    });
  } catch (error) {
    console.error('Event logging error:', error);
    res.status(500).json({ error: 'Event logging failed' });
  }
});

// Get monitoring dashboard data
router.get('/dashboard', (req, res) => {
  try {
    const recentEvents = monitoringEvents.slice(-50); // Last 50 events
    
    const dashboard = {
      stats: monitoringStats,
      recentEvents,
      systemHealth: {
        monitoring: 'active',
        events: monitoringEvents.length,
        lastEvent: monitoringEvents.length > 0 ? monitoringEvents[monitoringEvents.length - 1].timestamp : null
      }
    };

    res.json({ success: true, dashboard });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Dashboard data failed' });
  }
});

// Get specific monitoring data
router.get('/events', (req, res) => {
  try {
    const { context, type, limit = 100 } = req.query;
    
    let filteredEvents = monitoringEvents;
    
    if (context) {
      filteredEvents = filteredEvents.filter(e => e.context === context);
    }
    
    if (type) {
      filteredEvents = filteredEvents.filter(e => e.type === type);
    }
    
    const events = filteredEvents.slice(-Number(limit));
    
    res.json({ 
      success: true, 
      events,
      total: filteredEvents.length
    });
  } catch (error) {
    console.error('Events query error:', error);
    res.status(500).json({ error: 'Events query failed' });
  }
});

// Export monitoring data
router.get('/export', (req, res) => {
  try {
    const exportData = {
      stats: monitoringStats,
      events: monitoringEvents,
      exportTime: new Date(),
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime()
      }
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=monitoring-export.json');
    res.json(exportData);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Export failed' });
  }
});

// Clear monitoring data (admin only)
router.post('/clear', (req, res) => {
  try {
    monitoringEvents = [];
    monitoringStats = {
      totalVideos: 0,
      totalScreenshots: 0,
      totalEvents: 0,
      storageUsed: 0
    };

    console.log('👁️ [EyeInTheSky] Monitoring data cleared');
    res.json({ success: true, message: 'Monitoring data cleared' });
  } catch (error) {
    console.error('Clear data error:', error);
    res.status(500).json({ error: 'Clear data failed' });
  }
});

export default router;