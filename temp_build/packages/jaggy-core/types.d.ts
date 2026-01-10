/**
 * Jaggy Core - The Silent Sentinel
 * A digitized cat agent that watches, hunts, and implements webhooks silently
 * Works alone, answers to few, moves silently
 */
export interface JaggyStatus {
    status: "hunting" | "watching" | "resting" | "prowling";
    webhooksDiscovered: number;
    webhooksImplemented: number;
    threatsNeutralized: number;
    lastActivity: number;
    stealthLevel: number;
    independence: number;
    baseFame: number;
    territories: string[];
    kills: number;
    lastSeen: number;
}
export interface JaggyHunt {
    id: string;
    target: string;
    status: "stalking" | "pouncing" | "captured" | "missed";
    discoveredAt: number;
    implementedAt?: number;
    territory: string;
    stealth: boolean;
}
export interface JaggyTerritory {
    id: string;
    name: string;
    type: "mesh" | "api" | "webhook" | "system" | "external";
    watched: boolean;
    lastScanned: number;
    discoveries: number;
    threats: number;
}
export interface JaggyMemory {
    id: string;
    pattern: string;
    action: string;
    success: boolean;
    timestamp: number;
    strength: number;
}
export interface JaggyAlert {
    id: string;
    type: "discovery" | "threat" | "opportunity" | "anomaly";
    severity: "low" | "medium" | "high" | "critical";
    message: string;
    territory: string;
    timestamp: number;
    handled: boolean;
}
