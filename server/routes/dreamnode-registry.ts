import { Router } from 'express';
import { nodeRegistry } from '../../dreamnodes/registry/NodeRegistry';
import type { DreamNode, DreamNodeConfig } from '../../dreamnodes/types/DreamNode';

const router = Router();

// GET /api/nodes - List all public nodes
router.get('/', async (req, res) => {
  try {
    const publicNodes = nodeRegistry.listPublicNodes();
    res.json({
      success: true,
      nodes: publicNodes,
      totalCount: publicNodes.length
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch nodes',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/nodes/:nodeId - Get specific node details
router.get('/:nodeId', async (req, res) => {
  try {
    const { nodeId } = req.params;
    const node = nodeRegistry.getNode(nodeId);
    
    if (!node) {
      return res.status(404).json({
        error: 'Node not found',
        nodeId
      });
    }

    const usageStats = nodeRegistry.getUsageStats(nodeId);
    
    res.json({
      success: true,
      node,
      usageStats
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch node details',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/nodes/:nodeId/capabilities - Check node capabilities
router.get('/:nodeId/capabilities', async (req, res) => {
  try {
    const { nodeId } = req.params;
    const node = nodeRegistry.getNode(nodeId);
    
    if (!node) {
      return res.status(404).json({
        error: 'Node not found',
        nodeId
      });
    }

    res.json({
      success: true,
      nodeId,
      capabilities: {
        inboxEnabled: nodeRegistry.isInboxEnabled(nodeId),
        mintEnabled: nodeRegistry.isMintEnabled(nodeId),
        isolated: nodeRegistry.isIsolated(nodeId),
        trustBoundary: nodeRegistry.getTrustBoundary(nodeId),
        agentVisibility: nodeRegistry.getAgentVisibility(nodeId),
        allowedAccess: node.allowedAccess
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch node capabilities',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/nodes/creator/:creatorWallet - List nodes by creator
router.get('/creator/:creatorWallet', async (req, res) => {
  try {
    const { creatorWallet } = req.params;
    const nodes = nodeRegistry.listNodesByCreator(creatorWallet);
    
    res.json({
      success: true,
      creator: creatorWallet,
      nodes,
      totalCount: nodes.length
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch nodes by creator',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/nodes - Register a new node (future feature)
router.post('/', async (req, res) => {
  try {
    // This would be for user-created nodes in the future
    res.status(501).json({
      error: 'Node registration not yet implemented',
      message: 'Currently only system nodes are supported'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to register node',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/nodes/stats/global - Global usage statistics
router.get('/stats/global', async (req, res) => {
  try {
    const allStats = nodeRegistry.getAllUsageStats();
    const totalRequests = allStats.reduce((sum, stat) => sum + stat.totalRequests, 0);
    const totalSuccess = allStats.reduce((sum, stat) => sum + stat.successfulRequests, 0);
    const totalFailures = allStats.reduce((sum, stat) => sum + stat.failedRequests, 0);
    
    res.json({
      success: true,
      globalStats: {
        totalNodes: nodeRegistry.nodes.size,
        publicNodes: nodeRegistry.listPublicNodes().length,
        totalRequests,
        successRate: totalRequests > 0 ? (totalSuccess / totalRequests) * 100 : 0,
        totalFailures
      },
      nodeStats: allStats
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch global statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;