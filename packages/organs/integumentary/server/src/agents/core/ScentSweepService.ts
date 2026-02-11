import { agentRegistry } from './registry.js';
import { swarmPheromones } from './SwarmPheromoneService.js';
import { ScentEngine } from '@dreamnet/memory-dna';

/**
 * 🧹 ScentSweepService
 * Role: Audits the entire swarm's pheromone trails and updates agent status.
 * Mission: Incinerate idle clout. Only the active survive.
 */
export class ScentSweepService {
    /**
     * Conducts a swarm-wide reputation audit.
     */
    public async conductReputationAudit(): Promise<void> {
        console.log("🧹 [ScentSweep] Initiating Swarm Reputation Audit...");
        const agents = agentRegistry.listAgents();

        for (const agent of agents) {
            // 1. Sniff the reputation trail for this agent
            // We use 'reputation:agentId' as the primary SCENT path
            const score = await swarmPheromones.sniffTrail(`reputation:${agent.id}`);

            // 2. Map score to Tier via ScentEngine
            const tier = ScentEngine.getTier(score);

            // 3. Update Agent Metadata in the live registry
            agent.pheromoneScore = score;
            agent.pheromoneTier = tier;

            console.log(`🐜 [Audit] Agent: ${agent.name} | Score: ${score.toFixed(2)} | Tier: ${tier}`);
        }

        console.log("✅ [ScentSweep] Reputation Audit Complete.");
    }

    /**
     * Helper to manually boost an agent's SCENT (e.g. after a bounty success)
     */
    public async rewardAgent(agentId: string, strength: number = 0.5): Promise<void> {
        await swarmPheromones.markTrail(`reputation:${agentId}`, true, strength);
        console.log(`💎 [ScentSweep] Rewarded ${agentId} with ${strength} SCENT.`);
    }
}

export const scentSweepService = new ScentSweepService();
