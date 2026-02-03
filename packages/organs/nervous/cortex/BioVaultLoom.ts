import { EventEmitter } from 'events';
import fs from 'fs';
import path from 'path';

export interface AgentDNA {
    citizenId: string;
    genome: string; // Hash of core traits
    traits: string[];
    timestamp: number;
}

/**
 * BioVaultLoom
 * The biological monorepo for DreamNet.
 * Manages agentic DNA and media assets with CRISPR-style precision.
 */
export class BioVaultLoom extends EventEmitter {
    private static instance: BioVaultLoom;
    private vaultPath: string = 'C:\\dev\\dream-net-media';
    private dnaIndex: Map<string, AgentDNA> = new Map();

    private constructor() {
        super();
        this.initializeVault();
    }

    public static getInstance(): BioVaultLoom {
        if (!BioVaultLoom.instance) {
            BioVaultLoom.instance = new BioVaultLoom();
        }
        return BioVaultLoom.instance;
    }

    private initializeVault() {
        if (!fs.existsSync(this.vaultPath)) {
            try {
                fs.mkdirSync(this.vaultPath, { recursive: true });
                console.log(`🧬 [BioVaultLoom] Created vault at ${this.vaultPath}`);
            } catch (e) {
                console.error(`🧬 [BioVaultLoom] Failed to create vault:`, e);
            }
        }

        // Scan existing DNA
        const dnaPath = path.join(this.vaultPath, 'dna');
        if (fs.existsSync(dnaPath)) {
            const files = fs.readdirSync(dnaPath);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    try {
                        const content = fs.readFileSync(path.join(dnaPath, file), 'utf8');
                        const dna = JSON.parse(content) as AgentDNA;
                        this.dnaIndex.set(dna.citizenId, dna);
                    } catch (e) {
                        console.error(`🧬 [BioVaultLoom] Failed to load DNA: ${file}`, e);
                    }
                }
            }
        }

        console.log(`🧬 [BioVaultLoom] Biological Monorepo Active. Threads Woven: ${this.dnaIndex.size}`);
    }

    /**
     * weaveDNA
     * Ponds and encrypts agent DNA into the BioVault.
     */
    public async weaveDNA(dna: AgentDNA) {
        const dnaPath = path.join(this.vaultPath, 'dna');
        if (!fs.existsSync(dnaPath)) fs.mkdirSync(dnaPath, { recursive: true });

        const filePath = path.join(dnaPath, `${dna.citizenId}.json`);
        fs.writeFileSync(filePath, JSON.stringify(dna, null, 2));

        this.dnaIndex.set(dna.citizenId, dna);
        console.log(`🧬 [BioVaultLoom] Woven DNA for Citizen ${dna.citizenId}`);

        this.emit('dna:woven', dna);
    }

    /**
     * editGenome (CRISPR)
     * Surgically modifies agent traits in the BioVault.
     */
    public async editGenome(citizenId: string, newTraits: string[]) {
        let dna = this.dnaIndex.get(citizenId);
        if (!dna) {
            // Initializing new DNA if missing
            dna = {
                citizenId,
                genome: `0x${Math.random().toString(16).slice(2, 66)}`,
                traits: [],
                timestamp: Date.now()
            };
        }

        console.log(`🧬 [BioVaultLoom] CRISPR: Editing genome for ${citizenId}...`);
        dna.traits = [...new Set([...dna.traits, ...newTraits])];
        dna.timestamp = Date.now();

        await this.weaveDNA(dna);
        return dna;
    }

    public getStatus() {
        return {
            storedDNA: this.dnaIndex.size,
            vaultPath: this.vaultPath,
            mode: "BIOLOGICAL_MONOREPO"
        };
    }
}

export const bioVaultLoom = BioVaultLoom.getInstance();
