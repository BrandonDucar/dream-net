
import { Router } from 'express';

export const createWormholeRouter = () => {
  const router = Router();
  router.get('/metrics', (req, res) => {
    res.json({ status: 'WORMHOLE_OBSERVATORY_ACTIVE', events: 0 });
  });
  return router;
};
