import { EventEmitter } from 'events';

export interface GnosisEntry {
    avenue: string;
    minds: string[];
    essence: string;
    timestamp: number;
}

/**
 * SageCortexService
 * The cognitive layer of DreamNet responsible for gnosis ingestion
 * and high-level strategic reasoning.
 */
export class SageCortexService extends EventEmitter {
    private static instance: SageCortexService;
    private gnosisVault: Map<string, GnosisEntry> = new Map();

    private constructor() {
        super();
        console.log("🧠 [SageCortex] Gnosis Layer Active. Awaiting ingestion...");
    }

    public static getInstance(): SageCortexService {
        if (!SageCortexService.instance) {
            SageCortexService.instance = new SageCortexService();
        }
        return SageCortexService.instance;
    }

    /**
     * ingestgnosis
     * Assimilates new knowledge into the cortex.
     */
    public async ingestGnosis(entry: GnosisEntry) {
        this.gnosisVault.set(entry.avenue, entry);
        console.log(`[🧠 GNOSIS] Ingested Avenue: ${entry.avenue} | Minds: ${entry.minds.join(', ')}`);

        const { dreamEventBus } = await import('../nerve/src/spine/dreamnet-event-bus/index.js');
        dreamEventBus.publish('SageCortex.GnosisIngested', { entry });

        this.emit('gnosis:assimilated', entry);
    }

    public getGnosis(avenue: string): GnosisEntry | undefined {
        return this.gnosisVault.get(avenue);
    }

    public listAvenues(): string[] {
        return Array.from(this.gnosisVault.keys());
    }
}

export const sageCortex = SageCortexService.getInstance();
