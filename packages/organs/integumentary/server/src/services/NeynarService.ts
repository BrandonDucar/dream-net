import { NeynarAPIClient } from "@neynar/nodejs-sdk";

/**
 * 🌐 NeynarService
 * Production-grade Farcaster I/O.
 * Stewards the connection between DreamNet and the Farcaster ecosystem.
 */
export class NeynarService {
    private static client: NeynarAPIClient;
    private static signerUuid: string;

    /**
     * Initialize Neynar Client
     */
    static initialize() {
        const apiKey = process.env.NEYNAR_API_KEY;
        this.signerUuid = process.env.NEYNAR_SIGNER_UUID || "";

        if (!apiKey) {
            console.warn("⚠️ [Neynar Service] NEYNAR_API_KEY not found in .env. Farcaster I/O will be simulated.");
            return;
        }

        this.client = new NeynarAPIClient(apiKey);
        console.log("🌐 [Neynar Service] Initialized production I/O pipeline.");
    }

    /**
     * Post a cast to Farcaster
     */
    static async postCast(text: string, embeds?: { url: string }[]): Promise<any> {
        if (!this.client || !this.signerUuid) {
            console.log(`📡 [Neynar Simulator] casting: "${text.substring(0, 50)}..."`);
            return { hash: `0x_sim_${Math.random().toString(16).slice(2, 10)}` };
        }

        try {
            const cast = await this.client.publishCast(this.signerUuid, text, {
                embeds: embeds
            });
            console.log(`✅ [Neynar Service] Cast published: ${cast.hash}`);
            return cast;
        } catch (error) {
            console.error("❌ [Neynar Service] Failed to publish cast:", error);
            throw error;
        }
    }

    /**
     * Search for casts (Market Intelligence)
     */
    static async searchCasts(query: string): Promise<any[]> {
        if (!this.client) return [];

        try {
            const { casts } = await this.client.searchCasts(query);
            return casts;
        } catch (error) {
            console.error("❌ [Neynar Service] Search failed:", error);
            return [];
        }
    }
}

// Initialize on load
NeynarService.initialize();
