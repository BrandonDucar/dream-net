/**
 * CoinSensei API Routes
 */

import { Router } from 'express';
import { CoinSensei } from '@dreamnet/coinsensei-core';
import type { CoinSenseiInput } from '@dreamnet/coinsensei-core';

const router = Router();

router.post('/analyze', async (req, res) => {
  try {
    const input: CoinSenseiInput = req.body;
    
    const sensei = new CoinSensei(input.config);
    const result = await sensei.analyze(input);
    
    res.json(result);
  } catch (error: any) {
    console.error('CoinSensei analysis error:', error);
    res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'CoinSensei 2.0' });
});

export { router as createCoinSenseiRouter };

