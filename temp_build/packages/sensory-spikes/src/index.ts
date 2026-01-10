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
export * from './spikes/MetalsSpike';
export * from './spikes/CryptoSpike';
export * from './spikes/WeatherSpike';
export * from './spikes/ScienceSpike';
export * from './spikes/NewsSpike';
export * from './spikes/CultureSpike';
export * from './spikes/StockSpike';
