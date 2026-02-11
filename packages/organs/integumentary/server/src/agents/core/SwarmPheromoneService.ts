import { pheromones as circulatoryPheromones } from 'file:///C:/dev/dream-net/packages/organs/circulatory/memory-dna/src/index.js';
import { getPheromoneStrength, depositPheromone as haloDeposit } from 'file:///C:/dev/dream-net/packages/organs/nervous-subsystem/halo-loop/src/index.js';
import { agentBus } from '../agent-bus.js';

/**
 * SwarmPheromoneService
 * Unifies pheromone stores from Circulatory (Memory DNA) and Nervous (Halo Loop)
 * to provide a single interface for collective intelligence.
 */
export class SwarmPheromoneService {
    private static instance: SwarmPheromoneService;

    public static getInstance(): SwarmPheromoneService {
        if (!SwarmPheromoneService.instance) {
            SwarmPheromoneService.instance = new SwarmPheromoneService();
        }
        return SwarmPheromoneService.instance;
    }

    /**
     * Mark a "Hot Lead" or data path with digital pheromones.
     * Higher strength trails attract more foragers.
     * Wave 7 Update: Uses exponential decay logic.
     */
    public async markTrail(path: string, success: boolean = true, strength: number = 0.1): Promise<void> {
        console.log(`🐜 [Formicidae] Leaving SCENT at: ${path} (Initial Strength: ${strength})`);

        // 1. Update Halo Loop (System/Latency Pheromones)
        try {
            haloDeposit(path, success, strength);
        } catch (e) {
            console.warn(`⚠️ [Formicidae] Halo-Loop pheromone deposit failed: ${e}`);
        }

        // 2. Update Circulatory (Semantic/Memory Pheromones) - Uses ScentEngine decay
        try {
            circulatoryPheromones.deposit(path, { success, timestamp: Date.now() }, strength);
        } catch (e) {
            console.warn(`⚠️ [Formicidae] Circulatory pheromone deposit failed: ${e}`);
        }

        // 3. Broadcast to Nerve Bus
        agentBus.broadcast('PHEROMONE_TRAIL', `SCENT marked at ${path}`, { path, strength, success });
    }

    /**
     * Sniff the air for the strongest available signals.
     */
    public getStrongestPulse(category?: string): string[] {
        // In physical stigmergy, this returns high-gradient paths
        return [category || 'global'];
    }

    /**
     * Get relative weight for a specific ingress path.
     * Wave 7 Update: Returns real-time decayed intensity.
     */
    public async sniffTrail(path: string): Promise<number> {
        const haloStrength = getPheromoneStrength(path);
        const circTrail = circulatoryPheromones.sniff(path);

        const circIntensity = typeof circTrail === 'number' ? circTrail : (circTrail?.intensity || 0);

        // Combine strengths (50/50 weighted blend)
        return (haloStrength + circIntensity) / 2;
    }
}

export const swarmPheromones = SwarmPheromoneService.getInstance();
