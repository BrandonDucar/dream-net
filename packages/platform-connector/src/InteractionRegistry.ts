import fs from 'fs';
import path from 'path';

/**
 * 📝 InteractionRegistry
 * Prevents redundant interactions (likes, replies) by tracking cast hashes.
 */
export class InteractionRegistry {
    private registryPath: string;
    private interactions: Set<string> = new Set();

    constructor() {
        // Store in a local JSON file for persistence
        this.registryPath = path.join(process.cwd(), 'interaction_history.json');
        this.load();
    }

    private load() {
        if (fs.existsSync(this.registryPath)) {
            try {
                const data = JSON.parse(fs.readFileSync(this.registryPath, 'utf8'));
                this.interactions = new Set(data);
            } catch (e) {
                console.error("❌ [InteractionRegistry] Failed to load history:", e);
            }
        }
    }

    private save() {
        try {
            fs.writeFileSync(this.registryPath, JSON.stringify([...this.interactions]));
        } catch (e) {
            console.error("❌ [InteractionRegistry] Failed to save history:", e);
        }
    }

    /**
     * Checks if we have already interacted with this content for a specific action.
     * key format: "agentId:action:castHash"
     */
    public hasInteracted(agentId: string, action: string, castHash: string): boolean {
        return this.interactions.has(`${agentId}:${action}:${castHash}`);
    }

    /**
     * Records an interaction.
     */
    public recordInteraction(agentId: string, action: string, castHash: string) {
        this.interactions.add(`${agentId}:${action}:${castHash}`);
        this.save();
    }
}

export const interactionRegistry = new InteractionRegistry();
