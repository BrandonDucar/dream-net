
import { Router } from 'express';

export const createSquadRouter = () => {
  const router = Router();
  router.get('/', (req, res) => {
    res.json({ status: 'SQUAD_BUILDER_ACTIVE', agents: [] });
  });
  // Add real routes here later
  return router;
};
