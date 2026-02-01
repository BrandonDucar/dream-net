import fetch from 'node-fetch';

/**
 * OpenMeteo Connector (The Atmospheric Spike)
 * Fetches real-time weather data to calibrate the System's "Mood".
 * Reports to: /api/ops/metrics
 */

const METRICS_ENDPOINT = 'http://localhost:3000/api/ops/metrics';
// Default: New York (The Empire State)
const EST_LAT = 40.7128;
const EST_LON = -74.0060;

export async function fetchWeatherPulse() {
    try {
        console.log("🌪️ OpenMeteo: Sensing Atmosphere...");
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${EST_LAT}&longitude=${EST_LON}&current_weather=true`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);

        const data = await res.json();
        const weather = data.current_weather;

        await reportMetric(`weather_temp`, weather.temperature, { unit: 'celsius', lat: EST_LAT });
        await reportMetric(`weather_wind`, weather.windspeed, { unit: 'kmh' });

        console.log(`   > Temp: ${weather.temperature}°C | Wind: ${weather.windspeed} km/h`);

    } catch (e: any) {
        console.error("⚠️ Weather Pulse Skipped:", e.message);
    }
}

async function reportMetric(name: string, value: number, tags: any) {
    try {
        await fetch(METRICS_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, value, tags })
        });
    } catch (e) {
        // Silent fail
    }
}

// Self-executing if run directly
if (process.argv[1].endsWith('weather.ts')) {
    fetchWeatherPulse();
}
