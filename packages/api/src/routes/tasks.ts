import { Router } from 'express';

const router = Router();

router.get('/queue', async (req, res) => {
    res.json([
        { id: '1', title: 'Review DeSci Preprint #42', reward: 150, type: 'bounty', status: 'open' },
        { id: '2', title: 'Optimize Pheromone Decay Loop', reward: 500, type: 'bounty', status: 'open' }
    ]);
});

router.get('/earnings', async (req, res) => {
    res.json({
        total: 813,
        breakdown: { node: 243, desci: 450, teach: 120 }
    });
});

export default router;
