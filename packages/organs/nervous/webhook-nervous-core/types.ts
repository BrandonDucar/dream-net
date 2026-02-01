/**
 * Webhook Nervous Core - Biomimetic Webhook Management System
 * Inspired by biological nervous systems, immune systems, and mycelium networks
 */

// ===== NERVOUS SYSTEM ANALOGY =====
// Central Nervous System (CNS) = Webhook Orchestrator
// Peripheral Nervous System (PNS) = Webhook Endpoints
// Synapses = Webhook Connections
// Reflex Arcs = Auto-Responses
// Neurons = Webhook Nodes

export interface WebhookNeuron {
  id: string;
  name: string;
  url: string;
  type: "sensory" | "motor" | "interneuron"; // Sensory = incoming, Motor = outgoing, Interneuron = routing
  status: "active" | "inactive" | "damaged" | "healing";
  health: number; // 0-100
  latency: number; // ms
  successRate: number; // 0-1
  lastFired: number | null;
  synapseCount: number; // Number of connections
  neurotransmitter: "excitatory" | "inhibitory"; // Excitatory = triggers action, Inhibitory = blocks action
  threshold: number; // Minimum signal strength to fire
  adaptation: number; // How quickly it adapts to patterns (0-1)
  memory: WebhookMemory[];
  createdAt: number;
  updatedAt: number;
}

export interface WebhookSynapse {
  id: string;
  sourceNeuronId: string;
  targetNeuronId: string;
  strength: number; // 0-1, like synaptic strength
  type: "excitatory" | "inhibitory";
  plasticity: number; // Ability to strengthen/weaken based on use (0-1)
  lastUsed: number | null;
  successCount: number;
  failureCount: number;
  latency: number;
  createdAt: number;
}

export interface WebhookMemory {
  id: string;
  pattern: string; // Pattern that triggered this memory
  response: any;
  success: boolean;
  timestamp: number;
  strength: number; // Memory strength (decays over time)
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
  pattern?: string; // Regex or pattern match
  event?: string; // Event name
  condition?: Record<string, any>; // Condition object
  schedule?: string; // Cron expression
}

export interface WebhookResponse {
  type: "fire" | "block" | "transform" | "route" | "chain";
  targetNeuronId?: string;
  transform?: (data: any) => any;
  chain?: string[]; // Chain of neurons to fire
  delay?: number; // Delay before firing
}

// ===== IMMUNE SYSTEM ANALOGY =====
// Antigens = Webhook Threats/Errors
// Antibodies = Webhook Validators/Security
// Memory Cells = Pattern Recognition
// Phagocytes = Error Cleanup

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
  pattern: string; // Pattern it recognizes
  action: "block" | "quarantine" | "transform" | "alert";
  effectiveness: number; // 0-1
  memory: boolean; // Whether it creates memory cells
  createdAt: number;
}

export interface WebhookMemoryCell {
  id: string;
  antigenId: string;
  pattern: string;
  response: any;
  strength: number; // Memory strength
  createdAt: number;
  lastActivated: number;
}

// ===== MYCELIUM NETWORK ANALOGY =====
// Hyphae = Webhook Paths
// Mycelium = Webhook Network
// Fruiting Bodies = Webhook Endpoints
// Nutrient Flow = Data Flow

export interface WebhookHypha {
  id: string;
  sourceId: string;
  targetId: string;
  strength: number; // Path strength
  latency: number;
  capacity: number; // Max throughput
  currentLoad: number;
  health: number;
  alternativePaths: string[]; // Backup paths
  createdAt: number;
}

export interface WebhookMycelium {
  id: string;
  name: string;
  neurons: string[]; // Neuron IDs in this network
  hyphae: string[]; // Hypha IDs
  health: number;
  throughput: number; // Total data flow
  resilience: number; // Ability to reroute
  createdAt: number;
}

// ===== ANT COLONY ANALOGY =====
// Pheromone Trails = Webhook Paths
// Ants = Webhook Requests
// Colony = Webhook System
// Foraging = Webhook Discovery

export interface PheromoneTrail {
  id: string;
  path: string[]; // Sequence of neuron IDs
  strength: number; // Pheromone strength (decays over time)
  successRate: number;
  latency: number;
  lastUsed: number;
  evaporationRate: number; // How quickly it decays
  createdAt: number;
}

export interface WebhookAnt {
  id: string;
  requestId: string;
  payload: any;
  currentPath: string[]; // Current route
  destination: string; // Target neuron ID
  status: "foraging" | "returning" | "stuck" | "completed";
  pheromoneTrailId?: string; // Trail it's following
  startedAt: number;
  completedAt?: number;
}

// ===== SYSTEM STATUS =====

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
    strong: number; // High strength synapses
    weak: number; // Low strength synapses
  };
  reflexArcs: {
    total: number;
    enabled: number;
    triggered: number; // In last hour
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
  health: number; // Overall system health 0-100
  lastUpdate: number;
}

// ===== WEBHOOK EVENT =====

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
  synapsePath?: string[]; // Path taken through synapses
  pheromoneTrailId?: string;
}

