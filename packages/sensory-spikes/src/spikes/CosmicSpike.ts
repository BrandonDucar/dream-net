import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index.js';

/**
 * COSMIC SPIKE (Space Exploration)
 * Tracks SpaceX launches and NASA's astronomical pulse.
 */
export class CosmicSpike implements SensorySpike {
    name = 'CosmicSpike';
    type = 'scientific' as const;

    private spaceXUrl = process.env.SPACEX_API_URL || 'https://api.spacexdata.com/v4/launches/latest';
    private nasaApodUrl = process.env.NASA_APOD_URL || 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY';

    async fetch(): Promise<SpikeResult> {
        try {
            const [sxResp, nasaResp] = await Promise.all([
                axios.get(this.spaceXUrl),
                axios.get(this.nasaApodUrl)
            ]);

            return {
                source: 'Cosmos',
                data: {
                    latest_launch: sxResp.data.name,
                    launch_success: sxResp.data.success,
                    astronomy_title: nasaResp.data.title,
                    astronomy_hdurl: nasaResp.data.hdurl
                },
                timestamp: Date.now(),
                confidence: 0.99
            };
        } catch (error: any) {
            return {
                source: 'Cosmos',
                data: { error: error.message },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }
}
