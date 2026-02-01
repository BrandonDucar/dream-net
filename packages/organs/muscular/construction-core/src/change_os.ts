import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { BioEvent, BioProvider, Homeostasis, BioSignalType } from "@dreamnet/dreamnet-os-core";

/**
 * THE CHANGE OS (The "Disc" Logic)
 * 
 * "Builds fail at boundaries."
 * This system manages the boundaries via Change Objects.
 */

export interface ChangeObject extends BioEvent {
    // id, timestamp, confidence inherited from BioEvent
    // organ = "JobSite"
    // signal = Delta
    actor: {
        id: string;         // "Foreman", "System", "FileWatcher"
        role: string;       // "Field", "Owner"
    };
    delta: {
        scope: string;      // "Electrical Rough-in"
        type: 'add' | 'remove' | 'modify' | 'conflict';
        description: string; // "Added 12% scope to Level 2"
    };
    impact: string[];       // ["Schedule", "Cost", "Drywall"]
}



export class ChangeOS implements BioProvider {
    private dbPath: string;

    constructor(rootPath: string) {
        this.dbPath = path.join(rootPath, '.change_os');
        if (!fs.existsSync(this.dbPath)) {
            fs.mkdirSync(this.dbPath, { recursive: true });
        }
    }

    getSnapshot(): Homeostasis {
        const changes = this.loadAll();
        if (changes.length === 0) return { health: 100, stability: 1.0, mode: 'GROWTH' };

        const avgConfidence = changes.reduce((acc, c) => acc + c.confidence, 0) / changes.length;
        // Construction health is inverse to unmitigated conflict
        const conflictCount = changes.filter(c => c.delta.type === 'conflict').length;
        const health = Math.max(0, 100 - (conflictCount * 10));

        let mode: Homeostasis['mode'] = 'GROWTH';
        if (health < 70) mode = 'RECOVERY';
        if (avgConfidence < 0.6) mode = 'DEFENSE';

        return {
            health,
            stability: avgConfidence,
            mode
        };
    }

    async *stream(): AsyncGenerator<BioEvent> {
        // Placeholder for async stream
        yield* [];
    }

    /**
     * Input Compressor: Ingests raw reality -> Creates Change Object
     */
    createChange(
        actorId: string,
        role: string,
        description: string,
        confidence: number = 0.5
    ): ChangeObject {
        const id = crypto.randomUUID();
        const delta = {
            scope: 'Unknown',
            type: 'modify' as const,
            description
        };

        const change: ChangeObject = {
            // BioEvent fields
            id,
            timestamp: Date.now(),
            organ: 'JobSite',
            type: 'DELTA',
            source: 'ChangeOS',
            signal: delta,
            confidence,
            entropy: 1 - confidence, // Low confidence = High entropy

            // Extended fields
            actor: { id: actorId, role },
            delta,
            impact: []
        };

        this.save(change);
        this.broadcast(change);
        return change;
    }

    /**
     * Output Amplifier: Delta-First View
     */
    getDeltasSince(timestamp: number): ChangeObject[] {
        // Mock retrieval logic
        return this.loadAll().filter(c => c.timestamp > timestamp);
    }

    /**
     * Human Calibration: "Does this feel right?"
     */
    adjustConfidence(id: string, delta: number, reason: string) {
        const file = path.join(this.dbPath, `${id}.json`);
        if (fs.existsSync(file)) {
            const change = JSON.parse(fs.readFileSync(file, 'utf-8')) as ChangeObject;
            change.confidence = Math.max(0, Math.min(1, change.confidence + delta));
            console.log(`[ChangeOS] ⚖️ Calibration: ${id} adjusted by ${delta} (${reason})`);
            this.save(change);
        }
    }

    /**
     * Asymmetric Insight: "One Truth, Many Lenses"
     */
    getView(role: 'owner' | 'pm' | 'field'): ChangeObject[] {
        const changes = this.loadAll();
        return changes.map(c => {
            // Field sees immediate physical changes
            if (role === 'field' && c.confidence < 0.8) return null;
            // Owner only sees high impact risks
            if (role === 'owner' && !c.impact.includes('Critical')) return null;
            // PM sees everything (The Lever)
            return c;
        }).filter(Boolean) as ChangeObject[];
    }

    private save(change: ChangeObject) {
        const file = path.join(this.dbPath, `${change.id}.json`);
        fs.writeFileSync(file, JSON.stringify(change, null, 2));
    }

    private loadAll(): ChangeObject[] {
        return fs.readdirSync(this.dbPath)
            .filter(f => f.endsWith('.json'))
            .map(f => JSON.parse(fs.readFileSync(path.join(this.dbPath, f), 'utf-8')));
    }

    private broadcast(change: ChangeObject) {
        console.log(`[ChangeOS] 📡 New Reality: ${change.delta.description} (Conf: ${change.confidence})`);
        // TODO: Trigger Impact Graph
    }
}
