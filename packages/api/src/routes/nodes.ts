import { Router } from 'express';

const router = Router();

router.get('/status', async (req, res) => {
    res.json([
        { id: 'node-1', provider: 'lava', uptime: 99.9, earnings: 142.5, status: 'active' },
        { id: 'node-2', provider: 'pocket', uptime: 98.2, earnings: 100.5, status: 'warning' }
    ]);
});

export default router;
