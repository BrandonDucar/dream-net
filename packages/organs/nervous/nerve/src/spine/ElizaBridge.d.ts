/**
 * 🧬 ElizaBridge: The Nerve-to-Eliza Prosthetic Interface
 *
 * Hijacked Wisdom: Modular Plugins / Compatibility Layer
 *
 * Philosophy: Don't rebuild what is already optimized. Attach it.
 * Mechanism: Wraps ElizaOS plugins as 'Organs' for the Nerve Spine.
 */
export interface ElizaPluginRequest {
    agentId: string;
    plugin: string;
    action: string;
    payload: any;
}
export declare class ElizaBridge {
    private static instance;
    private constructor();
    static getInstance(): ElizaBridge;
    ignite(): Promise<void>;
    /**
     * Signal a plugin to execute an action.
     * (e.g. "farcaster", "post", { content: "DreamNet is live!" })
     */
    signal(request: ElizaPluginRequest): Promise<any>;
    private executeDeFi;
    /**
     * Report findings back from a suit to the Metabolic Cortex.
     */
    reportBack(agentId: string, suit: string, data: any): Promise<void>;
    private executeFarcaster;
    private executeGitHub;
    private executeOptio;
    /**
     * HACK-MECH-SUIT Execution Logic
     * Handles proposal drafting, vulnerability reporting, and automated builds.
     */
    private executeHackathon;
    private xSuit;
    private tiktokSuit;
    private instaSuit;
    private fbSuit;
    private fcSuit;
    private vercelSuit;
    private githubSuit;
    private executeVercel;
    private executeX;
    private executeTikTok;
    private executeInstagram;
    private executeFacebook;
}
export declare const elizaBridge: ElizaBridge;
//# sourceMappingURL=ElizaBridge.d.ts.map