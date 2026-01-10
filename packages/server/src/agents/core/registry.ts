import { Agent, AgentId } from './types';

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
        console.log('🚀 Initializing agents...');

        for (const agent of this.agents.values()) {
            if (agent.initialize) {
                try {
                    await agent.initialize();
                    console.log(`✅ Initialized: ${agent.id}`);
                } catch (error) {
                    console.error(`❌ Failed to initialize ${agent.id}:`, error);
                }
            }
        }
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
