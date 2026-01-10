import { ShieldModulator, ShieldPhase, ShieldLayer } from '../types.js';
import { ShieldStore } from '../store/shieldStore.js';

let modulatorCounter = 0;
function nextModulatorId() {
  modulatorCounter += 1;
  return `modulator:${Date.now()}:${modulatorCounter}`;
}

/**
 * Create a modulator for a shield phase
 */
export function createModulator(
  phase: ShieldPhase,
  modulationType: ShieldModulator["modulationType"],
  frequency: number,
  amplitude: number = 1.0
): ShieldModulator {
  const modulator: ShieldModulator = {
    id: nextModulatorId(),
    phase,
    modulationType,
    frequency,
    amplitude,
    active: true,
    efficiency: 1.0,
    lastUpdate: Date.now(),
  };

  ShieldStore.addModulator(phase, modulator);
  return modulator;
}

/**
 * Ensure default modulators exist for all phases
 */
export function ensureDefaultModulators(): ShieldModulator[] {
  const phases: ShieldPhase[] = ["alpha", "beta", "gamma", "delta", "epsilon", "omega", "cellular"];
  const modulators: ShieldModulator[] = [];

  for (const phase of phases) {
    const layer = ShieldStore.getLayer(phase);
    if (!layer) continue;

    // Each phase gets different modulation types
    const modulationTypes: Record<ShieldPhase, ShieldModulator["modulationType"][]> = {
      alpha: ["sine", "square"],
      beta: ["triangle", "pulse"],
      gamma: ["sine", "chaos"],
      delta: ["square", "pulse"],
      epsilon: ["triangle", "chaos"],
      omega: ["chaos", "pulse"],
      cellular: ["sine", "pulse"],
    };

    const types = modulationTypes[phase];
    const baseFreq = getBaseFrequencyForPhase(phase);

    for (const type of types) {
      // Check if modulator already exists
      const existing = layer.modulators.find((m) => m.modulationType === type);
      if (!existing) {
        const modulator = createModulator(phase, type, baseFreq, 1.0);
        modulators.push(modulator);
      } else {
        modulators.push(existing);
      }
    }
  }

  return modulators;
}

/**
 * Update modulator efficiency based on performance
 */
export function updateModulatorEfficiency(
  phase: ShieldPhase,
  modulatorId: string,
  efficiency: number
): boolean {
  return ShieldStore.updateModulator(phase, modulatorId, { efficiency });
}

/**
 * Get base frequency for phase
 */
function getBaseFrequencyForPhase(phase: ShieldPhase): number {
  const baseFrequencies: Record<ShieldPhase, number> = {
    alpha: 1000,
    beta: 2000,
    gamma: 3000,
    delta: 4000,
    epsilon: 5000,
    omega: 10000,
    cellular: 15000,
  };
  return baseFrequencies[phase];
}

