"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotateShieldFrequencies = rotateShieldFrequencies;
exports.ensureShieldPhases = ensureShieldPhases;
const shieldStore_1 = require("../store/shieldStore");
/**
 * Rotate shield frequencies to prevent pattern detection
 */
function rotateShieldFrequencies() {
    const layers = shieldStore_1.ShieldStore.listActiveLayers();
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
            shieldStore_1.ShieldStore.updateLayer(layer.phase, { frequency });
            console.log(`[ShieldRotator] Rotated ${layer.phase} shield frequency to ${frequency.frequency.toFixed(2)} Hz`);
        }
    }
}
/**
 * Get base frequency for a phase
 */
function getBaseFrequencyForPhase(phase) {
    const baseFrequencies = {
        alpha: 1000,
        beta: 2000,
        gamma: 3000,
        delta: 4000,
        epsilon: 5000,
        omega: 10000,
    };
    return baseFrequencies[phase];
}
/**
 * Ensure all shield phases exist
 */
function ensureShieldPhases() {
    const phases = ["alpha", "beta", "gamma", "delta", "epsilon", "omega"];
    const existingLayers = shieldStore_1.ShieldStore.listLayers();
    if (existingLayers.length === phases.length) {
        return existingLayers;
    }
    const createdLayers = [];
    for (const phase of phases) {
        const existing = shieldStore_1.ShieldStore.getLayer(phase);
        if (!existing) {
            const layer = shieldStore_1.ShieldStore.createLayer(phase);
            createdLayers.push(layer);
            console.log(`[ShieldRotator] Created ${phase} shield layer`);
        }
        else {
            createdLayers.push(existing);
        }
    }
    return createdLayers;
}
