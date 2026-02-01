import { SocialSuit } from './SocialSuit.js';
/**
 * 🐦 XSuit: The Biomech Skin for Twitter/X
 *
 * Capabilities:
 * - Real-time posting & engagement via Twitter API v2
 * - Sentiment analysis via Limbic System
 * - "Real Data" enforcement (No mocks)
 */
export declare class XSuit implements SocialSuit {
    name: string;
    private client;
    private userId;
    private handle;
    constructor();
    isOnline(): boolean;
    ignite(): Promise<void>;
    post(content: string | Buffer | any): Promise<{
        success: boolean;
        url?: string;
        id?: string;
    }>;
    engage(targetId: string, action: 'like' | 'reply' | 'repost', content?: string): Promise<boolean>;
    scan(query?: string, limit?: number): Promise<any[]>;
    edit(id: string, content: any): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    interact(id: string, action: string): Promise<boolean>;
}
//# sourceMappingURL=XSuit.d.ts.map