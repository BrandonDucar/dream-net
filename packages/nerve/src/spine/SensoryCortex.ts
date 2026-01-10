import { MANIFOLD } from '@dreamnet/nerve';
import {
    CryptoSpike,
    MetalsSpike,
    StockSpike,
    AegisSpike,
    NASASpike,
    AgriSpike,
    SatelliteSpike,
    SentimentSpike,
    GeopoliticalSpike,
    OffensiveSpike,
    DefensiveSpike
} from '@dreamnet/sensory-spikes';

export interface SensorySnapshot {
    crypto: any;
    metals: any;
    stocks: any;
    aegis: any;
    sentiment: any;
    geopolitical: any;
    vacuum: {
        offensive: any;
        defensive: any;
        creative?: any;
    };
    planetary: {
        nasa: any;
        agri: any;
        satellite: any;
    };
    timestamp: number;
}

export class SensoryCortex {
    private static instance: SensoryCortex;
    private latestSnapshot: SensorySnapshot | null = null;

    private cryptoSpike = new CryptoSpike();
    private metalsSpike = new MetalsSpike();
    private stockSpike = new StockSpike();
    private aegisSpike = new AegisSpike();
    private nasaSpike = new NASASpike();
    private agriSpike = new AgriSpike();
    private satelliteSpike = new SatelliteSpike();
    private sentimentSpike = new SentimentSpike();
    private geopoliticalSpike = new GeopoliticalSpike();
    private offensiveSpike = new OffensiveSpike();
    private defensiveSpike = new DefensiveSpike();

    private constructor() {
        console.log('[🧠 SensoryCortex] Nerve-Integrated Cortex Awake.');
    }

    public static getInstance(): SensoryCortex {
        if (!SensoryCortex.instance) {
            SensoryCortex.instance = new SensoryCortex();
        }
        return SensoryCortex.instance;
    }

    public async pulse(): Promise<SensorySnapshot> {
        console.log('[⚡ SensoryCortex] Pulsing Nerve-Manifold Senses...');

        const [
            crypto, metals, stocks, aegis, nasa, agri, satellite,
            sentiment, geopolitical, offensive, defensive
        ] = await Promise.all([
            this.cryptoSpike.fetch(),
            this.metalsSpike.fetch(),
            this.stockSpike.fetch(),
            this.aegisSpike.fetch(),
            this.nasaSpike.fetch(),
            this.agriSpike.fetch(),
            this.satelliteSpike.fetch(),
            this.sentimentSpike.fetch(),
            this.geopoliticalSpike.fetch(),
            this.offensiveSpike.fetch(),
            this.defensiveSpike.fetch()
        ]);

        const snapshot: SensorySnapshot = {
            crypto: crypto.data,
            metals: metals.data,
            stocks: stocks.data,
            aegis: aegis.data,
            sentiment: sentiment.data,
            geopolitical: geopolitical.data,
            vacuum: {
                offensive: offensive.data,
                defensive: defensive.data
            },
            planetary: {
                nasa: nasa.data,
                agri: agri.data,
                satellite: satellite.data
            },
            timestamp: Date.now()
        };

        this.latestSnapshot = snapshot;

        // Propagate to Nerve Manifold
        await MANIFOLD.process({
            id: `sense-${Date.now()}`,
            channelId: 'SENSORY_INPUT',
            kind: 'SIGNAL_PULSE',
            priority: 2,
            context: { timestamp: new Date().toISOString() },
            payload: snapshot
        }).catch(e => console.warn('[SensoryCortex] Manifold sync error:', e.message));

        return snapshot;
    }

    public getLatestSnapshot(): SensorySnapshot | null {
        return this.latestSnapshot;
    }
}

export const cortex = SensoryCortex.getInstance();
