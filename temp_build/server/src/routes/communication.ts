import type { Express } from "express";
import express from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";

// Get feature flag mode from database or environment
async function getCommMode(service: 'twilio' | 'gmail'): Promise<'off' | 'sim' | 'draft' | 'live'> {
  try {
    // Check environment variable first
    const envMode = process.env[`${service.toUpperCase()}_MODE`] as 'off' | 'sim' | 'draft' | 'live';
    if (envMode && ['off', 'sim', 'draft', 'live'].includes(envMode)) {
      return envMode;
    }
    
    // TODO: Add feature_flags table query when schema is available
    // const result = await db.select()
    //   .from(feature_flags)
    //   .where(eq(feature_flags.flag_key, `${service}.mode`))
    //   .limit(1);
    // 
    // if (result.length > 0) {
    //   const mode = result[0].value?.mode;
    //   if (mode && ['off', 'sim', 'draft', 'live'].includes(mode)) {
    //     return mode as 'off' | 'sim' | 'draft' | 'live';
    //   }
    // }
    
    // Default based on key presence
    if (service === 'twilio') {
      return process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN ? 'draft' : 'off';
    } else {
      return process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? 'draft' : 'off';
    }
  } catch (error) {
    console.error(`[${service.toUpperCase()}] Error getting mode:`, error);
    return 'off';
  }
}

// Store communication artifact
async function storeCommArtifact(kind: string, ref: string, data: any): Promise<{ id: string; created_at: string }> {
  try {
    // TODO: Add to artifacts table when schema is available
    // const result = await db.insert(artifacts).values({
    //   kind,
    //   ref,
    //   data: JSON.stringify(data),
    //   created_at: new Date()
    // }).returning({ id: artifacts.id, created_at: artifacts.created_at });
    // return result[0];
    
    // For now, simulate with timestamp and UUID
    const artifact = {
      id: `artifact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };
    
    console.log(`[COMM] Artifact stored: ${kind} | ${ref} | ${JSON.stringify(data)}`);
    return artifact;
  } catch (error) {
    console.error('[COMM] Error storing artifact:', error);
    throw error;
  }
}

// Basic auth middleware (placeholder for Replit Auth)
const requireReplitAuth = (req: any, res: any, next: any) => {
  // TODO: Replace with actual Replit Auth check
  const authToken = req.headers['authorization'] || req.headers['x-auth-token'];
  if (!authToken && process.env.NODE_ENV === 'production') {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

export function registerCommunicationRoutes(app: Express) {
  
  // ==================== SMS COMMUNICATION ====================
  
  app.post('/api/comm/sms', 
    requireReplitAuth,
    express.json(), 
    async (req, res) => {
      try {
        const { to, body } = req.body || {};
        
        if (!to || !body) {
          return res.status(400).json({ error: "to_and_body_required" });
        }
        
        const mode = await getCommMode('twilio');
        
        if (mode === "draft" || mode === "sim") {
          // Save draft artifact only
          const artifact = await storeCommArtifact('twilio.outbound.draft', to, { to, body });
          return res.json({ 
            mode, 
            draft_artifact: artifact,
            message: `SMS stored as ${mode} artifact - no actual send`
          });
        }
        
        if (mode === "live") {
          const sid = process.env.TWILIO_ACCOUNT_SID;
          const token = process.env.TWILIO_AUTH_TOKEN;
          const from = process.env.TWILIO_PHONE_NUMBER;
          
          if (!sid || !token || !from) {
            return res.status(503).json({ 
              error: "twilio_credentials_missing",
              missing: [!sid ? 'TWILIO_ACCOUNT_SID' : null, !token ? 'TWILIO_AUTH_TOKEN' : null, !from ? 'TWILIO_PHONE_NUMBER' : null].filter(Boolean)
            });
          }
          
          try {
            const axios = await import('axios');
            const response = await axios.default.post(
              `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
              new URLSearchParams({ To: to, From: from, Body: body }).toString(),
              { 
                auth: { username: sid, password: token }, 
                headers: { "Content-Type": "application/x-www-form-urlencoded" } 
              }
            );
            
            await storeCommArtifact('twilio.outbound', to, response.data);
            
            return res.json({ 
              mode, 
              sid: response.data.sid,
              status: response.data.status,
              message: "SMS sent successfully"
            });
            
          } catch (twilioError) {
            console.error('[COMM] Twilio API error:', twilioError);
            return res.status(500).json({
              error: "twilio_api_failed",
              details: twilioError instanceof Error ? twilioError.message : 'Unknown error'
            });
          }
        }
        
        res.status(503).json({ error: "twilio_off", mode });
        
      } catch (error) {
        console.error('[COMM] SMS error:', error);
        res.status(500).json({ 
          error: 'sms_failed', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
  );
  
  // ==================== EMAIL COMMUNICATION ====================
  
  app.post('/api/comm/email',
    requireReplitAuth,
    express.json(),
    async (req, res) => {
      try {
        const { to, subject, body, from } = req.body || {};
        
        if (!to || !subject || !body) {
          return res.status(400).json({ 
            error: "to_subject_body_required",
            required: ['to', 'subject', 'body']
          });
        }
        
        const mode = await getCommMode('gmail');
        
        if (mode === "draft" || mode === "sim") {
          // Save draft artifact only
          const artifact = await storeCommArtifact('gmail.send.draft', to, { 
            to, 
            subject, 
            body, 
            from: from || 'noreply@dreamnet.ink' 
          });
          
          return res.json({ 
            mode, 
            draft_artifact: artifact,
            message: `Email stored as ${mode} artifact - no actual send`
          });
        }
        
        if (mode === "live") {
          const clientId = process.env.GOOGLE_CLIENT_ID;
          const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
          const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
          
          if (!clientId || !clientSecret || !refreshToken) {
            return res.status(503).json({ 
              error: "gmail_credentials_missing",
              missing: [
                !clientId ? 'GOOGLE_CLIENT_ID' : null, 
                !clientSecret ? 'GOOGLE_CLIENT_SECRET' : null,
                !refreshToken ? 'GOOGLE_REFRESH_TOKEN' : null
              ].filter(Boolean)
            });
          }
          
          try {
            // Gmail API implementation
            const { google } = await import('googleapis');
            const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
            oauth2Client.setCredentials({ refresh_token: refreshToken });
            
            const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
            
            // Create email message
            const emailLines = [
              `To: ${to}`,
              `Subject: ${subject}`,
              `From: ${from || 'noreply@dreamnet.ink'}`,
              '',
              body
            ];
            
            const email = emailLines.join('\r\n');
            const encodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
            
            const response = await gmail.users.messages.send({
              userId: 'me',
              requestBody: {
                raw: encodedEmail
              }
            });
            
            await storeCommArtifact('gmail.send', to, {
              messageId: response.data.id,
              to,
              subject,
              from: from || 'noreply@dreamnet.ink',
              threadId: response.data.threadId
            });
            
            return res.json({ 
              mode, 
              messageId: response.data.id,
              threadId: response.data.threadId,
              message: "Email sent successfully"
            });
            
          } catch (gmailError) {
            console.error('[COMM] Gmail API error:', gmailError);
            return res.status(500).json({
              error: "gmail_api_failed",
              details: gmailError instanceof Error ? gmailError.message : 'Unknown error'
            });
          }
        }
        
        res.status(503).json({ error: "gmail_off", mode });
        
      } catch (error) {
        console.error('[COMM] Email error:', error);
        res.status(500).json({ 
          error: 'email_failed', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
  );
  
  // ==================== COMMUNICATION STATUS ====================
  
  app.get('/api/comm/status', async (req, res) => {
    try {
      const twilioMode = await getCommMode('twilio');
      const gmailMode = await getCommMode('gmail');
      
      const status = {
        sms: {
          mode: twilioMode,
          enabled: twilioMode !== 'off',
          has_credentials: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
          endpoints: {
            send: '/api/comm/sms',
            webhook: '/api/twilio/sms'
          }
        },
        email: {
          mode: gmailMode,
          enabled: gmailMode !== 'off',
          has_credentials: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
          endpoints: {
            send: '/api/comm/email'
          }
        },
        timestamp: new Date().toISOString()
      };
      
      res.json(status);
      
    } catch (error) {
      console.error('[COMM] Status error:', error);
      res.status(500).json({
        error: 'Failed to get communication status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // ==================== COMMUNICATION TEST ====================
  
  app.get('/api/comm/test', async (req, res) => {
    try {
      const twilioMode = await getCommMode('twilio');
      const gmailMode = await getCommMode('gmail');
      
      const tests = {
        sms: {
          mode: twilioMode,
          credentials_present: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
          test_endpoint: '/api/comm/sms',
          test_payload: { to: '+1234567890', body: 'Test message' }
        },
        email: {
          mode: gmailMode,
          credentials_present: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
          test_endpoint: '/api/comm/email',
          test_payload: { to: 'test@example.com', subject: 'Test', body: 'Test email' }
        },
        overall_status: {
          sms_ready: twilioMode !== 'off',
          email_ready: gmailMode !== 'off',
          any_live: twilioMode === 'live' || gmailMode === 'live'
        }
      };
      
      res.json(tests);
      
    } catch (error) {
      console.error('[COMM] Test error:', error);
      res.status(500).json({
        error: 'Communication test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  console.log('📧 [COMMUNICATION] SMS and Email routes registered with Reality Contract compliance');
}