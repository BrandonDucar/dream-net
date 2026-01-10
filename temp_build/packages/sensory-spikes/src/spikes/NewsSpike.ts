import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index';

export class NewsSpike implements SensorySpike {
    name = 'NewsSpike';
    type = 'news' as const;
    private apiKey = process.env.NEWS_API_KEY || '';

    async fetch(): Promise<SpikeResult> {
        try {
            if (!this.apiKey) {
                return {
                    source: 'news-api-mock',
                    data: {
                        articles: [
                            { title: "Global AI Summit reaches consensus on agent autonomy", source: "The Tech Times" },
                            { title: "SpaceX launches new satellite constellation", source: "Orbit Daily" }
                        ]
                    },
                    timestamp: Date.now(),
                    confidence: 0.5
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
