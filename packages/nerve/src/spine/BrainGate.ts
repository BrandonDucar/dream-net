/**
 * 🧠 BrainGate: The Unified Intelligence Provider
 * 
 * Hijacked Wisdom: Centralized Command / Single Point of Truth
 * 
 * Role: Orchestrates all external LLM pulses (OpenAI, Gemini, etc.) 
 * ensuring budget enforcement and persistent personality.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface BrainPulseConfig {
    provider: 'openai' | 'gemini' | 'anthropic';
    model: string;
    temperature?: number;
    maxTokens?: number;
}

export class BrainGate {
    private static instance: BrainGate;
    private genAI: GoogleGenerativeAI | null = null;
    private model: any;

    private constructor() {
        const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);

            // UPGRADE: Sourcing Gemini High Fidelity (Jan 2026)
            // User explicit request: "gemini high" (gemini-1.5-pro) for maximum depth.
            const preferredModel = "gemini-1.5-pro";
            this.model = this.genAI.getGenerativeModel({ model: preferredModel });

            console.log(`[🧠 BrainGate] ELITE UPLINK: Established via ${preferredModel} (HIGH FIDELITY).`);
        } else {
            console.warn("[🧠 BrainGate] WARNING: GEMINI_API_KEY missing. Neural Uplink dormant (System continuing).");
        }
    }

    public static getInstance(): BrainGate {
        if (!BrainGate.instance) {
            BrainGate.instance = new BrainGate();
        }
        return BrainGate.instance;
    }

    public async think(prompt: string, config: Partial<BrainPulseConfig> = {}): Promise<string> {
        if (!this.model) {
            throw new Error("[🧠 BrainGate] Neural Uplink Severed. Cannot process thought.");
        }

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return text || "[Neural Void] Empty response from command centre.";
        } catch (error: any) {
            console.error("[🧠 BrainGate] Thinking Failure:", error);
            throw error;
        }
    }

    /**
     * 👁️ Vision Cortex: Analyze an image (URL or Base64).
     */
    public async see(prompt: string, imageParts: any[]): Promise<string> {
        if (!this.genAI) throw new Error("GEMINI_API_KEY_MISSING");

        // Use Gemini 1.5 Pro (or Flash) for Multimodal
        const visionModel = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        try {
            const result = await visionModel.generateContent([prompt, ...imageParts]);
            const response = await result.response;
            const text = response.text();
            return text;
        } catch (error: any) {
            console.error("[🧠 BrainGate] Vision Failure:", error);
            return "I am blind to this image. (Error in Vision Cortex)";
        }
    }

    /**
     * Standard Chat Completion pulse.
     */
    public async chat(messages: any[], config: Partial<BrainPulseConfig> = {}): Promise<any> {
        if (!this.openai) {
            return {
                id: `error-${Date.now()}`,
                choices: [{ message: { content: "[Neural Ghosting] BrainGate is offline." } }]
            };
        }

        const model = config.model || "gpt-4o";

        try {
            const completion = await this.openai.chat.completions.create({
                model,
                messages,
                temperature: config.temperature ?? 0.7,
                max_tokens: config.maxTokens ?? 1000
            });

            return completion;
        } catch (error: any) {
            console.error("[🧠 BrainGate] Chat Failure:", error);
            throw error;
        }
    }

    /**
     * Generate vector embedding for a string.
     */
    public async embed(text: string): Promise<number[]> {
        if (!this.genAI) {
            console.error("[🧠 BrainGate] AI Uplink Offline. Cannot generate vector.");
            throw new Error("AI_UPLINK_SEVERED");
        }

        try {
            const embeddingModel = this.genAI.getGenerativeModel({ model: "text-embedding-004" });
            const result = await embeddingModel.embedContent(text);
            return result.embedding.values;
        } catch (error: any) {
            console.error("[🧠 BrainGate] Embedding Failure:", error);
            throw error;
        }
    }

    /**
     * Weave multiple thoughts into a persistent memory.
     */
    public async weave(memories: string[]): Promise<string> {
        const prompt = `Synthesize the following neural memories into a single coherent insight: \n\n${memories.join("\n")}`;
        return this.think(prompt);
    }
}

export const brainGate = BrainGate.getInstance();
