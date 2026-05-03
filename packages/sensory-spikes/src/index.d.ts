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
    type: 'financial' | 'news' | 'scientific' | 'cultural' | 'environmental' | 'social' | 'humanitarian' | 'geopolitical';
    fetch(): Promise<SpikeResult>;
}
export * from './spikes/CryptoSpike.js';
export * from './spikes/NewsSpike.js';
export * from './spikes/WeatherSpike.js';
export * from './spikes/NASASpike.js';
export * from './spikes/SentimentSpike.js';
export * from './spikes/CosmicSpike.js';
export * from './spikes/AnomalySpike.js';
export * from './spikes/NeynarSpike.js';
export * from './spikes/PickleIntelSpike.js';
export * from './spikes/MemPalaceSpike.js';
export * from './spikes/ClawdChatSpike.js';
//# sourceMappingURL=index.d.ts.map