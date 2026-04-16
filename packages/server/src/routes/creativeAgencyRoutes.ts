import express from 'express';
import { creativeAgencyEcosystem } from '../services/creativeAgencyEcosystem.js';

const router = express.Router();

// ==================== CREATIVE AGENCY ECOSYSTEM API ROUTES ====================

// Get overall agency ecosystem status
router.get('/agency/status', (req, res) => {
  try {
    const status = creativeAgencyEcosystem.getAgencyStatus();
    res.json({
      success: true,
      ecosystem: status,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get all teams overview
router.get('/agency/teams', (req, res) => {
  try {
    const teams = creativeAgencyEcosystem.getAllTeams();
    res.json({
      success: true,
      teams,
      totalTeams: teams.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get specific team details
router.get('/agency/teams/:teamName', (req, res) => {
  try {
    const { teamName } = req.params;
    const team = creativeAgencyEcosystem.getTeamDetails(teamName);
    
    if (!team) {
      return res.status(404).json({
        success: false,
        error: `Team '${teamName}' not found`,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      team,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Create new project assignment
router.post('/agency/projects', (req, res) => {
  try {
    const { projectName, requiredRoles, priority = 'medium' } = req.body;
    
    if (!projectName || !requiredRoles || !Array.isArray(requiredRoles)) {
      return res.status(400).json({
        success: false,
        error: 'projectName and requiredRoles (array) are required',
        timestamp: new Date().toISOString()
      });
    }

    const project = creativeAgencyEcosystem.assignProject(projectName, requiredRoles, priority);
    
    res.json({
      success: true,
      project,
      message: `Project '${projectName}' successfully assigned to ${project.assignedTeam.length} agents`,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Creative Directors specific endpoints
router.get('/agency/creative-directors/status', (req, res) => {
  try {
    const team = creativeAgencyEcosystem.getTeamDetails('creative-directors');
    
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Creative Directors team not found',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      creativeTeam: {
        lead: team.lead,
        members: team.members,
        biomimeticPattern: team.biomimeticPattern,
        viralConnections: team.viralNetwork,
        tripleHelix: team.tripleHelixIntegration
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Technical Directors specific endpoints
router.get('/agency/technical-directors/status', (req, res) => {
  try {
    const team = creativeAgencyEcosystem.getTeamDetails('technical-directors');
    
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Technical Directors team not found',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      technicalTeam: {
        lead: team.lead,
        members: team.members,
        biomimeticPattern: team.biomimeticPattern,
        viralConnections: team.viralNetwork,
        tripleHelix: team.tripleHelixIntegration
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// UI/UX Team specific endpoints
router.get('/agency/ui-ux-team/status', (req, res) => {
  try {
    const team = creativeAgencyEcosystem.getTeamDetails('ui-ux-team');
    
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'UI/UX team not found',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      uiuxTeam: {
        lead: team.lead,
        members: team.members,
        biomimeticPattern: team.biomimeticPattern,
        viralConnections: team.viralNetwork,
        tripleHelix: team.tripleHelixIntegration
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Content Strategy Team specific endpoints
router.get('/agency/content-strategists/status', (req, res) => {
  try {
    const team = creativeAgencyEcosystem.getTeamDetails('content-strategists');
    
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Content Strategists team not found',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      contentTeam: {
        lead: team.lead,
        members: team.members,
        biomimeticPattern: team.biomimeticPattern,
        viralConnections: team.viralNetwork,
        tripleHelix: team.tripleHelixIntegration
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Development Team specific endpoints
router.get('/agency/developers-team/status', (req, res) => {
  try {
    const team = creativeAgencyEcosystem.getTeamDetails('developers-team');
    
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Development team not found',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      developmentTeam: {
        lead: team.lead,
        members: team.members,
        biomimeticPattern: team.biomimeticPattern,
        viralConnections: team.viralNetwork,
        tripleHelix: team.tripleHelixIntegration
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Digital Marketing Team specific endpoints
router.get('/agency/digital-marketing/status', (req, res) => {
  try {
    const team = creativeAgencyEcosystem.getTeamDetails('digital-marketing');
    
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Digital Marketing team not found',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      marketingTeam: {
        lead: team.lead,
        members: team.members,
        biomimeticPattern: team.biomimeticPattern,
        viralConnections: team.viralNetwork,
        tripleHelix: team.tripleHelixIntegration
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Innovation Lab specific endpoints
router.get('/agency/innovation-lab/status', (req, res) => {
  try {
    const team = creativeAgencyEcosystem.getTeamDetails('innovation-lab');
    
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Innovation Lab team not found',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      innovationTeam: {
        lead: team.lead,
        members: team.members,
        biomimeticPattern: team.biomimeticPattern,
        viralConnections: team.viralNetwork,
        tripleHelix: team.tripleHelixIntegration
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Viral Network Analytics
router.get('/agency/viral-analytics', (req, res) => {
  try {
    const status = creativeAgencyEcosystem.getAgencyStatus();
    
    res.json({
      success: true,
      viralAnalytics: {
        networkHealth: status.viralNetwork.health,
        totalConnections: status.viralNetwork.totalConnections,
        infectionRate: status.viralNetwork.infectionRate,
        operationalCycles: status.operationalCycles,
        tripleHelixDistribution: {
          intelligence: status.tripleHelix.intelligenceAgents,
          infrastructure: status.tripleHelix.infrastructureAgents,
          integration: status.tripleHelix.integrationAgents
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Individual Team Status Endpoints for New Teams
router.get('/agency/devops-infrastructure', (req, res) => {
  try {
    const team = creativeAgencyEcosystem.getTeam('devops-infrastructure');
    if (!team) {
      return res.status(404).json({ success: false, error: 'DevOps Infrastructure team not found' });
    }
    res.json({
      success: true,
      team,
      biomimeticPattern: team.biomimeticPattern,
      viralNetwork: team.viralNetwork,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

router.get('/agency/build-release', (req, res) => {
  try {
    const team = creativeAgencyEcosystem.getTeam('build-release');
    if (!team) {
      return res.status(404).json({ success: false, error: 'Build & Release team not found' });
    }
    res.json({
      success: true,
      team,
      biomimeticPattern: team.biomimeticPattern,
      viralNetwork: team.viralNetwork,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

router.get('/agency/qa-team', (req, res) => {
  try {
    const team = creativeAgencyEcosystem.getTeam('qa-team');
    if (!team) {
      return res.status(404).json({ success: false, error: 'QA team not found' });
    }
    res.json({
      success: true,
      team,
      biomimeticPattern: team.biomimeticPattern,
      viralNetwork: team.viralNetwork,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

router.get('/agency/security-specialists', (req, res) => {
  try {
    const team = creativeAgencyEcosystem.getTeam('security-specialists');
    if (!team) {
      return res.status(404).json({ success: false, error: 'Security Specialists team not found' });
    }
    res.json({
      success: true,
      team,
      biomimeticPattern: team.biomimeticPattern,
      viralNetwork: team.viralNetwork,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Enhanced Triple Helix DNA Analysis
router.get('/agency/triple-helix-analysis', (req, res) => {
  try {
    const helixDetails = creativeAgencyEcosystem.getTripleHelixDetails();
    
    res.json({
      success: true,
      tripleHelixAnalysis: helixDetails,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// DNA Replication and Molecular Bonding Status
router.get('/agency/dna-evolution', (req, res) => {
  try {
    const status = creativeAgencyEcosystem.getAgencyStatus();
    const helixDetails = creativeAgencyEcosystem.getTripleHelixDetails();
    
    res.json({
      success: true,
      dnaEvolution: {
        molecularBonds: helixDetails.molecularBonds,
        geneticTransfers: helixDetails.geneticTransfers,
        helixStability: helixDetails.helixStability,
        operationalCycles: status.operationalCycles,
        strandBalance: {
          intelligence: helixDetails.intelligence.agents,
          infrastructure: helixDetails.infrastructure.agents,
          integration: helixDetails.integration.agents
        },
        evolutionaryPressure: Math.round((status.performance.creativity + 
                                        status.performance.efficiency + 
                                        status.performance.collaboration + 
                                        status.performance.innovation) / 4)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Cross-Strand Compatibility Analysis
router.get('/agency/strand-compatibility', (req, res) => {
  try {
    const helixDetails = creativeAgencyEcosystem.getTripleHelixDetails();
    
    res.json({
      success: true,
      strandCompatibility: {
        intelligence: {
          averagePerformance: helixDetails.intelligence.averagePerformance,
          viralStrength: helixDetails.intelligence.viralStrength,
          biomimeticTypes: Object.keys(helixDetails.intelligence.biomimeticDistribution),
          agentCount: helixDetails.intelligence.agents
        },
        infrastructure: {
          averagePerformance: helixDetails.infrastructure.averagePerformance,
          viralStrength: helixDetails.infrastructure.viralStrength,
          biomimeticTypes: Object.keys(helixDetails.infrastructure.biomimeticDistribution),
          agentCount: helixDetails.infrastructure.agents
        },
        integration: {
          averagePerformance: helixDetails.integration.averagePerformance,
          viralStrength: helixDetails.integration.viralStrength,
          biomimeticTypes: Object.keys(helixDetails.integration.biomimeticDistribution),
          agentCount: helixDetails.integration.agents
        },
        overallStability: helixDetails.helixStability
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Biomimetic Patterns Overview
router.get('/agency/biomimetic-patterns', (req, res) => {
  try {
    const teams = creativeAgencyEcosystem.getAllTeams();
    
    const biomimeticSummary = teams.map(team => ({
      teamName: team.name,
      biomimeticPattern: team.biomimeticPattern,
      memberCount: team.memberCount,
      viralConnections: team.viralConnections
    }));

    res.json({
      success: true,
      biomimeticPatterns: biomimeticSummary,
      totalPatterns: biomimeticSummary.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Content Production & Media Team specific endpoints
router.get('/agency/content-production-media/status', (req, res) => {
  try {
    const team = creativeAgencyEcosystem.getTeamDetails('content-production-media');
    
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Content Production & Media team not found',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      contentProductionMediaTeam: {
        lead: team.lead,
        members: team.members,
        biomimeticPattern: team.biomimeticPattern,
        viralConnections: team.viralNetwork,
        tripleHelix: team.tripleHelixIntegration,
        specialties: {
          neuroDesign: team.members.filter(m => m.specialty.includes('Neural')).length,
          behavioralEconomics: team.members.filter(m => m.specialty.includes('Decision Architecture')).length,
          sensoryDesign: team.members.filter(m => m.specialty.includes('Sensory')).length,
          clientPods: team.members.filter(m => m.specialty.includes('Client Integration')).length,
          culturalRelevance: team.members.filter(m => m.specialty.includes('Cultural')).length,
          whiteGloveLaunch: team.members.filter(m => m.specialty.includes('Launch')).length
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;