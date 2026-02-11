import axios from 'axios';
import { EventEmitter } from 'events';

/**
 * 📡 NeynarRelayService: Social Gnosis Ingestion
 * Role: Bridges Farcaster (via Neynar) into the DreamNet Event Bus.
 * Principle: Vertical integration - no longer a consumer, but a steward.
 */
export class NeynarRelayService extends EventEmitter {
    private apiKey: string;
    private baseUrl: string = 'https://api.neynar.com/v2';

    constructor(apiKey: string) {
        super();
        this.apiKey = apiKey;
    }

    /**
     * Fetches recent casts from a specific user or channel.
     */
    async fetchLatestGnosis(fid?: number, channelId?: string) {
        try {
            const endpoint = fid ? `${this.baseUrl}/farcaster/feed?fids=${fid}` : `${this.baseUrl}/farcaster/feed?channel_id=${channelId}`;
            const response = await axios.get(endpoint, {
                headers: { 'api_key': this.apiKey }
            });

            const casts = response.data.casts || [];
            this.processCasts(casts);

            return casts;
        } catch (error) {
            console.error('[NEYNAR] Failed to fetch social gnosis:', error);
            return [];
        }
    }

    /**
     * Processes social signals and emits them as "Pheromone Updates".
     */
    private processCasts(casts: any[]) {
        for (const cast of casts) {
            const signal = {
                id: cast.hash,
                author: cast.author.username,
                text: cast.text,
                timestamp: new Date(cast.timestamp).getTime(),
                sentiment: this.analyzeSentiment(cast.text)
            };

            // Emit for the PheromoneService to pick up
            this.emit('SOCIAL_SIGNAL', signal);
        }
    }

    /**
     * Simple sentiment analysis to filter "AI Drivel" vs "Master Signal".
     */
    private analyzeSentiment(text: string): number {
        // Logic will be expanded with The Resonance (HumanAPI)
        if (text.includes('Master') || text.includes('Sovereign')) return 1.0;
        if (text.includes('chatbot') || text.includes('AI assistant')) return -1.0;
        return 0.5;
    }

    /**
     * Broadcasts a "Strategic Directive" back to Farcaster.
     */
    async broadcastDirective(fid: number, signerUuid: string, text: string) {
        try {
            await axios.post(`${this.baseUrl}/farcaster/cast`, {
                signer_uuid: signerUuid,
                text: `[DREAMNET-DIRECTIVE]: ${text}`
            }, {
                headers: { 'api_key': this.apiKey }
            });
            console.log(`[NEYNAR] Directive broadcasted: ${text}`);
        } catch (error) {
            console.error('[NEYNAR] Broadcast failure:', error);
        }
    }
}
