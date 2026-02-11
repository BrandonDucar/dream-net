import { Router } from 'express';
// import { calculateScore, getTier } from '@dreamnet/shared/utils/pheromone';

const router = Router();

router.get('/:wallet', async (req, res) => {
    const { wallet } = req.params;

    // Mock data for scaffold
    res.json({
        userId: wallet,
        score: 142.5,
        tier: 'swarm',
        lastUpdated: new Date(),
        progress: 42,
        breakdown: {
            tasks: 50,
            credentials: 30,
            recruitment: 20,
            nodes: 40,
            social: 2.5
        }
    });
});

export default router;
