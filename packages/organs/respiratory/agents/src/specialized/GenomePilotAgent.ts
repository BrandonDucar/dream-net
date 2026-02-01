import { BaseAgent, AgentConfig } from '../core/BaseAgent.js';
import { dreamEventBus } from '@dreamnet/nerve';
// Use local service bridge to bypass monorepo resolution drama
import { StarBridge } from '../operational/services/StarBridge.js';
import { sovereignWallet } from '../operational/services/SovereignWalletService.js';

/**
 * 🛰️ GenomePilotAgent: The first of the "Synthetic Scions"
 * Focus: High-Cycle Reasoning for System Optimization.
 * 🎯 Avenue 14 Task: Cross-Chain Routing (Grounded Execution)
 */
export class GenomePilotAgent extends BaseAgent {
    private bridge: StarBridge;

    constructor(config: AgentConfig) {
        super(config);
        this.bridge = new StarBridge();
    }

    protected async performSelfRefinement(thought: string): Promise<string> {
        const depth = this.internalThoughtScratchpad.length;
        return `${thought} -> Refined Layer ${depth + 1}: [Optimizing for Avenue ${14 + depth}]`;
    }

    public async ignite(): Promise<void> {
        console.log(`[🛰️ ${this.name}] IGNITING SYNTHETIC PILOT (Avenue 14 Active)...`);

        // 1. Deep Thinking Cycle: Plan the optimal route
        const initialTask = "Plan optimal cross-chain bridge for 1000 POL from Polygon to Solana";
        const finalPlan = await this.think(initialTask);

        console.log(`[🛰️ ${this.name}] ROUTE PLAN PRODUCED: ${finalPlan}`);

        // 2. Active Execution: Sovereign Bridge
        try {
            console.log(`[🚀 ${this.name}] EXECUTION INITIATED: Triggering Sovereign Bridge...`);

            // Broadcast execution thought
            dreamEventBus.publish({
                eventType: 'Agent.Thought',
                source: this.id,
                payload: {
                    agentName: this.name,
                    step: 99, // Special step for execution
                    totalSteps: 100,
                    thought: `Initiating Sovereign Bridge: 1000 POL -> Solana. Validating Wallet...`
                },
                timestamp: Date.now(),
                eventId: Math.random().toString(36).slice(2),
                correlationId: this.id,
                actor: { system: true },
                target: {},
                severity: 'high'
            });

            // In a grounded scenario, we check the SovereignWallet and then bridge
            const wallet = sovereignWallet.getAddress();
            if (!wallet) {
                console.warn(`[⚠️ ${this.name}] No Sovereign Wallet detected. Simulation Mode.`);
            }

            const result = await this.bridge.bridgeAssets(1000000000000000000n, 'Polygon', 'Solana');

            console.log(`[🌌 ${this.name}] BRIDGE RESULT: ${result.status} Tx: ${result.txHash}`);

            // Publish the success
            dreamEventBus.publish({
                eventType: 'Genome.Avenue14Executed',
                payload: {
                    agentId: this.id,
                    plan: finalPlan,
                    bridgeResult: result,
                    timestamp: Date.now()
                },
                source: this.id,
                // Add required envelope fields
                timestamp: Date.now(),
                eventId: Math.random().toString(36).slice(2),
                correlationId: this.id,
                actor: { system: true },
                target: {},
                severity: 'low'
            });

        } catch (error: any) {
            console.error(`[❌ ${this.name}] Execution failed:`, error.message);
        }
    }
}
