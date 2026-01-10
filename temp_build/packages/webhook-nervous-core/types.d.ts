/**
 * Webhook Nervous Core - Biomimetic Webhook Management System
 * Inspired by biological nervous systems, immune systems, and mycelium networks
 */
export interface WebhookNeuron {
    id: string;
    name: string;
    url: string;
    type: "sensory" | "motor" | "interneuron";
    status: "active" | "inactive" | "damaged" | "healing";
    health: number;
    latency: number;
    successRate: number;
    lastFired: number | null;
    synapseCount: number;
    neurotransmitter: "excitatory" | "inhibitory";
    threshold: number;
    adaptation: number;
    memory: WebhookMemory[];
    createdAt: number;
    updatedAt: number;
}
export interface WebhookSynapse {
    id: string;
    sourceNeuronId: string;
    targetNeuronId: string;
    strength: number;
    type: "excitatory" | "inhibitory";
    plasticity: number;
    lastUsed: number | null;
    successCount: number;
    failureCount: number;
    latency: number;
    createdAt: number;
}
export interface WebhookMemory {
    id: string;
    pattern: string;
    response: any;
    success: boolean;
    timestamp: number;
    strength: number;
}
export interface ReflexArc {
    id: string;
    name: string;
    trigger: WebhookTrigger;
    response: WebhookResponse;
    priority: "low" | "medium" | "high" | "critical";
    enabled: boolean;
    successRate: number;
    lastTriggered: number | null;
    triggerCount: number;
    createdAt: number;
}
export interface WebhookTrigger {
    type: "pattern" | "event" | "condition" | "schedule";
    pattern?: string;
    event?: string;
    condition?: Record<string, any>;
    schedule?: string;
}
export interface WebhookResponse {
    type: "fire" | "block" | "transform" | "route" | "chain";
    targetNeuronId?: string;
    transform?: (data: any) => any;
    chain?: string[];
    delay?: number;
}
export interface WebhookAntigen {
    id: string;
    type: "malicious" | "malformed" | "rate_limit" | "timeout" | "error";
    pattern: string;
    severity: "low" | "medium" | "high" | "critical";
    detectedAt: number;
    neutralized: boolean;
    neutralizedAt?: number;
}
export interface WebhookAntibody {
    id: string;
    name: string;
    pattern: string;
    action: "block" | "quarantine" | "transform" | "alert";
    effectiveness: number;
    memory: boolean;
    createdAt: number;
}
export interface WebhookMemoryCell {
    id: string;
    antigenId: string;
    pattern: string;
    response: any;
    strength: number;
    createdAt: number;
    lastActivated: number;
}
export interface WebhookHypha {
    id: string;
    sourceId: string;
    targetId: string;
    strength: number;
    latency: number;
    capacity: number;
    currentLoad: number;
    health: number;
    alternativePaths: string[];
    createdAt: number;
}
export interface WebhookMycelium {
    id: string;
    name: string;
    neurons: string[];
    hyphae: string[];
    health: number;
    throughput: number;
    resilience: number;
    createdAt: number;
}
export interface PheromoneTrail {
    id: string;
    path: string[];
    strength: number;
    successRate: number;
    latency: number;
    lastUsed: number;
    evaporationRate: number;
    createdAt: number;
}
export interface WebhookAnt {
    id: string;
    requestId: string;
    payload: any;
    currentPath: string[];
    destination: string;
    status: "foraging" | "returning" | "stuck" | "completed";
    pheromoneTrailId?: string;
    startedAt: number;
    completedAt?: number;
}
export interface NervousSystemStatus {
    neurons: {
        total: number;
        active: number;
        inactive: number;
        damaged: number;
        healing: number;
    };
    synapses: {
        total: number;
        active: number;
        strong: number;
        weak: number;
    };
    reflexArcs: {
        total: number;
        enabled: number;
        triggered: number;
    };
    immuneSystem: {
        antigens: number;
        antibodies: number;
        memoryCells: number;
        neutralizedThreats: number;
    };
    mycelium: {
        networks: number;
        totalHyphae: number;
        healthyPaths: number;
        alternativePaths: number;
    };
    antColony: {
        activeAnts: number;
        completedAnts: number;
        pheromoneTrails: number;
        averageLatency: number;
    };
    health: number;
    lastUpdate: number;
}
export interface WebhookEvent {
    id: string;
    neuronId: string;
    type: "incoming" | "outgoing" | "internal";
    payload: any;
    headers?: Record<string, string>;
    status: "pending" | "processing" | "completed" | "failed" | "blocked";
    latency?: number;
    error?: string;
    timestamp: number;
    synapsePath?: string[];
    pheromoneTrailId?: string;
}
