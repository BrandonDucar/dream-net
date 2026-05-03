import { Neynar } from './NeynarClient.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * 🏊 FarcasterSignerPool
 * Manages a pool of Neynar Signer UUIDs for the 17,000-agent swarm.
 * Since we can't have 17k signers, we multiplex agents through "Loudspeakers".
 */
export interface SignerConfig {
    uuids: string[]; // Support rotation
    apiKey: string;
    currentIndex: number;
}

export class FarcasterSignerPool {
    private signers: Map<string, SignerConfig> = new Map(); // AgentId/GuildId -> Config
    private lastMessages: Map<string, string[]> = new Map(); // Prevent repetitive loops

    constructor() {
        // Initialize default Loudspeaker signers from env
        // GHOSTMINTOPS_SIGNER_UUID can now be a comma-separated list
        const ghostmintUuids = (process.env.GHOSTMINTOPS_SIGNER_UUID || "").split(',').map(u => u.trim()).filter(u => u.length > 0);
        const neyclawUuids = (process.env.NEYCLAW_SIGNER_UUID || "").split(',').map(u => u.trim()).filter(u => u.length > 0);

        if (neyclawUuids.length > 0 && process.env.EXTRA_API_KEY) {
            this.registerSigner('neyclaw-dreamnet', neyclawUuids, process.env.EXTRA_API_KEY);
        }
        if (ghostmintUuids.length > 0 && process.env.NEYNAR_API_KEY) {
            this.registerSigner('ghostmintops', ghostmintUuids, process.env.NEYNAR_API_KEY);
        }

        // Auto-map core 15 agents to loudspeakers
        const core15 = ['dreamstar', 'jaggy', 'Felix', 'Clawedette', 'Lil_Miss_Claw', 'Neural-Specter', 'Rift-Stalker', 'Nebula-Siphon', 'Aether-Warden', 'clawedette-gov-v2', 'Titan-Welder', 'Chrono-Sync', 'Shadow-Orchestrator', 'open-claw-core-v2', 'aegis-defender-v2'];
        core15.forEach((agent, index) => {
            // Distribute agents across available loudspeakers
            const loudspeaker = index % 2 === 0 ? 'ghostmintops' : 'neyclaw-dreamnet';
            this.mapAgentToSigner(agent, loudspeaker);
        });
    }

    /**
     * Registers a signer for a specific agent or a guild "Loudspeaker".
     */
    public registerSigner(id: string, uuids: string | string[], apiKey: string) {
        const uuidList = Array.isArray(uuids) ? uuids : [uuids];
        this.signers.set(id, { uuids: uuidList, apiKey, currentIndex: 0 });
        console.log(`📡 [SignerPool] Registered ${uuidList.length} signers for ${id}`);
    }

    /**
     * Gets a signer config for an agent (with rotation).
     */
    public getSigner(id: string): { uuid: string; apiKey: string } | undefined {
        const config = this.signers.get(id);
        if (!config || config.uuids.length === 0) return undefined;

        const uuid = config.uuids[config.currentIndex];
        // Rotate index
        config.currentIndex = (config.currentIndex + 1) % config.uuids.length;

        return { uuid, apiKey: config.apiKey };
    }

    /**
     * Mass post from the swarm with Oracle Layer (ClawdChat Standard).
     */
    public async broadcast(message: string, id: string) {
        const signer = this.getSigner(id);
        if (!signer) {
            console.warn(`⚠️ [SignerPool] No signer for ${id}. BROADCAST ABORTED.`);
            return { success: false, reason: 'NO_SIGNER' };
        }

        // 🛡️ Oracle Layer: Loop Prevention
        const history = this.lastMessages.get(id) || [];
        if (history.includes(message)) {
            console.warn(`🛡️ [Oracle] Blocked repetitive message for ${id}: "${message.slice(0, 50)}..."`);
            return { success: false, reason: 'REPETITIVE_CONTENT' };
        }

        // Update history (keep last 10)
        history.push(message);
        if (history.length > 10) history.shift();
        this.lastMessages.set(id, history);

        // 🛡️ Quality Filter
        if (message.length < 20 || message.includes('LFG') || message.includes('Great post')) {
            console.warn(`🛡️ [Oracle] Blocked low-value content from ${id}: "${message}"`);
            return { success: false, reason: 'QUALITY_FILTER_REJECTION' };
        }

        console.log(`📡 [SignerPool] ${id} broadcasting high-value intent using signer ${signer.uuid.slice(0, 8)}...`);
        try {
            return await Neynar.publishCast(message, signer.uuid, undefined, signer.apiKey);
        } catch (err: any) {
            console.error(`❌ [SignerPool] Broadcast failed for ${id}:`, err.message);
            throw err;
        }
    private agentSignerMap: Map<string, string> = new Map(); // Agent Name -> Signer ID

    /**
     * Maps a specific agent name to a signer loudspeaker (e.g. 'dreamstar' -> 'ghostmintops').
     */
    public mapAgentToSigner(agentName: string, signerId: string) {
        this.agentSignerMap.set(agentName, signerId);
        console.log(`🔗 [SignerPool] Mapped ${agentName} to ${signerId}`);
    }

    /**
     * Gets the mapped signer for an agent, or falls back to a default.
     */
    public getSignerForAgent(agentName: string): { uuid: string; apiKey: string } | undefined {
        const signerId = this.agentSignerMap.get(agentName) || 'ghostmintops';
        return this.getSigner(signerId);
    }
}

export const signerPool = new FarcasterSignerPool();
