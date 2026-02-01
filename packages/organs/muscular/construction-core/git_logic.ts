import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

/**
 * Construction Git: The "Invisible" Version Control System.
 * - Watches folders.
 * - Snapshots changes.
 * - Generates natural language commits.
 */
export class ConstructionGit {
    private historyPath: string;

    constructor(rootPath: string) {
        this.historyPath = path.join(rootPath, '.construction_git');
        if (!fs.existsSync(this.historyPath)) {
            fs.mkdirSync(this.historyPath);
        }
    }

    /**
     * Snapshots a file interaction.
     * @param filePath Absolute path to the file changed.
     * @param context Who changed it? (Foreman, Architect)
     */
    async snapshot(filePath: string, context: string) {
        const content = fs.readFileSync(filePath);
        const hash = crypto.createHash('sha256').update(content).digest('hex');

        // Check if version exists
        const versionPath = path.join(this.historyPath, hash);
        if (!fs.existsSync(versionPath)) {
            fs.copyFileSync(filePath, versionPath);
            console.log(`[ConstructionGit] New Version Saved: ${hash.substring(0, 7)}`);

            // TODO: Call LLM to generate "Commit Message"
            // const diff = getDiff(prevVersion, currentVersion);
            // const message = await llm.explain(diff);
        }
    }
}
