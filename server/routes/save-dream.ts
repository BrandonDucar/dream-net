import express from 'express';
import { loadDream, saveDream, Dream } from './shared-dream-storage';

const router = express.Router();

// Save dream endpoint - your exact pattern
router.post('/', async (req, res) => {
  try {
    const dreamData = req.body;
    
    if (!dreamData || !dreamData.id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Dream ID is required' 
      });
    }

    const existingDream = loadDream(dreamData.id);
    if (!existingDream) {
      return res.status(404).json({ 
        success: false, 
        error: 'Dream not found' 
      });
    }

    const updatedDream: Dream = {
      ...existingDream,
      ...dreamData,
      updatedAt: new Date().toISOString()
    };

    saveDream(dreamData.id, updatedDream);

    res.json({ 
      success: true, 
      message: 'Dream saved successfully',
      dream: updatedDream
    });

  } catch (error) {
    console.error('Save dream error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save dream' 
    });
  }
});

// Get dream by ID endpoint
router.get('/dream/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dream = loadDream(id);

    if (!dream) {
      return res.status(404).json({ 
        success: false, 
        error: 'Dream not found' 
      });
    }

    res.json(dream);

  } catch (error) {
    console.error('Get dream error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch dream' 
    });
  }
});

export default router;