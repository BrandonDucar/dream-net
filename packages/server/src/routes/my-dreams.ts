import express from 'express';
import { getAllDreams, saveDream, Dream } from './shared-dream-storage';

const router = express.Router();

router.get('/my-dreams', async (req, res) => {
  try {
    const { wallet } = req.query;

    if (!wallet) {
      return res.status(400).json({
        success: false,
        error: 'Wallet parameter is required'
      });
    }

    console.log(`Fetching dreams for wallet: ${wallet}`);

    // For demo: return all dreams for any wallet (in production, filter by actual wallet)
    const dreams = getAllDreams().map(dream => ({
      ...dream,
      wallet: wallet as string
    }));

    res.json(dreams);

  } catch (error) {
    console.error('My dreams fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user dreams'
    });
  }
});

// Add a dream to user's vault
router.post('/my-dreams', async (req, res) => {
  try {
    const { wallet, title, type, createdByAgent, lineage } = req.body;

    if (!wallet || !title || !type) {
      return res.status(400).json({
        success: false,
        error: 'Wallet, title, and type are required'
      });
    }

    const newDream: Dream = {
      id: `dream-${Date.now()}`,
      title,
      description: req.body.description || '',
      tags: req.body.tags || [],
      type,
      createdByAgent,
      lineage,
      wallet,
      createdAt: new Date().toISOString()
    };

    saveDream(newDream.id, newDream);

    console.log(`Added dream to vault: ${title} for wallet ${wallet}`);

    res.json({
      success: true,
      dream: newDream,
      message: 'Dream added to vault successfully'
    });

  } catch (error) {
    console.error('Add dream to vault error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add dream to vault'
    });
  }
});

export default router;