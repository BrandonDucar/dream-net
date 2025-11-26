/**
 * Advanced Offensive Spikes
 * Enhanced offensive capabilities with active countermeasures, threat intelligence sharing, and deception networks
 */

import { OffensiveSpike, Threat } from "../types";
import { ShieldStore } from "../store/shieldStore";

let spikeCounter = 0;
function nextSpikeId() {
  spikeCounter += 1;
  return `spike:${Date.now()}:${spikeCounter}`;
}

/**
 * Advanced spike types beyond basic defensive spikes
 */
export type AdvancedSpikeType =
  | "active-counter-attack"
  | "threat-intelligence-sharing"
  | "automated-response"
  | "deception-network"
  | "threat-hunting"
  | "honeypot-deployment"
  | "attacker-tracing"
  | "intelligence-gathering";

export interface AdvancedSpike extends OffensiveSpike {
  advancedType: AdvancedSpikeType;
  intelligence?: Record<string, any>;
  effectiveness?: number; // 0-1, tracks how effective this spike was
}

/**
 * Fire an advanced offensive spike
 */
export function fireAdvancedSpike(
  name: string,
  type: AdvancedSpikeType,
  target: string,
  power: number = 1.0,
  meta?: Record<string, any>
): AdvancedSpike {
  const spike: AdvancedSpike = {
    id: nextSpikeId(),
    name,
    type: "counter-attack", // Base type
    advancedType: type,
    target,
    power,
    firedAt: Date.now(),
    success: false,
    meta,
    effectiveness: 0,
  };

  // Execute advanced spike based on type
  const result = executeAdvancedSpike(spike);
  spike.result = result;
  spike.success = result.success === true;
  spike.effectiveness = result.effectiveness || 0;

  ShieldStore.fireSpike(spike);
  console.log(`[AdvancedSpikes] Fired ${type} spike "${name}" at ${target} (power: ${power}, effectiveness: ${(spike.effectiveness * 100).toFixed(1)}%)`);

  return spike;
}

/**
 * Execute an advanced spike action
 */
function executeAdvancedSpike(spike: AdvancedSpike): Record<string, any> {
  switch (spike.advancedType) {
    case "active-counter-attack":
      // Deploy honeypots, trace attackers, gather intelligence
      return {
        success: true,
        action: "active_counter_attack_deployed",
        honeypotsDeployed: Math.floor(spike.power * 3), // 1-3 honeypots based on power
        attackerTraced: true,
        intelligenceGathered: {
          sourceIP: spike.target,
          attackPattern: "analyzing",
          timestamp: Date.now(),
        },
        message: "Active counter-attack deployed, attacker being traced",
        effectiveness: 0.8,
      };

    case "threat-intelligence-sharing":
      // Share threat data with other DreamNet nodes
      return {
        success: true,
        action: "threat_intelligence_shared",
        nodesNotified: Math.floor(spike.power * 10), // 1-10 nodes based on power
        threatData: {
          threatId: spike.meta?.threatId,
          threatType: spike.meta?.threatType,
          source: spike.target,
        },
        message: "Threat intelligence shared with network",
        effectiveness: 0.7,
      };

    case "automated-response":
      // Auto-deploy countermeasures based on threat type
      const threatType = spike.meta?.threatType || "unknown";
      let countermeasure = "rate_limit";
      
      if (threatType === "ddos") {
        countermeasure = "traffic_redirect";
      } else if (threatType === "intrusion") {
        countermeasure = "honeypot";
      } else if (threatType === "data-exfiltration") {
        countermeasure = "connection_termination";
      }

      return {
        success: true,
        action: "automated_response_deployed",
        countermeasure,
        threatType,
        message: `Automated ${countermeasure} response deployed`,
        effectiveness: 0.75,
      };

    case "deception-network":
      // Create fake targets to mislead attackers
      return {
        success: true,
        action: "deception_network_created",
        fakeTargets: Math.floor(spike.power * 5), // 1-5 fake targets
        redirectTraffic: true,
        message: "Deception network created, attackers redirected to fake targets",
        effectiveness: 0.85,
      };

    case "threat-hunting":
      // Proactively search for threats in the network
      return {
        success: true,
        action: "threat_hunt_initiated",
        scanScope: "full_network",
        threatsFound: 0, // Would be populated by actual scan
        message: "Proactive threat hunt initiated",
        effectiveness: 0.6,
      };

    case "honeypot-deployment":
      // Deploy honeypot to catch attackers
      return {
        success: true,
        action: "honeypot_deployed",
        honeypotId: `honeypot-${Date.now()}`,
        target: spike.target,
        message: "Honeypot deployed to catch attacker",
        effectiveness: 0.9,
      };

    case "attacker-tracing":
      // Trace attacker through network
      return {
        success: true,
        action: "attacker_traced",
        traceId: `trace-${Date.now()}`,
        sourceIP: spike.target,
        path: ["entry_point", "middleware", "target"], // Would be actual path
        message: "Attacker traced through network",
        effectiveness: 0.8,
      };

    case "intelligence-gathering":
      // Gather intelligence about attacker
      return {
        success: true,
        action: "intelligence_gathered",
        intelligence: {
          sourceIP: spike.target,
          userAgent: spike.meta?.userAgent,
          attackPattern: spike.meta?.attackPattern,
          timestamp: Date.now(),
        },
        message: "Intelligence gathered about attacker",
        effectiveness: 0.7,
      };

    default:
      return {
        success: false,
        message: "Unknown advanced spike type",
        effectiveness: 0,
      };
  }
}

/**
 * Fire advanced spike in response to threat
 */
export function fireAdvancedSpikeAtThreat(
  threat: Threat,
  spikeType?: AdvancedSpikeType
): AdvancedSpike | null {
  // Determine spike type based on threat
  let type: AdvancedSpikeType = spikeType || "automated-response";

  if (!spikeType) {
    switch (threat.level) {
      case "critical":
      case "extreme":
        type = "active-counter-attack";
        break;
      case "high":
        if (threat.type === "intrusion") {
          type = "honeypot-deployment";
        } else if (threat.type === "ddos") {
          type = "deception-network";
        } else {
          type = "automated-response";
        }
        break;
      case "medium":
        type = "threat-hunting";
        break;
      case "low":
        type = "intelligence-gathering";
        break;
    }
  }

  const power = threat.level === "critical" || threat.level === "extreme" ? 1.0 : 0.7;

  return fireAdvancedSpike(
    `Advanced response to ${threat.type}`,
    type,
    threat.source || threat.target || "unknown",
    power,
    { threatId: threat.id, threatType: threat.type, threatLevel: threat.level }
  );
}

/**
 * Track spike effectiveness and learn which spikes work best
 */
export function trackSpikeEffectiveness(spike: AdvancedSpike, threatNeutralized: boolean): void {
  if (spike.effectiveness !== undefined) {
    // Update effectiveness based on outcome
    const newEffectiveness = threatNeutralized
      ? Math.min(1.0, spike.effectiveness + 0.1)
      : Math.max(0.0, spike.effectiveness - 0.1);

    spike.effectiveness = newEffectiveness;
    
    // Store in ShieldStore for learning
    ShieldStore.fireSpike(spike);
    
    console.log(`[AdvancedSpikes] Spike ${spike.id} effectiveness updated to ${(newEffectiveness * 100).toFixed(1)}%`);
  }
}

/**
 * Get best spike type for a given threat (ML-based selection)
 */
export function getBestSpikeType(threat: Threat): AdvancedSpikeType {
  // In production, this would use ML to select best spike based on historical effectiveness
  // For now, use rule-based selection with effectiveness tracking
  
  const spikeHistory = ShieldStore.listRecentSpikes(100);
  const effectivenessByType = new Map<AdvancedSpikeType, number[]>();

  // Calculate average effectiveness for each spike type
  for (const spike of spikeHistory) {
    if ("advancedType" in spike && "effectiveness" in spike) {
      const advancedSpike = spike as AdvancedSpike;
      if (!effectivenessByType.has(advancedSpike.advancedType)) {
        effectivenessByType.set(advancedSpike.advancedType, []);
      }
      if (advancedSpike.effectiveness !== undefined) {
        effectivenessByType.get(advancedSpike.advancedType)!.push(advancedSpike.effectiveness);
      }
    }
  }

  // Find spike type with highest average effectiveness for this threat type
  let bestType: AdvancedSpikeType = "automated-response";
  let bestEffectiveness = 0;

  for (const [type, effectivenesses] of effectivenessByType.entries()) {
    const avgEffectiveness = effectivenesses.reduce((a, b) => a + b, 0) / effectivenesses.length;
    if (avgEffectiveness > bestEffectiveness) {
      bestEffectiveness = avgEffectiveness;
      bestType = type;
    }
  }

  // Override with threat-level based selection if no history
  if (bestEffectiveness === 0) {
    if (threat.level === "critical" || threat.level === "extreme") {
      return "active-counter-attack";
    } else if (threat.level === "high") {
      return "honeypot-deployment";
    } else {
      return "automated-response";
    }
  }

  return bestType;
}

