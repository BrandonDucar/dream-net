
import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index.js';

export class SolarSpike implements SensorySpike {
    name = 'SolarSpike';
    type = 'environmental' as const;

    async fetch(): Promise<SpikeResult> {
        try {
            // NASA EPIC: Earth Polychromatic Imaging Camera (Blue Marble)
            // Shows daily imagery of earth.
            const response = await axios.get('https://epic.gsfc.nasa.gov/api/natural');
            const data = response.data;
            const latest = data[0]; // Most recent image

            // Approximate specific format for image URL
            const datePath = latest.date.split(' ')[0].replaceAll('-', '/');
            const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${datePath}/png/${latest.image}.png`;

            return {
                source: 'nasa-epic',
                data: {
                    caption: latest.caption,
                    centroid_coordinates: latest.centroid_coordinates,
                    image_url: imageUrl, // Visual of the planet RIGHT NOW (roughly)
                    sun_j2000_position: latest.sun_j2000_position
                },
                timestamp: Date.now(),
                confidence: 0.99
            };
        } catch (error: any) {
            console.error('SolarSpike Error:', error.message);
            return {
                source: 'nasa-epic',
                data: { error: 'Failed to acquire solar/planetary visual' },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }
}
