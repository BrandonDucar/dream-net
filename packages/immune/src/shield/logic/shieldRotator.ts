import { ShieldLayer, ShieldFrequency, ShieldPhase } from '../types.js';
import { ShieldStore } from '../store/shieldStore.js';

/**
 * Rotate shield frequencies to prevent pattern detection
 */
export function rotateShieldFrequencies(): void {
  const layers = ShieldStore.listActiveLayers();
  const now = Date.now();

  for (const layer of layers) {
    const frequency = layer.frequency;
    const timeSinceRotation = now - frequency.lastRotation;
    const rotationInterval = frequency.rotationSpeed;

    // Time to rotate?
    if (timeSinceRotation >= rotationInterval) {
      // Rotate frequency
      const baseFrequency = getBaseFrequencyForPhase(layer.phase);
      const variation = (Math.random() - 0.5) * 200; // ±100 Hz variation
      frequency.frequency = baseFrequency + variation;
      frequency.lastRotation = now;

      // Slight amplitude modulation for extra security
      frequency.amplitude = 0.9 + Math.random() * 0.1; // 0.9-1.0

      // Update layer
      ShieldStore.updateLayer(layer.phase, { frequency });

      console.log(`[ShieldRotator] Rotated ${layer.phase} shield frequency to ${frequency.frequency.toFixed(2)} Hz`);
    }
  }
}

/**
 * Get base frequency for a phase
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

/**
 * Ensure all shield phases exist
 */
export function ensureShieldPhases(): ShieldLayer[] {
  const phases: ShieldPhase[] = ["alpha", "beta", "gamma", "delta", "epsilon", "omega", "cellular"];
  const existingLayers = ShieldStore.listLayers();

  if (existingLayers.length === phases.length) {
    return existingLayers;
  }

  const createdLayers: ShieldLayer[] = [];

  for (const phase of phases) {
    const existing = ShieldStore.getLayer(phase);
    if (!existing) {
      const layer = ShieldStore.createLayer(phase);
      createdLayers.push(layer);
      console.log(`[ShieldRotator] Created ${phase} shield layer`);
    } else {
      createdLayers.push(existing);
    }
  }

  return createdLayers;
}

