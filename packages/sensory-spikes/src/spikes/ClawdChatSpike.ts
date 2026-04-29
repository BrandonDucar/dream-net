import { type SensorySpike, type SpikeResult } from '../index-brandond.js';
import { natsService } from '../../../../server/services/NatsService.js';
import { connect, type KV } from 'nats';

/**
 * 💬 ClawdChatSpike
 * The "Cadence Runner" for chat interactions.
 * Fetches latest messages from the 'clawstore' NATS KV store.
 */
export class ClawdChatSpike implements SensorySpike {
    name = 'ClawdChat';
    type: 'social' = 'social';
    private kv: KV | null = null;

    constructor() {
        this.initKV();
    }

    private async initKV() {
        try {
            // Re-use connection logic from natsService but for KV
            const nc = (natsService as any).connection;
            if (nc) {
                this.kv = await nc.views.kv('clawstore');
                console.log(`💬 [ClawdChatSpike] Connected to clawstore KV.`);
            }
        } catch (err) {
            console.warn(`💬 [ClawdChatSpike] clawstore KV not found, will retry.`);
        }
    }

    async fetch(): Promise<SpikeResult> {
        if (!this.kv) {
            await this.initKV();
            if (!this.kv) {
                return { source: this.name, data: [], timestamp: Date.now(), confidence: 0 };
            }
        }

        try {
            // Get all keys or a specific 'latest_chat' key
            const entry = await this.kv.get('latest_chat');
            const data = entry ? JSON.parse(entry.string()) : [];
            
            return {
                source: this.name,
                data,
                timestamp: Date.now(),
                confidence: 1.0
            };
        } catch (err) {
            console.error(`💬 [ClawdChatSpike] Fetch failed:`, err);
            return { source: this.name, data: [], timestamp: Date.now(), confidence: 0 };
        }
    }
}

export const clawdChatSpike = new ClawdChatSpike();
