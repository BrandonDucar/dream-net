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
  stealthLevel: number; // 0-100, higher = more silent
  independence: number; // 0-100, how much he works alone
  baseFame: number; // 0-100, how famous on Base
  territories: string[]; // Areas he watches
  kills: number; // Successful implementations
  lastSeen: number;
}

export interface JaggyHunt {
  id: string;
  target: string; // What he's hunting (webhook, API, etc.)
  status: "stalking" | "pouncing" | "captured" | "missed";
  discoveredAt: number;
  implementedAt?: number;
  territory: string; // Where he found it
  stealth: boolean; // Whether he moved silently
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
  strength: number; // Memory strength (fades over time)
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

