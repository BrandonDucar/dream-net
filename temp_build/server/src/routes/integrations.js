"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var idempotency_1 = require("../middleware/idempotency");
var EventSystem_1 = require("../services/EventSystem");
var router = (0, express_1.Router)();
// SolOPS Webhook Security System with replay protection
router.post('/solops/ingest', idempotency_1.idempotencyMiddleware, function (req, res) {
    try {
        var signature = req.headers['x-signature-sha256'];
        var timestamp = req.headers['x-timestamp'];
        var keyId = req.headers['x-key-id'];
        if (!signature || !timestamp || !keyId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required headers: x-signature-sha256, x-timestamp, x-key-id'
            });
        }
        // Import HMAC verification (assuming it exists in the codebase)
        var verifyHMACSignature = require('../utils/security').verifyHMACSignature; // Adjust path as needed
        // Verify HMAC signature
        var isValid = verifyHMACSignature(JSON.stringify(req.body), signature, timestamp, keyId);
        if (!isValid) {
            console.log('🔐 [SolOPS] Invalid HMAC signature');
            return res.status(401).json({ success: false, error: 'Invalid signature' });
        }
        console.log('🔐 [SolOPS] Valid webhook received with idempotency protection');
        // Process the webhook payload
        var payload = req.body;
        // Emit event for processing
        EventSystem_1.eventSystem.emitEvent('solops.webhook_received', {
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
    }
    catch (error) {
        console.error('🔐 [SolOPS] Error processing webhook:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
// ChatGPT Actions webhook with replay protection
router.post('/gpt/ingest', idempotency_1.idempotencyMiddleware, function (req, res) {
    try {
        var apiKey = req.headers['x-api-key'];
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
        var payload = req.body;
        // Emit event for processing
        EventSystem_1.eventSystem.emitEvent('gpt.webhook_received', {
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
    }
    catch (error) {
        console.error('🤖 [GPT] Error processing webhook:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
exports.default = router;
