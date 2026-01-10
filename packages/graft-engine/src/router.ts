
import { Router } from 'express';

export const createGraftRouter = () => {
    const router = Router();
    router.get('/', (req, res) => {
        res.json({ status: 'GRAFT_ENGINE_ACTIVE', version: '0.1.0' });
    });
    return router;
};
