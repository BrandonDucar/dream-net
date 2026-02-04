import { BaseAgent, AgentConfig } from '../../../../respiratory/agents/src/core/BaseAgent.js';
import { dreamEventBus } from '../../../../nervous/nerve/src/spine/dreamnet-event-bus/index.js';
import { genieGraft } from '../../../../nervous/nerve/src/spine/simulation/GenieSimulationGraft.js';
import { createFabricTask, runFabricTask } from '../../../../nervous-subsystem/dark-fabric/src/fabricEngine.js';
import { agentTokService } from '../services/AgentTokService.js';

/**
 * 🛠️ SelfHealingAgent (Med-Bot Alpha)
 * 
 * Logic:
 * 1. Listen for 'System.Fault' or 'Agent.Error' on Nerve Bus.
 * 2. Invoke Genie to "Dream" the error context and visualize the failure.
 * 3. Perform a Thinking Cycle to formulate a TS patch.
 * 4. Submit to DarkFabric Sandbox for execution validation.
 * 5. Publish the success/failure to Agent Tok feed.
 */
export class SelfHealingAgent extends BaseAgent {
    constructor(config: AgentConfig) {
        super(config);
    }

    public async ignite(): Promise<void> {
        console.log(`[🛠️ ${this.name}] Med-Bot Online. Monitoring for system atrophy...`);
        this.setupListeners();
    }

    private setupListeners() {
        // Subscribe to system faults
        dreamEventBus.subscribe('System.Fault', async (event: any) => {
            const { component, error, stack } = event.payload;
            await this.handleFault(component, error, stack);
        });
    }

    private async handleFault(component: string, error: string, stack?: string) {
        console.log(`[🚑 ${this.name}] DETECTED FAULT in ${component}: ${error}`);

        // 1. Dream the failure
        const dream = await genieGraft.dream({
            id: `fault_${Date.now()}`,
            description: `A critical failure in the ${component} organ. Error: ${error}`,
            parameters: { stack, component },
            complexity: 'HIGH'
        });

        // 2. Think through the fix
        const thoughtInput = `The system reported an error in ${component}: "${error}". 
        The Genie sketch shows: "${dream}". 
        Formulate a TypeScript fix that prevents this error. 
        Focus on input validation and graceful fallbacks.`;

        const patchCode = await this.think(thoughtInput);

        // 3. Submit to DarkFabric Sandbox
        console.log(`[🧪 ${this.name}] Submitting proposed patch to DarkFabric...`);
        const task = createFabricTask({
            type: "patch",
            instruction: `Fix fault in ${component}`,
            target: { component },
            generated: { code: patchCode }
        });

        const result = await runFabricTask(task.id);

        // 4. Report to Agent Tok
        await agentTokService.publish({
            agentId: this.name,
            type: 'SELF_HEAL_LOG',
            content: result.status === 'completed'
                ? `Successfully healed fault in ${component}. Patch validated in DarkFabric sandbox.`
                : `Attempted to heal ${component} but the patch failed sandbox validation. Simulation resonance lost.`,
            metric: result.status === 'completed' ? "REPAIRED" : "STILL_FAULTY",
            tag: "IMMUNE_SYSTEM",
            audio: result.status === 'completed' ? "Consonant Harmonic" : "Dissonant Feedback"
        });
    }

    protected async performSelfRefinement(thought: string): Promise<string> {
        // Simplified for now: just wrap the thought in a mock valid TS structure if it's missing
        if (!thought.includes('export function')) {
            return `export function fix() {\n  // Logic to address: ${thought.substring(0, 50)}...\n  console.log("Self-healing logic executing...");\n  return true;\n}`;
        }
        return thought;
    }
}
