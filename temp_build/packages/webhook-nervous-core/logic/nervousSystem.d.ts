/**
 * Nervous System Logic
 * Central coordination like a biological nervous system
 */
import type { WebhookNeuron, WebhookSynapse, ReflexArc, WebhookEvent } from "../types";
/**
 * Create a new neuron (webhook endpoint)
 */
export declare function createNeuron(name: string, url: string, type: WebhookNeuron["type"], options?: {
    threshold?: number;
    adaptation?: number;
    neurotransmitter?: "excitatory" | "inhibitory";
}): WebhookNeuron;
/**
 * Create a synapse (connection between neurons)
 */
export declare function createSynapse(sourceNeuronId: string, targetNeuronId: string, type?: "excitatory" | "inhibitory", strength?: number): WebhookSynapse;
/**
 * Fire a neuron (send webhook)
 */
export declare function fireNeuron(neuronId: string, payload: any, options?: {
    strength?: number;
    followSynapses?: boolean;
}): Promise<WebhookEvent>;
/**
 * Create a reflex arc (automatic response)
 */
export declare function createReflexArc(name: string, trigger: ReflexArc["trigger"], response: ReflexArc["response"], priority?: ReflexArc["priority"]): ReflexArc;
/**
 * Check reflex arcs for automatic responses
 */
export declare function checkReflexArcs(event: WebhookEvent): ReflexArc[];
/**
 * Get all neurons
 */
export declare function getNeurons(): WebhookNeuron[];
/**
 * Get all synapses
 */
export declare function getSynapses(): WebhookSynapse[];
/**
 * Get all reflex arcs
 */
export declare function getReflexArcs(): ReflexArc[];
/**
 * Get neuron by ID
 */
export declare function getNeuron(id: string): WebhookNeuron | undefined;
/**
 * Heal damaged neurons (automatic recovery)
 */
export declare function healNeurons(): void;
