/**
 * Velo by Wix Integration Routes
 * 
 * Provides REST API endpoints for Velo by Wix integration including:
 * - Integration status monitoring
 * - GitHub repository management
 * - Site and collection data
 * - Business user specialization
 * - Development tools status
 */

import { Router } from 'express';
import { veloIntegration } from '../integrations/velo';

const router = Router();

/**
 * Get overall integration status
 * GET /api/velo/status
 */
router.get('/status', async (req, res) => {
  try {
    const status = await veloIntegration.getIntegrationStatus();
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: status
    });
  } catch (error) {
    console.error('Velo integration status error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get GitHub repositories for Velo projects
 * GET /api/velo/github/repos
 */
router.get('/github/repos', async (req, res) => {
  try {
    const repos = await veloIntegration.getVeloGitHubRepos();
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: repos
    });
  } catch (error) {
    console.error('Velo GitHub repos error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get site information
 * GET /api/velo/site
 */
router.get('/site', async (req, res) => {
  try {
    const siteInfo = await veloIntegration.getSiteInfo();
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: siteInfo
    });
  } catch (error) {
    console.error('Velo site info error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get data collections
 * GET /api/velo/collections
 */
router.get('/collections', async (req, res) => {
  try {
    const collections = await veloIntegration.getDataCollections();
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        collections,
        count: collections.length,
        total_records: collections.reduce((sum, col) => sum + (col.recordCount || 0), 0)
      }
    });
  } catch (error) {
    console.error('Velo collections error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get development tools status
 * GET /api/velo/devtools
 */
router.get('/devtools', async (req, res) => {
  try {
    const devTools = await veloIntegration.getDevToolsStatus();
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: devTools
    });
  } catch (error) {
    console.error('Velo dev tools error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Business user endpoints
 */

// Auric - Metals Intelligence Node
router.get('/business/auric', async (req, res) => {
  try {
    const metrics = veloIntegration.getBusinessUserMetrics('auric');
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: metrics
    });
  } catch (error) {
    console.error('Velo Auric metrics error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Flux - Crypto Intelligence Node
router.get('/business/flux', async (req, res) => {
  try {
    const metrics = veloIntegration.getBusinessUserMetrics('flux');
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: metrics
    });
  } catch (error) {
    console.error('Velo Flux metrics error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Sentinel - Security Intelligence Node
router.get('/business/sentinel', async (req, res) => {
  try {
    const metrics = veloIntegration.getBusinessUserMetrics('sentinel');
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: metrics
    });
  } catch (error) {
    console.error('Velo Sentinel metrics error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// DreamOps - Core Operations Node
router.get('/business/dreamops', async (req, res) => {
  try {
    const metrics = veloIntegration.getBusinessUserMetrics('dreamops');
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: metrics
    });
  } catch (error) {
    console.error('Velo DreamOps metrics error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Dashboard overview with all integration data
 * GET /api/velo/dashboard
 */
router.get('/dashboard', async (req, res) => {
  try {
    const dashboard = await veloIntegration.getDashboardOverview();
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: dashboard
    });
  } catch (error) {
    console.error('Velo dashboard error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;