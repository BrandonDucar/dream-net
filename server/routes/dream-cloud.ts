import { Router } from 'express';
import type { DreamCloud, DreamCloudStats, CloudActivity, CloudDream, DreamTeam, TeamActivity } from '../../shared/dream-cloud.js';

const router = Router();

// In-memory storage for dream clouds
const dreamClouds: Map<string, DreamCloud> = new Map();
const cloudActivities: CloudActivity[] = [];
const cloudDreams: Map<string, CloudDream> = new Map();
const dreamTeams: Map<string, DreamTeam> = new Map();
const teamActivities: TeamActivity[] = [];

// Initialize sample dream clouds
const initializeDreamClouds = () => {
  const sampleClouds: DreamCloud[] = [
    {
      id: 'defi-cloud',
      name: 'DeFi',
      description: 'Decentralized Finance protocols, yield farming, and liquidity solutions',
      themeColor: '#00D2FF',
      icon: '💰',
      dreams: ['dream-1', '7b3d'], // Include the infected dream
      remixXP: 2850,
      nodeAffinity: ['My DeFi Lab'],
      activeAgents: ['LUCID', 'ROOT', 'ECHO'],
      trustRequired: 70,
      createdBy: process.env.OPERATOR_WALLETS?.split(',')[0]?.trim() || 'system',
      createdAt: Date.now() - (7 * 24 * 60 * 60 * 1000) // 7 days ago
    },
    {
      id: 'zk-cloud',
      name: 'ZK Security',
      description: 'Zero-knowledge proofs, privacy protocols, and cryptographic innovations',
      themeColor: '#8B5CF6',
      icon: '🔒',
      dreams: ['dream-0'],
      remixXP: 1920,
      nodeAffinity: ['FlutterBye'],
      activeAgents: ['CANVAS', 'CRADLE'],
      trustRequired: 85,
      createdBy: '0xZKDEV',
      createdAt: Date.now() - (5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    {
      id: 'memes-cloud',
      name: 'Memes',
      description: 'Memecoin experiments, viral content, and community-driven projects',
      themeColor: '#FF6B35',
      icon: '🐸',
      dreams: [],
      remixXP: 890,
      nodeAffinity: ['FlutterBye'],
      activeAgents: ['WING'],
      trustRequired: 30,
      createdBy: '0xMEMELORD',
      createdAt: Date.now() - (3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    {
      id: 'gaming-cloud',
      name: 'Gaming',
      description: 'Web3 games, NFT integrations, and play-to-earn mechanics',
      themeColor: '#10B981',
      icon: '🎮',
      dreams: ['dream-2'],
      remixXP: 1560,
      nodeAffinity: [],
      activeAgents: ['CANVAS', 'WING'],
      trustRequired: 50,
      createdBy: '0xGAMER',
      createdAt: Date.now() - (2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      id: 'ai-cloud',
      name: 'AI Fusion',
      description: 'Machine learning models, neural networks, and AI-powered automation',
      themeColor: '#F59E0B',
      icon: '🧠',
      dreams: ['dream-0', '7b3d'],
      remixXP: 3240,
      nodeAffinity: ['FlutterBye'],
      activeAgents: ['LUCID', 'CANVAS', 'ROOT', 'CRADLE'],
      trustRequired: 80,
      createdBy: '0xAI_RESEARCHER',
      createdAt: Date.now() - (10 * 24 * 60 * 60 * 1000) // 10 days ago
    },
    {
      id: 'desci-cloud',
      name: 'DeSci',
      description: 'Decentralized science, research protocols, and academic collaboration',
      themeColor: '#7C3AED',
      icon: '🔬',
      dreams: [],
      remixXP: 1240,
      nodeAffinity: [],
      activeAgents: ['ROOT', 'CRADLE'],
      trustRequired: 75,
      createdBy: '0xSCIENTIST',
      createdAt: Date.now() - (8 * 24 * 60 * 60 * 1000) // 8 days ago
    },
    {
      id: 'creative-cloud',
      name: 'Creative Tools',
      description: 'Digital art, content creation, and creative workflow automation',
      themeColor: '#EC4899',
      icon: '🎨',
      dreams: [],
      remixXP: 890,
      nodeAffinity: ['FlutterBye'],
      activeAgents: ['CANVAS', 'WING'],
      trustRequired: 40,
      createdBy: '0xARTIST',
      createdAt: Date.now() - (1 * 24 * 60 * 60 * 1000) // 1 day ago
    }
  ];

  sampleClouds.forEach(cloud => {
    dreamClouds.set(cloud.id, cloud);
  });

  // Add some sample activities
  const sampleActivities: CloudActivity[] = [
    {
      cloudId: 'defi-cloud',
      action: 'dream_added',
      details: 'Dream 7b3d added to DeFi cloud',
      timestamp: Date.now() - (2 * 60 * 60 * 1000),
      actor: '0xABC'
    },
    {
      cloudId: 'ai-cloud',
      action: 'remix_submitted',
      details: 'Portal stabilization remix submitted',
      timestamp: Date.now() - (1 * 60 * 60 * 1000),
      actor: '0xDEF'
    },
    {
      cloudId: 'zk-cloud',
      action: 'agent_activated',
      details: 'CRADLE agent activated for privacy protocol',
      timestamp: Date.now() - (30 * 60 * 1000),
      actor: '0xZKDEV'
    }
  ];

  cloudActivities.push(...sampleActivities);

  // Initialize sample cloud dreams
  const sampleCloudDreams: CloudDream[] = [
    {
      id: 'dream123',
      title: 'Stablecoin Arcade',
      cloudId: 'defi-cloud',
      tags: ['stablecoin', 'game', 'dex'],
      remixXP: 420,
      creator: '0xGAMEDEV',
      status: 'active',
      trustLevel: 'High',
      nightmare: false,
      claimedBy: null,
      remix: {
        initiated: false,
        result: null,
        score: null
      },
      bounty: {
        token: 'CORE',
        amount: 200,
        expires: Date.now() + (15 * 24 * 60 * 60 * 1000), // 15 days
        claimed: false,
        claimedBy: null,
        bountyId: 'bounty-core-200',
        claimer: undefined,
        submission: undefined,
        proof: undefined,
        claimSubmission: undefined,
        claimProof: undefined,
        claimDate: undefined
      },
      createdAt: Date.now() - (2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      id: '7b3d',
      title: 'Unstable Portal Dream',
      cloudId: 'ai-cloud',
      tags: ['defi', 'ai', 'portal'],
      remixXP: 150,
      creator: '0xINFECTED',
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
        expires: 1699999999,
        claimed: false,
        claimedBy: null,
        bountyId: 'bounty-sheep-500',
        claimer: undefined,
        submission: undefined,
        proof: undefined,
        claimSubmission: undefined,
        claimProof: undefined,
        claimDate: undefined
      },
      createdAt: Date.now() - (6 * 60 * 60 * 1000) // 6 hours ago
    },
    {
      id: 'zk-privacy-1',
      title: 'Anonymous Voting Protocol',
      cloudId: 'zk-cloud',
      tags: ['zk', 'voting', 'privacy'],
      remixXP: 680,
      creator: '0xZKDEV',
      status: 'active',
      trustLevel: 'Maximum',
      nightmare: false,
      claimedBy: '0xZKDEV',
      remix: {
        initiated: false,
        result: null,
        score: null
      },
      bounty: null,
      createdAt: Date.now() - (4 * 24 * 60 * 60 * 1000) // 4 days ago
    },
    {
      id: 'meme-token-1',
      title: 'Viral Memecoin Generator',
      cloudId: 'memes-cloud',
      tags: ['meme', 'token', 'viral'],
      remixXP: 350,
      creator: '0xMEMELORD',
      status: 'active',
      trustLevel: 'Medium',
      nightmare: false,
      claimedBy: null,
      remix: {
        initiated: false,
        result: null,
        score: null
      },
      bounty: {
        token: 'MEME',
        amount: 1000,
        expires: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
        claimed: false,
        claimedBy: null,
        bountyId: 'bounty-meme-1000',
        claimer: undefined,
        submission: undefined,
        proof: undefined,
        claimSubmission: undefined,
        claimProof: undefined,
        claimDate: undefined
      },
      createdAt: Date.now() - (1 * 24 * 60 * 60 * 1000) // 1 day ago
    }
  ];

  sampleCloudDreams.forEach(dream => {
    cloudDreams.set(dream.id, dream);
  });

  // Update cloud dream counts
  sampleCloudDreams.forEach(dream => {
    const cloud = dreamClouds.get(dream.cloudId);
    if (cloud && !cloud.dreams.includes(dream.id)) {
      cloud.dreams.push(dream.id);
    }
  });

  // Initialize sample dream teams
  const sampleTeams: DreamTeam[] = [
    {
      id: 'team-defi-1',
      name: 'DeFi Innovators',
      leader: '0xDEFILEADER',
      members: ['0xDEFILEADER', '0xDEV1', '0xDEV2', '0xDESIGNER'],
      cloudId: 'defi-cloud',
      xp: 2850,
      badge: 'Yield Masters',
      public: true,
      logoUrl: 'https://example.com/defi-logo.png',
      createdAt: Date.now() - (5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    {
      id: 'team-zk-1',
      name: 'Zero Knowledge Collective',
      leader: '0xZKLEADER',
      members: ['0xZKLEADER', '0xCRYPTO1', '0xMATH1'],
      cloudId: 'zk-cloud',
      xp: 4200,
      badge: 'Privacy Guardians',
      public: true,
      createdAt: Date.now() - (8 * 24 * 60 * 60 * 1000) // 8 days ago
    },
    {
      id: 'team-ai-1',
      name: 'Neural Architects',
      leader: '0xAILEADER',
      members: ['0xAILEADER', '0xML1', '0xDATA1', '0xNLP1', '0xVISION1'],
      cloudId: 'ai-cloud',
      xp: 5600,
      badge: 'Mind Melders',
      public: true,
      logoUrl: 'https://example.com/ai-logo.png',
      createdAt: Date.now() - (12 * 24 * 60 * 60 * 1000) // 12 days ago
    },
    {
      id: 'team-secret-1',
      name: 'Shadow Builders',
      leader: '0xSECRETLEADER',
      members: ['0xSECRETLEADER', '0xNINJA1', '0xSTEALTH1'],
      cloudId: 'gaming-cloud',
      xp: 1890,
      badge: 'Phantom Force',
      public: false,
      createdAt: Date.now() - (3 * 24 * 60 * 60 * 1000) // 3 days ago
    }
  ];

  sampleTeams.forEach(team => {
    dreamTeams.set(team.id, team);
  });

  // Initialize sample team activities
  const sampleTeamActivities: TeamActivity[] = [
    {
      teamId: 'team-defi-1',
      action: 'xp_earned',
      details: 'Completed stablecoin protocol challenge',
      timestamp: Date.now() - (2 * 60 * 60 * 1000),
      actor: '0xDEV1'
    },
    {
      teamId: 'team-zk-1',
      action: 'badge_awarded',
      details: 'Earned Privacy Guardians badge',
      timestamp: Date.now() - (4 * 60 * 60 * 1000),
      actor: '0xZKLEADER'
    },
    {
      teamId: 'team-ai-1',
      action: 'member_joined',
      details: '0xVISION1 joined Neural Architects',
      timestamp: Date.now() - (6 * 60 * 60 * 1000),
      actor: '0xVISION1'
    }
  ];

  teamActivities.push(...sampleTeamActivities);
};

// Initialize on module load
initializeDreamClouds();

// GET /api/dream-clouds/bounties - Get all bounties across all dreams  
router.get('/bounties', async (req, res) => {
  try {
    const bounties: any[] = [];
    
    cloudDreams.forEach((dream, dreamId) => {
      if (dream.bounty) {
        bounties.push({
          bountyId: dream.bounty.bountyId || `bounty-${dreamId}`,
          dreamId: dreamId,
          token: dream.bounty.token,
          amount: dream.bounty.amount,
          claimed: dream.bounty.claimed,
          expires: dream.bounty.expires,
          claimedBy: dream.bounty.claimedBy,
          claimer: dream.bounty.claimer,
          submission: dream.bounty.submission,
          proof: dream.bounty.proof,
          claimSubmission: dream.bounty.claimSubmission,
          claimProof: dream.bounty.claimProof,
          claimDate: dream.bounty.claimDate,
          hiddenBonus: dream.bounty.hiddenBonus
        });
      }
    });

    res.json(bounties);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch bounties',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/dream-clouds - Get all dream clouds
router.get('/', async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'] as string;
    const clouds = Array.from(dreamClouds.values());
    
    // Filter clouds based on trust requirements
    const userTrust = 85; // Mock user trust score
    const accessibleClouds = clouds.filter(cloud => userTrust >= cloud.trustRequired);
    
    res.json({
      success: true,
      clouds: accessibleClouds,
      userTrust,
      totalClouds: clouds.length,
      accessibleCount: accessibleClouds.length
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch dream clouds',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/dream-clouds/stats - Get cloud statistics
router.get('/stats', async (req, res) => {
  try {
    const clouds = Array.from(dreamClouds.values());
    
    const stats: DreamCloudStats = {
      totalClouds: clouds.length,
      totalDreams: clouds.reduce((sum, cloud) => sum + cloud.dreams.length, 0),
      topPerformingCloud: clouds.reduce((top, cloud) => 
        cloud.remixXP > (dreamClouds.get(top)?.remixXP || 0) ? cloud.id : top, 
        clouds[0]?.id || ''
      ),
      averageRemixXP: clouds.reduce((sum, cloud) => sum + cloud.remixXP, 0) / clouds.length,
      activeNodes: Array.from(new Set(clouds.flatMap(cloud => cloud.nodeAffinity || [])))
    };

    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch cloud stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/dream-clouds/:id - Get specific cloud details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cloud = dreamClouds.get(id);
    
    if (!cloud) {
      return res.status(404).json({
        error: 'Dream cloud not found',
        cloudId: id
      });
    }

    // Get recent activities for this cloud
    const recentActivities = cloudActivities
      .filter(activity => activity.cloudId === id)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);

    res.json({
      success: true,
      cloud,
      recentActivities,
      dreamCount: cloud.dreams.length,
      agentCount: cloud.activeAgents.length
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch cloud details',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/dream-clouds - Create new dream cloud
router.post('/', async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'] as string;
    const { name, description, themeColor, icon, trustRequired, nodeAffinity } = req.body;

    if (!name || !description || !themeColor) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'description', 'themeColor']
      });
    }

    const newCloud: DreamCloud = {
      id: `cloud-${Date.now().toString(36)}`,
      name,
      description,
      themeColor,
      icon: icon || '☁️',
      dreams: [],
      remixXP: 0,
      nodeAffinity: nodeAffinity || [],
      activeAgents: [],
      trustRequired: trustRequired || 50,
      createdBy: walletAddress || '0xANON',
      createdAt: Date.now()
    };

    dreamClouds.set(newCloud.id, newCloud);

    // Add activity
    cloudActivities.push({
      cloudId: newCloud.id,
      action: 'dream_added',
      details: `New cloud "${name}" created`,
      timestamp: Date.now(),
      actor: walletAddress || '0xANON'
    });

    res.json({
      success: true,
      cloud: newCloud,
      message: 'Dream cloud created successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to create dream cloud',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/dream-clouds/:id/add-dream - Add dream to cloud
router.post('/:id/add-dream', async (req, res) => {
  try {
    const { id } = req.params;
    const { dreamId } = req.body;
    const walletAddress = req.headers['x-wallet-address'] as string;

    const cloud = dreamClouds.get(id);
    if (!cloud) {
      return res.status(404).json({
        error: 'Dream cloud not found',
        cloudId: id
      });
    }

    if (!dreamId) {
      return res.status(400).json({
        error: 'Dream ID required'
      });
    }

    if (cloud.dreams.includes(dreamId)) {
      return res.status(400).json({
        error: 'Dream already exists in this cloud'
      });
    }

    cloud.dreams.push(dreamId);
    cloud.remixXP += 100; // Bonus XP for adding dreams

    // Add activity
    cloudActivities.push({
      cloudId: id,
      action: 'dream_added',
      details: `Dream ${dreamId} added to ${cloud.name}`,
      timestamp: Date.now(),
      actor: walletAddress || '0xANON'
    });

    res.json({
      success: true,
      cloud,
      message: 'Dream added to cloud successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to add dream to cloud',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/dream-clouds/:id/dreams - Get dreams in a specific cloud
router.get('/:id/dreams', async (req, res) => {
  try {
    const { id } = req.params;
    const cloud = dreamClouds.get(id);
    
    if (!cloud) {
      return res.status(404).json({
        error: 'Dream cloud not found',
        cloudId: id
      });
    }

    const dreamsInCloud = Array.from(cloudDreams.values())
      .filter(dream => dream.cloudId === id)
      .sort((a, b) => b.createdAt - a.createdAt);

    res.json({
      success: true,
      cloudId: id,
      cloudName: cloud.name,
      dreams: dreamsInCloud,
      totalDreams: dreamsInCloud.length,
      totalRemixXP: dreamsInCloud.reduce((sum, dream) => sum + dream.remixXP, 0)
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch cloud dreams',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/dream-clouds/dreams - Create new dream in cloud
router.post('/dreams', async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'] as string;
    const { title, cloudId, tags, remixXP = 0 } = req.body;

    if (!title || !cloudId) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['title', 'cloudId']
      });
    }

    const cloud = dreamClouds.get(cloudId);
    if (!cloud) {
      return res.status(404).json({
        error: 'Dream cloud not found',
        cloudId
      });
    }

    const newDream: CloudDream = {
      id: `dream-${Date.now().toString(36)}`,
      title,
      cloudId,
      tags: tags || [],
      remixXP,
      creator: walletAddress || '0xANON',
      status: 'active',
      trustLevel: 'Medium',
      nightmare: false,
      claimedBy: walletAddress || '0xANON',
      remix: {
        initiated: false,
        result: null,
        score: null
      },
      bounty: null,
      createdAt: Date.now()
    };

    cloudDreams.set(newDream.id, newDream);
    cloud.dreams.push(newDream.id);
    cloud.remixXP += 50; // Bonus XP for adding dreams

    // Add activity
    cloudActivities.push({
      cloudId,
      action: 'dream_added',
      details: `Dream "${title}" created in ${cloud.name}`,
      timestamp: Date.now(),
      actor: walletAddress || '0xANON'
    });

    res.json({
      success: true,
      dream: newDream,
      cloud: cloud,
      message: 'Dream created successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to create dream',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/dream-clouds/activities - Get recent cloud activities
router.get('/activities', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    
    const recentActivities = cloudActivities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
      .map(activity => ({
        ...activity,
        cloudName: dreamClouds.get(activity.cloudId)?.name || 'Unknown Cloud'
      }));

    res.json({
      success: true,
      activities: recentActivities,
      totalActivities: cloudActivities.length
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch activities',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/dream-clouds/:id/join - Join a cloud
router.post('/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    const walletAddress = req.headers['x-wallet-address'] as string;

    const cloud = dreamClouds.get(id);
    if (!cloud) {
      return res.status(404).json({
        error: 'Dream cloud not found',
        cloudId: id
      });
    }

    // Check trust requirements
    const userTrust = 85; // Mock user trust score
    if (userTrust < cloud.trustRequired) {
      return res.status(403).json({
        error: 'Insufficient trust level',
        required: cloud.trustRequired,
        current: userTrust
      });
    }

    // Add activity for joining
    cloudActivities.push({
      cloudId: id,
      action: 'agent_activated',
      details: `User joined ${cloud.name} cloud`,
      timestamp: Date.now(),
      actor: walletAddress || '0xANON'
    });

    // Could track user memberships in a real system
    res.json({
      success: true,
      cloudId: id,
      cloudName: cloud.name,
      message: `Successfully joined ${cloud.name} cloud`,
      userTrust,
      trustRequired: cloud.trustRequired
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to join cloud',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/dream-clouds/:id/teams - Get teams in a specific cloud
router.get('/:id/teams', async (req, res) => {
  try {
    const { id } = req.params;
    const cloud = dreamClouds.get(id);
    
    if (!cloud) {
      return res.status(404).json({
        error: 'Dream cloud not found',
        cloudId: id
      });
    }

    const teamsInCloud = Array.from(dreamTeams.values())
      .filter(team => team.cloudId === id && team.public)
      .sort((a, b) => b.xp - a.xp);

    res.json({
      success: true,
      cloudId: id,
      cloudName: cloud.name,
      teams: teamsInCloud,
      totalTeams: teamsInCloud.length,
      totalXP: teamsInCloud.reduce((sum, team) => sum + team.xp, 0)
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch cloud teams',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/dream-teams - Create new dream team
router.post('/teams', async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'] as string;
    const { name, cloudId, badge = 'Newcomers', isPublic = true, logoUrl } = req.body;

    if (!name || !cloudId) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'cloudId']
      });
    }

    const cloud = dreamClouds.get(cloudId);
    if (!cloud) {
      return res.status(404).json({
        error: 'Dream cloud not found',
        cloudId
      });
    }

    const newTeam: DreamTeam = {
      id: `team-${Date.now().toString(36)}`,
      name,
      leader: walletAddress || '0xANON',
      members: [walletAddress || '0xANON'],
      cloudId,
      xp: 0,
      badge,
      public: isPublic,
      logoUrl,
      createdAt: Date.now()
    };

    dreamTeams.set(newTeam.id, newTeam);

    // Add team activity
    teamActivities.push({
      teamId: newTeam.id,
      action: 'member_joined',
      details: `Team "${name}" created in ${cloud.name}`,
      timestamp: Date.now(),
      actor: walletAddress || '0xANON'
    });

    res.json({
      success: true,
      team: newTeam,
      message: 'Dream team created successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to create team',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/dream-teams/:id/join - Join a dream team
router.post('/teams/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    const walletAddress = req.headers['x-wallet-address'] as string;

    const team = dreamTeams.get(id);
    if (!team) {
      return res.status(404).json({
        error: 'Dream team not found',
        teamId: id
      });
    }

    if (!team.public) {
      return res.status(403).json({
        error: 'Team is private - invitation required'
      });
    }

    if (team.members.includes(walletAddress)) {
      return res.status(400).json({
        error: 'Already a member of this team'
      });
    }

    team.members.push(walletAddress);

    // Add team activity
    teamActivities.push({
      teamId: id,
      action: 'member_joined',
      details: `${walletAddress.slice(0, 8)}... joined ${team.name}`,
      timestamp: Date.now(),
      actor: walletAddress
    });

    res.json({
      success: true,
      team,
      message: `Successfully joined ${team.name}`
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to join team',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/dream-teams/:id - Get team details
router.get('/teams/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const team = dreamTeams.get(id);
    
    if (!team) {
      return res.status(404).json({
        error: 'Dream team not found',
        teamId: id
      });
    }

    // Get recent team activities
    const recentActivities = teamActivities
      .filter(activity => activity.teamId === id)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);

    res.json({
      success: true,
      team,
      recentActivities,
      memberCount: team.members.length
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch team details',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/dream-clouds/:dreamId/bounty - Create or update a dream bounty
router.post('/:dreamId/bounty', async (req, res) => {
  try {
    const { dreamId } = req.params;
    const { token, amount, expires } = req.body;
    const walletAddress = req.headers['x-wallet-address'] as string;

    if (!token || !amount || !expires) {
      return res.status(400).json({
        error: 'Missing required bounty fields',
        required: ['token', 'amount', 'expires']
      });
    }

    const dream = cloudDreams.get(dreamId);
    if (!dream) {
      return res.status(404).json({
        error: 'Dream not found',
        dreamId
      });
    }

    // Create new bounty with your exact structure
    dream.bounty = {
      token,
      amount,
      expires,
      claimed: false,
      claimedBy: null,
      bountyId: `bounty-${Date.now()}`,
      claimer: undefined,
      submission: undefined,
      proof: undefined,
      claimSubmission: undefined,
      claimProof: undefined,
      claimDate: undefined,
      hiddenBonus: req.body.hiddenBonus || false
    };

    res.json({
      success: true,
      dream,
      message: `Bounty created: ${amount} ${token} tokens`
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to create bounty',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/dream-clouds/:dreamId/claim-bounty - Claim a dream bounty
router.post('/:dreamId/claim-bounty', async (req, res) => {
  try {
    const { dreamId } = req.params;
    const walletAddress = req.headers['x-wallet-address'] as string;

    const dream = cloudDreams.get(dreamId);
    if (!dream) {
      return res.status(404).json({
        error: 'Dream not found',
        dreamId
      });
    }

    if (!dream.bounty) {
      return res.status(400).json({
        error: 'No bounty available for this dream'
      });
    }

    if (dream.bounty.claimed) {
      return res.status(400).json({
        error: 'Bounty already claimed',
        claimedBy: dream.bounty.claimedBy
      });
    }

    if (dream.bounty.expires < Date.now()) {
      return res.status(400).json({
        error: 'Bounty has expired'
      });
    }

    // Claim the bounty
    dream.bounty.claimed = true;
    dream.bounty.claimedBy = walletAddress;
    dream.bounty.claimer = walletAddress;
    dream.bounty.claimDate = Date.now();

    res.json({
      success: true,
      dream,
      message: `Successfully claimed ${dream.bounty.amount} ${dream.bounty.token} tokens`
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to claim bounty',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/dream-clouds/:dreamId/submit-bounty - Submit bounty work with proof
router.post('/:dreamId/submit-bounty', async (req, res) => {
  try {
    const { dreamId } = req.params;
    const { bountyId, claimer, submission, proof } = req.body;
    const walletAddress = req.headers['x-wallet-address'] as string;

    if (!bountyId || !claimer || !submission) {
      return res.status(400).json({
        error: 'Missing required submission fields',
        required: ['bountyId', 'claimer', 'submission']
      });
    }

    const dream = cloudDreams.get(dreamId);
    if (!dream) {
      return res.status(404).json({
        error: 'Dream not found',
        dreamId
      });
    }

    if (!dream.bounty) {
      return res.status(400).json({
        error: 'No bounty available for this dream'
      });
    }

    if (dream.bounty.claimed && dream.bounty.claimedBy !== walletAddress) {
      return res.status(400).json({
        error: 'Bounty already claimed by another user',
        claimedBy: dream.bounty.claimedBy
      });
    }

    // Update bounty with submission details
    dream.bounty.bountyId = bountyId;
    dream.bounty.claimer = claimer;
    dream.bounty.submission = submission;
    dream.bounty.proof = proof || '';
    dream.bounty.claimSubmission = submission;
    dream.bounty.claimProof = proof || '';
    dream.bounty.claimDate = Date.now();
    dream.bounty.claimed = true;
    dream.bounty.claimedBy = walletAddress;

    res.json({
      success: true,
      dream,
      message: `Bounty submission recorded for ${dream.bounty.amount} ${dream.bounty.token} tokens`,
      submission: {
        bountyId,
        claimer,
        submission,
        proof: proof || 'No proof provided'
      }
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to submit bounty',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/dream-clouds/teams/public - Get all public teams across all clouds
router.get('/teams/public', async (req, res) => {
  try {
    const publicTeams = Array.from(dreamTeams.values())
      .filter(team => team.public)
      .sort((a, b) => b.xp - a.xp);

    res.json({
      success: true,
      teams: publicTeams,
      totalTeams: publicTeams.length
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch public teams',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/dream-clouds/:dreamId/remix-submission - Submit a remix for a dream
router.post('/:dreamId/remix-submission', async (req, res) => {
  try {
    const { dreamId } = req.params;
    const { remixId, claimer, submission, proof, remixThread } = req.body;
    const walletAddress = req.headers['x-wallet-address'] as string;

    if (!walletAddress) {
      return res.status(401).json({ error: 'Wallet address required' });
    }

    if (!remixId || !claimer || !submission) {
      return res.status(400).json({ 
        error: 'Missing required fields: remixId, claimer, submission' 
      });
    }

    const dream = cloudDreams.get(dreamId);
    if (!dream) {
      return res.status(404).json({ error: 'Dream not found' });
    }

    // Initialize remixes array if it doesn't exist
    if (!dream.remix.remixes) {
      dream.remix.remixes = [];
    }

    // Create remix submission
    const remixSubmission = {
      remixId,
      claimer,
      submission,
      status: 'pending' as const,
      submittedAt: Date.now(),
      proof: proof || undefined,
      score: undefined,
      remixThread: remixThread || undefined
    };

    // Add to remixes array
    dream.remix.remixes.push(remixSubmission);
    dream.remix.initiated = true;

    res.json({
      success: true,
      dream: {
        id: dream.id,
        title: dream.title,
        originalDream: {
          id: dream.id,
          title: dream.title,
          creator: dream.creator,
          tags: dream.tags,
          trustLevel: dream.trustLevel
        },
        remixes: dream.remix.remixes
      },
      remixSubmission,
      message: `Remix submission ${remixId} recorded for dream ${dreamId}`
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to submit remix',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/dream-clouds/:dreamId/remixes - Get all remixes for a dream
router.get('/:dreamId/remixes', async (req, res) => {
  try {
    const { dreamId } = req.params;
    const dream = cloudDreams.get(dreamId);
    
    if (!dream) {
      return res.status(404).json({ error: 'Dream not found' });
    }

    res.json({
      originalDream: {
        id: dream.id,
        title: dream.title,
        creator: dream.creator,
        tags: dream.tags,
        trustLevel: dream.trustLevel,
        status: dream.status
      },
      remixes: dream.remix.remixes || []
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch remixes',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/dreams/:dreamId/revive - Attempt to revive a dead dream
router.post('/:dreamId/revive', async (req, res) => {
  try {
    const { dreamId } = req.params;
    const walletAddress = req.headers['x-wallet-address'] as string;

    if (!walletAddress) {
      return res.status(401).json({ error: 'Wallet address required for revival attempt' });
    }

    // Mock revival logic - in real implementation would check conditions
    const revivalSuccess = Math.random() > 0.5; // 50% success rate

    if (revivalSuccess) {
      res.json({
        success: true,
        message: `Dream ${dreamId} has been successfully revived!`,
        revivedBy: walletAddress,
        revivedAt: Date.now(),
        newStatus: 'revived'
      });
    } else {
      res.json({
        success: false,
        message: `Revival attempt failed. The dream ${dreamId} remains in the graveyard.`,
        attemptedBy: walletAddress,
        attemptedAt: Date.now(),
        reason: 'Insufficient spiritual energy'
      });
    }

  } catch (error) {
    res.status(500).json({
      error: 'Revival attempt failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/dreams/graveyard - Get archived/deleted dreams
router.get('/graveyard', async (req, res) => {
  try {
    const graveyardDreams = [
      {
        dreamId: "dream666",
        title: "Decentralized Graveyard on-chain",
        status: "abandoned",
        deathReason: "No submissions",
        dateAbandoned: 1723980000,
        lastAttemptedBy: "walletXYZ"
      },
      {
        dreamId: "dream404",
        title: "Lost NFT Recovery System",
        status: "failed",
        deathReason: "Technical impossibility",
        dateAbandoned: 1723900000,
        lastAttemptedBy: "0xRECOVER"
      },
      {
        dreamId: "dream000",
        title: "Zero-Knowledge Void Protocol",
        status: "quarantined",
        deathReason: "Security vulnerabilities",
        dateAbandoned: 1723800000,
        lastAttemptedBy: "0xVOID"
      },
      {
        dreamId: "dreamDEAD",
        title: "Expired Meme Token Factory",
        status: "expired",
        deathReason: "Bounty deadline passed",
        dateAbandoned: 1723700000,
        lastAttemptedBy: "0xMEMELORD"
      },
      {
        dreamId: "dreamGONE",
        title: "Vanished DeFi Yield Farm",
        status: "abandoned",
        deathReason: "Creator disappeared",
        dateAbandoned: 1723600000,
        lastAttemptedBy: "0xFARMER"
      },
      {
        dreamId: "dreamBROKE",
        title: "Broken Cross-Chain Bridge",
        status: "failed",
        deathReason: "Consensus mechanism flawed",
        dateAbandoned: 1723500000,
        lastAttemptedBy: "0xBRIDGE"
      },
      {
        dreamId: "dreamTOXIC",
        title: "Toxic Social Protocol",
        status: "banned",
        deathReason: "Community guidelines violation",
        dateAbandoned: 1723400000,
        lastAttemptedBy: "0xTOXIC"
      },
      {
        dreamId: "dreamEMPTY",
        title: "Empty Promise DAO",
        status: "abandoned",
        deathReason: "No community interest",
        dateAbandoned: 1723300000,
        lastAttemptedBy: "0xPROMISE"
      }
    ];

    res.json(graveyardDreams);

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch graveyard',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/god/dreams - Get dreams requiring god-level intervention
router.get('/dreams', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'] as string;
    
    if (adminKey !== 'GOD_MODE_ACCESS') {
      return res.status(403).json({ error: 'Divine access required' });
    }

    const godDreams = [
      {
        dreamId: 'decentralized-wishlist-vault',
        title: 'Decentralized Wishlist Vault',
        status: 'active',
        trustScore: 23,
        infected: true,
        remixCount: 7,
        bountyAmount: 2500,
        lastActivity: Date.now() - 3600000
      },
      {
        dreamId: 'shadow-token-farm',
        title: 'Shadow Token Farm',
        status: 'quarantined',
        trustScore: 15,
        infected: true,
        remixCount: 12,
        bountyAmount: 5000,
        lastActivity: Date.now() - 7200000
      },
      {
        dreamId: 'viral-memecoin-bot',
        title: 'Viral Memecoin Bot',
        status: 'pending',
        trustScore: 45,
        infected: false,
        remixCount: 23,
        bountyAmount: 1500,
        lastActivity: Date.now() - 1800000
      },
      {
        dreamId: 'quantum-exploit-chain',
        title: 'Quantum Exploit Chain',
        status: 'active',
        trustScore: 8,
        infected: true,
        remixCount: 3,
        bountyAmount: 10000,
        lastActivity: Date.now() - 900000
      }
    ];

    res.json(godDreams);

  } catch (error) {
    res.status(500).json({
      error: 'God terminal access failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/god/execute - Execute god-level commands
router.post('/execute', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'] as string;
    
    if (adminKey !== 'GOD_MODE_ACCESS') {
      return res.status(403).json({ error: 'Divine access required' });
    }

    const { action, dreamId, params } = req.body;

    let result;
    switch (action) {
      case 'purge':
        result = {
          success: true,
          message: `Dream ${dreamId} has been purged from all dimensions`,
          action: 'purge',
          timestamp: Date.now(),
          effect: 'Dream removed from active ecosystem'
        };
        break;
        
      case 'bonus':
        result = {
          success: true,
          message: `Divine bonus of ${params?.amount || 1000} SHEEP tokens sent to dream ${dreamId}`,
          action: 'bonus',
          timestamp: Date.now(),
          effect: 'Bonus tokens distributed to dream contributors'
        };
        break;
        
      case 'infect-tree':
        result = {
          success: true,
          message: `Infection spread through remix tree of dream ${dreamId}`,
          action: 'infect-tree',
          timestamp: Date.now(),
          effect: 'All remix children marked as infected'
        };
        break;
        
      case 'quarantine':
        result = {
          success: true,
          message: `Dream ${dreamId} has been quarantined`,
          action: 'quarantine',
          timestamp: Date.now(),
          effect: 'Dream isolated from ecosystem interactions'
        };
        break;
        
      default:
        result = {
          success: false,
          message: `Unknown god command: ${action}`,
          action,
          timestamp: Date.now()
        };
    }

    res.json(result);

  } catch (error) {
    res.status(500).json({
      error: 'God command execution failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/teams/management - Get team management data
router.get('/management', async (req, res) => {
  try {
    const teams = [
      {
        teamId: 'teamAlpha',
        name: 'The Restorers',
        description: 'Elite revival specialists focused on restoring abandoned dreams',
        memberCount: 2,
        totalXP: 15420,
        cloudId: 'defi-vaults',
        createdAt: Date.now() - 2592000000, // 30 days ago
        isPublic: true,
        maxMembers: 12,
        members: ['walletA', 'walletB'],
        revivedDreams: 5,
        currentBounties: 2,
        specialization: 'Dream Revival & Restoration'
      },
      {
        teamId: 'teamBeta',
        name: 'Beta Architects',
        description: 'Building the future of AI-powered dream processing',
        memberCount: 5,
        totalXP: 9870,
        cloudId: 'ai-research',
        createdAt: Date.now() - 1814400000, // 21 days ago
        isPublic: true,
        maxMembers: 10,
        members: ['walletC', 'walletD', 'walletE', 'walletF', 'walletG'],
        revivedDreams: 3,
        currentBounties: 7,
        specialization: 'AI System Architecture'
      },
      {
        teamId: 'teamGamma',
        name: 'Gamma Guardians',
        description: 'Privacy-first team developing zero-knowledge solutions',
        memberCount: 12,
        totalXP: 22340,
        cloudId: 'zk-privacy',
        createdAt: Date.now() - 3456000000, // 40 days ago
        isPublic: false,
        maxMembers: 15,
        members: ['walletH', 'walletI', 'walletJ', 'walletK', 'walletL', 'walletM', 'walletN', 'walletO', 'walletP', 'walletQ', 'walletR', 'walletS'],
        revivedDreams: 12,
        currentBounties: 4,
        specialization: 'Zero-Knowledge Privacy'
      },
      {
        teamId: 'teamDelta',
        name: 'Delta Memers',
        description: 'Creating viral memes and cultural phenomena',
        memberCount: 20,
        totalXP: 31250,
        cloudId: 'meme-factory',
        createdAt: Date.now() - 1209600000, // 14 days ago
        isPublic: true,
        maxMembers: 25,
        members: ['walletT', 'walletU', 'walletV', 'walletW', 'walletX', 'walletY', 'walletZ', 'wallet1', 'wallet2', 'wallet3', 'wallet4', 'wallet5', 'wallet6', 'wallet7', 'wallet8', 'wallet9', 'wallet10', 'wallet11', 'wallet12', 'wallet13'],
        revivedDreams: 8,
        currentBounties: 15,
        specialization: 'Viral Content Creation'
      }
    ];

    const myMemberships = [
      {
        teamId: 'teamAlpha',
        roles: ['reviver', 'scout'],
        badges: ['dream-savior', 'glitch-tamer'],
        walletAddress: '0xTEAM_MEMBER',
        joinedAt: Date.now() - 1814400000, // 21 days ago
        xpContributed: 2340,
        lastActive: Date.now() - 3600000 // 1 hour ago
      }
    ];

    const availableRoles = ['reviver', 'scout', 'guardian', 'architect', 'hunter', 'mentor'];
    const availableBadges = ['dream-savior', 'glitch-tamer', 'bounty-hunter', 'remix-master', 'first-steps', 'bone-collector'];

    res.json({
      teams,
      myMemberships,
      availableRoles,
      availableBadges
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch team management data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/teams/:teamId/join - Join a team with specified roles
router.post('/:teamId/join', async (req, res) => {
  try {
    const { teamId } = req.params;
    const { roles } = req.body;
    const walletAddress = req.headers['x-wallet-address'] as string;

    if (!walletAddress) {
      return res.status(401).json({ error: 'Wallet address required' });
    }

    if (!roles || !Array.isArray(roles)) {
      return res.status(400).json({ error: 'Roles array required' });
    }

    res.json({
      success: true,
      teamId,
      walletAddress,
      roles,
      badges: [], // Start with no badges
      joinedAt: Date.now(),
      message: `Successfully joined ${teamId} with roles: ${roles.join(', ')}`
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to join team',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/teams/:teamId/update-profile - Update team member profile
router.put('/:teamId/update-profile', async (req, res) => {
  try {
    const { teamId } = req.params;
    const { roles, badges } = req.body;
    const walletAddress = req.headers['x-wallet-address'] as string;

    if (!walletAddress) {
      return res.status(401).json({ error: 'Wallet address required' });
    }

    res.json({
      success: true,
      teamId,
      walletAddress,
      roles: roles || [],
      badges: badges || [],
      updatedAt: Date.now(),
      message: `Profile updated for ${teamId}`
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to update profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/cloud-agents - Get deployed cloud agents
router.get('/agents', async (req, res) => {
  try {
    const cloudAgents = [
      {
        cloudId: 'zk-guardians',
        agentName: 'NullProof',
        levelUnlocked: 5,
        abilities: ['validateBounties', 'fogProtect', 'zeroKnowledgeCheck'],
        personality: 'Silent and secure. Doesn\'t speak unless necessary.',
        currentTasks: ['Protect remix #0892', 'Review bounty ZK-B7'],
        status: 'deployed',
        deployedAt: Date.now() - 7200000, // 2 hours ago
        taskHistory: ['Validated bounty ZK-B3', 'Protected remix #0875', 'Performed ZK audit on dream-vault-7'],
        logs: [
          '[2025-01-04 00:15:32] Agent NullProof deployed to zk-guardians cloud',
          '[2025-01-04 00:16:45] Task assigned: Protect remix #0892',
          '[2025-01-04 00:17:12] Fog protection activated for remix #0892',
          '[2025-01-04 00:18:30] Task assigned: Review bounty ZK-B7',
          '[2025-01-04 00:19:15] Zero-knowledge validation initiated for ZK-B7',
          '[2025-01-04 00:20:42] ZK-B7 bounty validation: PASSED'
        ]
      },
      {
        cloudId: 'defi-vaults',
        agentName: 'YieldGuard',
        levelUnlocked: 7,
        abilities: ['riskAssessment', 'yieldOptimization', 'liquidityProtection'],
        personality: 'Analytical and cautious. Always calculates risk-reward ratios.',
        currentTasks: ['Monitor vault TVL-9', 'Optimize yield strategy DV-15'],
        status: 'active',
        deployedAt: Date.now() - 14400000, // 4 hours ago
        taskHistory: ['Optimized vault yield by 3.2%', 'Prevented rug pull on DV-12', 'Risk assessment on new token pairs'],
        logs: [
          '[2025-01-03 20:15:00] Agent YieldGuard deployed to defi-vaults cloud',
          '[2025-01-03 20:30:15] Yield optimization completed: +3.2% APY',
          '[2025-01-03 22:45:30] Risk alert: High volatility detected in vault TVL-9',
          '[2025-01-04 00:12:45] Liquidity protection activated for DV-15'
        ]
      },
      {
        cloudId: 'ai-research',
        agentName: 'CogniCore',
        levelUnlocked: 6,
        abilities: ['patternRecognition', 'dreamAnalysis', 'neuralNetworkOptimization'],
        personality: 'Curious and methodical. Constantly learning and adapting.',
        currentTasks: ['Analyze dream pattern AI-R23', 'Train neural model v4.2'],
        status: 'active',
        deployedAt: Date.now() - 10800000, // 3 hours ago
        taskHistory: ['Trained model accuracy to 94.7%', 'Discovered new dream correlation patterns', 'Optimized inference speed by 40%'],
        logs: [
          '[2025-01-03 21:30:00] Agent CogniCore deployed to ai-research cloud',
          '[2025-01-03 22:15:30] Pattern recognition accuracy improved to 94.7%',
          '[2025-01-04 00:00:15] Neural network optimization: 40% speed increase',
          '[2025-01-04 00:25:45] Dream analysis initiated for pattern AI-R23'
        ]
      }
    ];

    res.json(cloudAgents);

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch cloud agents',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/cloud-agents/assign-task - Assign task to cloud agent
router.post('/assign-task', async (req, res) => {
  try {
    const { agentName, task, priority } = req.body;

    if (!agentName || !task) {
      return res.status(400).json({ error: 'Agent name and task required' });
    }

    res.json({
      success: true,
      agentName,
      task,
      priority: priority || 'medium',
      assignedAt: Date.now(),
      taskId: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: `Task assigned to ${agentName}: ${task}`
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to assign task',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/godmode/bless-cloud/:cloudId - Bestow divine blessing on cloud
router.post('/bless-cloud/:cloudId', async (req, res) => {
  try {
    const { cloudId } = req.params;
    const blessedBy = req.body.blessedBy || "0xGODADDRESS";
    
    const blessingData = {
      cloudId,
      blessedBy,
      timestamp: Math.floor(Date.now() / 1000),
      totalReward: 10_000,
      token: "SHEEP",
      distribution: {
        dreamCreator: "0xabc...123",
        topContributor: "0xdef...456", 
        team: ["0x1", "0x2", "0x3"],
        agentMaintainer: "0xbot...999",
        randoms: ["0xa", "0xb"]
      },
      blessingType: "divine",
      status: "completed",
      message: `Cloud ${cloudId} has been blessed with 10,000 SHEEP tokens`
    };

    res.json(blessingData);

  } catch (error) {
    res.status(500).json({
      error: 'Failed to bless cloud',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/dreams/fossilized - Get fossilized dreams
router.get('/fossilized', async (req, res) => {
  try {
    const fossilizedDreams = [
      {
        id: "dream998",
        title: "Dream of the DeFi Phoenix",
        status: "fossilized",
        fossilData: {
          archivedOn: 1720000000, // July 2, 2024
          remixLineage: [
            { id: "remix-001", author: "0xabc", date: 1720000001, title: "Enhanced Yield Strategy" },
            { id: "remix-005", author: "0xdef", date: 1720034567, title: "Phoenix Rebirth Protocol" }
          ],
          resurrectionEligible: true,
          fossilType: "Legendary"
        },
        originalCreator: "0x789...def",
        cloudId: "defi-vaults",
        lastActive: "July 2, 2025",
        description: "A legendary DeFi protocol that could revolutionize yield farming",
        tags: ["defi", "yield", "phoenix", "legendary"]
      },
      {
        id: "dream777",
        title: "Quantum Dream Weaver",
        status: "fossilized", 
        fossilData: {
          archivedOn: 1719000000,
          remixLineage: [
            { id: "remix-003", author: "0xqwe", date: 1719001000, title: "Quantum Entanglement Layer" },
            { id: "remix-007", author: "0xrty", date: 1719045000, title: "Dream State Quantum Bridge" },
            { id: "remix-012", author: "0xuio", date: 1719089000, title: "Multiverse Dream Portal" }
          ],
          resurrectionEligible: true,
          fossilType: "Epic"
        },
        originalCreator: "0x456...abc",
        cloudId: "ai-research",
        lastActive: "June 15, 2024",
        description: "A quantum-powered dream manipulation system with multiverse capabilities",
        tags: ["quantum", "ai", "dreams", "multiverse"]
      }
    ];

    res.json(fossilizedDreams);

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch fossilized dreams',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/dreams/:dreamId/resurrect - Resurrect fossilized dream
router.post('/:dreamId/resurrect', async (req, res) => {
  try {
    const { dreamId } = req.params;
    const { resurrectedBy } = req.body;

    const resurrectionData = {
      dreamId,
      resurrectedBy: resurrectedBy || "0xresurrector",
      resurrectionTimestamp: Date.now(),
      newStatus: "active",
      resurrectionCost: "500 SHEEP",
      bonusXP: 1000,
      message: `Dream ${dreamId} has been successfully resurrected!`,
      newDreamId: `${dreamId}_resurrected_${Date.now()}`
    };

    res.json(resurrectionData);

  } catch (error) {
    res.status(500).json({
      error: 'Failed to resurrect dream',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/dream-teams - Get dream teams data
router.get('/teams', async (req, res) => {
  try {
    const dreamTeams = [
      {
        teamId: "team-zk-guardians",
        name: "ZK Guardians",
        cloud: "zk-cloud",
        members: [
          {
            wallet: "0xabc...123",
            role: "Reviver",
            xp: 4200,
            revivals: 7,
            badges: ["Healer", "OG", "Blessed"],
            joined: 1720349201
          },
          {
            wallet: "0xdef...456",
            role: "Strategist",
            xp: 3000,
            revivals: 3,
            badges: ["Strategist", "Sheep"],
            joined: 1720435601
          }
        ],
        teamXP: 12000,
        rank: "Gold",
        currentBounties: 2,
        completedMissions: 15
      },
      {
        teamId: "team-defi-builders",
        name: "DeFi Builders",
        cloud: "defi-vaults",
        members: [
          {
            wallet: "0x789...abc",
            role: "Guardian",
            xp: 5500,
            revivals: 12,
            badges: ["Guardian", "Explorer", "Reviver"],
            joined: 1719744001
          },
          {
            wallet: "0x321...def",
            role: "Architect",
            xp: 3800,
            revivals: 5,
            badges: ["Architect", "OG"],
            joined: 1720003201
          }
        ],
        teamXP: 18500,
        rank: "Diamond",
        currentBounties: 4,
        completedMissions: 23
      }
    ];

    res.json(dreamTeams);

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch dream teams',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/dream-teams/activities - Get team activity feed
router.get('/teams/activities', async (req, res) => {
  try {
    const activities = [
      {
        logId: "log-07893",
        timestamp: 1724934500,
        type: "resurrection",
        actor: "0xDreamLordA12...",
        target: "dream123",
        description: "Revived legendary fossil Dream of the ZK Phoenix",
        impact: ["XP +500", "Unlocked DreamCore NFT", "Team ZK Guardians +100 XP"]
      },
      {
        logId: "log-07894",
        timestamp: 1724930900,
        type: "bounty",
        actor: "0xBountyHunter...",
        target: "bounty-ZK-B7",
        description: "Completed ZK verification bounty for privacy protocol",
        impact: ["1000 SHEEP tokens", "XP +300", "Badge: ZK Master"]
      },
      {
        logId: "log-07895",
        timestamp: 1724927300,
        type: "mission",
        actor: "0xTeamLeader...",
        target: "mission-vault-secure",
        description: "Secured DeFi vault against exploit attempt",
        impact: ["Team XP +250", "Saved 50k USDC", "Badge: Guardian"]
      }
    ];

    res.json(activities);

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch team activities',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/dream-teams/:teamId/invite - Invite member to team
router.post('/teams/:teamId/invite', async (req, res) => {
  try {
    const { teamId } = req.params;
    const { wallet } = req.body;

    res.json({
      success: true,
      teamId,
      invitedWallet: wallet,
      inviteId: `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: `Invitation sent to ${wallet} for team ${teamId}`,
      timestamp: Date.now()
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to send team invite',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/dream-teams/:teamId/assign-bounty - Assign bounty to team
router.post('/teams/:teamId/assign-bounty', async (req, res) => {
  try {
    const { teamId } = req.params;
    const { title } = req.body;

    res.json({
      success: true,
      teamId,
      bountyTitle: title,
      bountyId: `bounty_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      reward: "750 SHEEP",
      deadline: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
      message: `Bounty "${title}" assigned to team ${teamId}`,
      timestamp: Date.now()
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to assign bounty',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/ecosystem/scroll - Get ecosystem activity scroll
router.get('/ecosystem/scroll', async (req, res) => {
  try {
    const scrollEntries = [
      {
        id: "entry-001",
        type: "mint",
        icon: "🐣",
        description: "Dream minted: \"Lattice of Light\" by 0xabc",
        timestamp: Date.now() - 3600000, // 1 hour ago
        actor: "0xabc...123",
        target: "Lattice of Light"
      },
      {
        id: "entry-002",
        type: "remix",
        icon: "🧪",
        description: "Remix created by 0xdef — Dream #1203",
        timestamp: Date.now() - 7200000, // 2 hours ago
        actor: "0xdef...456",
        target: "Dream #1203"
      },
      {
        id: "entry-003",
        type: "fossilize",
        icon: "🦴",
        description: "Fossilized \"Chain of Doubt\" — last active 7/15/25",
        timestamp: Date.now() - 10800000, // 3 hours ago
        actor: "system",
        target: "Chain of Doubt"
      },
      {
        id: "entry-004",
        type: "resurrect",
        icon: "✨",
        description: "Revived \"Phoenix Dream\" by ZK Guardians",
        timestamp: Date.now() - 14400000, // 4 hours ago
        actor: "ZK Guardians",
        target: "Phoenix Dream"
      },
      {
        id: "entry-005",
        type: "blessing",
        icon: "🔮",
        description: "Blessing dropped on Meme Cloud by God Mode",
        timestamp: Date.now() - 18000000, // 5 hours ago
        actor: "God Mode",
        target: "Meme Cloud"
      }
    ];

    res.json(scrollEntries);

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch ecosystem scroll',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/dream-network - Get dream network data
router.get('/network', async (req, res) => {
  try {
    const networkData = {
      nodes: [
        {
          id: "dream023",
          type: "dream",
          x: 132,
          y: 455,
          status: "active",
          level: 4,
          tags: ["zk", "identity", "revive"],
          connections: ["dream020", "dream021"],
          cloud: "zk-guardians",
          title: "ZK Identity Protocol",
          description: "Zero-knowledge identity verification system"
        },
        {
          id: "dream020",
          type: "dream",
          x: 250,
          y: 300,
          status: "fossilized",
          level: 6,
          tags: ["privacy", "zk"],
          connections: ["dream023"],
          cloud: "zk-guardians",
          title: "Privacy Vault",
          description: "Encrypted storage for sensitive data"
        },
        {
          id: "dream021",
          type: "fossil",
          x: 400,
          y: 500,
          status: "fossilized",
          level: 8,
          tags: ["legendary", "phoenix"],
          connections: ["dream023"],
          cloud: "defi-vaults",
          title: "Phoenix Protocol",
          description: "Self-regenerating DeFi system"
        },
        {
          id: "agent-nullproof",
          type: "agent",
          x: 300,
          y: 150,
          status: "active",
          level: 5,
          tags: ["guardian", "zk"],
          connections: ["dream023", "dream020"],
          cloud: "zk-guardians",
          title: "NullProof Agent",
          description: "ZK validation and protection agent"
        }
      ],
      evolutions: [
        {
          original: "zk-bridge-labs",
          remix: "remix-001",
          fossil: "zk-genesis",
          resurrected: "zk-revival-core",
          evolutionPath: ["creation", "enhancement", "fossilization", "resurrection", "ascension"]
        },
        {
          original: "defi-phoenix-core",
          remix: "phoenix-remix-v2",
          fossil: "phoenix-fossil",
          resurrected: "phoenix-reborn",
          evolutionPath: ["inception", "optimization", "dormancy", "revival", "transcendence"]
        }
      ]
    };

    res.json(networkData);

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch dream network',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Access control helper function
const hasAccess = (wallet: string, tool: string) => {
  const getTrustScore = (wallet: string) => {
    // Mock trust scores for demo
    const trustScores: Record<string, number> = {
      '0xabc...123': 85,
      '0xdef...456': 70,
      '0x789...abc': 90,
      '0x321...def': 60
    };
    return trustScores[wallet] || 50;
  };

  const getWalletBadges = (wallet: string) => {
    // Mock badges for demo
    const walletBadges: Record<string, string[]> = {
      '0xabc...123': ['Creator', 'Healer', 'OG'],
      '0xdef...456': ['Strategist', 'Sheep'],
      '0x789...abc': ['Dream Architect', 'Guardian'],
      '0x321...def': ['Explorer']
    };
    return walletBadges[wallet] || [];
  };

  const getWalletTokens = (wallet: string) => {
    // Mock token holdings for demo
    const tokenHoldings: Record<string, Record<string, number>> = {
      '0xabc...123': { SHEEP: 1500, FLBY: 200, CORE: 50 },
      '0xdef...456': { SHEEP: 800, FLBY: 100, CORE: 25 },
      '0x789...abc': { SHEEP: 2500, FLBY: 500, CORE: 100 },
      '0x321...def': { SHEEP: 300, FLBY: 50, CORE: 10 }
    };
    return tokenHoldings[wallet] || { SHEEP: 0, FLBY: 0, CORE: 0 };
  };

  const getRemixClaims = (wallet: string) => {
    // Mock remix claims for demo
    const remixClaims: Record<string, number> = {
      '0xabc...123': 7,
      '0xdef...456': 3,
      '0x789...abc': 12,
      '0x321...def': 1
    };
    return remixClaims[wallet] || 0;
  };

  const isGod = (wallet: string) => {
    const godWallets = ['0x789...abc', '0xgod...mode'];
    return godWallets.includes(wallet);
  };

  const trustScore = getTrustScore(wallet);
  const badges = getWalletBadges(wallet);
  const tokenHoldings = getWalletTokens(wallet);

  switch (tool) {
    case "devConsole":
      return trustScore >= 65 || badges.includes("Creator");
    case "walletScorer":
      return trustScore >= 75 || tokenHoldings.SHEEP >= 1000;
    case "bountyEngine":
      return badges.includes("Strategist") || getRemixClaims(wallet) >= 3;
    case "evolutionTester":
      return badges.includes("Dream Architect") || isGod(wallet);
    default:
      return false;
  }
};

// POST /api/dev-console/simulate-remix - Simulate remix chain
router.post('/dev-console/simulate-remix', async (req, res) => {
  try {
    const { dreamId, chainDepth } = req.body;
    const wallet = req.session?.walletAddress || '0xguest';

    if (!hasAccess(wallet, 'devConsole')) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You need a trust score of 65 or Creator badge to access the dev console',
        requirements: {
          trustScore: 65,
          orBadge: 'Creator'
        }
      });
    }

    // Simulate remix chain calculation
    const baseXP = 200;
    const depthMultiplier = chainDepth * 0.3;
    const remixXP = Math.floor(baseXP * (1 + depthMultiplier) * chainDepth);
    const teamXP = Math.floor(remixXP * 0.2);
    
    const growthOptions = ['exponential', 'linear', 'logarithmic', 'viral'];
    const projectedGrowth = growthOptions[Math.floor(Math.random() * growthOptions.length)];
    
    const evolutionPath = ['original', 'remix', 'evolution'];
    for (let i = 1; i < chainDepth; i++) {
      evolutionPath.push(`remix-v${i + 1}`);
    }

    res.json({
      remixXP,
      teamXP,
      chainDepth,
      projectedGrowth,
      evolutionPath,
      dreamId,
      timestamp: Date.now()
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to simulate remix chain',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/dev-console/test-bounty - Test bounty claim
router.post('/dev-console/test-bounty', async (req, res) => {
  try {
    const { tokenType, amount } = req.body;
    const wallet = req.session?.walletAddress || '0xguest';

    if (!hasAccess(wallet, 'bountyEngine')) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You need Strategist badge or 3+ remix claims to access the bounty engine',
        requirements: {
          badge: 'Strategist',
          orRemixClaims: 3
        }
      });
    }

    // Simulate bounty claim
    const success = Math.random() > 0.2; // 80% success rate
    const gasCost = Math.floor(Math.random() * 50) + 10;
    const transactionId = `0x${Math.random().toString(16).substr(2, 8)}...`;

    res.json({
      success,
      claimedAmount: success ? amount : 0,
      tokenType,
      gasCost,
      transactionId,
      timestamp: Date.now(),
      wallet
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to test bounty claim',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/dev-console/access-check - Check tool access for wallet
router.get('/dev-console/access-check/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;
    
    const tools = ['devConsole', 'walletScorer', 'bountyEngine', 'evolutionTester'];
    const accessStatus: Record<string, boolean> = {};
    
    tools.forEach(tool => {
      accessStatus[tool] = hasAccess(wallet, tool);
    });

    res.json({
      wallet,
      accessStatus,
      timestamp: Date.now()
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to check access',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/agents/create-custom - Create custom agent
router.post('/agents/create-custom', async (req, res) => {
  try {
    const { agentsIncluded, name, owner } = req.body;
    
    const customAgentId = `agent${name}${Date.now()}`;
    const traits = [];
    
    // Determine traits based on included agents
    if (agentsIncluded.includes('ROOT')) traits.push('strategist');
    if (agentsIncluded.includes('CANVAS')) traits.push('UI generator');
    if (agentsIncluded.includes('WING')) traits.push('outreach');
    if (agentsIncluded.includes('CRADLE')) traits.push('evolution specialist');
    if (agentsIncluded.includes('LUCID')) traits.push('logic coordinator');
    if (agentsIncluded.includes('ECHO')) traits.push('wallet specialist');

    const customAgent = {
      customAgentId,
      owner,
      agentsIncluded,
      name,
      traits,
      createdAt: Math.floor(Date.now() / 1000)
    };

    res.json(customAgent);

  } catch (error) {
    res.status(500).json({
      error: 'Failed to create custom agent',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/agents/assign-mission - Assign mission to agent
router.post('/agents/assign-mission', async (req, res) => {
  try {
    const { agentId, missionType, options } = req.body;
    
    const missionId = `mission_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    const mission = {
      missionId,
      agentId,
      missionType,
      options,
      status: 'active',
      assignedAt: Date.now(),
      estimatedCompletion: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };

    res.json({
      success: true,
      mission,
      message: `Mission ${missionType} assigned to agent ${agentId}`
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to assign mission',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/agents/user-agents/:wallet - Get user's custom agents
router.get('/agents/user-agents/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;
    
    const userAgents = [
      {
        customAgentId: 'agentOBSERVER1729',
        name: 'OBSERVER-X',
        agentsIncluded: ['ROOT', 'CANVAS', 'WING'],
        traits: ['strategist', 'UI generator', 'outreach'],
        status: 'active',
        currentMission: 'fossilScanner'
      },
      {
        customAgentId: 'agentHYPERLINK1730',
        name: 'HYPERLINK',
        agentsIncluded: ['WING', 'LUCID'],
        traits: ['outreach', 'logic coordinator'],
        status: 'idle',
        currentMission: null
      }
    ];

    res.json(userAgents.filter(agent => true)); // In real app, filter by wallet

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch user agents',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/agents/deploy-mission - Deploy mission to selected agent
router.post('/agents/deploy-mission', async (req, res) => {
  try {
    const { agentId, missionType, targetZone } = req.body;
    
    const deploymentId = `deploy_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    // Simulate mission results based on type
    let missionResults: string[] = [];
    let xpGained = 0;
    
    switch (missionType) {
      case 'fossilScanner':
        missionResults = [
          'Found dream_83: "BioSignal Mirror"',
          'Found dream_42: "Neural Ink Spiral"',
          'Found dream_17: "Open Lab Chain"'
        ];
        xpGained = 40;
        break;
      case 'remixStrategist':
        missionResults = [
          'Identified high-potential remix target: dream_91',
          'Calculated optimal remix timing: 48h window',
          'Suggested team composition: 2 Revivers + 1 Strategist'
        ];
        xpGained = 35;
        break;
      case 'viralScout':
        missionResults = [
          'Detected viral pattern in dream_55',
          'Social engagement up 340%',
          'Recommended amplification budget: 200 SHEEP'
        ];
        xpGained = 50;
        break;
      case 'walletWhisperer':
        missionResults = [
          'Analyzed 15 high-value wallets',
          'Found 3 potential team recruits',
          'Trust score correlation: 89%'
        ];
        xpGained = 45;
        break;
    }

    const missionLog = {
      logId: `log_${Date.now()}`,
      agentId,
      agentName: agentId.includes('OBSERVER') ? 'OBSERVER-X' : 'AGENT',
      missionType,
      owner: '0xabc...123',
      timestamp: Math.floor(Date.now() / 1000),
      results: missionResults,
      xpGained,
      status: 'complete',
      deploymentId,
      targetZone: targetZone || 'DeSci'
    };

    // Apply XP to wallet after mission completion
    const xpResult = await applyXP(missionType, deploymentId, { type: 'wallet', id: '0xabc...123' }, xpGained);

    res.json({
      success: true,
      deploymentId,
      missionLog,
      xpUpdate: xpResult,
      summary: `📡 ${missionLog.agentName} running ${missionType} in Dream Cloud: ${targetZone || 'DeSci'}. Found ${missionResults.length} results with ${xpGained} XP gained.${xpResult.levelUp ? ` LEVEL UP! Now level ${xpResult.newLevel}` : ''}`
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to deploy mission',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// XP table for different activities
const XP_TABLE: Record<string, number> = {
  remix: 25,
  bounty: 50,
  mission: 40,
  revival: 75,
  creation: 30,
  collaboration: 20,
  fossilScanner: 40,
  remixStrategist: 35,
  viralScout: 50,
  walletWhisperer: 45
};

// Shared level calculation function
function getLevel(xp: number): number {
  const levels = [0, 100, 250, 500, 1000, 2000, 4000, 8000];
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i]) return i + 1;
  }
  return 1;
}

// Queue level up toast notification
function queueLevelUpToast(targetType: string, targetId: string, newLevel: number) {
  // In a real implementation, this would queue a notification
  console.log(`🎉 Level up notification: ${targetType === 'wallet' ? 'User' : 'Dream'} ${targetId} reached level ${newLevel}!`);
  
  // Return toast message for client
  return {
    message: `🎉 ${targetType === 'wallet' ? 'You' : 'Your dream'} leveled up to L${newLevel}!`,
    type: 'success',
    duration: 5000
  };
}

// Apply XP to wallet or dream entity
async function applyXP(type: string, sourceId: string, target: { type: string; id: string }, amount: number) {
  // Simulate entity lookup and update
  let entity;
  
  if (target.type === "wallet") {
    // Mock wallet entity
    entity = {
      address: target.id,
      xp: 150, // Current XP
      level: 2,
      lastActivity: Date.now()
    };
  } else {
    // Mock dream entity
    entity = {
      id: target.id,
      xp: 80,
      level: 1,
      lastUpdate: Date.now()
    };
  }

  const oldLevel = entity.level;
  entity.xp += amount;
  entity.level = getLevel(entity.xp);
  
  const levelUp = entity.level > oldLevel;
  
  // Queue level up notification if needed
  if (levelUp) {
    queueLevelUpToast(target.type, target.id, entity.level);
  }

  return { 
    newXP: entity.xp, 
    newLevel: entity.level,
    levelUp,
    xpGained: amount,
    source: type,
    sourceId,
    previousLevel: oldLevel
  };
}

// POST /api/xp/apply - Apply XP to wallet or dream
router.post('/xp/apply', async (req, res) => {
  try {
    const { type, targetType, targetId, sourceId } = req.body;

    const xpGain = XP_TABLE[type] || 0;
    
    if (xpGain === 0) {
      return res.status(400).json({
        error: 'Invalid XP type',
        validTypes: Object.keys(XP_TABLE)
      });
    }

    const result = await applyXP(type, sourceId, { type: targetType, id: targetId }, xpGain);

    res.json({ 
      status: "success", 
      ...result,
      timestamp: Date.now()
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to apply XP',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/mission-logbook/:wallet - Get mission logbook for specific wallet
router.get('/mission-logbook/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;
    
    const walletLogs = [
      {
        logId: 'log_48210',
        agentId: 'agentOBSERVER1729',
        agentName: 'OBSERVER-X',
        missionType: 'fossilScanner',
        owner: wallet,
        timestamp: 1725019250,
        results: [
          'Found dream_83: "BioSignal Mirror"',
          'Found dream_42: "Neural Ink Spiral"',
          'Found dream_17: "Open Lab Chain"'
        ],
        xpGained: 40,
        status: 'complete',
        targetZone: 'DeSci'
      },
      {
        logId: 'log_48215',
        agentId: 'agentHYPERLINK1730',
        agentName: 'HYPERLINK',
        missionType: 'viralScout',
        owner: wallet,
        timestamp: 1725015650,
        results: [
          'Detected viral pattern in dream_55',
          'Social engagement up 340%',
          'Recommended amplification budget: 200 SHEEP'
        ],
        xpGained: 50,
        status: 'complete',
        targetZone: 'Memes'
      },
      {
        logId: 'log_48220',
        agentId: 'agentOBSERVER1729',
        agentName: 'OBSERVER-X',
        missionType: 'remixStrategist',
        owner: wallet,
        timestamp: 1725012050,
        results: [
          'Identified high-potential remix target: dream_91',
          'Calculated optimal remix timing: 48h window',
          'Suggested team composition: 2 Revivers + 1 Strategist'
        ],
        xpGained: 35,
        status: 'complete',
        targetZone: 'DeFi'
      }
    ];

    res.json(walletLogs);

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch mission logbook',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/agents/mission-logs - Get recent mission logs
router.get('/agents/mission-logs', async (req, res) => {
  try {
    const recentLogs = [
      {
        logId: 'log_48210',
        agentId: 'agentOBSERVER1729',
        agentName: 'OBSERVER-X',
        missionType: 'fossilScanner',
        owner: '0xabc...123',
        timestamp: 1725019250,
        results: [
          'Found dream_83: "BioSignal Mirror"',
          'Found dream_42: "Neural Ink Spiral"',
          'Found dream_17: "Open Lab Chain"'
        ],
        xpGained: 40,
        status: 'complete',
        targetZone: 'DeSci'
      },
      {
        logId: 'log_48211',
        agentId: 'agentHYPERLINK1730',
        agentName: 'HYPERLINK',
        missionType: 'viralScout',
        owner: '0xdef...456',
        timestamp: 1725015650,
        results: [
          'Detected viral pattern in dream_55',
          'Social engagement up 340%'
        ],
        xpGained: 50,
        status: 'complete',
        targetZone: 'Memes'
      }
    ];

    res.json(recentLogs);

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch mission logs',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/xp/progression - Get XP progression data for all clouds
router.get('/progression', async (req, res) => {
  try {
    const clouds: any[] = [
      {
        cloudId: "defi-vaults",
        xp: 1135,
        level: 3,
        milestones: ["audio-theme", "mystery-drop"],
        nextLevelXP: 615  // 1750 - 1135 = 615 XP needed for level 4
      },
      {
        cloudId: "ai-research",
        xp: 2240,
        level: 5,
        milestones: ["neural-net", "deep-learning", "quantum-leap"],
        nextLevelXP: 760  // 3000 - 2240 = 760 XP needed for level 6
      },
      {
        cloudId: "zk-privacy",
        xp: 890,
        level: 2,
        milestones: ["crypto-basics"],
        nextLevelXP: 410  // 1300 - 890 = 410 XP needed for level 3
      },
      {
        cloudId: "meme-factory",
        xp: 1580,
        level: 4,
        milestones: ["viral-hit", "trending-topic", "meme-lord"],
        nextLevelXP: 920  // 2500 - 1580 = 920 XP needed for level 5
      }
    ];

    const totalXP = clouds.reduce((sum, cloud) => sum + cloud.xp, 0);
    const globalLevel = Math.floor(totalXP / 1000); // 1000 XP per global level

    res.json({
      clouds,
      totalXP,
      globalLevel
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch XP progression',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;