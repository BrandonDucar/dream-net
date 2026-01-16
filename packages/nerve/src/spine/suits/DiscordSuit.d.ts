import { SocialSuit } from './SocialSuit.js';
/**
 * 👾 DiscordSuit: The Biomech Skin for Community Interaction
 *
 * Capabilities:
 * - Listen to specific channels
 * - Broadcast messages (Announcements, Alpha)
 * - "Real Data" enforcement
 */
export declare class DiscordSuit implements SocialSuit {
    name: string;
    private client;
    private guildId;
    constructor();
    isOnline(): boolean;
    ignite(): Promise<void>;
    post(content: string | any): Promise<{
        success: boolean;
        url?: string;
        id?: string;
    }>;
    engage(targetId: string, action: 'like' | 'reply' | 'react', content?: string): Promise<boolean>;
    /**
     * 📡 Active Radar: Scan the channel for recent context.
     * @param query - Can be a channelID or "recent" (uses default)
     * @param limit - Number of messages to fetch (max 100 for Discord API)
     */
    scan(query?: string, limit?: number): Promise<any[]>;
    edit(id: string, content: string | any): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    interact(interactionId: string, action: string): Promise<boolean>;
}
//# sourceMappingURL=DiscordSuit.d.ts.map