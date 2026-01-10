/**
 * @file NeynarClient.ts
 * @module @dreamnet/platform-connector/Neynar
 * @description Real-time Farcaster Integration via Neynar API V2.
 */
import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";
export class NeynarClient {
    client;
    static instance;
    constructor() {
        const apiKey = process.env.NEYNAR_API_KEY || "NEYNAR_API_FREE";
        // SDK V2 requires Configuration object
        const config = new Configuration({ apiKey });
        this.client = new NeynarAPIClient(config);
        console.log("📡 [NeynarClient] Farcaster Intelligence Layer initialized.");
    }
    static getInstance() {
        if (!NeynarClient.instance) {
            NeynarClient.instance = new NeynarClient();
        }
        return NeynarClient.instance;
    }
    /**
     * Search for casts containing specific keywords or URLs
     */
    async searchCasts(query) {
        try {
            const response = await this.client.searchCasts({ q: query });
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
            const response = await this.client.lookupUserByUsername({ username });
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
    async publishCast(text, signerUuid) {
        try {
            const response = await this.client.publishCast({ signerUuid, text });
            return response;
        }
        catch (error) {
            console.error("❌ [NeynarClient] Failed to publish cast:", error);
            throw error;
        }
    }
}
export const Neynar = NeynarClient.getInstance();
//# sourceMappingURL=NeynarClient.js.map