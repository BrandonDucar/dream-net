
import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index.js';

export class GitHubTrendSpike implements SensorySpike {
    name = 'GitHubTrendSpike';
    type = 'scientific' as const;

    async fetch(): Promise<SpikeResult> {
        try {
            // Monitor the "PushEvent" firehose on GitHub
            // Note: This endpoint is public but rate limited.
            const response = await axios.get('https://api.github.com/events', {
                headers: { 'User-Agent': 'DreamNet-Sovereign-System' }
            });

            const events = response.data;
            const pushEvents = events.filter((e: any) => e.type === 'PushEvent');
            const watchEvents = events.filter((e: any) => e.type === 'WatchEvent'); // Stars

            return {
                source: 'github-global-events',
                data: {
                    active_repos: pushEvents.map((e: any) => e.repo.name).slice(0, 5),
                    trending_stars: watchEvents.map((e: any) => e.repo.name),
                    event_sample_size: events.length
                },
                timestamp: Date.now(),
                confidence: 0.9
            };
        } catch (error: any) {
            console.error('GitHubTrendSpike Error:', error.message);
            return {
                source: 'github-global-events',
                data: { error: 'Failed to tap into code pulse' },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }
}
