import type { Express } from "express";
import express from "express";

// Mock grants data for when database is unavailable
const mockOpportunities = [
  {
    id: "1",
    source: "ethereum",
    name: "Ethereum Foundation Developer Grant",
    url: "https://ethereum.org/grants",
    deadline: "2025-12-31T23:59:59.000Z",
    status: "triage",
    createdAt: "2025-08-22T04:00:00.000Z",
    updatedAt: "2025-08-22T04:00:00.000Z"
  },
  {
    id: "2", 
    source: "solana",
    name: "Solana Foundation Grant Program",
    url: "https://solana.org/grants",
    deadline: "2025-09-30T23:59:59.000Z",
    status: "eligible",
    createdAt: "2025-08-22T03:30:00.000Z",
    updatedAt: "2025-08-22T03:30:00.000Z"
  },
  {
    id: "3",
    source: "google-cloud",
    name: "Google Cloud for Startups",
    url: "https://cloud.google.com/startup",
    deadline: null,
    status: "applied",
    createdAt: "2025-08-22T03:00:00.000Z",
    updatedAt: "2025-08-22T04:05:00.000Z"
  }
];

const mockApplications = [
  {
    id: "1",
    oppId: "3",
    status: "submitted",
    artifactId: "123",
    submittedAt: "2025-08-22T04:05:00.000Z",
    createdAt: "2025-08-22T04:00:00.000Z",
    updatedAt: "2025-08-22T04:05:00.000Z"
  }
];

const mockOutreach = [
  {
    id: "1",
    oppId: "2",
    channel: "email",
    toAddr: "grants@solana.org",
    status: "sent",
    providerId: "msg_20250822_001",
    createdAt: "2025-08-22T03:45:00.000Z",
    updatedAt: "2025-08-22T03:45:00.000Z"
  },
  {
    id: "2",
    oppId: "1",
    channel: "form",
    toAddr: "https://ethereum.org/contact",
    status: "draft",
    providerId: null,
    createdAt: "2025-08-22T04:00:00.000Z",
    updatedAt: "2025-08-22T04:00:00.000Z"
  }
];

// Store mock artifact
function storeMockArtifact(kind: string, ref: string, data: any): { id: string; created_at: string } {
  const artifact = {
    id: `mock_artifact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString()
  };
  
  console.log(`[GRANTS-MOCK] Artifact stored: ${kind} | ${ref} | ${JSON.stringify(data)}`);
  return artifact;
}

export function registerGrantsMockRoutes(app: Express) {
  
  // ==================== MOCK GRANT OPPORTUNITIES ====================
  
  // Get all grant opportunities with filtering (mock data)
  app.get('/api/grants/opportunities', async (req, res) => {
    try {
      const { status, source, limit = '50' } = req.query;
      
      let opportunities = [...mockOpportunities];
      
      // Apply filters
      if (status) {
        opportunities = opportunities.filter(opp => opp.status === status);
      }
      if (source) {
        opportunities = opportunities.filter(opp => opp.source === source);
      }
      
      // Apply limit
      opportunities = opportunities.slice(0, parseInt(limit as string));
      
      res.json({
        opportunities,
        total: opportunities.length,
        filters_applied: { status, source },
        data_source: 'mock',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('[GRANTS-MOCK] Error fetching opportunities:', error);
      res.status(500).json({
        error: 'Failed to fetch grant opportunities',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Create new grant opportunity (mock)
  app.post('/api/grants/opportunities', express.json(), async (req, res) => {
    try {
      const { source, name, url, deadline, status = 'triage' } = req.body;
      
      if (!source || !name || !url) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['source', 'name', 'url']
        });
      }
      
      const newOpportunity = {
        id: (mockOpportunities.length + 1).toString(),
        source,
        name,
        url,
        deadline: deadline || null,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockOpportunities.push(newOpportunity);
      
      // Store creation artifact
      storeMockArtifact('grant.opportunity.created', newOpportunity.id, {
        opportunity_id: newOpportunity.id,
        source: newOpportunity.source,
        name: newOpportunity.name,
        created_by: 'mock_system'
      });
      
      res.status(201).json({
        success: true,
        opportunity: newOpportunity,
        data_source: 'mock',
        message: 'Grant opportunity created successfully (mock data)'
      });
      
    } catch (error) {
      console.error('[GRANTS-MOCK] Error creating opportunity:', error);
      res.status(400).json({
        error: 'Failed to create grant opportunity',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Update grant opportunity status (mock)
  app.patch('/api/grants/opportunities/:id/status', express.json(), async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const validStatuses = ['triage', 'eligible', 'ineligible', 'draft', 'ready', 'submitted', 'won', 'lost'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: 'Invalid status',
          valid_statuses: validStatuses
        });
      }
      
      const oppIndex = mockOpportunities.findIndex(opp => opp.id === id);
      if (oppIndex === -1) {
        return res.status(404).json({ error: 'Grant opportunity not found' });
      }
      
      const oldStatus = mockOpportunities[oppIndex].status;
      mockOpportunities[oppIndex].status = status;
      mockOpportunities[oppIndex].updatedAt = new Date().toISOString();
      
      // Store status change artifact
      storeMockArtifact('grant.opportunity.status_changed', id, {
        opportunity_id: id,
        old_status: oldStatus,
        new_status: status,
        changed_by: 'mock_system'
      });
      
      res.json({
        success: true,
        opportunity: mockOpportunities[oppIndex],
        data_source: 'mock',
        message: `Status updated to ${status}`
      });
      
    } catch (error) {
      console.error('[GRANTS-MOCK] Error updating opportunity status:', error);
      res.status(500).json({
        error: 'Failed to update opportunity status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // ==================== MOCK GRANT APPLICATIONS ====================
  
  // Get applications for an opportunity (mock)
  app.get('/api/grants/opportunities/:oppId/applications', async (req, res) => {
    try {
      const { oppId } = req.params;
      
      const applications = mockApplications.filter(app => app.oppId === oppId);
      
      res.json({
        applications,
        opportunity_id: oppId,
        total: applications.length,
        data_source: 'mock',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('[GRANTS-MOCK] Error fetching applications:', error);
      res.status(500).json({
        error: 'Failed to fetch applications',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // ==================== MOCK OUTREACH MANAGEMENT ====================
  
  // Get outreach for an opportunity (mock)
  app.get('/api/grants/opportunities/:oppId/outreach', async (req, res) => {
    try {
      const { oppId } = req.params;
      const { channel, status } = req.query;
      
      let outreachItems = mockOutreach.filter(item => item.oppId === oppId);
      
      // Apply filters
      if (channel) {
        outreachItems = outreachItems.filter(item => item.channel === channel);
      }
      if (status) {
        outreachItems = outreachItems.filter(item => item.status === status);
      }
      
      res.json({
        outreach: outreachItems,
        opportunity_id: oppId,
        total: outreachItems.length,
        filters_applied: { channel, status },
        data_source: 'mock',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('[GRANTS-MOCK] Error fetching outreach:', error);
      res.status(500).json({
        error: 'Failed to fetch outreach',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // ==================== MOCK GRANTS DASHBOARD ====================
  
  // Get grants pipeline overview (mock)
  app.get('/api/grants/dashboard', async (req, res) => {
    try {
      // Calculate stats from mock data
      const opportunityStats = mockOpportunities.reduce((acc, opp) => {
        acc[opp.status] = (acc[opp.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const applicationStats = mockApplications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const outreachStats = mockOutreach.reduce((acc, item) => {
        const key = `${item.channel}_${item.status}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      res.json({
        pipeline_overview: {
          opportunities: opportunityStats,
          applications: applicationStats,
          outreach: outreachStats
        },
        recent_opportunities: mockOpportunities.slice(-5),
        data_source: 'mock',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('[GRANTS-MOCK] Error fetching dashboard:', error);
      res.status(500).json({
        error: 'Failed to fetch grants dashboard',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // ==================== MOCK GRANTS STATUS ====================
  
  // Get grants system status (mock)
  app.get('/api/grants/status', async (req, res) => {
    try {
      res.json({
        system_status: 'operational_mock',
        database_status: 'unavailable',
        data_source: 'mock',
        database_tables: ['grant_opportunity', 'grant_application', 'outreach'],
        statistics: {
          total_opportunities: mockOpportunities.length,
          active_applications: mockApplications.filter(app => app.status === 'ready').length,
          pending_outreach: mockOutreach.filter(item => item.status === 'draft').length
        },
        communication_integration: {
          email_enabled: true,
          sms_enabled: true,
          form_enabled: true
        },
        endpoints: {
          opportunities: '/api/grants/opportunities',
          applications: '/api/grants/applications',
          outreach: '/api/grants/outreach',
          dashboard: '/api/grants/dashboard'
        },
        notice: 'Running with mock data due to database unavailability',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('[GRANTS-MOCK] Error getting status:', error);
      res.status(500).json({
        error: 'Failed to get grants system status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  console.log('🏆 [GRANTS-MOCK] Wolf Pack grants pipeline routes registered with mock data fallback');
}