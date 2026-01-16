import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index.js';

/**
 * ANOMALY SPIKE (Planetary Dynamics)
 * Tracks earthquakes and Bitcoin block height as signals of physical and digital stability.
 */
export class AnomalySpike implements SensorySpike {
    name = 'AnomalySpike';
    type = 'environmental' as const;

    private quakeUrl = process.env.EARTHQUAKE_API_URL || 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson';
    private btcUrl = process.env.BITCOIN_INFO_URL || 'https://blockchain.info/q/getblockcount';

    async fetch(): Promise<SpikeResult> {
        try {
            const [quakeResp, btcResp] = await Promise.all([
                axios.get(this.quakeUrl),
                axios.get(this.btcUrl)
            ]);

            const topQuake = quakeResp.data.features?.[0]?.properties || {};

            return {
                source: 'Planetary-Anomalies',
                data: {
                    recent_quake_mag: topQuake.mag,
                    recent_quake_place: topQuake.place,
                    bitcoin_height: btcResp.data
                },
                timestamp: Date.now(),
                confidence: 0.95
            };
        } catch (error: any) {
            return {
                source: 'Planetary-Anomalies',
                data: { error: error.message },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }
}
