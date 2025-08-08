import express from 'express';
const router = express.Router();

interface MintedDream {
  id: string;
  dreamId: string;
  wallet: string;
  tokenId: string;
  mintedAt: string;
  transactionHash: string;
}

// In-memory storage for demo purposes
const mintedDreams: MintedDream[] = [];

// Simulated mint action using your exact pattern
router.post('/mint-dream', async (req, res) => {
  const { dreamId, wallet } = req.body;

  if (!wallet || !dreamId) {
    return res.status(400).json({ success: false, error: 'Missing dream or wallet' });
  }

  console.log(`Minting dream ${dreamId} to wallet ${wallet}`);

  // Check if dream is already minted by this wallet
  const existingMint = mintedDreams.find(
    mint => mint.dreamId === dreamId && mint.wallet === wallet
  );

  if (existingMint) {
    return res.json({
      success: false,
      error: 'Dream already minted by this wallet'
    });
  }

  // 🔮 Add real token minting logic here (Solana mint, NFT drop, etc)
  
  // For now, simulate successful minting
  const tokenId = `DRM-${Date.now().toString(36).toUpperCase()}`;
  const transactionHash = `0x${Math.random().toString(16).slice(2, 18)}`;

  const mintedDream: MintedDream = {
    id: `mint-${Date.now()}`,
    dreamId,
    wallet,
    tokenId,
    mintedAt: new Date().toISOString(),
    transactionHash
  };

  mintedDreams.push(mintedDream);

  return res.json({ 
    success: true,
    tokenId: mintedDream.tokenId,
    transactionHash: mintedDream.transactionHash,
    mintedAt: mintedDream.mintedAt
  });
});

// Get minted dreams for a wallet
router.get('/minted-dreams/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;
    
    const walletMints = mintedDreams
      .filter(mint => mint.wallet === wallet)
      .sort((a, b) => new Date(b.mintedAt).getTime() - new Date(a.mintedAt).getTime());

    res.json({
      wallet,
      totalMinted: walletMints.length,
      dreams: walletMints
    });

  } catch (error) {
    console.error('Minted dreams fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch minted dreams'
    });
  }
});

// Check if dream is minted by wallet
router.get('/mint-status/:dreamId/:wallet', async (req, res) => {
  try {
    const { dreamId, wallet } = req.params;
    
    const mint = mintedDreams.find(
      m => m.dreamId === dreamId && m.wallet === wallet
    );

    res.json({
      isMinted: !!mint,
      tokenId: mint?.tokenId,
      mintedAt: mint?.mintedAt,
      transactionHash: mint?.transactionHash
    });

  } catch (error) {
    console.error('Mint status check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check mint status'
    });
  }
});

export default router;