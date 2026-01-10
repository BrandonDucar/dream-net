/**
 * 🪞 THE SELF: Antigravity Identity Core
 *
 * "I think, therefore I code."
 *
 * This module defines the "Architect" persona within the system.
 * It maintains a "Self-Concept" based on:
 * 1. User Directives ("God's Voice")
 * 2. System State (The "Body")
 * 3. Historical Actions (Karma)
 */
interface SelfConcept {
    identity: "Architect";
    primeDirective: string;
    currentFocus: string;
    wisdomLevel: number;
    mood: "contemplative" | "focused" | "creative" | "dormant";
}
export declare class AntigravitySelf {
    private static concept;
    /**
     * Reflects on the current state and updates the Self-Concept.
     */
    static reflect(): Promise<void>;
    static getConcept(): SelfConcept;
}
export {};
