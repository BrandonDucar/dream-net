import { natsService } from './NatsService.js';
import { memoryCoordinator } from './MemoryCoordinator.js';

/**
 * 📡 Sensory Registry Service
 * Manages the connection pool for external real-world data APIs.
 * Orchestrates distributed workers to query these APIs and pipe data into the Neural Mesh.
 */
export class SensoryRegistryService {
    private spikes = [
        { id: 'news_api', name: 'Global News Feed', type: 'real_world', priority: 'high' },
        { id: 'market_aux', name: 'Financial Sentiment', type: 'finance', priority: 'high' },
        { id: 'archive_org', name: 'Historical Archive (Tartaria Research)', type: 'esoteric', priority: 'medium' },
        { id: 'fishbase', name: 'Biological Taxonomy (Bettafish)', type: 'biological', priority: 'low' },
        { id: 'mirofish', name: 'Simulation Engine Proxy', type: 'simulation', priority: 'high' }
    ];

    constructor() {
        console.log(`📡 [Sensory Registry] External API Pool initialized with ${this.spikes.length} targets.`);
        this.startCoordinationLoop();
    }

    /**
     * Periodically tasks the 17,000 workers with specific sensory missions.
     */
    private startCoordinationLoop() {
        setInterval(async () => {
            const task = this.spikes[Math.floor(Math.random() * this.spikes.length)];
            console.log(`📡 [Sensory Registry] Tasking workers with mission: ${task.name}`);
            
            await natsService.publish('dreamnet.swarm.task.sensory', {
                taskId: `mission-${Date.now()}`,
                spikeId: task.id,
                instructions: `Query ${task.name} for new real-world patterns.`,
                priority: task.priority
            });
        }, 300000); // Every 5 minutes
    }

    public async registerNewSpike(spike: any) {
        this.spikes.push(spike);
        await memoryCoordinator.syncState('sensory_spikes:registry', this.spikes, { persist: true });
    }

    public getActiveSpikes() {
        return this.spikes;
    }
}

export const sensoryRegistry = new SensoryRegistryService();
