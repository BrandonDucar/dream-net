import { Router } from 'express';
import { idempotencyMiddleware } from '../middleware/idempotency';
import { eventSystem } from '../services/EventSystem';

const router = Router();

// SolOPS Webhook Security System with replay protection
router.post('/solops/ingest', idempotencyMiddleware, (req, res) => {
  try {
    const signature = req.headers['x-signature-sha256'] as string;
    const timestamp = req.headers['x-timestamp'] as string;
    const keyId = req.headers['x-key-id'] as string;
    
    if (!signature || !timestamp || !keyId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required headers: x-signature-sha256, x-timestamp, x-key-id' 
      });
    }

    // Import HMAC verification (assuming it exists in the codebase)
    const { verifyHMACSignature } = require('../utils/security'); // Adjust path as needed

    // Verify HMAC signature
    const isValid = verifyHMACSignature(
      JSON.stringify(req.body),
      signature,
      timestamp,
      keyId
    );

    if (!isValid) {
      console.log('🔐 [SolOPS] Invalid HMAC signature');
      return res.status(401).json({ success: false, error: 'Invalid signature' });
    }

    console.log('🔐 [SolOPS] Valid webhook received with idempotency protection');
    
    // Process the webhook payload
    const payload = req.body;
    
    // Emit event for processing
    eventSystem.emitEvent('solops.webhook_received', {
      key_id: keyId,
      timestamp: timestamp,
      payload_type: payload.type || 'unknown',
      payload_size: JSON.stringify(payload).length,
      idempotency_key: req.headers['x-idempotency-key'] || 'none'
    }, 'Brandon'); // SolOPS events go to Brandon

    res.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      key_id: keyId,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('🔐 [SolOPS] Error processing webhook:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ChatGPT Actions webhook with replay protection
router.post('/gpt/ingest', idempotencyMiddleware, (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required header: x-api-key' 
      });
    }

    // Verify API key (basic check - in production, use proper key validation)
    if (apiKey !== process.env.GPT_ACTIONS_API_KEY) {
      console.log('🤖 [GPT] Invalid API key');
      return res.status(401).json({ success: false, error: 'Invalid API key' });
    }

    console.log('🤖 [GPT] Valid webhook received with idempotency protection');
    
    // Process the webhook payload
    const payload = req.body;
    
    // Emit event for processing
    eventSystem.emitEvent('gpt.webhook_received', {
      timestamp: new Date().toISOString(),
      payload_type: payload.type || 'unknown',
      payload_size: JSON.stringify(payload).length,
      idempotency_key: req.headers['x-idempotency-key'] || 'none'
    }, 'Brandon'); // GPT events go to Brandon

    res.json({ 
      success: true, 
      message: 'GPT webhook processed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('🤖 [GPT] Error processing webhook:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;