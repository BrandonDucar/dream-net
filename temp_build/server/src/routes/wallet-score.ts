import express from 'express';
import { calculateWalletScore } from '../utils/wallet-scoring';
import { NODE_ENV } from '../config/env';
import { validateWalletScoreRequest } from '../validation/wallet';
import { createValidationMiddleware } from '../validation/common';
import { getRequestLogger } from '../utils/logger';

const router: express.Router = express.Router();

// Wallet score evaluation for CRADLE vs SEED access determination
router.post('/', createValidationMiddleware((req) => validateWalletScoreRequest(req.body)), async (req, res) => {
  const wallet = req.validated?.wallet || req.body.wallet;
  const log = getRequestLogger(req);

  try {
    const isProduction = NODE_ENV === 'production';
    log.info(`Evaluating wallet: ${wallet} (${isProduction ? 'production' : 'development'})`);
    
    // Use deterministic scoring utility
    const { score, metrics, isPlaceholder, mockScore } = calculateWalletScore(wallet, isProduction);

    // Determine access level
    const accessLevel = score >= 75 ? 'CRADLE' : 'SEED';
    const privileges = accessLevel === 'CRADLE' 
      ? ['premium_cores', 'advanced_bots', 'priority_processing', 'collaborative_features']
      : ['basic_cores', 'standard_bots', 'community_access'];

    if (isPlaceholder) {
      log.warn('Using placeholder scoring (deterministic baseline)');
    }
    log.info(`Score: ${score}/100 → ${accessLevel} access`);
    
    const response: any = {
      wallet,
      score,
      accessLevel,
      metrics,
      privileges,
      evaluation_timestamp: new Date().toISOString(),
      next_evaluation: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h from now
      placeholder: isPlaceholder,
      beta: true // BETA: Placeholder implementation - real blockchain analysis coming soon
    };
    
    if (mockScore) {
      response.mockScore = true;
      response.warning = 'This endpoint uses deterministic placeholder data. Real wallet scoring will be implemented in a future update.';
    } else {
      response.warning = 'This endpoint uses deterministic placeholder scoring. Real blockchain analysis will be implemented in a future update.';
    }
    
    res.json(response);
  } catch (error) {
    const log = getRequestLogger(req);
    log.error('Wallet score evaluation failed', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({ error: 'Wallet score evaluation failed' });
  }
});

export default router;