import axios from 'axios';
export class WeatherSpike {
    name = 'WeatherSpike';
    type = 'environmental';
    // Default to New York, can be parameterized
    lat = 40.7128;
    lon = -74.0060;
    constructor(lat, lon) {
        if (lat)
            this.lat = lat;
        if (lon)
            this.lon = lon;
    }
    async fetch() {
        try {
            const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&current=temperature_2m,wind_speed_10m,weather_code`);
            return {
                source: 'open-meteo',
                data: response.data,
                timestamp: Date.now(),
                confidence: 0.98
            };
        }
        catch (error) {
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
//# sourceMappingURL=WeatherSpike.js.map