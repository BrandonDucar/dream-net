/**
 * THE BIO-CORE PROTOCOL (The DNA of DreamNet)
 * 
 * Grand Unification Theory (GUT) Level 1
 * "The Server is a Car. The Code is DNA."
 */

export type BioSignalType = 'TELEMETRY' | 'OBSERVATION' | 'MUTATION' | 'DELTA';

export interface BioEvent<T = any> {
    id: string;             // Unique Molecular ID
    timestamp: number;      // Universal Time
    organ: string;          // "Engine", "JobSite", "ServerMesh"
    type: BioSignalType;    // The kind of signal
    signal: T;              // The Payload (RPM, Wall Move, Error Rate)
    confidence: number;     // 0.0 - 1.0 (Truth Weight)
    entropy: number;        // 0.0 - 1.0 (Risk/Chaos Level)
    source: string;         // "VSCE", "ChangeOS", "EvolutionEngine"
}

export interface Homeostasis {
    health: number;         // 0-100 (Overall Integrity)
    stability: number;      // 0.0-1.0 (Confidence Average)
    mode: 'GROWTH' | 'DEFENSE' | 'RECOVERY' | 'HIBERNATION';
}

export interface BioProvider {
    getSnapshot(): Homeostasis;
    stream(): AsyncGenerator<BioEvent>;
}
