import { Router } from 'express';
import { nodeRegistry } from '../../dreamnodes/registry/NodeRegistry';
import { storage } from '../storage';

const router = Router();

interface EcosystemData {
  operator: boolean;
  dreams: any[];
  nodes: any[];
  agents: any[];
  evolutionChains: any[];
  bounties: any[];
  infected: any[];
  lockedAgents: any[];
  godTriggers: any[];
}

// GET /api/ecosystem - Complete ecosystem data
router.get('/', async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'] as string;
    const isOperator = Boolean(walletAddress && ['0xYOURWALLET', '0xyourwallet'].includes(walletAddress));

    // Import node configurations
    const { FLUTTERBY_NODE } = await import('../../dreamnodes/flutterbye/node.config.js');
    const { DEFI_LAB_NODE } = await import('../../dreamnodes/defi-lab/node.config.js');
    
    // Register nodes if not already registered
    if (!nodeRegistry.getNode('flutterbye')) {
      nodeRegistry.registerNode(FLUTTERBY_NODE);
    }
    if (!nodeRegistry.getNode('defi-lab')) {
      nodeRegistry.registerNode(DEFI_LAB_NODE);
    }

    // Get all nodes (including private ones for operators)
    const allNodes = Array.from(nodeRegistry.nodes.values());
    const visibleNodes = isOperator ? allNodes : nodeRegistry.listPublicNodes();

    // Enhanced dreams data with full ecosystem structure
    const dreams = [
      {
        id: 'dream-0',
        title: 'Neural Network Vision',
        name: 'Neural Network Vision',
        creator: '0xFAKE0',
        tags: ['ai', 'vision'],
        score: 85,
        evolved: true,
        status: 'Active',
        trustLevel: 'High',
        nightmare: false,
        claimedBy: null,
        remix: {
          initiated: false,
          result: null,
          score: null
        },
        bounty: null
      },
      {
        id: 'dream-1',
        title: 'DeFi Protocol v2',
        name: 'DeFi Protocol v2',
        creator: '0xyourwallet',
        tags: ['defi', 'protocol'],
        score: 92,
        evolved: false,
        status: 'Development',
        trustLevel: 'Maximum',
        nightmare: false,
        claimedBy: '0xyourwallet',
        remix: {
          initiated: false,
          result: null,
          score: null
        },
        bounty: {
          token: 'CORE',
          amount: 1000,
          expires: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
        }
      },
      {
        id: '7b3d',
        title: 'Unstable Portal Dream',
        name: 'Unstable Portal Dream',
        creator: '0xINFECTED',
        tags: ['defi', 'ai'],
        score: 15,
        evolved: false,
        status: 'infected',
        trustLevel: 'Danger',
        nightmare: true,
        claimedBy: '0xABC',
        remix: {
          initiated: true,
          result: null,
          score: null
        },
        bounty: {
          token: 'SHEEP',
          amount: 500,
          expires: 1699999999
        }
      },
      {
        id: 'nightmare-1',
        title: 'Corrupted Data Stream',
        name: 'Corrupted Data Stream',
        creator: '0xINFECTED',
        tags: ['infected', 'corruption'],
        score: 10,
        evolved: false,
        status: 'Quarantined',
        trustLevel: 'Danger',
        nightmare: true,
        claimedBy: null,
        remix: {
          initiated: false,
          result: null,
          score: null
        },
        bounty: null
      }
    ];

    // Active agents in the system
    const agents = [
      {
        id: 'LUCID',
        name: 'Logic Unification & Command Interface Daemon',
        status: 'Active',
        trustScore: 95,
        accessLevel: 'Core',
        locked: false,
        currentTask: 'Dream routing and validation'
      },
      {
        id: 'CANVAS',
        name: 'Visual Layer Weaver',
        status: 'Active',
        trustScore: 88,
        accessLevel: 'Standard',
        locked: false,
        currentTask: 'UI component generation'
      },
      {
        id: 'ROOT',
        name: 'Subconscious Architect',
        status: 'Active',
        trustScore: 92,
        accessLevel: 'Deep',
        locked: false,
        currentTask: 'System architecture analysis'
      },
      {
        id: 'ECHO',
        name: 'Wallet Mirror',
        status: 'Active',
        trustScore: 87,
        accessLevel: 'Standard',
        locked: false,
        currentTask: 'Wallet trust evaluation'
      },
      {
        id: 'CRADLE',
        name: 'Evolution Engine',
        status: 'Active',
        trustScore: 90,
        accessLevel: 'Evolution',
        locked: false,
        currentTask: 'Dream lifecycle management'
      },
      {
        id: 'WING',
        name: 'Messenger & Mint Agent',
        status: 'Active',
        trustScore: 85,
        accessLevel: 'Token',
        locked: false,
        currentTask: 'Token distribution'
      },
      {
        id: 'GLITCH',
        name: 'Hidden System Agent',
        status: 'Dormant',
        trustScore: 60,
        accessLevel: 'Restricted',
        locked: true,
        currentTask: 'System monitoring (locked)'
      }
    ];

    // Evolution chains tracking dream progression
    const evolutionChains = [
      {
        id: 'chain-neural',
        rootDream: 'dream-0',
        generations: 3,
        totalForks: 12,
        avgScore: 82,
        status: 'Evolving'
      },
      {
        id: 'chain-defi',
        rootDream: 'dream-1',
        generations: 1,
        totalForks: 5,
        avgScore: 89,
        status: 'Stable'
      }
    ];

    // Active bounties in the system
    const bounties = [
      {
        id: 'bounty-1',
        title: 'Cross-chain Bridge Implementation',
        reward: '5000 CORE',
        deadline: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
        difficulty: 'Expert',
        applicants: 3,
        status: 'Open'
      },
      {
        id: 'bounty-2',
        title: 'AI Agent Optimization',
        reward: '2500 FLBY',
        deadline: Date.now() + (14 * 24 * 60 * 60 * 1000), // 14 days
        difficulty: 'Advanced',
        applicants: 7,
        status: 'In Progress'
      }
    ];

    // Infected/compromised entities including dreams
    const infected = [
      {
        id: 'infected-wallet-1',
        type: 'wallet',
        address: '0xINFECTED',
        severity: 'High',
        detectedAt: Date.now() - (2 * 60 * 60 * 1000), // 2 hours ago
        status: 'Quarantined'
      },
      {
        id: '7b3d',
        type: 'dream',
        address: 'Unstable Portal Dream',
        severity: 'Critical',
        detectedAt: Date.now() - (6 * 60 * 60 * 1000), // 6 hours ago
        status: 'Remix Initiated',
        bountyActive: true,
        claimedBy: '0xABC'
      }
    ];

    // Locked agents requiring special conditions
    const lockedAgents = [
      {
        id: 'GLITCH',
        name: 'Hidden System Agent',
        unlockCondition: 'Trust score 95+ and operator status',
        currentProgress: isOperator ? 'Operator verified' : 'Access denied',
        canUnlock: isOperator
      }
    ];

    // God mode triggers for system administrators
    const godTriggers = isOperator ? [
      {
        id: 'system-reset',
        name: 'Emergency System Reset',
        description: 'Reset all agent states and clear quarantine',
        danger: 'Critical',
        requiresConfirmation: true
      },
      {
        id: 'unlock-all',
        name: 'Unlock All Agents',
        description: 'Override all agent locks and restrictions',
        danger: 'High',
        requiresConfirmation: true
      },
      {
        id: 'purge-infected',
        name: 'Purge Infected Entities',
        description: 'Remove all quarantined and infected data',
        danger: 'Medium',
        requiresConfirmation: true
      }
    ] : [];

    const ecosystemData: EcosystemData = {
      operator: isOperator,
      dreams,
      nodes: visibleNodes,
      agents,
      evolutionChains,
      bounties,
      infected,
      lockedAgents,
      godTriggers
    };

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      ecosystem: ecosystemData,
      metadata: {
        totalEntities: dreams.length + visibleNodes.length + agents.length + bounties.length,
        operatorAccess: isOperator,
        systemHealth: infected.length === 0 ? 'Healthy' : 'Compromised',
        activeAgents: agents.filter(a => a.status === 'Active').length
      }
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch ecosystem data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/ecosystem/god-trigger - Execute god mode actions
router.post('/god-trigger', async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'] as string;
    const isOperator = Boolean(walletAddress && ['0xYOURWALLET', '0xyourwallet'].includes(walletAddress));
    
    if (!isOperator) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'God triggers require operator privileges'
      });
    }

    const { triggerId, confirmed } = req.body;
    
    if (!confirmed) {
      return res.status(400).json({
        error: 'Confirmation required',
        message: 'God triggers must be explicitly confirmed'
      });
    }

    let result;
    switch (triggerId) {
      case 'system-reset':
        result = { message: 'System reset initiated', affected: ['agents', 'quarantine'] };
        break;
      case 'unlock-all':
        result = { message: 'All agents unlocked', affected: ['GLITCH', 'restricted-nodes'] };
        break;
      case 'purge-infected':
        result = { message: 'Infected entities purged', affected: ['infected-entities'] };
        break;
      default:
        return res.status(400).json({ error: 'Unknown trigger ID' });
    }

    res.json({
      success: true,
      trigger: triggerId,
      result,
      executedBy: walletAddress,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to execute god trigger',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;