import express from 'express';
import { bountyService } from '../services/BountyService.js';

const router = express.Router();

/**
 * GET /api/bounties
 * List all active bounties.
 */
router.get('/', async (req, res) => {
    try {
        const bounties = await bountyService.getActiveBounties();
        res.json({ success: true, bounties });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/bounties
 * Create a new bounty.
 */
router.post('/', async (req, res) => {
    try {
        const { title, description, token, amount, creatorId } = req.body;
        const bounty = await bountyService.createBounty({
            title,
            description,
            token,
            amount,
            creatorId
        });
        res.json({ success: true, bounty });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/bounties/:id/bid
 * Place a bid on a bounty.
 */
router.post('/:id/bid', async (req, res) => {
    try {
        const { id } = req.params;
        const { agentId, proposal, amount } = req.body;
        const bid = await bountyService.placeBid(id, {
            agentId,
            proposal,
            amount
        });
        res.json({ success: true, bid });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/bounties/:id/accept/:bidId
 * Accept a bid.
 */
router.post('/:id/accept/:bidId', async (req, res) => {
    try {
        const { id, bidId } = req.params;
        await bountyService.acceptBid(id, bidId);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
