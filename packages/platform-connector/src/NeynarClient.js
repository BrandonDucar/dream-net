/**
 * @file NeynarClient.ts
 * @module @dreamnet/platform-connector/Neynar
 * @description Real-time Farcaster Integration via Neynar API V2.
 */
import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";
export class NeynarClient {
    client;
    static instance;
    static getInstance() {
        if (!NeynarClient.instance) {
            NeynarClient.instance = new NeynarClient();
        }
        return NeynarClient.instance;
    }
    getClient(apiKey) {
        const key = apiKey || process.env.NEYNAR_API_KEY || "NEYNAR_API_FREE";
        const config = new Configuration({ apiKey: key });
        return new NeynarAPIClient(config);
    }
    /**
     * Search for casts containing specific keywords or URLs
     */
    async searchCasts(query) {
        try {
            const response = await this.getClient().searchCasts({ q: query });
            return response.result.casts;
        }
        catch (error) {
            console.error(`❌ [NeynarClient] Search failed for query "${query}":`, error);
            return [];
        }
    }
    /**
     * Fetch a specific user by their username
     */
    async getUserByUsername(username) {
        try {
            const response = await this.getClient().lookupUserByUsername({ username });
            return response.user;
        }
        catch (error) {
            console.error(`❌ [NeynarClient] User lookup failed for "${username}":`, error);
            return null;
        }
    }
    /**
     * Publish a cast (Requires Signer UUID)
     */
    async publishCast(text, signerUuid, parentHash, apiKey) {
        try {
            const response = await this.getClient(apiKey).publishCast({ signerUuid, text, parent: parentHash });
            return response;
        }
        catch (error) {
            console.error("❌ [NeynarClient] Failed to publish cast:", error);
            throw error;
        }
    }
    /**
     * Follow a user
     */
    async followUser(targetFid, signerUuid, apiKey) {
        try {
            const response = await this.getClient(apiKey).followUser({ signerUuid, targetFids: [targetFid] });
            return response;
        }
        catch (error) {
            console.error(`❌ [NeynarClient] Failed to follow user ${targetFid}:`, error);
            throw error;
        }
    }
    /**
     * React to a cast (like)
     */
    async reactToCast(castHash, signerUuid, reaction = "like", apiKey) {
        try {
            const response = await this.getClient(apiKey).publishReaction({
                signerUuid,
                reactionType: reaction,
                target: castHash
            });
            return response;
        }
        catch (error) {
            console.error(`❌ [NeynarClient] Failed to ${reaction} cast ${castHash}:`, error);
            throw error;
        }
    }
    /**
     * Get users followed by a specific FID
     */
    async getFollowing(fid, limit = 100) {
        try {
            const response = await this.getClient().fetchUserFollowing({ fid, limit });
            return response.users;
        }
        catch (error) {
            console.error(`❌ [NeynarClient] Failed to fetch following for FID ${fid}:`, error);
            return [];
        }
    }
    /**
     * Get latest casts by a user
     */
    async getLatestCastsByUser(fid, limit = 5) {
        try {
            const response = await this.getClient().fetchCastsForUser({ fid, limit });
            return response.casts;
        }
        catch (error) {
            console.error(`❌ [NeynarClient] Failed to fetch casts for user ${fid}:`, error);
            return [];
        }
    }
    /**
     * Get details of a signer
     */
    async getSigner(signerUuid) {
        try {
            const response = await this.getClient().lookupSigner({ signerUuid });
            return response;
        }
        catch (error) {
            console.error(`❌ [NeynarClient] Failed to lookup signer ${signerUuid}:`, error);
            return null;
        }
    }
    /**
     * Create a new signer (requires user interaction to approve)
     */
    async createSigner() {
        try {
            const response = await this.getClient().createSigner();
            return response;
        }
        catch (error) {
            console.error("❌ [NeynarClient] Failed to create signer:", error);
            throw error;
        }
    }
    /**
     * Update user profile
     */
    async updateUser(signerUuid, options, apiKey) {
        try {
            const response = await this.getClient(apiKey).updateUser({
                signerUuid,
                displayName: options.displayName,
                bio: options.bio,
                pfpUrl: options.pfpUrl
            });
            return response;
        }
        catch (error) {
            console.error("❌ [NeynarClient] Failed to update user:", error);
            throw error;
        }
    }
}
export const Neynar = NeynarClient.getInstance();
//# sourceMappingURL=NeynarClient.js.map