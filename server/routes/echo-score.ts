import express from 'express';

const router = express.Router();

// ECHO Agent scoring endpoint - alias for wallet scoring with ECHO-specific context
router.get('/:wallet', async (req, res) => {
  try {
    const wallet = req.params.wallet;
    
    // Use the same scoring algorithm as wallet-scoring but with ECHO context
    const baseScore = wallet.length % 100;
    const score = Math.max(25, baseScore);
    
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
        : 'ECHO Agent requires Medium trust level (50+ score)'
    });

  } catch (error) {
    console.error('ECHO scoring error:', error);
    res.status(500).json({ error: 'Failed to evaluate ECHO agent access' });
  }
});

export default router;