
import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index.js';

export class GrantSpike implements SensorySpike {
    name = 'GrantSpike';
    type = 'financial' as const;
    private apiKey = process.env.NEWS_API_KEY || ''; // Fallback handling provided

    async fetch(): Promise<SpikeResult> {
        console.log('[GrantSpike] 🐺 Hunting for capital injection vectors...');

        try {
            const opportunities: any[] = [];

            // 1. Dev.to API (Open Source, often lists hackathons/grants in tags)
            // We search for "hackathon", "grant", "bounty"
            const devToResponse = await axios.get('https://dev.to/api/articles?tag=hackathon&per_page=5', { timeout: 5000 })
                .catch(e => ({ data: [] }));

            if (Array.isArray(devToResponse.data)) {
                devToResponse.data.forEach((article: any) => {
                    opportunities.push({
                        title: article.title,
                        source: 'Dev.to (Hackathon Tag)',
                        link: article.url,
                        description: article.description,
                        reward: 'See Link',
                        timestamp: article.published_at
                    });
                });
            }

            // 2. NewsAPI (Targeted Search)
            if (this.apiKey) {
                const newsResponse = await axios.get(
                    `https://newsapi.org/v2/everything?q=crypto+grant+hackathon&sortBy=publishedAt&language=en&pageSize=5&apiKey=${this.apiKey}`,
                    { timeout: 5000 }
                ).catch(e => ({ data: { articles: [] } }));

                if (newsResponse.data?.articles) {
                    newsResponse.data.articles.forEach((article: any) => {
                        opportunities.push({
                            title: article.title,
                            source: article.source.name,
                            link: article.url,
                            description: article.description,
                            reward: 'Unknown',
                            timestamp: article.publishedAt
                        });
                    });
                }
            } else {
                console.warn('[GrantSpike] ⚠️ Missing NEWS_API_KEY. Skipping NewsAPI scan.');
            }

            // 3. GitHub (Bounty Search - Mock-ish/Public query)
            // Searching issues with label "bounty" in popular orgs is complex without a list.
            // We'll stick to Dev.to + NewsAPI implies "Real World" enough for now.

            return {
                source: 'grant-aggregator',
                data: {
                    count: opportunities.length,
                    opportunities: opportunities
                },
                timestamp: Date.now(),
                confidence: opportunities.length > 0 ? 0.9 : 0.0
            };

        } catch (error: any) {
            console.error('GrantSpike Error:', error.message);
            return {
                source: 'grant-aggregator',
                data: { error: 'Failed to hunt for grants' },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }
}
