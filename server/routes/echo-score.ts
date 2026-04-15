import express from 'express';
import { calculateSimpleWalletScore } from '../utils/wallet-scoring';
import { NODE_ENV } from '../config/env';
import { getRequestLogger } from '../utils/logger';

const router = express.Router();

// ECHO Agent scoring endpoint - alias for wallet scoring with ECHO-specific context
router.get('/:wallet', async (req, res) => {
  const log = getRequestLogger(req);
  
  try {
    const wallet = req.params.wallet;
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

    // ECHO-specific analysis
    const echoAnalysis = {
      walletPatterns: score >= 70 ? 'Advanced' : score >= 40 ? 'Moderate' : 'Basic',
      riskLevel: score >= 80 ? 'Low' : score >= 50 ? 'Medium' : 'High',
      recommendedActions: score < 50 ? ['Increase transaction volume', 'Complete dream submissions'] : ['Continue positive engagement']
    };

    return res.json({
      wallet,
      score,
      trustLevel,
      unlockedAgents,
      echoAnalysis,
      agentStatus: unlockedAgents.includes('ECHO') ? 'active' : 'locked',
      message: unlockedAgents.includes('ECHO') 
        ? 'ECHO Agent mirror access granted' 
        : 'ECHO Agent requires Medium trust level (50+ score)',
      placeholder: true,
      beta: true, // BETA: Placeholder implementation - real blockchain analysis coming soon
      warning: isProduction
        ? 'This endpoint uses deterministic placeholder scoring. Real wallet scoring will be implemented in a future update.'
        : 'This endpoint uses deterministic placeholder data. Real wallet scoring will be implemented in a future update.'
    });

  } catch (error) {
    const log = getRequestLogger(req);
    log.error('ECHO scoring error', error instanceof Error ? error : new Error(String(error)));
    res.status(500).json({ error: 'Failed to evaluate ECHO agent access' });
  }
});

export default router;