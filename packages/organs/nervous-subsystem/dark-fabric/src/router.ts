
import { Router } from 'express';

export const createFabricRouter = () => {
  const router = Router();
  router.get('/status', (req, res) => {
    res.json({ status: 'DARK_FABRIC_WOVEN', layers: 3 });
  });
  return router;
};
