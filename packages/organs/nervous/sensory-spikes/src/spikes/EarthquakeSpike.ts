
import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index.js';

export class EarthquakeSpike implements SensorySpike {
    name = 'EarthquakeSpike';
    type = 'environmental' as const;

    async fetch(): Promise<SpikeResult> {
        try {
            // USGS Free Feed: All earthquakes past day
            const response = await axios.get(
                'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
            );

            const quakes = response.data.features || [];
            // Filter for significant ones (> 4.5 mag)
            const significant = quakes.filter((q: any) => q.properties.mag >= 4.5);

            return {
                source: 'usgs-earthquake-feed',
                data: {
                    count_total: quakes.length,
                    significant_count: significant.length,
                    latest_significant: significant.slice(0, 3).map((q: any) => ({
                        magnitude: q.properties.mag,
                        location: q.properties.place,
                        time: new Date(q.properties.time).toISOString(),
                        alert: q.properties.alert
                    }))
                },
                timestamp: Date.now(),
                confidence: 1.0
            };
        } catch (error: any) {
            console.error('EarthquakeSpike Error:', error.message);
            return {
                source: 'usgs-earthquake-feed',
                data: { error: 'Failed to monitor crustal displacement' },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }
}
