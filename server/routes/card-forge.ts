/**
 * Card Forge Pro API Routes
 * Integrates Card Forge Pro GPT for card creation
 */

import { Router } from 'express';
import { cardForgePro, CardCreationRequest } from '../../packages/card-forge-pro/src';
import { requireAdmin } from '../siwe-auth';

const router = Router();

/**
 * POST /api/card-forge/create
 * Create a new card using Card Forge Pro
 * Requires admin authentication
 */
router.post('/create', requireAdmin, async (req, res) => {
  try {
    const cardRequest: CardCreationRequest = req.body;

    if (!cardRequest.description) {
      return res.status(400).json({ 
        success: false, 
        error: 'Description is required for card creation.' 
      });
    }

    const result = await cardForgePro.createCard(cardRequest);

    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Card creation initiated.', 
        result 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error || 'Failed to create card.' 
      });
    }
  } catch (error: any) {
    console.error('[CardForge] Create error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred.' 
    });
  }
});

/**
 * PUT /api/card-forge/update/:cardId
 * Update an existing card
 * Requires admin authentication
 */
router.put('/update/:cardId', requireAdmin, async (req, res) => {
  try {
    const { cardId } = req.params;
    const updates: Partial<CardCreationRequest> = req.body;

    const result = await cardForgePro.updateCard(cardId, updates);
    res.json({ success: true, message: 'Card updated successfully.', result });
  } catch (error: any) {
    console.error('[CardForge] Update error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to update card.' 
    });
  }
});

/**
 * DELETE /api/card-forge/:cardId
 * Delete a card
 * Requires admin authentication
 */
router.delete('/:cardId', requireAdmin, async (req, res) => {
  try {
    const { cardId } = req.params;
    const result = await cardForgePro.deleteCard(cardId);
    res.json({ success: true, message: 'Card deleted successfully.', result });
  } catch (error: any) {
    console.error('[CardForge] Delete error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to delete card.' 
    });
  }
});

/**
 * GET /api/card-forge/list
 * List all cards
 * Requires admin authentication
 */
router.get('/list', requireAdmin, async (req, res) => {
  try {
    const cards = await cardForgePro.listCards();
    res.json({ success: true, cards });
  } catch (error: any) {
    console.error('[CardForge] List error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to list cards.' 
    });
  }
});

export default router;

