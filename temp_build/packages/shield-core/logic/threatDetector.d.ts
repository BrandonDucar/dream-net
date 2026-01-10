import { Threat, ThreatType, ThreatLevel } from "../types";
/**
 * Detect a threat
 */
export declare function detectThreat(type: ThreatType, level: ThreatLevel, source?: string, target?: string, payload?: Record<string, any>): Threat;
/**
 * Analyze threat and determine if it should be blocked
 */
export declare function analyzeThreat(threat: Threat): {
    shouldBlock: boolean;
    recommendedSpike?: string;
};
/**
 * Simulate threat detection (for testing)
 */
export declare function simulateThreatDetection(): Threat[];
