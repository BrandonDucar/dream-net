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
        const results = await Promise.allSettled(
            Array.from(this.members.values()).map(m => m.boot())
        );

        const failures = results.filter(r => r.status === 'rejected');
        if (failures.length > 0) {
            console.warn(`[🌿 Guild] Warning: ${failures.length} seeds failed to germinate in ${this.name}.`);
        } else {
            console.log(`[🌿 Guild] ${this.name} is in full bloom.`);
        }
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
