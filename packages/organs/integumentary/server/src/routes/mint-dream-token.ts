import { Router } from 'express';
import { nanoid } from 'nanoid';

const router = Router();

interface MintRequest {
  wallet: string;
  dreamId: string;
  dreamName: string;
  trustLevel: 'Low' | 'Medium' | 'High';
  score: number;
}

interface MintedToken {
  tokenId: string;
  wallet: string;
  dreamId: string;
  dreamName: string;
  value: number;
  trustLevel: string;
  timestamp: string;
  signature?: string;
}

// In-memory storage for demo purposes
const mintedTokens: MintedToken[] = [];

router.post('/mint-dream-token', async (req, res) => {
  try {
    const { wallet, dreamId, dreamName, trustLevel, score }: MintRequest = req.body;

    // Validate CRADLE access (80+ score required)
    if (score < 80) {
      return res.status(403).json({
        error: 'Insufficient trust score for minting',
        required: 80,
        current: score
      });
    }

    // Validate wallet address
    if (!wallet || wallet.length < 32) {
      return res.status(400).json({
        error: 'Invalid wallet address'
      });
    }

    // Calculate token value based on trust level and score
    const calculateTokenValue = (trustLevel: string, score: number): number => {
      const baseValue = 100;
      const scoreMultiplier = Math.floor(score / 10);
      const trustMultiplier = trustLevel === 'High' ? 2.0 : trustLevel === 'Medium' ? 1.5 : 1.0;
      
      return Math.floor(baseValue * scoreMultiplier * trustMultiplier);
    };

    // Generate unique token
    const tokenId = `DTC-${nanoid(8).toUpperCase()}`;
    const value = calculateTokenValue(trustLevel, score);
    
    const mintedToken: MintedToken = {
      tokenId,
      wallet,
      dreamId,
      dreamName,
      value,
      trustLevel,
      timestamp: new Date().toISOString(),
      signature: `sig_${nanoid(16)}`
    };

    // Store the minted token
    mintedTokens.push(mintedToken);

    // Log minting activity
    console.log(`🪙 Dream Token Minted: ${tokenId} (${value} DTC) for wallet ${wallet.slice(0, 8)}...${wallet.slice(-8)}`);

    res.json({
      success: true,
      tokenId: mintedToken.tokenId,
      value: mintedToken.value,
      dreamName: mintedToken.dreamName,
      trustLevel: mintedToken.trustLevel,
      timestamp: mintedToken.timestamp,
      signature: mintedToken.signature,
      txHash: `0x${nanoid(64)}` // Mock transaction hash
    });

  } catch (error) {
    console.error('Minting error:', error);
    res.status(500).json({
      error: 'Internal server error during minting',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get minted tokens for a wallet
router.get('/wallet/:wallet/tokens', async (req, res) => {
  try {
    const { wallet } = req.params;
    
    const walletTokens = mintedTokens
      .filter(token => token.wallet === wallet)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20); // Return latest 20 tokens

    const totalValue = walletTokens.reduce((sum, token) => sum + token.value, 0);
    
    res.json({
      wallet,
      totalTokens: walletTokens.length,
      totalValue,
      tokens: walletTokens
    });

  } catch (error) {
    console.error('Token fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch wallet tokens'
    });
  }
});

// Get all minted tokens (admin endpoint)
router.get('/tokens/all', async (req, res) => {
  try {
    const totalTokens = mintedTokens.length;
    const totalValue = mintedTokens.reduce((sum, token) => sum + token.value, 0);
    const uniqueWallets = new Set(mintedTokens.map(token => token.wallet)).size;
    
    res.json({
      totalTokens,
      totalValue,
      uniqueWallets,
      recentTokens: mintedTokens
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10)
    });

  } catch (error) {
    console.error('All tokens fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch token statistics'
    });
  }
});

export default router;