import { Threat, ThreatType, ThreatLevel } from "../types";
export interface ThreatPattern {
    id: string;
    threatType: ThreatType;
    threatLevel: ThreatLevel;
    sourcePattern?: string;
    frequency: number;
    blockedRate: number;
    discoveredAt: number;
    lastSeen: number;
}
/**
 * Learn from threats and update patterns
 */
export declare function learnFromThreats(): ThreatPattern[];
/**
 * Predict threat severity based on learned patterns
 */
export declare function predictThreatSeverity(threat: Threat): ThreatLevel;
/**
 * Get learned threat patterns
 */
export declare function getThreatPatterns(): ThreatPattern[];
/**
 * Get pattern for specific threat type/level
 */
export declare function getThreatPattern(type: ThreatType, level: ThreatLevel): ThreatPattern | undefined;
