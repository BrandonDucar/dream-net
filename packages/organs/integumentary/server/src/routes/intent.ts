import express from 'express';
import { IntentTracker, IntentPulse } from '@dreamnet/shield-core';

const router = express.Router();
const intentTracker = IntentTracker.getInstance();

/**
 * POST /api/intent/pulse
 * Ingest a Shadow Intent pulse (hover, dwell, abandon).
 */
router.post('/pulse', (req, res) => {
    const { assetId, dwellDuration, exitType, vibe } = req.body;

    if (!assetId || dwellDuration === undefined) {
        return res.status(400).json({ success: false, error: 'Missing assetId or dwellDuration' });
    }

    const pulse: IntentPulse = {
        assetId,
        dwellDuration,
        exitType: exitType || 'hover',
        timestamp: Date.now(),
        observerVibe: vibe || 0.5
    };

    const newState = intentTracker.recordPulse(pulse);

    res.json({
        success: true,
        magnetism: newState.magnetismScore,
        totalDwell: newState.totalDwellTime
    });
});

/**
 * GET /api/intent/trending
 * Returns assets with the highest Magnetism (IMS).
 */
router.get('/trending', (req, res) => {
    const trending = intentTracker.getTrendingMagnetism();
    res.json({ success: true, trending });
});

export default router;
