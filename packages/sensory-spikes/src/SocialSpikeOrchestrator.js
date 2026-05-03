import { cryptoSpike } from './spikes/CryptoSpike.js';
import { signerPool } from '../../platform-connector/src/index.js';
export class SocialSpikeOrchestrator {
    loudspeakerIds = ['neyclaw-dreamnet', 'ghostmintops'];
    async runCycle() {
        console.log("🧠 [Orchestrator] Running sensory-to-social cycle...");
        // 1. Ingest Crypto Data
        const cryptoResult = await cryptoSpike.fetch();
        const topMarket = cryptoResult.data.markets?.[0];
        if (topMarket && topMarket.trend === 'bullish') {
            const message = `🧠 Swarm Intelligence Alert: ${topMarket.symbol} is showing a bullish trend at $${topMarket.price}. The DreamNet Quantum Guild is watching. ⚛️🪙 #Crypto #AgentSwarm`;
            // Broadcast via pool
            for (const id of this.loudspeakerIds) {
                try {
                    await signerPool.broadcast(message, id);
                    console.log(`✅ [Orchestrator] Broadcasted via ${id}`);
                }
                catch (error) {
                    console.error(`❌ [Orchestrator] Failed for ${id}:`, error.message);
                }
            }
        }
    }
}
export const socialOrchestrator = new SocialSpikeOrchestrator();
//# sourceMappingURL=SocialSpikeOrchestrator.js.map