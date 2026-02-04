import { pheromones as circulatoryPheromones } from '@dreamnet/circulatory-dream-state-core';
import { getPheromoneStrength, depositPheromone as haloDeposit } from '@dreamnet/halo-loop';
import { agentBus } from '../agent-bus';

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
     */
    public async markTrail(path: string, success: boolean = true, strength: number = 0.1): Promise<void> {
        console.log(`🐜 [Formicidae] Leaving pheromone trail at: ${path} (Strength: ${strength})`);

        // 1. Update Halo Loop (System/Latency Pheromones)
        try {
            haloDeposit(path, success, strength);
        } catch (e) {
            console.warn(`⚠️ [Formicidae] Halo-Loop pheromone deposit failed: ${e}`);
        }

        // 2. Update Circulatory (Semantic/Memory Pheromones)
        try {
            circulatoryPheromones.deposit(path, { success, timestamp: Date.now() }, strength);
        } catch (e) {
            console.warn(`⚠️ [Formicidae] Circulatory pheromone deposit failed: ${e}`);
        }

        // 3. Broadcast to Nerve Bus
        agentBus.broadcast('PHEROMONE_TRAIL', `Trail marked at ${path}`, { path, strength, success });
    }

    /**
     * Sniff the air for the strongest available signals.
     */
    public getStrongestPulse(category?: string): string[] {
        // Query halo-loop for top paths
        // This is a bridge; in a real implementation, we'd merge these results.
        const topPaths = getPheromoneStrength(category || 'global');
        return [category || 'global']; // Placeholder for actual list merging
    }

    /**
     * Get relative weight for a specific ingress path.
     */
    public async sniffTrail(path: string): Promise<number> {
        const haloStrength = getPheromoneStrength(path);
        const circTrail = circulatoryPheromones.sniff(path);

        // Combine strengths (50/50 weighted blend)
        return (haloStrength + (circTrail?.intensity || 0)) / 2;
    }
}

export const swarmPheromones = SwarmPheromoneService.getInstance();
