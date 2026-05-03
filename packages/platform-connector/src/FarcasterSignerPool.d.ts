/**
 * 🏊 FarcasterSignerPool
 * Manages a pool of Neynar Signer UUIDs for the 17,000-agent swarm.
 * Since we can't have 17k signers, we multiplex agents through "Loudspeakers".
 */
export interface SignerConfig {
    uuid: string;
    apiKey: string;
}
export declare class FarcasterSignerPool {
    private signers;
    constructor();
    /**
     * Registers a signer for a specific agent or a guild "Loudspeaker".
     */
    registerSigner(id: string, uuid: string, apiKey: string): void;
    /**
     * Gets a signer config for an agent.
     */
    getSigner(id: string): SignerConfig | undefined;
    /**
     * Mass post from the swarm with Oracle Layer (ClawdChat Standard).
     */
    broadcast(message: string, id: string): Promise<import("@neynar/nodejs-sdk/build/api/index.js").PostCastResponse | {
        success: boolean;
        reason: string;
    } | undefined>;
}
export declare const signerPool: FarcasterSignerPool;
//# sourceMappingURL=FarcasterSignerPool.d.ts.map