import { SocialSuit } from './SocialSuit.js';
/**
 * 🎵 TikTokSuit: The Biomech Skin for Viral Video
 *
 * Capabilities:
 * - Video posting (Buffer/Stream)
 * - Trend scanning
 * - "Real Data" enforcement
 */
export declare class TikTokSuit implements SocialSuit {
    name: string;
    private client;
    private creatorId;
    constructor();
    isOnline(): boolean;
    ignite(): Promise<void>;
    post(content: string | Buffer | any): Promise<{
        success: boolean;
        url?: string;
        id?: string;
    }>;
    engage(targetId: string, action: 'like' | 'reply' | 'repost' | 'comment', content?: string): Promise<boolean>;
    scan(query?: string, limit?: number): Promise<any[]>;
}
//# sourceMappingURL=TikTokSuit.d.ts.map