import { Router } from 'express';
import { integrationMappingService } from '../services/IntegrationMappingService';
import { z } from 'zod';

const router = Router();

// Initialize integration mapping system
router.post('/initialize', async (req, res) => {
  try {
    console.log('🗺️ [INTEGRATION API] Initializing system mapping...');
    await integrationMappingService.initializeSystemMapping();
    
    res.json({
      success: true,
      message: 'Integration mapping system initialized successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ [INTEGRATION API] Initialization failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize integration mapping system',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get complete system map
router.get('/map', async (req, res) => {
  try {
    console.log('🗺️ [INTEGRATION API] Fetching system map...');
    const systemMap = await integrationMappingService.getSystemMap();
    
    res.json({
      success: true,
      data: systemMap,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ [INTEGRATION API] Failed to fetch system map:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system map',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get system health overview
router.get('/health', async (req, res) => {
  try {
    console.log('🔍 [INTEGRATION API] Fetching system health...');
    const health = await integrationMappingService.getSystemHealth();
    
    res.json({
      success: true,
      data: health,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ [INTEGRATION API] Failed to fetch system health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system health',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Search nodes
router.get('/search', async (req, res) => {
  try {
    const query = z.string().min(1).parse(req.query.q);
    console.log(`🔍 [INTEGRATION API] Searching nodes for: ${query}`);
    
    const nodes = await integrationMappingService.searchNodes(query);
    
    res.json({
      success: true,
      data: nodes,
      query,
      count: nodes.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ [INTEGRATION API] Search failed:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get specific node details
router.get('/node/:nodeId', async (req, res) => {
  try {
    const nodeId = z.string().parse(req.params.nodeId);
    console.log(`🔍 [INTEGRATION API] Fetching node details for: ${nodeId}`);
    
    const node = await integrationMappingService.getNodeDetails(nodeId);
    
    if (!node) {
      return res.status(404).json({
        success: false,
        error: 'Node not found',
        nodeId
      });
    }
    
    res.json({
      success: true,
      data: node,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ [INTEGRATION API] Failed to fetch node details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch node details',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update node health
router.post('/node/:nodeId/health', async (req, res) => {
  try {
    const nodeId = z.string().parse(req.params.nodeId);
    const { healthScore } = z.object({
      healthScore: z.number().min(0).max(100)
    }).parse(req.body);
    
    console.log(`💊 [INTEGRATION API] Updating health for node ${nodeId}: ${healthScore}%`);
    
    await integrationMappingService.updateNodeHealth(nodeId, healthScore);
    
    res.json({
      success: true,
      message: 'Node health updated successfully',
      nodeId,
      healthScore,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ [INTEGRATION API] Failed to update node health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update node health',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get integration metrics
router.get('/metrics', async (req, res) => {
  try {
    console.log('📊 [INTEGRATION API] Fetching integration metrics...');
    const systemMap = await integrationMappingService.getSystemMap();
    const health = await integrationMappingService.getSystemHealth();
    
    res.json({
      success: true,
      data: {
        overview: systemMap.metrics,
        health: health,
        layers: systemMap.layers.map(layer => ({
          ...layer,
          health: Math.round(
            health.nodes
              .filter(n => systemMap.nodes.find(node => 
                node.id === n.id && node.layer === layer.level
              ))
              .reduce((sum, n) => sum + n.health, 0) / 
            Math.max(1, health.nodes.filter(n => 
              systemMap.nodes.find(node => 
                node.id === n.id && node.layer === layer.level
              )
            ).length)
          )
        })),
        connections: {
          total: systemMap.connections.length,
          active: systemMap.connections.filter(c => c.isActive).length,
          byType: systemMap.connections.reduce((acc, conn) => {
            acc[conn.type] = (acc[conn.type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          byStrength: systemMap.connections.reduce((acc, conn) => {
            const range = conn.strength <= 3 ? 'low' : conn.strength <= 6 ? 'medium' : 'high';
            acc[range] = (acc[range] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ [INTEGRATION API] Failed to fetch metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch integration metrics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as integrationRouter };