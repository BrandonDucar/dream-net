import express from 'express';
import { storage } from '../storage';
import { calculateSimpleWalletScore } from '../utils/wallet-scoring';
import { NODE_ENV } from '../config/env';
import { validateWalletAddress } from '../validation/wallet';
import { getRequestLogger } from '../utils/logger';

const router: express.Router = express.Router();

// Wallet scoring and trust level evaluation
router.get('/:wallet', async (req, res) => {
  const log = getRequestLogger(req);
  
  try {
    const wallet = req.params.wallet;
    
    // Validate wallet address
    const validation = validateWalletAddress(wallet);
    if (!validation.valid) {
      log.warn(`Invalid wallet address: ${validation.error}`);
      return res.status(400).json({
        ok: false,
        error: 'validation_error',
        message: validation.error,
        traceId: req.traceId
      });
    }
    const isProduction = NODE_ENV === 'production';
    
    // Use deterministic scoring utility (no randomness in production)
    const score = calculateSimpleWalletScore(wallet);
    
    if (isProduction) {
      log.info(`Deterministic score calculated for wallet: ${wallet}`);
    }
    
    let trustLevel: 'Low' | 'Medium' | 'High';
    let unlockedAgents: string[];

    if (score >= 80) {
      trustLevel = 'High';
      unlockedAgents = ['LUCID', 'CANVAS', 'ROOT', 'ECHO', 'CRADLE', 'WING'];
    } else if (score >= 50) {
      trustLevel = 'Medium';
      unlockedAgents = ['LUCID', 'CANVAS', 'ROOT', 'ECHO'];
    } else {
      trustLevel = 'Low';
      unlockedAgents = ['LUCID', 'CANVAS'];
    }

    return res.json({
      wallet,
      score,
      trustLevel,
      unlockedAgents,
      status: 'evaluated',
      placeholder: true,
      beta: true, // BETA: Placeholder implementation - real blockchain analysis coming soon
      warning: isProduction 
        ? 'This endpoint uses deterministic placeholder scoring. Real blockchain analysis will be implemented in a future update.'
        : 'This endpoint uses deterministic placeholder data. Real blockchain analysis will be implemented in a future update.'
    });

  } catch (error) {
    const log = getRequestLogger(req);
    log.error('Wallet scoring error', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({ error: 'Failed to evaluate wallet trust level' });
  }
});

// Update wallet score based on activity
router.patch('/:wallet/score', async (req, res) => {
  try {
    const wallet = req.params.wallet;
    
    const log = getRequestLogger(req);
    
    // Validate wallet address
    const walletValidation = validateWalletAddress(wallet);
    if (!walletValidation.valid) {
      log.warn(`Invalid wallet address: ${walletValidation.error}`);
      return res.status(400).json({
        ok: false,
        error: 'validation_error',
        message: walletValidation.error,
        traceId: req.traceId
      });
    }
    
    // Validate request body
    const { validateWalletScoreUpdateRequest } = await import('../validation/wallet');
    const bodyValidation = validateWalletScoreUpdateRequest(req.body);
    if (!bodyValidation.valid) {
      log.warn(`Invalid request body: ${bodyValidation.error}`);
      return res.status(400).json({
        ok: false,
        error: 'validation_error',
        message: bodyValidation.error,
        traceId: req.traceId
      });
    }
    
    const { action, points } = req.body;

    // Calculate current score using deterministic utility
    const currentScore = calculateSimpleWalletScore(wallet);

    // Calculate score adjustment based on action
    let scoreChange = 0;
    switch (action) {
      case 'dream_submission':
        scoreChange = 10;
        break;
      case 'fusion_claim':
        scoreChange = 15;
        break;
      case 'contribution':
        scoreChange = 8;
        break;
      case 'agent_interaction':
        scoreChange = 3;
        break;
      case 'negative_action':
        scoreChange = -5;
        break;
      default:
        scoreChange = points || 0;
    }

    const newScore = Math.max(0, Math.min(100, currentScore + scoreChange));

    // Recalculate trust level
    let trustLevel: 'Low' | 'Medium' | 'High';
    let unlockedAgents: string[];

    if (newScore >= 80) {
      trustLevel = 'High';
      unlockedAgents = ['LUCID', 'CANVAS', 'ROOT', 'ECHO', 'CRADLE', 'WING'];
    } else if (newScore >= 50) {
      trustLevel = 'Medium';
      unlockedAgents = ['LUCID', 'CANVAS', 'ROOT', 'ECHO'];
    } else {
      trustLevel = 'Low';
      unlockedAgents = ['LUCID', 'CANVAS'];
    }

    return res.json({
      wallet,
      previousScore: currentScore,
      newScore,
      scoreChange,
      trustLevel,
      unlockedAgents,
      action
    });

  } catch (error) {
    const log = getRequestLogger(req);
    log.error('Score update error', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({ error: 'Failed to update wallet score' });
  }
});

export default router;