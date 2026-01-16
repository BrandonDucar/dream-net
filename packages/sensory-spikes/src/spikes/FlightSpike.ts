
import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index.js';

export class FlightSpike implements SensorySpike {
    name = 'FlightSpike';
    type = 'environmental' as const;

    // Bounding Box (Approx NY/East Coast)
    // lati_min, long_min, lati_max, long_max
    private bbox = '40.0,-74.5,41.0,-73.5';

    async fetch(): Promise<SpikeResult> {
        try {
            // OpenSky Network (Free for anonymous use, limited rate)
            const response = await axios.get(
                `https://opensky-network.org/api/states/all?lamin=40.5&lomin=-74.5&lamax=41.0&lomax=-73.5`,
                { timeout: 5000 }
            );

            const states = response.data.states || [];

            // Map raw vectors to readable aircraft data
            const aircraft = states.map((s: any) => ({
                callsign: s[1]?.trim(),
                origin_country: s[2],
                altitude_geo: s[6],
                velocity: s[5],
                on_ground: s[8]
            })).filter((a: any) => a.callsign);

            return {
                source: 'opensky-network',
                data: {
                    airspace: 'active',
                    aircraft_count: aircraft.length,
                    tracked_vectors: aircraft.slice(0, 5) // Top 5 nearby
                },
                timestamp: Date.now(),
                confidence: 0.95
            };
        } catch (error: any) {
            console.error('FlightSpike Error:', error.message);
            return {
                source: 'opensky-network',
                data: { error: 'Airspace surveillance denied' },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }
}
