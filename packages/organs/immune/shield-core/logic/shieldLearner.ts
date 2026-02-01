import { Threat, ThreatType, ThreatLevel, ShieldLayer } from '../types.js';
import { ShieldStore } from '../store/shieldStore.js';

export interface ThreatPattern {
  id: string;
  threatType: ThreatType;
  threatLevel: ThreatLevel;
  sourcePattern?: string;
  frequency: number;           // How often this pattern appears
  blockedRate: number;        // 0-1 success rate
  discoveredAt: number;
  lastSeen: number;
}

const threatPatterns: Map<string, ThreatPattern> = new Map();

/**
 * Learn from threats and update patterns
 */
export function learnFromThreats(): ThreatPattern[] {
  const allThreats = ShieldStore.listThreats();
  const newPatterns: ThreatPattern[] = [];

  // Group threats by type and level
  const threatGroups = new Map<string, Threat[]>();
  for (const threat of allThreats) {
    const key = `${threat.type}:${threat.level}`;
    if (!threatGroups.has(key)) {
      threatGroups.set(key, []);
    }
    threatGroups.get(key)!.push(threat);
  }

  // Analyze each group
  for (const [key, threats] of threatGroups.entries()) {
    if (threats.length < 3) continue; // Need at least 3 examples

    const [type, level] = key.split(":") as [ThreatType, ThreatLevel];
    const blocked = threats.filter((t) => t.blocked).length;
    const blockedRate = blocked / threats.length;

    const existingPattern = threatPatterns.get(key);
    if (existingPattern) {
      // Update existing pattern
      existingPattern.frequency += threats.length;
      existingPattern.blockedRate = (existingPattern.blockedRate * (existingPattern.frequency - threats.length) + blockedRate * threats.length) / existingPattern.frequency;
      existingPattern.lastSeen = Date.now();
    } else {
      // Create new pattern
      const pattern: ThreatPattern = {
        id: `pattern:${Date.now()}:${Math.random().toString(36).substring(7)}`,
        threatType: type,
        threatLevel: level,
        frequency: threats.length,
        blockedRate,
        discoveredAt: Date.now(),
        lastSeen: Date.now(),
      };
      threatPatterns.set(key, pattern);
      newPatterns.push(pattern);
      console.log(`[ShieldLearner] Discovered threat pattern: ${type} (${level}) - blocked rate: ${(blockedRate * 100).toFixed(1)}%`);
    }
  }

  return newPatterns;
}

/**
 * Predict threat severity based on learned patterns
 */
export function predictThreatSeverity(threat: Threat): ThreatLevel {
  const pattern = threatPatterns.get(`${threat.type}:${threat.level}`);
  if (!pattern) return threat.level;

  // If pattern has low blocked rate, might be more severe
  if (pattern.blockedRate < 0.5 && threat.level !== "critical" && threat.level !== "extreme") {
    return threat.level === "low" ? "medium" : threat.level === "medium" ? "high" : "critical";
  }

  return threat.level;
}

/**
 * Get learned threat patterns
 */
export function getThreatPatterns(): ThreatPattern[] {
  return Array.from(threatPatterns.values());
}

/**
 * Get pattern for specific threat type/level
 */
export function getThreatPattern(type: ThreatType, level: ThreatLevel): ThreatPattern | undefined {
  return threatPatterns.get(`${type}:${level}`);
}

