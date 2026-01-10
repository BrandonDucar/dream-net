/**
 * 🎓 VERTICAL INTELLIGENCE
 *
 * Encodes the "Titans" and "Strategies" into the Antigravity Core.
 * Allows the system to "reason" about these sectors.
 */
export interface Vertical {
    id: string;
    name: string;
    titans: string[];
    strategy: string;
    hybridPotential: string;
}
export declare const VERTICALS: Record<string, Vertical>;
export declare class VerticalIntelligence {
    /**
     * Ingests the defined verticals into the system's memory.
     */
    static ingestKnowledge(): Promise<void>;
    static getStrategy(name: string): Vertical;
}
