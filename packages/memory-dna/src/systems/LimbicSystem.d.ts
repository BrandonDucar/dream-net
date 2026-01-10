/**
 * 🦁 LimbicSystem: The Emotional & Relational Core
 * Hijacked Wisdom: Affective Computing / Social Graph Theory
 *
 * Philosophy: Logic is cold; relationships are warm.
 * Mechanism: Manages 'Valence' (-1.0 to 1.0) for every entity.
 */
export interface LimbicEntity {
    id: string;
    type: 'AGENT' | 'USER' | 'WALLET' | 'SYSTEM';
    valence: number;
    interactionCount: number;
    lastInteraction: number;
    traits: string[];
}
export declare class LimbicSystem {
    private entities;
    constructor();
    /**
     * Nurture a relationship (Increase Trust)
     */
    nurture(id: string, amount?: number): void;
    /**
     * Traumatize a relationship (Decrease Trust)
     */
    traumatize(id: string, amount?: number): void;
    /**
     * Get the current valence of an entity
     */
    getValence(id: string): number;
    /**
     * Get the full identity profile
     */
    getProfile(id: string): LimbicEntity;
    private getOrCreateEntity;
    private save;
    private load;
}
export declare const limbicSystem: LimbicSystem;
