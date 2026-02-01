import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * THE ISO (Isomorphic Algorithm)
 * "Construction Git" - Invisible Version Control
 */
export class ConstructionGit {
    private historyPath: string;

    constructor(rootPath: string) {
        this.historyPath = path.join(rootPath, '.iso_history');
        if (!fs.existsSync(this.historyPath)) {
            fs.mkdirSync(this.historyPath, { recursive: true });
        }
    }

    /**
     * Snapshot a file: The "Identity Disc" of a file at a moment in time.
     */
    snapshot(filePath: string, context: string = 'system') {
        if (!fs.existsSync(filePath)) return null;

        const content = fs.readFileSync(filePath);
        const hash = crypto.createHash('sha256').update(content).digest('hex');
        const shortHash = hash.substring(0, 8);

        const discPath = path.join(this.historyPath, shortHash);

        // If this state hasn't been seen before, save it (Evolution)
        if (!fs.existsSync(discPath)) {
            fs.copyFileSync(filePath, discPath);
            this.recordEvent(filePath, shortHash, context);
            return shortHash;
        }
        return shortHash; // Evolution already recorded
    }

    private recordEvent(file: string, hash: string, who: string) {
        const logEntry = `[${new Date().toISOString()}] ${who} mutated ${path.basename(file)} -> ${hash}\n`;
        fs.appendFileSync(path.join(this.historyPath, 'iso.log'), logEntry);
    }
}
