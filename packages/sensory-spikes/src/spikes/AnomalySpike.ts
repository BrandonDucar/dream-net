import { SensorySpike, SpikeResult } from '../index.js';

export class AnomalySpike implements SensorySpike {
    name = 'Anomaly';
    type = 'geopolitical' as const;

    async fetch(): Promise<SpikeResult> {
        return {
            source: 'Chaos Engine',
            data: { anomaly: 'None detected' },
            timestamp: Date.now(),
            confidence: 1
        };
    }
}
