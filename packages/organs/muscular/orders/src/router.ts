
import { Router } from 'express';

export const createOrdersRouter = () => {
    const router = Router();
    router.get('/', (req, res) => {
        res.json({ status: 'ORDERS_SYSTEM_READY', pending: 0 });
    });
    return router;
};
