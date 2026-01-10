export type ShieldPhase = "alpha" | "beta" | "gamma" | "delta" | "epsilon" | "omega" | "cellular";
export type ThreatLevel = "low" | "medium" | "high" | "critical" | "extreme";
export type ThreatType = "intrusion" | "malware" | "ddos" | "exploit" | "data-exfiltration" | "unauthorized-access" | "api-abuse" | "spam" | "phishing" | "unknown";
export type CellType = "agent" | "pack" | "core" | "service" | "component" | "node";
export interface ShieldFrequency {
    phase: ShieldPhase;
    frequency: number;
    amplitude: number;
    rotationSpeed: number;
    lastRotation: number;
}
export interface ShieldModulator {
    id: string;
    phase: ShieldPhase;
    modulationType: "sine" | "square" | "triangle" | "pulse" | "chaos";
    frequency: number;
    amplitude: number;
    active: boolean;
    efficiency: number;
    lastUpdate: number;
}
export interface ShieldEmitter {
    id: string;
    phase: ShieldPhase;
    emissionType: "defensive" | "offensive" | "detection" | "countermeasure";
    power: number;
    range: number;
    active: boolean;
    targetThreatTypes: ThreatType[];
    lastEmission: number;
    emissionCount: number;
}
export interface ShieldLayer {
    phase: ShieldPhase;
    strength: number;
    frequency: ShieldFrequency;
    modulators: ShieldModulator[];
    emitters: ShieldEmitter[];
    active: boolean;
    integrity: number;
    lastBreach?: number;
    breachCount: number;
    createdAt: number;
    updatedAt: number;
}
export interface CellularShield {
    cellId: string;
    cellType: CellType;
    shieldStrength: number;
    frequency: number;
    integrity: number;
    lastUpdate: number;
    threatCount: number;
    blockedCount: number;
    wormholeConnected: boolean;
    wormholeId?: string;
    meta?: Record<string, any>;
}
export interface Threat {
    id: string;
    type: ThreatType;
    level: ThreatLevel;
    detectedAt: number;
    source?: string;
    target?: string;
    targetCellId?: string;
    payload?: Record<string, any>;
    blocked: boolean;
    blockedAt?: number;
    spikeFired?: boolean;
    spikeResult?: Record<string, any>;
    meta?: Record<string, any>;
}
export interface OffensiveSpike {
    id: string;
    name: string;
    type: "counter-attack" | "honeypot" | "rate-limit" | "block" | "redirect" | "trace";
    target: string;
    targetCellId?: string;
    power: number;
    firedAt?: number;
    result?: Record<string, any>;
    success: boolean;
    meta?: Record<string, any>;
}
export interface WormholeShieldSignal {
    id: string;
    signalType: "shield-update" | "threat-alert" | "frequency-sync" | "spike-command";
    sourcePhase: ShieldPhase;
    targetCells?: string[];
    payload: Record<string, any>;
    propagatedAt: number;
    propagationCount: number;
}
export interface ShieldStatus {
    lastRunAt: number | null;
    activeLayers: number;
    totalLayers: number;
    overallIntegrity: number;
    threatsDetected: number;
    threatsBlocked: number;
    spikesFired: number;
    activeModulators: number;
    activeEmitters: number;
    currentFrequencies: ShieldFrequency[];
    recentThreats: Threat[];
    recentSpikes: OffensiveSpike[];
    shieldHealth: "optimal" | "good" | "degraded" | "critical";
    cellularShieldCount: number;
    cellularShieldIntegrity: number;
    wormholeConnectedCells: number;
    recentWormholeSignals: WormholeShieldSignal[];
}
export interface ShieldContext {
    spiderWebCore?: any;
    neuralMesh?: any;
    narrativeField?: any;
    dreamNetOSCore?: any;
    eventWormholes?: any;
    agentRegistryCore?: any;
}
