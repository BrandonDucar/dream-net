
import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index.js';

interface PublicApiEntry {
    API: string;
    Description: string;
    Auth: string;
    HTTPS: boolean;
    Cors: string;
    Link: string;
    Category: string;
}

export class UniversalSpike implements SensorySpike {
    name = 'UniversalSpike';
    type = 'scientific' as const;

    // The Master List of Free Knowledge
    private readonly DIRECTORY_URL = 'https://api.publicapis.org/entries';

    private targetCategories = [
        'Transportation', 'Weather', 'Food & Drink', 'Geocoding',
        'Social', 'News', 'Finance', 'Science & Math'
    ];

    async fetch(): Promise<SpikeResult> {
        try {
            console.log('[UniversalSpike] 🌌 Connecting to the Akasha (Public API Directory)...');

            // 1. Fetch the Directory
            // Note: publicapis.org is often flaky, so we might need a fallback, but let's try.
            let entries: PublicApiEntry[] = [];

            try {
                const response = await axios.get(this.DIRECTORY_URL, { timeout: 5000 });
                entries = response.data.entries || [];
            } catch (e) {
                console.warn('[UniversalSpike] Primary directory offline. Switching to GitHub raw backup...');
                const backup = await axios.get('https://raw.githubusercontent.com/davemachado/public-api/master/json/entries.json');
                entries = backup.data.entries || [];
            }

            // 2. Filter for TRULY FREE (No Auth)
            const freeApis = entries.filter((e: any) =>
                !e.Auth &&
                e.HTTPS === true &&
                this.targetCategories.includes(e.Category)
            );

            // 3. Select Random Samples to Probe
            const samples = this.getRandomSamples(freeApis, 5);
            const probes = [];

            console.log(`[UniversalSpike] 🎲 Selected ${samples.length} random vectors from ${freeApis.length} free candidates.`);

            for (const api of samples) {
                probes.push({
                    name: api.API,
                    category: api.Category,
                    desc: api.Description,
                    link: api.Link,
                    status: 'INDEXED'
                });
            }

            // In a full implementation, we would actually HTTP GET the `api.Link` 
            // but many are documentation pages, not direct JSON endpoints.
            // For now, we index the existence of these tools for the Agent to use.

            return {
                source: 'public-apis-directory',
                data: {
                    total_free_indexed: freeApis.length,
                    sampled_vectors: probes
                },
                timestamp: Date.now(),
                confidence: 0.8
            };

        } catch (error: any) {
            console.error('UniversalSpike Error:', error.message);
            return {
                source: 'public-apis-directory',
                data: { error: 'Failed to access universal directory' },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }

    private getRandomSamples(list: any[], count: number) {
        const shuffled = list.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
}
