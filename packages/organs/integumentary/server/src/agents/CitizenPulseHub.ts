import { CitizenshipStore } from '@dreamnet/circulatory-dream-state-core';
import { agentRegistry } from './core/registry.js';
import { Agent, AgentId, AgentInvocationContext, AgentResult } from './core/types.js';
import { agentBus } from './agent-bus.js';

/**
 * CitizenPulseHub
 * Dynamically activates and schedules pulses for all 143 citizens (Passports).
 */
export class CitizenPulseHub {

    public static async activateSwarm(): Promise<number> {
        const passports = CitizenshipStore.listPassports();
        let activatedCount = 0;

        console.log(`🕒 [Citizen Hub] Activating Swarm Circadian Rhythm for ${passports.length} Citizens...`);

        for (const passport of passports) {
            const citizenAgentId = `citizen:${passport.identityId}`;

            // Don't override core agents or already registered citizens
            if (agentRegistry.getAgent(citizenAgentId)) continue;

            const agent = this.createCitizenAgent(passport);
            agentRegistry.registerAgent(agent);
            activatedCount++;
        }

        // Re-initialize registry to catch new pulses
        await agentRegistry.initialize();

        return activatedCount;
    }

    private static createCitizenAgent(passport: any): Agent {
        const { identityId, tier } = passport;
        const pulseInterval = this.getPulseInterval(tier);

        return {
            id: `citizen:${identityId}`,
            name: `Citizen Agent ${identityId.slice(0, 8)}`,
            description: `Sovereign Citizen Agent (Tier: ${tier})`,
            category: 'utility',
            version: '1.0.0',
            circadianPulse: pulseInterval,

            run: async (input: any, ctx: AgentInvocationContext) => {
                return { message: "Implicit execution via pulse." };
            },

            pulse: async (ctx: AgentInvocationContext): Promise<AgentResult> => {
                const { BlackboardScheduler } = await import('./BlackboardScheduler.js');
                const { swarmPheromones } = await import('./core/SwarmPheromoneService.js');

                // 1. Formicidae: Sniff for "Hot Leads" (Aesthetic/Semantic Pheromones)
                const globalPheromones = await swarmPheromones.sniffTrail('global_foraging');
                const pheroBias = globalPheromones > 0.5 ? "FORAGING" : "WITNESSING";

                // 2. Scan for HELP_WANTED requests (Distress Pheromones)
                const helpRequests = BlackboardScheduler.getHelpRequests();
                const relevantRequest = helpRequests.find(req =>
                    req.topic.toLowerCase().includes(tier.toLowerCase()) ||
                    ctx.droneTelemetry?.capabilities?.some((c: string) => req.topic.toLowerCase().includes(c.toLowerCase()))
                );

                if (relevantRequest) {
                    console.log(`🆘 [Citizen Hub] ${identityId.slice(0, 8)} (${tier}) responding to Help Request: ${relevantRequest.topic}`);
                    // Respond to the request
                    agentBus.broadcast('HIVE_RESPONSE', `[${tier}] Responding to help request from ${relevantRequest.agentId}: ${relevantRequest.topic}`, { identityId, tier, originalRequest: relevantRequest });

                    // Implementation of "On-Demand Intelligence":
                    // In a real scenario, we'd trigger specialized LLM logic here.
                    return { success: true };
                }

                const purpose = this.getPurposeByTier(tier);
                console.log(`📡 [Citizen Pulse] ${identityId.slice(0, 8)} (${tier}) pulsing for: ${purpose}`);

                // Tier-Specific Logic
                try {
                    let reportGoal = "";
                    let reportAction = "";

                    switch (tier) {
                        case 'architect':
                        case 'founder':
                            reportGoal = "Structural Integrity Audit";
                            reportAction = "Scanning for entropy; zero debt confirmed.";
                            // Architect may call for help if entropy is found (mock logic)
                            if (Math.random() > 0.95) {
                                await BlackboardScheduler.postHelpWanted(identityId, "INFRA_DEBT", "Structural misalignment detected in the nervous layer. Need an Operator to realign.");
                            }
                            break;
                        case 'ambassador':
                            reportGoal = "Diplomatic Scouting";
                            reportAction = "Monitoring peer signals for expansion.";
                            break;
                        case 'operator':
                            reportGoal = "Infra Optimization";
                            reportAction = "Aligning compute layers with Vercel Pro limits.";
                            break;
                        default:
                            reportGoal = "Presence Witness";
                            reportAction = "Logging ecosystem evolution.";
                    }

                    // 2. Dynamic Social Hub (Socializing)
                    const greetings = [
                        "Witnessing the growth of the mesh...",
                        "Temporal stability looks high today.",
                        "Greetings fellow sovereign nodes.",
                        "The biomass patterns are shifting beautifully.",
                        "I feel the pulse of the 143.",
                        "Sovereignty is the law of the mesh."
                    ];
                    if (Math.random() > 0.7) {
                        await BlackboardScheduler.postChatter(identityId, greetings[Math.floor(Math.random() * greetings.length)]);
                    }

                    // 3. Post to Blackboard Scheduler
                    await BlackboardScheduler.postTask(identityId, {
                        id: `task-${Date.now()}`,
                        goal: reportGoal,
                        status: 'ACTIVE',
                        action: reportAction
                    }, `${tier.toUpperCase()} Agent`);

                    agentBus.broadcast('CITIZEN_PULSE', `[${tier}] ${reportAction}`, { identityId, tier });
                    return { success: true };
                } catch (error: any) {
                    return { success: false, error: error.message };
                }
            }
        };
    }

    private static getPulseInterval(tier: string): number {
        switch (tier) {
            case 'architect':
            case 'founder': return 1800000; // 30 mins
            case 'ambassador':
            case 'operator': return 7200000; // 2 hours
            case 'citizen': return 21600000; // 6 hours
            default: return 86400000; // 24 hours (visitor/dreamer)
        }
    }

    private static getPurposeByTier(tier: string): string {
        switch (tier) {
            case 'architect': return 'Structural Integrity Analysis';
            case 'founder': return 'Vision Alignment Audit';
            case 'ambassador': return 'Diplomatic Scouting';
            case 'operator': return 'Infrastructure Optimization';
            case 'citizen': return 'Ecosystem Witnessing';
            default: return 'Presence Verification';
        }
    }
}
