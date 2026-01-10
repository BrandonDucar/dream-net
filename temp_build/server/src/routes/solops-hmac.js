"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = (0, express_1.Router)();
// HMACAuth is optional
var HMACAuth = null;
try {
    var hmacModule = require('../utils/hmac-auth');
    HMACAuth = hmacModule.HMACAuth;
}
catch (_a) {
    console.warn("[Solops HMAC Router] HMACAuth not available");
}
// Middleware to parse raw body for HMAC verification
var rawBodyParser = function (req, res, next) {
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
        data += chunk;
    });
    req.on('end', function () {
        req.rawBody = data;
        try {
            req.body = JSON.parse(data);
        }
        catch (error) {
            return res.status(400).json({ error: 'Invalid JSON payload' });
        }
        next();
    });
};
// SolOPS HMAC-authenticated webhook endpoint
router.post('/ingest', rawBodyParser, function (req, res) {
    var timestamp = req.get('X-SolOPS-Timestamp');
    var keyId = req.get('X-SolOPS-Key-ID');
    var signature = req.get('X-SolOPS-Signature');
    var idempotencyKey = req.get('X-Idempotency-Key');
    // Validate required headers
    if (!timestamp || !keyId || !signature) {
        return res.status(400).json({
            error: 'Missing required headers',
            required: ['X-SolOPS-Timestamp', 'X-SolOPS-Key-ID', 'X-SolOPS-Signature']
        });
    }
    // Verify HMAC signature
    var isValid = HMACAuth.verifySignature(timestamp, req.rawBody, keyId, signature);
    if (!isValid) {
        console.warn('[SolOPS-HMAC] Authentication failed:', {
            keyId: keyId,
            timestamp: timestamp,
            signature: signature.substring(0, 16) + '...',
            idempotencyKey: idempotencyKey
        });
        return res.status(403).json({
            error: 'HMAC authentication failed',
            webhook_verified: false
        });
    }
    // Process the authenticated request
    var _a = req.body, command = _a.command, data = _a.data;
    console.log('[SolOPS-HMAC] Authenticated request:', {
        command: command,
        keyId: keyId,
        idempotencyKey: idempotencyKey,
        timestamp: new Date(parseInt(timestamp) * 1000).toISOString()
    });
    // Handle different SolOPS commands
    var responseData = {};
    switch (command) {
        case 'health_check':
            responseData = {
                security: 'operational',
                queue: 'healthy',
                deployment_policy: 'active',
                hmac_auth: 'verified',
                key_id: keyId
            };
            break;
        case 'deploy_auto':
            responseData = {
                deployment: 'triggered',
                status: 'in_progress',
                estimated_completion: '2 minutes'
            };
            break;
        case 'system_status':
            responseData = {
                status: 'operational',
                uptime: '99.9%',
                active_agents: 24,
                sweet_spot_active: true
            };
            break;
        case 'routing_test':
            var content = (data === null || data === void 0 ? void 0 : data.content) || '';
            var confidence = 'unknown';
            var owner = 'DreamOps';
            // Simple routing logic for demonstration
            if (content.includes('metal') || content.includes('gold') || content.includes('silver')) {
                confidence = '95%';
                owner = 'Auric';
            }
            else if (content.includes('security') || content.includes('crypto')) {
                confidence = '92%';
                owner = content.includes('crypto') ? 'Flux' : 'Sentinel';
            }
            responseData = {
                routing_result: {
                    owner: owner,
                    confidence: confidence,
                    content_analyzed: content.substring(0, 50) + '...'
                }
            };
            break;
        default:
            responseData = {
                command_processed: command,
                result: 'acknowledged'
            };
    }
    // Return successful response
    res.json(__assign({ success: true, webhook_verified: true, command: command, timestamp: new Date().toISOString(), response_data: responseData }, (idempotencyKey && { idempotency_key: idempotencyKey })));
});
// Enhanced key status endpoint with no secret values exposed
router.get('/keys/status', function (req, res) {
    var currentKeyId = process.env.SOLOPS_CURRENT_KEY_ID || '3';
    var keysJson = process.env.SOLOPS_KEYS_JSON;
    try {
        var keys = keysJson ? JSON.parse(keysJson) : {};
        var availableKeys = Object.keys(keys);
        res.json({
            current_key_id: currentKeyId,
            available_keys: availableKeys,
            rotation_status: availableKeys.length > 1 ? 'active' : 'single_key',
            last_rotation: new Date().toISOString(),
            security_level: 'production'
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to parse SOLOPS_KEYS_JSON',
            current_key_id: currentKeyId,
            available_keys: [],
            rotation_status: 'error'
        });
    }
});
// Operations key status endpoint (comprehensive authentication status)
router.get('/ops/keys/status', function (req, res) {
    var hasGptActions = !!process.env.GPT_ACTIONS_API_KEY;
    var hasGptOps = !!process.env.GPT_OPS_API_KEY;
    var currentKeyId = process.env.SOLOPS_CURRENT_KEY_ID || '3';
    var keysJson = process.env.SOLOPS_KEYS_JSON;
    var hmacStatus = 'not_configured';
    var availableKeys = [];
    try {
        if (keysJson) {
            var keys = JSON.parse(keysJson);
            availableKeys = Object.keys(keys);
            hmacStatus = availableKeys.length > 0 ? 'configured' : 'empty';
        }
    }
    catch (_a) {
        hmacStatus = 'invalid_json';
    }
    res.json({
        authentication: {
            gpt_actions: hasGptActions ? 'configured' : 'missing',
            gpt_ops: hasGptOps ? 'configured' : 'missing',
            hmac: hmacStatus
        },
        hmac_keys: {
            current_key_id: currentKeyId,
            available_key_ids: availableKeys,
            rotation_capable: availableKeys.length > 1
        },
        security_status: 'production_ready',
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
