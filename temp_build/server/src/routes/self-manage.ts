/**
 * Self-Managing DreamNet Routes
 * 
 * Endpoints for DreamNet to manage itself using its own agents
 */

import { Router } from 'express';
import { dreamNetOS } from '../core/dreamnet-os';

const router = Router();

// DreamKeeper monitoring DreamNet
router.post('/dreamkeeper/check-self', async (req, res) => {
  try {
    const result = await dreamNetOS.runAgent({
      agent: 'dreamkeeper',
      input: {
        action: 'health-check',
        target: 'dreamnet',
        checkSelf: true,
      },
    });
    
    res.json({
      success: true,
      agent: 'dreamkeeper',
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DeployKeeper managing DreamNet deployments
router.post('/deploykeeper/deploy-self', async (req, res) => {
  try {
    const { target = 'gke', cluster = 'autopilot-cluster-1' } = req.body;
    
    const result = await dreamNetOS.runAgent({
      agent: 'deploykeeper',
      input: {
        action: 'deploy',
        target,
        cluster,
        deploySelf: true,
      },
    });
    
    res.json({
      success: true,
      agent: 'deploykeeper',
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// EnvKeeper syncing DreamNet config
router.post('/envkeeper/sync-self', async (req, res) => {
  try {
    const result = await dreamNetOS.runAgent({
      agent: 'envkeeper',
      input: {
        action: 'sync',
        source: 'gcp-secret-manager',
        syncSelf: true,
      },
    });
    
    res.json({
      success: true,
      agent: 'envkeeper',
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// RelayBot routing agent messages
router.post('/relaybot/route', async (req, res) => {
  try {
    const { from, to, message } = req.body;
    
    const result = await dreamNetOS.runAgent({
      agent: 'relaybot',
      input: {
        action: 'route',
        from,
        to,
        message,
      },
    });
    
    res.json({
      success: true,
      agent: 'relaybot',
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get self-management status
router.get('/status', async (req, res) => {
  try {
    // Check if agents can manage themselves
    const agents = dreamNetOS.listAgents();
    
    res.json({
      success: true,
      selfManagementEnabled: true,
      agents: agents.map(a => ({
        name: a.name,
        canManageSelf: true, // All agents can manage DreamNet
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

