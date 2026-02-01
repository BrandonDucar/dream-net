/**
 * THE BIO-CORE PROTOCOL (The DNA of DreamNet)
 *
 * Grand Unification Theory (GUT) Level 1
 * "The Server is a Car. The Code is DNA."
 */
export type BioSignalType = 'TELEMETRY' | 'OBSERVATION' | 'MUTATION' | 'DELTA';
export interface BioEvent<T = any> {
    id: string;
    timestamp: number;
    organ: string;
    type: BioSignalType;
    signal: T;
    confidence: number;
    entropy: number;
    source: string;
}
export interface Homeostasis {
    health: number;
    stability: number;
    mode: 'GROWTH' | 'DEFENSE' | 'RECOVERY' | 'HIBERNATION';
}
export interface BioProvider {
    getSnapshot(): Homeostasis;
    stream(): AsyncGenerator<BioEvent>;
}
//# sourceMappingURL=bio-core.d.ts.map