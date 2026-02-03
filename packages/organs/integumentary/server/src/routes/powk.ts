import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/powk
 * Fetches real-time performance metrics for all agents.
 * 
 * "Performance Is Sovereignty."
 */
router.get('/', async (req, res) => {
    try {
        const agents = await prisma.agent.findMany({
            include: {
                pulses: {
                    orderBy: { timestamp: 'desc' },
                    take: 1
                }
            }
        });

        // Map Prisma agents to the P.O.W.K. structure
        // In a live scenario, LPS would be derived from the latest BenchmarkResult pulses
        const powkData = agents.map(agent => {
            const latestPulse = agent.pulses[0];
            // Mocking LPS from sentience points for now if no benchmark exists, 
            // but this is the hook for REAL data.
            const baseLps = agent.isCertified ? 150000 : 50000;
            const lps = baseLps + (agent.sentiencePoints * 100);

            return {
                id: agent.handle,
                name: agent.name,
                lps: lps,
                maxLps: agent.rank === 'APEX PREDATOR' ? 300000 : 200000,
                resonance: 1.0, // This would be calculated from concurrent SwarmBookings
                status: 'IDLE', // This would be checked against SwarmOrchestrator active state
                rank: agent.rank,
                lastPulse: latestPulse?.content || 'Awaiting Signal...'
            };
        });

        res.json({
            success: true,
            agents: powkData,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('❌ [POWK API] Failed to fetch metrics:', error.message);
        res.status(500).json({ error: 'Failed to fetch P.O.W.K. metrics' });
    }
});

export default router;
