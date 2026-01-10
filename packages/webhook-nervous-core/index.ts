/**
 * Webhook Nervous Core
 * Biomimetic webhook management system inspired by biological systems
 */

import type {
  WebhookNeuron,
  WebhookSynapse,
  ReflexArc,
  WebhookEvent,
  NervousSystemStatus,
} from './types.js';

// Nervous System
import {
  createNeuron,
  createSynapse,
  fireNeuron,
  createReflexArc,
  checkReflexArcs,
  getNeurons,
  getSynapses,
  getReflexArcs,
  getNeuron,
  healNeurons,
} from './logic/nervousSystem.js';

// Immune System
import {
  createAntibody,
  detectAntigens,
  neutralizeAntigen,
  getAntigens,
  getAntibodies,
  getMemoryCells,
  decayMemoryCells,
} from './logic/immuneSystem.js';

// Mycelium Network
import {
  createHypha,
  createMycelium,
  findOptimalPath,
  healHyphae,
  findAlternativePath,
  getHyphae,
  getMycelia,
  updateHyphaLoad,
} from './logic/myceliumNetwork.js';

// Ant Colony
import {
  createPheromoneTrail,
  createAnt,
  findBestTrail,
  followTrail,
  completeAnt,
  evaporateTrails,
  getPheromoneTrails,
  getActiveAnts,
  getStuckAnts,
  markAntStuck,
} from './logic/antColony.js';

// Auto-Discovery
import {
  autoDiscoverAllWebhooks,
  autoCreateDefaultAntibodies,
} from './logic/webhookAutoDiscoverer.js';

export const WebhookNervousCore = {
  // ===== NERVOUS SYSTEM =====
  createNeuron,
  createSynapse,
  fireNeuron,
  createReflexArc,
  checkReflexArcs,
  getNeurons,
  getSynapses,
  getReflexArcs,
  getNeuron,
  healNeurons,

  // ===== IMMUNE SYSTEM =====
  createAntibody,
  detectAntigens,
  neutralizeAntigen,
  getAntigens,
  getAntibodies,
  getMemoryCells,
  decayMemoryCells,

  // ===== MYCELIUM NETWORK =====
  createHypha,
  createMycelium,
  findOptimalPath,
  healHyphae,
  findAlternativePath,
  getHyphae,
  getMycelia,
  updateHyphaLoad,

  // ===== ANT COLONY =====
  createPheromoneTrail,
  createAnt,
  findBestTrail,
  followTrail,
  completeAnt,
  evaporateTrails,
  getPheromoneTrails,
  getActiveAnts,
  getStuckAnts,
  markAntStuck,

  // ===== SYSTEM STATUS =====
  status(): NervousSystemStatus {
    const neurons = getNeurons();
    const synapses = getSynapses();
    const reflexArcs = getReflexArcs();
    const antigens = getAntigens();
    const antibodies = getAntibodies();
    const memoryCells = getMemoryCells();
    const hyphae = getHyphae();
    const mycelia = getMycelia();
    const pheromoneTrails = getPheromoneTrails();
    const activeAnts = getActiveAnts();

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
      triggered: reflexArcs.filter(
        (r) => r.lastTriggered && Date.now() - r.lastTriggered < 3600000
      ).length,
    };

    const immuneStats = {
      antigens: antigens.length,
      antibodies: antibodies.length,
      memoryCells: memoryCells.length,
      neutralizedThreats: antigens.filter((a) => a.neutralized).length,
    };

    const myceliumStats = {
      networks: mycelia.length,
      totalHyphae: hyphae.length,
      healthyPaths: hyphae.filter((h) => h.health > 80).length,
      alternativePaths: hyphae.reduce((sum, h) => sum + h.alternativePaths.length, 0),
    };

    const antStats = {
      activeAnts: activeAnts.length,
      completedAnts: 0, // Would need to track
      pheromoneTrails: pheromoneTrails.length,
      averageLatency:
        pheromoneTrails.length > 0
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
  autoDiscoverWebhooks: autoDiscoverAllWebhooks,
  autoCreateDefaultAntibodies,

  // ===== MAINTENANCE CYCLE =====
  runMaintenanceCycle() {
    // Auto-discover new webhooks
    autoDiscoverAllWebhooks();

    // Heal damaged neurons
    healNeurons();

    // Heal damaged hyphae
    healHyphae();

    // Evaporate pheromone trails
    evaporateTrails();

    // Decay memory cells
    decayMemoryCells();

    // Check for stuck ants
    const stuckAnts = getStuckAnts();
    stuckAnts.forEach((ant) => markAntStuck(ant.id));
  },
};

export * from './types.js';
export default WebhookNervousCore;

