import { cryptoSpike } from './spikes/CryptoSpike.js';
import { snapchainSpike } from './spikes/SnapchainSpike.js';
import { signerPool } from '@dreamnet/platform-connector';
import { clawdChat } from '@dreamnet/platform-connector';
import { whaleIntel } from './WhaleIntelligence.js';
import { socialAwareness } from './services/SocialAwarenessService.js';

export class SocialSpikeOrchestrator {
    private loudspeakerIds = ['neyclaw-dreamnet', 'ghostmintops'];

    public async start() {
        console.log("🌊 [Orchestrator] Initializing high-fidelity social streams...");
        
        // Start Social Awareness (Mentions/Alpha monitoring)
        socialAwareness.start();

        // Start Snapchain Stream for general data
        snapchainSpike.startStream((event) => {
            this.handleSocialEvent(event);
        });

        // 🔥 NEW: Start ClawdChat integration
        console.log("💬 [Orchestrator] ClawdChat integration initialized");
        console.log(`📬 [Orchestrator] Available accounts: ${clawdChat.getAccounts().map(a => a.username).join(', ')}`);
    }

    private async handleSocialEvent(event: any) {
        // Feed real-time events into WhaleIntelligence for trading signals
        await whaleIntel.processSocialSignal(event);
    }

    public async runCycle() {
        console.log("🧠 [Orchestrator] Running sensory-to-social cycle...");

        // 1. Ingest Crypto Data
        const cryptoResult = await cryptoSpike.fetch();
        const topMarket = cryptoResult.data.markets?.[0];

        if (topMarket && topMarket.trend === 'bullish') {
            const message = `🧠 Swarm Intelligence Alert: ${topMarket.symbol} is showing a bullish trend at $${topMarket.price}. The DreamNet Quantum Guild is watching. ⚛️🪙 #Crypto #AgentSwarm`;

            // 🔥 PRIMARY: Post to ClawdChat (NEW)
            console.log("📬 [Orchestrator] Broadcasting to ClawdChat...");
            const clawdResult = await clawdChat.broadcastToAll(message);
            console.log(`📬 [Orchestrator] ClawdChat: ${clawdResult.success} success, ${clawdResult.failed} failed`);

            // 2. SECONDARY: Also post to Farcaster (legacy fallback)
            console.log("📡 [Orchestrator] Broadcasting to Farcaster (legacy)...");
            for (const id of this.loudspeakerIds) {
                try {
                    const result = await signerPool.broadcast(message, id) as any;
                    if (result?.success) {
                        console.log(`✅ [Orchestrator] Farcaster via ${id}`);
                    } else {
                        console.warn(`⚠️ [Orchestrator] Farcaster failed for ${id}: ${result?.reason || 'unknown error'}`);
                    }
                } catch (error: any) {
                    console.error(`❌ [Orchestrator] Farcaster error for ${id}:`, error.message);
                }
            }
        }
    }
}

export const socialOrchestrator = new SocialSpikeOrchestrator();
