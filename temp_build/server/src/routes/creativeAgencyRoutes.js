"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var creativeAgencyEcosystem_js_1 = require("../services/creativeAgencyEcosystem.js");
var router = express_1.default.Router();
// ==================== CREATIVE AGENCY ECOSYSTEM API ROUTES ====================
// Get overall agency ecosystem status
router.get('/agency/status', function (req, res) {
    try {
        var status_1 = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.getAgencyStatus();
        res.json({
            success: true,
            ecosystem: status_1,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// Get all teams overview
router.get('/agency/teams', function (req, res) {
    try {
        var teams = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.getAllTeams();
        res.json({
            success: true,
            teams: teams,
            totalTeams: teams.length,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// Get specific team details
router.get('/agency/teams/:teamName', function (req, res) {
    try {
        var teamName = req.params.teamName;
        var team = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.getTeamDetails(teamName);
        if (!team) {
            return res.status(404).json({
                success: false,
                error: "Team '".concat(teamName, "' not found"),
                timestamp: new Date().toISOString()
            });
        }
        res.json({
            success: true,
            team: team,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// Create new project assignment
router.post('/agency/projects', function (req, res) {
    try {
        var _a = req.body, projectName = _a.projectName, requiredRoles = _a.requiredRoles, _b = _a.priority, priority = _b === void 0 ? 'medium' : _b;
        if (!projectName || !requiredRoles || !Array.isArray(requiredRoles)) {
            return res.status(400).json({
                success: false,
                error: 'projectName and requiredRoles (array) are required',
                timestamp: new Date().toISOString()
            });
        }
        var project = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.assignProject(projectName, requiredRoles, priority);
        res.json({
            success: true,
            project: project,
            message: "Project '".concat(projectName, "' successfully assigned to ").concat(project.assignedTeam.length, " agents"),
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// Creative Directors specific endpoints
router.get('/agency/creative-directors/status', function (req, res) {
    try {
        var team = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.getTeamDetails('creative-directors');
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// Technical Directors specific endpoints
router.get('/agency/technical-directors/status', function (req, res) {
    try {
        var team = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.getTeamDetails('technical-directors');
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// UI/UX Team specific endpoints
router.get('/agency/ui-ux-team/status', function (req, res) {
    try {
        var team = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.getTeamDetails('ui-ux-team');
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// Content Strategy Team specific endpoints
router.get('/agency/content-strategists/status', function (req, res) {
    try {
        var team = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.getTeamDetails('content-strategists');
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// Development Team specific endpoints
router.get('/agency/developers-team/status', function (req, res) {
    try {
        var team = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.getTeamDetails('developers-team');
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// Digital Marketing Team specific endpoints
router.get('/agency/digital-marketing/status', function (req, res) {
    try {
        var team = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.getTeamDetails('digital-marketing');
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// Innovation Lab specific endpoints
router.get('/agency/innovation-lab/status', function (req, res) {
    try {
        var team = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.getTeamDetails('innovation-lab');
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// Viral Network Analytics
router.get('/agency/viral-analytics', function (req, res) {
    try {
        var status_2 = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.getAgencyStatus();
        res.json({
            success: true,
            viralAnalytics: {
                networkHealth: status_2.viralNetwork.health,
                totalConnections: status_2.viralNetwork.totalConnections,
                infectionRate: status_2.viralNetwork.infectionRate,
                operationalCycles: status_2.operationalCycles,
                tripleHelixDistribution: {
                    intelligence: status_2.tripleHelix.intelligenceAgents,
                    infrastructure: status_2.tripleHelix.infrastructureAgents,
                    integration: status_2.tripleHelix.integrationAgents
                }
            },
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// Individual Team Status Endpoints for New Teams
router.get('/agency/devops-infrastructure', function (req, res) {
    try {
        var team = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.getTeam('devops-infrastructure');
        if (!team) {
            return res.status(404).json({ success: false, error: 'DevOps Infrastructure team not found' });
        }
        res.json({
            success: true,
            team: team,
            biomimeticPattern: team.biomimeticPattern,
            viralNetwork: team.viralNetwork,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
router.get('/agency/build-release', function (req, res) {
    try {
        var team = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.getTeam('build-release');
        if (!team) {
            return res.status(404).json({ success: false, error: 'Build & Release team not found' });
        }
        res.json({
            success: true,
            team: team,
            biomimeticPattern: team.biomimeticPattern,
            viralNetwork: team.viralNetwork,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
router.get('/agency/qa-team', function (req, res) {
    try {
        var team = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.getTeam('qa-team');
        if (!team) {
            return res.status(404).json({ success: false, error: 'QA team not found' });
        }
        res.json({
            success: true,
            team: team,
            biomimeticPattern: team.biomimeticPattern,
            viralNetwork: team.viralNetwork,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
router.get('/agency/security-specialists', function (req, res) {
    try {
        var team = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.getTeam('security-specialists');
        if (!team) {
            return res.status(404).json({ success: false, error: 'Security Specialists team not found' });
        }
        res.json({
            success: true,
            team: team,
            biomimeticPattern: team.biomimeticPattern,
            viralNetwork: team.viralNetwork,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// Enhanced Triple Helix DNA Analysis
router.get('/agency/triple-helix-analysis', function (req, res) {
    try {
        var helixDetails = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.getTripleHelixDetails();
        res.json({
            success: true,
            tripleHelixAnalysis: helixDetails,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// DNA Replication and Molecular Bonding Status
router.get('/agency/dna-evolution', function (req, res) {
    try {
        var status_3 = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.getAgencyStatus();
        var helixDetails = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.getTripleHelixDetails();
        res.json({
            success: true,
            dnaEvolution: {
                molecularBonds: helixDetails.molecularBonds,
                geneticTransfers: helixDetails.geneticTransfers,
                helixStability: helixDetails.helixStability,
                operationalCycles: status_3.operationalCycles,
                strandBalance: {
                    intelligence: helixDetails.intelligence.agents,
                    infrastructure: helixDetails.infrastructure.agents,
                    integration: helixDetails.integration.agents
                },
                evolutionaryPressure: Math.round((status_3.performance.creativity +
                    status_3.performance.efficiency +
                    status_3.performance.collaboration +
                    status_3.performance.innovation) / 4)
            },
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// Cross-Strand Compatibility Analysis
router.get('/agency/strand-compatibility', function (req, res) {
    try {
        var helixDetails = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.getTripleHelixDetails();
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// Biomimetic Patterns Overview
router.get('/agency/biomimetic-patterns', function (req, res) {
    try {
        var teams = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.getAllTeams();
        var biomimeticSummary = teams.map(function (team) { return ({
            teamName: team.name,
            biomimeticPattern: team.biomimeticPattern,
            memberCount: team.memberCount,
            viralConnections: team.viralConnections
        }); });
        res.json({
            success: true,
            biomimeticPatterns: biomimeticSummary,
            totalPatterns: biomimeticSummary.length,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
// Content Production & Media Team specific endpoints
router.get('/agency/content-production-media/status', function (req, res) {
    try {
        var team = creativeAgencyEcosystem_js_1.creativeAgencyEcosystem.getTeamDetails('content-production-media');
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
                    neuroDesign: team.members.filter(function (m) { return m.specialty.includes('Neural'); }).length,
                    behavioralEconomics: team.members.filter(function (m) { return m.specialty.includes('Decision Architecture'); }).length,
                    sensoryDesign: team.members.filter(function (m) { return m.specialty.includes('Sensory'); }).length,
                    clientPods: team.members.filter(function (m) { return m.specialty.includes('Client Integration'); }).length,
                    culturalRelevance: team.members.filter(function (m) { return m.specialty.includes('Cultural'); }).length,
                    whiteGloveLaunch: team.members.filter(function (m) { return m.specialty.includes('Launch'); }).length
                }
            },
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
exports.default = router;
