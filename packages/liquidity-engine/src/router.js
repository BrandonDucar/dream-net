import { Router } from 'express';
export const createLiquidityRouter = () => {
    const router = Router();
    router.get('/depth', (req, res) => {
        res.json({ status: 'LIQUIDITY_POOLS_DRAINED', depth: 0 });
    });
    return router;
};
//# sourceMappingURL=router.js.map