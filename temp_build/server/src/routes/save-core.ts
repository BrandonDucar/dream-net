import express from 'express';
import { saveDreamCoreToLocal } from '../lib/saveDreamCore';

const router = express.Router();

router.post('/', async (req, res) => {
  const { dreamCore, walletAddress } = req.body;

  if (!dreamCore || !walletAddress) {
    return res.status(400).json({ error: 'Missing dreamCore or walletAddress' });
  }

  const result = await saveDreamCoreToLocal(dreamCore, walletAddress);
  res.json(result);
});

export default router;