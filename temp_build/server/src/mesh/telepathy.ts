/**
 * @file telepathy.ts
 * @module mesh/telepathy
 * @description The "Nerves" of DreamNet.
 * Implements the Zero-Copy communication layer (replacing JSON with Binary).
 * Currently prototyped for FlatBuffers/Cap'n Proto integration.
 */

import { randomUUID } from 'crypto';

// Types for the Telepathic Signal
export type TelepathySignal = {
    id: string;
    sender: string;
    recipient: string;
    timestamp: number;
    priority: 'reflex' | 'thought' | 'dream'; // High, Mid, Low
    payload: Uint8Array; // Binary payload (FlatBuffer)
    meta?: Record<string, string>;
};

/**
 * The TelepathyHub manages the high-speed binary nervous system.
 */
export class TelepathyHub {
    private static instance: TelepathyHub;
    private neurons: Map<string, (signal: TelepathySignal) => void> = new Map();

    private constructor() {
        console.log('[Telepathy] 🧠 Universal Nervous System Initialized.');
    }

    public static getInstance(): TelepathyHub {
        if (!TelepathyHub.instance) {
            TelepathyHub.instance = new TelepathyHub();
        }
        return TelepathyHub.instance;
    }

    /**
     * Connect a synapse (listener) to the hub.
     */
    public connect(agentId: string, callback: (signal: TelepathySignal) => void) {
        this.neurons.set(agentId, callback);
        console.log(`[Telepathy] 🔌 Synapse connected: ${agentId}`);
    }

    /**
     * Transmit a signal using "Instant Telepathy" (Direct Memory Access simulation).
     */
    public transmit(signal: Omit<TelepathySignal, 'id' | 'timestamp'>) {
        const fullSignal: TelepathySignal = {
            ...signal,
            id: randomUUID(),
            timestamp: Date.now(),
        };

        // 1. Log the impulse
        // console.log(`[Telepathy] ⚡ Signal: ${signal.sender} -> ${signal.recipient} [${signal.priority}]`);

        // 2. Direct Synapse Fire (Local)
        const recipientSynapse = this.neurons.get(signal.recipient);
        if (recipientSynapse) {
            // Immediate execution (Reflex)
            recipientSynapse(fullSignal);
        } else {
            // Store in cosmic buffer? Or drop?
            console.warn(`[Telepathy] ⚠️ Signal lost. Recipient ${signal.recipient} not found.`);
        }
    }

    /**
     * ENCODE: Helper to turn detailed objects into binary (Mock for now)
     */
    public encode(data: any): Uint8Array {
        // TODO: Replace with flatbuffers.encode(data)
        const str = JSON.stringify(data);
        return new TextEncoder().encode(str);
    }

    /**
     * DECODE: Helper to turn binary back into thought
     */
    public decode<T>(data: Uint8Array): T {
        // TODO: Replace with flatbuffers.decode(data)
        const str = new TextDecoder().decode(data);
        return JSON.parse(str) as T;
    }
}

// Export the Singleton Instance
export const Telepathy = TelepathyHub.getInstance();
