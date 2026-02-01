export type ShieldPhase = "alpha" | "beta" | "gamma" | "delta" | "epsilon" | "omega" | "cellular";

export type ThreatLevel = "low" | "medium" | "high" | "critical" | "extreme";

export type ThreatType =
  | "intrusion"
  | "malware"
  | "ddos"
  | "exploit"
  | "data-exfiltration"
  | "unauthorized-access"
  | "api-abuse"
  | "spam"
  | "phishing"
  | "affective-mismatch"
  | "unknown";

export type AffectiveEmotion =
  | "resonance"
  | "dissonance"
  | "neutral"
  | "joy"
  | "fear"
  | "anticipation"
  | "trust";

export interface AffectiveGuardStatus {
  currentEmotion: AffectiveEmotion;
  resonanceScore: number;       // 0-1 (1 = perfect alignment with VibeConductor)
  lastVibeCheck: number;
}

export type Blockchain = "ethereum" | "base" | "arbitrum" | "optimism" | "solana";

export type CellType = "agent" | "pack" | "core" | "service" | "component" | "node";

export interface ShieldFrequency {
  phase: ShieldPhase;
  frequency: number;           // Hz (rotating frequency)
  amplitude: number;           // 0-1 strength
  rotationSpeed: number;       // How fast frequency rotates
  lastRotation: number;        // Timestamp of last rotation
}

export interface ShieldModulator {
  id: string;
  phase: ShieldPhase;
  modulationType: "sine" | "square" | "triangle" | "pulse" | "chaos" | "phase_shift" | "harmonic_resonance";
  frequency: number;
  amplitude: number;
  active: boolean;
  efficiency: number;          // 0-1 (how well it's working)
  lastUpdate: number;
}

export interface ShieldEmitter {
  id: string;
  phase: ShieldPhase;
  emissionType: "defensive" | "offensive" | "detection" | "countermeasure";
  power: number;               // 0-1 emission power
  range: number;               // Detection/emission range
  active: boolean;
  targetThreatTypes: ThreatType[];
  lastEmission: number;
  emissionCount: number;
}

export interface ShieldLayer {
  phase: ShieldPhase;
  strength: number;            // 0-1 overall strength
  frequency: ShieldFrequency;
  modulators: ShieldModulator[];
  emitters: ShieldEmitter[];
  active: boolean;
  integrity: number;           // 0-1 (100% = perfect, 0% = breached)
  lastBreach?: number;         // Timestamp of last breach
  breachCount: number;
  createdAt: number;
  updatedAt: number;
}

// Cellular-level shield
export interface CellularShield {
  cellId: string;              // ID of the cell (agent, pack, component)
  cellType: CellType;
  shieldStrength: number;      // 0-1 cellular shield strength
  frequency: number;           // Cellular frequency (synced with cellular phase)
  integrity: number;          // 0-1 cellular integrity
  lastUpdate: number;
  threatCount: number;        // Threats detected at this cell
  blockedCount: number;       // Threats blocked at this cell
  wormholeConnected: boolean; // Is this cell connected via wormhole?
  wormholeId?: string;        // Wormhole ID for this cell
  meta?: Record<string, any>;
}

export interface Threat {
  id: string;
  type: ThreatType;
  level: ThreatLevel;
  detectedAt: number;
  source?: string;             // IP, user agent, etc.
  target?: string;             // What it's targeting
  targetCellId?: string;       // Which cell was targeted
  payload?: Record<string, any>;
  blocked: boolean;
  blockedAt?: number;
  spikeFired?: boolean;        // Did we fire offensive spike?
  spikeResult?: Record<string, any>;
  meta?: Record<string, any>;
}

export interface OffensiveSpike {
  id: string;
  name: string;
  type: "counter-attack" | "honeypot" | "rate-limit" | "block" | "redirect" | "trace";
  target: string;
  targetCellId?: string;       // Which cell fired the spike
  power: number;                // 0-1 spike power
  firedAt?: number;
  result?: Record<string, any>;
  success: boolean;
  meta?: Record<string, any>;
}

// Wormhole shield propagation
export interface WormholeShieldSignal {
  id: string;
  signalType: "shield-update" | "threat-alert" | "frequency-sync" | "spike-command";
  sourcePhase: ShieldPhase;
  targetCells?: string[];      // Specific cells, or all if empty
  payload: Record<string, any>;
  propagatedAt: number;
  propagationCount: number;    // How many cells received this
}

export interface ShieldStatus {
  lastRunAt: number | null;
  activeLayers: number;
  totalLayers: number;
  overallIntegrity: number;    // 0-1 (average of all layers)
  threatsDetected: number;
  threatsBlocked: number;
  spikesFired: number;
  activeModulators: number;
  activeEmitters: number;
  currentFrequencies: ShieldFrequency[];
  recentThreats: Threat[];
  recentSpikes: OffensiveSpike[];
  shieldHealth: "optimal" | "good" | "degraded" | "critical";

  // Cellular metrics
  cellularShieldCount: number;
  cellularShieldIntegrity: number;  // Average integrity of all cells
  wormholeConnectedCells: number;
  recentWormholeSignals: WormholeShieldSignal[];
}

export interface ShieldContext {
  spiderWebCore?: any;         // For threat detection threads
  neuralMesh?: any;             // For threat pattern learning
  narrativeField?: any;         // For logging security events
  dreamNetOSCore?: any;         // For system health
  eventWormholes?: any;          // For cellular propagation
  agentRegistryCore?: any;      // For cell discovery
}
