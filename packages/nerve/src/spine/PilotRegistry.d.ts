/**
 * 🛰️ PilotRegistry: The Hangar Management System
 *
 * Role: Maps 143 Citizens (Pilots) to 90+ Mech Suits (Plugins).
 * Ensures that agents don't step on each other's toes across platforms.
 */
export interface Deployment {
    agentId: string;
    suit: string;
    status: 'IDLE' | 'ACTIVE' | 'CRITICAL';
    lastPulse: number;
}
export declare class PilotRegistry {
    private static instance;
    private deployments;
    private constructor();
    static getInstance(): PilotRegistry;
    /**
     * Assign a Pilot to a Suit.
     */
    assign(agentId: string, suit: string): void;
    /**
     * Get the current Hangar status.
     */
    getHangarStatus(): Deployment[];
    /**
     * Check if a suit is occupied.
     */
    isOccupied(suit: string): boolean;
}
export declare const pilotRegistry: PilotRegistry;
//# sourceMappingURL=PilotRegistry.d.ts.map