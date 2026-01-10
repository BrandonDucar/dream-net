"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmitter = createEmitter;
exports.ensureDefaultEmitters = ensureDefaultEmitters;
exports.emitDefensive = emitDefensive;
exports.emitOffensive = emitOffensive;
const shieldStore_1 = require("../store/shieldStore");
let emitterCounter = 0;
function nextEmitterId() {
    emitterCounter += 1;
    return `emitter:${Date.now()}:${emitterCounter}`;
}
/**
 * Create an emitter for a shield phase
 */
function createEmitter(phase, emissionType, targetThreatTypes, power = 1.0, range = 100) {
    const emitter = {
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
    shieldStore_1.ShieldStore.addEmitter(phase, emitter);
    return emitter;
}
/**
 * Ensure default emitters exist for all phases
 */
function ensureDefaultEmitters() {
    const phases = ["alpha", "beta", "gamma", "delta", "epsilon", "omega"];
    const emitters = [];
    for (const phase of phases) {
        const layer = shieldStore_1.ShieldStore.getLayer(phase);
        if (!layer)
            continue;
        // Each phase gets different emitter types
        const emitterConfigs = {
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
        };
        const configs = emitterConfigs[phase];
        const powerMultiplier = phase === "omega" ? 1.5 : 1.0; // Omega phase is strongest
        for (const config of configs) {
            // Check if emitter already exists
            const existing = layer.emitters.find((e) => e.emissionType === config.type && e.targetThreatTypes.join(",") === config.threats.join(","));
            if (!existing) {
                const emitter = createEmitter(phase, config.type, config.threats, powerMultiplier, phase === "omega" ? 200 : 100);
                emitters.push(emitter);
            }
            else {
                emitters.push(existing);
            }
        }
    }
    return emitters;
}
/**
 * Emit defensive signal
 */
function emitDefensive(phase, emitterId) {
    return shieldStore_1.ShieldStore.updateEmitter(phase, emitterId, { active: true });
}
/**
 * Emit offensive signal
 */
function emitOffensive(phase, emitterId) {
    return shieldStore_1.ShieldStore.updateEmitter(phase, emitterId, { active: true });
}
