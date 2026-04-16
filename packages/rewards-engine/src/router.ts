
import { Router } from 'express';

export const createRewardsRouter = () => {
    const router = Router();
    router.get('/balance', (req, res) => {
        res.json({ status: 'REWARDS_LEDGER_SYNCED', pool: 0 });
    });
    return router;
};
