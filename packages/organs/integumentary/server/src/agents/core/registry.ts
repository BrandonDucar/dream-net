import { Agent, AgentId } from './types.js';

class AgentRegistry {
    private agents: Map<AgentId, Agent> = new Map();

    registerAgent(agent: Agent): void {
        this.agents.set(agent.id, agent);
        console.log(`✅ Registered agent: ${agent.name} (${agent.id})`);
    }

    getAgent(id: AgentId): Agent | undefined {
        return this.agents.get(id);
    }

    listAgents(): Agent[] {
        return Array.from(this.agents.values());
    }

    async initialize(): Promise<void> {
        console.log('🚀 Initializing agents and starting Swarm Circadian Rhythm...');

        for (const agent of this.agents.values()) {
            if (agent.initialize) {
                try {
                    await agent.initialize();
                    console.log(`✅ Initialized: ${agent.id}`);
                } catch (error) {
                    console.error(`❌ Failed to initialize ${agent.id}:`, error);
                }
            }

            // Start Circadian Pulse if configured
            if (agent.circadianPulse && agent.pulse) {
                this.startAgentPulse(agent);
            }
        }
    }

    private startAgentPulse(agent: Agent): void {
        console.log(`🕒 [Circadian] Scheduling ${agent.id} pulse every ${agent.circadianPulse}ms`);

        setInterval(async () => {
            const requestId = `pulse-${agent.id}-${Date.now()}`;

            // 🦀 PAN-CRAB: Biomass Podding (Agent Stacking)
            // Check if other agents are working on the same goal to form a "Pod"
            const { swarmPheromones } = await import('./SwarmPheromoneService.js');
            const podTrail = await swarmPheromones.sniffTrail(`pod:${agent.id}`);

            const ctx: AgentInvocationContext = {
                requestId,
                timestamp: new Date().toISOString(),
                droneTelemetry: {
                    podStrength: podTrail,
                    isPodding: podTrail > 0.7
                }
            };

            try {
                if (ctx.droneTelemetry.isPodding) {
                    console.log(`🦀 [Pan-Crab] ${agent.id} is PODDING. Aggregating compute...`);
                }

                console.log(`📡 [Circadian] Pulsing ${agent.id}...`);
                const result = await agent.pulse!(ctx);

                // If successful, strengthen the pod pheromones
                if (result.success) {
                    await swarmPheromones.markTrail(`pod:${agent.id}`, true, 0.1);
                    console.log(`✅ [Circadian] ${agent.id} pulse complete.`);
                } else {
                    console.warn(`⚠️ [Circadian] ${agent.id} pulse problem: ${result.error}`);
                }
            } catch (error) {
                console.error(`❌ [Circadian] ${agent.id} pulse failed:`, error);
            }
        }, agent.circadianPulse);
    }

    async shutdown(): Promise<void> {
        console.log('🛑 Shutting down agents...');

        for (const agent of this.agents.values()) {
            if (agent.shutdown) {
                try {
                    await agent.shutdown();
                } catch (error) {
                    console.error(`❌ Failed to shutdown ${agent.id}:`, error);
                }
            }
        }
    }
}

// Global registry instance
export const agentRegistry = new AgentRegistry();

// Auto-register core agents
import { formicidaeTunneler } from '../FormicidaeTunnelerAgent.js';
import { pippinSoul } from '../PippinBabyAGIAgent.js';
import { resourceManager } from './ResourceManager.js';

import { theResonance } from '../../../../../educational/prep-school/src/HumanizerAgent.js';

agentRegistry.registerAgent(formicidaeTunneler);
agentRegistry.registerAgent(pippinSoul);
agentRegistry.registerAgent(theResonance as any);

export { resourceManager };
