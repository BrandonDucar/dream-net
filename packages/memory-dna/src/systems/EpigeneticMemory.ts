/**
 * Epigenetic Memory System 🧬
 * Hijacked Wisdom: Epigenetics (Gene Expression/Methylation)
 * 
 * Philosophy: Environment changes expression. Trauma leaves a mark.
 * Mechanism: Tracks crash history per config. If a config is "cursed" (>3 crashes), it gets methylated (disabled).
 */
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.resolve(process.cwd(), './data/epigenetics.json');

interface Epigenome {
    [configHash: string]: {
        crashes: number;
        successes: number;
        methylated: boolean; // True if gene is silenced (disabled)
        lastTrauma: number;
    };
}

export class EpigeneticMemory {
    private genome: Epigenome = {};
    private quarantineThreshold = 5;
    private onTraumaListeners: Array<(hash: string, count: number) => void> = [];

    constructor() {
        this.load();
    }

    public subscribeToTrauma(listener: (hash: string, count: number) => void) {
        this.onTraumaListeners.push(listener);
    }

    /**
     * Log a successful run (demethylation)
     */
    public logSuccess(configHash: string) {
        if (!this.genome[configHash]) this.initGene(configHash);

        this.genome[configHash].successes++;
        // If it works enough, maybe we unmeythlate it? (Therapy)
        if (this.genome[configHash].successes > 100) {
            this.genome[configHash].methylated = false;
        }
        this.save();
    }

    /**
     * Log a crash (Trauma)
     */
    public logTrauma(configHash: string) {
        if (!this.genome[configHash]) this.initGene(configHash);

        this.genome[configHash].crashes++;
        this.genome[configHash].lastTrauma = Date.now();

        console.warn(`[🧬 Epigenetics] Trauma recorded for ${configHash}. Count: ${this.genome[configHash].crashes}`);

        // Notify listeners
        this.onTraumaListeners.forEach(l => l(configHash, this.genome[configHash].crashes));

        // The threshold for "Cursed" status (Quarantine)
        if (this.genome[configHash].crashes >= this.quarantineThreshold) {
            if (!this.genome[configHash].methylated) {
                this.genome[configHash].methylated = true;
                console.error(`[🧬 Epigenetics] Critical Threshold Reached. Config ${configHash} has been METHYLATED (Quarantined).`);
            }
        }
        this.save();
    }

    /**
     * Get all currently quarantined (methylated) trauma hashes
     */
    public getQuarantinedHashes(): string[] {
        return Object.entries(this.genome)
            .filter(([_, data]) => data.methylated)
            .map(([hash]) => hash);
    }

    /**
     * Check if a config is viable (expressed)
     */
    public isExpressible(configHash: string): boolean {
        if (!this.genome[configHash]) return true; // New genes are innocent
        if (this.genome[configHash].methylated) {
            console.warn(`[🧬 Epigenetics] Expression Blocked: Config ${configHash} is methylated due to past trauma.`);
            return false;
        }
        return true;
    }

    private initGene(hash: string) {
        this.genome[hash] = {
            crashes: 0,
            successes: 0,
            methylated: false,
            lastTrauma: 0
        };
    }

    private save() {
        try {
            const dir = path.dirname(DATA_PATH);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(DATA_PATH, JSON.stringify(this.genome, null, 2));
        } catch (e) {
            console.error(`[🧬 Epigenetics] Failed to save genome: ${e}`);
        }
    }

    private load() {
        try {
            if (fs.existsSync(DATA_PATH)) {
                this.genome = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
                console.log(`[🧬 Epigenetics] Genome loaded. ${Object.keys(this.genome).length} genes active.`);
            }
        } catch (e) {
            console.error(`[🧬 Epigenetics] Failed to load genome: ${e}`);
        }
    }

    public report() {
        return this.genome;
    }
}

export const epigenetics = new EpigeneticMemory();
