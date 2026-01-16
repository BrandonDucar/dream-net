import { memorySystem } from '@dreamnet/memory-dna';
import { swarmLog } from '../server.js';
import {
    NASASpike,
    WeatherSpike,
    NewsSpike,
    CryptoSpike,
    SentimentSpike,
    CosmicSpike,
    AnomalySpike,
    NeynarSpike,
    SensorySpike
} from '@dreamnet/sensory-spikes';

/**
 * HYPERION SUIT (The All-Seeing Eye)
 * 
 * Capability: Massive ingestion of Zero-Auth / Zero-Config APIs via Sensory Spikes.
 * Goal: Maximum context discovery without user secrets.
 */
export class HyperionSuit {
    private spikes: SensorySpike[] = [];

    constructor() {
        // Initialize the sensory array
        this.spikes = [
            new NewsSpike(),
            new CryptoSpike(),
            new WeatherSpike(),
            new SentimentSpike(),
            new NASASpike(),
            new CosmicSpike(),
            new AnomalySpike(),
            new NeynarSpike()
        ];
    }

    /**
     * WAKE: Report status
     */
    public async wake() {
        swarmLog('HYPERION', `The All - Seeing Eye is opening.Orchestrating ${this.spikes.length} Sensory Spikes.`);
        await this.pulse();
    }

    /**
     * PULSE: Execute a full cycle of ingestion
     */
    public async pulse() {
        swarmLog('HYPERION', 'Initiating Hyper-Data Ingestion Cycle...');

        const pulses = this.spikes.map(async (spike) => {
            try {
                const result = await spike.fetch();
                if (result.confidence > 0) {
                    const dataSummary = JSON.stringify(result.data).slice(0, 100);
                    swarmLog('HYPERION', `[${spike.name}] Signal Captured from ${result.source}: ${dataSummary}...`);

                    // 🧠 REMEMBER: Persist to Triune Memory
                    // Categorize based on spike type
                    const context = spike.type === 'financial' || spike.type === 'environmental' ? 'SURVIVAL' :
                        spike.type === 'news' || spike.type === 'cultural' ? 'SOCIAL' : 'WISDOM';

                    await memorySystem.remember(`SIGNAL_${spike.name.toUpperCase()} `, {
                        ...result,
                        processedAt: new Date().toISOString()
                    }, context);
                }
            } catch (e: any) {
                swarmLog('HYPERION_ERROR', `Spike ${spike.name} failed: ${e.message} `);
            }
        });

        await Promise.all(pulses);
        swarmLog('HYPERION', 'Hyper-Data Cycle Complete. Swarm intelligence updated.');
    }

    /**
     * GENERATE AI CONTEXT: Use Zero-Auth AI inference (Pollinations)
     */
    public async generateAI(prompt: string) {
        const aiUrl = process.env.POLLINATIONS_AI_URL || 'https://text.pollinations.ai/';
        try {
            const response = await fetch(`${aiUrl}${encodeURIComponent(prompt)} `);
            const text = await response.text();
            return text;
        } catch (e: any) {
            swarmLog('HYPERION_ERROR', `AI inference failed: ${e.message} `);
            return null;
        }
    }
}

