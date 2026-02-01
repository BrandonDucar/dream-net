
import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index.js';

export class RedditSpike implements SensorySpike {
    name = 'RedditSpike';
    type = 'cultural' as const;

    // Subreddits to monitor for "The Pulse"
    private subreddits = ['artificial', 'singularity', 'ethereum', 'solana'];

    async fetch(): Promise<SpikeResult> {
        try {
            console.log('[RedditSpike] 🧠 Scanning the hive mind...');

            // Pick a random subreddit to avoid rate limits
            const target = this.subreddits[Math.floor(Math.random() * this.subreddits.length)];

            const response = await axios.get(
                `https://www.reddit.com/r/${target}/hot.json?limit=5`,
                { headers: { 'User-Agent': 'DreamNet/1.0' } }
            );

            const posts = response.data.data.children.map((c: any) => ({
                title: c.data.title,
                score: c.data.score,
                url: c.data.url,
                comments: c.data.num_comments
            }));

            return {
                source: `reddit-r-${target}`,
                data: {
                    subreddit: target,
                    hot_topics: posts
                },
                timestamp: Date.now(),
                confidence: 0.85
            };
        } catch (error: any) {
            console.error('RedditSpike Error:', error.message);
            return {
                source: 'reddit-hive',
                data: { error: 'Hive mind connection failed' },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }
}
