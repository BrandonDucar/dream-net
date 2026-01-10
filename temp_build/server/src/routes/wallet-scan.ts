import express from 'express';
import { calculateFlutterAIScore } from '../utils/wallet-scoring';
import { NODE_ENV } from '../config/env';
import { validateWalletScoreRequest } from '../validation/wallet';
import { createValidationMiddleware } from '../validation/common';
import { getRequestLogger } from '../utils/logger';

const router: express.Router = express.Router();

// FlutterAI wallet scanning (deterministic in production)
router.post('/', createValidationMiddleware((req) => validateWalletScoreRequest(req.body)), async (req, res) => {
  const wallet = req.validated?.wallet || req.body.wallet;
  const log = getRequestLogger(req);

  try {
    const isProduction = NODE_ENV === 'production';
    log.info(`Scanning wallet: ${wallet} (${isProduction ? 'production' : 'development'})`);
    
    // Use deterministic scoring utility (no randomness in production)
    const { trustScore, nftCount, dreamCoreType, confidence } = calculateFlutterAIScore(wallet);
    
    // Unlock bots based on trust score and NFT count
    const unlockedBots = ['DreamIntakeBot'];
    if (trustScore >= 70) unlockedBots.push('WebsitePrepBot');
    if (trustScore >= 80) unlockedBots.push('BackendPrepBot');
    if (nftCount >= 5) unlockedBots.push('AdminDashboardAgent');
    if (nftCount >= 10) unlockedBots.push('SocialOpsBot');

    const scanResult = {
      wallet,
      trustScore,
      nftCount,
      dreamCoreType,
      unlockedBots,
      scanTimestamp: new Date().toISOString(),
      flutterAI: {
        confidence,
        analysisDepth: 'comprehensive',
        riskLevel: trustScore >= 80 ? 'low' : trustScore >= 70 ? 'medium' : 'high'
      },
      placeholder: true
    };

    if (isProduction) {
      log.warn('Using deterministic placeholder scoring');
    }
    log.info(`Scan complete - Trust: ${trustScore}, Core: ${dreamCoreType}`);
    
    return res.json({
      ...scanResult,
      beta: true, // BETA: Placeholder implementation - real FlutterAI analysis coming soon
      warning: isProduction
        ? 'This endpoint uses deterministic placeholder scoring. Real FlutterAI wallet analysis will be implemented in a future update.'
        : 'This endpoint uses deterministic placeholder data. Real FlutterAI wallet analysis will be implemented in a future update.'
    });
  } catch (err) {
    const log = getRequestLogger(req);
    log.error('FlutterAI scan failed', err instanceof Error ? err : new Error(String(err)));
    return res.status(500).json({ error: 'Wallet scan failed' });
  }
});

export default router;