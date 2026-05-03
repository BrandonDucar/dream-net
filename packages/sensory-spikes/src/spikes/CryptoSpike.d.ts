import { type SensorySpike, type SpikeResult } from '../index.js';
/**
 * 🪙 CryptoSpike
 * Ingests real-time cryptocurrency data from CoinGecko or similar.
 * Feeds the 'Trading' and 'Whale' guilds.
 */
export declare class CryptoSpike implements SensorySpike {
    name: string;
    type: 'financial';
    fetch(): Promise<SpikeResult>;
}
export declare const cryptoSpike: CryptoSpike;
//# sourceMappingURL=CryptoSpike.d.ts.map