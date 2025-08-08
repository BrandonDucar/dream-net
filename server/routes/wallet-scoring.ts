import express from 'express';
import { storage } from '../storage';

const router = express.Router();

// Wallet scoring and trust level evaluation
router.get('/:wallet', async (req, res) => {
  try {
    const wallet = req.params.wallet;
    
    // For now, use a simple scoring algorithm based on wallet address
    // This will be replaced with actual blockchain analysis later
    const baseScore = wallet.length % 100; // Fake score based on address length
    const score = Math.max(25, baseScore); // Minimum score of 25
    
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
      status: 'evaluated'
    });

  } catch (error) {
    console.error('Wallet scoring error:', error);
    res.status(500).json({ error: 'Failed to evaluate wallet trust level' });
  }
});

// Update wallet score based on activity
router.patch('/:wallet/score', async (req, res) => {
  try {
    const wallet = req.params.wallet;
    const { action, points } = req.body;

    // Calculate current score
    const currentScore = Math.max(25, wallet.length % 100);

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
    console.error('Score update error:', error);
    res.status(500).json({ error: 'Failed to update wallet score' });
  }
});

export default router;