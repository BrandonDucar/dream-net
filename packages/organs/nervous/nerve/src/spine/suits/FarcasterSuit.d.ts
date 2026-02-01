import { SocialSuit } from './SocialSuit.js';
/**
 * 🟣 FarcasterSuit: The Biomech Skin for Protocol Standards
 *
 * Capabilities:
 * - Casting via Neynar API
 * - Channel interactions (/dreamnet)
 * - "Real Data" enforcement
 */
export declare class FarcasterSuit implements SocialSuit {
    name: string;
    private apiKey;
    private signerUuid;
    constructor();
    isOnline(): boolean;
    ignite(): Promise<void>;
    post(content: string): Promise<{
        success: boolean;
        url?: string;
        id?: string;
    }>;
    engage(targetId: string, action: 'like' | 'reply' | 'repost' | 'comment', content?: string): Promise<boolean>;
    scan(query?: string, limit?: number): Promise<any[]>;
}
//# sourceMappingURL=FarcasterSuit.d.ts.map