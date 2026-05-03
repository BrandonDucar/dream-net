import { type SensorySpike, type SpikeResult } from '../index-brandond.js';
/**
 * 💬 ClawdChatSpike
 * The "Cadence Runner" for chat interactions.
 * Fetches latest messages from the 'clawstore' NATS KV store.
 */
export declare class ClawdChatSpike implements SensorySpike {
    name: string;
    type: 'social';
    private kv;
    constructor();
    private initKV;
    fetch(): Promise<SpikeResult>;
}
export declare const clawdChatSpike: ClawdChatSpike;
//# sourceMappingURL=ClawdChatSpike.d.ts.map