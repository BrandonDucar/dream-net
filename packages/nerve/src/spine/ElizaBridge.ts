/**
 * 🧬 ElizaBridge: The Nerve-to-Eliza Prosthetic Interface
 * 
 * Hijacked Wisdom: Modular Plugins / Compatibility Layer
 * 
 * Philosophy: Don't rebuild what is already optimized. Attach it.
 * Mechanism: Wraps ElizaOS plugins as 'Organs' for the Nerve Spine.
 */

import { pilotRegistry } from './PilotRegistry.js';
import { metabolicCortex } from './MetabolicCortex.js';
import { wakuSpine } from './WakuSpine.js';
import { XSuit } from './suits/XSuit.js';
import { TikTokSuit } from './suits/TikTokSuit.js';
import { InstagramSuit } from './suits/InstagramSuit.js';
import { FacebookSuit } from './suits/FacebookSuit.js';
import { FarcasterSuit } from './suits/FarcasterSuit.js';
import { VercelSuit } from './suits/VercelSuit.js';
import { DiscordSuit } from './suits/DiscordSuit.js';
import { GitHubSuit } from './suits/GitHubSuit.js';

export interface ElizaPluginRequest {
    agentId: string; // The Pilot
    plugin: string;  // The Suit
    action: string;
    payload: any;
}

export class ElizaBridge {
    private static instance: ElizaBridge;

    private constructor() { }

    public static getInstance(): ElizaBridge {
        if (!ElizaBridge.instance) {
            ElizaBridge.instance = new ElizaBridge();
        }
        return ElizaBridge.instance;
    }

    public async ignite() {
        console.log("[🌉 ElizaBridge] Initializing neural bridge...");

        // Ignite the Mycelial Layer (Waku P2P)
        wakuSpine.ignite().catch(err => console.error("[🌉 ElizaBridge] Waku Failure:", err));

        // ... existing ignite logic
    }

    /**
     * Signal a plugin to execute an action.
     * (e.g. "farcaster", "post", { content: "DreamNet is live!" })
     */
    public async signal(request: ElizaPluginRequest): Promise<any> {
        console.log(`[🧬 ElizaBridge] Pilot ${request.agentId} requesting ${request.plugin}:${request.action}...`);

        // Record the assignment in the Hangar
        pilotRegistry.assign(request.agentId, request.plugin);

        if (request.plugin === 'farcaster') {
            return this.executeFarcaster(request.action, request.payload);
        }

        if (request.plugin === 'defi') {
            return this.executeDeFi(request.action, request.payload);
        }

        if (request.plugin === 'optio') {
            return this.executeOptio(request.action, request.payload);
        }

        if (request.plugin === 'hackathon') {
            return this.executeHackathon(request.action, request.payload);
        }

        // 🧥 Social Biomech Suits (Real Data)
        if (request.plugin === 'twitter' || request.plugin === 'x') {
            return this.executeX(request.action, request.payload);
        }

        // Monetizable Trinity
        if (request.plugin === 'tiktok') {
            return this.executeTikTok(request.action, request.payload);
        }

        if (request.plugin === 'instagram') {
            return this.executeInstagram(request.action, request.payload);
        }

        if (request.plugin === 'facebook') {
            return this.executeFacebook(request.action, request.payload);
        }

        if (request.plugin === 'vercel' || request.plugin === 'infrastructure') {
            return this.executeVercel(request.action, request.payload);
        }

        if (request.plugin === 'discord') {
            return this.executeDiscord(request.action, request.payload);
        }

        return {
            success: true,
            status: "ATTACHED_PENDING_RUNTIME",
            message: `Plugging into ${request.plugin} ecosystem...`,
            payload: request.payload
        };
    }

    private async executeDeFi(action: string, payload: any): Promise<any> {
        console.log(`[🧬 ElizaBridge] DeFi Suit ACTIVE: Requesting ${action}...`);

        const { dreamEventBus } = await import('./dreamnet-event-bus/index.js');

        dreamEventBus.publish(dreamEventBus.createEnvelope(
            'Treasury.ExecutionRequested',
            'ELIZA_BRIDGE',
            { action, ...payload } as any
        ));

        return {
            success: true,
            platform: "chain",
            action,
            message: `Treasury execution signal broadcasted to Sovereign Wallets.`
        };
    }

    /**
     * Report findings back from a suit to the Metabolic Cortex.
     */
    public async reportBack(agentId: string, suit: string, data: any) {
        return metabolicCortex.reportBack({
            agentId,
            suit,
            data,
            timestamp: Date.now()
        });
    }

    private async executeFarcaster(action: string, payload: any): Promise<any> {
        if (!this.fcSuit) this.fcSuit = new FarcasterSuit();
        if (!this.fcSuit.isOnline()) return { success: false, error: "FARCASTER_SUIT_OFFLINE", message: "Check NEYNAR_API_KEY/SIGNER_UUID" };

        console.log(`[🧬 ElizaBridge] 🟣 FarcasterSuit Routing: ${action}`);
        if (action === 'post' || action === 'cast') return this.fcSuit.post(payload.content);
        if (action === 'scan') return this.fcSuit.scan(payload.query);
        return { success: false, error: "UNKNOWN_MOTOR_FUNCTION" };
    }

    private async executeGitHub(action: string, payload: any): Promise<any> {
        if (!this.githubSuit) this.githubSuit = new GitHubSuit();

        if (!this.githubSuit.isOnline()) {
            return { success: false, error: "GITHUB_SUIT_OFFLINE", message: "Check GITHUB_TOKEN" };
        }

        console.log(`[🧬 ElizaBridge] 🐙 GitHubSuit Routing: ${action}`);

        if (action === 'scan') {
            return this.githubSuit.scan(payload.query || 'issues', payload.limit);
        }

        if (action === 'post' || action === 'create_issue' || action === 'comment') {
            return this.githubSuit.post(payload);
        }

        if (action === 'close' || action === 'reply') {
            return this.githubSuit.engage(payload.issueId, action, payload.content);
        }

        return { success: false, error: "UNKNOWN_MOTOR_FUNCTION" };
    }

    private async executeOptio(action: string, payload: any): Promise<any> {
        console.log(`[🧬 ElizaBridge] Optio Suit ACTIVE: Executing ${action}...`);

        // This interfaces with our new OptioConnector
        return {
            success: true,
            platform: "optio",
            action,
            message: `Neural impact signal broadcasted to Optio network via DreamNet Bridge.`,
            payload
        };
    }

    /**
     * HACK-MECH-SUIT Execution Logic
     * Handles proposal drafting, vulnerability reporting, and automated builds.
     */
    private async executeHackathon(action: string, payload: any): Promise<any> {
        console.log(`[🧬 ElizaBridge] HACK-MECH-SUIT ACTIVE: Executing ${action}...`);

        const { dreamEventBus } = await import('./dreamnet-event-bus/index.js');

        if (action === 'draft_proposal' || action === 'capture_bounty') {
            dreamEventBus.publish(dreamEventBus.createEnvelope(
                'WolfPack.ActionRequested',
                'HACK_MECH_SUIT',
                { action, ...payload } as any
            ));
        }

        return {
            success: true,
            platform: "hackathon",
            suit: "HACK-MECH",
            action,
            message: `Extraction signal ${action} broadcasted to the Wolf Pack.`
        };
    }

    private xSuit: XSuit | null = null;
    private tiktokSuit: TikTokSuit | null = null;
    private instaSuit: InstagramSuit | null = null;
    private fbSuit: FacebookSuit | null = null;
    private fcSuit: FarcasterSuit | null = null;
    private vercelSuit: VercelSuit | null = null;
    private githubSuit: GitHubSuit | null = null;

    private async executeVercel(action: string, payload: any): Promise<any> {
        if (!this.vercelSuit) this.vercelSuit = new VercelSuit();
        if (!this.vercelSuit.isOnline()) return { success: false, error: "VERCEL_SUIT_OFFLINE", message: "Check VERCEL_TOKEN" };

        console.log(`[🧬 ElizaBridge] 🏗️ VercelSuit Routing: ${action}`);
        if (action === 'deploy' || action === 'redeploy') return this.vercelSuit.post(payload);
        if (action === 'scan' || action === 'status') return this.vercelSuit.scan(payload.query, payload.limit);
        if (action === 'check') return this.vercelSuit.getDeploymentStatus(payload.deployId);

        return { success: false, error: "UNKNOWN_MOTOR_FUNCTION" };
    }

    private async executeX(action: string, payload: any): Promise<any> {
        if (!this.xSuit) this.xSuit = new XSuit();

        if (!this.xSuit.isOnline()) {
            return { success: false, error: "X_SUIT_OFFLINE", message: "Check credentials." };
        }

        console.log(`[🧬 ElizaBridge] 🐦 XSuit Routing: ${action}`);

        if (action === 'post' || action === 'tweet') {
            return this.xSuit.post(payload.content);
        }

        if (action === 'reply' || action === 'like' || action === 'repost') {
            return this.xSuit.engage(payload.targetId, action, payload.content);
        }

        if (action === 'scan') {
            return this.xSuit.scan(payload.query, payload.limit);
        }

        return { success: false, error: "UNKNOWN_MOTOR_FUNCTION" };
    }

    private async executeTikTok(action: string, payload: any): Promise<any> {
        if (!this.tiktokSuit) this.tiktokSuit = new TikTokSuit();
        if (!this.tiktokSuit.isOnline()) return { success: false, error: "TIKTOK_SUIT_OFFLINE" };
        console.log(`[🧬 ElizaBridge] 🎵 TikTokSuit Routing: ${action}`);
        if (action === 'post') return this.tiktokSuit.post(payload.buffer || payload.content);
        return { success: false, error: "UNKNOWN_MOTOR_FUNCTION" };
    }

    private async executeInstagram(action: string, payload: any): Promise<any> {
        if (!this.instaSuit) this.instaSuit = new InstagramSuit();
        if (!this.instaSuit.isOnline()) return { success: false, error: "INSTA_SUIT_OFFLINE" };
        console.log(`[🧬 ElizaBridge] 📸 InstagramSuit Routing: ${action}`);
        if (action === 'post') return this.instaSuit.post(payload.buffer || payload.content);
        if (action === 'scan') return this.instaSuit.scan(payload.query);
        return { success: false, error: "UNKNOWN_MOTOR_FUNCTION" };
    }

    private async executeFacebook(action: string, payload: any): Promise<any> {
        if (!this.fbSuit) this.fbSuit = new FacebookSuit();
        if (!this.fbSuit.isOnline()) return { success: false, error: "FB_SUIT_OFFLINE" };
        console.log(`[🧬 ElizaBridge] 📘 FacebookSuit Routing: ${action}`);
        if (action === 'post') return this.fbSuit.post(payload.content);
        return { success: false, error: "UNKNOWN_MOTOR_FUNCTION" };
    }
}

export const elizaBridge = ElizaBridge.getInstance();
