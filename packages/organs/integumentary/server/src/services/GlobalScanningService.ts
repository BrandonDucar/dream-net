import { DreamEventBus } from '@dreamnet/nerve';
import axios from 'axios';

/**
 * Global Scanning Service (The Syndicate's Recon Team)
 * 
 * Avenue 28: Deploys high-speed recon nodes (Masscan/Nuclei)
 * Avenue 29: Hooks sensory leads to DreamEventBus
 */
import { DreamEventBus } from '@dreamnet/nerve';
import {
    SensorySpike,
    EarthquakeSpike,
    GitHubTrendSpike,
    RedditSpike,
    SolarSpike,
    GrantSpike,
    CryptoSpike,
    NewsSpike,
    ScienceSpike,
    UniversalSpike,
    FlightSpike
} from '@dreamnet/sensory-spikes';

/**
 * Global Scanning Service (The Syndicate's Recon Team)
 * 
 * Avenue 28: Deploys high-speed recon nodes (Masscan/Nuclei)
 * Avenue 29: Hooks sensory leads to DreamEventBus
 */
export class GlobalScanningService {
    private eventBus: DreamEventBus;
    private isScanning: boolean = false;
    private spikes: SensorySpike[] = [];

    constructor(eventBus: DreamEventBus) {
        this.eventBus = eventBus;
        this.initializeSpikes();
    }

    private initializeSpikes() {
        // Initialize the sensory organs
        this.spikes = [
            new EarthquakeSpike(),
            new GitHubTrendSpike(),
            new RedditSpike(),
            new SolarSpike(),
            new GrantSpike(),
            new CryptoSpike(),
            new NewsSpike(), // Requires Key
            new ScienceSpike(), // Requires Key
            new UniversalSpike(),
            new FlightSpike()
        ];
        console.log(`[ScanningEngine] 🧠 Loaded ${this.spikes.length} Sensory Spikes.`);
    }

    /**
     * Trigger a "Synaptic Recon Pulse"
     * Scans for high-value tech leads.
     */
    public async triggerReconPulse() {
        if (this.isScanning) return;
        this.isScanning = true;

        const { aliveMode } = await import('../core/AliveMode.js');
        aliveMode.pulse('GlobalScanningService');

        console.log('[ScanningEngine] 📡 Initiating Universal Recon Pulse...');

        try {
            const results = await Promise.all(
                this.spikes.map(async (spike) => {
                    console.log(`[ScanningEngine] Pinging ${spike.name}...`);
                    const result = await spike.fetch();
                    return { spike, result };
                })
            );

            for (const { spike, result } of results) {
                if (result.confidence > 0.5) {
                    // 🧠 Update Sensory Memory (God View)
                    const { sensoryMemory } = await import('./SensoryMemory.js');
                    if (spike.name === 'EarthquakeSpike') sensoryMemory.update('earthquakes', result.data);
                    if (spike.name === 'FlightSpike') sensoryMemory.update('flights', result.data);
                    if (spike.name === 'SolarSpike') sensoryMemory.update('solar', result.data);
                    if (spike.name === 'GitHubTrendSpike') sensoryMemory.update('trends', { ...sensoryMemory.getSnapshot().trends, github: result.data });
                    if (spike.name === 'RedditSpike') sensoryMemory.update('trends', { ...sensoryMemory.getSnapshot().trends, reddit: result.data });
                    if (spike.name === 'UniversalSpike') sensoryMemory.update('trends', { ...sensoryMemory.getSnapshot().trends, universal: result.data });

                    // Publish raw sensory data
                    this.eventBus.publish(this.eventBus.createEnvelope(
                        'Sensory.Pulse',
                        spike.name,
                        result,
                        { type: spike.type, confidence: result.confidence }
                    ));

                    // If high value, log it
                    console.log(`[ScanningEngine] ✅ ${spike.name} returned valid signal.`);
                } else {
                    console.warn(`[ScanningEngine] ⚠️ ${spike.name} returned weak signal or error.`);
                }
            }

            console.log(`[ScanningEngine] ✅ Pulse complete. Processed ${results.length} sensory vectors.`);
        } catch (error) {
            console.error('[ScanningEngine] ❌ Pulse failed:', error);
        } finally {
            this.isScanning = false;
        }
    }
}

