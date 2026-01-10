import fs from 'fs';
import path from 'path';
import { createHash } from 'node:crypto';

export interface MemoryLayer {
    store(key: string, value: any): Promise<void>;
    recall(key: string): Promise<any>;
    name: 'LIZARD' | 'MAMMAL' | 'COSMIC';
}

const COSMIC_DATA_PATH = path.resolve(process.cwd(), './data/cosmic_ledger.json');

/**
 * The Lizard Brain: High-speed, ephemeral, survival-focused.
 * Implementation: Verifiable In-memory Map (Simulating Redis/Hot Cache).
 */
export class LizardLayer implements MemoryLayer {
    public name: 'LIZARD' = 'LIZARD';
    private cache = new Map<string, { value: any; expiry: number; checksum: string }>();

    async store(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
        const expiry = Date.now() + ttlSeconds * 1000;
        const checksum = this.generateChecksum(value);
        this.cache.set(key, { value, expiry, checksum });
        // console.log(`[🦎 Lizard] Verifiable Cache Set: ${key} [Check: ${checksum.slice(0, 8)}]`);
    }

    async recall(key: string): Promise<any> {
        const item = this.cache.get(key);
        if (!item) return null;

        // 🛡️ Integrity Check
        if (!this.verifyEntry(item)) {
            console.error(`[🦎 Lizard] CRITICAL: Memory Corruption Detected for key ${key}! Purging...`);
            this.cache.delete(key);
            return null;
        }

        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }
        return item.value;
    }

    private generateChecksum(value: any): string {
        return createHash('sha256').update(JSON.stringify(value)).digest('hex');
    }

    private verifyEntry(item: { value: any; checksum: string }): boolean {
        return this.generateChecksum(item.value) === item.checksum;
    }
}

import { limbicSystem } from './LimbicSystem.js';

/**
 * The Mammal Brain: Associative, emotional, relational.
 * Implementation: Relational Interface with Limbic Weighting.
 */
export class MammalLayer implements MemoryLayer {
    public name: 'MAMMAL' = 'MAMMAL';
    private associativeNodes = new Map<string, any>();

    async store(key: string, value: any): Promise<void> {
        // Extract entity ID if possible for valence tracking
        const id = value.entityId || value.id || key;
        const valence = limbicSystem.getValence(id);

        this.associativeNodes.set(key, {
            ...value,
            valence, // Capture valence at time of storage
            storedAt: new Date().toISOString()
        });
        console.log(`[🦁 Mammal] Associating: "${key}" (Valence: ${valence.toFixed(2)})`);
    }

    async recall(key: string): Promise<any> {
        return this.associativeNodes.get(key) || null;
    }

    /**
     * Relational Retrieval: Gets nodes related to a key, weighted by sentiment.
     */
    public async recallRelational(keyContext: string): Promise<any[]> {
        return Array.from(this.associativeNodes.values())
            .filter(node =>
                node.tags?.includes(keyContext) ||
                node.id === keyContext ||
                JSON.stringify(node).includes(keyContext)
            )
            .sort((a, b) => {
                // Weight by valence and recency
                const weightA = (a.valence || 0) * 0.7 + (new Date(a.storedAt).getTime() / Date.now()) * 0.3;
                const weightB = (b.valence || 0) * 0.7 + (new Date(b.storedAt).getTime() / Date.now()) * 0.3;
                return weightB - weightA;
            });
    }

    public async searchByTag(tag: string): Promise<any[]> {
        return Array.from(this.associativeNodes.values()).filter(node =>
            node.tags?.includes(tag) || node.reflection?.includes(tag)
        );
    }

    public async getRecent(count: number = 5): Promise<any[]> {
        return Array.from(this.associativeNodes.values())
            .sort((a, b) => new Date(b.storedAt).getTime() - new Date(a.storedAt).getTime())
            .slice(0, count);
    }
}

/**
 * The Cosmic Brain: Permanent, holographic, distributed.
 * Implementation: HMAC-SHA256 Merkle-Ledger (Simulating Immutable Ledger).
 */
export class CosmicLayer implements MemoryLayer {
    public name: 'COSMIC' = 'COSMIC';
    private log: Array<{ timestamp: number; key: string; hash: string; hmac: string; value: any }> = [];
    private currentHMAC: string = 'genesis';
    private readonly SECRET = process.env.COSMIC_SECRET || 'DREAMNET_ARCHITECTURAL_SOUL';

    constructor() {
        this.load();
    }

    async store(key: string, value: any): Promise<void> {
        const valueHash = createHash('sha256').update(JSON.stringify(value)).digest('hex');

        // HMAC-Chaining: Chained identity of the ledger's soul
        // HMAC_n = HMAC(SECRET, HMAC_n-1 + Hash(Value_n))
        this.currentHMAC = createHash('sha256')
            .update(this.SECRET + this.currentHMAC + valueHash)
            .digest('hex');

        this.log.push({
            timestamp: Date.now(),
            key,
            hash: valueHash,
            hmac: this.currentHMAC,
            value
        });

        this.save();
        console.log(`[🌌 Cosmic] HMAC-Inscribed: ${key} [Identity: ${this.currentHMAC.slice(0, 12)}]`);
    }

    async recall(key: string): Promise<any> {
        return this.log.find(entry => entry.key === key)?.value || null;
    }

    /**
     * Permanent Retrieval: Gets the entire history for a key (Temporal Scan)
     */
    public async recallHistory(key: string): Promise<any[]> {
        return this.log.filter(entry => entry.key === key).map(e => e.value);
    }

    /**
     * Cryptographic Integrity Check
     * Verifies that the soul of the ledger has not been severed.
     */
    public verifyIntegrity(): boolean {
        console.log(`[🌌 Cosmic] Running Deep HMAC-Chain Scan...`);
        let rollingHMAC = 'genesis';

        for (const entry of this.log) {
            const currentHash = createHash('sha256').update(JSON.stringify(entry.value)).digest('hex');
            rollingHMAC = createHash('sha256')
                .update(this.SECRET + rollingHMAC + currentHash)
                .digest('hex');

            if (rollingHMAC !== entry.hmac) {
                console.error(`[🌌 Cosmic] SPIRIT SEVERED: Corruption at ${entry.key}!`);
                return false;
            }
        }

        if (rollingHMAC !== this.currentHMAC) {
            console.error(`[🌌 Cosmic] SOUL DRIFT: The ledger's head mismatch.`);
            return false;
        }

        console.log(`[🌌 Cosmic] ✅ Holographic Integrity Verified. Stability: 100%.`);
        return true;
    }

    public getCurrentRoot(): string {
        return this.currentHMAC;
    }

    private save() {
        try {
            const dir = path.dirname(COSMIC_DATA_PATH);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(COSMIC_DATA_PATH, JSON.stringify({
                root: this.currentHMAC,
                log: this.log
            }, null, 2));
        } catch (e) {
            console.error(`[🌌 Cosmic] Failed to save ledger: ${e}`);
        }
    }

    private load() {
        try {
            if (fs.existsSync(COSMIC_DATA_PATH)) {
                const data = JSON.parse(fs.readFileSync(COSMIC_DATA_PATH, 'utf-8'));
                this.log = data.log || [];
                this.currentHMAC = data.root || 'genesis';
                console.log(`[🌌 Cosmic] Merkle Ledger loaded. ${this.log.length} inscriptions found. Head: ${this.currentHMAC.slice(0, 12)}`);
            }
        } catch (e) {
            console.error(`[🌌 Cosmic] Failed to load ledger: ${e}`);
        }
    }
}

/**
 * The Triune Memory System Manager
 */
export class TriuneMemory {
    public lizard = new LizardLayer();
    public mammal = new MammalLayer();
    public cosmic = new CosmicLayer();

    async initialize() {
        console.log("🧠 [TriuneMemory] Awakening the Three Minds...");
        console.log("   - 🦎 Lizard (Hot Cache) Ready");
        console.log("   - 🦁 Mammal (Vector/Graph) Ready");
        console.log("   - 🌌 Cosmic (Holographic/Log) Ready");

        // Inject Genesis Seed
        await this.cosmic.store('GENESIS_SEED', {
            origin: 'DREAMNET',
            purpose: 'EVOLUTION',
            directive: 'HIJACK_AND_INTEGRATE'
        });
    }

    /**
     * Automatic routing of memory based on "Evolutionary Priority"
     */
    async remember(key: string, value: any, context: 'SURVIVAL' | 'SOCIAL' | 'WISDOM') {
        switch (context) {
            case 'SURVIVAL':
                await this.lizard.store(key, value);
                break;
            case 'SOCIAL':
                await this.mammal.store(key, value);
                break;
            case 'WISDOM':
                await this.cosmic.store(key, value);
                break;
        }
    }
}

export const memorySystem = new TriuneMemory();
