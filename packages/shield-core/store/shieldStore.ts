import {
  ShieldLayer,
  ShieldPhase,
  ShieldFrequency,
  ShieldModulator,
  ShieldEmitter,
  Threat,
  ThreatType,
  ThreatLevel,
  OffensiveSpike,
  ShieldStatus,
} from "../types";

const layers: Map<ShieldPhase, ShieldLayer> = new Map();
const threats: Map<string, Threat> = new Map();
const spikes: OffensiveSpike[] = [];

let lastRunAt: number | null = null;

let threatCounter = 0;
function nextThreatId() {
  threatCounter += 1;
  return `threat:${Date.now()}:${threatCounter}`;
}

let spikeCounter = 0;
function nextSpikeId() {
  spikeCounter += 1;
  return `spike:${Date.now()}:${spikeCounter}`;
}

export const ShieldStore = {
  // Shield Layers
  createLayer(phase: ShieldPhase): ShieldLayer {
    const now = Date.now();
    const frequency: ShieldFrequency = {
      phase,
      frequency: generateInitialFrequency(phase),
      amplitude: 1.0,
      rotationSpeed: getRotationSpeedForPhase(phase),
      lastRotation: now,
    };

    const layer: ShieldLayer = {
      phase,
      strength: 1.0,
      frequency,
      modulators: [],
      emitters: [],
      active: true,
      integrity: 1.0,
      breachCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    layers.set(phase, layer);
    return layer;
  },

  getLayer(phase: ShieldPhase): ShieldLayer | undefined {
    return layers.get(phase);
  },

  updateLayer(phase: ShieldPhase, updates: Partial<ShieldLayer>): ShieldLayer | undefined {
    const layer = layers.get(phase);
    if (!layer) return undefined;

    const updated = { ...layer, ...updates, updatedAt: Date.now() };
    layers.set(phase, updated);
    return updated;
  },

  listLayers(): ShieldLayer[] {
    return Array.from(layers.values());
  },

  listActiveLayers(): ShieldLayer[] {
    return Array.from(layers.values()).filter((l) => l.active);
  },

  // Modulators
  addModulator(phase: ShieldPhase, modulator: ShieldModulator): ShieldModulator {
    const layer = layers.get(phase);
    if (!layer) throw new Error(`Layer ${phase} does not exist`);

    layer.modulators.push(modulator);
    layers.set(phase, layer);
    return modulator;
  },

  getModulator(phase: ShieldPhase, modulatorId: string): ShieldModulator | undefined {
    const layer = layers.get(phase);
    return layer?.modulators.find((m) => m.id === modulatorId);
  },

  updateModulator(phase: ShieldPhase, modulatorId: string, updates: Partial<ShieldModulator>): boolean {
    const layer = layers.get(phase);
    if (!layer) return false;

    const modulator = layer.modulators.find((m) => m.id === modulatorId);
    if (!modulator) return false;

    Object.assign(modulator, updates, { lastUpdate: Date.now() });
    layers.set(phase, layer);
    return true;
  },

  // Emitters
  addEmitter(phase: ShieldPhase, emitter: ShieldEmitter): ShieldEmitter {
    const layer = layers.get(phase);
    if (!layer) throw new Error(`Layer ${phase} does not exist`);

    layer.emitters.push(emitter);
    layers.set(phase, layer);
    return emitter;
  },

  getEmitter(phase: ShieldPhase, emitterId: string): ShieldEmitter | undefined {
    const layer = layers.get(phase);
    return layer?.emitters.find((e) => e.id === emitterId);
  },

  updateEmitter(phase: ShieldPhase, emitterId: string, updates: Partial<ShieldEmitter>): boolean {
    const layer = layers.get(phase);
    if (!layer) return false;

    const emitter = layer.emitters.find((e) => e.id === emitterId);
    if (!emitter) return false;

    Object.assign(emitter, updates, { lastEmission: Date.now() });
    if (updates.active && emitter.active) {
      emitter.emissionCount += 1;
    }
    layers.set(phase, layer);
    return true;
  },

  // Threats
  detectThreat(threat: Threat): Threat {
    threats.set(threat.id, threat);
    return threat;
  },

  getThreat(id: string): Threat | undefined {
    return threats.get(id);
  },

  listThreats(): Threat[] {
    return Array.from(threats.values());
  },

  listRecentThreats(limit: number = 50): Threat[] {
    return Array.from(threats.values())
      .sort((a, b) => b.detectedAt - a.detectedAt)
      .slice(0, limit);
  },

  blockThreat(id: string): boolean {
    const threat = threats.get(id);
    if (!threat) return false;

    threat.blocked = true;
    threat.blockedAt = Date.now();
    threats.set(id, threat);
    return true;
  },

  // Spikes
  fireSpike(spike: OffensiveSpike): OffensiveSpike {
    spikes.push(spike);
    if (spikes.length > 1000) {
      spikes.shift();
    }
    return spike;
  },

  listSpikes(): OffensiveSpike[] {
    return spikes;
  },

  listRecentSpikes(limit: number = 50): OffensiveSpike[] {
    return spikes.slice(-limit).reverse();
  },

  // Status
  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  status(): ShieldStatus {
    const allLayers = Array.from(layers.values());
    const activeLayers = allLayers.filter((l) => l.active);
    const overallIntegrity = allLayers.length > 0
      ? allLayers.reduce((sum, l) => sum + l.integrity, 0) / allLayers.length
      : 1.0;

    const allThreats = Array.from(threats.values());
    const threatsDetected = allThreats.length;
    const threatsBlocked = allThreats.filter((t) => t.blocked).length;

    const allModulators = allLayers.flatMap((l) => l.modulators);
    const activeModulators = allModulators.filter((m) => m.active).length;

    const allEmitters = allLayers.flatMap((l) => l.emitters);
    const activeEmitters = allEmitters.filter((e) => e.active).length;

    const spikesFired = spikes.length;

    const currentFrequencies = allLayers.map((l) => l.frequency);

    const recentThreats = this.listRecentThreats(20);
    const recentSpikes = this.listRecentSpikes(20);

    // Determine shield health
    let shieldHealth: ShieldStatus["shieldHealth"] = "optimal";
    if (overallIntegrity < 0.5) {
      shieldHealth = "critical";
    } else if (overallIntegrity < 0.7) {
      shieldHealth = "degraded";
    } else if (overallIntegrity < 0.9) {
      shieldHealth = "good";
    }

    // Get cellular stats (using direct import to avoid circular deps)
    let cellularStats = { totalCells: 0, wormholeConnected: 0, avgIntegrity: 1.0, totalThreats: 0, totalBlocked: 0 };
    let wormholeSignals: any[] = [];
    
    try {
      // Use require for synchronous access
      const { getCellularShieldStats, getRecentWormholeSignals } = require("../logic/cellularShield");
      cellularStats = getCellularShieldStats();
      wormholeSignals = getRecentWormholeSignals(20);
    } catch (err) {
      // Module not available, use defaults
    }

    return {
      lastRunAt,
      activeLayers: activeLayers.length,
      totalLayers: allLayers.length,
      overallIntegrity,
      threatsDetected,
      threatsBlocked,
      spikesFired,
      activeModulators,
      activeEmitters,
      currentFrequencies,
      recentThreats,
      recentSpikes,
      shieldHealth,
      cellularShieldCount: cellularStats.totalCells,
      cellularShieldIntegrity: cellularStats.avgIntegrity,
      wormholeConnectedCells: cellularStats.wormholeConnected,
      recentWormholeSignals: wormholeSignals,
    };
  },
};

// Helper functions
function generateInitialFrequency(phase: ShieldPhase): number {
  // Each phase gets a different base frequency range
  const baseFrequencies: Record<ShieldPhase, number> = {
    alpha: 1000,    // 1 kHz
    beta: 2000,    // 2 kHz
    gamma: 3000,   // 3 kHz
    delta: 4000,   // 4 kHz
    epsilon: 5000, // 5 kHz
    omega: 10000,  // 10 kHz (master frequency)
    cellular: 15000, // 15 kHz (cellular layer)
  };
  return baseFrequencies[phase] + Math.random() * 100; // Add some randomness
}

function getRotationSpeedForPhase(phase: ShieldPhase): number {
  // Faster rotation = harder to predict
  const speeds: Record<ShieldPhase, number> = {
    alpha: 1000,    // Rotate every 1 second
    beta: 800,      // Rotate every 0.8 seconds
    gamma: 600,     // Rotate every 0.6 seconds
    delta: 400,     // Rotate every 0.4 seconds
    epsilon: 200,   // Rotate every 0.2 seconds
    omega: 100,     // Rotate every 0.1 seconds (fastest)
    cellular: 50,   // Rotate every 0.05 seconds (ultra-fast for cellular)
  };
  return speeds[phase];
}

