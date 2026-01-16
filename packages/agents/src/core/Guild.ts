/**
 * Agent Guild 🌿
 * Hijacked Wisdom: Permaculture (Companion Planting / Guilds)
 * 
 * Philosophy: Monocultures die. Polycultures survive.
 * Mechanism: A group of complementary agents managed as a single organism.
 */

import { AgentContainer } from './Container.js';

export class AgentGuild {
    private members: Map<string, AgentContainer> = new Map();
    public name: string;

    constructor(name: string) {
        this.name = name;
    }

    /**
     * Plant a new agent in the guild (Companion Planting)
     */
    public addMember(role: string, agent: AgentContainer) {
        this.members.set(role, agent);
        console.log(`[🌿 Guild] Planted ${role} (${agent.constructor.name}) in ${this.name} bed.`);
    }

    /**
     * Boot the entire garden bed
     */
    public async boot() {
        console.log(`[🌿 Guild] Awakening ${this.name}...`);

        for (const [role, agent] of this.members) {
            try {
                await agent.boot();
            } catch (err: any) {
                console.warn(`[🌿 Guild] 🛑 Component failed to germinate: ${role}. Error: ${err.message}`);
                // Non-critical components are allowed to fail to keep the hive alive.
            }
        }

        console.log(`[🌿 Guild] ${this.name} ecosystem check complete.`);
    }

    /**
     * Check the ecosystem health
     */
    public checkEcosystem(): any {
        const health: any = {};
        for (const [role, agent] of this.members) {
            health[role] = agent.checkHealth();
        }
        return health;
    }
}
