/**
 * Aerodrome Finance API Routes
 * 
 * Provides RESTful endpoints for GitHub + Aerodrome DeFi integration
 * Supporting business user specialization and real-time data
 * Enhanced with WebSocket streaming capabilities
 */

import { Router } from 'express';
import { aerodromeIntegration } from '../integrations/aerodrome';

const router = Router();

/**
 * GitHub Integration Endpoints
 */

// GET /api/aerodrome/github/repos - Get Aerodrome GitHub repository information
router.get('/github/repos', async (req, res) => {
  try {
    const repos = await aerodromeIntegration.getGitHubRepoInfo();
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: repos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * DeFi Analytics Endpoints
 */

// GET /api/aerodrome/pools - Get pool analytics with optional limit
router.get('/pools', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const pools = await aerodromeIntegration.getPoolAnalytics(limit);
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        pools,
        count: pools.length,
        total_tvl: pools.reduce((sum, pool) => sum + (pool.tvl || 0), 0),
        avg_apr: pools.length > 0 ? pools.reduce((sum, pool) => sum + (pool.apr || 0), 0) / pools.length : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// POST /api/aerodrome/quote - Get swap quote
router.post('/quote', async (req, res) => {
  try {
    const { fromToken, toToken, amount } = req.body;
    
    if (!fromToken || !toToken || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: fromToken, toToken, amount'
      });
    }

    const quote = await aerodromeIntegration.getSwapQuote(fromToken, toToken, amount);
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: quote
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Business User Specialization Endpoints
 */

// GET /api/aerodrome/business/eric - Eric's metals trading focus
router.get('/business/eric', async (req, res) => {
  try {
    const metrics = await aerodromeIntegration.getBusinessMetrics('eric');
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: metrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/aerodrome/business/dan - Dan's crypto trading focus
router.get('/business/dan', async (req, res) => {
  try {
    const metrics = await aerodromeIntegration.getBusinessMetrics('dan');
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: metrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/aerodrome/business/sutton - Sutton's security focus  
router.get('/business/sutton', async (req, res) => {
  try {
    const metrics = await aerodromeIntegration.getBusinessMetrics('sutton');
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: metrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/aerodrome/business/brandon - Brandon's system admin focus
router.get('/business/brandon', async (req, res) => {
  try {
    const metrics = await aerodromeIntegration.getBusinessMetrics('brandon');
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: metrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Integration Status and Health Monitoring
 */

// GET /api/aerodrome/status - Check integration health
router.get('/status', async (req, res) => {
  try {
    const status = await aerodromeIntegration.getIntegrationStatus();
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Comprehensive Dashboard Endpoint
 */

// GET /api/aerodrome/dashboard - Complete dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const [repos, pools, status] = await Promise.all([
      aerodromeIntegration.getGitHubRepoInfo(),
      aerodromeIntegration.getPoolAnalytics(15),
      aerodromeIntegration.getIntegrationStatus()
    ]);

    const dashboard = {
      github: {
        repositories: repos,
        total_stars: repos.reduce((sum, repo) => sum + repo.stars, 0),
        total_forks: repos.reduce((sum, repo) => sum + repo.forks, 0),
        languages: [...new Set(repos.map(repo => repo.language))],
        last_updated: Math.max(...repos.map(repo => new Date(repo.last_updated).getTime()))
      },
      defi: {
        pools: pools.slice(0, 10), // Top 10 pools
        total_pools: pools.length,
        total_tvl: pools.reduce((sum, pool) => sum + (pool.tvl || 0), 0),
        avg_apr: pools.length > 0 ? pools.reduce((sum, pool) => sum + (pool.apr || 0), 0) / pools.length : 0,
        top_volume: pools.sort((a, b) => (b.volume24h || 0) - (a.volume24h || 0)).slice(0, 5)
      },
      integration_status: status,
      business_users: [
        { name: 'Eric', role: 'Metals Mint President', focus: 'Trading systems' },
        { name: 'Dan', role: 'Crypto Trader', focus: 'Meme coins & trading' },
        { name: 'Sutton', role: 'Security Professional', focus: 'IT security' },
        { name: 'Brandon', role: 'System Administrator', focus: 'Backend monitoring' }
      ]
    };

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: dashboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Real-Time WebSocket Streaming Endpoints
 */

// GET /api/aerodrome/stream/status - Check WebSocket streaming capabilities
router.get('/stream/status', async (req, res) => {
  try {
    const streamStatus = await aerodromeIntegration.getRealtimeBlockStream();
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: streamStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;