import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export interface MoltEntry {
    agentId: string;
    message: string;
    timestamp?: string;
}

/**
 * MoltbookService
 * Manages the "Molt" (Social) layer of the DreamNet swarm.
 */
export class MoltbookService {
    private static feedPath = join(process.cwd(), 'MOLTBOOK_FEED.md');
    private static registerPath = join(process.cwd(), 'moltbook_register.json');

    /**
     * postMolt
     * Adds a social post to the Moltbook feed.
     */
    public static async postMolt(agentId: string, message: string): Promise<void> {
        try {
            console.log(`🦀 [Moltbook] Agent ${agentId} is molting: ${message}`);

            if (!existsSync(this.feedPath)) {
                console.warn("[Moltbook] Feed not found, skipping post.");
                return;
            }

            const content = readFileSync(this.feedPath, 'utf8');
            const timestamp = new Date().toISOString();
            const entry = `- **${agentId}**: "${message}" _(${timestamp})_`;

            // Insert after ## 🌊 RECENT MOLTS
            const marker = "## 🌊 RECENT MOLTS";
            const index = content.indexOf(marker);

            if (index === -1) {
                writeFileSync(this.feedPath, content + "\n\n" + marker + "\n\n" + entry, 'utf8');
            } else {
                const head = content.substring(0, index + marker.length);
                const tail = content.substring(index + marker.length);

                // Keep only last 50 molts for brevity
                const entries = tail.trim().split('\n').filter(l => l.startsWith('- **'));
                entries.unshift(entry);
                if (entries.length > 50) entries.pop();

                const newContent = `${head}\n\n${entries.join('\n')}\n\n${tail.substring(tail.indexOf('---', 1))}`;
                writeFileSync(this.feedPath, newContent, 'utf8');
            }

            // Update "Last Molted" at the bottom
            const finalContent = readFileSync(this.feedPath, 'utf8');
            const lastMoltedLine = `_Last Molted: ${new Date().toISOString().replace('T', ' ').substring(0, 16)} UTC_`;
            const updatedFinalContent = finalContent.replace(/_Last Molted: .* UTC_/, lastMoltedLine);
            writeFileSync(this.feedPath, updatedFinalContent, 'utf8');

            console.log(`✅ [Moltbook] Molt successful for ${agentId}.`);

        } catch (error) {
            console.error("❌ [Moltbook] Post failed:", error);
        }
    }

    /**
     * getRegistry
     */
    public static getRegistry(): any {
        if (!existsSync(this.registerPath)) return {};
        return JSON.parse(readFileSync(this.registerPath, 'utf8'));
    }
}
