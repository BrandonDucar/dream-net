import express from 'express';

const router = express.Router();

// Public access garden feed endpoint (no authentication required)
router.get('/', async (req, res) => {
  try {
    console.log('[Garden Feed Router] Processing garden feed request - returning static data');
    
    // Return static garden feed data directly (no database dependency)
    const staticFeed = [
      {
        id: "dream-0",
        name: "Dream 0",
        creator: "0xFAKE0",
        tags: ["ai"],
        score: 75,
        evolved: false,
        last_updated: new Date().toISOString(),
        coreType: "Vision",
        description: "This is the seed description for Dream 0.",
        image: "https://picsum.photos/seed/0/300/200",
        status: "Draft"
      },
      {
        id: "dream-1", 
        name: "Dream 1",
        creator: "0xFAKE1",
        tags: ["crypto"],
        score: 68,
        evolved: false,
        last_updated: new Date().toISOString(),
        coreType: "Tool",
        description: "This is the seed description for Dream 1.",
        image: "https://picsum.photos/seed/1/300/200",
        status: "Draft"
      },
      {
        id: "dream-2",
        name: "Dream 2", 
        creator: "0xFAKE2",
        tags: ["music"],
        score: 82,
        evolved: false,
        last_updated: new Date().toISOString(),
        coreType: "Movement",
        description: "This is the seed description for Dream 2.",
        image: "https://picsum.photos/seed/2/300/200",
        status: "Draft"
      }
    ];
    
    console.log(`[Garden Feed Router] Returning ${staticFeed.length} static dreams`);
    res.json(staticFeed);
  } catch (e) {
    console.error('Feed error:', e);
    res.status(500).json({ 
      error: 'Failed to get garden feed',
      message: e instanceof Error ? e.message : 'Unknown error'
    });
  }
});

export default router;