import type { Express } from "express";
import express from "express";
import { db } from "../db";
import { eq, desc, and, sql } from "drizzle-orm";
import { 
  grantOpportunity, 
  grantApplication, 
  outreach,
  insertGrantOpportunitySchema,
  insertGrantApplicationSchema,
  insertOutreachSchema,
  GrantOpportunityStatus,
  GrantApplicationStatus,
  OutreachStatus,
  OutreachChannel
} from "../../shared/grants-schema";

// Store communication artifact for grants
async function storeGrantArtifact(kind: string, ref: string, data: any): Promise<{ id: string; created_at: string }> {
  try {
    // TODO: Connect to actual artifacts table when available
    const artifact = {
      id: `grant_artifact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };
    
    console.log(`[GRANTS] Artifact stored: ${kind} | ${ref} | ${JSON.stringify(data)}`);
    return artifact;
  } catch (error) {
    console.error('[GRANTS] Error storing artifact:', error);
    throw error;
  }
}

// Check if database is available
async function isDatabaseAvailable(): Promise<boolean> {
  try {
    await db.select().from(grantOpportunity).limit(1);
    return true;
  } catch (error) {
    console.log('[GRANTS] Database unavailable, falling back to mock routes');
    return false;
  }
}

export function registerGrantsRoutes(app: Express) {
  
  // ==================== GRANT OPPORTUNITIES ====================
  
  // Get all grant opportunities with filtering
  app.get('/api/grants/opportunities', async (req, res) => {
    try {
      const { status, source, limit = '50' } = req.query;
      
      let query = db.select().from(grantOpportunity);
      
      // Add filters
      const conditions = [];
      if (status) {
        conditions.push(eq(grantOpportunity.status, status as string));
      }
      if (source) {
        conditions.push(eq(grantOpportunity.source, source as string));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const opportunities = await query
        .orderBy(desc(grantOpportunity.createdAt))
        .limit(parseInt(limit as string));
      
      res.json({
        opportunities,
        total: opportunities.length,
        filters_applied: { status, source },
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('[GRANTS] Error fetching opportunities:', error);
      res.status(500).json({
        error: 'Failed to fetch grant opportunities',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Create new grant opportunity
  app.post('/api/grants/opportunities', express.json(), async (req, res) => {
    try {
      const validatedData = insertGrantOpportunitySchema.parse(req.body);
      
      const [opportunity] = await db
        .insert(grantOpportunity)
        .values(validatedData)
        .returning();
      
      // Store creation artifact
      await storeGrantArtifact('grant.opportunity.created', opportunity.id.toString(), {
        opportunity_id: opportunity.id,
        source: opportunity.source,
        name: opportunity.name,
        created_by: 'system' // TODO: Add user tracking
      });
      
      res.status(201).json({
        success: true,
        opportunity,
        message: 'Grant opportunity created successfully'
      });
      
    } catch (error) {
      console.error('[GRANTS] Error creating opportunity:', error);
      res.status(400).json({
        error: 'Failed to create grant opportunity',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Update grant opportunity status
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
      
      const [updated] = await db
        .update(grantOpportunity)
        .set({ 
          status, 
          updatedAt: new Date() 
        })
        .where(eq(grantOpportunity.id, BigInt(id)))
        .returning();
      
      if (!updated) {
        return res.status(404).json({ error: 'Grant opportunity not found' });
      }
      
      // Store status change artifact
      await storeGrantArtifact('grant.opportunity.status_changed', id, {
        opportunity_id: id,
        old_status: 'unknown', // TODO: Track previous status
        new_status: status,
        changed_by: 'system'
      });
      
      res.json({
        success: true,
        opportunity: updated,
        message: `Status updated to ${status}`
      });
      
    } catch (error) {
      console.error('[GRANTS] Error updating opportunity status:', error);
      res.status(500).json({
        error: 'Failed to update opportunity status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // ==================== GRANT APPLICATIONS ====================
  
  // Get applications for an opportunity
  app.get('/api/grants/opportunities/:oppId/applications', async (req, res) => {
    try {
      const { oppId } = req.params;
      
      const applications = await db
        .select()
        .from(grantApplication)
        .where(eq(grantApplication.oppId, BigInt(oppId)))
        .orderBy(desc(grantApplication.createdAt));
      
      res.json({
        applications,
        opportunity_id: oppId,
        total: applications.length,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('[GRANTS] Error fetching applications:', error);
      res.status(500).json({
        error: 'Failed to fetch applications',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Create new grant application
  app.post('/api/grants/applications', express.json(), async (req, res) => {
    try {
      const validatedData = insertGrantApplicationSchema.parse(req.body);
      
      const [application] = await db
        .insert(grantApplication)
        .values(validatedData)
        .returning();
      
      // Store creation artifact
      await storeGrantArtifact('grant.application.created', application.id.toString(), {
        application_id: application.id,
        opportunity_id: application.oppId,
        status: application.status,
        created_by: 'system'
      });
      
      res.status(201).json({
        success: true,
        application,
        message: 'Grant application created successfully'
      });
      
    } catch (error) {
      console.error('[GRANTS] Error creating application:', error);
      res.status(400).json({
        error: 'Failed to create grant application',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // ==================== OUTREACH MANAGEMENT ====================
  
  // Get outreach for an opportunity
  app.get('/api/grants/opportunities/:oppId/outreach', async (req, res) => {
    try {
      const { oppId } = req.params;
      const { channel, status } = req.query;
      
      let query = db
        .select()
        .from(outreach)
        .where(eq(outreach.oppId, BigInt(oppId)));
      
      // Add filters
      const conditions = [eq(outreach.oppId, BigInt(oppId))];
      if (channel) {
        conditions.push(eq(outreach.channel, channel as string));
      }
      if (status) {
        conditions.push(eq(outreach.status, status as string));
      }
      
      const outreachItems = await query
        .where(and(...conditions))
        .orderBy(desc(outreach.createdAt));
      
      res.json({
        outreach: outreachItems,
        opportunity_id: oppId,
        total: outreachItems.length,
        filters_applied: { channel, status },
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('[GRANTS] Error fetching outreach:', error);
      res.status(500).json({
        error: 'Failed to fetch outreach',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Create outreach record
  app.post('/api/grants/outreach', express.json(), async (req, res) => {
    try {
      const validatedData = insertOutreachSchema.parse(req.body);
      
      const [outreachRecord] = await db
        .insert(outreach)
        .values(validatedData)
        .returning();
      
      // Store creation artifact
      await storeGrantArtifact('grant.outreach.created', outreachRecord.id.toString(), {
        outreach_id: outreachRecord.id,
        opportunity_id: outreachRecord.oppId,
        channel: outreachRecord.channel,
        to_addr: outreachRecord.toAddr,
        created_by: 'system'
      });
      
      res.status(201).json({
        success: true,
        outreach: outreachRecord,
        message: 'Outreach record created successfully'
      });
      
    } catch (error) {
      console.error('[GRANTS] Error creating outreach:', error);
      res.status(400).json({
        error: 'Failed to create outreach record',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Send outreach (integrates with communication system)
  app.post('/api/grants/outreach/:id/send', express.json(), async (req, res) => {
    try {
      const { id } = req.params;
      const { message, subject } = req.body;
      
      // Get outreach record
      const [outreachRecord] = await db
        .select()
        .from(outreach)
        .where(eq(outreach.id, BigInt(id)))
        .limit(1);
      
      if (!outreachRecord) {
        return res.status(404).json({ error: 'Outreach record not found' });
      }
      
      if (outreachRecord.status !== OutreachStatus.DRAFT) {
        return res.status(400).json({ 
          error: 'Outreach already sent',
          current_status: outreachRecord.status 
        });
      }
      
      let sendResult;
      let providerId;
      
      // Send via appropriate channel
      switch (outreachRecord.channel) {
        case OutreachChannel.EMAIL:
          // Call email communication system
          const emailResponse = await fetch(`${req.protocol}://${req.get('host')}/api/comm/email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: outreachRecord.toAddr,
              subject: subject || `Grant Opportunity: ${outreachRecord.oppId}`,
              body: message
            })
          });
          sendResult = await emailResponse.json();
          providerId = sendResult.messageId;
          break;
          
        case OutreachChannel.SMS:
          // Call SMS communication system
          const smsResponse = await fetch(`${req.protocol}://${req.get('host')}/api/comm/sms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: outreachRecord.toAddr,
              body: message
            })
          });
          sendResult = await smsResponse.json();
          providerId = sendResult.sid;
          break;
          
        case OutreachChannel.FORM:
          // Store as form submission artifact
          await storeGrantArtifact('grant.outreach.form_submission', id, {
            outreach_id: id,
            form_data: { message, subject },
            to_addr: outreachRecord.toAddr
          });
          sendResult = { success: true, mode: 'form_submission' };
          providerId = `form_${Date.now()}`;
          break;
          
        default:
          return res.status(400).json({ error: 'Unsupported outreach channel' });
      }
      
      // Update outreach status
      const newStatus = sendResult.error ? OutreachStatus.BOUNCED : OutreachStatus.SENT;
      
      const [updated] = await db
        .update(outreach)
        .set({ 
          status: newStatus,
          providerId,
          updatedAt: new Date()
        })
        .where(eq(outreach.id, BigInt(id)))
        .returning();
      
      // Store send artifact
      await storeGrantArtifact('grant.outreach.sent', id, {
        outreach_id: id,
        channel: outreachRecord.channel,
        status: newStatus,
        provider_id: providerId,
        send_result: sendResult
      });
      
      res.json({
        success: !sendResult.error,
        outreach: updated,
        send_result: sendResult,
        message: sendResult.error ? 'Outreach failed to send' : 'Outreach sent successfully'
      });
      
    } catch (error) {
      console.error('[GRANTS] Error sending outreach:', error);
      res.status(500).json({
        error: 'Failed to send outreach',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // ==================== GRANTS DASHBOARD ====================
  
  // Get grants pipeline overview
  app.get('/api/grants/dashboard', async (req, res) => {
    try {
      // Get opportunity counts by status
      const opportunityStats = await db
        .select({
          status: grantOpportunity.status,
          count: sql<number>`cast(count(*) as int)`
        })
        .from(grantOpportunity)
        .groupBy(grantOpportunity.status);
      
      // Get application counts by status
      const applicationStats = await db
        .select({
          status: grantApplication.status,
          count: sql<number>`cast(count(*) as int)`
        })
        .from(grantApplication)
        .groupBy(grantApplication.status);
      
      // Get outreach counts by channel and status
      const outreachStats = await db
        .select({
          channel: outreach.channel,
          status: outreach.status,
          count: sql<number>`cast(count(*) as int)`
        })
        .from(outreach)
        .groupBy(outreach.channel, outreach.status);
      
      // Get recent activity (last 10 opportunities)
      const recentOpportunities = await db
        .select()
        .from(grantOpportunity)
        .orderBy(desc(grantOpportunity.createdAt))
        .limit(10);
      
      res.json({
        pipeline_overview: {
          opportunities: opportunityStats.reduce((acc, stat) => {
            acc[stat.status] = stat.count;
            return acc;
          }, {} as Record<string, number>),
          applications: applicationStats.reduce((acc, stat) => {
            acc[stat.status] = stat.count;
            return acc;
          }, {} as Record<string, number>),
          outreach: outreachStats.reduce((acc, stat) => {
            const key = `${stat.channel}_${stat.status}`;
            acc[key] = stat.count;
            return acc;
          }, {} as Record<string, number>)
        },
        recent_opportunities: recentOpportunities,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('[GRANTS] Error fetching dashboard:', error);
      res.status(500).json({
        error: 'Failed to fetch grants dashboard',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // ==================== GRANTS STATUS ====================
  
  // Get grants system status
  app.get('/api/grants/status', async (req, res) => {
    try {
      const totalOpportunities = await db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(grantOpportunity);
      
      const activeApplications = await db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(grantApplication)
        .where(eq(grantApplication.status, GrantApplicationStatus.READY));
      
      const pendingOutreach = await db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(outreach)
        .where(eq(outreach.status, OutreachStatus.DRAFT));
      
      res.json({
        system_status: 'operational',
        database_tables: ['grant_opportunity', 'grant_application', 'outreach'],
        statistics: {
          total_opportunities: totalOpportunities[0]?.count || 0,
          active_applications: activeApplications[0]?.count || 0,
          pending_outreach: pendingOutreach[0]?.count || 0
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
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('[GRANTS] Error getting status:', error);
      res.status(500).json({
        error: 'Failed to get grants system status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Check database availability and register mock routes if needed
  isDatabaseAvailable().then(available => {
    if (!available) {
      console.log('🏆 [GRANTS] Database unavailable, mock routes will be registered separately');
    } else {
      console.log('🏆 [GRANTS] Wolf Pack grants pipeline routes registered with Reality Contract compliance');
    }
  });
}