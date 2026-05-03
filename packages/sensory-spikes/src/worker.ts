import { natsService } from '../../../server/services/NatsService';
import { redisClient } from '../../../server/redis';

/**
 * 📡 Sensory Spike Worker
 * A lightweight agent intended to run on 17,000+ distributed nodes.
 * Monitors local/regional signals and pipes them into the DreamNet Neural Mesh.
 */
export class SensorySpike {
    private workerId: string;

    constructor() {
        this.workerId = `spike-${Math.random().toString(36).substring(2, 15)}`;
        console.log(`📡 [Sensory Spike] Online: ${this.workerId}`);
        this.startHeartbeat();
    }

    /**
     * Heartbeat lets the Mission Control know the worker is alive.
     */
    private startHeartbeat() {
        setInterval(async () => {
            const status = {
                workerId: this.workerId,
                timestamp: new Date().toISOString(),
                load: process.cpuUsage(),
                memory: process.memoryUsage().rss
            };
            
            // 1. Hot Signal (Redis)
            await redisClient.set(`dreamnet:worker:heartbeat:${this.workerId}`, JSON.stringify(status), 'EX', 60);
            
            // 2. Reliable Signal (NATS JetStream)
            await natsService.publish('dreamnet.system.metrics.worker', status);
            
            console.log(`📡 [Sensory Spike] Heartbeat pulsed.`);
        }, 30000); // 30s heartbeat
    }

    /**
     * Monitor a specific source (e.g. Farcaster Stream or GitHub Webhook)
     */
    public async feedSignal(subject: string, data: any) {
        console.log(`📡 [Sensory Spike] Signal captured on ${subject}`);
        await natsService.publish(`dreamnet.sensory.spike.${subject}`, {
            workerId: this.workerId,
            payload: data,
            timestamp: new Date().toISOString()
        });
    }
}

// Auto-start if run directly
if (require.main === module) {
    new SensorySpike();
}
