/**
 * DreamNet Voice API Routes
 * Phase 2 - One Mouth: Twilio SMS integration
 */

import { Router, type Request, type Response } from "express";

const router: Router = Router();

// DreamNet Voice Twilio is optional
let DreamNetVoiceTwilio: any = null;
try {
  const voiceModule = require("../../packages/dreamnet-voice-twilio");
  DreamNetVoiceTwilio = voiceModule.DreamNetVoiceTwilio;
} catch {
  console.warn("[Voice Router] @dreamnet/dreamnet-voice-twilio not available");
}

// Operational bridge is optional
let bridgeToSpiderWeb: any = null;
try {
  const bridgeModule = require("../../packages/dreamnet-operational-bridge");
  bridgeToSpiderWeb = bridgeModule.bridgeToSpiderWeb;
} catch {
  console.warn("[Voice Router] @dreamnet/dreamnet-operational-bridge not available");
}

// GET /api/voice/status - Get Voice status
router.get("/status", (req, res) => {
  if (!DreamNetVoiceTwilio) {
    return res.status(503).json({ error: "DreamNet Voice Twilio not available" });
  }
  try {
    const status = DreamNetVoiceTwilio.status();
    const stats = DreamNetVoiceTwilio.getStats();
    res.json({
      success: true,
      status,
      stats,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/voice/test - Send test SMS
router.post("/test", async (req, res) => {
  if (!DreamNetVoiceTwilio) {
    return res.status(503).json({ error: "DreamNet Voice Twilio not available" });
  }
  try {
    const { message } = req.body;
    const testMessage = message || "🧪 Test message from DreamNet Voice";
    
    const result = await DreamNetVoiceTwilio.send({
      body: testMessage,
    });

    if (result.success) {
      res.json({
        success: true,
        message: "Test SMS sent",
        sid: result.sid,
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/voice/send - Send custom SMS
router.post("/send", async (req, res) => {
  if (!DreamNetVoiceTwilio) {
    return res.status(503).json({ error: "DreamNet Voice Twilio not available" });
  }
  try {
    const { body, to } = req.body;
    
    if (!body) {
      return res.status(400).json({ error: "Message body required" });
    }

    const result = await DreamNetVoiceTwilio.send({
      body,
      to,
    });

    if (result.success) {
      res.json({
        success: true,
        message: "SMS sent",
        sid: result.sid,
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/voice/trigger-event - Manually trigger an event to test routing
router.post("/trigger-event", async (req, res) => {
  try {
    const { type, severity, message, metadata } = req.body;
    
    const event = {
      type: type || "test_event",
      severity: severity || "medium",
      message: message || "Test event from Voice API",
      metadata: metadata || {},
      timestamp: Date.now(),
    };

    // Bridge to Spider Web (which will route to Voice)
    bridgeToSpiderWeb(event);

    res.json({
      success: true,
      message: "Event triggered",
      event,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

