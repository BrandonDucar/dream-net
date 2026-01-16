import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index.js';

/**
 * NEYNAR SPIKE (Social Pulse)
 * Tracks trending Farcaster activity via Neynar.
 */
export class NeynarSpike implements SensorySpike {
    name = 'NeynarSpike';
    type = 'cultural' as const;

    private neynarApiUrl = process.env.NEYNAR_API_URL || 'https://api.neynar.com/v2/farcaster/feed/trending';
    private apiKey = process.env.NEYNAR_API_KEY || 'NEYNAR_DREAMNET_DEMO';

    async fetch(): Promise<SpikeResult> {
        try {
            // Using a mock return if no key is provided, or real fetch if it is
            if (this.apiKey === 'NEYNAR_DREAMNET_DEMO') {
                return {
                    source: 'Neynar (Simulated)',
                    data: {
                        trending_tags: ['#ai', '#sovereignty', '#dreamnet'],
                        top_cast: "The swarm is waking up. $DREAM",
                        sentiment: 0.85
                    },
                    timestamp: Date.now(),
                    confidence: 0.5
                };
            }

            const response = await axios.get(this.neynarApiUrl, {
                headers: { 'api_key': this.apiKey }
            });

            const casts = response.data.casts || [];
            return {
                source: 'Farcaster',
                data: {
                    cast_count: casts.length,
                    top_cast: casts[0]?.text,
                    trending_hash: casts[0]?.parent_url || 'N/A'
                },
                timestamp: Date.now(),
                confidence: 1.0
            };
        } catch (error: any) {
            return {
                source: 'Farcaster',
                data: { error: error.message },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }
}
