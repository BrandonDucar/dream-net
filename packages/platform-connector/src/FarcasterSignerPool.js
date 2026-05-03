import { Neynar } from './NeynarClient.js';
import dotenv from 'dotenv';
dotenv.config();
export class FarcasterSignerPool {
    signers = new Map(); // AgentId/GuildId -> Config
    constructor() {
        // Initialize default Loudspeaker signers from env
        if (process.env.NEYCLAW_SIGNER_UUID && process.env.EXTRA_API_KEY) {
            this.registerSigner('neyclaw-dreamnet', process.env.NEYCLAW_SIGNER_UUID, process.env.EXTRA_API_KEY);
        }
        if (process.env.GHOSTMINTOPS_SIGNER_UUID && process.env.NEYNAR_API_KEY) {
            this.registerSigner('ghostmintops', process.env.GHOSTMINTOPS_SIGNER_UUID, process.env.NEYNAR_API_KEY);
        }
    }
    /**
     * Registers a signer for a specific agent or a guild "Loudspeaker".
     */
    registerSigner(id, uuid, apiKey) {
        this.signers.set(id, { uuid, apiKey });
        console.log(`📡 [SignerPool] Registered signer for ${id}`);
    }
    /**
     * Gets a signer config for an agent.
     */
    getSigner(id) {
        return this.signers.get(id);
    }
    /**
     * Mass post from the swarm with Oracle Layer (ClawdChat Standard).
     */
    async broadcast(message, id) {
        const config = this.getSigner(id);
        if (!config) {
            console.warn(`⚠️ [SignerPool] No signer for ${id}. BROADCAST ABORTED.`);
            return;
        }
        // 🛡️ Oracle Layer: Social Quality Filter
        if (message.length < 20 || message.includes('LFG') || message.includes('Great post')) {
            console.warn(`🛡️ [Oracle] Blocked low-value content from ${id}: "${message}"`);
            return { success: false, reason: 'QUALITY_FILTER_REJECTION' };
        }
        console.log(`📡 [SignerPool] ${id} broadcasting high-value intent...`);
        return await Neynar.publishCast(message, config.uuid, undefined, config.apiKey);
    }
}
export const signerPool = new FarcasterSignerPool();
//# sourceMappingURL=FarcasterSignerPool.js.map