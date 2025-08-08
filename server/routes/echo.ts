import express from 'express';
import { echoScan } from '../agents/ECHO';

const router = express.Router();

router.post('/', async (req, res) => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Missing walletAddress' });
  }

  try {
    const result = await echoScan(walletAddress);
    return res.json({ status: 'success', result });
  } catch (err) {
    console.error("🪞 ECHO error:", err);
    return res.status(500).json({ status: 'error', message: 'ECHO scan failed.' });
  }
});

export default router;