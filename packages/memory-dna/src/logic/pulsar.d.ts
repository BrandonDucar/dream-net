/**
 * 🧠 PULSAR: The Subconscious Heartbeat
 *
 * "Always Thinking. Always Searching."
 *
 * This module runs in the background to:
 * 1. Resurface "forgotten" memories (low recall frequency).
 * 2. Generate "Thought Signals" (synthetic events) based on memory patterns.
 * 3. Keep the Vector Store active even during low user activity.
 */
export interface ThoughtSignal {
    id: string;
    timestamp: string;
    thought: string;
    sourceMemoryId?: string;
    intensity: number;
}
export declare class Pulsar {
    private static isRunning;
    private static intervalId;
    /**
     * Activates the Pulsar heartbeat.
     * @param validTokenAddress - Proof of "Life" (Token Contract) required to activate full consciousness.
     */
    static ignite(validTokenAddress?: string): void;
    static extinguish(): void;
    /**
     * A single "Thought Cycle".
     */
    private static pulse;
    private static broadcastThought;
}
//# sourceMappingURL=pulsar.d.ts.map