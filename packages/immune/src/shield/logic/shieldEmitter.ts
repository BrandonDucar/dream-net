import { ShieldEmitter, ShieldPhase, ThreatType } from '../types.js';
import { ShieldStore } from '../store/shieldStore.js';

let emitterCounter = 0;
function nextEmitterId() {
  emitterCounter += 1;
  return `emitter:${Date.now()}:${emitterCounter}`;
}

/**
 * Create an emitter for a shield phase
 */
export function createEmitter(
  phase: ShieldPhase,
  emissionType: ShieldEmitter["emissionType"],
  targetThreatTypes: ThreatType[],
  power: number = 1.0,
  range: number = 100
): ShieldEmitter {
  const emitter: ShieldEmitter = {
    id: nextEmitterId(),
    phase,
    emissionType,
    power,
    range,
    active: true,
    targetThreatTypes,
    lastEmission: Date.now(),
    emissionCount: 0,
  };

  ShieldStore.addEmitter(phase, emitter);
  return emitter;
}

/**
 * Ensure default emitters exist for all phases
 */
export function ensureDefaultEmitters(): ShieldEmitter[] {
  const phases: ShieldPhase[] = ["alpha", "beta", "gamma", "delta", "epsilon", "omega", "cellular"];
  const emitters: ShieldEmitter[] = [];

  for (const phase of phases) {
    const layer = ShieldStore.getLayer(phase);
    if (!layer) continue;

    // Each phase gets different emitter types
    const emitterConfigs: Record<ShieldPhase, Array<{ type: ShieldEmitter["emissionType"]; threats: ThreatType[] }>> = {
      alpha: [
        { type: "detection", threats: ["intrusion", "unauthorized-access"] },
        { type: "defensive", threats: ["spam", "phishing"] },
      ],
      beta: [
        { type: "detection", threats: ["malware", "exploit"] },
        { type: "defensive", threats: ["ddos", "api-abuse"] },
      ],
      gamma: [
        { type: "detection", threats: ["data-exfiltration"] },
        { type: "countermeasure", threats: ["intrusion", "exploit"] },
      ],
      delta: [
        { type: "offensive", threats: ["intrusion", "malware"] },
        { type: "countermeasure", threats: ["ddos", "api-abuse"] },
      ],
      epsilon: [
        { type: "offensive", threats: ["data-exfiltration", "unauthorized-access"] },
        { type: "defensive", threats: ["malware", "exploit"] },
      ],
      omega: [
        { type: "offensive", threats: ["intrusion", "malware", "ddos", "exploit", "data-exfiltration"] },
        { type: "countermeasure", threats: ["intrusion", "malware", "ddos", "exploit", "data-exfiltration"] },
        { type: "detection", threats: ["intrusion", "malware", "ddos", "exploit", "data-exfiltration", "unauthorized-access"] },
      ],
      cellular: [
        { type: "detection", threats: ["intrusion", "unauthorized-access", "api-abuse"] },
        { type: "defensive", threats: ["intrusion", "unauthorized-access", "api-abuse"] },
      ],
    };

    const configs = emitterConfigs[phase];
    const powerMultiplier = phase === "omega" ? 1.5 : 1.0; // Omega phase is strongest

    for (const config of configs) {
      // Check if emitter already exists
      const existing = layer.emitters.find(
        (e) => e.emissionType === config.type && e.targetThreatTypes.join(",") === config.threats.join(",")
      );
      if (!existing) {
        const emitter = createEmitter(
          phase,
          config.type,
          config.threats,
          powerMultiplier,
          phase === "omega" ? 200 : 100
        );
        emitters.push(emitter);
      } else {
        emitters.push(existing);
      }
    }
  }

  return emitters;
}

/**
 * Emit defensive signal
 */
export function emitDefensive(phase: ShieldPhase, emitterId: string): boolean {
  return ShieldStore.updateEmitter(phase, emitterId, { active: true });
}

/**
 * Emit offensive signal
 */
export function emitOffensive(phase: ShieldPhase, emitterId: string): boolean {
  return ShieldStore.updateEmitter(phase, emitterId, { active: true });
}

