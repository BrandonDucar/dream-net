"use strict";
/**
 * Webhook Nervous Core
 * Biomimetic webhook management system inspired by biological systems
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookNervousCore = void 0;
// Nervous System
const nervousSystem_1 = require("./logic/nervousSystem");
// Immune System
const immuneSystem_1 = require("./logic/immuneSystem");
// Mycelium Network
const myceliumNetwork_1 = require("./logic/myceliumNetwork");
// Ant Colony
const antColony_1 = require("./logic/antColony");
// Auto-Discovery
const webhookAutoDiscoverer_1 = require("./logic/webhookAutoDiscoverer");
exports.WebhookNervousCore = {
    // ===== NERVOUS SYSTEM =====
    createNeuron: nervousSystem_1.createNeuron,
    createSynapse: nervousSystem_1.createSynapse,
    fireNeuron: nervousSystem_1.fireNeuron,
    createReflexArc: nervousSystem_1.createReflexArc,
    checkReflexArcs: nervousSystem_1.checkReflexArcs,
    getNeurons: nervousSystem_1.getNeurons,
    getSynapses: nervousSystem_1.getSynapses,
    getReflexArcs: nervousSystem_1.getReflexArcs,
    getNeuron: nervousSystem_1.getNeuron,
    healNeurons: nervousSystem_1.healNeurons,
    // ===== IMMUNE SYSTEM =====
    createAntibody: immuneSystem_1.createAntibody,
    detectAntigens: immuneSystem_1.detectAntigens,
    neutralizeAntigen: immuneSystem_1.neutralizeAntigen,
    getAntigens: immuneSystem_1.getAntigens,
    getAntibodies: immuneSystem_1.getAntibodies,
    getMemoryCells: immuneSystem_1.getMemoryCells,
    decayMemoryCells: immuneSystem_1.decayMemoryCells,
    // ===== MYCELIUM NETWORK =====
    createHypha: myceliumNetwork_1.createHypha,
    createMycelium: myceliumNetwork_1.createMycelium,
    findOptimalPath: myceliumNetwork_1.findOptimalPath,
    healHyphae: myceliumNetwork_1.healHyphae,
    findAlternativePath: myceliumNetwork_1.findAlternativePath,
    getHyphae: myceliumNetwork_1.getHyphae,
    getMycelia: myceliumNetwork_1.getMycelia,
    updateHyphaLoad: myceliumNetwork_1.updateHyphaLoad,
    // ===== ANT COLONY =====
    createPheromoneTrail: antColony_1.createPheromoneTrail,
    createAnt: antColony_1.createAnt,
    findBestTrail: antColony_1.findBestTrail,
    followTrail: antColony_1.followTrail,
    completeAnt: antColony_1.completeAnt,
    evaporateTrails: antColony_1.evaporateTrails,
    getPheromoneTrails: antColony_1.getPheromoneTrails,
    getActiveAnts: antColony_1.getActiveAnts,
    getStuckAnts: antColony_1.getStuckAnts,
    markAntStuck: antColony_1.markAntStuck,
    // ===== SYSTEM STATUS =====
    status() {
        const neurons = (0, nervousSystem_1.getNeurons)();
        const synapses = (0, nervousSystem_1.getSynapses)();
        const reflexArcs = (0, nervousSystem_1.getReflexArcs)();
        const antigens = (0, immuneSystem_1.getAntigens)();
        const antibodies = (0, immuneSystem_1.getAntibodies)();
        const memoryCells = (0, immuneSystem_1.getMemoryCells)();
        const hyphae = (0, myceliumNetwork_1.getHyphae)();
        const mycelia = (0, myceliumNetwork_1.getMycelia)();
        const pheromoneTrails = (0, antColony_1.getPheromoneTrails)();
        const activeAnts = (0, antColony_1.getActiveAnts)();
        const neuronStats = {
            total: neurons.length,
            active: neurons.filter((n) => n.status === "active").length,
            inactive: neurons.filter((n) => n.status === "inactive").length,
            damaged: neurons.filter((n) => n.status === "damaged").length,
            healing: neurons.filter((n) => n.status === "healing").length,
        };
        const synapseStats = {
            total: synapses.length,
            active: synapses.filter((s) => s.strength > 0.1).length,
            strong: synapses.filter((s) => s.strength > 0.7).length,
            weak: synapses.filter((s) => s.strength < 0.3).length,
        };
        const reflexStats = {
            total: reflexArcs.length,
            enabled: reflexArcs.filter((r) => r.enabled).length,
            triggered: reflexArcs.filter((r) => r.lastTriggered && Date.now() - r.lastTriggered < 3600000).length,
        };
        const immuneStats = {
            antigens: antigens.length,
            antibodies: antibodies.length,
            memoryCells: memoryCells.length,
            neutralizedThreats: antigens.filter((a) => a.neutralized).length,
        };
        const myceliumStats = {
            networks: mycelia.size,
            totalHyphae: hyphae.length,
            healthyPaths: hyphae.filter((h) => h.health > 80).length,
            alternativePaths: hyphae.reduce((sum, h) => sum + h.alternativePaths.length, 0),
        };
        const antStats = {
            activeAnts: activeAnts.length,
            completedAnts: 0, // Would need to track
            pheromoneTrails: pheromoneTrails.length,
            averageLatency: pheromoneTrails.length > 0
                ? pheromoneTrails.reduce((sum, t) => sum + t.latency, 0) / pheromoneTrails.length
                : 0,
        };
        // Calculate overall health
        const neuronHealth = neurons.length > 0
            ? neurons.reduce((sum, n) => sum + n.health, 0) / neurons.length
            : 100;
        const hyphaHealth = hyphae.length > 0
            ? hyphae.reduce((sum, h) => sum + h.health, 0) / hyphae.length
            : 100;
        const overallHealth = (neuronHealth + hyphaHealth) / 2;
        return {
            neurons: neuronStats,
            synapses: synapseStats,
            reflexArcs: reflexStats,
            immuneSystem: immuneStats,
            mycelium: myceliumStats,
            antColony: antStats,
            health: overallHealth,
            lastUpdate: Date.now(),
        };
    },
    // ===== AUTO-DISCOVERY (ZERO-TOUCH) =====
    autoDiscoverWebhooks: webhookAutoDiscoverer_1.autoDiscoverAllWebhooks,
    autoCreateDefaultAntibodies: webhookAutoDiscoverer_1.autoCreateDefaultAntibodies,
    // ===== MAINTENANCE CYCLE =====
    runMaintenanceCycle() {
        // Auto-discover new webhooks
        (0, webhookAutoDiscoverer_1.autoDiscoverAllWebhooks)();
        // Heal damaged neurons
        (0, nervousSystem_1.healNeurons)();
        // Heal damaged hyphae
        (0, myceliumNetwork_1.healHyphae)();
        // Evaporate pheromone trails
        (0, antColony_1.evaporateTrails)();
        // Decay memory cells
        (0, immuneSystem_1.decayMemoryCells)();
        // Check for stuck ants
        const stuckAnts = (0, antColony_1.getStuckAnts)();
        stuckAnts.forEach((ant) => (0, antColony_1.markAntStuck)(ant.id));
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.WebhookNervousCore;
