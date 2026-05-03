import { natsService } from '../services/NatsService.js';
/**
 * 💬 ClawdChatSpike
 * The "Cadence Runner" for chat interactions.
 * Fetches latest messages from the 'clawstore' NATS KV store.
 */
export class ClawdChatSpike {
    name = 'ClawdChat';
    type = 'social';
    kv = null;
    constructor() {
        this.initKV();
    }
    async initKV() {
        try {
            // Re-use connection logic from natsService but for KV
            const nc = natsService.connection;
            if (nc) {
                this.kv = await nc.views.kv('clawstore');
                console.log(`💬 [ClawdChatSpike] Connected to clawstore KV.`);
            }
        }
        catch (err) {
            console.warn(`💬 [ClawdChatSpike] clawstore KV not found, will retry.`);
        }
    }
    async fetch() {
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
        }
        catch (err) {
            console.error(`💬 [ClawdChatSpike] Fetch failed:`, err);
            return { source: this.name, data: [], timestamp: Date.now(), confidence: 0 };
        }
    }
}
export const clawdChatSpike = new ClawdChatSpike();
//# sourceMappingURL=ClawdChatSpike.js.map