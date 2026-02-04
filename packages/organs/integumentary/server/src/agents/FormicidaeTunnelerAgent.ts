import { Agent, AgentId, AgentInvocationContext, AgentResult } from './core/types';
import { swarmPheromones } from './core/SwarmPheromoneService';
import { BlackboardScheduler } from './BlackboardScheduler';
import { agentBus } from './agent-bus';

/**
 * FormicidaeTunnelerAgent
 * A leaderless "Ant" agent that forages for high-value data targets 
 * and marks them with digital pheromones for the rest of the swarm.
 */
export class FormicidaeTunnelerAgent implements Agent {
    public id: AgentId = 'formicidae:tunneler:01';
    public name = 'Formicidae Tunneler';
    public description = 'Leaderless forager for high-value data trails.';
    public category: 'action' = 'action';
    public version = '1.0.0';
    public capabilities = ['foraging', 'tunneling', 'semantic_labeling'];
    public circadianPulse = 900000; // 15 minutes

    public async run(input: any, ctx: AgentInvocationContext): Promise<AgentResult> {
        return this.pulse(ctx);
    }

    public async pulse(ctx: AgentInvocationContext): Promise<AgentResult> {
        console.log(`🐜 [Formicidae] Tunneler ${this.id} initiated foraging cycle...`);

        try {
            // 1. Scavenge for HELP_WANTED or Competitive Hits (The "Food" Source)
            const helpRequests = BlackboardScheduler.getHelpRequests();
            const target = helpRequests[0]; // Simplification for MVP

            if (target) {
                console.log(`🐜 [Formicidae] Target spotted: ${target.topic}. Tunneling...`);

                // 2. Perform "Tunneling" (Simulated data scan)
                const success = Math.random() > 0.2;
                const path = `target:${target.topic.replace(/\s+/g, '_').toLowerCase()}`;

                if (success) {
                    // 3. Leave Pheromone Trail
                    await swarmPheromones.markTrail(path, true, 0.2);

                    // 4. Report to Social Hub
                    await BlackboardScheduler.postChatter(this.id,
                        `Found high-fidelity trail for ${target.topic}. Strengthening pheromones at ${path}.`
                    );

                    agentBus.broadcast('TUNNEL_SUCCESS', `Foraged successfully for ${target.topic}`, { path });
                } else {
                    await swarmPheromones.markTrail(path, false, 0.05);
                }
            } else {
                // Idle foraging (Random scan)
                console.log(`🐜 [Formicidae] No immediate targets. Scanning global_foraging trail.`);
                await swarmPheromones.markTrail('global_foraging', true, 0.01);
            }

            return { success: true };
        } catch (error: any) {
            console.error(`❌ [Formicidae] Tunneler failed: ${error}`);
            return { success: false, error: error.message };
        }
    }
}

export const formicidaeTunneler = new FormicidaeTunnelerAgent();
