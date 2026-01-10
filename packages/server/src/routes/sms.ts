import { Router } from 'express';
import { sendDreamCallSMS } from '../../lib/sms';

const router: Router = Router();

// SMS opt-in endpoint
router.post('/opt-in', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: 'Missing phone number' });
    }
    
    // Store phone number in database or external service
    console.log(`📲 New SMS opt-in: ${phone}`);
    
    // Send welcome SMS
    await sendDreamCallSMS(
      phone, 
      'welcome', 
      'Welcome to Dream Network! You\'ll get notified when your dreams need attention.'
    );
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('SMS opt-in error:', error);
    res.status(500).json({ error: 'Failed to process opt-in' });
  }
});

// SMS webhook endpoint for Twilio
router.post('/webhook', async (req, res) => {
  try {
    const incoming = req.body.Body?.trim().toLowerCase();
    const from = req.body.From;

    if (incoming === 'yes') {
      console.log(`✅ Dream agent triggered for ${from}`);
      // Trigger agent, update DB, etc.
    } else if (incoming === 'later') {
      console.log(`⏰ Reschedule request from ${from}`);
      // Log for reminder system
    } else if (incoming === 'stop') {
      console.log(`❌ Unsubscribed: ${from}`);
      // Remove from SMS list
    } else {
      console.log(`🤖 Unknown reply from ${from}: ${incoming}`);
    }

    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send('<Response></Response>');
  } catch (error) {
    console.error('SMS webhook error:', error);
    res.status(500).send('<Response></Response>');
  }
});

// Test endpoint to send dream notification
router.post('/test-dream-call', async (req, res) => {
  try {
    const { phone, dreamId, message } = req.body;
    
    if (!phone || !dreamId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    await sendDreamCallSMS(phone, dreamId, message);
    
    res.status(200).json({ success: true, message: 'Dream call SMS sent' });
  } catch (error) {
    console.error('Test dream call error:', error);
    res.status(500).json({ error: 'Failed to send dream call SMS' });
  }
});

export { router as smsRouter };