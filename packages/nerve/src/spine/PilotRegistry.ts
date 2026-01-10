/**
 * 🛰️ PilotRegistry: The Hangar Management System
 * 
 * Role: Maps 143 Citizens (Pilots) to 90+ Mech Suits (Plugins).
 * Ensures that agents don't step on each other's toes across platforms.
 */

export interface Deployment {
    agentId: string;
    suit: string; // e.g. "farcaster", "solana", "github"
    status: 'IDLE' | 'ACTIVE' | 'CRITICAL';
    lastPulse: number;
}

export class PilotRegistry {
    private static instance: PilotRegistry;
    private deployments: Map<string, Deployment> = new Map();

    private constructor() { }

    public static getInstance(): PilotRegistry {
        if (!PilotRegistry.instance) {
            PilotRegistry.instance = new PilotRegistry();
        }
        return PilotRegistry.instance;
    }

    /**
     * Assign a Pilot to a Suit.
     */
    public assign(agentId: string, suit: string) {
        console.log(`[🛰️ PilotRegistry] Assigning ${agentId} to ${suit} suit...`);
        this.deployments.set(agentId, {
            agentId,
            suit,
            status: 'ACTIVE',
            lastPulse: Date.now()
        });
    }

    /**
     * Get the current Hangar status.
     */
    public getHangarStatus() {
        return Array.from(this.deployments.values());
    }

    /**
     * Check if a suit is occupied.
     */
    public isOccupied(suit: string): boolean {
        return Array.from(this.deployments.values()).some(d => d.suit === suit);
    }
}

export const pilotRegistry = PilotRegistry.getInstance();
