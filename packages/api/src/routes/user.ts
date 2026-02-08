import { Router } from 'express';

const router = Router();

router.get('/profile', async (req, res) => {
    res.json({
        id: 'user-123',
        walletAddress: '0x123...abc',
        role: 'builder',
        createdAt: new Date()
    });
});

export default router;
