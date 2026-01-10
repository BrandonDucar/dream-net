"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trustScore_1 = require("../logic/trustScore");
const messageValidation_1 = require("../logic/messageValidation");
const node_config_1 = require("../node.config");
const router = (0, express_1.Router)();
// Mint a new message with micro-tokens
router.post('/mint', async (req, res) => {
    try {
        const { to: toWallet, message: content, from: fromWallet, value: tokenAmount = "1.00", token: tokenType = 'FLBY', signature } = req.body;
        // Validate wallet trust score with isolation boundary
        const trustValidation = await (0, trustScore_1.validateTrustScore)(fromWallet);
        if (!trustValidation.valid) {
            return res.status(403).json({
                error: 'Insufficient trust score for Flutterbye node export',
                required: node_config_1.FLUTTERBY_NODE.trustBoundary,
                current: trustValidation.score,
                isolation: node_config_1.FLUTTERBY_NODE.isolation ? 'Isolated node requires higher trust' : false
            });
        }
        // Validate required fields
        if (!fromWallet || !toWallet || !content) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['from', 'to', 'message']
            });
        }
        // Validate message format and content
        const numericAmount = parseFloat(tokenAmount);
        const messageValidation = (0, messageValidation_1.validateMessage)(content, numericAmount);
        if (!messageValidation.valid) {
            return res.status(400).json({
                error: 'Invalid message format',
                details: messageValidation.errors
            });
        }
        // Create message object
        const message = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            fromWallet,
            toWallet,
            content,
            tokens: {
                amount: parseFloat(tokenAmount),
                token: tokenType
            },
            timestamp: Date.now(),
            signature,
            validated: true
        };
        // TODO: Integrate with blockchain for actual token minting
        // This would involve smart contract interaction
        res.json({
            success: true,
            message: {
                id: message.id,
                status: 'minted',
                deliveryEstimate: '2-5 minutes',
                gasEstimate: '0.001 ETH'
            }
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Minting failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Get minting status
router.get('/mint/:messageId/status', async (req, res) => {
    try {
        const { messageId } = req.params;
        // TODO: Query blockchain for message status
        const status = {
            id: messageId,
            status: 'delivered', // pending, minted, delivered, failed
            confirmations: 12,
            deliveredAt: Date.now() - 60000
        };
        res.json(status);
    }
    catch (error) {
        res.status(500).json({
            error: 'Status check failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
