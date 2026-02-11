import { Router } from 'express';
import { ProvenanceService } from '@dreamnet/nerve';
import { swarmPheromones } from '../agents/core/SwarmPheromoneService.js';
import { ScentEngine } from '@dreamnet/memory-dna';
import { NodeMonitorService } from '../monitoring/NodeMonitorService.js';
import { PrismaClient } from '@prisma/client';
import { swarmCoordinator } from '../swarm-coordinator.js';

const prisma = new PrismaClient();

/**
 * 🛰️ Star Bridge Router: Integration Layer
 * Role: Connects the Sovereign Grid's telemetry (Star Bridge) to the .ink and .live frontends.
 */
export function createStarBridgeRouter(
    pheromoneService: any, // Placeholder for nerve service compatibility
    provenanceService: ProvenanceService,
    nodeMonitor: NodeMonitorService
) {
    const router = Router();

    /**
     * [PHEROMONE] GET /score/:wallet
     * Returns the current SCENT score with time-decay applied.
     */
    router.get('/pheromone/score/:wallet', async (req, res) => {
        const { wallet } = req.params;

        // WAVE 7: Real-world computation from Prisma vs. stubs
        const result = await pheromoneService.getScentForWallet(wallet);

        res.json({
            wallet,
            ...result,
            timestamp: new Date().toISOString()
        });
    });

    /**
     * [PHEROMONE] GET /leaderboard
     * Returns the global swarm leaderboard.
     */
    router.get('/pheromone/leaderboard', async (req, res) => {
        try {
            const leaderboard = await pheromoneService.getLeaderboard();
            res.json(leaderboard);
        } catch (error) {
            console.error('❌ [Antigravity Router] Leaderboard fetch failed:', error);
            res.status(500).json({ error: 'Failed to fetch leaderboard' });
        }
    });

    /**
     * [PROVENANCE] GET /attestations/:runId
     * Returns the SLSA-compliant attestation for a specific agent run.
     */
    router.get('/attestations/:runId', (req, res) => {
        const { runId } = req.params;
        const attestation = provenanceService.getAttestation(runId);

        if (!attestation) {
            return res.status(404).json({ error: 'Attestation not found' });
        }

        res.json(attestation);
    });

    /**
     * [NODES] GET /nodes/status
     * Returns the health and earnings of all monitored RPC nodes.
     */
    router.get('/nodes/status', (req, res) => {
        const nodes = nodeMonitor.getAllNodes();
        res.json(nodes);
    });

    /**
     * [SWARM] GET /swarm/status
     * Returns the global swarm health, active operations, and bot heartbeats.
     */
    router.get('/swarm/status', (req, res) => {
        const status = swarmCoordinator.getSwarmStatus();
        res.json({
            ...status,
            bpm: 72 + Math.floor(Math.random() * 10), // Simulated heart rate for immersion
            timestamp: new Date().toISOString()
        });
    });

    router.get('/tasks/queue', async (req, res) => {
        try {
            // WAVE 7: Real-world bounty queue from Prisma
            const bounties = await (prisma as any).bounty.findMany({
                where: { status: 'OPEN' },
                orderBy: { createdAt: 'desc' },
                take: 10
            });

            const tasks = bounties.map((b: any) => ({
                id: b.id,
                title: b.title,
                reward: `${b.amount} ${b.token}`,
                tier: b.amount > 100 ? 'SWARM' : 'ANT'
            }));

            res.json(tasks);
        } catch (error) {
            console.error('❌ [Antigravity Router] Task queue fetch failed:', error);
            res.status(500).json({ error: 'Failed to fetch task queue' });
        }
    });

    return router;
}
