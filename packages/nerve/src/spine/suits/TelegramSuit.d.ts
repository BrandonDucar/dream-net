import { SocialSuit } from './SocialSuit.js';
/**
 * ✈️ TelegramSuit: The Biomech Skin for Hyper-Fast Messaging
 *
 * Capabilities:
 * - Listen to DMs and Groups
 * - Broadcast alerts
 * - /command handling
 */
export declare class TelegramSuit implements SocialSuit {
    name: string;
    private bot;
    constructor();
    isOnline(): boolean;
    ignite(): Promise<void>;
    post(content: string | any): Promise<{
        success: boolean;
        url?: string;
        id?: string;
    }>;
    engage(targetId: string, action: 'like' | 'reply' | 'react', content?: string): Promise<boolean>;
    private memoryBuffer;
    private readonly BUFFER_SIZE;
    /**
     * 📡 Active Radar: Return recent context from local buffer.
     * Telegram Bot API does not support fetching history, so we rely on our observed stream.
     */
    scan(query?: string, limit?: number): Promise<any[]>;
    edit(id: string, content: string | any): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    interact(interactionId: string, action: string): Promise<boolean>;
}
//# sourceMappingURL=TelegramSuit.d.ts.map