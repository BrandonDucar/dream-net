import { SocialSuit } from './SocialSuit.js';
/**
 * 📸 InstagramSuit: The Biomech Skin for Visual Influence
 *
 * Capabilities:
 * - Photo/Reel posting
 * - Story observation
 * - "Real Data" enforcement
 */
export declare class InstagramSuit implements SocialSuit {
    name: string;
    private client;
    private username;
    constructor();
    isOnline(): boolean;
    ignite(): Promise<void>;
    post(content: Buffer): Promise<{
        success: boolean;
        url?: string;
        id?: string;
    }>;
    engage(targetId: string, action: 'like' | 'reply' | 'comment', content?: string): Promise<boolean>;
    scan(query?: string, limit?: number): Promise<any[]>;
}
//# sourceMappingURL=InstagramSuit.d.ts.map