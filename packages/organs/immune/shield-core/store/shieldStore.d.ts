import { ShieldLayer, ShieldPhase, ShieldModulator, ShieldEmitter, Threat, OffensiveSpike, ShieldStatus } from '../types.js';
export declare const ShieldStore: {
    createLayer(phase: ShieldPhase): ShieldLayer;
    getLayer(phase: ShieldPhase): ShieldLayer | undefined;
    updateLayer(phase: ShieldPhase, updates: Partial<ShieldLayer>): ShieldLayer | undefined;
    listLayers(): ShieldLayer[];
    listActiveLayers(): ShieldLayer[];
    addModulator(phase: ShieldPhase, modulator: ShieldModulator): ShieldModulator;
    getModulator(phase: ShieldPhase, modulatorId: string): ShieldModulator | undefined;
    updateModulator(phase: ShieldPhase, modulatorId: string, updates: Partial<ShieldModulator>): boolean;
    addEmitter(phase: ShieldPhase, emitter: ShieldEmitter): ShieldEmitter;
    getEmitter(phase: ShieldPhase, emitterId: string): ShieldEmitter | undefined;
    updateEmitter(phase: ShieldPhase, emitterId: string, updates: Partial<ShieldEmitter>): boolean;
    detectThreat(threat: Threat): Threat;
    getThreat(id: string): Threat | undefined;
    listThreats(): Threat[];
    listRecentThreats(limit?: number): Threat[];
    blockThreat(id: string): boolean;
    fireSpike(spike: OffensiveSpike): OffensiveSpike;
    listSpikes(): OffensiveSpike[];
    listRecentSpikes(limit?: number): OffensiveSpike[];
    setLastRunAt(ts: number | null): void;
    status(): ShieldStatus;
};
//# sourceMappingURL=shieldStore.d.ts.map