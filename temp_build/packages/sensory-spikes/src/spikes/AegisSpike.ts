import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index';

export class AegisSpike implements SensorySpike {
    name = 'AegisSpike';
    type = 'news' as const; // Categorized as Surveillance/News

    // OpenSky Network API for flight tracking (Drones/Aircraft)
    // https://openskynetwork.github.io/opensky-api/rest.html

    // Default bounds (e.g., Ukraine region or Global/US)
    // Example: US East Coast
    private lamin = 40.0;
    private lomin = -76.0;
    private lamax = 41.0;
    private lomax = -73.0;

    async fetch(): Promise<SpikeResult> {
        try {
            // Anonymous access has limitations, but works for low volume
            const response = await axios.get(
                `https://opensky-network.org/api/states/all?lamin=${this.lamin}&lomin=${this.lomin}&lamax=${this.lamax}&lomax=${this.lomax}`
            );

            const aircraft = response.data.states || [];
            const droneActivity = aircraft.map((a: any) => ({
                ids: a[0],
                callsign: a[1].trim(),
                country: a[2],
                lat: a[6],
                lon: a[5],
                velocity: a[9],
                altitude: a[7]
            })).filter((a: any) => a.altitude < 2000); // Low altitude filter for "Drone-like" activity

            return {
                source: 'opensky-network',
                data: {
                    total_detected: aircraft.length,
                    low_altitude_count: droneActivity.length,
                    vessels: droneActivity.slice(0, 10) // Top 10 contacts
                },
                timestamp: Date.now(),
                confidence: 0.9
            };
        } catch (error: any) {
            console.error('AegisSpike Error:', error.message);
            return {
                source: 'opensky-network',
                data: { error: 'Failed to fetch radar data' },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }
}
