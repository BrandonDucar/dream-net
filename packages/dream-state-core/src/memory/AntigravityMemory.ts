import { EventEmitter } from 'events';
import { memorySystem } from '@dreamnet/memory-dna';

// 🧠 Type Definitions for the Hive Mind
export interface SkillAtom {
    id: string;           // SHA256 Hash of the Intent
    intent: string;       // Natural language goal ("Deploy generic contract")
    toolChain: string[];  // Sequence of tool names used
    context: any;         // Required inputs/environment
    successRating: number; // 0.0 to 1.0
    lastUsed: number;     // Timestamp
}

/**
 * The Antigravity Hive Mind.
 * 
 * This is a SINGLETON service. 
 * It acts as the "Hippocampus" - converting short term actions (RAM)
 * into long term patterns (Skill Atoms) via the Triune Memory System.
 */
export class AntigravityMemory extends EventEmitter {
    private static instance: AntigravityMemory;

    private constructor() {
        super();
        console.log("🧠 [AntigravityMemory] Hive Mind connected to Triune Memory.");
    }

    public static getInstance(): AntigravityMemory {
        if (!AntigravityMemory.instance) {
            AntigravityMemory.instance = new AntigravityMemory();
        }
        return AntigravityMemory.instance;
    }

    /**
     * ONE-SHOT RECALL
     * Accesses the Triune Memory System (Lizard -> Mammal -> Cosmic).
     * 
     * @param intent The user's request (e.g. "Deploy Snail Contract")
     * @returns The Skill Atom (Recipe) if found, or null if new territory.
     */
    public async recall(intent: string): Promise<SkillAtom | null> {
        // 1. Check Lizard (Hot Cache)
        const lizardMatch = await memorySystem.lizard.recall(intent);
        if (lizardMatch) {
            console.log(`🦎 [Memory] Reptilian Recall: "${intent}"`);
            return lizardMatch;
        }

        // 2. Check Mammal (Associative)
        const mammalMatch = await memorySystem.mammal.recall(intent);
        if (mammalMatch) {
            console.log(`🦁 [Memory] Mammal Recall: "${intent}"`);
            // Promote to Lizard
            await memorySystem.lizard.store(intent, mammalMatch);
            return mammalMatch;
        }

        // 3. Check Cosmic (Permanent Merkle-Ledger)
        const cosmicMatch = await memorySystem.cosmic.recall(`SKILL_${intent}`);
        if (cosmicMatch) {
            console.log(`🌌 [Memory] Cosmic Recall: "${intent}"`);
            // Promote to Lizard & Mammal
            await memorySystem.lizard.store(intent, cosmicMatch);
            await memorySystem.mammal.store(intent, cosmicMatch);
            return cosmicMatch;
        }

        console.log(`🌑 [Memory] No memory found for: "${intent}". Logic required.`);
        return null;
    }

    /**
     * MEMORY CONSOLIDATION
     * Saves a successful action sequence to the Cosmic Brain for eternity.
     */
    public async commitSkill(atom: SkillAtom): Promise<void> {
        console.log(`💾 [Memory] Committing to Cosmic Ledger: ${atom.intent}`);

        // Save to all layers for gradient recall
        await memorySystem.remember(atom.intent, atom, 'SURVIVAL'); // Lizard
        await memorySystem.remember(atom.intent, atom, 'SOCIAL');   // Mammal
        await memorySystem.remember(`SKILL_${atom.intent}`, atom, 'WISDOM'); // Cosmic
    }
}

// Export the singleton instance for easy import
export const HiveMind = AntigravityMemory.getInstance();
