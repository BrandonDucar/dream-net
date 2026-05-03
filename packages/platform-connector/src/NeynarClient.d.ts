/**
 * @file NeynarClient.ts
 * @module @dreamnet/platform-connector/Neynar
 * @description Real-time Farcaster Integration via Neynar API V2.
 */
export declare class NeynarClient {
    private client;
    private static instance;
    static getInstance(): NeynarClient;
    private getClient;
    /**
     * Search for casts containing specific keywords or URLs
     */
    searchCasts(query: string): Promise<import("@neynar/nodejs-sdk/build/api").Cast[]>;
    /**
     * Fetch a specific user by their username
     */
    getUserByUsername(username: string): Promise<import("@neynar/nodejs-sdk/build/api").User | null>;
    /**
     * Publish a cast (Requires Signer UUID)
     */
    publishCast(text: string, signerUuid: string, parentHash?: string, apiKey?: string): Promise<import("@neynar/nodejs-sdk/build/api").PostCastResponse>;
    /**
     * Follow a user
     */
    followUser(targetFid: number, signerUuid: string, apiKey?: string): Promise<import("@neynar/nodejs-sdk/build/api").BulkFollowResponse>;
    /**
     * React to a cast (like)
     */
    reactToCast(castHash: string, signerUuid: string, reaction?: "like" | "recast", apiKey?: string): Promise<import("@neynar/nodejs-sdk/build/api").OperationResponse>;
    /**
     * Get users followed by a specific FID
     */
    getFollowing(fid: number, limit?: number): Promise<import("@neynar/nodejs-sdk/build/api").Follower[]>;
    /**
     * Get latest casts by a user
     */
    getLatestCastsByUser(fid: number, limit?: number): Promise<import("@neynar/nodejs-sdk/build/api").Cast[]>;
    /**
     * Get details of a signer
     */
    getSigner(signerUuid: string): Promise<import("@neynar/nodejs-sdk/build/api").Signer | null>;
    /**
     * Create a new signer (requires user interaction to approve)
     */
    createSigner(): Promise<import("@neynar/nodejs-sdk/build/api").Signer>;
    /**
     * Update user profile
     */
    updateUser(signerUuid: string, options: {
        displayName?: string;
        bio?: string;
        pfpUrl?: string;
    }, apiKey?: string): Promise<import("@neynar/nodejs-sdk/build/api").OperationResponse>;
}
export declare const Neynar: NeynarClient;
//# sourceMappingURL=NeynarClient.d.ts.map