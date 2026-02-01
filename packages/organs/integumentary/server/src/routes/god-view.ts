
import { Router } from 'express';
import { sensoryMemory } from '../services/SensoryMemory.js';
import { aliveMode } from '../core/AliveMode.js';

export const createGodViewRouter = () => {
    const router = Router();

    router.get('/sync', (req, res) => {
        const snapshot = sensoryMemory.getSnapshot();
        res.json({
            mode: 'GOD_MODE',
            telemetry: snapshot
        });
    });

    // Manual Pulse Trigger from Dashboard
    router.post('/pulse', async (req, res) => {
        const { GlobalScanningService } = await import('../services/GlobalScanningService.js');
        const { dreamEventBus } = await import('@dreamnet/nerve');

        // This is a bit dirty re-instantiating, but effectively triggers the pulse logic
        // Ideally we grab the singleton instance if exported, but GSS manages its own state well enough for this.
        const scanner = new GlobalScanningService(dreamEventBus as any);
        scanner.triggerReconPulse().catch(console.error);

        res.json({ status: 'PULSE_INITIATED' });
    });

    return router;
};
