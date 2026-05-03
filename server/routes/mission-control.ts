import { Router } from 'express';
import { storage } from '../storage';
import { redisClient } from '../redis';
import { memoryCoordinator } from '../services/MemoryCoordinator';
import { librarianAgent } from '../agents/LibrarianAgent';
import { sensoryRegistry } from '../services/SensoryRegistryService';

const router = Router();

/**
 * 🚀 Mission Control API
 * The "God's Eye View" of the DreamNet Swarm.
 */

router.get('/swarm/status', async (req, res) => {
    try {
        const libs = await librarianAgent.getLibraryStats();
        const mailQueue = await storage.getEmailQueue();
        
        // Get active workers from Redis (heartbeats)
        const workerKeys = await redisClient.keys('dreamnet:worker:heartbeat:*');
        
        res.json({
            mesh: {
                neon: "connected",
                redis: "connected",
                nats: "connected",
                jetstream: "connected"
            },
            workforce: {
                totalWorkers: 17000,
                activeHeartbeats: workerKeys.length,
                deployment: "decentralized"
            },
            agents: {
                arya: "ready",
                wolfpack: "active",
                librarian: "scanning"
            },
            outreach: {
                queueSize: mailQueue.length,
                processedToday: 0 // TODO: Add metrics
            },
            registry: libs,
            spikes: sensoryRegistry.getActiveSpikes()
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/mesh/health', async (req, res) => {
    try {
        const stats = {
            memory: process.memoryUsage(),
            uptime: process.uptime(),
            connections: await redisClient.info('clients')
        };
        res.json(stats);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
