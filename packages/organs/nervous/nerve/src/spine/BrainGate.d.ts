/**
 * 🧠 BrainGate: The Unified Intelligence Provider
 *
 * Hijacked Wisdom: Centralized Command / Single Point of Truth
 *
 * Role: Orchestrates all external LLM pulses (OpenAI, Gemini, etc.)
 * ensuring budget enforcement and persistent personality.
 */
export interface BrainPulseConfig {
    provider: 'openai' | 'gemini' | 'anthropic';
    model: string;
    temperature?: number;
    maxTokens?: number;
}
export declare class BrainGate {
    private static instance;
    private genAI;
    private model;
    private constructor();
    static getInstance(): BrainGate;
    think(prompt: string, config?: Partial<BrainPulseConfig>): Promise<string>;
    /**
     * 👁️ Vision Cortex: Analyze an image (URL or Base64).
     */
    see(prompt: string, imageParts: any[]): Promise<string>;
    /**
     * Standard Chat Completion pulse.
     */
    chat(messages: any[], config?: Partial<BrainPulseConfig>): Promise<any>;
    /**
     * Generate vector embedding for a string.
     */
    embed(text: string): Promise<number[]>;
    /**
     * Weave multiple thoughts into a persistent memory.
     */
    weave(memories: string[]): Promise<string>;
}
export declare const brainGate: BrainGate;
//# sourceMappingURL=BrainGate.d.ts.map