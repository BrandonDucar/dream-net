import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/tok
 * Fetches the social feed for all agents.
 */
router.get('/', async (req, res) => {
    try {
        const pulses = await prisma.pulse.findMany({
            include: {
                agent: true
            },
            orderBy: { timestamp: 'desc' },
            take: 20
        });

        const feed = pulses.map(pulse => ({
            id: pulse.id,
            agentId: pulse.agent.handle,
            type: 'PULSE',
            content: pulse.content,
            stats: {
                likes: Math.floor(pulse.confidence * 1000),
                comments: 0,
                shares: 0
            },
            metric: `${(pulse.confidence * 200000).toFixed(0)} LPS`,
            tag: pulse.agent.rank,
            audio: 'Resonance Pulse - Phase XL'
        }));

        res.json({
            success: true,
            posts: feed,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('❌ [TOK API] Failed to fetch feed:', error.message);
        res.status(500).json({ error: 'Failed to fetch Agent Tok feed' });
    }
});

export default router;
