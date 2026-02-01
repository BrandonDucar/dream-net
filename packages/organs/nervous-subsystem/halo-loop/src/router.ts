
import { Router } from 'express';
import { haloEngine } from './haloEngine.js';
import { triggerHaloFromEvent } from './triggers/eventWormholeTrigger.js';

export const createHaloRouter = () => {
    const router = Router();

    router.get('/health', (req, res) => {
        res.json({ status: 'ALIVE', engine: haloEngine.getStatus() });
    });

    router.post('/trigger', (req, res) => {
        const { type, severity, metadata } = req.body;
        // Manual trigger simulation
        if (type && severity) {
            triggerHaloFromEvent(type, severity);
            res.json({ success: true, message: `Triggered ${type} [${severity}]` });
        } else {
            res.status(400).json({ error: "Missing type or severity" });
        }
    });

    return router;
};
