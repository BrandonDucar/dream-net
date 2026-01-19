/**
 * DreamNet Sensory Spikes
 * 
 * The Sensory Cortex of DreamNet.
 * Responsible for ingesting real-world data and feeding it to the verticals.
 */

export interface SpikeResult {
    source: string;
    data: any;
    timestamp: number;
    confidence: number;
}

export interface SensorySpike {
    name: string;
    type: 'financial' | 'news' | 'scientific' | 'cultural' | 'environmental';
    fetch(): Promise<SpikeResult>;
}

// Export Spikes (to be implemented)
export * from './spikes/MetalsSpike.js';
export * from './spikes/CryptoSpike.js';
export * from './spikes/WeatherSpike.js';
export * from './spikes/ScienceSpike.js';
export * from './spikes/NewsSpike.js';
export * from './spikes/CultureSpike.js';
export * from './spikes/StockSpike.js';
export * from './spikes/AegisSpike.js';
export * from './spikes/NASASpike.js';
export * from './spikes/AgriSpike.js';
export * from './spikes/SatelliteSpike.js';
export * from './spikes/SentimentSpike.js';
export * from './spikes/GeopoliticalSpike.js';
export * from './spikes/OffensiveSpike.js';
export * from './spikes/DefensiveSpike.js';
export * from './spikes/CosmicSpike.js';
export * from './spikes/AnomalySpike.js';
export * from './spikes/NeynarSpike.js';
export * from './spikes/GrantSpike.js';
export * from './spikes/EarthquakeSpike.js';
export * from './spikes/GitHubTrendSpike.js';
export * from './spikes/RedditSpike.js';
export * from './spikes/SolarSpike.js';
export * from './spikes/UniversalSpike.js';
export * from './spikes/FlightSpike.js';
export * from './spikes/PickleIntelSpike.js';
export * from './spikes/GlobalSportHubSpike.js';
