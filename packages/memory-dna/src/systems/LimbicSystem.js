/**
 * 🦁 LimbicSystem: The Emotional & Relational Core
 * Hijacked Wisdom: Affective Computing / Social Graph Theory
 *
 * Philosophy: Logic is cold; relationships are warm.
 * Mechanism: Manages 'Valence' (-1.0 to 1.0) for every entity.
 */
import fs from 'fs';
import path from 'path';
const LIMBIC_DATA_PATH = path.resolve(process.cwd(), './data/limbic_valence.json');
export class LimbicSystem {
    entities = new Map();
    constructor() {
        this.load();
    }
    /**
     * Nurture a relationship (Increase Trust)
     */
    nurture(id, amount = 0.05) {
        const entity = this.getOrCreateEntity(id);
        entity.valence = Math.min(1.0, entity.valence + amount);
        entity.interactionCount++;
        entity.lastInteraction = Date.now();
        this.save();
        console.log(`[🦁 Limbic] Nurtured ${id}. New Valence: ${entity.valence.toFixed(2)}`);
    }
    /**
     * Traumatize a relationship (Decrease Trust)
     */
    traumatize(id, amount = 0.1) {
        const entity = this.getOrCreateEntity(id);
        entity.valence = Math.max(-1.0, entity.valence - amount);
        entity.interactionCount++;
        entity.lastInteraction = Date.now();
        this.save();
        console.warn(`[🦁 Limbic] Traumatized ${id}. New Valence: ${entity.valence.toFixed(2)}`);
    }
    /**
     * Get the current valence of an entity
     */
    getValence(id) {
        return this.entities.get(id)?.valence ?? 0.0; // Neutral default
    }
    /**
     * Get the full identity profile
     */
    getProfile(id) {
        return this.getOrCreateEntity(id);
    }
    getOrCreateEntity(id) {
        if (!this.entities.has(id)) {
            const newEntity = {
                id,
                type: 'AGENT', // Default, should be updated on first real use
                valence: 0.0,
                interactionCount: 0,
                lastInteraction: Date.now(),
                traits: []
            };
            this.entities.set(id, newEntity);
        }
        return this.entities.get(id);
    }
    save() {
        try {
            const dir = path.dirname(LIMBIC_DATA_PATH);
            if (!fs.existsSync(dir))
                fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(LIMBIC_DATA_PATH, JSON.stringify(Object.fromEntries(this.entities), null, 2));
        }
        catch (e) {
            console.error(`[🦁 Limbic] Failed to save valence data: ${e}`);
        }
    }
    load() {
        try {
            if (fs.existsSync(LIMBIC_DATA_PATH)) {
                const data = JSON.parse(fs.readFileSync(LIMBIC_DATA_PATH, 'utf-8'));
                Object.entries(data).forEach(([id, entity]) => {
                    this.entities.set(id, entity);
                });
                console.log(`[🦁 Limbic] Social Graph loaded. ${this.entities.size} entities recognized.`);
            }
        }
        catch (e) {
            console.error(`[🦁 Limbic] Failed to load social graph: ${e}`);
        }
    }
}
export const limbicSystem = new LimbicSystem();
