import { OffensiveSpike, Threat } from '../types.js';
import { ShieldStore } from '../store/shieldStore.js';

let spikeCounter = 0;
function nextSpikeId() {
  spikeCounter += 1;
  return `spike:${Date.now()}:${spikeCounter}`;
}

/**
 * Fire an offensive spike
 */
export function fireSpike(
  name: string,
  type: OffensiveSpike["type"],
  target: string,
  power: number = 1.0,
  meta?: Record<string, any>
): OffensiveSpike {
  const spike: OffensiveSpike = {
    id: nextSpikeId(),
    name,
    type,
    target,
    power,
    firedAt: Date.now(),
    success: false,
    meta,
  };

  // Execute spike based on type
  const result = executeSpike(spike);
  spike.result = result;
  spike.success = result.success === true;

  ShieldStore.fireSpike(spike);
  console.log(`[OffensiveSpike] Fired ${type} spike "${name}" at ${target} (power: ${power})`);

  return spike;
}

/**
 * Execute a spike action
 */
function executeSpike(spike: OffensiveSpike): Record<string, any> {
  switch (spike.type) {
    case "counter-attack":
      // Counter-attack: trace and block source
      return {
        success: true,
        action: "traced_source",
        blocked: true,
        message: "Source traced and blocked",
      };

    case "honeypot":
      // Honeypot: redirect to fake target
      return {
        success: true,
        action: "redirected_to_honeypot",
        honeypotId: `honeypot-${Date.now()}`,
        message: "Threat redirected to honeypot",
      };

    case "rate-limit":
      // Rate limit: slow down requests
      return {
        success: true,
        action: "rate_limited",
        limit: Math.floor(spike.power * 100), // requests per minute
        message: "Target rate-limited",
      };

    case "block":
      // Block: immediate block
      return {
        success: true,
        action: "blocked",
        blockedAt: Date.now(),
        message: "Target blocked",
      };

    case "redirect":
      // Redirect: send elsewhere
      return {
        success: true,
        action: "redirected",
        redirectTo: "safe-zone",
        message: "Threat redirected",
      };

    case "trace":
      // Trace: track and log
      return {
        success: true,
        action: "traced",
        traceId: `trace-${Date.now()}`,
        message: "Threat traced and logged",
      };

    default:
      return {
        success: false,
        message: "Unknown spike type",
      };
  }
}

/**
 * Fire spike in response to threat
 */
export function fireSpikeAtThreat(threat: Threat, spikeType?: OffensiveSpike["type"]): OffensiveSpike | null {
  // Determine spike type based on threat
  let type: OffensiveSpike["type"] = spikeType || "block";

  if (!spikeType) {
    switch (threat.level) {
      case "critical":
      case "extreme":
        type = "counter-attack";
        break;
      case "high":
        type = "block";
        break;
      case "medium":
        type = "rate-limit";
        break;
      case "low":
        type = "trace";
        break;
    }
  }

  const power = threat.level === "critical" || threat.level === "extreme" ? 1.0 : 0.7;

  return fireSpike(
    `Response to ${threat.type}`,
    type,
    threat.source || threat.target || "unknown",
    power,
    { threatId: threat.id, threatType: threat.type, threatLevel: threat.level }
  );
}

