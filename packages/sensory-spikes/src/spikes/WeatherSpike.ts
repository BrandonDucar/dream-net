import { SensorySpike, SpikeResult } from '../index.js';

export class WeatherSpike implements SensorySpike {
    name = 'Weather';
    type = 'environmental' as const;

    async fetch(): Promise<SpikeResult> {
        return {
            source: 'OpenWeather',
            data: { status: 'Clear skies in the Digital Void' },
            timestamp: Date.now(),
            confidence: 1
        };
    }
}
