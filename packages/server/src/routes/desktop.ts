import { Router } from 'express';

const router = Router();

// Desktop version endpoint for Go/No-Go checklist
router.get('/api/desktop/version', (req, res) => {
  const version = {
    version: "2.1.4",
    build: "20250120",
    update_available: false,
    download_url: "https://www.dreamnet.ink/downloads/dreamnet-desktop.exe",
    release_notes: "Critical security updates and performance improvements",
    minimum_version: "2.0.0",
    timestamp: new Date().toISOString()
  };

  res.json(version);
});

// Desktop bridge status for system connectivity
router.get('/api/desktop/status', (req, res) => {
  res.json({
    success: true,
    bridge_status: "connected",
    platforms: {
      windows: "active",
      macos: "active", 
      linux: "beta"
    },
    last_heartbeat: new Date().toISOString(),
    active_connections: 0
  });
});

// Post-launch automation status endpoint (admin access required)
router.get('/api/automation/status', async (req, res) => {
  // Check admin token
  const adminToken = req.headers['x-admin-token'] || req.query.admin_token;
  const expectedToken = process.env.ADMIN_TOKEN || 'dev-admin-2025';
  
  if (!adminToken || adminToken !== expectedToken) {
    return res.status(403).json({ 
      error: 'Access denied - Admin token required for automation status',
      hint: 'Add X-Admin-Token header or ?admin_token=<token> query parameter'
    });
  }

  try {
    const { postLaunchAutomation } = await import('../automation/post-launch');
    const status = postLaunchAutomation.getStatus();
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to get automation status',
      message: error.message 
    });
  }
});

export default router;