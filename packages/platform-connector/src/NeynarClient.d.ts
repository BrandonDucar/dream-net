/**
 * @file NeynarClient.ts
 * @module @dreamnet/platform-connector/Neynar
 * @description Real-time Farcaster Integration via Neynar API V2.
 */
export declare class NeynarClient {
    private client;
    private static instance;
    private constructor();
    static getInstance(): NeynarClient;
    /**
     * Search for casts containing specific keywords or URLs
     */
    searchCasts(query: string): Promise<import("@neynar/nodejs-sdk/build/api/index.js").Cast[]>;
    /**
     * Fetch a specific user by their username
     */
    getUserByUsername(username: string): Promise<import("@neynar/nodejs-sdk/build/api/index.js").User | null>;
    /**
     * Publish a cast (Requires Signer UUID)
     */
    publishCast(text: string, signerUuid: string): Promise<import("@neynar/nodejs-sdk/build/api/index.js").PostCastResponse>;
}
export declare const Neynar: NeynarClient;
//# sourceMappingURL=NeynarClient.d.ts.map