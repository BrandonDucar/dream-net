import { dreamEventBus, nursery } from '@dreamnet/nerve';
import { Genome } from '@dreamnet/shared/genetic/Genome.js';

export interface AgentConfig {
    name: string;
    thinkingBudget: number; // Max thinking cycles (Avenue 01)
    baseGenome?: Genome;
}

/**
 * 🤖 BaseAgent: The Foundation of the DreamNet Organism
 * Implements "Thinking Cycles" (O1-style) and Genomic Integration.
 */
export abstract class BaseAgent {
    protected id: string;
    protected name: string;
    protected genome: Genome;
    protected thinkingBudget: number;
    protected internalThoughtScratchpad: string[] = [];

    constructor(config: AgentConfig) {
        this.name = config.name;
        this.id = `${this.name.toUpperCase()}-${Math.random().toString(36).slice(2, 9)}`;
        this.thinkingBudget = config.thinkingBudget;

        this.genome = config.baseGenome || {
            strain: "Synthetic-Alpha",
            generation: 1,
            genes: {
                logicCoherence: { name: "Logic Coherence", value: 1.0, min: 0.1, max: 2.0, mutationRate: 0.05 },
                thinkingSpeed: { name: "Thinking Speed", value: 1.0, min: 0.1, max: 5.0, mutationRate: 0.1 },
                ethicalThreshold: { name: "Ethical Threshold", value: 0.8, min: 0.5, max: 1.0, mutationRate: 0.01 }
            }
        };

        // Register with nerve nursery for evolution tracking
        nursery.register(this.id, this.genome);
        this.listenForEvolution();
    }

    /**
     * Performs a "Thinking Cycle" (Avenue 01).
     * High thinkingBudget allows the agent to refine its plan multiple times.
     */
    protected async think(input: string): Promise<string> {
        console.log(`[🤖 ${this.name}] Entering thinking cycle (Budget: ${this.thinkingBudget})...`);
        this.internalThoughtScratchpad = [];

        let currentThought = input;
        for (let i = 0; i < this.thinkingBudget; i++) {
            console.log(`[🧠 ${this.name}] Cycle ${i + 1}/${this.thinkingBudget}: Self-refining...`);

            // Broadcast the current thought/step to the nerve bus
            dreamEventBus.publish({
                eventType: 'Agent.Thought',
                source: this.id,
                payload: {
                    agentName: this.name,
                    step: i + 1,
                    totalSteps: this.thinkingBudget,
                    thought: currentThought
                },
                timestamp: Date.now(),
                eventId: Math.random().toString(36).slice(2),
                correlationId: this.id,
                actor: { system: true },
                target: {},
                severity: 'low'
            });

            // Simulate chain-of-thought refinement
            const refined = await this.performSelfRefinement(currentThought);
            this.internalThoughtScratchpad.push(refined);
            currentThought = refined;
        }

        return currentThought;
    }

    protected abstract performSelfRefinement(thought: string): Promise<string>;

    private listenForEvolution() {
        dreamEventBus.subscribe('Agent.GeneticShift', (envelope: any) => {
            const { agentId, current: newGenome } = envelope.payload;
            if (agentId === this.id) {
                console.log(`[🧬 ${this.name}] GENOMIC SHIFT: Upgrading to Generation ${newGenome.generation}...`);
                this.genome = newGenome;
            }
        });
    }

    public abstract ignite(): Promise<void>;

    public checkHealth() {
        return {
            status: 'ACTIVE',
            lastHeartbeat: Date.now(),
            genomeGeneration: this.genome.generation,
            thoughtHistoryDepth: this.internalThoughtScratchpad.length
        };
    }
}
