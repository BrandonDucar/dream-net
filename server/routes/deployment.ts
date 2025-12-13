/**
 * Unified Deployment API Routes
 * Deploy to any platform - we ARE the deployment platform!
 */

import { Router } from 'express';
import { getDeploymentManager, type DeploymentConfig } from '../../packages/deployment-core';
import { getDomainKeeper } from '../services/DomainKeeper';

const router = Router();

/**
 * POST /api/deployment/deploy
 * Deploy to a specific platform (with Spine event emission)
 */
router.post('/deploy', async (req, res) => {
  try {
    const config: DeploymentConfig = req.body;

    if (!config.platform || !config.projectName || !config.sourceDirectory) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: platform, projectName, sourceDirectory',
      });
    }

    // Get caller identity from request (if available)
    const callerId = (req as any).callerIdentity?.callerId || 'anonymous';

    console.log(`[Deployment] Deploying ${config.projectName} to ${config.platform} (caller: ${callerId})`);

    // Use DeploymentWrapper for event emission
    const deploymentWrapper = (global as any).deploymentWrapper;
    let result;
    
    if (deploymentWrapper) {
      result = await deploymentWrapper.deploy({
        config,
        callerId,
      });
    } else {
      // Fallback to direct deployment manager if wrapper not available
      const manager = getDeploymentManager();
      result = await manager.deploy(config);
    }

    // If deployment succeeded and it's Vercel, sync domains asynchronously
    if (result.success && config.platform === 'vercel') {
      // Run domain sync in background (don't block response)
      getDomainKeeper()
        .syncProductionDomain()
        .then((syncResult) => {
          console.log(`[DomainKeeper] Production domain sync: ${syncResult.action} - ${syncResult.message}`);
        })
        .catch((error) => {
          console.error('[DomainKeeper] Domain sync error (non-blocking):', error);
        });
    }

    // Return response with wrapper metadata if available
    if (deploymentWrapper && 'correlationId' in result) {
      res.json({
        success: result.success,
        result: {
          deploymentId: result.deploymentId,
          url: result.url,
          platform: result.platform,
          error: result.error,
          logs: result.logs,
        },
        correlationId: result.correlationId,
        emittedEvents: result.emittedEvents,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.json({
        success: result.success,
        result,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error: any) {
    console.error('[Deployment] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Deployment failed',
    });
  }
});

/**
 * POST /api/deployment/deploy-all
 * Deploy to all available platforms simultaneously
 */
router.post('/deploy-all', async (req, res) => {
  try {
    const config = req.body;

    if (!config.projectName || !config.sourceDirectory) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: projectName, sourceDirectory',
      });
    }

    console.log(`[Deployment] Deploying ${config.projectName} to ALL platforms`);

    const manager = getDeploymentManager();
    const results = await manager.deployToAll(config);

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    res.json({
      success: true,
      results,
      summary: {
        total: totalCount,
        successful: successCount,
        failed: totalCount - successCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Deployment] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Deployment failed',
    });
  }
});

/**
 * GET /api/deployment/platforms
 * List all available deployment platforms
 */
router.get('/platforms', async (req, res) => {
  try {
    const manager = getDeploymentManager();
    const platforms = manager.listAvailablePlatforms();

    res.json({
      success: true,
      platforms,
      count: platforms.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Deployment] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/deployment/status/:deploymentId
 * Get deployment status
 */
router.get('/status/:deploymentId', async (req, res) => {
  try {
    const { deploymentId } = req.params;
    const { platform } = req.query;

    if (!platform || typeof platform !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Platform query parameter is required',
      });
    }

    const manager = getDeploymentManager();
    const provider = manager.getProvider(platform as any);

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: `Platform ${platform} not found`,
      });
    }

    const result = await provider.getStatus(deploymentId);

    res.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Deployment] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/deployment/sync-domains
 * Manually trigger domain synchronization
 * Ensures dreamnet.ink is attached to the correct Vercel project and DNS is correct
 */
router.post('/sync-domains', async (req, res) => {
  try {
    console.log('[DomainKeeper] Manual domain sync triggered');

    const keeper = getDomainKeeper();
    const results = await keeper.syncAllDomains();

    const summary = {
      total: results.length,
      successful: results.filter(r => r.action !== 'error' && r.dnsAction !== 'error').length,
      failed: results.filter(r => r.action === 'error' || r.dnsAction === 'error').length,
      results: results.map(r => ({
        domain: r.domain,
        vercel: {
          action: r.action,
          message: r.message,
        },
        dns: r.dnsAction ? {
          action: r.dnsAction,
          message: r.dnsMessage,
        } : undefined,
      })),
    };

    res.json({
      success: summary.failed === 0,
      summary,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[DomainKeeper] Sync error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Domain sync failed',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;

