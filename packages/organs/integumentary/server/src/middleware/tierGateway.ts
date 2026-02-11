import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma'; // Assuming prisma is exported here

/**
 * Gnostic Tier Weights & Limits
 */
const TIER_LIMITS: any = {
    LARVA: { credits: 100, priority: 1 },
    SWARM: { credits: 500, priority: 2 },
    COLONY: { credits: 2500, priority: 3 },
    SOVEREIGN: { credits: 1000000, priority: 4 } // Effectively unlimited
};

/**
 * TierGateway Middleware
 * Enforces compute limits based on the user's Gnostic Tier.
 */
export const tierGateway = async (req: Request, res: Response, next: NextFunction) => {
    const walletAddress = req.headers['x-wallet-address'] as string;

    if (!walletAddress) {
        return next(); // Guest access (unlimited public reading, but restricted writing elsewhere)
    }

    try {
        const agent = await (prisma as any).agent.findUnique({
            where: { walletAddress },
            select: { tier: true, creditsUsed: true }
        });

        if (!agent) {
            return res.status(403).json({ error: 'Induction Required. Join the Swarm at dreamnet.ink' });
        }

        const limits = TIER_LIMITS[agent.tier] || TIER_LIMITS.LARVA;

        if (agent.creditsUsed >= limits.credits) {
            return res.status(429).json({
                error: 'Sovereign Exhaustion',
                message: 'Compute credits depleted for this cycle. Accumulate more SCENT to evolve.',
                tier: agent.tier,
                limit: limits.credits
            });
        }

        // Increment credits for AI-intensive calls (hypothetical logic)
        if (req.path.startsWith('/api/agent/task')) {
            await (prisma as any).agent.update({
                where: { walletAddress },
                data: { creditsUsed: { increment: 1 } }
            });
        }

        next();
    } catch (error) {
        console.error('❌ [TierGateway] Middleware Error:', error);
        next(); // Fail open for now during substrate stabilization
    }
};
