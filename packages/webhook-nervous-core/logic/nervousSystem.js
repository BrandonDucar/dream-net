/**
 * Nervous System Logic
 * Central coordination like a biological nervous system
 */
let neurons = new Map();
let synapses = new Map();
let reflexArcs = [];
let neuronCounter = 0;
let synapseCounter = 0;
function nextNeuronId() {
    neuronCounter += 1;
    return `neuron:${Date.now()}:${neuronCounter}`;
}
function nextSynapseId() {
    synapseCounter += 1;
    return `synapse:${Date.now()}:${synapseCounter}`;
}
/**
 * Create a new neuron (webhook endpoint)
 */
export function createNeuron(name, url, type, options) {
    const now = Date.now();
    const neuron = {
        id: nextNeuronId(),
        name,
        url,
        type,
        status: "active",
        health: 100,
        latency: 0,
        successRate: 1.0,
        lastFired: null,
        synapseCount: 0,
        neurotransmitter: options?.neurotransmitter || "excitatory",
        threshold: options?.threshold || 0.5,
        adaptation: options?.adaptation || 0.1,
        memory: [],
        createdAt: now,
        updatedAt: now,
    };
    neurons.set(neuron.id, neuron);
    return neuron;
}
/**
 * Create a synapse (connection between neurons)
 */
export function createSynapse(sourceNeuronId, targetNeuronId, type = "excitatory", strength = 0.5) {
    const source = neurons.get(sourceNeuronId);
    const target = neurons.get(targetNeuronId);
    if (!source || !target) {
        throw new Error("Source or target neuron not found");
    }
    const synapse = {
        id: nextSynapseId(),
        sourceNeuronId,
        targetNeuronId,
        strength: Math.max(0, Math.min(1, strength)),
        type,
        plasticity: 0.1, // Can strengthen/weaken
        lastUsed: null,
        successCount: 0,
        failureCount: 0,
        latency: 0,
        createdAt: Date.now(),
    };
    synapses.set(synapse.id, synapse);
    source.synapseCount += 1;
    target.synapseCount += 1;
    return synapse;
}
/**
 * Fire a neuron (send webhook)
 */
export async function fireNeuron(neuronId, payload, options) {
    const neuron = neurons.get(neuronId);
    if (!neuron) {
        throw new Error(`Neuron ${neuronId} not found`);
    }
    const strength = options?.strength || 1.0;
    const now = Date.now();
    // Check threshold
    if (strength < neuron.threshold) {
        return {
            id: `event:${now}`,
            neuronId,
            type: "outgoing",
            payload,
            status: "blocked",
            timestamp: now,
            error: "Signal strength below threshold",
        };
    }
    // Fire the webhook
    const startTime = Date.now();
    let status = "processing";
    let error;
    let latency;
    try {
        const response = await fetch(neuron.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Webhook-Neuron": neuronId,
                "X-Webhook-Signal-Strength": strength.toString(),
            },
            body: JSON.stringify(payload),
        });
        latency = Date.now() - startTime;
        if (!response.ok) {
            status = "failed";
            error = `HTTP ${response.status}`;
            neuron.successRate = neuron.successRate * 0.95; // Decay success rate
        }
        else {
            status = "completed";
            neuron.successRate = Math.min(1.0, neuron.successRate + 0.01); // Improve success rate
        }
        // Update neuron stats
        neuron.lastFired = now;
        neuron.latency = (neuron.latency * 0.9) + (latency * 0.1); // Moving average
        neuron.health = Math.min(100, neuron.health + 1);
        neuron.updatedAt = now;
        // Strengthen synapses that led here
        if (options?.followSynapses) {
            strengthenSynapses(neuronId, status === "completed");
        }
    }
    catch (err) {
        latency = Date.now() - startTime;
        status = "failed";
        error = err.message;
        neuron.successRate = neuron.successRate * 0.9;
        neuron.health = Math.max(0, neuron.health - 5);
    }
    const event = {
        id: `event:${now}`,
        neuronId,
        type: neuron.type === "sensory" ? "incoming" : "outgoing",
        payload,
        status,
        latency,
        error,
        timestamp: now,
    };
    // Store in memory if successful
    if (status === "completed" && neuron.adaptation > 0) {
        addMemory(neuron, payload, true);
    }
    return event;
}
/**
 * Strengthen synapses based on success/failure (Hebbian plasticity)
 */
function strengthenSynapses(neuronId, success) {
    for (const synapse of synapses.values()) {
        if (synapse.targetNeuronId === neuronId) {
            if (success) {
                // Strengthen successful synapses
                synapse.strength = Math.min(1.0, synapse.strength + synapse.plasticity * 0.1);
                synapse.successCount += 1;
            }
            else {
                // Weaken failed synapses
                synapse.strength = Math.max(0, synapse.strength - synapse.plasticity * 0.05);
                synapse.failureCount += 1;
            }
            synapse.lastUsed = Date.now();
        }
    }
}
/**
 * Add memory to neuron (pattern recognition)
 */
function addMemory(neuron, pattern, success) {
    const memory = {
        id: `memory:${Date.now()}`,
        pattern: JSON.stringify(pattern),
        response: success,
        timestamp: Date.now(),
        strength: 1.0,
    };
    neuron.memory.push(memory);
    // Keep only recent memories (last 100)
    if (neuron.memory.length > 100) {
        neuron.memory = neuron.memory.slice(-100);
    }
    // Decay old memories
    const now = Date.now();
    neuron.memory = neuron.memory.map((m) => {
        const age = now - m.timestamp;
        const decayRate = 0.0001; // Decay per ms
        m.strength = Math.max(0, m.strength - age * decayRate);
        return m;
    }).filter((m) => m.strength > 0.1); // Remove weak memories
}
/**
 * Create a reflex arc (automatic response)
 */
export function createReflexArc(name, trigger, response, priority = "medium") {
    const reflex = {
        id: `reflex:${Date.now()}`,
        name,
        trigger,
        response,
        priority,
        enabled: true,
        successRate: 1.0,
        lastTriggered: null,
        triggerCount: 0,
        createdAt: Date.now(),
    };
    reflexArcs.push(reflex);
    return reflex;
}
/**
 * Check reflex arcs for automatic responses
 */
export function checkReflexArcs(event) {
    const triggered = [];
    for (const reflex of reflexArcs) {
        if (!reflex.enabled)
            continue;
        let shouldTrigger = false;
        switch (reflex.trigger.type) {
            case "pattern":
                if (reflex.trigger.pattern) {
                    const patternStr = JSON.stringify(event.payload);
                    shouldTrigger = new RegExp(reflex.trigger.pattern).test(patternStr);
                }
                break;
            case "event":
                if (reflex.trigger.event) {
                    shouldTrigger = event.type === reflex.trigger.event;
                }
                break;
            case "condition":
                if (reflex.trigger.condition) {
                    shouldTrigger = evaluateCondition(event.payload, reflex.trigger.condition);
                }
                break;
        }
        if (shouldTrigger) {
            triggered.push(reflex);
            reflex.lastTriggered = Date.now();
            reflex.triggerCount += 1;
        }
    }
    // Sort by priority
    return triggered.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
}
function evaluateCondition(payload, condition) {
    for (const [key, value] of Object.entries(condition)) {
        if (payload[key] !== value) {
            return false;
        }
    }
    return true;
}
/**
 * Get all neurons
 */
export function getNeurons() {
    return Array.from(neurons.values());
}
/**
 * Get all synapses
 */
export function getSynapses() {
    return Array.from(synapses.values());
}
/**
 * Get all reflex arcs
 */
export function getReflexArcs() {
    return reflexArcs;
}
/**
 * Get neuron by ID
 */
export function getNeuron(id) {
    return neurons.get(id);
}
/**
 * Heal damaged neurons (automatic recovery)
 */
export function healNeurons() {
    const now = Date.now();
    for (const neuron of neurons.values()) {
        if (neuron.status === "damaged" || neuron.status === "healing") {
            // Gradually heal
            neuron.health = Math.min(100, neuron.health + 1);
            if (neuron.health >= 80) {
                neuron.status = "active";
            }
            else if (neuron.health >= 50) {
                neuron.status = "healing";
            }
            neuron.updatedAt = now;
        }
    }
}
