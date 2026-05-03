import { SensorySpike, SpikeResult } from '../index.js';

export class NewsSpike implements SensorySpike {
    name = 'News';
    type = 'news' as const;

    async fetch(): Promise<SpikeResult> {
        return {
            source: 'Generic News',
            data: { headline: 'DreamNet Expansion Continues' },
            timestamp: Date.now(),
            confidence: 1
        };
    }
}
