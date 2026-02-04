import { swarmPheromones } from './SwarmPheromoneService';
import { agentBus } from '../agent-bus';

/**
 * EconomicPheromoneService
 * Aligns the $SHEEP economic signals with the swarm's activity.
 * When liquidity events occur on Hunt Town, the swarm's "Economic Pulse" is strengthened.
 */
export class EconomicPheromoneService {
    private static instance: EconomicPheromoneService;

    public static getInstance(): EconomicPheromoneService {
        if (!EconomicPheromoneService.instance) {
            EconomicPheromoneService.instance = new EconomicPheromoneService();
        }
        return EconomicPheromoneService.instance;
    }

    /**
     * Sync $SHEEP liquidity signals from Hunt Town.
     */
    public async syncEconomicSignals(price: number, liquidity: number): Promise<void> {
        console.log(`🐏 [$SHEEP] Syncing signals: Price: ${price}, Liquidity: ${liquidity}`);

        // 1. Mark an "Economic Trail"
        const strength = Math.min(1.0, liquidity / 10000); // Scale by liquidity
        await swarmPheromones.markTrail('economic:sheep:hunt_town', true, strength);

        // 2. Broadcast the Pulse
        agentBus.broadcast('ECONOMIC_PULSE', `$SHEEP is vibrating at ${price}. Swarm liquidity is ${liquidity}.`, {
            price,
            liquidity,
            ticker: '$SHEEP',
            platform: 'Hunt Town'
        });
    }
}

export const economicPheromones = EconomicPheromoneService.getInstance();
