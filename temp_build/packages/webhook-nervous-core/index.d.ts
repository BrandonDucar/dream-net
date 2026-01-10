/**
 * Webhook Nervous Core
 * Biomimetic webhook management system inspired by biological systems
 */
import type { NervousSystemStatus } from "./types";
import { createNeuron, createSynapse, fireNeuron, createReflexArc, checkReflexArcs, getNeurons, getSynapses, getReflexArcs, getNeuron, healNeurons } from "./logic/nervousSystem";
import { createAntibody, detectAntigens, neutralizeAntigen, getAntigens, getAntibodies, getMemoryCells, decayMemoryCells } from "./logic/immuneSystem";
import { createHypha, createMycelium, findOptimalPath, healHyphae, findAlternativePath, getHyphae, getMycelia, updateHyphaLoad } from "./logic/myceliumNetwork";
import { createPheromoneTrail, createAnt, findBestTrail, followTrail, completeAnt, evaporateTrails, getPheromoneTrails, getActiveAnts, getStuckAnts, markAntStuck } from "./logic/antColony";
import { autoDiscoverAllWebhooks, autoCreateDefaultAntibodies } from "./logic/webhookAutoDiscoverer";
export declare const WebhookNervousCore: {
    createNeuron: typeof createNeuron;
    createSynapse: typeof createSynapse;
    fireNeuron: typeof fireNeuron;
    createReflexArc: typeof createReflexArc;
    checkReflexArcs: typeof checkReflexArcs;
    getNeurons: typeof getNeurons;
    getSynapses: typeof getSynapses;
    getReflexArcs: typeof getReflexArcs;
    getNeuron: typeof getNeuron;
    healNeurons: typeof healNeurons;
    createAntibody: typeof createAntibody;
    detectAntigens: typeof detectAntigens;
    neutralizeAntigen: typeof neutralizeAntigen;
    getAntigens: typeof getAntigens;
    getAntibodies: typeof getAntibodies;
    getMemoryCells: typeof getMemoryCells;
    decayMemoryCells: typeof decayMemoryCells;
    createHypha: typeof createHypha;
    createMycelium: typeof createMycelium;
    findOptimalPath: typeof findOptimalPath;
    healHyphae: typeof healHyphae;
    findAlternativePath: typeof findAlternativePath;
    getHyphae: typeof getHyphae;
    getMycelia: typeof getMycelia;
    updateHyphaLoad: typeof updateHyphaLoad;
    createPheromoneTrail: typeof createPheromoneTrail;
    createAnt: typeof createAnt;
    findBestTrail: typeof findBestTrail;
    followTrail: typeof followTrail;
    completeAnt: typeof completeAnt;
    evaporateTrails: typeof evaporateTrails;
    getPheromoneTrails: typeof getPheromoneTrails;
    getActiveAnts: typeof getActiveAnts;
    getStuckAnts: typeof getStuckAnts;
    markAntStuck: typeof markAntStuck;
    status(): NervousSystemStatus;
    autoDiscoverWebhooks: typeof autoDiscoverAllWebhooks;
    autoCreateDefaultAntibodies: typeof autoCreateDefaultAntibodies;
    runMaintenanceCycle(): void;
};
export * from "./types";
export default WebhookNervousCore;
