import { Router } from 'express';
import { getStatus } from './aliveEngine.js';
export const createAliveRouter = () => {
    const router = Router();
    router.get('/status', async (req, res) => {
        res.json(await getStatus());
    });
    router.post('/heartbeat', (req, res) => {
        const { agentId, timestamp } = req.body;
        if (agentId) {
            // Heartbeat logic pending - this is a stub
            // aliveEngine.recordHeartbeat(agentId, timestamp || Date.now());
            res.json({ success: true, alive: true, note: "Heartbeat recorded (stub)" });
        }
        else {
            res.status(400).json({ error: "Missing agentId" });
        }
    });
    return router;
};
//# sourceMappingURL=router.js.map