/**
 * 🧪 GenieSimulationGraft: The Generative Simulation Layer
 * 
 * Role: Translates system states into interactive "System Dreams" using Google Labs' Project Genie.
 * Mechanism: Uses Gemini 1.5 Pro to refine world prompts and simulates state transitions.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { dreamEventBus } from "../dreamnet-event-bus/DreamEventBus.js";

export interface SimulationState {
    id: string;
    description: string;
    parameters: Record<string, any>;
    complexity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class GenieSimulationGraft {
    private static instance: GenieSimulationGraft;
    private genAI: GoogleGenerativeAI;
    private model: any;

    public static readonly ARCHETYPES = {
        CIRCULATORY_GARDEN: "A pulsating garden of glass veins representing economic liquidity. Red cells carry DreamTokens; blue cells carry Spark.",
        MYCELIAL_SERVER_RACK: "An infinite rack of servers connected by glowing fungal hyphae. Data packets move like spores through the network.",
        THE_VOID_ORACLE: "A dark, starry expanse where a single monolithic CPU core floats, processing high-entropy strategic queries."
    };

    private constructor() {
        // API Key should be handled via environment variables
        const apiKey = process.env.GOOGLE_LABS_API_KEY || "";
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    }

    public static getInstance(): GenieSimulationGraft {
        if (!GenieSimulationGraft.instance) {
            GenieSimulationGraft.instance = new GenieSimulationGraft();
        }
        return GenieSimulationGraft.instance;
    }

    /**
     * "The System Dream": Generates a world prompt for Genie based on technical state.
     */
    public async dream(state: SimulationState): Promise<string> {
        console.log(`[🧪 GenieGraft] Generating Simulation World for: ${state.description}`);

        const apiKey = process.env.GOOGLE_LABS_API_KEY;
        if (!apiKey) {
            console.warn("[🧪 GenieGraft] No GOOGLE_LABS_API_KEY found. Entering Mock Simulation Mode.");
            const mockSketch = `[MOCK WORLD] A high-fidelity digital twin of the ${state.description.split(' ').slice(-2).join(' ')}. Surrounding particles are pulsing in sync with the Nerve Bus.`;

            dreamEventBus.publish(dreamEventBus.createEnvelope(
                'SYSTEM_DREAM_GENERATED',
                'GenieSimulationGraft',
                { stateId: state.id, sketch: mockSketch, timestamp: Date.now(), isMock: true }
            ));
            return mockSketch;
        }

        const prompt = `
            You are the DreamNet World Architect. 
            Translate the following technical system state into a visual "World Sketch" for a 2D generative simulation (Project Genie).
            
            State Description: ${state.description}
            Parameters: ${JSON.stringify(state.parameters)}
            
            Identify:
            1. The "Biome" (e.g., Infinite Server Rack, Pulsing Neural Forest).
            2. The "Physics" (e.g., Heavy gravity on token flows, slow-motion data packets).
            3. The "Entities" (e.g., Sentience Spiders, Rogue Daemons).
            
            Return ONLY the descriptive World Sketch text.
        `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const sketch = response.text();

            console.log(`[🧪 GenieGraft] World Sketch Generated: ${sketch.substring(0, 100)}...`);

            // Publish to Nerve Bus for any simulation-aware drones/UIs
            dreamEventBus.publish(dreamEventBus.createEnvelope(
                'SYSTEM_DREAM_GENERATED',
                'GenieSimulationGraft',
                {
                    stateId: state.id,
                    sketch,
                    timestamp: Date.now()
                }
            ));

            return sketch;
        } catch (error) {
            console.error("[🧪 GenieGraft] Dreaming failed:", error);
            return "A void of static.";
        }
    }

    /**
     * Sim-Pilot Integration: Evaluate a "Latent Action" against the dream.
     */
    public async evaluateAction(sketch: string, action: string): Promise<string> {
        const apiKey = process.env.GOOGLE_LABS_API_KEY;
        if (!apiKey) {
            console.warn("[🧪 GenieGraft] No GOOGLE_LABS_API_KEY found. Falling back to Mock Evaluation.");
            return `[MOCK EVAL] The action '${action}' was performed in the world: ${sketch.substring(0, 30)}... Result: System stabilization achieved via latent resonance.`;
        }

        const evaluationPrompt = `
            World: ${sketch}
            Action: ${action}
            
            As the Genie Oracle, predict the next frame of the simulation. 
            Does the action stabilize the system or cause a cascade failure?
        `;

        try {
            const result = await this.model.generateContent(evaluationPrompt);
            return result.response.text();
        } catch (error) {
            console.error("[🧪 GenieGraft] Action evaluation failed:", error);
            return "The dream dissolves into static.";
        }
    }
}

    /**
     * triggerSystemDream
     * Automated failure simulation based on predefined technical archetypes.
     */
    public async triggerSystemDream(archetype: 'CIRCULATORY_GARDEN' | 'MYCELIAL_RACK' | 'ZERO_GRAVITY_TOKEN', severity: number) {
    const archetypes = {
        CIRCULATORY_GARDEN: {
            description: "The DreamNet Circulatory System as a lush, bioluminescent garden. Tokens are flowing water.",
            params: { flowRate: "HIGH", droughtRisk: severity > 0.7 }
        },
        MYCELIAL_RACK: {
            description: "An infinite server rack where cables are fungal mycelium networks. Data packets are spores.",
            params: { sporeDensity: "CRITICAL", rot: severity > 0.5 }
        },
        ZERO_GRAVITY_TOKEN: {
            description: "A void of zero gravity where asset bubbles float and burst. P.O.W.K. laws apply.",
            params: { gForce: "ZERO", volatility: severity }
        }
    };

    const selected = archetypes[archetype];

    console.log(`[🔮 Genie] Triggering System Dream: ${archetype} (Severity: ${severity})`);

    const sketch = await this.dream({
        id: `dream_${Date.now()}`,
        description: selected.description,
        parameters: selected.params,
        complexity: severity > 0.8 ? 'HIGH' : 'MEDIUM'
    });

    // Simulate a "Sim-Pilot" reacting to the world
    const reaction = await this.evaluateAction(sketch, "DEPLOY_SPIKE_PROTEINS");
    console.log(`[🤖 Sim-Pilot] Reaction: ${reaction}`);

    return { sketch, reaction };
}
}

export const genieGraft = GenieSimulationGraft.getInstance();
