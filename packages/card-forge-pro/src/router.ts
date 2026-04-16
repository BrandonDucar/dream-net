
import { Router } from 'express';
import { cardForgePro } from './index.js';

export const createForgeRouter = () => {
    const router = Router();

    router.post('/create', async (req, res) => {
        try {
            const result = await cardForgePro.createCard(req.body);
            res.json(result);
        } catch (error: any) {
            console.error("[CardForge] API Error:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
