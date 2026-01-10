import axios from 'axios';
export class ScienceSpike {
    name = 'ScienceSpike';
    type = 'scientific';
    apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    async fetch() {
        try {
            const apod = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${this.apiKey}`);
            // Near Earth Objects (Asteroids) - Real data for "Planetary Defense"
            const today = new Date().toISOString().split('T')[0];
            const neos = await axios.get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${this.apiKey}`);
            return {
                source: 'nasa-api',
                data: {
                    apod: apod.data,
                    wazardous_asteroids_count: neos.data.element_count,
                    near_earth_objects: neos.data.near_earth_objects[today].slice(0, 3)
                },
                timestamp: Date.now(),
                confidence: 0.99
            };
        }
        catch (error) {
            console.error('ScienceSpike Error:', error.message);
            return {
                source: 'nasa-api',
                data: { error: 'Failed to fetch generic scientific data' },
                timestamp: Date.now(),
                confidence: 3
            };
        }
    }
}
//# sourceMappingURL=ScienceSpike.js.map