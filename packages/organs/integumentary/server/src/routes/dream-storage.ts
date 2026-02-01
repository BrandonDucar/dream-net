import express from 'express';
import { saveDreamCoreToLocal, loadDreamCoreFromLocal, listSavedDreamCores } from '../lib/saveDreamCore';

const router = express.Router();

// Save dream core
router.post('/save', async (req, res) => {
  try {
    const { dreamCore, walletAddress } = req.body;

    if (!dreamCore || !walletAddress) {
      return res.status(400).json({ error: 'dreamCore and walletAddress are required' });
    }

    const result = await saveDreamCoreToLocal(dreamCore, walletAddress);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Load dream core by wallet address
router.get('/load/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const result = await loadDreamCoreFromLocal(walletAddress);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// List all saved dream cores
router.get('/list', async (req, res) => {
  try {
    const result = await listSavedDreamCores();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;