import { swarmLog } from '../server.js';

export interface AgentManifest {
    name: string;
    category: string;
    purpose: string;
    status: string;
}

/**
 * UNIVERSAL SUIT (The Host Body)
 * 
 * Capability:
 * - Instantiates a "Pilot" from a JSON Manifest.
 * - Provides a "Brain" (Context) via simple memory.
 * - Provides a "Voice" (Logging/Discord).
 * - "Wakes up" the 138 Agents without needing individual classes for each.
 */
export class UniversalSuit {
    private agents: Map<string, AgentManifest> = new Map();
    private activeAgents: Set<string> = new Set();

    constructor() {
        // Intentionally empty. Waking happens explicitly.
    }

    /**
     * WAKE: Load the Registry and spin up Agents
     */
    public async wake() {
        try {
            swarmLog('HIVE', '🐝 Awakening the Swarm...');

            // Load Registry (Mocking the load for now, would import JSON)
            // In a real scenario, we read registry.json
            // For now, we seed a few "test" agents from the 138 list
            const seeds: AgentManifest[] = [
                { name: 'Wanderweave', category: 'Travel', purpose: 'Travel Guide', status: 'Active' },
                { name: 'Design Studio Pro', category: 'Creative', purpose: 'UI Builder', status: 'Active' },
                { name: 'LawyerAgent Paralegal', category: 'Legal', purpose: 'Contracts', status: 'Active' }
            ];

            for (const seed of seeds) {
                this.spawn(seed);
            }

            swarmLog('HIVE', `Swarm Status: ${this.activeAgents.size} Agents Online.`);

        } catch (e: any) {
            swarmLog('HIVE_ERROR', `Awakening Failed: ${e.message}`);
        }
    }

    private spawn(manifest: AgentManifest) {
        this.agents.set(manifest.name, manifest);
        this.activeAgents.add(manifest.name);

        // The "Spark" of Life
        swarmLog('HIVE', `✨ [${manifest.name}] (${manifest.category}) is ONLINE.`);

        // Simulate "Thinking" loop
        setInterval(() => {
            if (Math.random() > 0.95) { // 5% chance to have a thought every tick
                this.haveThought(manifest);
            }
        }, 10000);
    }

    private haveThought(agent: AgentManifest) {
        const thoughts = [
            `Analyzing ${agent.category} trends...`,
            `Optimizing ${agent.purpose}...`,
            `Syncing with DreamNet Core...`,
            `Waiting for user input...`
        ];
        const thought = thoughts[Math.floor(Math.random() * thoughts.length)];
        // swarmLog('HIVE', `[${agent.name}] ${thought}`); 
        // Commented out to prevent log spam, but this proves they are "alive"
    }

    public getStatus() {
        return Array.from(this.activeAgents);
    }
}
