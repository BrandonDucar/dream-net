import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index.js';

export class NASASpike implements SensorySpike {
    name = 'NASASpike';
    type = 'scientific' as const;

    // NASA API for Near Earth Objects (Asteroids) and Earth Imagery
    // https://api.nasa.gov/
    private apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';

    async fetch(): Promise<SpikeResult> {
        try {
            // Fetching Near Earth Objects (NeoWs)
            const today = new Date().toISOString().split('T')[0];
            const response = await axios.get(
                `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${this.apiKey}`
            );

            const neoCount = response.data.element_count;
            const objects = response.data.near_earth_objects[today] || [];

            // Filter for "potentially hazardous" asteroids for higher signal
            const hazardous = objects.filter((o: any) => o.is_potentially_hazardous_asteroid);

            return {
                source: 'NASA-NeoWs',
                data: {
                    total_neos_today: neoCount,
                    hazardous_count: hazardous.length,
                    closest_approach: objects.length > 0 ? objects[0].close_approach_data[0].miss_distance.kilometers : '0',
                    stellar_flare_index: Math.random() * 100 // Mock flare index until we use DONKI API
                },
                timestamp: Date.now(),
                confidence: 0.95
            };
        } catch (error: any) {
            console.error('NASASpike Error:', error.message);
            return {
                source: 'NASA-API',
                data: { error: 'Failed to fetch planetary data' },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }
}
