import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index.js';

export class NewsSpike implements SensorySpike {
    name = 'NewsSpike';
    type = 'news' as const;
    private apiKey = process.env.NEWS_API_KEY || '';

    async fetch(): Promise<SpikeResult> {
        try {
            if (!this.apiKey) {
                const mirrorUrl = process.env.NEWS_MIRROR_URL || 'https://saurav.tech/NewsAPI/everything/cnn.json';
                const mirrorResp = await axios.get(mirrorUrl);
                return {
                    source: 'news-mirror',
                    data: mirrorResp.data,
                    timestamp: Date.now(),
                    confidence: 0.8
                }
            }

            const response = await axios.get(
                `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${this.apiKey}`
            );

            return {
                source: 'news-api',
                data: response.data,
                timestamp: Date.now(),
                confidence: 0.95
            };
        } catch (error: any) {
            console.error('NewsSpike Error:', error.message);
            return {
                source: 'news-api',
                data: { error: 'Failed to fetch headlines' },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }
}
