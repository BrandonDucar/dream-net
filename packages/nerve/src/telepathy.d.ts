/**
 * @file telepathy.ts
 * @module @dreamnet/nerve/telepathy
 * @description The "Nerves" of DreamNet.
 * Implements the Zero-Copy communication layer (replacing JSON with Binary).
 * Currently prototyped for FlatBuffers/Cap'n Proto integration.
 */
export type TelepathySignal = {
    id: string;
    sender: string;
    recipient: string;
    timestamp: number;
    priority: 'reflex' | 'thought' | 'dream';
    payload: Uint8Array;
    meta?: Record<string, string>;
};
/**
 * The TelepathyHub manages the high-speed binary nervous system.
 */
export declare class TelepathyHub {
    private static instance;
    private neurons;
    private constructor();
    static getInstance(): TelepathyHub;
    /**
     * Connect a synapse (listener) to the hub.
     */
    connect(agentId: string, callback: (signal: TelepathySignal) => void): void;
    /**
     * Transmit a signal using "Instant Telepathy" (Direct Memory Access simulation).
     */
    transmit(signal: Omit<TelepathySignal, 'id' | 'timestamp'>): void;
    /**
     * ENCODE: Helper to turn detailed objects into binary (Mock for now)
     */
    encode(data: any): Uint8Array;
    /**
     * DECODE: Helper to turn binary back into thought
     */
    decode<T>(data: Uint8Array): T;
}
export declare const Telepathy: TelepathyHub;
//# sourceMappingURL=telepathy.d.ts.map