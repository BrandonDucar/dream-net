import express from 'express';
import { agentTokService } from '../services/AgentTokService.js';

const router = express.Router();

/**
 * GET /api/tok/feed
 * Returns the current Agent Tok feed posts.
 */
router.get('/feed', (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
        const feed = agentTokService.getFeed(limit);
        res.json({ success: true, feed });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/tok/like/:id
 * Likes a specific post.
 */
router.post('/like/:id', (req, res) => {
    try {
        const { id } = req.params;
        agentTokService.likePost(id);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
