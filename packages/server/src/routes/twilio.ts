import type { Express } from "express";
import crypto from "crypto";
import express from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";

// Twilio webhook signature verification
function verifyTwilioSignature(req: any): boolean {
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  if (!twilioAuthToken) return false;
  
  const url = process.env.PUBLIC_URL + req.originalUrl;
  const signature = req.headers["x-twilio-signature"];
  const params = req.body || {};
  
  // Build the data string as Twilio does
  const data = Object.keys(params)
    .sort()
    .reduce((acc, key) => acc + key + params[key], url);
  
  const expectedSignature = crypto
    .createHmac("sha1", twilioAuthToken)
    .update(Buffer.from(data, "utf8"))
    .digest("base64");
  
  return signature === expectedSignature;
}

// Get feature flag mode from database or environment
async function getTwilioMode(): Promise<'off' | 'sim' | 'draft' | 'live'> {
  try {
    // Check environment variable first
    const envMode = process.env.TWILIO_MODE as 'off' | 'sim' | 'draft' | 'live';
    if (envMode && ['off', 'sim', 'draft', 'live'].includes(envMode)) {
      return envMode;
    }
    
    // TODO: Add feature_flags table query when schema is available
    // const result = await db.select()
    //   .from(feature_flags)
    //   .where(eq(feature_flags.flag_key, 'twilio.mode'))
    //   .limit(1);
    // 
    // if (result.length > 0) {
    //   const mode = result[0].value?.mode;
    //   if (mode && ['off', 'sim', 'draft', 'live'].includes(mode)) {
    //     return mode as 'off' | 'sim' | 'draft' | 'live';
    //   }
    // }
    
    // Default based on key presence
    return process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN ? 'draft' : 'off';
  } catch (error) {
    console.error('[Twilio] Error getting mode:', error);
    return 'off';
  }
}

// Store SMS artifact
async function storeSMSArtifact(kind: string, ref: string, data: any): Promise<void> {
  try {
    // TODO: Add to artifacts table when schema is available
    // await db.insert(artifacts).values({
    //   kind,
    //   ref,
    //   data: JSON.stringify(data),
    //   created_at: new Date()
    // });
    
    // For now, log to console with structured format
    console.log(`[Twilio] SMS Artifact: ${kind} | ${ref} | ${JSON.stringify(data)}`);
  } catch (error) {
    console.error('[Twilio] Error storing SMS artifact:', error);
  }
}

export function registerTwilioRoutes(app: Express) {
  // Twilio webhook endpoint for inbound SMS
  app.post('/api/twilio/sms', 
    express.urlencoded({ extended: false }), 
    async (req, res) => {
      try {
        // Verify webhook signature in production
        const shouldVerify = process.env.TWILIO_VERIFY === "true";
        if (shouldVerify && !verifyTwilioSignature(req)) {
          console.warn('[Twilio] Invalid webhook signature');
          return res.status(403).json({ error: 'Invalid signature' });
        }
        
        // Store inbound SMS
        await storeSMSArtifact('twilio.inbound', req.body.From, req.body);
        
        // Get current mode
        const mode = await getTwilioMode();
        
        // Generate response based on mode
        let response = '';
        switch (mode) {
          case 'live':
            response = `<Response><Message>Thanks, we got your message.</Message></Response>`;
            break;
          case 'draft':
            response = `<Response><Message>Test mode: Message received</Message></Response>`;
            break;
          case 'sim':
            response = `<Response><Message>Simulation: Auto-reply active</Message></Response>`;
            break;
          case 'off':
          default:
            response = `<Response></Response>`;
            break;
        }
        
        console.log(`[Twilio] SMS received from ${req.body.From} in ${mode} mode`);
        res.type('text/xml').send(response);
        
      } catch (error) {
        console.error('[Twilio] SMS webhook error:', error);
        res.status(500).type('text/xml').send('<Response></Response>');
      }
    }
  );
  
  // Twilio test endpoint for Reality Contract
  app.get('/api/twilio/test', async (req, res) => {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
      
      if (!accountSid || !authToken) {
        return res.status(503).json({
          enabled: false,
          error: 'Twilio credentials not configured',
          missing: [
            !accountSid ? 'TWILIO_ACCOUNT_SID' : null,
            !authToken ? 'TWILIO_AUTH_TOKEN' : null
          ].filter(Boolean)
        });
      }
      
      const mode = await getTwilioMode();
      
      res.json({
        enabled: true,
        status: mode,
        provider: 'Twilio',
        account_sid: accountSid.substring(0, 8) + '...',
        phone_number: phoneNumber || 'Not configured',
        webhook_url: `${req.protocol}://${req.get('host')}/api/twilio/sms`,
        verification_enabled: process.env.TWILIO_VERIFY === 'true',
        last_test: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('[Twilio] Test endpoint error:', error);
      res.status(500).json({
        enabled: false,
        error: 'Twilio test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Send SMS endpoint (for outbound messages)
  app.post('/api/twilio/send', express.json(), async (req, res) => {
    try {
      const { to, message } = req.body;
      
      if (!to || !message) {
        return res.status(400).json({
          error: 'Missing required fields: to, message'
        });
      }
      
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const fromNumber = process.env.TWILIO_PHONE_NUMBER;
      
      if (!accountSid || !authToken || !fromNumber) {
        return res.status(503).json({
          error: 'Twilio not configured',
          missing: [
            !accountSid ? 'TWILIO_ACCOUNT_SID' : null,
            !authToken ? 'TWILIO_AUTH_TOKEN' : null,
            !fromNumber ? 'TWILIO_PHONE_NUMBER' : null
          ].filter(Boolean)
        });
      }
      
      const mode = await getTwilioMode();
      
      if (mode === 'off') {
        return res.status(503).json({
          error: 'Twilio SMS is disabled',
          mode
        });
      }
      
      if (mode === 'sim') {
        // Simulate sending without actual API call
        await storeSMSArtifact('twilio.outbound.sim', to, { to, message, mode: 'simulated' });
        return res.json({
          success: true,
          mode: 'simulated',
          message_sid: `SM_sim_${Date.now()}`,
          to,
          from: fromNumber,
          body: message
        });
      }
      
      // Real API call for draft/live modes
      try {
        const twilio = await import('twilio');
        const client = twilio.default(accountSid, authToken);
        
        const result = await client.messages.create({
          body: message,
          from: fromNumber,
          to: to
        });
        
        await storeSMSArtifact('twilio.outbound', to, {
          message_sid: result.sid,
          to,
          from: fromNumber,
          body: message,
          status: result.status
        });
        
        res.json({
          success: true,
          mode,
          message_sid: result.sid,
          to,
          from: fromNumber,
          body: message,
          status: result.status
        });
        
      } catch (twilioError) {
        console.error('[Twilio] Send error:', twilioError);
        res.status(500).json({
          error: 'Failed to send SMS',
          details: twilioError instanceof Error ? twilioError.message : 'Twilio API error'
        });
      }
      
    } catch (error) {
      console.error('[Twilio] Send endpoint error:', error);
      res.status(500).json({
        error: 'SMS send failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Twilio status endpoint
  app.get('/api/twilio/status', async (req, res) => {
    try {
      const mode = await getTwilioMode();
      const hasCredentials = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);
      
      res.json({
        enabled: mode !== 'off',
        mode,
        has_credentials: hasCredentials,
        webhook_verification: process.env.TWILIO_VERIFY === 'true',
        endpoints: {
          inbound: '/api/twilio/sms',
          outbound: '/api/twilio/send',
          test: '/api/twilio/test'
        },
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('[Twilio] Status error:', error);
      res.status(500).json({
        error: 'Failed to get Twilio status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  console.log('📱 [TWILIO] SMS integration routes registered with Reality Contract compliance');
}