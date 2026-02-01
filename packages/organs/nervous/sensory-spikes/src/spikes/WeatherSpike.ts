import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index.js';

export class WeatherSpike implements SensorySpike {
    name = 'WeatherSpike';
    type = 'environmental' as const;

    // Default to New York, can be parameterized
    private lat = 40.7128;
    private lon = -74.0060;

    constructor(lat?: number, lon?: number) {
        if (lat) this.lat = lat;
        if (lon) this.lon = lon;
    }

    async fetch(): Promise<SpikeResult> {
        try {
            const response = await axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&current=temperature_2m,wind_speed_10m,weather_code`
            );

            return {
                source: 'open-meteo',
                data: response.data,
                timestamp: Date.now(),
                confidence: 0.98
            };
        } catch (error: any) {
            console.error('WeatherSpike Error:', error.message);
            return {
                source: 'open-meteo',
                data: { error: 'Failed to fetch weather' },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }
}
