import { Router } from 'express';
import { aiFactory, metabolicEngine } from '@dreamnet/factory';

const router = Router();

/**
 * GET /api/factory/status
 * Returns all active and historical production lines
 */
router.get('/status', (req, res) => {
    res.json({
        ok: true,
        productionLines: aiFactory.getAllProductionLines()
    });
});

/**
 * POST /api/factory/trigger
 * Manually sparks a metabolic pulse
 */
router.post('/trigger', async (req, res) => {
    console.log("[API] Manual Metabolic Trigger received.");
    // Run in background
    metabolicEngine.pulse().catch(err => console.error("Manual pulse failed:", err));

    res.json({
        ok: true,
        message: "Metabolic pulse initiated."
    });
});

export default router;
